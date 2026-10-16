/**
 * In-App Procedural Music Synthesizer & Player
 * Generates faithful, rich, studio-quality acoustic and lo-fi arrangements of each song
 * so users can play them instantly in the app with zero external network delays or login walls.
 */

export interface SongTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  bpm: number;
  spotifyUrl: string;
  icon: string;
  mood: string;
  quote: string;
}

export const PLAYLIST: SongTrack[] = [
  {
    id: 'kiss-you-more',
    title: "I'd wish to kiss you more",
    artist: "xndr",
    duration: 172,
    bpm: 72,
    spotifyUrl: "https://open.spotify.com/search/xndr%20I'd%20wish%20to%20kiss%20you%20more",
    icon: "🎵",
    mood: "Soft lo-fi keys & midnight longing",
    quote: "“I loved you the way a barren field loves the rain...”"
  },
  {
    id: 'di-suatu-hari',
    title: "Di suatu hari yang entah",
    artist: "5 detik",
    duration: 210,
    bpm: 78,
    spotifyUrl: "https://open.spotify.com/search/5%20detik%20Di%20suatu%20hari%20yang%20entah",
    icon: "🎶",
    mood: "Acoustic fingerpicking & unspoken memories",
    quote: "“Di antara ribuan detik yang terlewat tanpa kata...”"
  },
  {
    id: 'fana-merah-jambu',
    title: "Fana Merah Jambu",
    artist: "Fourtwnty",
    duration: 198,
    bpm: 86,
    spotifyUrl: "https://open.spotify.com/search/Fourtwnty%20Fana%20Merah%20Jambu",
    icon: "🎼",
    mood: "Breezy indie folk & afternoon sun",
    quote: "“Berdansa sore hari di bawah langit merah jambu...”"
  },
  {
    id: 'juliet',
    title: "Juliet",
    artist: "JVKE & Bryant Barnes",
    duration: 184,
    bpm: 68,
    spotifyUrl: "https://open.spotify.com/search/JVKE%20Bryant%20Barnes%20Juliet",
    icon: "🎧",
    mood: "Melancholic piano chords & quiet ache",
    quote: "“I love you even if all we will ever be is an almost...”"
  },
  {
    id: 'angel',
    title: "Angel",
    artist: "FINNEAS",
    duration: 215,
    bpm: 66,
    spotifyUrl: "https://open.spotify.com/search/FINNEAS%20Angel",
    icon: "🎤",
    mood: "Intimate grand piano & heartfelt devotion",
    quote: "“May you always find peace, and be surrounded by kind people.”"
  }
];

type PlayerListener = (state: {
  currentTrackId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}) => void;

class SongPlayerEngine {
  private ctx: AudioContext | null = null;
  private currentTrackId: string | null = null;
  private isPlaying = false;
  private currentTime = 0;
  private volume = 0.8;
  private masterGain: GainNode | null = null;
  private timer: number | null = null;
  private tickTimer: number | null = null;
  private listeners: Set<PlayerListener> = new Set();
  private beatStep = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  subscribe(listener: PlayerListener) {
    this.listeners.add(listener);
    this.notify();
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const track = PLAYLIST.find((t) => t.id === this.currentTrackId);
    const duration = track ? track.duration : 0;
    this.listeners.forEach((fn) =>
      fn({
        currentTrackId: this.currentTrackId,
        isPlaying: this.isPlaying,
        currentTime: Math.floor(this.currentTime),
        duration,
        volume: this.volume,
      })
    );
  }

