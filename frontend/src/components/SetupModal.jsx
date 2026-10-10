import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Check, 
  Copy, 
  RefreshCw, 
  Cpu, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function SetupModal({ isOpen, onClose, health, onRefreshHealth }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshHealth();
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-forest-950/45 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sage-200 flex flex-col text-left my-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-sage-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 text-white flex items-center justify-center shadow-sm">
              <Terminal className="w-5 h-5 text-nature-300" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-forest-950 font-serif">
                Ollama &amp; Gemma 2 Setup Guide
              </h3>
              <p className="text-xs text-forest-800/80">
                Windows PowerShell checklist for genuine offline open-weight inference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-forest-700/60 hover:text-forest-900 hover:bg-cream-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto my-4 space-y-6 pr-1 text-sm text-forest-900">
          {/* Live Status Card */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                  Current Ollama State:
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                    health?.ollama_connected && health?.model_installed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {health?.ollama_connected && health?.model_installed
                    ? 'Connected & Ready'
                    : health?.ollama_connected
                    ? 'Connected (Model Missing)'
                    : 'Offline / Not Detected'}
                </span>
              </div>
              <p className="text-xs text-forest-800/80 mt-1">
                {health?.message || 'Checking local Ollama connection...'}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-sage-300 text-forest-800 hover:bg-sage-50 transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Checking...' : 'Refresh Status'}</span>
            </button>
          </div>

          {/* Model Selection & Rationale */}
          <div className="p-4 rounded-2xl bg-forest-50/70 border border-forest-200/80 space-y-2">
            <div className="flex items-center gap-2 text-forest-900 font-bold">
              <Cpu className="w-4 h-4 text-forest-700" />
              <span>Selected Model: Google Gemma 2 2B (<code>gemma2:2b</code>)</span>
            </div>
            <p className="text-xs text-forest-800/90 leading-relaxed">
              <strong>Why Gemma 2 2B is suitable:</strong>
            </p>
            <ul className="text-xs text-forest-800/80 space-y-1 list-disc list-inside">
              <li><strong>Open Weights:</strong> Derived from Google's Gemini models, fully free with transparent weights.</li>
              <li><strong>Lightweight (~1.6GB):</strong> Runs smoothly on standard laptops with CPU or integrated GPU; uses &lt; 3GB RAM.</li>
              <li><strong>Structured JSON Adherence:</strong> Excellent instruction-following without needing bulky parameter sizes.</li>
              <li><strong>Zero Cloud Secrets:</strong> 100% on-device local execution; prompts and mission logs never leave your device.</li>
            </ul>
          </div>

          {/* Step 1: Install Ollama */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-forest-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-forest-800 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              Install Ollama on Windows
            </h4>
            <p className="text-xs text-forest-800/80">
              Run this in Windows PowerShell, or download the installer directly from <a href="https://ollama.com/download" target="_blank" rel="noreferrer" className="underline font-semibold text-forest-700 hover:text-forest-900">ollama.com/download</a>:
            </p>
            <div className="relative bg-forest-950 text-forest-100 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
              <code>winget install Ollama.Ollama</code>
              <button
                onClick={() => handleCopy('winget install Ollama.Ollama', 'cmd1')}
                className="p-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-nature-200"
                title="Copy command"
              >
                {copiedKey === 'cmd1' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Step 2: Download Model */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-forest-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-forest-800 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              Pull and Run Google Gemma 2 2B
            </h4>
            <p className="text-xs text-forest-800/80">
              In a PowerShell window, run the following command to download the model (~1.6GB):
            </p>
            <div className="relative bg-forest-950 text-forest-100 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
              <code>ollama run gemma2:2b</code>
              <button
                onClick={() => handleCopy('ollama run gemma2:2b', 'cmd2')}
                className="p-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-nature-200"
                title="Copy command"
              >
                {copiedKey === 'cmd2' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-forest-700/70">
              (Once downloaded, you can test it directly or close the chat prompt with <code>/bye</code>; Ollama background service remains running at <code>http://localhost:11434</code>.)
            </p>
          </div>

          {/* Step 3: Run the Application */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-forest-950 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-forest-800 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              Run Backend &amp; Frontend Locally
            </h4>
            <p className="text-xs text-forest-800/80">
              Terminal 1 (Backend FastAPI server):
            </p>
            <div className="relative bg-forest-950 text-forest-100 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
              <code>cd backend; .\venv\Scripts\uvicorn.exe main:app --reload --port 8000</code>
              <button
                onClick={() => handleCopy('cd backend; .\\venv\\Scripts\\uvicorn.exe main:app --reload --port 8000', 'cmd3')}
                className="p-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-nature-200"
                title="Copy command"
              >
                {copiedKey === 'cmd3' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-forest-800/80 mt-2">
              Terminal 2 (Frontend React dev server):
            </p>
            <div className="relative bg-forest-950 text-forest-100 p-3 rounded-xl font-mono text-xs flex items-center justify-between">
              <code>cd frontend; npm run dev</code>
              <button
                onClick={() => handleCopy('cd frontend; npm run dev', 'cmd4')}
                className="p-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-nature-200"
                title="Copy command"
              >
                {copiedKey === 'cmd4' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Verification & Troubleshooting */}
          <div className="space-y-2 pt-2 border-t border-sage-200">
            <h4 className="font-bold text-sm text-forest-950 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-forest-700" />
              How to Verify Genuine Gemma Inference
            </h4>
            <p className="text-xs text-forest-800/80 leading-relaxed">
              1. <strong>Unique Outputs:</strong> Click "Generate Outdoor Mission" multiple times with the same settings. Gemma dynamically generates distinct sensory quests, wording, and safety tips each time.
            </p>
            <p className="text-xs text-forest-800/80 leading-relaxed">
              2. <strong>Terminal Activity:</strong> Look at your Ollama terminal / task manager — you will see memory and CPU/GPU spikes during token generation.
            </p>
            <p className="text-xs text-forest-800/80 leading-relaxed">
              3. <strong>Card Latency Badge:</strong> Each mission card displays the exact model used (<code>gemma2:2b</code>) and generation latency in milliseconds.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-sage-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-forest-800 hover:bg-forest-700 transition-colors shadow-sm"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
}
