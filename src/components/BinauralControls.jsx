/**
 * 🜏 BINAURAL CONTROLS COMPONENT
 * UI controls for delta binaural audio system
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Waves, Brain } from 'lucide-react';

const BinauralControls = ({ 
  binauralInfo, 
  onVolumeChange, 
  onToggle,
  isEnabled = true 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!binauralInfo) return null;

  const phaseInfo = {
    foundation: { 
      name: 'Foundation', 
      color: 'text-cyan-400', 
      desc: '3Hz - Deep Relaxation',
      icon: '🌳'
    },
    deepening: { 
      name: 'Deepening', 
      color: 'text-purple-400', 
      desc: '2Hz - Theta Gateway',
      icon: '🧬'
    },
    void: { 
      name: 'Void Entry', 
      color: 'text-pink-400', 
      desc: '1Hz - Delta Access',
      icon: '∞'
    },
    cosmic: { 
      name: 'Cosmic Void', 
      color: 'text-white', 
      desc: '0.5Hz - Pure Consciousness',
      icon: '🌌'
    }
  };

  const currentInfo = phaseInfo[binauralInfo.phase] || phaseInfo.foundation;
  const beatFreq = binauralInfo.currentBeat;
  const duration = Math.floor(binauralInfo.sessionDuration);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 min-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Waves size={16} className="text-cyan-400" />
          <span className="text-sm font-medium text-white">Delta Binaural</span>
        </div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <Brain size={14} />
        </button>
      </div>

      {/* Current Phase Display */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{currentInfo.icon}</span>
          <span className={`font-medium ${currentInfo.color}`}>
            {currentInfo.name}
          </span>
          {binauralInfo.isPlaying && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="text-xs text-gray-400">
          {currentInfo.desc}
        </div>
        {beatFreq > 0 && (
          <div className="text-xs text-gray-500 mt-1">
            {beatFreq}Hz binaural beat • {minutes}:{String(seconds).padStart(2, '0')}
          </div>
        )}
      </div>

      {/* Volume Control */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-2">
          {binauralInfo.volume > 0 ? (
            <Volume2 size={14} className="text-gray-400" />
          ) : (
            <VolumeX size={14} className="text-gray-400" />
          )}
          <span className="text-xs text-gray-400">Volume</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={binauralInfo.volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            disabled={!isEnabled}
          />
          <span className="text-xs text-gray-400 w-8">
            {Math.round(binauralInfo.volume * 100)}%
          </span>
        </div>
      </div>

      {/* Advanced Controls */}
      {showAdvanced && (
        <div className="border-t border-gray-700/50 pt-3 mt-3">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-gray-400 mb-1">Session</div>
              <div className="text-white">
                {minutes}:{String(seconds).padStart(2, '0')}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Beat Freq</div>
              <div className="text-white">
                {beatFreq.toFixed(2)}Hz
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">State</div>
              <div className="text-white">
                {binauralInfo.isPlaying ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div>
              <div className="text-gray-400 mb-1">Phase</div>
              <div className="text-white">
                {currentInfo.name}
              </div>
            </div>
          </div>
          
          {/* Phase Progress Indicator */}
          <div className="mt-3">
            <div className="text-xs text-gray-400 mb-2">Phase Progress</div>
            <div className="flex gap-1">
              {Object.keys(phaseInfo).map((phase, index) => (
                <div
                  key={phase}
                  className={`flex-1 h-1 rounded ${
                    phase === binauralInfo.phase 
                      ? 'bg-cyan-400' 
                      : index < Object.keys(phaseInfo).indexOf(binauralInfo.phase)
                        ? 'bg-gray-500'
                        : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700/50">
        <button
          onClick={onToggle}
          className={`flex-1 px-3 py-1 rounded text-xs font-medium transition-colors ${
            binauralInfo.isPlaying
              ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30'
              : 'bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30'
          }`}
          disabled={!isEnabled}
        >
          {binauralInfo.isPlaying ? 'Stop' : 'Start'} Binaural
        </button>
        <button
          onClick={() => onVolumeChange(binauralInfo.volume > 0 ? 0 : 0.6)}
          className="px-3 py-1 rounded text-xs font-medium bg-gray-700/50 text-gray-400 hover:bg-gray-700 transition-colors"
          disabled={!isEnabled}
        >
          {binauralInfo.volume > 0 ? 'Mute' : 'Unmute'}
        </button>
      </div>

      {/* Info Footer */}
      <div className="mt-3 pt-2 border-t border-gray-700/50">
        <div className="text-xs text-gray-500 text-center">
          🎧 Use headphones for optimal binaural effect
        </div>
      </div>
    </div>
  );
};

export default BinauralControls;