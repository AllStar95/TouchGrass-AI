/**
 * TouchGrass AI - API Service
 * Handles health checking and mission generation requests to FastAPI / Ollama.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Checks backend and Ollama connectivity status.
 */
export async function fetchHealthStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      return {
        status: 'error',
        ollama_connected: false,
        message: `Backend returned HTTP ${res.status}`,
        configured_model: 'gemma2:2b',
        model_installed: false,
        available_models: [],
      };
    }
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      ollama_connected: false,
      message: err.message || 'Cannot connect to backend server',
      configured_model: 'gemma2:2b',
      model_installed: false,
      available_models: [],
    };
  }
}

/**
 * Requests genuine outdoor mission generation from Google's Gemma model via Ollama.
 *
 * @param {Object} params
 * @param {string} params.mood - 'relaxed' | 'curious' | 'energetic'
 * @param {number} params.duration_minutes - 10 | 20 | 30
 * @param {string} params.environment - 'any' | 'park' | 'backyard' | 'neighborhood'
 */
export async function generateMission({ mood, duration_minutes, environment = 'any' }) {
  const res = await fetch(`${API_BASE}/api/generate-mission`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      mood,
      duration_minutes: Number(duration_minutes),
      environment,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const detail = data?.detail || {};
    const errorMsg = detail.message || data.message || `Failed to generate mission (HTTP ${res.status})`;
    const error = new Error(errorMsg);
    error.status = res.status;
    error.detail = detail;
    throw error;
  }

  return data;
}
