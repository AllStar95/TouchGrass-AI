import React from 'react';
import { Award, Sun, Trees, CheckCircle, X, Sparkles } from 'lucide-react';

export default function CompletionModal({ isOpen, onClose, mission, totalCompleted }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sage-200 text-center animate-scale-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-forest-700/60 hover:text-forest-900 hover:bg-cream-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-4 shadow-inner">
          <Award className="w-9 h-9 text-forest-700" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-nature-100 text-forest-800 mb-2">
          🎉 Mission Accomplished!
        </span>

        <h3 className="text-2xl font-extrabold text-forest-950 font-serif">
          You stepped outside!
        </h3>

        <p className="text-sm text-forest-800/80 mt-2 mb-6 leading-relaxed">
          Screen time surrendered, fresh air embraced. Your eyes, mind, and spirit are re-energized.
        </p>

        {/* Stats Highlight */}
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-cream-50 border border-cream-200 mb-6 text-left">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700/70 block">
              Total Missions
            </span>
            <span className="text-2xl font-extrabold text-forest-950">
              {totalCompleted}
            </span>
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700/70 block">
              Session Time
            </span>
            <span className="text-2xl font-extrabold text-forest-950">
              +{mission?.duration_minutes || 10} <span className="text-xs font-semibold text-forest-700">min</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3.5 px-6 rounded-2xl font-bold text-white bg-forest-800 hover:bg-forest-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base"
        >
          Keep Touching Grass 🌱
        </button>
      </div>
    </div>
  );
}
