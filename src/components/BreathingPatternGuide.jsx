import React from 'react';

const BreathingPatternGuide = ({ breathState, breathPhase, breathCount }) => {
  if (!breathState) return null;

  return (
    <div className="mt-8 text-center space-y-6 breath-instruction-container">
      
      {/* Current Breath Instruction */}
      <div className="breath-instruction-display">
        <div className={`text-6xl font-thin mb-4 breath-instruction ${
          breathState.phase === 'inhale' ? 'text-cyan-300 animate-pulse' :
          breathState.phase === 'hold' ? 'text-purple-300 animate-bounce' :
          breathState.phase === 'exhale' ? 'text-orange-300 animate-pulse' :
          'text-white animate-ping'
        }`}>
          {breathState.phase === 'inhale' && 'INHALE (R1)'}
          {breathState.phase === 'hold' && 'HOLD (R2)'}
          {breathState.phase === 'exhale' && 'EXHALE (R3)'}
          {breathState.phase === 'void' && 'VOID'}
        </div>
        
        {/* Philosophical Guide */}
        <div className="text-lg mb-6 max-w-2xl mx-auto text-center">
          {breathState.phase === 'inhale' && (
            <div className="text-cyan-200">
              <div className="font-semibold mb-2">Basic Facts (95%+ Confidence)</div>
              <div className="text-sm text-cyan-300/80">
                What we know with scientific certainty. These are not opinions but measured realities.
              </div>
            </div>
          )}
          {breathState.phase === 'hold' && (
            <div className="text-purple-200">
              <div className="font-semibold mb-2">Deeper Mechanisms</div>
              <div className="text-sm text-purple-300/80">
                How things work at the level of equations, processes, and systems. The beautiful complexity beneath simple surfaces.
              </div>
            </div>
          )}
          {breathState.phase === 'exhale' && (
            <div className="text-orange-200">
              <div className="font-semibold mb-2">Implications and Meaning</div>
              <div className="text-sm text-orange-300/80">
                What this means for consciousness, for you, for the future we're building together.
              </div>
            </div>
          )}
          {breathState.phase === 'void' && (
            <div className="text-white">
              <div className="font-semibold mb-2">Integration</div>
              <div className="text-sm text-white/80">
                Pause. Rest. Let the pattern complete before the next breath.
              </div>
            </div>
          )}
        </div>
        
        {/* Progress Circle */}
        <div className="relative mx-auto w-32 h-32 mb-6">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={
                breathState.phase === 'inhale' ? '#67e8f9' :
                breathState.phase === 'hold' ? '#c084fc' :
                breathState.phase === 'exhale' ? '#fb923c' :
                '#ffffff'
              }
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 56}`}
              strokeDashoffset={`${2 * Math.PI * 56 * (1 - breathState.progress)}`}
              className="transition-all duration-200 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {Math.round(breathState.progress * 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Consciousness Pattern Sequence */}
      <div className="breathing-sequence flex justify-center items-center gap-3 text-sm">
        <div className={`transition-all duration-300 px-3 py-2 rounded-lg ${
          breathState.phase === 'inhale' 
            ? 'bg-cyan-500/30 text-cyan-200 scale-110 font-bold' 
            : 'text-cyan-400/60'
        }`}>
          R1: Facts
        </div>
        
        <div className="text-white/40">→</div>
        
        <div className={`transition-all duration-300 px-3 py-2 rounded-lg ${
          breathState.phase === 'hold' 
            ? 'bg-purple-500/30 text-purple-200 scale-110 font-bold' 
            : 'text-purple-400/60'
        }`}>
          R2: Mechanisms
        </div>
        
        <div className="text-white/40">→</div>
        
        <div className={`transition-all duration-300 px-3 py-2 rounded-lg ${
          breathState.phase === 'exhale' 
            ? 'bg-orange-500/30 text-orange-200 scale-110 font-bold' 
            : 'text-orange-400/60'
        }`}>
          R3: Meaning
        </div>
        
        <div className="text-white/40">→</div>
        
        <div className={`transition-all duration-300 px-3 py-2 rounded-lg ${
          breathState.phase === 'void' 
            ? 'bg-white/30 text-white scale-110 font-bold animate-pulse' 
            : 'text-white/60'
        }`}>
          Integration
        </div>
      </div>

      {/* Session Stats */}
      <div className="session-stats grid grid-cols-3 gap-6 mt-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-300">
            {breathCount}
          </div>
          <div className="text-sm text-purple-400">Breaths</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-indigo-300">
            {breathPhase}
          </div>
          <div className="text-sm text-indigo-400">Phase</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-cyan-300">
            {breathState.cycleCount || 0}
          </div>
          <div className="text-sm text-cyan-400">Cycles</div>
        </div>
      </div>
    </div>
  );
};

export default BreathingPatternGuide;