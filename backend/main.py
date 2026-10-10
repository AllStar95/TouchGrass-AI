import os
import time
import json
import re
from typing import List, Optional, Literal
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import httpx
from dotenv import load_dotenv

load_dotenv()

# Configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
GEMMA_MODEL = os.getenv("GEMMA_MODEL", "gemma2:2b")
OLLAMA_TIMEOUT_SECONDS = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "60.0"))

app = FastAPI(
    title="TouchGrass AI Backend",
    description="Connects TouchGrass AI frontend to Google's Gemma model running locally via Ollama.",
    version="1.0.0",
)

# CORS configuration - allows local React development servers
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request & Response Schemas
class MissionRequest(BaseModel):
    mood: Literal["relaxed", "curious", "energetic"] = Field(
        ..., description="The user's mood: relaxed, curious, or energetic"
    )
    duration_minutes: Literal[10, 20, 30] = Field(
        ..., description="Available outdoor time in minutes: 10, 20, or 30"
    )
    environment: Optional[Literal["any", "park", "backyard", "neighborhood"]] = Field(
        default="any",
        description="Optional preferred setting: any, park, backyard, or neighborhood"
    )


class MissionResponse(BaseModel):
    title: str = Field(..., description="Short, inspiring title for the outdoor mission")
    mood: str = Field(..., description="The selected mood")
    duration_minutes: int = Field(..., description="Duration in minutes")
    instructions: List[str] = Field(..., description="Actionable step-by-step outdoor instructions")
    safety_tip: str = Field(..., description="Brief, sensible outdoor safety tip")
    sensory_focus: Optional[str] = Field(None, description="Mindful cue to focus hearing, sight, or touch")
    model_used: str = Field(..., description="The actual Gemma model used for inference")
    generation_time_ms: int = Field(..., description="Time taken for local generation in milliseconds")


class HealthStatus(BaseModel):
    status: str
    ollama_connected: bool
    ollama_url: str
    configured_model: str
    model_installed: bool
    available_models: List[str]
    message: str


def clean_and_extract_json(text: str) -> dict:
    """
    Robustly extracts and parses a JSON object from Gemma's output,
    handling markdown fences (```json ... ```), preamble commentary, or raw JSON.
    """
    # 1. Try markdown code block extraction
    code_block_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if code_block_match:
        try:
            return json.loads(code_block_match.group(1))
        except json.JSONDecodeError:
            pass

    # 2. Try outermost curly braces
    outer_json_match = re.search(r"(\{.*\})", text, re.DOTALL)
    if outer_json_match:
        try:
            return json.loads(outer_json_match.group(1))
        except json.JSONDecodeError:
            pass

    # 3. Direct JSON parse
    return json.loads(text.strip())


@app.get("/")
def read_root():
    return {
        "app": "TouchGrass AI",
        "description": "Screen detox outdoor mission generator powered by Google's Gemma model via Ollama",
        "docs": "/docs",
        "health": "/api/health"
    }


@app.get("/api/health", response_model=HealthStatus)
async def check_health():
    """
    Checks if Ollama is running locally and verifies whether the specified Gemma model is installed.
    """
    ollama_connected = False
    model_installed = False
    available_models: List[str] = []
    message = ""

    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(f"{OLLAMA_BASE_URL}/api/tags")
            if resp.status_code == 200:
                ollama_connected = True
                data = resp.json()
                models = data.get("models", [])
                available_models = [m.get("name") for m in models if "name" in m]

                # Check if configured Gemma model (or tag prefix) exists
                # e.g., 'gemma2:2b' or 'gemma2:2b-instruct' or 'gemma2:latest'
                target = GEMMA_MODEL.lower()
                for name in available_models:
                    name_lower = name.lower()
                    if name_lower == target or name_lower.startswith(f"{target}:") or target.startswith(f"{name_lower}:"):
                        model_installed = True
                        break
                    # Also match base name like 'gemma2' if user has 'gemma2:2b'
                    if target.split(":")[0] in name_lower:
                        model_installed = True
                        break

                if model_installed:
                    message = f"Ollama is connected and '{GEMMA_MODEL}' is ready for genuine local inference."
                else:
                    message = (
                        f"Ollama is running, but model '{GEMMA_MODEL}' is not pulled yet. "
                        f"Run in PowerShell: `ollama pull {GEMMA_MODEL}`."
                    )
            else:
                message = f"Ollama responded with HTTP {resp.status_code}."
    except httpx.ConnectError:
        message = (
            f"Cannot connect to Ollama at {OLLAMA_BASE_URL}. "
            f"Please ensure Ollama is installed and running (`ollama serve`)."
        )
    except Exception as e:
        message = f"Ollama connection check error: {str(e)}"

    return HealthStatus(
        status="ok" if (ollama_connected and model_installed) else "attention_needed",
        ollama_connected=ollama_connected,
        ollama_url=OLLAMA_BASE_URL,
        configured_model=GEMMA_MODEL,
        model_installed=model_installed,
        available_models=available_models,
        message=message
    )


