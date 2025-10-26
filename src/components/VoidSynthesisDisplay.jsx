import React, { useState, useEffect } from 'react';
import { BINAURAL_PRESETS } from '../audio/BinauralAudioLibrary';

const VoidSynthesisDisplay = ({ currentLevel, consciousnessLevels, isActive, breathPhase }) => {
  const [waveAnimation, setWaveAnimation] = useState(0);
  
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setWaveAnimation(prev => (prev + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  if (!isActive) return null;

  const level = consciousnessLevels[currentLevel];
  const preset = BINAURAL_PRESETS[level.binauralPreset];
  
  // Calculate the actual frequencies being generated
  const leftFreq = level.baseFreq;
  const rightFreq = level.baseFreq + level.voidFrequency;
  
  // Visual wave representations
  const leftWavePhase = (waveAnimation * leftFreq / 10) % 360;
  const rightWavePhase = (waveAnimation * rightFreq / 10) % 360;
  const beatPhase = (waveAnimation * level.voidFrequency) % 360;

  return (
    <div className="absolute bottom-20 left-4 bg-black bg-opacity-80 p-4 rounded-lg text-white z-10 min-w-80">
      <div className="text-center mb-3">
        <h3 className="text-lg font-bold text-cyan-400">∅ VOID SYNTHESIS ∅</h3>
        <p className="text-xs opacity-70">Real-time binaural beat generation</p>
      </div>
      
      {/* Frequency Display */}
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center">
          <div className="text-xs opacity-70">LEFT EAR</div>
          <div className="text-lg font-mono text-blue-400">{leftFreq} Hz</div>
          <div className="h-8 flex items-center justify-center">
            <div 
              className="w-16 h-1 bg-blue-400 rounded"
              style={{
                transform: `scaleX(${0.5 + 0.5 * Math.sin(leftWavePhase * Math.PI / 180)})`,
                transition: 'transform 50ms linear'
              }}
            />
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-xs opacity-70">RIGHT EAR</div>
          <div className="text-lg font-mono text-red-400">{rightFreq} Hz</div>
          <div className="h-8 flex items-center justify-center">
            <div 
              className="w-16 h-1 bg-red-400 rounded"
              style={{
                transform: `scaleX(${0.5 + 0.5 * Math.sin(rightWavePhase * Math.PI / 180)})`,
                transition: 'transform 50ms linear'
              }}
            />
          </div>
        </div>
      </div>

      {/* Beat Frequency Display */}
      <div className="text-center mb-3 p-2 bg-purple-900 bg-opacity-50 rounded">
        <div className="text-xs opacity-70">BINAURAL BEAT</div>
        <div className="text-xl font-mono text-purple-300">{level.voidFrequency} Hz</div>
        <div className="text-xs opacity-70">
          {level.voidFrequency <= 4 ? 'DELTA' : level.voidFrequency <= 8 ? 'THETA' : 'ALPHA'} WAVE
        </div>
        <div className="h-6 flex items-center justify-center mt-1">
          <div 
            className="w-24 h-2 bg-purple-400 rounded"
            style={{
              opacity: 0.3 + 0.7 * Math.abs(Math.sin(beatPhase * Math.PI / 180)),
              transition: 'opacity 100ms linear'
            }}
          />
        </div>
      </div>

      {/* Technical Details */}
      <div className="text-xs space-y-1 opacity-80">
        <div><strong>Preset:</strong> {preset.name}</div>
        <div><strong>Scale:</strong> {level.scale}</div>
        <div><strong>Breath Phase:</strong> {breathPhase.toUpperCase()}</div>
        <div><strong>License:</strong> {preset.license}</div>
      </div>

      {/* Live Synthesis Indicator */}
      <div className="mt-3 flex items-center justify-center space-x-2">
        <div 
          className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
          style={{ animationDuration: `${1000/level.voidFrequency}ms` }}
        />
        <span className="text-xs text-green-400">LIVE SYNTHESIS</span>
        <div 
          className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
          style={{ animationDuration: `${1000/level.voidFrequency}ms` }}
        />
      </div>

      {/* Consciousness Level Progress */}
      <div className="mt-3">
        <div className="text-xs opacity-70 mb-1">CONSCIOUSNESS DEPTH</div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentLevel + 1) / consciousnessLevels.length) * 100}%` }}
          />
        </div>
        <div className="text-xs opacity-70 mt-1 text-center">
          Level {currentLevel + 1} of {consciousnessLevels.length}
        </div>
      </div>
    </div>
  );
};

export default VoidSynthesisDisplay;