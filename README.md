# 🌱 TouchGrass AI

> **Hacktoberfest 2026 Week 1 "Touch Grass" Challenge Entry**  
> Challenge prompt: [https://dev.to/challenges/hacktoberfest-week1-2026-10-05](https://dev.to/challenges/hacktoberfest-week1-2026-10-05)  
> *Break the digital scroll loop and reconnect with the outdoors through genuine, on-device AI.*

---

## 📖 Overview

**TouchGrass AI** is a responsive web application designed to help people trade screen fatigue for outdoor vitality. By leveraging **Google's Gemma open-weight model** running locally on your computer via **Ollama**, the app generates personalized, mindful, screen-free outdoor quests tailored to your current mood and available time.

- **100% Genuine AI Inference**: No hardcoded mock missions disguised as AI. Every quest is generated on-the-fly by Google's Gemma.
- **Complete Privacy & Offline Capability**: Prompts never leave your computer. Once the model is pulled, it runs completely offline with zero telemetry.
- **Zero API Keys or Secrets**: No credit cards, token limits, or third-party accounts required.
- **Mindful Design System**: Nature-inspired aesthetic featuring sage green, forest green, warm cream backgrounds, fluid typography, and micro-interactions.

---

## 🧠 Selected Model: Google Gemma 2 2B (`gemma2:2b`)

### Why Google Gemma 2 2B?
1. **Google Open-Weight Architecture**: Built using the same research and technology behind Google's Gemini models, with fully public, reproducible weights.
2. **Ultra-Lightweight Footprint (~1.6 GB)**: Downloads quickly and executes rapidly even on modest consumer laptops, thin-and-lights, and machines without dedicated GPUs.
3. **Low Memory Overhead (< 3 GB RAM)**: Easily co-exists with browser tabs and development servers without bogging down the OS.
4. **Superb JSON & Instruction Adherence**: Despite its compact parameter size, Gemma 2 2B is trained to strictly adhere to JSON format requirements, ensuring reliably parsed mission titles, step-by-step instructions, sensory prompts, and safety tips.
5. **Safety Alignment**: Well-aligned against generating unsafe or risky outdoor behaviors, providing sensible guidelines (hydration, staying on paths, weather awareness).

### Model Capabilities & Limitations
* **Capabilities**:
  * Creative generation of grounded, observational, sensory outdoor missions (e.g., cloud gazing, foliage texture walks, sound meditation).
  * Adapting pace and intensity based on user mood (`relaxed`, `curious`, `energetic`) and duration (`10`, `20`, `30` minutes).
  * Generating safety recommendations tailored to outdoor settings.
* **Limitations**:
  * **No live geospatial data**: Gemma does not possess real-time GPS coordinates, local trail maps, or live weather radar. It generates universal, park-, backyard-, and neighborhood-appropriate activities.
  * **Inference latency depends on hardware**: On modern CPUs, generation takes ~2–6 seconds; older CPUs may take 10–25 seconds. The UI includes an asynchronous loading state and latency counter.

---

## 🛠️ Architecture & Stack

```
TouchGrass-AI/
├── frontend/                # React (Vite + Tailwind CSS + Lucide Icons + Confetti)
│   ├── src/
│   │   ├── components/      # Header, StatsBar, MissionForm, MissionCard, Modals
│   │   ├── services/api.js  # Clean API client with diagnostics
│   │   ├── App.jsx          # State management & LocalStorage persistence
│   │   └── index.css        # Nature design tokens & glassmorphism
│   ├── .env.example         # Optional frontend config
│   └── package.json
├── backend/                 # FastAPI (Python 3.9+)
│   ├── main.py              # Endpoints: /api/health, /api/generate-mission
│   ├── test_backend.py      # Pytest suite for schemas & offline behaviors
│   ├── requirements.txt     # fastapi, uvicorn, httpx, pydantic, python-dotenv
│   ├── .env.example         # Backend configuration template
│   └── venv/                # Python virtual environment
├── start.ps1                # One-click Windows PowerShell startup script
└── README.md
```

---

## 📋 Windows PowerShell Setup Checklist

Follow these exact steps in **Windows PowerShell**:

### 1. Install Ollama and Download Google Gemma
1. Open Windows PowerShell and install Ollama:
   ```powershell
   winget install Ollama.Ollama
   ```
   *(Alternatively, download the official installer directly from [ollama.com/download](https://ollama.com/download)).*

2. Download and run Google Gemma 2 2B:
   ```powershell
   ollama run gemma2:2b
   ```
   *Ollama will download the ~1.6 GB model. You can type `/bye` once the prompt appears; the Ollama background service will continue running at `http://localhost:11434`.*

### 2. Verify API Credentials
* **API Credentials Required**: **NONE**.  
  TouchGrass AI runs entirely on open-weight weights locally. No API keys, tokens, or environment secrets are needed.

### 3. Environment Variables
Two `.env.example` files are provided:

#### Backend (`backend/.env`):
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `PORT` | `8000` | Port for the FastAPI server |
| `HOST` | `0.0.0.0` | Binding host address |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Local Ollama endpoint |
| `GEMMA_MODEL` | `gemma2:2b` | Model tag in Ollama (`gemma2:2b` recommended) |
| `OLLAMA_TIMEOUT_SECONDS` | `60` | Max timeout for model generation |

To create from template:
```powershell
Copy-Item backend\.env.example backend\.env
```

#### Frontend (`frontend/.env`):
| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | *(empty)* | Optional. Defaults to Vite dev proxy (`/api` -> `http://127.0.0.1:8000`) |

To create from template:
```powershell
Copy-Item frontend\.env.example frontend\.env
```

---

## 🚀 Running the App Locally

### Option A: Using the One-Click PowerShell Script
From the repository root:
```powershell
.\start.ps1
```

---

### Option B: Running Manually in Separate Terminals

#### Terminal 1 — Backend (FastAPI):
```powershell
cd c:\Users\heema\TouchGrass-AI\backend

# Activate virtual environment (already prepared)
.\venv\Scripts\Activate.ps1

# (Optional: install dependencies if setting up on a fresh machine)
pip install -r requirements.txt

# Start backend server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
Backend is now live at: `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`).

#### Terminal 2 — Frontend (React + Vite):
```powershell
cd c:\Users\heema\TouchGrass-AI\frontend

# (Optional: install dependencies if setting up on a fresh machine)
npm install

# Start Vite dev server
npm run dev
```
Frontend is now live at: `http://127.0.0.1:5173`.

---

## 🔍 How to Test That Gemma Is Genuinely Generating Missions

To confirm that missions are generated live by Google's Gemma model and not fetched from a hardcoded list:

1. **Varying Outputs**:
   Select the same Mood (e.g. *Curious*) and Duration (e.g. *10 min*) and click **Generate Outdoor Mission** three times. Gemma will generate uniquely phrased mission titles, distinct steps, and tailored sensory focus prompts every time due to stochastic temperature sampling (`temperature=0.75`).
2. **Inspect Latency & Model Badge**:
   Each active mission card displays the exact model identifier and real-time generation latency (e.g. `gemma2:2b (1420ms)`).
3. **Observe Ollama Logs & Task Manager**:
   Open Windows Task Manager during generation — you will observe CPU/GPU activity and Ollama memory spikes as Gemma processes tokens.
4. **Backend Health Check**:
   Open `http://127.0.0.1:8000/api/health` in your browser. It returns live detection of Ollama and verifies if `gemma2:2b` is installed.

---

## 🧪 Automated Tests & Verification

The backend includes a Pytest suite verifying root health, JSON schema parsing with markdown fences, duration validation, and offline error handling.

To run the tests:
```powershell
.\backend\venv\Scripts\pytest.exe backend\test_backend.py -v
```

### Verified Test Results:
```
backend/test_backend.py::test_root_endpoint PASSED                       [ 14%]
backend/test_backend.py::test_health_endpoint PASSED                     [ 28%]
backend/test_backend.py::test_json_extraction_markdown_fence PASSED      [ 42%]
backend/test_backend.py::test_json_extraction_raw PASSED                 [ 57%]
backend/test_backend.py::test_invalid_request_mood_validation PASSED     [ 71%]
backend/test_backend.py::test_invalid_request_duration_validation PASSED [ 85%]
backend/test_backend.py::test_unreachable_ollama_returns_503 PASSED      [100%]

7 passed in 3.11s
```

Frontend production build verification:
```powershell
cd frontend
npm run build
# Result: Built 1,916 modules with zero errors.
```

---

## 🛠️ Troubleshooting Common Errors

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **"Ollama is not running locally" (503)** | Ollama service is stopped | Start Ollama from your Start menu or run `ollama serve` in PowerShell. |
| **"Model 'gemma2:2b' not found" (404)** | Model has not been pulled yet | Run `ollama pull gemma2:2b` in PowerShell. |
| **Slow generation (>30 seconds)** | Running on older CPU without GPU acceleration | In `backend/.env`, increase `OLLAMA_TIMEOUT_SECONDS=90`. Alternatively, close heavy background software. |
| **Port 8000 or 5173 in use** | Another dev server is occupying the port | Change `PORT=8001` in `backend/.env` and update `vite.config.js` proxy target accordingly. |

---

## 🌿 Challenge Requirements Checklist

- [x] **AI Outdoor Mission Generator**: React interface with mood (`relaxed`, `curious`, `energetic`) and time (`10`, `20`, `30` min).
- [x] **Genuine Gemma Inference**: Uses Google's Gemma model via Ollama with no mock substitutes.
- [x] **Structured Mission Card**: Displays mission title, instructions checklist, duration, sensory prompt, and safety tip.
- [x] **Graceful Error States**: Live status pill, diagnostic modal, and actionable error banners when Ollama is offline.
- [x] **Mission Completion Tracking**: "I did it!" button with confetti, local storage persistence, total missions counter, and screen-free minutes tracker.
- [x] **Stack**: React + Vite + Tailwind CSS frontend; FastAPI backend; Ollama local inference.
- [x] **Nature-Inspired Design**: Sage green, forest green, warm cream backgrounds, rounded cards, and responsive layout.
- [x] **Documentation**: Complete PowerShell checklist, model rationale, test report, README, and `.env.example` templates.