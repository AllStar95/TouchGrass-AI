import React from 'react';
import { X, History, Trash2, Clock, CheckCircle2, Award } from 'lucide-react';

export default function HistoryModal({ isOpen, onClose, missions, onClearHistory }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/40 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[85vh] bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-sage-200 flex flex-col text-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-sage-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center text-forest-700">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-forest-950 font-serif">
                Completed Outdoor Missions
              </h3>
              <p className="text-xs text-forest-800/70">
                Tracked locally in your browser storage ({missions.length} recorded)
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

        {/* Content list */}
        <div className="overflow-y-auto my-4 space-y-3 pr-1 flex-1">
          {missions.length === 0 ? (
            <div className="py-12 text-center text-forest-800/60">
              <Award className="w-12 h-12 mx-auto mb-2 text-sage-300 stroke-[1.5]" />
              <p className="font-semibold text-sm">No completed missions yet</p>
              <p className="text-xs mt-1">Generate a mission and click "I did it!" after stepping outside!</p>
            </div>
          ) : (
            missions.map((m, idx) => (
              <div
                key={m.id || idx}
                className="p-4 rounded-2xl bg-cream-50/70 border border-sage-200/80 flex items-start justify-between gap-3 transition-colors hover:bg-cream-100/70"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800 uppercase tracking-wider text-[10px]">
                      {m.mood}
                    </span>
                    <span className="text-xs font-medium text-forest-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {m.duration_minutes} min
                    </span>
                    {m.completed_at && (
                      <span className="text-[11px] text-forest-700/60">
                        • {new Date(m.completed_at).toLocaleDateString()} {new Date(m.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-forest-950 text-sm sm:text-base">
                    {m.title}
                  </h4>
                  {m.instructions && m.instructions.length > 0 && (
                    <p className="text-xs text-forest-800/80 mt-1 line-clamp-2">
                      {m.instructions[0]}
                    </p>
                  )}
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-sage-200 flex items-center justify-between">
          {missions.length > 0 ? (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-forest-900 bg-sage-100 hover:bg-sage-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
