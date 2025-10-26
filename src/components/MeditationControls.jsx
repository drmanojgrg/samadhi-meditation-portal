import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { localSessionTracker } from '../services/localSessionTracker';

const MeditationControls = ({ 
  isActive, 
  onStart, 
  onReset,
  breathPhase,
  breathPhaseInfo,
  showBinauralControls,
  onToggleBinaural 
}) => {
  
  const handleStartPause = async () => {
    if (!isActive && localSessionTracker) {
      await localSessionTracker.startSession();
    } else if (isActive && localSessionTracker) {
      await localSessionTracker.endSession(false); // Paused, not completed
    }
    onStart();
  };

  const handleReset = async () => {
    if (localSessionTracker && localSessionTracker.isSessionActive()) {
      await localSessionTracker.endSession(false);
    }
    onReset();
  };

  return (
    <div className="space-y-6">
      {/* Phase Info */}
      <div className="text-center">
        <div className={`text-2xl font-bold ${breathPhaseInfo[breathPhase].color} mb-2 text-glow`}>
          {breathPhaseInfo[breathPhase].name} • AUTHENTICATED
        </div>
        <div className="text-purple-300 text-sm">
          {breathPhaseInfo[breathPhase].description}
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleStart}
          className="void-button"
        >
          {isActive ? <Pause size={20} /> : <Play size={20} />}
          <span className="font-semibold">{isActive ? 'Pause Portal' : 'Enter Portal'}</span>
        </button>
        
        <button
          onClick={handleReset}
          className="void-button"
        >
          <RotateCcw size={20} />
          <span className="font-semibold">Reset</span>
        </button>
      </div>

      {/* Audio Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onToggleBinaural}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 
                     ${showBinauralControls 
                       ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' 
                       : 'bg-gray-600/20 text-gray-400 border border-gray-500/30'}`}
        >
          {showBinauralControls ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="text-sm">Binaural Audio</span>
        </button>
      </div>

      {/* Session Stats */}
      {localSessionTracker && localSessionTracker.isSessionActive() && (
        <div className="text-center">
          <SessionStats />
        </div>
      )}
    </div>
  );
};

const SessionStats = () => {
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (localSessionTracker && localSessionTracker.isSessionActive()) {
        const info = localSessionTracker.getCurrentSessionInfo();
        setStats(info);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
      <div className="text-purple-100 text-sm font-medium mb-2">Current Session</div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-purple-300">
            {formatDuration(stats.duration)}
          </div>
          <div className="text-xs text-purple-400">Duration</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-indigo-300">
            {stats.breathCycles}
          </div>
          <div className="text-xs text-indigo-400">Breaths</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-cyan-300">
            {stats.currentPhase}
          </div>
          <div className="text-xs text-cyan-400">Phase</div>
        </div>
      </div>
    </div>
  );
};

export default MeditationControls;