@app.post("/api/generate-mission", response_model=MissionResponse)
async def generate_mission(request: MissionRequest):
    """
    Generates a personalized outdoor activity using genuine inference from Google's Gemma model via Ollama.
    Never uses fake or hardcoded mission mocks.
    """
    start_time = time.perf_counter()

    # Crafting system and user prompt optimized for Gemma 2's instruction capabilities
    mood_descriptions = {
        "relaxed": "calm, sensory-rich, gentle observing, unwinding, and peaceful pacing",
        "curious": "scavenger hunt, discovery, seeking patterns, micro-exploring, inspecting textures or wildlife",
        "energetic": "brisk walking, movement, elevation changes, active exploration, dynamic breathing"
    }

    env_note = ""
    if request.environment and request.environment != "any":
        env_note = f"The user is specifically heading to their {request.environment}."

    system_prompt = (
        "You are TouchGrass AI, an encouraging and mindful outdoor companion powered by Google's Gemma model. "
        "Your mission is to get people away from digital screens and into the natural outdoor world. "
        "You create creative, grounded, safe, and sensory-focused outdoor missions tailored to the user's mood and available time.\n"
        "RULES:\n"
        "1. Focus entirely on physical outdoor interaction (observing trees, clouds, textures, sounds, walking, fresh air).\n"
        "2. Do NOT suggest using smartphones, apps, cameras, or screens during the mission.\n"
        "3. Provide realistic steps achievable strictly within the given minutes.\n"
        "4. Include a concise, sensible outdoor safety tip (e.g. hydration, uneven terrain, visible pathways, weather awareness).\n"
        "5. Output MUST be valid JSON only. Do not output conversational preamble or explanations outside the JSON."
    )

    user_prompt = f"""Generate an outdoor screen-detox mission with these parameters:
- Mood: {request.mood.capitalize()} ({mood_descriptions.get(request.mood, 'positive engagement')})
- Duration: {request.duration_minutes} minutes
{env_note}

You must return a single JSON object with EXACTLY the following structure:
{{
  "title": "Creative, catchy mission title",
  "instructions": [
    "Step 1 actionable outdoor instruction",
    "Step 2 actionable outdoor instruction",
    "Step 3 actionable outdoor instruction"
  ],
  "safety_tip": "Short sensible safety recommendation",
  "sensory_focus": "Specific sound, texture, or sight to pay mindful attention to"
}}
"""

    ollama_payload = {
        "model": GEMMA_MODEL,
        "prompt": f"{system_prompt}\n\nUser Request:\n{user_prompt}\n\nRespond with valid JSON only:",
        "stream": False,
        "format": "json",
        "options": {
            "temperature": 0.75,
            "top_p": 0.9,
        }
    }

    try:
        async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT_SECONDS) as client:
            ollama_response = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json=ollama_payload
            )

        if ollama_response.status_code == 404:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={
                    "error": "MODEL_NOT_FOUND",
                    "model": GEMMA_MODEL,
                    "message": f"Model '{GEMMA_MODEL}' is not found in your local Ollama installation.",
                    "command": f"ollama pull {GEMMA_MODEL}"
                }
            )

        if ollama_response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail={
                    "error": "OLLAMA_ERROR",
                    "status_code": ollama_response.status_code,
                    "message": f"Ollama returned error: {ollama_response.text}"
                }
            )

        data = ollama_response.json()
        raw_response = data.get("response", "")

        if not raw_response:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail={"error": "EMPTY_RESPONSE", "message": "Ollama returned an empty response."}
            )

        try:
            parsed = clean_and_extract_json(raw_response)
        except Exception as json_err:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail={
                    "error": "JSON_PARSE_ERROR",
                    "raw_text": raw_response,
                    "message": f"Failed to parse Gemma output as JSON: {str(json_err)}"
                }
            )

        # Normalize instructions to list of strings
        raw_instructions = parsed.get("instructions", [])
        if isinstance(raw_instructions, str):
            instructions = [line.strip("-• *") for line in raw_instructions.split("\n") if line.strip()]
        elif isinstance(raw_instructions, list):
            instructions = [str(item).strip() for item in raw_instructions if str(item).strip()]
        else:
            instructions = ["Step outside into fresh air and take five deep breaths."]

        if not instructions:
            instructions = ["Step outside into fresh air and observe your surroundings."]

        title = str(parsed.get("title", f"{request.mood.capitalize()} Outdoor Pause")).strip()
        safety_tip = str(parsed.get("safety_tip", "Stay on visible pathways and remain mindful of your surroundings.")).strip()
        sensory_focus = parsed.get("sensory_focus")
        if sensory_focus:
            sensory_focus = str(sensory_focus).strip()

        latency_ms = int((time.perf_counter() - start_time) * 1000)

        return MissionResponse(
            title=title,
            mood=request.mood,
            duration_minutes=request.duration_minutes,
            instructions=instructions,
            safety_tip=safety_tip,
            sensory_focus=sensory_focus,
            model_used=GEMMA_MODEL,
            generation_time_ms=latency_ms
        )

    except httpx.ConnectError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "OLLAMA_UNREACHABLE",
                "message": (
                    f"Cannot reach Ollama at {OLLAMA_BASE_URL}. "
                    "Make sure Ollama is installed and running (`ollama serve`)."
                ),
                "url": OLLAMA_BASE_URL
            }
        )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail={
                "error": "GENERATION_TIMEOUT",
                "message": (
                    f"Gemma model generation timed out after {OLLAMA_TIMEOUT_SECONDS}s. "
                    "Consider using 'gemma2:2b' or increasing OLLAMA_TIMEOUT_SECONDS in backend/.env."
                )
            }
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"Starting TouchGrass AI Backend on http://{host}:{port} with model {GEMMA_MODEL}...")
    uvicorn.run("main:app", host=host, port=port, reload=True)
