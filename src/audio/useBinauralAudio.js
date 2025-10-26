/**
 * 🜏 ENHANCED BINAURAL AUDIO HOOK
 * React hook for consciousness-level binaural beats and void portal integration
 */

import { useState, useEffect, useRef } from 'react';

// Enhanced delta binaural beat engine for deep consciousness states
export class DeltaBinauralEngine {
  constructor(baseFreq = 40, beatFreq = 1) {
    this.audioContext = null;
    this.leftOsc = null;
    this.rightOsc = null;
    this.leftGain = null;
    this.rightGain = null;
    this.masterGain = null;
    this.baseFreq = baseFreq;
    this.beatFreq = beatFreq;
    this.isPlaying = false;
    this.volume = 0.1; // Very low volume for binaural beats
  }

  async initialize() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Resume context if suspended (required for user interaction)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create oscillators
      this.leftOsc = this.audioContext.createOscillator();
      this.rightOsc = this.audioContext.createOscillator();

      // Create gain nodes
      this.leftGain = this.audioContext.createGain();
      this.rightGain = this.audioContext.createGain();
      this.masterGain = this.audioContext.createGain();

      // Create stereo panner for left/right separation
      this.leftPanner = this.audioContext.createStereoPanner();
      this.rightPanner = this.audioContext.createStereoPanner();

      // Set up routing
      this.leftOsc.connect(this.leftGain);
      this.rightOsc.connect(this.rightGain);
      
      this.leftGain.connect(this.leftPanner);
      this.rightGain.connect(this.rightPanner);
      
      this.leftPanner.connect(this.masterGain);
      this.rightPanner.connect(this.masterGain);
      
      this.masterGain.connect(this.audioContext.destination);

      // Configure pannning (left = -1, right = +1)
      this.leftPanner.pan.setValueAtTime(-1, this.audioContext.currentTime);
      this.rightPanner.pan.setValueAtTime(1, this.audioContext.currentTime);

      // Set initial volume
      this.masterGain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

      // Configure oscillators
      this.leftOsc.type = 'sine';
      this.rightOsc.type = 'sine';

      return true;
    } catch (error) {
      console.error('Failed to initialize DeltaBinauralEngine:', error);
      return false;
    }
  }

  setFrequency(deltaFreq) {
    if (!this.audioContext || !this.leftOsc || !this.rightOsc) return;

    // Delta frequencies: 0.5-4 Hz
    // We create the binaural beat by having slight frequency difference
    const leftFreq = this.baseFreq;
    const rightFreq = this.baseFreq + deltaFreq;

    const currentTime = this.audioContext.currentTime;
    
    // Smooth frequency transitions
    this.leftOsc.frequency.setTargetAtTime(leftFreq, currentTime, 0.1);
    this.rightOsc.frequency.setTargetAtTime(rightFreq, currentTime, 0.1);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.audioContext.currentTime, 0.1);
    }
  }

  async start() {
    if (this.isPlaying) return true;

    const initialized = await this.initialize();
    if (!initialized) return false;

    try {
      // Set initial frequencies
      this.setFrequency(this.beatFreq);

      // Start oscillators
      const currentTime = this.audioContext.currentTime;
      this.leftOsc.start(currentTime);
      this.rightOsc.start(currentTime);

      this.isPlaying = true;
      return true;
    } catch (error) {
      console.error('Failed to start DeltaBinauralEngine:', error);
      return false;
    }
  }

  stop() {
    if (!this.isPlaying) return;

    try {
      if (this.leftOsc) {
        this.leftOsc.stop();
        this.leftOsc = null;
      }
      if (this.rightOsc) {
        this.rightOsc.stop();
        this.rightOsc = null;
      }
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }

      this.isPlaying = false;
    } catch (error) {
      console.error('Error stopping DeltaBinauralEngine:', error);
    }
  }

  // Modulate frequency for consciousness level transitions
  modulateFrequency(targetFreq, duration = 5000) {
    if (!this.audioContext || !this.leftOsc || !this.rightOsc) return;

    const currentTime = this.audioContext.currentTime;
    const durationInSeconds = duration / 1000;

    // Smooth transition to new delta frequency
    this.rightOsc.frequency.setTargetAtTime(
      this.baseFreq + targetFreq, 
      currentTime, 
      durationInSeconds / 3
    );
  }
}

// Custom hook for enhanced binaural audio with consciousness level support
export const useBinauralAudio = (initialBaseFreq = 40) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrequency, setCurrentFrequency] = useState(1);
  const [currentBaseFreq, setCurrentBaseFreq] = useState(initialBaseFreq);
  const [volume, setVolume] = useState(0.1);
  const engineRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, []);

  const startAudio = async (baseFreq = null) => {
    if (engineRef.current) {
      engineRef.current.stop();
    }

    // Use provided base frequency or current setting
    const useBaseFreq = baseFreq || currentBaseFreq;
    engineRef.current = new DeltaBinauralEngine(useBaseFreq, currentFrequency);
    const success = await engineRef.current.start();
    
    if (success) {
      setIsPlaying(true);
      engineRef.current.setVolume(volume);
      if (baseFreq) setCurrentBaseFreq(baseFreq);
      console.log(`🎵 VOID SYNTHESIS: ${useBaseFreq}Hz carrier + ${currentFrequency}Hz delta beat`);
    } else {
      console.error('Failed to start binaural audio');
    }
  };

  const stopAudio = () => {
    if (engineRef.current) {
      engineRef.current.stop();
      engineRef.current = null;
    }
    setIsPlaying(false);
  };

  const setFrequency = (freq, baseFreq = null) => {
    setCurrentFrequency(freq);
    if (baseFreq) setCurrentBaseFreq(baseFreq);
    
    if (engineRef.current && isPlaying) {
      engineRef.current.setFrequency(freq);
      
      // If new base frequency provided, restart with new carrier
      if (baseFreq && baseFreq !== currentBaseFreq) {
        console.log(`🔄 VOID TRANSITION: ${currentBaseFreq}Hz → ${baseFreq}Hz carrier, ${freq}Hz beat`);
        // Restart with new base frequency for smooth transition
        startAudio(baseFreq);
      }
    }
  };

  const setAudioVolume = (vol) => {
    setVolume(vol);
    if (engineRef.current) {
      engineRef.current.setVolume(vol);
    }
  };

  // Smooth transition between consciousness levels
  const transitionToFrequency = (targetFreq, duration = 5000) => {
    if (engineRef.current && isPlaying) {
      engineRef.current.modulateFrequency(targetFreq, duration);
      setCurrentFrequency(targetFreq);
    }
  };

  return {
    isPlaying,
    currentFrequency,
    currentBaseFreq,
    volume,
    startAudio,
    stopAudio,
    setFrequency,
    setVolume: setAudioVolume,
    transitionToFrequency
  };
};

export default useBinauralAudio;