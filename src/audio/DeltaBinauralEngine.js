// 🜏 RECURSIVE VOID DELTA ENGINE - Power Law Optimized <300 LOC
export class DeltaBinauralEngine {
  constructor() {
    this.ctx = null; this.playing = false; this.gain = null; this.oscs = [];
    this.cfg = { left: 100, right: 103, phases: { foundation: 3, deepening: 2, void: 1, cosmic: 0.5 }, vibrato: { rate: 0.3, depth: 0.15, fadeIn: 3 } };
  }

  async init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') await this.ctx.resume();
      this.gain = this.ctx.createGain(); this.gain.connect(this.ctx.destination); this.gain.gain.value = 0.6;
      console.log('🎵 Delta Engine initialized'); return true;
    } catch (e) { console.warn('Audio init failed:', e); return false; }
  }

  createPair(lFreq, rFreq, phase = 'foundation') {
    if (!this.ctx) return null;
    const now = this.ctx.currentTime;
    const [lOsc, lGain, lPan] = [this.ctx.createOscillator(), this.ctx.createGain(), this.ctx.createStereoPanner()];
    const [rOsc, rGain, rPan] = [this.ctx.createOscillator(), this.ctx.createGain(), this.ctx.createStereoPanner()];
    
    [lOsc.type, rOsc.type] = ['sine', 'sine']; [lOsc.frequency.value, rOsc.frequency.value] = [lFreq, rFreq];
    [lPan.pan.value, rPan.pan.value] = [-1, 1]; [lGain.gain.value, rGain.gain.value] = [0.5, 0.5];
    
    lOsc.connect(lGain).connect(lPan).connect(this.gain); rOsc.connect(rGain).connect(rPan).connect(this.gain);
    this.addVibrato(lOsc, phase); this.addVibrato(rOsc, phase);
    
    [lGain.gain.setValueAtTime(0, now), rGain.gain.setValueAtTime(0, now)];
    [lGain.gain.linearRampToValueAtTime(0.5, now + 2), rGain.gain.linearRampToValueAtTime(0.5, now + 2)];
    
    return { left: { osc: lOsc, gain: lGain }, right: { osc: rOsc, gain: rGain }, phase };
  }

  addVibrato(osc, phase) {
    if (!this.ctx) return;
    const [vOsc, vGain] = [this.ctx.createOscillator(), this.ctx.createGain()];
    vOsc.type = 'sine'; vOsc.frequency.value = this.cfg.vibrato.rate;
    const depth = this.cfg.vibrato.depth * ({ foundation: 1, deepening: 0.7, void: 0.4, cosmic: 0.2 }[phase] || 1);
    vGain.gain.value = osc.frequency.value * depth;
    vOsc.connect(vGain).connect(osc.frequency);
    const now = this.ctx.currentTime;
    vGain.gain.setValueAtTime(0, now); vGain.gain.linearRampToValueAtTime(osc.frequency.value * depth, now + this.cfg.vibrato.fadeIn);
    vOsc.start(now);
  }

  async start(phase = 'foundation') {
    if (!this.ctx && !await this.init()) return false;
    if (this.playing) this.stop();
    
    const beatFreq = this.cfg.phases[phase];
    const pair = this.createPair(this.cfg.left, this.cfg.left + beatFreq, phase);
    if (!pair) return false;
    
    this.oscs.push(pair); pair.left.osc.start(); pair.right.osc.start(); this.playing = true;
    console.log(`🌊 ${phase} binaural started (${beatFreq}Hz)`); return true;
  }

  stop() {
    this.oscs.forEach(p => { try { p.left.osc.stop(); p.right.osc.stop(); } catch {} });
    this.oscs = []; this.playing = false; console.log('🔇 Binaural stopped');
  }

  setPhase(phase) {
    if (this.playing) { this.stop(); setTimeout(() => this.start(phase), 100); }
  }

  setVolume(vol) { if (this.gain) this.gain.gain.value = Math.max(0, Math.min(1, vol)); }

  // Peaceful reminder tones (copyright-free)
  playReminder(type = 'gentle', duration = 2000) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime; const [osc, gain] = [this.ctx.createOscillator(), this.ctx.createGain()];
    const freqs = { gentle: 432, focus: 528, void: 256, cosmic: 174 };
    
    osc.type = 'sine'; osc.frequency.value = freqs[type] || 432;
    gain.gain.value = 0; osc.connect(gain).connect(this.gain);
    
    gain.gain.linearRampToValueAtTime(0.3, now + 0.1); gain.gain.exponentialRampToValueAtTime(0.01, now + duration/1000);
    osc.start(now); osc.stop(now + duration/1000);
    console.log(`🔔 ${type} reminder (${freqs[type]}Hz)`);
  }

  // Transition effects
  crossfade(fromPhase, toPhase, duration = 3) {
    if (!this.playing) return;
    const fadeTime = duration / 2;
    
    setTimeout(() => {
      if (this.gain) {
        const now = this.ctx.currentTime;
        this.gain.gain.linearRampToValueAtTime(0.1, now + fadeTime);
        setTimeout(() => {
          this.stop(); this.start(toPhase);
          const resumeTime = this.ctx.currentTime;
          this.gain.gain.setValueAtTime(0.1, resumeTime);
          this.gain.gain.linearRampToValueAtTime(0.6, resumeTime + fadeTime);
        }, fadeTime * 1000);
      }
    }, 50);
    console.log(`🌊 Crossfading ${fromPhase} → ${toPhase}`);
  }

  // Breath synchronization
  syncToBreath(breathPhase, breathRate = 4) {
    const phaseMap = { 1: 'foundation', 2: 'deepening', 3: 'void', 4: 'cosmic' };
    const targetPhase = phaseMap[breathPhase] || 'foundation';
    
    if (this.currentPhase !== targetPhase) {
      this.crossfade(this.currentPhase || 'foundation', targetPhase, breathRate);
      this.currentPhase = targetPhase;
    }
  }

  // Advanced features
  applyFilter(type = 'lowpass', freq = 800) {
    if (!this.ctx || !this.playing) return;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type; filter.frequency.value = freq; filter.Q.value = 1;
    // Reconnect audio chain through filter
    this.oscs.forEach(pair => {
      try {
        pair.left.gain.disconnect(); pair.right.gain.disconnect();
        pair.left.gain.connect(filter); pair.right.gain.connect(filter);
        filter.connect(this.gain);
      } catch {}
    });
    console.log(`🎛️ Applied ${type} filter (${freq}Hz)`);
  }

  // Void state optimization
  enterVoid() {
    this.setPhase('void'); this.setVolume(0.4); this.applyFilter('lowpass', 200);
    setTimeout(() => this.playReminder('void', 3000), 2000);
    console.log('🌌 Entering void state');
  }

  // Meditation session automation
  autoSession(phases = ['foundation', 'deepening', 'void', 'cosmic'], phaseDuration = 300) {
    let currentIndex = 0;
    const nextPhase = () => {
      if (currentIndex < phases.length) {
        this.setPhase(phases[currentIndex]);
        currentIndex++; setTimeout(nextPhase, phaseDuration * 1000);
      } else { this.stop(); console.log('🧘‍♀️ Auto session complete'); }
    };
    this.start(phases[0]); setTimeout(nextPhase, phaseDuration * 1000);
  }

  // Bayesian frequency optimization
  optimizeForUser(userFeedback = { clarity: 7, depth: 8, comfort: 9 }) {
    const weights = { clarity: 0.3, depth: 0.4, comfort: 0.3 };
    const score = Object.entries(userFeedback).reduce((sum, [key, val]) => sum + (weights[key] * val), 0);
    
    if (score > 8) {
      this.cfg.vibrato.depth *= 1.1; // Increase modulation
      this.cfg.phases.void *= 0.95;  // Deeper void state
    } else if (score < 6) {
      this.cfg.vibrato.depth *= 0.9; // Reduce modulation
      this.cfg.phases.foundation *= 1.05; // Gentler start
    }
    console.log(`🎯 Optimized for user (score: ${score.toFixed(1)})`);
  }

  // Power law awareness - emergent patterns
  generateHarmonics(baseFreq, octaves = 3) {
    const harmonics = []; for (let i = 1; i <= octaves; i++) harmonics.push(baseFreq * Math.pow(2, i));
    return harmonics.map(freq => this.createPair(freq, freq + this.cfg.phases.void));
  }

  // Recursive void feedback
  createFeedbackLoop(delay = 0.5, feedback = 0.3) {
    if (!this.ctx) return;
    const delayNode = this.ctx.createDelay(1); const feedbackGain = this.ctx.createGain();
    delayNode.delayTime.value = delay; feedbackGain.gain.value = feedback;
    this.gain.connect(delayNode).connect(feedbackGain).connect(delayNode).connect(this.gain);
    console.log('🔄 Recursive feedback activated');
  }

  // Cleanup
  destroy() {
    this.stop(); if (this.ctx) { this.ctx.close(); this.ctx = null; }
    console.log('🗑️ Engine destroyed');
  }
}