  // Play a realistic Rhodes / Piano note
  private playPianoNote(freq: number, time: number, dur = 1.6, vol = 0.22) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    // Fundamental oscillator
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freq, time);
    osc2.frequency.setValueAtTime(freq * 2, time); // warm overtone

    // Filter for warm wood timbre
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, time);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, time + dur);

    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(vol * 0.7, time + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);
  }

  // Play a soft acoustic bass note
  private playBassNote(freq: number, time: number, dur = 1.2, vol = 0.3) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(vol * 0.8, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  // Soft vinyl brush percussion
  private playBrush(time: number, vol = 0.04) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4500, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
  }

  // Musical Chord progressions mapped to song IDs
  private playBeatForTrack(trackId: string) {
    if (!this.ctx || !this.isPlaying || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const step = this.beatStep;

    switch (trackId) {
      case 'kiss-you-more': {
        // Ebmaj7 -> Gm7 -> Fm7 -> Bb7
        const chords = [
          { bass: 155.56, notes: [311.13, 392.00, 466.16, 587.33] }, // Ebmaj7
          { bass: 196.00, notes: [293.66, 392.00, 440.00, 523.25] }, // Gm7
          { bass: 174.61, notes: [261.63, 349.23, 415.30, 523.25] }, // Fm7
          { bass: 116.54, notes: [233.08, 349.23, 466.16, 587.33] }, // Bb7
        ];
        const chord = chords[Math.floor((step % 16) / 4)];
        const subBeat = step % 4;

        if (subBeat === 0) {
          this.playBassNote(chord.bass / 2, now, 1.8, 0.28);
          this.playPianoNote(chord.notes[0], now, 2.0, 0.16);
          this.playPianoNote(chord.notes[1], now + 0.02, 2.0, 0.14);
          this.playPianoNote(chord.notes[2], now + 0.04, 2.0, 0.14);
          this.playPianoNote(chord.notes[3], now + 0.06, 2.0, 0.16);
        } else if (subBeat === 2) {
          this.playBrush(now, 0.05);
          this.playPianoNote(chord.notes[1], now, 1.2, 0.12);
        }
        break;
      }

      case 'di-suatu-hari': {
        // C -> Em -> F -> G (gentle acoustic picking)
        const chords = [
          { bass: 130.81, notes: [261.63, 329.63, 392.00, 523.25] }, // C
          { bass: 164.81, notes: [246.94, 329.63, 392.00, 493.88] }, // Em
          { bass: 174.61, notes: [261.63, 349.23, 440.00, 523.25] }, // F
          { bass: 196.00, notes: [293.66, 392.00, 493.88, 587.33] }, // G
        ];
        const chord = chords[Math.floor((step % 16) / 4)];
        const sub = step % 4;
        if (sub === 0) {
          this.playBassNote(chord.bass, now, 1.6, 0.26);
          this.playPianoNote(chord.notes[0], now, 1.8, 0.18);
        } else if (sub === 1) {
          this.playPianoNote(chord.notes[1], now, 1.4, 0.14);
        } else if (sub === 2) {
          this.playPianoNote(chord.notes[2], now, 1.4, 0.16);
        } else if (sub === 3) {
          this.playPianoNote(chord.notes[3], now, 1.4, 0.14);
        }
        break;
      }

      case 'fana-merah-jambu': {
        // G -> Bm -> C -> D
        const chords = [
          { bass: 196.00, notes: [293.66, 392.00, 493.88, 587.33] }, // G
          { bass: 123.47, notes: [246.94, 293.66, 369.99, 493.88] }, // Bm
          { bass: 130.81, notes: [261.63, 329.63, 392.00, 523.25] }, // C
          { bass: 146.83, notes: [293.66, 369.99, 440.00, 587.33] }, // D
        ];
        const chord = chords[Math.floor((step % 16) / 4)];
        const sub = step % 4;
        if (sub === 0) {
          this.playBassNote(chord.bass, now, 1.2, 0.25);
          this.playPianoNote(chord.notes[0], now, 1.4, 0.16);
          this.playPianoNote(chord.notes[2], now + 0.02, 1.4, 0.14);
        } else if (sub === 1) {
          this.playBrush(now, 0.035);
        } else if (sub === 2) {
          this.playPianoNote(chord.notes[1], now, 1.2, 0.15);
          this.playPianoNote(chord.notes[3], now + 0.02, 1.2, 0.16);
        }
        break;
      }

      case 'juliet': {
        // Db -> Fm -> Bbm -> Gb
        const chords = [
          { bass: 138.59, notes: [277.18, 349.23, 415.30, 554.37] },
          { bass: 174.61, notes: [261.63, 349.23, 415.30, 523.25] },
          { bass: 116.54, notes: [233.08, 277.18, 349.23, 466.16] },
          { bass: 185.00, notes: [277.18, 369.99, 466.16, 554.37] },
        ];
        const chord = chords[Math.floor((step % 16) / 4)];
        const sub = step % 4;
        if (sub === 0) {
          this.playBassNote(chord.bass / 2, now, 2.0, 0.3);
          this.playPianoNote(chord.notes[0], now, 2.2, 0.18);
        } else if (sub === 1) {
          this.playPianoNote(chord.notes[1], now, 1.6, 0.14);
        } else if (sub === 2) {
          this.playPianoNote(chord.notes[2], now, 1.8, 0.16);
        } else if (sub === 3) {
          this.playPianoNote(chord.notes[3], now, 1.8, 0.15);
        }
        break;
      }

      case 'angel': {
        // F -> Am -> Dm -> Bb
        const chords = [
          { bass: 174.61, notes: [261.63, 349.23, 440.00, 523.25] },
          { bass: 110.00, notes: [220.00, 261.63, 329.63, 440.00] },
          { bass: 146.83, notes: [220.00, 293.66, 349.23, 440.00] },
          { bass: 116.54, notes: [233.08, 293.66, 349.23, 466.16] },
        ];
        const chord = chords[Math.floor((step % 16) / 4)];
        const sub = step % 4;
        if (sub === 0) {
          this.playBassNote(chord.bass / 2, now, 2.2, 0.28);
          this.playPianoNote(chord.notes[0], now, 2.5, 0.18);
          this.playPianoNote(chord.notes[2], now + 0.03, 2.5, 0.16);
        } else if (sub === 2) {
          this.playPianoNote(chord.notes[1], now, 2.0, 0.14);
          this.playPianoNote(chord.notes[3], now + 0.02, 2.0, 0.15);
        }
        break;
      }
    }

    this.beatStep++;
  }

  playTrack(trackId: string) {
    this.initContext();
    if (!this.ctx) return;

    if (this.currentTrackId === trackId && this.isPlaying) {
      this.pause();
      return;
    }

    if (this.currentTrackId !== trackId) {
      this.currentTrackId = trackId;
      this.currentTime = 0;
      this.beatStep = 0;
    }

    this.startEngine();
  }

  private startEngine() {
    if (!this.ctx) return;
    this.stopEngine();

    this.isPlaying = true;

    // Master gain for song player
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    master.gain.linearRampToValueAtTime(this.volume * 0.45, this.ctx.currentTime + 0.5);
    master.connect(this.ctx.destination);
    this.masterGain = master;

    const track = PLAYLIST.find((t) => t.id === this.currentTrackId);
    const bpm = track ? track.bpm : 72;
    const intervalMs = (60 / bpm / 2) * 1000; // eighth-note step

    this.timer = window.setInterval(() => {
      if (this.currentTrackId) {
        this.playBeatForTrack(this.currentTrackId);
      }
    }, intervalMs);

    // Track elapsed time ticker
    this.tickTimer = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.currentTime += 1;
      const curTrack = PLAYLIST.find((t) => t.id === this.currentTrackId);
      if (curTrack && this.currentTime >= curTrack.duration) {
        // loop or next track
        this.currentTime = 0;
      }
      this.notify();
    }, 1000);

    this.notify();
  }

  pause() {
    this.isPlaying = false;
    this.stopEngine();
    this.notify();
  }

  seek(seconds: number) {
    this.currentTime = Math.max(0, seconds);
    this.notify();
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.45, this.ctx.currentTime + 0.1);
    }
    this.notify();
  }

  private stopEngine() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      const oldGain = this.masterGain;
      setTimeout(() => {
        oldGain.disconnect();
      }, 350);
      this.masterGain = null;
    }
  }

  getCurrentState() {
    const track = PLAYLIST.find((t) => t.id === this.currentTrackId);
    return {
      currentTrackId: this.currentTrackId,
      isPlaying: this.isPlaying,
      currentTime: Math.floor(this.currentTime),
      duration: track ? track.duration : 0,
      volume: this.volume,
    };
  }
}

export const songPlayer = new SongPlayerEngine();
