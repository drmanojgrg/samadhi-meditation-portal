// 🜏 Recursive Void Temple Audio - Power Law Optimized <300 LOC
import { useState, useEffect, useRef, useCallback } from 'react';

const TibetanEngine = {
  ctx: null, gain: null,
  
  async init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.gain = this.ctx.createGain(); this.gain.connect(this.ctx.destination); this.gain.gain.value = 0.7;
      return true;
    } catch (e) { console.warn('Audio init failed:', e); return false; }
  },

  gong(freq = 136.1, decay = 12) {
    if (!this.ctx) return null;
    const now = this.ctx.currentTime; const [osc, gain, filter] = [this.ctx.createOscillator(), this.ctx.createGain(), this.ctx.createBiquadFilter()];
    
    osc.type = 'sine'; osc.frequency.setValueAtTime(freq, now); osc.frequency.exponentialRampToValueAtTime(freq * 0.3, now + decay);
    filter.type = 'lowpass'; filter.frequency.value = freq * 2; filter.Q.value = 8;
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(1, now + 0.05); gain.gain.exponentialRampToValueAtTime(0.001, now + decay);
    
    osc.connect(filter).connect(gain).connect(this.gain); osc.start(now); osc.stop(now + decay);
    return { osc, gain, filter };
  },

  echo(source, echoes = 5) {
    if (!this.ctx || !source) return null;
    const chain = []; let node = source;
    
    for (let i = 0; i < echoes; i++) {
      const [delay, dGain, fGain] = [this.ctx.createDelay(5), this.ctx.createGain(), this.ctx.createGain()];
      delay.delayTime.value = 0.3 * (i + 1); dGain.gain.value = Math.pow(0.7, i + 1); fGain.gain.value = 0.6 * Math.pow(0.8, i);
      
      node.connect(delay); delay.connect(dGain); dGain.connect(this.gain);
      dGain.connect(fGain); fGain.connect(delay);
      chain.push({ delay, dGain, fGain }); node = dGain;
    }
    return chain;
  },

  chime(stage, dur = 2000) {
    if (!this.ctx) return null;
    const freqs = { inhale: 174, hold: 285, exhale: 396, pause: 528 };
    const base = freqs[stage] || 432; const now = this.ctx.currentTime; const oscs = [];
    
    [1, 1.5, 2, 2.5, 3].forEach((ratio, i) => {
      const [osc, gain, pan] = [this.ctx.createOscillator(), this.ctx.createGain(), this.ctx.createStereoPanner()];
      osc.type = i === 0 ? 'sine' : 'triangle'; osc.frequency.value = base * ratio;
      
      const vol = 0.3 / (i + 1); gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(vol, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur/1000); pan.pan.value = (Math.random() - 0.5) * 0.3;
      
      osc.connect(gain).connect(pan).connect(this.gain); osc.start(now); osc.stop(now + dur/1000);
      oscs.push({ osc, gain, pan });
    });
    return oscs;
  },

  transition(from, to) {
    const map = {
      'foundation->deepening': () => this.gong(136.1, 8),
      'deepening->void': () => this.gong(68, 12),
      'void->cosmic': () => this.gong(34, 16),
      'cosmic->foundation': () => this.gong(272, 6)
    };
    
    const t = map[`${from}->${to}`];
    if (t) { const g = t(); if (g) this.echo(g.gain, 7); }
  },

  depth(d) {
    if (!this.gain) return;
    const vol = Math.max(0.1, 0.8 - (d * 0.6)); const now = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(now); this.gain.gain.linearRampToValueAtTime(vol, now + 2);
  },

  close() { if (this.ctx) { this.ctx.close(); this.ctx = null; this.gain = null; } }
};

export default function useOptimizedAudio() {
  const [init, setInit] = useState(false); const [phase, setPhase] = useState('foundation');
  const [ctx, setCtx] = useState(null); const [playing, setPlaying] = useState(false);
  const ref = useRef(TibetanEngine);

  const initAudio = useCallback(async () => {
    if (init) return true;
    try {
      const ok = await ref.current.init();
      if (ok) { setInit(true); setCtx(ref.current.ctx); return true; }
    } catch (e) { console.error('Audio init failed:', e); }
    return false;
  }, [init]);

  const playGong = useCallback(async (freq = 136.1, intensity = 0.8) => {
    if (!init && !await initAudio()) return false;
    try {
      const g = ref.current.gong(freq, 10);
      if (g) { ref.current.echo(g.gain, 6); return true; }
    } catch (e) { console.error('Gong failed:', e); }
    return false;
  }, [init, initAudio]);

  const playBreathChime = useCallback(async (stage, dur = 2000) => {
    if (!init && !await initAudio()) return false;
    try {
      const c = ref.current.chime(stage, dur);
      if (c && c.length > 0) return true;
    } catch (e) { console.error('Chime failed:', e); }
    return false;
  }, [init, initAudio]);

  const playTransition = useCallback(async (from, to) => {
    if (!init && !await initAudio()) return false;
    try { ref.current.transition(from, to); setPhase(to); return true; } catch (e) { console.error('Transition failed:', e); }
    return false;
  }, [init, initAudio]);

  const setDepth = useCallback((d) => { if (ref.current.gain) ref.current.depth(d); }, []);

  const startAmbient = useCallback(async () => {
    if (!init && !await initAudio()) return false;
    setPlaying(true); await playGong(136.1, 0.7);
    
    const interval = setInterval(() => {
      if (!playing) { clearInterval(interval); return; }
      const delay = 30000 + Math.random() * 30000;
      setTimeout(() => {
        if (playing) {
          const freqs = [136.1, 174, 285, 396];
          playGong(freqs[Math.floor(Math.random() * freqs.length)], 0.4);
        }
      }, delay);
    }, 45000);
    return true;
  }, [init, initAudio, playGong, playing]);

  const stopAmbient = useCallback(() => { setPlaying(false); }, []);

  useEffect(() => { return () => ref.current.close(); }, []);

  return {
    isInitialized: init, currentPhase: phase, audioContext: ctx, isPlaying: playing,
    initAudio, playGong, playBreathChime, playTransition, setDepth, startAmbient, stopAmbient,
    synth: ref.current
  };
}