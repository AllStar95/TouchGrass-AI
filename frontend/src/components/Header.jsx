import React from 'react';
import { Compass, Sparkles, AlertCircle, CheckCircle2, Terminal, History, BookOpen } from 'lucide-react';

export default function Header({ health, onOpenSetup, onOpenHistory, completedCount }) {
  const getStatusBadge = () => {
    if (!health) {
      return (
        <button
          onClick={onOpenSetup}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors shadow-sm"
          title="Click to view setup checklist"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Checking AI Status...</span>
        </button>
      );
    }

    if (health.ollama_connected && health.model_installed) {
      return (
        <button
          onClick={onOpenSetup}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-forest-50 text-forest-800 border border-forest-200/80 hover:bg-forest-100 transition-colors shadow-sm"
          title="Click to view Gemma model specs"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse" />
          <span>Gemma 2 2B Online</span>
        </button>
      );
    }

    if (health.ollama_connected && !health.model_installed) {
      return (
        <button
          onClick={onOpenSetup}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 transition-colors shadow-sm"
          title="Ollama is running, but Gemma 2 2B model needs to be pulled. Click for instructions."
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Model Required (ollama pull)</span>
        </button>
      );
    }

    return (
      <button
        onClick={onOpenSetup}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300 hover:bg-rose-100 transition-colors shadow-sm"
        title="Ollama is not running. Click to view local setup guide."
      >
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>Ollama Offline (Setup)</span>
      </button>
    );
  };

  return (
    <header className="w-full border-b border-sage-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-700 to-forest-900 text-white flex items-center justify-center shadow-md shadow-forest-900/10 transform transition hover:scale-105">
            <Compass className="w-5 h-5 text-nature-300 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-forest-950 font-serif">
                TouchGrass <span className="text-forest-600 font-sans font-extrabold text-lg">AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-forest-100/70 text-forest-800 border border-forest-200/50">
                Screen Detox
              </span>
            </div>
            <p className="text-xs text-forest-800/70 font-medium hidden md:block">
              Screen Detox &amp; Outdoor Missions powered by Google Gemma
            </p>
          </div>
        </div>

        {/* Right side controls & AI indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          {getStatusBadge()}

          {/* History Button */}
          <button
            onClick={onOpenHistory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-forest-800 bg-cream-100 hover:bg-cream-200 border border-cream-300 transition-colors shadow-sm"
            title="View Completed Missions"
          >
            <History className="w-3.5 h-3.5 text-forest-700" />
            <span className="hidden sm:inline">Missions</span>
            <span className="bg-forest-700 text-white rounded-full px-1.5 py-0.2 text-[10px] font-bold">
              {completedCount}
            </span>
          </button>

          {/* Setup Instructions modal toggle */}
          <button
            onClick={onOpenSetup}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium text-forest-800 bg-sage-100/70 hover:bg-sage-200/80 border border-sage-300 transition-colors inline-flex items-center gap-1"
            title="Open Setup & Gemma Diagnostics"
          >
            <Terminal className="w-4 h-4 text-forest-700" />
            <span className="hidden sm:inline">Setup Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
}
