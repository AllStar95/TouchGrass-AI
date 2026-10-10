import pytest
from fastapi.testclient import TestClient
from main import app, clean_and_extract_json

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "TouchGrass AI"
    assert "health" in data

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert "ollama_connected" in data
    assert "configured_model" in data
    assert "status" in data
    assert isinstance(data["available_models"], list)

def test_json_extraction_markdown_fence():
    sample = """Here is your personalized outdoor mission:
```json
{
  "title": "Forest Canopy Gazer",
  "instructions": ["Find an oak tree", "Look upward through the leaves"],
  "safety_tip": "Keep balance on sloping ground",
  "sensory_focus": "Listen for wind whistling through high branches"
}
```
Enjoy your time outside!"""
    parsed = clean_and_extract_json(sample)
    assert parsed["title"] == "Forest Canopy Gazer"
    assert len(parsed["instructions"]) == 2
    assert parsed["safety_tip"] == "Keep balance on sloping ground"

def test_json_extraction_raw():
    sample = '{"title": "Brisk Meadow Walk", "instructions": ["Walk 500 steps"], "safety_tip": "Hydrate", "sensory_focus": "Smell damp grass"}'
    parsed = clean_and_extract_json(sample)
    assert parsed["title"] == "Brisk Meadow Walk"
    assert parsed["sensory_focus"] == "Smell damp grass"

def test_invalid_request_mood_validation():
    # Only "relaxed", "curious", "energetic" are permitted
    response = client.post("/api/generate-mission", json={
        "mood": "angry",
        "duration_minutes": 20
    })
    assert response.status_code == 422

def test_invalid_request_duration_validation():
    # Only 10, 20, 30 are permitted
    response = client.post("/api/generate-mission", json={
        "mood": "relaxed",
        "duration_minutes": 45
    })
    assert response.status_code == 422

def test_unreachable_ollama_returns_503(monkeypatch):
    import httpx
    async def mock_post(*args, **kwargs):
        raise httpx.ConnectError("Connection refused")
    monkeypatch.setattr(httpx.AsyncClient, "post", mock_post)

    response = client.post("/api/generate-mission", json={
        "mood": "relaxed",
        "duration_minutes": 10
    })
    assert response.status_code == 503
    data = response.json()
    assert "detail" in data
    assert data["detail"]["error"] == "OLLAMA_UNREACHABLE"
