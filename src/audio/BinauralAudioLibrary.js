/**
 * 🎵 BINAURAL AUDIO LIBRARY
 * Copyright-free binaural delta beats for cosmic consciousness meditation
 */

// Copyright-free delta binaural beat configurations
export const BINAURAL_PRESETS = {
  // 0.5 Hz - Deep cosmic consciousness (for universe scale)
  cosmic: {
    name: "Cosmic Consciousness",
    baseFreq: 40,
    beatFreq: 0.5,
    description: "Deep delta for cosmic awareness and universal connection",
    duration: "infinite",
    license: "Generated - Copyright Free"
  },

  // 1 Hz - Galactic awareness
  galactic: {
    name: "Galactic Awareness", 
    baseFreq: 60,
    beatFreq: 1,
    description: "Delta waves for galactic scale consciousness",
    duration: "infinite",
    license: "Generated - Copyright Free"
  },

  // 1.5 Hz - Solar consciousness
  solar: {
    name: "Solar Consciousness",
    baseFreq: 52,
    beatFreq: 1.5, 
    description: "Mid-delta for solar system awareness",
    duration: "infinite",
    license: "Generated - Copyright Free"
  },

  // 2 Hz - Planetary awareness (most popular delta frequency)
  planetary: {
    name: "Planetary Consciousness",
    baseFreq: 100,
    beatFreq: 2,
    description: "Classic delta for Earth consciousness and deep meditation",
    duration: "infinite", 
    license: "Generated - Copyright Free"
  },

  // 3 Hz - Human consciousness
  human: {
    name: "Human Consciousness",
    baseFreq: 440,
    beatFreq: 3,
    description: "Delta waves for human-scale awareness and healing",
    duration: "infinite",
    license: "Generated - Copyright Free"
  },

  // 4 Hz - Cellular consciousness (border delta/theta)
  cellular: {
    name: "Cellular Consciousness", 
    baseFreq: 52,
    beatFreq: 4,
    description: "High delta for cellular awareness and regeneration",
    duration: "infinite",
    license: "Generated - Copyright Free"
  },

  // 6 Hz - Molecular consciousness (theta range)
  molecular: {
    name: "Molecular Consciousness",
    baseFreq: 60,
    beatFreq: 6,
    description: "Theta waves for molecular and DNA consciousness",
    duration: "infinite", 
    license: "Generated - Copyright Free"
  },

  // 8 Hz - Atomic consciousness (alpha range)
  atomic: {
    name: "Atomic Consciousness",
    baseFreq: 40,
    beatFreq: 8,
    description: "Alpha waves for atomic scale awareness",
    duration: "infinite",
    license: "Generated - Copyright Free"
  },

  // 10 Hz - Quantum consciousness (alpha range)
  quantum: {
    name: "Quantum Consciousness",
    baseFreq: 100,
    beatFreq: 10,
    description: "Alpha waves for quantum field awareness and void consciousness",
    duration: "infinite", 
    license: "Generated - Copyright Free"
  }
};

// External copyright-free resources found on Freesound.org
export const EXTERNAL_BINAURAL_RESOURCES = [
  {
    name: "60-64-delta.aif",
    url: "https://freesound.org/people/iantm/sounds/75309/",
    description: "4Hz delta binaural beats, 30 second perfect loop",
    frequencies: "60Hz and 64Hz (4Hz beat)",
    license: "Creative Commons 0 (Public Domain)",
    duration: "0:30",
    author: "iantm",
    downloadable: true,
    format: "AIF"
  },
  {
    name: "Delta Wave 2Hz Binaural Beat", 
    url: "https://freesound.org/people/Theylienn/sounds/797922/",
    description: "Hour-long 2Hz delta binaural beat at 100Hz carrier",
    frequencies: "100Hz carrier with 2Hz beat",
    license: "Creative Commons (check specific license)",
    duration: "60:00",
    author: "Theylienn", 
    downloadable: true,
    format: "MP3"
  },
  {
    name: "Binaural_Delta_440_440-5Hz.mp3",
    url: "https://freesound.org/people/pbabin/sounds/414271/",
    description: "440Hz carrier with 0.5Hz delta beat",
    frequencies: "440Hz and 440.5Hz (0.5Hz beat)",
    license: "Creative Commons (check specific)",
    duration: "10:00",
    author: "pbabin",
    downloadable: true,
    format: "MP3"
  },
  {
    name: "Binaural_Delta_52_52-5Hz.mp3", 
    url: "https://freesound.org/people/pbabin/sounds/414273/",
    description: "52Hz carrier with 0.5Hz delta beat",
    frequencies: "52Hz and 52.5Hz (0.5Hz beat)",
    license: "Creative Commons (check specific)",
    duration: "10:00", 
    author: "pbabin",
    downloadable: true,
    format: "MP3"
  },
  {
    name: "Binaural_Delta_60_61-5Hz.mp3",
    url: "https://freesound.org/people/pbabin/sounds/414274/",
    description: "60Hz carrier with 1.5Hz delta beat", 
    frequencies: "60Hz and 61.5Hz (1.5Hz beat)",
    license: "Creative Commons (check specific)",
    duration: "10:00",
    author: "pbabin",
    downloadable: true,
    format: "MP3"
  },
  {
    name: "Binaural Beats Alpha to Delta and Back",
    url: "https://freesound.org/people/WIM/sounds/676878/", 
    description: "Progressive binaural beat session from alpha to delta",
    frequencies: "Multiple frequencies transitioning",
    license: "Creative Commons (check specific)",
    duration: "70:00",
    author: "WIM",
    downloadable: true,
    format: "MP3"
  }
];

