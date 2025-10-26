/**
 * 🜏 BINAURAL AUDIO HOOK
 * React hook for integrating delta binaural beats with the void portal
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import DeltaBinauralEngine from './DeltaBinauralEngine';

export const useBinauralAudio = (isActive, breathPhase, breathCount) => {
  const engineRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('foundation');
  const [volume, setVolume] = useState(0.6);

  // Initialize the binaural engine
  const initializeEngine = useCallback(async () => {
    if (!engineRef.current) {
      engineRef.current = new DeltaBinauralEngine();
      const success = await engineRef.current.initialize();
      setIsInitialized(success);
      return success;
    }
    return true;
  }, []);

  // Map breath phases to binaural phases
  const getBinauralPhase = useCallback((breathPhase, breathCount) => {
    if (breathPhase === 1) return 'foundation';    // 3Hz - Grounding
    if (breathPhase === 2) return 'deepening';     // 2Hz - Transformation  
    if (breathPhase === 3 && breathCount < 30) return 'void';      // 1Hz - Void entry
    if (breathPhase === 3 && breathCount >= 30) return 'cosmic';   // 0.5Hz - Deep void
    return 'foundation';
  }, []);

  // Start binaural audio
  const startBinaural = useCallback(async () => {
    if (!engineRef.current) {
      await initializeEngine();
    }
    
    if (engineRef.current && isInitialized) {
      const phase = getBinauralPhase(breathPhase, breathCount);
      engineRef.current.start(phase);
      setCurrentPhase(phase);
      return true;
    }
    return false;
  }, [isInitialized, breathPhase, breathCount, getBinauralPhase, initializeEngine]);

  // Stop binaural audio
  const stopBinaural = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.stop();
    }
  }, []);

  // Adjust volume
  const adjustVolume = useCallback((newVolume) => {
    if (engineRef.current) {
      engineRef.current.adjustVolume(newVolume);
      setVolume(newVolume);
    }
  }, []);

  // Handle breath phase transitions
  useEffect(() => {
    if (isActive && engineRef.current && engineRef.current.isPlaying) {
      const newPhase = getBinauralPhase(breathPhase, breathCount);
      
      if (newPhase !== currentPhase) {
        engineRef.current.transitionToPhase(newPhase);
        setCurrentPhase(newPhase);
        console.log(`🔄 Binaural phase transition: ${currentPhase} → ${newPhase}`);
      }
    }
  }, [breathPhase, breathCount, isActive, currentPhase, getBinauralPhase]);

  // Handle activation/deactivation
  useEffect(() => {
    if (isActive) {
      startBinaural();
    } else {
      stopBinaural();
    }
    
    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [isActive, startBinaural, stopBinaural]);

  // Get current binaural info
  const getBinauralInfo = useCallback(() => {
    if (!engineRef.current) return null;
    
    return {
      isPlaying: engineRef.current.isPlaying,
      currentBeat: engineRef.current.getCurrentBeat(),
      phase: currentPhase,
      sessionDuration: engineRef.current.getSessionDuration(),
      volume: volume
    };
  }, [currentPhase, volume]);

  return {
    isInitialized,
    currentPhase,
    volume,
    initializeEngine,
    startBinaural,
    stopBinaural,
    adjustVolume,
    getBinauralInfo
  };
};

export default useBinauralAudio;