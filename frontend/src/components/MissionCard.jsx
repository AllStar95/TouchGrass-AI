import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Volume2, 
  Eye, 
  Flame, 
  Wind, 
  Search,
  Cpu
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MissionCard({ mission, onComplete, onRegenerate, isCompleted }) {
  const [checkedSteps, setCheckedSteps] = useState({});

  if (!mission) return null;

  const toggleStep = (idx) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCompleteClick = () => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#41865E', '#91C2A5', '#D5BA9B', '#D1B480', '#2F6B4A'],
      });
    } catch (e) {
      // Confetti fallback
    }

    onComplete(mission);
  };

  const getMoodBadge = (mood) => {
    switch (mood) {
      case 'relaxed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <Wind className="w-3.5 h-3.5" /> Relaxed
          </span>
        );
      case 'curious':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Search className="w-3.5 h-3.5" /> Curious
          </span>
        );
      case 'energetic':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-forest-100 text-forest-800">
            <Flame className="w-3.5 h-3.5" /> Energetic
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative glass-nature rounded-3xl p-6 sm:p-9 shadow-card border-2 border-forest-600/30 mb-8 transition-all duration-300 text-left">
      {/* Decorative nature corner tag */}
      <div className="absolute -top-3.5 left-8 bg-forest-800 text-nature-100 text-xs font-bold px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-nature-300" />
        <span>Active Outdoor Quest</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 pb-4 border-b border-sage-200/70">
        <div className="flex items-center gap-2">
          {getMoodBadge(mission.mood)}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cream-200 text-forest-900">
            <Clock className="w-3.5 h-3.5 text-forest-700" />
            {mission.duration_minutes} Minutes
          </span>
        </div>

        {/* Model info watermark */}
        <div className="inline-flex items-center gap-1 text-[11px] font-mono text-forest-700/80 bg-forest-50 px-2.5 py-1 rounded-lg border border-forest-200/60">
          <Cpu className="w-3 h-3 text-forest-600" />
          <span>Gemma: {mission.model_used} ({mission.generation_time_ms}ms)</span>
        </div>
      </div>

      {/* Title */}
      <div className="my-5">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-forest-950 font-serif tracking-tight leading-snug">
          {mission.title}
        </h3>
      </div>

      {/* Actionable Steps / Instructions */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800/80">
          Your Outdoor Instructions:
        </h4>
        <div className="space-y-2.5">
          {mission.instructions.map((step, idx) => {
            const isChecked = checkedSteps[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                className={`p-3.5 rounded-2xl border transition-all duration-150 flex items-start gap-3 cursor-pointer select-none ${
                  isChecked
                    ? 'bg-forest-50/70 border-forest-300 text-forest-900/60 line-through'
                    : 'bg-white/80 border-sage-200 hover:border-forest-300 hover:bg-cream-50/70 text-forest-950'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isChecked
                      ? 'bg-forest-600 text-white'
                      : 'border-2 border-sage-300 bg-white text-transparent hover:border-forest-500'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <div className="text-sm sm:text-base font-medium leading-relaxed">
                  <span className="font-bold mr-1.5 text-forest-800">{idx + 1}.</span>
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sensory Focus Prompt if available */}
      {mission.sensory_focus && (
        <div className="mb-6 p-4 rounded-2xl bg-cream-100/80 border border-cream-300 text-forest-900">
          <div className="flex items-start gap-2.5">
            <Volume2 className="w-5 h-5 text-earth-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-earth-700 block mb-0.5">
                Mindful Sensory Focus
              </span>
              <p className="text-sm font-medium text-forest-950 leading-relaxed">
                {mission.sensory_focus}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Safety Tip Callout */}
      <div className="mb-8 p-4 rounded-2xl bg-sage-50/90 border border-sage-300 text-forest-900">
        <div className="flex items-start gap-2.5">
          <ShieldAlert className="w-5 h-5 text-forest-700 shrink-0 mt-0.5" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 block mb-0.5">
              Outdoor Safety Tip
            </span>
            <p className="text-xs sm:text-sm text-forest-900 leading-relaxed font-medium">
              {mission.safety_tip}
            </p>
          </div>
        </div>
      </div>

      {/* Completion & Action buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-sage-200/70">
        <button
          type="button"
          onClick={handleCompleteClick}
          className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl font-extrabold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
            isCompleted
              ? 'bg-emerald-700 text-white shadow-emerald-700/20'
              : 'bg-forest-800 text-white hover:bg-forest-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-nature-300" />
          <span>{isCompleted ? 'Completed! (+1 to streak)' : 'I did it!'}</span>
        </button>

        <button
          type="button"
          onClick={onRegenerate}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-forest-800 bg-white/80 hover:bg-cream-100 border border-sage-300 transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4 text-forest-600" />
          <span>Generate Another Mission</span>
        </button>
      </div>
    </div>
  );
}