// Instructions for downloading and using external resources
export const DOWNLOAD_INSTRUCTIONS = {
  freesound: {
    steps: [
      "1. Visit freesound.org and create a free account",
      "2. Search for the specific sound by name or URL", 
      "3. Check the Creative Commons license (CC0 is public domain)",
      "4. Download the file in your preferred format",
      "5. Place in src/audio/samples/ directory",
      "6. Import and use with the WebAudio API"
    ],
    note: "Always verify the specific Creative Commons license before commercial use"
  },
  
  integration: {
    steps: [
      "1. Download copyright-free binaural beats",
      "2. Convert to web-compatible format (MP3, OGG, WAV)", 
      "3. Place files in public/audio/ directory",
      "4. Use HTML5 Audio API or Web Audio API to play",
      "5. Implement seamless looping for meditation sessions",
      "6. Add volume controls and fade in/out effects"
    ]
  }
};

// Open source binaural beat generators (completely copyright free)
export const OPEN_SOURCE_GENERATORS = [
  {
    name: "Gnaural",
    description: "Open source binaural beat generator",
    url: "http://gnaural.sourceforge.net/",
    license: "GPL",
    platforms: ["Windows", "Mac", "Linux"],
    note: "Can generate any frequency combination you need"
  },
  {
    name: "SBaGen", 
    description: "Sequenced Binaural Beat Generator",
    url: "http://uazu.net/sbagen/",
    license: "GPL",
    platforms: ["Windows", "Mac", "Linux"], 
    note: "Command-line tool for precise binaural beat generation"
  },
  {
    name: "Brain Wave Generator",
    description: "Windows binaural beat software",
    url: "https://www.bwgen.com/",
    license: "Freeware for personal use",
    platforms: ["Windows"],
    note: "User-friendly interface with preset programs"
  }
];

// Web Audio API implementation for generating binaural beats
export class CopyrightFreeBinauralGenerator {
  constructor() {
    this.audioContext = null;
    this.oscillators = [];
    this.gainNodes = [];
  }

  async generateBinauralBeat(preset) {
    const config = BINAURAL_PRESETS[preset];
    if (!config) {
      throw new Error(`Preset '${preset}' not found`);
    }

    // This generates the binaural beat directly in the browser
    // Completely copyright-free as it's synthesized on-demand
    
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Left channel - base frequency
    const leftOsc = this.audioContext.createOscillator();
    leftOsc.frequency.setValueAtTime(config.baseFreq, this.audioContext.currentTime);
    leftOsc.type = 'sine';

    // Right channel - base frequency + beat frequency  
    const rightOsc = this.audioContext.createOscillator();
    rightOsc.frequency.setValueAtTime(config.baseFreq + config.beatFreq, this.audioContext.currentTime);
    rightOsc.type = 'sine';

    // Stereo panning
    const leftPanner = this.audioContext.createStereoPanner();
    leftPanner.pan.setValueAtTime(-1, this.audioContext.currentTime);
    
    const rightPanner = this.audioContext.createStereoPanner();
    rightPanner.pan.setValueAtTime(1, this.audioContext.currentTime);

    // Gain control
    const leftGain = this.audioContext.createGain();
    const rightGain = this.audioContext.createGain();
    const masterGain = this.audioContext.createGain();
    
    leftGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    rightGain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    masterGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);

    // Connect the audio graph
    leftOsc.connect(leftGain);
    rightOsc.connect(rightGain);
    
    leftGain.connect(leftPanner);
    rightGain.connect(rightPanner);
    
    leftPanner.connect(masterGain);
    rightPanner.connect(masterGain);
    
    masterGain.connect(this.audioContext.destination);

    // Store references for cleanup
    this.oscillators = [leftOsc, rightOsc];
    this.gainNodes = [leftGain, rightGain, masterGain];

    return {
      start: () => {
        leftOsc.start();
        rightOsc.start(); 
      },
      stop: () => {
        leftOsc.stop();
        rightOsc.stop();
      },
      setVolume: (volume) => {
        masterGain.gain.setTargetAtTime(volume, this.audioContext.currentTime, 0.1);
      }
    };
  }

  cleanup() {
    this.oscillators.forEach(osc => {
      try { osc.stop(); } catch(e) {}
    });
    
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

export default {
  BINAURAL_PRESETS,
  EXTERNAL_BINAURAL_RESOURCES, 
  DOWNLOAD_INSTRUCTIONS,
  OPEN_SOURCE_GENERATORS,
  CopyrightFreeBinauralGenerator
};