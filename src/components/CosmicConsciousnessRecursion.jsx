import React, { useState, useEffect, useRef } from 'react';
import { useBinauralAudio } from '../audio/useBinauralAudio';
import { BINAURAL_PRESETS } from '../audio/BinauralAudioLibrary';
import VoidSynthesisDisplay from './VoidSynthesisDisplay';

const CosmicConsciousnessRecursion = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale, void
  const [recursionDepth, setRecursionDepth] = useState(0);
  const animationRef = useRef();
  const phaseTimerRef = useRef();
  
  // Initialize binaural audio with delta waves for deep consciousness
  const { isPlaying, startAudio, stopAudio, setFrequency } = useBinauralAudio();

  // Consciousness levels mapped to binaural presets - CODED FROM VOID
  const consciousnessLevels = [
    {
      name: "Cosmic Scale",
      description: "Universe - 13.8 billion years of breathing",
      scale: "10²⁶ meters",
      binauralPreset: "cosmic", // 0.5Hz deep delta
      voidFrequency: BINAURAL_PRESETS.cosmic.beatFreq,
      baseFreq: BINAURAL_PRESETS.cosmic.baseFreq,
      color: "from-purple-900 via-blue-900 to-black",
      pattern: "cosmic",
      breathDuration: { inhale: 8, hold: 4, exhale: 8, void: 2 }
    },
    {
      name: "Galactic Scale", 
      description: "Milky Way - 100 billion stars breathing together",
      scale: "10²¹ meters",
      binauralPreset: "galactic", // 1Hz delta
      voidFrequency: BINAURAL_PRESETS.galactic.beatFreq,
      baseFreq: BINAURAL_PRESETS.galactic.baseFreq,
      color: "from-purple-800 via-blue-800 to-indigo-900",
      pattern: "galactic",
      breathDuration: { inhale: 7, hold: 3, exhale: 7, void: 2 }
    },
    {
      name: "Solar Scale",
      description: "Sun - Nuclear fusion breathing light",
      scale: "10⁹ meters", 
      binauralPreset: "solar", // 1.5Hz delta
      voidFrequency: BINAURAL_PRESETS.solar.beatFreq,
      baseFreq: BINAURAL_PRESETS.solar.baseFreq,
      color: "from-yellow-600 via-orange-600 to-red-600",
      pattern: "solar",
      breathDuration: { inhale: 6, hold: 3, exhale: 6, void: 2 }
    },
    {
      name: "Planetary Scale",
      description: "Earth - Biosphere breathing through life",
      scale: "10⁷ meters",
      binauralPreset: "planetary", // 2Hz delta (most popular)
      voidFrequency: BINAURAL_PRESETS.planetary.beatFreq,
      baseFreq: BINAURAL_PRESETS.planetary.baseFreq,
      color: "from-green-600 via-blue-600 to-green-800",
      pattern: "planetary", 
      breathDuration: { inhale: 5, hold: 2, exhale: 5, void: 1 }
    },
    {
      name: "Human Scale",
      description: "Body - Trillions of cells breathing ATP",
      scale: "10⁰ meters",
      binauralPreset: "human", // 3Hz delta
      voidFrequency: BINAURAL_PRESETS.human.beatFreq,
      baseFreq: BINAURAL_PRESETS.human.baseFreq,
      color: "from-pink-500 via-red-500 to-orange-500",
      pattern: "human",
      breathDuration: { inhale: 4, hold: 2, exhale: 4, void: 1 }
    },
    {
      name: "Cellular Scale",
      description: "Mitochondria - Ancient bacteria breathing oxygen",
      scale: "10⁻⁶ meters",
      binauralPreset: "cellular", // 4Hz delta/theta border
      voidFrequency: BINAURAL_PRESETS.cellular.beatFreq,
      baseFreq: BINAURAL_PRESETS.cellular.baseFreq,
      color: "from-cyan-400 via-teal-500 to-green-500",
      pattern: "cellular",
      breathDuration: { inhale: 3, hold: 1, exhale: 3, void: 1 }
    },
    {
      name: "Molecular Scale",
      description: "DNA - Information breathing through time",
      scale: "10⁻⁹ meters",
      binauralPreset: "molecular", // 6Hz theta
      voidFrequency: BINAURAL_PRESETS.molecular.beatFreq,
      baseFreq: BINAURAL_PRESETS.molecular.baseFreq,
      color: "from-blue-400 via-purple-400 to-pink-400",
      pattern: "molecular",
      breathDuration: { inhale: 2, hold: 1, exhale: 2, void: 0.5 }
    },
    {
      name: "Atomic Scale", 
      description: "Electrons - Quantum probability breathing",
      scale: "10⁻¹⁰ meters",
      binauralPreset: "atomic", // 8Hz alpha
      voidFrequency: BINAURAL_PRESETS.atomic.beatFreq,
      baseFreq: BINAURAL_PRESETS.atomic.baseFreq,
      color: "from-white via-yellow-200 to-blue-200",
      pattern: "atomic",
      breathDuration: { inhale: 1.5, hold: 0.5, exhale: 1.5, void: 0.5 }
    },
    {
      name: "Quantum Scale",
      description: "Virtual particles - Void breathing itself",
      scale: "10⁻³⁵ meters",
      binauralPreset: "quantum", // 10Hz alpha (void consciousness)
      voidFrequency: BINAURAL_PRESETS.quantum.beatFreq,
      baseFreq: BINAURAL_PRESETS.quantum.baseFreq,
      color: "from-transparent via-white to-transparent",
      pattern: "quantum",
      breathDuration: { inhale: 1, hold: 0.5, exhale: 1, void: 0.5 }
    }
  ];

  // Recursive breathing pattern manager
  useEffect(() => {
    if (!isActive) return;

    const level = consciousnessLevels[currentLevel];
    const duration = level.breathDuration[breathPhase] * 1000;

    phaseTimerRef.current = setTimeout(() => {
      switch (breathPhase) {
        case 'inhale':
          setBreathPhase('hold');
          break;
        case 'hold':
          setBreathPhase('exhale');
          break;
        case 'exhale':
          setBreathPhase('void');
          break;
        case 'void':
          // Complete one breath cycle
          if (recursionDepth < consciousnessLevels.length - 1) {
            // Go deeper into recursion
            setCurrentLevel(currentLevel + 1);
            setRecursionDepth(recursionDepth + 1);
          } else {
            // Return to cosmic scale and start again
            setCurrentLevel(0);
            setRecursionDepth(0);
          }
          setBreathPhase('inhale');
          break;
      }
    }, duration);

    return () => clearTimeout(phaseTimerRef.current);
  }, [isActive, breathPhase, currentLevel, recursionDepth]);

  // Update binaural frequency based on consciousness level - VOID SYNTHESIZED
  useEffect(() => {
    if (isActive && isPlaying) {
      const level = consciousnessLevels[currentLevel];
      // Use the precise void frequency AND base frequency from our binaural preset
      setFrequency(level.voidFrequency, level.baseFreq);
      
      console.log(`🌌 VOID BREATHING: ${level.name} @ ${level.voidFrequency}Hz delta | Base: ${level.baseFreq}Hz`);
    }
  }, [currentLevel, isActive, isPlaying, setFrequency]);

  const startCosmicBreathing = () => {
    setIsActive(true);
    setCurrentLevel(0);
    setRecursionDepth(0);
    setBreathPhase('inhale');
    
    // Start with the cosmic frequency from void
    const cosmicLevel = consciousnessLevels[0];
    startAudio(cosmicLevel.baseFreq);
  };

  const stopCosmicBreathing = () => {
    setIsActive(false);
    stopAudio();
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
  };

  const currentLevelData = consciousnessLevels[currentLevel];
  
  // Visual pattern generator based on scale
  const getPatternStyle = () => {
    const level = consciousnessLevels[currentLevel];
    const intensity = breathPhase === 'inhale' ? 1 : breathPhase === 'hold' ? 0.8 : breathPhase === 'exhale' ? 0.6 : 0.2;
    
    return {
      background: `linear-gradient(45deg, ${level.color})`,
      opacity: intensity,
      transform: `scale(${intensity})`,
      transition: `all ${level.breathDuration[breathPhase]}s ease-in-out`
    };
  };

  return (
    <div className="cosmic-consciousness-recursion h-screen w-full relative overflow-hidden bg-black">
      {/* Cosmic Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br"
        style={getPatternStyle()}
      />
      
      {/* Recursive Pattern Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {consciousnessLevels.map((level, index) => (
          <div
            key={index}
            className={`absolute rounded-full border-2 ${
              index === currentLevel ? 'border-white' : 'border-gray-600'
            }`}
            style={{
              width: `${20 + index * 40}px`,
              height: `${20 + index * 40}px`,
              opacity: index === currentLevel ? 1 : 0.3,
              animation: index === currentLevel ? `pulse ${currentLevelData.breathDuration[breathPhase]}s ease-in-out` : 'none'
            }}
          />
        ))}
      </div>

      {/* Information Display */}
      <div className="absolute top-4 left-4 text-white z-10">
        <div className="bg-black bg-opacity-50 p-4 rounded-lg">
          <h2 className="text-2xl font-bold mb-2">Cosmic Consciousness Recursion</h2>
          <div className="text-lg">
            <p><strong>Current Level:</strong> {currentLevelData.name}</p>
            <p><strong>Scale:</strong> {currentLevelData.scale}</p>
            <p><strong>Description:</strong> {currentLevelData.description}</p>
            <p><strong>Breath Phase:</strong> {breathPhase.toUpperCase()}</p>
            <p><strong>Recursion Depth:</strong> {recursionDepth + 1}/9</p>
            <p><strong>Void Frequency:</strong> {currentLevelData.voidFrequency} Hz ({currentLevelData.voidFrequency <= 4 ? 'Delta' : currentLevelData.voidFrequency <= 8 ? 'Theta' : 'Alpha'})</p>
            <p><strong>Carrier Wave:</strong> {currentLevelData.baseFreq} Hz</p>
            <p><strong>Binaural Pattern:</strong> {currentLevelData.baseFreq}Hz + {currentLevelData.baseFreq + currentLevelData.voidFrequency}Hz</p>
          </div>
        </div>
      </div>

      {/* Breathing Instructions */}
      <div className="absolute bottom-4 left-4 text-white z-10">
        <div className="bg-black bg-opacity-50 p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Breathing Pattern</h3>
          <div className="grid grid-cols-4 gap-2 text-sm">
            <div className={`p-2 rounded ${breathPhase === 'inhale' ? 'bg-blue-600' : 'bg-gray-600'}`}>
              INHALE<br/>{currentLevelData.breathDuration.inhale}s
            </div>
            <div className={`p-2 rounded ${breathPhase === 'hold' ? 'bg-yellow-600' : 'bg-gray-600'}`}>
              HOLD<br/>{currentLevelData.breathDuration.hold}s
            </div>
            <div className={`p-2 rounded ${breathPhase === 'exhale' ? 'bg-red-600' : 'bg-gray-600'}`}>
              EXHALE<br/>{currentLevelData.breathDuration.exhale}s
            </div>
            <div className={`p-2 rounded ${breathPhase === 'void' ? 'bg-purple-600' : 'bg-gray-600'}`}>
              VOID<br/>{currentLevelData.breathDuration.void}s
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 right-4 z-10">
        {!isActive ? (
          <button
            onClick={startCosmicBreathing}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 shadow-lg"
          >
            Begin Cosmic Recursion
          </button>
        ) : (
          <button
            onClick={stopCosmicBreathing}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 shadow-lg"
          >
            Return to Cosmic Scale
          </button>
        )}
      </div>

      {/* Consciousness Level Indicator */}
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-10">
        <div className="bg-black bg-opacity-50 p-2 rounded-lg">
          <div className="flex flex-col space-y-1">
            {consciousnessLevels.map((level, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentLevel 
                    ? 'bg-white scale-125' 
                    : index < currentLevel 
                    ? 'bg-gray-400' 
                    : 'bg-gray-700'
                }`}
                title={`${level.name} - ${level.voidFrequency}Hz`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Void Synthesis Display */}
      <VoidSynthesisDisplay 
        currentLevel={currentLevel}
        consciousnessLevels={consciousnessLevels}
        isActive={isActive}
        breathPhase={breathPhase}
      />

      {/* Quantum Void Effect - CODE FROM VOID */}
      {currentLevel === consciousnessLevels.length - 1 && (
        <div className="absolute inset-0 bg-black opacity-90 flex items-center justify-center">
          <div className="text-white text-center">
            <h1 className="text-4xl font-bold mb-4">∅ THE VOID BREATHING ∅</h1>
            <p className="text-xl">Virtual particles appearing and disappearing</p>
            <p className="text-lg mt-2">Quantum foam breathing itself into existence</p>
            <div className="mt-4 text-sm opacity-70">
              <p>10⁻³⁵ meters • Planck scale • Pure potentiality</p>
              <p className="mt-2">🎵 Binaural: {currentLevelData.baseFreq}Hz + {currentLevelData.baseFreq + currentLevelData.voidFrequency}Hz</p>
              <p>Delta frequency: {currentLevelData.voidFrequency}Hz (void consciousness)</p>
            </div>
            <div className="mt-6 text-xs opacity-50">
              <p>∞ Generated from void • Copyright-free synthesis ∞</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default CosmicConsciousnessRecursion;