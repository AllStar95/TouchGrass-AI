import React from 'react';
import { Sparkles, Compass, Wind, Search, Flame, Clock, MapPin, Loader2, AlertTriangle } from 'lucide-react';

const MOODS = [
  {
    id: 'relaxed',
    label: 'Relaxed',
    tagline: 'Gentle & Grounding',
    description: 'Unwind, deep breathing, and slow sensory noticing.',
    icon: Wind,
    color: 'emerald',
    badge: '🧘 Calming',
  },
  {
    id: 'curious',
    label: 'Curious',
    tagline: 'Scavenger & Discover',
    description: 'Find natural patterns, textures, flora, and micro-wonders.',
    icon: Search,
    color: 'amber',
    badge: '🔍 Explorer',
  },
  {
    id: 'energetic',
    label: 'Energetic',
    tagline: 'Movement & Stride',
    description: 'Brisk walking, dynamic posture, and invigorating fresh air.',
    icon: Flame,
    color: 'forest',
    badge: '⚡ Active',
  },
];

const DURATIONS = [
  { value: 10, label: '10 min', desc: 'Quick Screen Break' },
  { value: 20, label: '20 min', desc: 'Mindful Stroll' },
  { value: 30, label: '30 min', desc: 'Deep Immersion' },
];

const ENVIRONMENTS = [
  { id: 'any', label: 'Anywhere' },
  { id: 'park', label: 'Park / Woods' },
  { id: 'backyard', label: 'Backyard / Garden' },
  { id: 'neighborhood', label: 'Neighborhood Walk' },
];

export default function MissionForm({
  mood,
  setMood,
  duration,
  setDuration,
  environment,
  setEnvironment,
  onGenerate,
  isLoading,
  error,
  health,
  onOpenSetup,
}) {
  return (
    <div className="glass-nature rounded-3xl p-6 sm:p-8 shadow-card border border-sage-200/80 mb-8 transition-all">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          <span>Google Gemma 2 2B Inference</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-forest-950 font-serif tracking-tight">
          What is your outdoor vibe today?
        </h2>
        <p className="text-sm text-forest-800/80 mt-2">
          Select your current mood and how long you can step away from your screens. Gemma will generate a tailored real-world mission.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        className="space-y-7"
      >
        {/* Mood Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forest-800/80 mb-3 text-left">
            1. Select Your Mood
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MOODS.map((m) => {
              const Icon = m.icon;
              const isSelected = mood === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`relative p-4 rounded-2xl text-left border-2 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-forest-700 bg-forest-50/70 shadow-md ring-2 ring-forest-700/20'
                      : 'border-sage-200 bg-white/70 hover:border-forest-400 hover:bg-cream-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sage-100 text-forest-800">
                        {m.badge}
                      </span>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-forest-700' : 'text-forest-500'}`} />
                    </div>
                    <div className="font-bold text-base text-forest-950">{m.label}</div>
                    <p className="text-xs text-forest-800/70 mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-forest-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest-600"></span>
                      <span>Selected</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forest-800/80 mb-3 text-left">
            2. Available Screen-Free Time
          </label>
          <div className="grid grid-cols-3 gap-3">
            {DURATIONS.map((d) => {
              const isSelected = duration === d.value;
              return (
                <button
                  type="button"
                  key={d.value}
                  onClick={() => setDuration(d.value)}
                  className={`p-3.5 rounded-2xl text-center border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-forest-700 bg-forest-50/80 shadow-sm ring-2 ring-forest-700/20'
                      : 'border-sage-200 bg-white/70 hover:border-forest-400 hover:bg-cream-50/50'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 font-extrabold text-lg text-forest-950">
                    <Clock className="w-4 h-4 text-forest-600" />
                    <span>{d.label}</span>
                  </div>
                  <div className="text-[11px] text-forest-800/70 mt-0.5 font-medium">{d.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Setting / Environment (Subtle Pills) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-forest-800/80 mb-2.5 text-left">
            3. Outdoor Setting (Optional)
          </label>
          <div className="flex flex-wrap gap-2">
            {ENVIRONMENTS.map((env) => {
              const isSelected = environment === env.id;
              return (
                <button
                  type="button"
                  key={env.id}
                  onClick={() => setEnvironment(env.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-forest-800 text-white shadow-sm'
                      : 'bg-white/80 text-forest-800 border border-sage-200 hover:bg-sage-100/60'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  <span>{env.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Callout if any */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-left">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-rose-900">
                  {error.detail?.error === 'OLLAMA_UNREACHABLE'
                    ? 'Ollama is not running locally'
                    : error.detail?.error === 'MODEL_NOT_FOUND'
                    ? 'Gemma model needs to be pulled'
                    : 'Mission Generation Notice'}
                </h4>
                <p className="text-xs text-rose-800 leading-relaxed">{error.message}</p>
                {error.detail?.command && (
                  <div className="mt-2 bg-rose-100/70 rounded-lg p-2 font-mono text-xs text-rose-950 flex items-center justify-between">
                    <code>{error.detail.command}</code>
                  </div>
                )}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={onOpenSetup}
                    className="text-xs font-bold text-rose-900 underline hover:text-rose-950"
                  >
                    View Windows PowerShell Setup Guide &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-2xl text-base font-bold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 ${
              isLoading
                ? 'bg-forest-700/80 cursor-wait'
                : 'bg-gradient-to-r from-forest-800 via-forest-700 to-forest-900 hover:from-forest-700 hover:to-forest-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-nature-200" />
                <span>Consulting Google Gemma 2 2B via Ollama...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-nature-300" />
                <span>Generate Outdoor Mission</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
