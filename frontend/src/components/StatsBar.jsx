import React from 'react';
import { Award, Sun, Trees, ShieldCheck, Clock } from 'lucide-react';

export default function StatsBar({ completedMissions, onOpenHistory }) {
  const totalCount = completedMissions.length;
  const totalMinutes = completedMissions.reduce((acc, m) => acc + (m.duration_minutes || 0), 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
      {/* Total Missions */}
      <div 
        onClick={onOpenHistory}
        role="button"
        tabIndex={0}
        className="glass-nature rounded-2xl p-4 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 cursor-pointer text-left"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700/80">Completed</span>
          <div className="w-7 h-7 rounded-lg bg-nature-100 flex items-center justify-center text-forest-700">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-forest-950">
          {totalCount}
        </div>
        <p className="text-[11px] text-forest-800/70 mt-0.5">outdoor missions done</p>
      </div>

      {/* Screen-Free Minutes */}
      <div className="glass-nature rounded-2xl p-4 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700/80">Time Outside</span>
          <div className="w-7 h-7 rounded-lg bg-amber-100/70 flex items-center justify-center text-amber-800">
            <Sun className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-forest-950">
          {totalMinutes} <span className="text-sm font-semibold text-forest-700">min</span>
        </div>
        <p className="text-[11px] text-forest-800/70 mt-0.5">screen-free fresh air</p>
      </div>

      {/* Mindful Streak / Level */}
      <div className="glass-nature rounded-2xl p-4 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700/80">Status</span>
          <div className="w-7 h-7 rounded-lg bg-emerald-100/70 flex items-center justify-center text-emerald-800">
            <Trees className="w-4 h-4" />
          </div>
        </div>
        <div className="text-lg sm:text-xl font-bold text-forest-950 truncate">
          {totalCount === 0 ? "Sprout 🌱" : totalCount < 3 ? "Sapling 🌿" : totalCount < 7 ? "Woodlander 🌲" : "Forest Ranger 🌳"}
        </div>
        <p className="text-[11px] text-forest-800/70 mt-0.5">nature connection level</p>
      </div>

      {/* Privacy & Open Weights Guarantee */}
      <div className="glass-nature rounded-2xl p-4 transition-all duration-200 hover:shadow-soft hover:-translate-y-0.5 text-left">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-forest-700/80">Privacy</span>
          <div className="w-7 h-7 rounded-lg bg-blue-100/70 flex items-center justify-center text-blue-800">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="text-sm font-bold text-forest-950">
          100% Offline
        </div>
        <p className="text-[11px] text-forest-800/70 mt-0.5">Google Gemma 2 on-device</p>
      </div>
    </div>
  );
}
