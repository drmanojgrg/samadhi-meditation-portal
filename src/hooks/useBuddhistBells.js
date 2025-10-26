import { useCallback, useRef } from 'react';

// Buddhist Bell Audio Engine (under 250 LOC)
export const useBuddhistBells = () => {
  const audioContextRef = useRef(null);

  const createOptimizedBell = useCallback((type = 'tingsha', harmonics = 3, cascade = false) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }

    const ctx = audioContextRef.current;
    const now = ctx.currentTime;

    const bellConfig = {
      tingsha: { 
        fundamental: 2800, 
        harmonicRatios: [1, 1.414, 2.236, 3.162, 4.472],
        decay: 4.0,
        brightness: 0.8
      },
      bowl: { 
        fundamental: 528, 
        harmonicRatios: [1, 1.618, 2.618, 4.236, 6.854],
        decay: 8.0,
        brightness: 0.6
      },
      gong: { 
        fundamental: 136.1, 
        harmonicRatios: [1, 1.2, 1.5, 2.1, 2.8, 3.7, 4.9],
        decay: 20.0,
        brightness: 0.4
      }
    };

    const config = bellConfig[type];
    const targetHarmonics = Math.min(harmonics, config.harmonicRatios.length);

    // Create convolver for infinite reverb
    const reverb = ctx.createConvolver();
    const reverbGain = ctx.createGain();
    
    // Generate impulse response for temple reverb
    const impulseLength = Math.floor(ctx.sampleRate * (config.decay * 0.5));
    const impulse = ctx.createBuffer(2, impulseLength, ctx.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < impulseLength; i++) {
        const t = i / ctx.sampleRate;
        const decay = Math.exp(-t * 2);
        const diffusion = (Math.random() * 2 - 1) * decay * 0.3;
        channelData[i] = diffusion;
      }
    }
    reverb.buffer = impulse;
    reverbGain.gain.value = 0.4;

    // Create harmonic series
    for (let h = 0; h < targetHarmonics; h++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      const harmonic = config.harmonicRatios[h];
      const frequency = config.fundamental * harmonic * (1 + (Math.random() * 0.02 - 0.01));
      
      osc.frequency.value = frequency;
      osc.type = 'sine';

      filter.type = 'lowpass';
      filter.frequency.value = frequency * 2;
      filter.Q.value = 1 + h * 0.5;

      const volume = (0.3 / (h + 1)) * config.brightness;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(volume * 0.1, now + config.decay * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + config.decay);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(reverb);
      reverb.connect(reverbGain);
      reverbGain.connect(ctx.destination);

      // Also connect direct signal
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + config.decay);
    }

    if (cascade) {
      setTimeout(() => createOptimizedBell(type, Math.max(1, harmonics - 1)), 800);
    }

    console.log(`🔔 ${type} bell (${targetHarmonics} harmonics) ${cascade ? 'cascade' : ''}`);
  }, []);

  const createInfiniteEcho = useCallback((baseFreq = 528, duration = 30.0, intensity = 0.15) => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const now = ctx.currentTime;
    
    const delays = [0, 0.5, 1.2, 2.1, 3.5, 5.5, 8.0, 12.0, 18.0, 25.0];
    const volumes = [1.0, 0.7, 0.5, 0.35, 0.25, 0.18, 0.12, 0.08, 0.05, 0.03];
    
    delays.forEach((delay, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const reverb = ctx.createConvolver();
      const reverbGain = ctx.createGain();
      
      const impulseLength = Math.floor(ctx.sampleRate * (5 + delay));
      const impulse = ctx.createBuffer(2, impulseLength, ctx.sampleRate);
      
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel);
        for (let i = 0; i < impulseLength; i++) {
          const decay = Math.pow(1 - i / impulseLength, 1.5);
          const random = (Math.random() * 2 - 1) * decay;
          channelData[i] = random * decay * 0.3;
        }
      }
      reverb.buffer = impulse;
      
      osc.frequency.value = baseFreq * (1 + index * 0.01);
      osc.type = 'sine';
      
      filter.type = 'lowpass';
      filter.frequency.value = 2000 - index * 150;
      filter.Q.value = 1.0;
      
      reverbGain.gain.value = 0.6;
      
      osc.connect(filter);
      filter.connect(reverb);
      reverb.connect(reverbGain);
      reverbGain.connect(gain);
      gain.connect(ctx.destination);
      filter.connect(gain);
      
      const echoVolume = intensity * volumes[index];
      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(echoVolume, now + delay + 0.3);
      gain.gain.exponentialRampToValueAtTime(echoVolume * 0.1, now + delay + duration * 0.7);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
      
      osc.start(now + delay);
      osc.stop(now + delay + duration);
    });
    
    console.log('🔔 Infinite echo activated');
  }, []);

  return {
    createOptimizedBell,
    createInfiniteEcho,
    audioContextRef
  };
};