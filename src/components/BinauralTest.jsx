/**
 * 🜏 BINAURAL AUDIO TEST
 * Simple test component for verifying delta binaural functionality
 */

import React, { useState } from 'react';
import DeltaBinauralEngine, { DeltaPresets } from '../audio/DeltaBinauralEngine';

const BinauralTest = () => {
  const [engine, setEngine] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('foundation');
  const [preset, setPreset] = useState('default');

  const initEngine = async () => {
    const newEngine = new DeltaBinauralEngine();
    const success = await newEngine.initialize();
    
    if (success) {
      setEngine(newEngine);
      console.log('✅ Binaural engine initialized');
    } else {
      console.log('❌ Failed to initialize binaural engine');
    }
  };

  const startAudio = () => {
    if (engine) {
      engine.start(currentPhase);
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (engine) {
      engine.stop();
      setIsPlaying(false);
    }
  };

  const changePhase = (newPhase) => {
    if (engine && isPlaying) {
      engine.transitionToPhase(newPhase);
    }
    setCurrentPhase(newPhase);
  };

  const triggerReminder = () => {
    if (engine) {
      engine.createPeacefulReminder();
    }
  };

  const phaseOptions = [
    { value: 'foundation', label: 'Foundation (3Hz)' },
    { value: 'deepening', label: 'Deepening (2Hz)' },
    { value: 'void', label: 'Void (1Hz)' },
    { value: 'cosmic', label: 'Cosmic (0.5Hz)' }
  ];

  return (
    <div className="fixed top-4 left-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 min-w-[300px]">
      <div className="mb-4">
        <h3 className="text-white font-bold mb-2">🎵 Binaural Audio Test</h3>
        <div className="text-xs text-gray-400 mb-3">
          Test the delta binaural beats system independently
        </div>
      </div>

      {!engine ? (
        <button
          onClick={initEngine}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded transition-colors"
        >
          Initialize Audio Engine
        </button>
      ) : (
        <div className="space-y-3">
          {/* Play/Stop Controls */}
          <div className="flex gap-2">
            <button
              onClick={isPlaying ? stopAudio : startAudio}
              className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
                isPlaying
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isPlaying ? 'Stop' : 'Start'} Binaural
            </button>
            <button
              onClick={triggerReminder}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Test Chime
            </button>
          </div>

          {/* Phase Selection */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Phase:</label>
            <select
              value={currentPhase}
              onChange={(e) => changePhase(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm"
            >
              {phaseOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Volume Control */}
          <div>
            <label className="block text-xs text-gray-400 mb-2">Volume:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue="0.6"
              onChange={(e) => engine?.adjustVolume(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Status Display */}
          <div className="text-xs text-gray-400 border-t border-gray-700 pt-3">
            <div>Status: {isPlaying ? '🟢 Playing' : '🔴 Stopped'}</div>
            <div>Phase: {currentPhase}</div>
            <div>Beat: {engine?.getCurrentBeat?.() || 0}Hz</div>
            <div>Duration: {Math.floor(engine?.getSessionDuration?.() || 0)}s</div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-gray-500 border-t border-gray-700 pt-2">
            🎧 Use headphones for binaural effect<br/>
            🔔 Reminder chimes every 5 minutes<br/>
            🧘‍♂️ Lower frequencies = deeper states
          </div>
        </div>
      )}
    </div>
  );
};

export default BinauralTest;