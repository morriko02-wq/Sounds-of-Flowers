/**
 * Ambient Garden & Forest Soundscape Engine
 * Featuring the official background soundtrack:
 * "Landscape With a Fairy" by aspidistrafly (A Little Fable)
 *
 * Combines organic Web Audio acoustic guitar arpeggios, music box fairy bells,
 * gentle forest wind rustling through leaves, distant garden songbirds, and brook water.
 */

export interface SoundSettings {
  volume: number; // 0.0 to 1.0 (relative to safe ceiling)
  fairyMusic: boolean; // Acoustic melody of Landscape With a Fairy
  wind: boolean;
  water: boolean;
  birds: boolean;
  crickets: boolean;
}

type Listener = (isPlaying: boolean, settings: SoundSettings) => void;

class AmbientGardenEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private listeners: Set<Listener> = new Set();

  // Settings
  private settings: SoundSettings = {
    volume: 0.55,
    fairyMusic: true,
    wind: true,
    water: true,
    birds: true,
    crickets: true,
  };

  // Audio Nodes
  private masterGain: GainNode | null = null;
  private fairyGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private birdGain: GainNode | null = null;
  private cricketGain: GainNode | null = null;

  // Active sources & timers
  private windSource: AudioBufferSourceNode | null = null;
  private waterSource: AudioBufferSourceNode | null = null;
  private fairyTimer: number | null = null;
  private fairyStep = 0;
  private birdTimer: number | null = null;
  private cricketTimer: number | null = null;
  private chimeTimer: number | null = null;
  private lfoOsc: OscillatorNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.isPlaying, { ...this.settings });
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying, { ...this.settings }));
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  getSettings(): SoundSettings {
    return { ...this.settings };
  }

  setVolume(vol: number) {
    this.settings.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      // Safe maximum ambient ceiling is ~0.16 to keep it comfortably low-volume
      const targetGain = this.settings.volume * 0.16;
      this.masterGain.gain.linearRampToValueAtTime(
        targetGain,
        this.ctx.currentTime + 0.1
      );
    }
    this.notify();
  }

  toggleLayer(layer: keyof Omit<SoundSettings, 'volume'>) {
    this.settings[layer] = !this.settings[layer];
    this.updateLayerGains();
    this.notify();
  }

  private updateLayerGains() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    if (this.fairyGain) {
      this.fairyGain.gain.linearRampToValueAtTime(
        this.settings.fairyMusic ? 0.09 : 0.0001,
        now + 0.2
      );
    }
    if (this.windGain) {
      this.windGain.gain.linearRampToValueAtTime(
        this.settings.wind ? 0.07 : 0.0001,
        now + 0.2
      );
    }
    if (this.waterGain) {
      this.waterGain.gain.linearRampToValueAtTime(
        this.settings.water ? 0.04 : 0.0001,
        now + 0.2
      );
    }
    if (this.birdGain) {
      this.birdGain.gain.linearRampToValueAtTime(
        this.settings.birds ? 0.045 : 0.0001,
        now + 0.2
      );
    }
    if (this.cricketGain) {
      this.cricketGain.gain.linearRampToValueAtTime(
        this.settings.crickets ? 0.025 : 0.0001,
        now + 0.2
      );
    }
  }

  // Toggle ambient on/off
  toggle(): boolean {
    this.initContext();
    if (!this.ctx) return false;

    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  // Play a soft wind chime note
  playChime(freq = 520, decay = 2.2, volume = 0.08) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(volume * this.settings.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  playGardenChimeChord() {
    const chord = [440, 554.37, 659.25, 880];
    chord.forEach((freq, index) => {
      setTimeout(() => {
        this.playChime(freq, 2.5, 0.04);
      }, index * 90);
    });
  }

  // Start the background soundscape
  start() {
    this.initContext();
    if (!this.ctx) return;

    this.isPlaying = true;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // 1. Master Output Gain
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(this.settings.volume * 0.16, now + 1.2);
    master.connect(ctx.destination);
    this.masterGain = master;

    // 2. "Landscape With a Fairy" Acoustic Melody & Music Box Layer
    const fairyGain = ctx.createGain();
    fairyGain.gain.setValueAtTime(
      this.settings.fairyMusic ? 0.09 : 0.0001,
      now
    );
    fairyGain.connect(master);
    this.fairyGain = fairyGain;
    this.fairyStep = 0;
    this.scheduleFairyTick();

    // 3. Forest Wind & Leaves Rustling Layer
    this.setupWindLayer(ctx, master);

    // 4. Garden Brook Water Trickle
    this.setupWaterLayer(ctx, master);

    // 5. Birdsong Layer
    const birdGain = ctx.createGain();
    birdGain.gain.setValueAtTime(this.settings.birds ? 0.045 : 0.0001, now);
    birdGain.connect(master);
    this.birdGain = birdGain;
    this.scheduleNextBird();

    // 6. Evening Forest Crickets Layer
    const cricketGain = ctx.createGain();
    cricketGain.gain.setValueAtTime(
      this.settings.crickets ? 0.025 : 0.0001,
      now
    );
    cricketGain.connect(master);
    this.cricketGain = cricketGain;
    this.scheduleNextCrickets();

    // 7. Occasional Gentle Wind Chime
    this.scheduleNextChime();

    this.notify();
  }

  // "Landscape With a Fairy" (aspidistrafly) Melodic Sequencer
  // Ethereal fingerpicked acoustic guitar arpeggios & celesta/fairy music box bells
  private scheduleFairyTick() {
    if (!this.isPlaying) return;

    // Progression: Dmaj9 -> Bm9 -> Gmaj7 -> Aadd9
    // 74 BPM => 1 beat = 0.81s, eighth note = 0.405s
    const patterns = [
      // Dmaj9
      { note: 293.66, type: 'guitar', isBell: false }, // D4
      { note: 440.0, type: 'guitar', isBell: false }, // A4
      { note: 554.37, type: 'guitar', isBell: true }, // C#5
      { note: 739.99, type: 'bell', isBell: true }, // F#5 (fairy bell)
      { note: 369.99, type: 'guitar', isBell: false }, // F#4
      { note: 659.25, type: 'guitar', isBell: false }, // E5
      { note: 440.0, type: 'guitar', isBell: false }, // A4
      { note: 1108.73, type: 'bell', isBell: true }, // C#6 (fairy chime)
      // Bm9
      { note: 246.94, type: 'guitar', isBell: false }, // B3
      { note: 369.99, type: 'guitar', isBell: false }, // F#4
      { note: 440.0, type: 'guitar', isBell: false }, // A4
      { note: 554.37, type: 'guitar', isBell: true }, // C#5
      { note: 293.66, type: 'guitar', isBell: false }, // D4
      { note: 739.99, type: 'bell', isBell: true }, // F#5
      { note: 440.0, type: 'guitar', isBell: false }, // A4
      { note: 880.0, type: 'bell', isBell: true }, // A5
      // Gmaj7
      { note: 196.0, type: 'guitar', isBell: false }, // G3
      { note: 293.66, type: 'guitar', isBell: false }, // D4
      { note: 369.99, type: 'guitar', isBell: false }, // F#4
      { note: 493.88, type: 'guitar', isBell: true }, // B4
      { note: 739.99, type: 'bell', isBell: true }, // F#5
      { note: 369.99, type: 'guitar', isBell: false }, // F#4
      { note: 293.66, type: 'guitar', isBell: false }, // D4
      { note: 987.77, type: 'bell', isBell: true }, // B5
      // Aadd9
      { note: 220.0, type: 'guitar', isBell: false }, // A3
      { note: 329.63, type: 'guitar', isBell: false }, // E4
      { note: 440.0, type: 'guitar', isBell: false }, // A4
      { note: 493.88, type: 'guitar', isBell: true }, // B4
      { note: 554.37, type: 'guitar', isBell: false }, // C#5
      { note: 659.25, type: 'bell', isBell: true }, // E5
      { note: 440.0, type: 'guitar', isBell: false }, // A4
      { note: 880.0, type: 'bell', isBell: true }, // A5
    ];

    const currentItem = patterns[this.fairyStep % patterns.length];
    if (this.ctx && this.fairyGain && this.settings.fairyMusic) {
      this.playAcousticPluck(currentItem.note, currentItem.type);
    }

    this.fairyStep++;
    const stepDuration = 405; // ms per note
    this.fairyTimer = window.setTimeout(() => {
      this.scheduleFairyTick();
    }, stepDuration);
  }

  // Plucks an acoustic guitar or music box bell string
  private playAcousticPluck(freq: number, instrument: string) {
    if (!this.ctx || !this.fairyGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (instrument === 'bell') {
      // Pure sine with gentle shimmering harmonic for fairy bell
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.045, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.fairyGain);

      osc.start(now);
      osc.stop(now + 1.8);
    } else {
      // Acoustic guitar string tone (triangle with soft lowpass)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.6);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.fairyGain);

      osc.start(now);
      osc.stop(now + 0.95);
    }
  }

  // Forest Wind generator using filtered pink noise with gentle sinusoidal swaying
  private setupWindLayer(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0,
      b1 = 0,
      b2 = 0,
      b3 = 0,
      b4 = 0,
      b5 = 0,
      b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.969 * b2 + white * 0.153852;
      b3 = 0.8665 * b3 + white * 0.3104856;
      b4 = 0.55 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.08, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(120, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();
    this.lfoOsc = lfo;

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(
      this.settings.wind ? 0.07 : 0.0001,
      ctx.currentTime
    );

    noise.connect(filter);
    filter.connect(windGain);
    windGain.connect(destination);

    noise.start();
    this.windSource = noise;
    this.windGain = windGain;
  }

  // Garden Brook / Water Trickle
  private setupWaterLayer(ctx: AudioContext, destination: GainNode) {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.025;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(950, ctx.currentTime);
    bandpass.Q.setValueAtTime(2.5, ctx.currentTime);

    const waterGain = ctx.createGain();
    waterGain.gain.setValueAtTime(
      this.settings.water ? 0.04 : 0.0001,
      ctx.currentTime
    );

    noise.connect(bandpass);
    bandpass.connect(waterGain);
    waterGain.connect(destination);

    noise.start();
    this.waterSource = noise;
    this.waterGain = waterGain;
  }

  // Synthesize realistic gentle garden birds
  private playBirdChirp() {
    if (!this.ctx || !this.isPlaying || !this.settings.birds || !this.birdGain)
      return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const baseFreq = 2200 + Math.random() * 800;
    const chirpCount = 2 + Math.floor(Math.random() * 3);

    for (let i = 0; i < chirpCount; i++) {
      const chirpTime = now + i * 0.12;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const f1 = baseFreq + Math.random() * 400;
      const f2 = f1 + (Math.random() > 0.5 ? 400 : -350);

      osc.frequency.setValueAtTime(f1, chirpTime);
      osc.frequency.exponentialRampToValueAtTime(f2, chirpTime + 0.08);

      gain.gain.setValueAtTime(0.0001, chirpTime);
      gain.gain.linearRampToValueAtTime(0.035, chirpTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.08);

      osc.connect(gain);
      gain.connect(this.birdGain);

      osc.start(chirpTime);
      osc.stop(chirpTime + 0.09);
    }
  }

  private scheduleNextBird() {
    if (!this.isPlaying) return;
    const delay = 5000 + Math.random() * 9000;
    this.birdTimer = window.setTimeout(() => {
      this.playBirdChirp();
      this.scheduleNextBird();
    }, delay);
  }

  // Gentle distant forest crickets
  private playCricketPulse() {
    if (
      !this.ctx ||
      !this.isPlaying ||
      !this.settings.crickets ||
      !this.cricketGain
    )
      return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const pulses = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < pulses; i++) {
      const pulseTime = now + i * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(4600 + Math.random() * 300, pulseTime);

      gain.gain.setValueAtTime(0.0001, pulseTime);
      gain.gain.linearRampToValueAtTime(0.02, pulseTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, pulseTime + 0.06);

      osc.connect(gain);
      gain.connect(this.cricketGain);

      osc.start(pulseTime);
      osc.stop(pulseTime + 0.07);
    }
  }

  private scheduleNextCrickets() {
    if (!this.isPlaying) return;
    const delay = 4000 + Math.random() * 6500;
    this.cricketTimer = window.setTimeout(() => {
      this.playCricketPulse();
      this.scheduleNextCrickets();
    }, delay);
  }

  // Occasional gentle wind chime on breeze
  private scheduleNextChime() {
    if (!this.isPlaying) return;
    const pentatonic = [329.63, 392.0, 440.0, 523.25, 659.25];
    const delay = 8000 + Math.random() * 12000;
    this.chimeTimer = window.setTimeout(() => {
      if (this.isPlaying && this.settings.wind) {
        const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        this.playChime(note, 3.2, 0.035);
      }
      this.scheduleNextChime();
    }, delay);
  }

  // Gracefully stop ambient sounds
  stop() {
    this.isPlaying = false;
    if (this.fairyTimer) clearTimeout(this.fairyTimer);
    if (this.birdTimer) clearTimeout(this.birdTimer);
    if (this.cricketTimer) clearTimeout(this.cricketTimer);
    if (this.chimeTimer) clearTimeout(this.chimeTimer);
    this.fairyTimer = null;
    this.birdTimer = null;
    this.cricketTimer = null;
    this.chimeTimer = null;

    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);

      setTimeout(() => {
        if (this.windSource) {
          try {
            this.windSource.stop();
            this.windSource.disconnect();
          } catch {
            // ignore
          }
          this.windSource = null;
        }
        if (this.waterSource) {
          try {
            this.waterSource.stop();
            this.waterSource.disconnect();
          } catch {
            // ignore
          }
          this.waterSource = null;
        }
        if (this.lfoOsc) {
          try {
            this.lfoOsc.stop();
            this.lfoOsc.disconnect();
          } catch {
            // ignore
          }
          this.lfoOsc = null;
        }
      }, 1300);
    }

    this.notify();
  }
}

export const gardenAudio = new AmbientGardenEngine();
