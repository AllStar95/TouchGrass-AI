import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import MissionForm from './components/MissionForm';
import MissionCard from './components/MissionCard';
import CompletionModal from './components/CompletionModal';
import HistoryModal from './components/HistoryModal';
import SetupModal from './components/SetupModal';
import { fetchHealthStatus, generateMission } from './services/api';
import { Trees, Compass, Heart, ExternalLink, Sparkles, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'touchgrass_completed_missions';

export default function App() {
  const [mood, setMood] = useState('relaxed');
  const [duration, setDuration] = useState(20);
  const [environment, setEnvironment] = useState('any');
  const [currentMission, setCurrentMission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [health, setHealth] = useState(null);

  // Local storage for completed missions
  const [completedMissions, setCompletedMissions] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [lastCompletedMission, setLastCompletedMission] = useState(null);

  // Check health on initial load
  const loadHealth = async () => {
    const status = await fetchHealthStatus();
    setHealth(status);
  };

  useEffect(() => {
    loadHealth();
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await generateMission({
        mood,
        duration_minutes: duration,
        environment,
      });
      setCurrentMission(result);
    } catch (err) {
      console.error('Mission generation error:', err);
      setError(err);
      // If error indicates Ollama offline or missing model, keep error visible so user has setup steps
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteMission = (mission) => {
    const newEntry = {
      id: Date.now(),
      title: mission.title,
      mood: mission.mood,
      duration_minutes: mission.duration_minutes,
      instructions: mission.instructions,
      completed_at: new Date().toISOString(),
    };

    const updated = [newEntry, ...completedMissions];
    setCompletedMissions(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }

    setLastCompletedMission(mission);
    setShowCompletionModal(true);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to reset your completed missions history?')) {
      setCompletedMissions([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const isCurrentCompleted = currentMission && completedMissions.some(
    (m) => m.title === currentMission.title
  );

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950 font-sans selection:bg-nature-200 selection:text-forest-900">
      {/* Top Navbar */}
      <Header
        health={health}
        onOpenSetup={() => setShowSetupModal(true)}
        onOpenHistory={() => setShowHistoryModal(true)}
        completedCount={completedMissions.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Offline Banner if Ollama is not detected */}
        {health && !health.ollama_connected && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-left flex items-start justify-between gap-3 shadow-sm">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                  Ollama is currently offline on your PC
                </h4>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  TouchGrass AI uses genuine offline inference with Google's Gemma model. Start Ollama and run <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">ollama run gemma2:2b</code>.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSetupModal(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-800 text-white text-xs font-bold hover:bg-amber-900 transition-colors shrink-0"
            >
              Setup Guide
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-3 border border-forest-200/50">
            <Trees className="w-3.5 h-3.5 text-forest-600" />
            <span>Screen Detox &amp; Mindful Outdoor Quests</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight font-serif">
            Less Screen Time.<br />
            <span className="earth-gradient-text">More Nature Time.</span>
          </h1>
          <p className="text-sm sm:text-base text-forest-800/80 max-w-xl mx-auto mt-3 leading-relaxed">
            Break the scroll cycle. Select your mood and available minutes to generate genuine, screen-free outdoor missions powered by Google's Gemma model on your device.
          </p>
        </div>

        {/* Stats Dashboard */}
        <StatsBar
          completedMissions={completedMissions}
          onOpenHistory={() => setShowHistoryModal(true)}
        />

        {/* Generator Form */}
        <MissionForm
          mood={mood}
          setMood={setMood}
          duration={duration}
          setDuration={setDuration}
          environment={environment}
          setEnvironment={setEnvironment}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          error={error}
          health={health}
          onOpenSetup={() => setShowSetupModal(true)}
        />

        {/* Active Mission Display */}
        {currentMission && (
          <MissionCard
            mission={currentMission}
            onComplete={handleCompleteMission}
            onRegenerate={handleGenerate}
            isCompleted={isCurrentCompleted}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-sage-200/80 bg-white/50 py-8 px-4 text-center text-xs text-forest-800/70 mt-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-medium">
            <Compass className="w-4 h-4 text-forest-600" />
            <span>TouchGrass AI</span>
            <span>•</span>
            <span>Offline Outdoor Screen Detox</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSetupModal(true)}
              className="hover:text-forest-950 underline transition-colors"
            >
              PowerShell Setup
            </button>
            <a
              href="https://ai.google.dev/gemma"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-forest-950 underline transition-colors"
            >
              <span>Google Gemma</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        mission={lastCompletedMission}
        totalCompleted={completedMissions.length}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        missions={completedMissions}
        onClearHistory={handleClearHistory}
      />

      <SetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
        health={health}
        onRefreshHealth={loadHealth}
      />
    </div>
  );
}
