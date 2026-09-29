/**
 * engine.ts — the generative music engine, ported from life_music.py.
 *
 * Produces an ethereal, continuously-evolving soundscape where the music
 * emerges from the simulation state itself, in two switchable styles: pure
 * chiptune (NES) and ambient synth. Four voice layers — drone, melody (a
 * playhead scanning the viewport), arpeggio, noise — plus a cadence when a
 * detected attractor is broken.
 *
 * It runs inside an AudioWorklet (worklet.ts) but knows nothing of one: it
 * renders buffers of BUFFER_SIZE frames at SAMPLE_RATE, exactly the blocks
 * PyAudio asked the original for, because every smoothing constant below is
 * per buffer (volume ramps, root portamento, noise burst phase). The
 * worklet hands those buffers out 128 frames at a time.
 *
 * No numpy here, so each vectorised expression is one loop; the maths and
 * the order of operations are the original's, down to its quirks (the old
 * style's drone advances the shared phases a second buffer during a style
 * crossfade, as it does in Python).
 */

export const SAMPLE_RATE = 44100;
export const BUFFER_SIZE = 2048;
const TWO_PI = 2 * Math.PI;

// Styles
export const STYLE_CHIPTUNE = 'chiptune';
export const STYLE_AMBIENT = 'ambient';
export const STYLES = [STYLE_CHIPTUNE, STYLE_AMBIENT] as const;
export type Style = (typeof STYLES)[number];

// ── Scales (semitone intervals from root) ──────────────────────────────
const SCALES: Readonly<Record<string, readonly number[]>> = {
  lydian: [0, 2, 4, 6, 7, 9, 11],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  whole_tone: [0, 2, 4, 6, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  minor_pentatonic: [0, 3, 5, 7, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  major_pentatonic: [0, 2, 4, 7, 9],
};

// ── Cadence (played when a detected attractor is broken) ──────────────
// A short resolving gesture — octave, fifth, root — before the new chaos
// arrives. Death of an attractor deserves scoring.
const CADENCE_VOLUME = 0.22;
const CADENCE_COOLDOWN_S = 20.0;

/** Mood → scale name */
const MOOD_SCALE: Readonly<Record<string, string>> = {
  booming: 'lydian',
  declining: 'aeolian',
  cycle: 'whole_tone',
  stagnant: 'dorian',
  sparse: 'minor_pentatonic',
  dense: 'mixolydian',
  injection: 'major_pentatonic',
  haunted: 'whole_tone', // no tonal center — nothing resolves
};
const DEFAULT_SCALE = 'major_pentatonic';

/** Epoch → MIDI note number for root */
const EPOCH_ROOT: Readonly<Record<string, number>> = {
  genesis: 48, // C3
  primordial: 46, // Bb2
  emergence: 50, // D3
  expansion: 53, // F3
  flourishing: 55, // G3
  'deep time': 51, // Eb3
  eon: 48, // C3
  eternity: 45, // A2
};
const DEFAULT_ROOT = 48; // C3

/** ADSR presets (attack, decay, sustain_level, release) in seconds */
const ADSR_CHIPTUNE = [0.005, 0.05, 0.7, 0.02] as const;
const ADSR_AMBIENT = [0.06, 0.25, 0.75, 0.5] as const;

/** Maximum polyphony for melody playhead */
const MAX_MELODY_VOICES = 4;

// ═══════════════════════════════════════════════════════════════════════
//  Data transfer: snapshot from sim → audio
// ═══════════════════════════════════════════════════════════════════════

/** Immutable state transfer from simulation to audio engine. */
export interface SimulationSnapshot {
  generation: number;
  population: number;
  pop_floor: number;
  density: number;
  spread: number;
  cycle_period: number;
  mood: string;
  epoch: string;
  pop_delta: number;
  /** alive cells down the playhead's column, top to bottom */
  playhead_column: boolean[];
  playhead_position: number;
  viewport_rows: number;
  /** last injection event string ('' = none this frame) */
  event: string;
  /** horizontal centroid of recent change (0-1) */
  activity_x: number;
}

export const EMPTY_SNAPSHOT: SimulationSnapshot = {
  generation: 0,
  population: 0,
  pop_floor: 100,
  density: 0,
  spread: 0,
  cycle_period: 0,
  mood: '',
  epoch: 'genesis',
  pop_delta: 0,
  playhead_column: [],
  playhead_position: 0,
  viewport_rows: 40,
  event: '',
  activity_x: 0.5,
};

/** Derived musical parameters, recomputed each frame in update(). */
class MusicalState {
  root_midi = DEFAULT_ROOT;
  target_root_midi = DEFAULT_ROOT;
  scale_name = DEFAULT_SCALE;
  scale_intervals: readonly number[] = SCALES[DEFAULT_SCALE] ?? [];
  prev_scale_intervals: readonly number[] = SCALES[DEFAULT_SCALE] ?? [];
  scale_crossfade = 1.0; // 0=old scale, 1=new scale
  tempo_bpm = 80.0;
  // Per-layer target volumes (0.0-1.0)
  drone_volume = 0.3;
  melody_volume = 0.2;
  arp_volume = 0.15;
  noise_volume = 0.05;
  // Arpeggio
  arp_speed = 4.0; // notes per second
  arp_pattern: readonly number[] = [0, 2, 4, 7]; // scale degree offsets
  // Melody playhead notes (Hz values for active notes)
  playhead_notes: readonly number[] = [];
}

// ═══════════════════════════════════════════════════════════════════════
//  Utility functions
// ═══════════════════════════════════════════════════════════════════════

export function midiToHz(midi: number): number {
  return 440.0 * 2.0 ** ((midi - 69.0) / 12.0);
}

function scalePitches(root: number, intervals: readonly number[], octaves = 2): number[] {
  const pitches: number[] = [];
  for (let o = 0; o < octaves; o++) for (const iv of intervals) pitches.push(midiToHz(root + iv + 12 * o));
  return pitches;
}

/** Linear interpolation from a to b by factor t (clamped to 0.0-1.0). */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0.0, Math.min(1.0, t));
}

/** np.linspace(a, b, n) as float32 (endpoint included) */
function linspace(a: number, b: number, n: number): Float32Array {
  const out = new Float32Array(n);
  if (n === 1) {
    out[0] = a;
    return out;
  }
  const step = (b - a) / (n - 1);
  for (let i = 0; i < n; i++) out[i] = a + i * step;
  out[n - 1] = b;
  return out;
}

const pmod = (x: number, m: number): number => ((x % m) + m) % m;

/**
 * One-pole low-pass filter with cached coefficients and persistent state,
 * carried across buffers for smooth continuous filtering.
 */
class CachedLPF {
  private readonly alpha: number;
  private z = 0;

  constructor(cutoffHz: number, sampleRate = SAMPLE_RATE) {
    const rc = 1.0 / (TWO_PI * cutoffHz);
    const dt = 1.0 / sampleRate;
    this.alpha = dt / (rc + dt);
  }

  apply(signal: Float32Array): Float32Array {
    const out = new Float32Array(signal.length);
    const a = this.alpha;
    let prev = this.z;
    for (let i = 0; i < signal.length; i++) {
      prev = a * (signal[i] ?? 0) + (1.0 - a) * prev;
      out[i] = prev;
    }
    this.z = prev;
    return out;
  }

  reset(): void {
    this.z = 0;
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  Oscillator primitives
// ═══════════════════════════════════════════════════════════════════════

function sineWave(phase: Float64Array): Float32Array {
  const out = new Float32Array(phase.length);
  for (let i = 0; i < phase.length; i++) out[i] = Math.sin(phase[i] ?? 0);
  return out;
}

function triangleWave(phase: Float64Array): Float32Array {
  const out = new Float32Array(phase.length);
  for (let i = 0; i < phase.length; i++) {
    const p = pmod(phase[i] ?? 0, TWO_PI) / TWO_PI;
    out[i] = 2.0 * Math.abs(2.0 * p - 1.0) - 1.0;
  }
  return out;
}

/** PolyBLEP residual for antialiased square wave edges. */
function polyblep(t: number): number {
  if (t >= 0 && t < 1) return 2.0 * t - t * t - 1.0;
  if (t >= -1 && t < 0) return t * t + 2.0 * t + 1.0;
  return 0;
}

/** Square wave with polyBLEP antialiasing. */
function squareWave(phase: Float64Array, duty: number, freqHz: number): Float32Array {
  const n = phase.length;
  const out = new Float32Array(n);
  let dt = freqHz / SAMPLE_RATE;
  if (!(freqHz > 0)) {
    // np.mean(np.diff(p)) fallback
    let s = 0;
    for (let i = 1; i < n; i++) s += pmod(phase[i] ?? 0, TWO_PI) / TWO_PI - pmod(phase[i - 1] ?? 0, TWO_PI) / TWO_PI;
    dt = n > 1 ? s / (n - 1) : 0.01;
  }
  for (let i = 0; i < n; i++) {
    const p = pmod(phase[i] ?? 0, TWO_PI) / TWO_PI;
    let raw = p < duty ? 1.0 : -1.0;
    if (dt > 0) {
      // Transition at p=0 (rising edge)
      if (p < dt) raw += polyblep(p / dt);
      if (p > 1.0 - dt) raw += polyblep((p - 1.0) / dt);
      // Transition at p=duty (falling edge)
      const t2 = (p - duty) / dt;
      if (Math.abs(t2) < 1.0) raw -= polyblep(t2);
    }
    out[i] = raw;
  }
  return out;
}

// ═══════════════════════════════════════════════════════════════════════
//  ADSR Envelope
// ═══════════════════════════════════════════════════════════════════════

class ADSREnvelope {
  readonly attack: number;
  readonly decay: number;
  readonly release: number;

  constructor(attack: number, decay: number, readonly sustain: number, release: number) {
    this.attack = Math.max(0.001, attack);
    this.decay = Math.max(0.001, decay);
    this.release = Math.max(0.001, release);
  }

  /** Envelope shape for n samples starting at `elapsed` seconds. */
  generate(n: number, gate: boolean, elapsed: number, releaseTime = -1.0): Float32Array {
    const env = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = elapsed + i / SAMPLE_RATE;
      if (gate) {
        if (t < this.attack) env[i] = t / this.attack;
        else if (t < this.attack + this.decay) env[i] = 1.0 - (1.0 - this.sustain) * ((t - this.attack) / this.decay);
        else env[i] = this.sustain;
      } else if (releaseTime >= 0) {
        const rel = t - releaseTime;
        env[i] = rel < 0 ? this.sustain : this.sustain * Math.max(0.0, 1.0 - rel / this.release);
      }
    }
    return env;
  }
}

const ENV_CHIPTUNE = new ADSREnvelope(...ADSR_CHIPTUNE);
const ENV_AMBIENT = new ADSREnvelope(...ADSR_AMBIENT);

// ═══════════════════════════════════════════════════════════════════════
//  Voice: a single pitched sound with envelope
// ═══════════════════════════════════════════════════════════════════════

class Voice {
  freq: number;
  target_freq: number;
  phase = 0.0;
  phase_det = 0.0; // Detuned chorus oscillator phase
  active = false;
  gate = false;
  elapsed = 0.0;
  release_time = -1.0;

  constructor(
    freq = 440.0,
    public style: Style = STYLE_AMBIENT,
  ) {
    this.freq = freq;
    this.target_freq = freq;
  }

  /** Start a new note — full ADSR restart. */
  noteOn(freq: number): void {
    this.target_freq = freq;
    this.freq = freq;
    this.gate = true;
    this.active = true;
    this.elapsed = 0.0;
    this.release_time = -1.0;
  }

  /**
   * Slide to a new pitch without restarting the ADSR envelope. Used when a
   * voice is already active and the pitch change is small enough that a
   * smooth portamento sounds better than a hard retrigger.
   */
  retrigger(freq: number): void {
    this.target_freq = freq;
    if (!this.active) {
      this.noteOn(freq);
    } else if (!this.gate) {
      // Voice was releasing — re-gate it without resetting elapsed
      this.gate = true;
      this.release_time = -1.0;
    }
  }

  noteOff(): void {
    this.gate = false;
    this.release_time = this.elapsed;
  }

  render(n: number): Float32Array {
    if (!this.active) return new Float32Array(n);
    const dt = 1.0 / SAMPLE_RATE;

    // Per-sample frequency ramp for buffer-size-independent portamento.
    // Time constant in seconds: ambient slides slowly, chiptune snaps fast.
    const slideTc = this.style === STYLE_AMBIENT ? 0.15 : 0.02;
    const alpha = 1.0 - Math.exp(-dt / slideTc);
    const phases = new Float64Array(n);
    const phasesDet = new Float64Array(n);
    let f = this.freq;
    let ph = this.phase;
    let phd = this.phase_det;
    let decay = 1;
    for (let i = 0; i < n; i++) {
      // f[n] = target + (start - target) * (1 - alpha)^n
      f = this.target_freq + (this.freq - this.target_freq) * decay;
      decay *= 1.0 - alpha;
      ph += TWO_PI * f * dt;
      phd += TWO_PI * f * 1.003 * dt;
      phases[i] = ph;
      phasesDet[i] = phd;
    }
    if (n > 0) {
      this.freq = f;
      this.phase = pmod(ph, TWO_PI);
    }

    let osc: Float32Array;
    let adsr: ADSREnvelope;
    if (this.style === STYLE_CHIPTUNE) {
      osc = squareWave(phases, 0.25, this.freq);
      adsr = ENV_CHIPTUNE;
    } else {
      // Ambient: sine + chorus with a dedicated detuned phase accumulator
      if (n > 0) this.phase_det = pmod(phd, TWO_PI);
      osc = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        osc[i] = Math.fround(Math.sin(phases[i] ?? 0)) * 0.7 + Math.fround(Math.sin(phasesDet[i] ?? 0)) * 0.3;
      }
      adsr = ENV_AMBIENT;
    }

    const env = adsr.generate(n, this.gate, this.elapsed, this.release_time);
    this.elapsed += n * dt;

    // Check if voice has fully released
    if (!this.gate && this.release_time >= 0 && this.elapsed - this.release_time > adsr.release) {
      this.active = false;
    }
    for (let i = 0; i < n; i++) osc[i] = (osc[i] ?? 0) * (env[i] ?? 0);
    return osc;
  }
}

// ═══════════════════════════════════════════════════════════════════════
//  The Music Engine
// ═══════════════════════════════════════════════════════════════════════

/** Standard-normal samples (numpy's randn), Box–Muller. */
function randn(n: number): Float32Array {
  const out = new Float32Array(n);
  for (let i = 0; i < n; i += 2) {
    const u = 1 - Math.random();
    const v = Math.random();
    const r = Math.sqrt(-2 * Math.log(u));
    out[i] = r * Math.cos(TWO_PI * v);
    if (i + 1 < n) out[i + 1] = r * Math.sin(TWO_PI * v);
  }
  return out;
}

export class LifeMusicEngine {
  muted = false;
  masterVolume = 0.5;
  private styleIdx = 1; // Start with ambient
  style: Style = STYLES[1];

  private musical = new MusicalState();
  private snapshot: SimulationSnapshot = EMPTY_SNAPSHOT;

  // Phase accumulators for drone layer
  private dronePhase1 = 0.0;
  private dronePhase1Det = 0.0; // Detuned chorus oscillator
  private dronePhase2 = 0.0;
  private dronePhase2Det = 0.0; // Detuned fifth oscillator
  private dronePhaseSub = 0.0;
  private droneLfoPhase = 0.0;

  // Melody voices
  private melodyVoices: Voice[];

  // Arpeggio state
  private arpVoice: Voice;
  private arpNoteIdx = 0;
  private arpSamplesInNote = 0; // discrete counter, no float drift

  // Noise state: triggered burst system
  private noiseBurstAmp = 0.0; // current burst amplitude
  private noiseBurstPhase = 1.0; // 0=attack start, 1=idle
  private noiseBurstDuration = 0.15; // seconds per burst
  private readonly noiseBurstThreshold = 20; // min pop_delta to trigger
  private noiseBurstCooldown = 0.0; // seconds remaining before next burst allowed

  // Smoothed volumes (to avoid clicks)
  private smoothDroneVol = 0.3;
  private smoothMelodyVol = 0.0;
  private smoothArpVol = 0.0;
  private smoothNoiseVol = 0.0;

  // Root frequency portamento
  private currentRootHz = midiToHz(DEFAULT_ROOT);
  private targetRootHz = midiToHz(DEFAULT_ROOT);

  // Crossfade for anti-click when switching styles
  private crossfadeRemaining = 0;
  private readonly crossfadeTotal = Math.floor(SAMPLE_RATE / 4); // 250ms crossfade
  private oldStyle: Style = this.style;

  private readonly noisePool = randn(SAMPLE_RATE);
  private noisePoolIdx = 0;

  // Cached low-pass filters (pre-computed coefficients, persistent state)
  private lpfDrone = new CachedLPF(800.0);
  private lpfMelody = new CachedLPF(3500.0);
  private lpfArp = new CachedLPF(4500.0);
  private lpfNoise = new CachedLPF(600.0);

  // Stereo: melody pans with the playhead; arpeggio drifts on a slow LFO.
  private prevMelodyPan = 0.5;
  private prevArpPan = 0.5;
  private autopanPhase = 0.0;

  // Cadence: resolving gesture when a detected cycle is broken.
  // Sequence of [freq_hz, duration_samples]; idx -1 = inactive.
  private cadenceVoice: Voice;
  private cadenceSeq: [number, number][] = [];
  private cadenceIdx = -1;
  private cadenceRemaining = 0;
  private cadenceCooldown = 0; // samples until next trigger allowed

  constructor() {
    this.melodyVoices = Array.from({ length: MAX_MELODY_VOICES }, () => new Voice(440, this.style));
    this.arpVoice = new Voice(440, this.style);
    this.cadenceVoice = new Voice(440, this.style);
  }

  get volumePercent(): number {
    return Math.round(this.masterVolume * 100);
  }

  // ── Controls ───────────────────────────────────────────────────────

  toggleMute(): void {
    this.muted = !this.muted;
  }

  adjustVolume(delta: number): void {
    this.masterVolume = Math.max(0.0, Math.min(1.0, this.masterVolume + delta));
  }

  cycleStyle(): void {
    this.oldStyle = this.style;
    this.styleIdx = (this.styleIdx + 1) % STYLES.length;
    this.style = STYLES[this.styleIdx] ?? STYLE_AMBIENT;
    this.crossfadeRemaining = this.crossfadeTotal;
    for (const v of this.melodyVoices) v.style = this.style;
    this.arpVoice.style = this.style;
    this.cadenceVoice.style = this.style;
  }

  setStyle(style: Style): void {
    if (style !== this.style) this.cycleStyle();
  }

  // ── State update (called each sim frame) ────────────────────────────

  /** Map simulation state to musical parameters. */
  update(snapshot: SimulationSnapshot): void {
    this.snapshot = snapshot;
    const ms = this.musical;

    // ── Root note from epoch ──
    ms.target_root_midi = EPOCH_ROOT[snapshot.epoch] ?? DEFAULT_ROOT;
    // Smooth portamento for root changes
    this.targetRootHz = midiToHz(ms.target_root_midi);

    // ── Scale from mood ──
    const newScale = MOOD_SCALE[snapshot.mood] ?? DEFAULT_SCALE;
    if (newScale !== ms.scale_name) {
      ms.prev_scale_intervals = ms.scale_intervals;
      ms.scale_name = newScale;
      ms.scale_intervals = SCALES[newScale] ?? [];
      ms.scale_crossfade = 0.0; // Start crossfade
    }
    // Advance crossfade (over ~2 seconds at ~30fps ≈ 60 frames)
    if (ms.scale_crossfade < 1.0) ms.scale_crossfade = Math.min(1.0, ms.scale_crossfade + 0.017);

    // ── Drone volume: proportional to population ──
    const popRatio = snapshot.pop_floor > 0 ? Math.min(2.0, snapshot.population / Math.max(1, snapshot.pop_floor)) : 0.5;
    ms.drone_volume = lerp(0.13, 0.38, Math.min(1.0, popRatio));

    // ── Melody volume: moderate, scales with density ──
    ms.melody_volume = lerp(0.08, 0.35, Math.min(1.0, snapshot.density * 10.0));

    // ── Arpeggio: speed from cycle detection, volume from spread ──
    if (snapshot.cycle_period > 0) {
      // Faster arpeggios when cycles are short
      ms.arp_speed = lerp(3.0, 12.0, Math.min(1.0, 10.0 / Math.max(1, snapshot.cycle_period)));
      ms.arp_volume = 0.2;
    } else {
      ms.arp_speed = lerp(2.0, 6.0, Math.min(1.0, snapshot.spread / 200.0));
      ms.arp_volume = lerp(0.05, 0.15, Math.min(1.0, snapshot.spread / 100.0));
    }

    // Build arpeggio pattern from scale
    const si = ms.scale_intervals;
    if (si.length >= 3) {
      ms.arp_pattern = [si[0] ?? 0, si[Math.min(2, si.length - 1)] ?? 0, si[Math.min(4, si.length - 1)] ?? 0, (si[0] ?? 0) + 12];
    } else {
      ms.arp_pattern = [0, 4, 7, 12];
    }

    // ── Noise: driven by population delta (births/deaths) ──
    ms.noise_volume = lerp(0.0, 0.15, Math.min(1.0, Math.abs(snapshot.pop_delta) / 50.0));

    // ── Melody playhead notes ──
    this.computePlayheadNotes(snapshot, ms);

    // ── Tempo ──
    ms.tempo_bpm = lerp(60.0, 120.0, Math.min(1.0, snapshot.density * 8.0));

    // ── Cadence: score the death of an attractor ──
    // The sim breaks detected cycles with an injection; before the new chaos
    // registers, resolve — octave, fifth, root, ringing out.
    if (snapshot.event.startsWith('inject') && snapshot.event.includes('cycle') && this.cadenceIdx < 0 && this.cadenceCooldown <= 0) {
      const base = ms.target_root_midi + 12; // melody register
      this.cadenceSeq = [
        [midiToHz(base + 12), Math.trunc(0.4 * SAMPLE_RATE)],
        [midiToHz(base + 7), Math.trunc(0.4 * SAMPLE_RATE)],
        [midiToHz(base), Math.trunc(2.0 * SAMPLE_RATE)],
      ];
      this.cadenceRemaining = 0;
      this.cadenceCooldown = Math.trunc(CADENCE_COOLDOWN_S * SAMPLE_RATE);
      this.cadenceIdx = 0;
    }
  }

  /** Map alive cells in the playhead column to pitches. */
  private computePlayheadNotes(snap: SimulationSnapshot, ms: MusicalState): void {
    const col = snap.playhead_column;
    if (!col.length || snap.viewport_rows < 2) {
      ms.playhead_notes = [];
      return;
    }
    const nRows = col.length;
    // Build pitch range: 2 octaves of current scale
    const pitches = scalePitches(ms.target_root_midi, ms.scale_intervals, 2);
    if (!pitches.length) {
      ms.playhead_notes = [];
      return;
    }
    const aliveRows: number[] = [];
    col.forEach((alive, i) => {
      if (alive) aliveRows.push(i);
    });
    // Density gate: skip if too sparse and overall density is low
    if (aliveRows.length < 2 && snap.density < 0.03) {
      ms.playhead_notes = [];
      return;
    }
    // Map row index → pitch (top = high, bottom = low)
    let notes = aliveRows.map((row) => {
      const frac = 1.0 - row / Math.max(1, nRows - 1);
      const idx = Math.max(0, Math.min(Math.trunc(frac * (pitches.length - 1)), pitches.length - 1));
      return pitches[idx] ?? 0;
    });
    // Cap polyphony: pick most spread-out if too many
    if (notes.length > MAX_MELODY_VOICES) {
      notes.sort((a, b) => a - b);
      const step = notes.length / MAX_MELODY_VOICES;
      notes = Array.from({ length: MAX_MELODY_VOICES }, (_, i) => notes[Math.trunc(i * step)] ?? 0);
    }
    ms.playhead_notes = notes;
  }

  // ── The audio callback ──────────────────────────────────────────────

  /**
   * One buffer, as PyAudio's stream callback produced it: the stereo mix,
   * master volume (or silence when muted), then a tanh soft clip. Writes
   * into `left`/`right`, which must be `n` long.
   */
  renderBlock(left: Float32Array, right: Float32Array, n = left.length): void {
    let l: Float32Array;
    let r: Float32Array;
    try {
      [l, r] = this.renderStereo(n);
    } catch {
      l = new Float32Array(n);
      r = new Float32Array(n);
    }
    const g = this.muted ? 0 : this.masterVolume;
    for (let i = 0; i < n; i++) {
      left[i] = Math.tanh((l[i] ?? 0) * g);
      right[i] = Math.tanh((r[i] ?? 0) * g);
    }
  }

  /** Render all layers + per-sample volume ramps (shared by the mix paths). */
  private renderLayers(n: number): {
    drone: Float32Array;
    melody: Float32Array;
    arp: Float32Array;
    noise: Float32Array;
    cadence: Float32Array | null;
    ramps: [Float32Array, Float32Array, Float32Array, Float32Array];
  } {
    const ms = this.musical;
    const dt = n / SAMPLE_RATE;

    // Smooth volume transitions — per-sample linear ramp to avoid step
    // discontinuities at buffer boundaries (audible as ~43 Hz buzz)
    const smooth = 0.15;
    const pd = this.smoothDroneVol;
    const pm = this.smoothMelodyVol;
    const pa = this.smoothArpVol;
    const pn = this.smoothNoiseVol;
    this.smoothDroneVol = lerp(pd, ms.drone_volume, smooth);
    this.smoothMelodyVol = lerp(pm, ms.melody_volume, smooth);
    this.smoothArpVol = lerp(pa, ms.arp_volume, smooth);
    this.smoothNoiseVol = lerp(pn, ms.noise_volume, smooth);
    const ramps: [Float32Array, Float32Array, Float32Array, Float32Array] = [
      linspace(pd, this.smoothDroneVol, n),
      linspace(pm, this.smoothMelodyVol, n),
      linspace(pa, this.smoothArpVol, n),
      linspace(pn, this.smoothNoiseVol, n),
    ];

    // Root portamento
    this.currentRootHz = lerp(this.currentRootHz, this.targetRootHz, 0.05);

    let drone: Float32Array;
    if (this.crossfadeRemaining > 0) {
      // During style crossfade: render with both styles and blend
      const progress = 1.0 - this.crossfadeRemaining / Math.max(1, this.crossfadeTotal);
      this.crossfadeRemaining = Math.max(0, this.crossfadeRemaining - n);
      const droneNew = this.renderDrone(n);
      const saved = this.style;
      this.style = this.oldStyle;
      const droneOld = this.renderDrone(n);
      this.style = saved;
      // Crossfade: equal-power curve
      const fNew = Math.fround(Math.sqrt(progress));
      const fOld = Math.fround(Math.sqrt(1.0 - progress));
      drone = new Float32Array(n);
      for (let i = 0; i < n; i++) drone[i] = (droneOld[i] ?? 0) * fOld + (droneNew[i] ?? 0) * fNew;
    } else {
      drone = this.renderDrone(n);
    }

    const melody = this.renderMelody(n);
    const arp = this.renderArpeggio(n);
    const noise = this.renderNoise(n, dt);
    const cadence = this.renderCadence(n);
    return { drone, melody, arp, noise, cadence, ramps };
  }

  /**
   * Mix all layers into left/right buffers.
   *
   * The melody pans with the playhead as it sweeps the viewport, so the grid
   * is spatially audible; the arpeggio leans toward where the universe is
   * changing, with a slow LFO wobble. Drone, noise and cadence stay centered.
   * Constant-power panning, with per-sample gain ramps so pan moves never
   * click.
   */
  renderStereo(n: number): [Float32Array, Float32Array] {
    const { drone, melody, arp, noise, cadence, ramps } = this.renderLayers(n);
    const [droneRamp, melodyRamp, arpRamp, noiseRamp] = ramps;
    const snap = this.snapshot;

    const melodyPan = Math.min(1.0, Math.max(0.0, snap.playhead_position));
    this.autopanPhase = pmod(this.autopanPhase + (TWO_PI * n) / SAMPLE_RATE / 13.0, TWO_PI);
    const arpPan = Math.min(1.0, Math.max(0.0, snap.activity_x + 0.12 * Math.sin(this.autopanPhase)));

    const halfPi = Math.PI / 2.0;
    const melTheta = linspace(this.prevMelodyPan, melodyPan, n);
    const arpTheta = linspace(this.prevArpPan, arpPan, n);
    this.prevMelodyPan = melodyPan;
    this.prevArpPan = arpPan;

    const left = new Float32Array(n);
    const right = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const mv = (melody[i] ?? 0) * (melodyRamp[i] ?? 0);
      const av = (arp[i] ?? 0) * (arpRamp[i] ?? 0);
      let center = (drone[i] ?? 0) * (droneRamp[i] ?? 0) + (noise[i] ?? 0) * (noiseRamp[i] ?? 0);
      if (cadence) center += (cadence[i] ?? 0) * CADENCE_VOLUME;
      center *= 0.7071; // constant-power center
      const mt = (melTheta[i] ?? 0) * halfPi;
      const at = (arpTheta[i] ?? 0) * halfPi;
      left[i] = center + mv * Math.cos(mt) + av * Math.cos(at);
      right[i] = center + mv * Math.sin(mt) + av * Math.sin(at);
    }
    return [left, right];
  }

  /** Render the resolving cadence voice, or null while inactive. */
  private renderCadence(n: number): Float32Array | null {
    if (this.cadenceCooldown > 0) this.cadenceCooldown -= n;
    if (this.cadenceIdx < 0) return null;

    if (this.cadenceRemaining <= 0) {
      const next = this.cadenceSeq[this.cadenceIdx];
      if (next) {
        const [freq, dur] = next;
        if (this.cadenceIdx === 0) this.cadenceVoice.noteOn(freq);
        else this.cadenceVoice.retrigger(freq); // legato slide down the resolution
        this.cadenceRemaining = dur;
        this.cadenceIdx += 1;
      } else if (this.cadenceVoice.gate) {
        this.cadenceVoice.noteOff(); // let the release ring out
      } else if (!this.cadenceVoice.active) {
        this.cadenceIdx = -1; // tail finished
        return null;
      }
    }
    this.cadenceRemaining -= n;
    return this.cadenceVoice.render(n);
  }

  // ── Drone layer ────────────────────────────────────────────────────

  /** Continuous drone bed — always present, breathes with LFO. */
  private renderDrone(n: number): Float32Array {
    const rootHz = this.currentRootHz;
    const fifthHz = rootHz * 1.5; // Perfect fifth
    const tInc = 1.0 / SAMPLE_RATE;

    // LFO for breathing (very slow: ~0.1 Hz)
    const lfoFreq = 0.08;
    const lfo = new Float32Array(n);
    let lastLfo = this.droneLfoPhase;
    for (let i = 0; i < n; i++) {
      lastLfo = this.droneLfoPhase + TWO_PI * lfoFreq * (i / SAMPLE_RATE);
      lfo[i] = 0.15 * Math.fround(Math.sin(lastLfo));
    }
    this.droneLfoPhase = pmod(lastLfo + TWO_PI * lfoFreq * tInc, TWO_PI);

    const p1 = TWO_PI * rootHz * tInc;
    const p1d = TWO_PI * (rootHz * 1.003) * tInc; // Detuned root (chorus)
    const p2 = TWO_PI * fifthHz * tInc;
    const p2d = TWO_PI * (fifthHz * 1.002) * tInc; // Detuned fifth
    const ps = TWO_PI * (rootHz * 0.5) * tInc; // Sub-octave

    const ph1 = new Float64Array(n);
    const ph1d = new Float64Array(n);
    const ph2 = new Float64Array(n);
    const ph2d = new Float64Array(n);
    const phs = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      ph1[i] = this.dronePhase1 + i * p1;
      ph1d[i] = this.dronePhase1Det + i * p1d;
      ph2[i] = this.dronePhase2 + i * p2;
      ph2d[i] = this.dronePhase2Det + i * p2d;
      phs[i] = this.dronePhaseSub + i * ps;
    }
    // Keep phases bounded to preserve float precision
    this.dronePhase1 = pmod((ph1[n - 1] ?? 0) + p1, TWO_PI);
    this.dronePhase1Det = pmod((ph1d[n - 1] ?? 0) + p1d, TWO_PI);
    this.dronePhase2 = pmod((ph2[n - 1] ?? 0) + p2, TWO_PI);
    this.dronePhase2Det = pmod((ph2d[n - 1] ?? 0) + p2d, TWO_PI);
    this.dronePhaseSub = pmod((phs[n - 1] ?? 0) + ps, TWO_PI);

    let drone: Float32Array = new Float32Array(n);
    if (this.style === STYLE_CHIPTUNE) {
      // Detuned square waves + triangle sub
      const osc1 = squareWave(ph1, 0.5, rootHz);
      const osc2 = squareWave(ph2d, 0.5, fifthHz * 1.002);
      const sub = triangleWave(phs);
      for (let i = 0; i < n; i++) drone[i] = (osc1[i] ?? 0) * 0.35 + (osc2[i] ?? 0) * 0.25 + (sub[i] ?? 0) * 0.4;
    } else {
      // Ambient: detuned sines + filtered fifth
      const osc1 = sineWave(ph1);
      const osc1d = sineWave(ph1d);
      const osc2 = sineWave(ph2);
      const sub = sineWave(phs);
      for (let i = 0; i < n; i++) {
        drone[i] = (osc1[i] ?? 0) * 0.4 + (osc1d[i] ?? 0) * 0.15 + (osc2[i] ?? 0) * 0.25 + (sub[i] ?? 0) * 0.2;
      }
      // Low-pass filter for warmth
      drone = this.lpfDrone.apply(drone);
    }
    // Apply LFO breathing
    for (let i = 0; i < n; i++) drone[i] = (drone[i] ?? 0) * (0.85 + (lfo[i] ?? 0));
    return drone;
  }

  // ── Melody layer ───────────────────────────────────────────────────

  /** Grid-scanning playhead: alive cells at current column → pitches. */
  private renderMelody(n: number): Float32Array {
    const target = this.musical.playhead_notes;

    // Update voice assignments — portamento for small pitch changes to avoid
    // ADSR retriggering at 30Hz (audible flutter). Only hard-retrigger for
    // large intervals (> ~1 semitone = 6% freq change).
    this.melodyVoices.forEach((voice, i) => {
      const freq = target[i];
      if (freq !== undefined) {
        if (!voice.active) voice.noteOn(freq);
        else if (Math.abs(voice.target_freq - freq) > voice.target_freq * 0.06) voice.noteOn(freq);
        else voice.retrigger(freq);
      } else if (voice.gate) {
        voice.noteOff();
      }
    });

    // Ambient gets a per-voice boost (sines have ~3dB less RMS than squares)
    const gain = this.style === STYLE_AMBIENT ? 0.5 : 0.3;
    let buf: Float32Array = new Float32Array(n);
    for (const voice of this.melodyVoices) {
      if (!voice.active) continue;
      const v = voice.render(n);
      for (let i = 0; i < n; i++) buf[i] = (buf[i] ?? 0) + (v[i] ?? 0) * gain;
    }
    // Chiptune melody benefits from a slight LPF to tame square harmonics
    if (this.style === STYLE_CHIPTUNE) buf = this.lpfMelody.apply(buf);
    return buf;
  }

  // ── Arpeggio layer ─────────────────────────────────────────────────

  /** Rhythmic arpeggiated texture, speed tied to cycle detection. */
  private renderArpeggio(n: number): Float32Array {
    const ms = this.musical;
    const pattern = ms.arp_pattern;
    if (!pattern.length) return new Float32Array(n);
    const root = ms.target_root_midi;
    const noteDur = Math.max(1, Math.trunc(SAMPLE_RATE / Math.max(0.5, ms.arp_speed)));

    let buf: Float32Array = new Float32Array(n);
    let done = 0;
    while (done < n) {
      // Samples remaining in current note
      const chunk = Math.max(1, Math.min(noteDur - this.arpSamplesInNote, n - done));
      const freq = midiToHz(root + (pattern[this.arpNoteIdx % pattern.length] ?? 0));
      if (!this.arpVoice.active || Math.abs(this.arpVoice.target_freq - freq) > 1.0) this.arpVoice.noteOn(freq);
      this.arpVoice.style = this.style;

      const rendered = this.arpVoice.render(chunk);
      const gain = this.style === STYLE_AMBIENT ? 0.55 : 0.4;
      for (let i = 0; i < chunk && done + i < n; i++) buf[done + i] = (rendered[i] ?? 0) * gain;

      this.arpSamplesInNote += chunk;
      done += chunk;
      // Advance to next note when current note is complete
      if (this.arpSamplesInNote >= noteDur) {
        this.arpSamplesInNote = 0;
        this.arpNoteIdx = (this.arpNoteIdx + 1) % pattern.length;
        this.arpVoice.noteOn(midiToHz(root + (pattern[this.arpNoteIdx % pattern.length] ?? 0)));
      }
    }
    // Tame chiptune square harmonics; ambient sines don't need filtering
    if (this.style === STYLE_CHIPTUNE) buf = this.lpfArp.apply(buf);
    return buf;
  }

  // ── Noise layer ────────────────────────────────────────────────────

  /** Percussive noise bursts triggered by population delta spikes. */
  private renderNoise(n: number, dt: number): Float32Array {
    const absDelta = Math.abs(this.snapshot.pop_delta);
    // Trigger a new burst when pop_delta exceeds threshold. Require full
    // completion + cooldown to prevent chain-firing flutter.
    if (this.noiseBurstCooldown > 0) this.noiseBurstCooldown = Math.max(0.0, this.noiseBurstCooldown - dt);
    if (absDelta >= this.noiseBurstThreshold && this.noiseBurstPhase >= 1.0 && this.noiseBurstCooldown <= 0) {
      this.noiseBurstPhase = 0.0;
      this.noiseBurstAmp = lerp(0.1, 0.5, Math.min(1.0, absDelta / 80.0));
      // Bigger events = longer bursts
      this.noiseBurstDuration = lerp(0.08, 0.25, Math.min(1.0, absDelta / 100.0));
      // Cooldown: at least the burst duration + 100ms breathing room
      this.noiseBurstCooldown = this.noiseBurstDuration + 0.1;
    }
    // If no burst active, return silence
    if (this.noiseBurstPhase >= 1.0) return new Float32Array(n);

    // Read from the pre-generated noise pool (circular buffer)
    const pool = this.noisePool;
    const idx = this.noisePoolIdx % pool.length;
    const noise = new Float32Array(n);
    for (let i = 0; i < n; i++) noise[i] = pool[(idx + i) % pool.length] ?? 0;
    this.noisePoolIdx = (idx + n) % pool.length;

    // Per-sample envelope for the burst: attack (first 10%) then exponential decay
    const burst = Math.max(0.01, this.noiseBurstDuration);
    const attackEnd = burst * 0.1;
    const t0 = this.noiseBurstPhase * burst;
    const env = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = Math.fround(t0 + (i * (n / SAMPLE_RATE)) / n);
      env[i] = t < attackEnd ? t / Math.max(0.001, attackEnd) : Math.exp((-6.0 * (t - attackEnd)) / burst);
    }

    // Advance burst phase
    this.noiseBurstPhase = Math.min(1.0, this.noiseBurstPhase + dt / burst);

    const out = new Float32Array(n);
    if (this.style === STYLE_CHIPTUNE) {
      // NES-style: downsample for lo-fi crunch
      for (let i = 0; i < n; i++) out[i] = (noise[i - (i % 8)] ?? 0) * (env[i] ?? 0) * this.noiseBurstAmp;
    } else {
      // Ambient: low-pass filtered wash
      const filtered = this.lpfNoise.apply(noise);
      for (let i = 0; i < n; i++) out[i] = (filtered[i] ?? 0) * (env[i] ?? 0) * this.noiseBurstAmp * 0.6;
    }
    return out;
  }

  // ── Status string for display ──────────────────────────────────────

  statusString(): string {
    if (this.muted) return '[MUTE]';
    return `${this.style === STYLE_CHIPTUNE ? 'NES' : 'AMB'} ${this.volumePercent}%`;
  }
}

/** The status string, from the controls alone (the page mirrors them). */
export function statusString(muted: boolean, style: Style, volume: number): string {
  if (muted) return '[MUTE]';
  return `${style === STYLE_CHIPTUNE ? 'NES' : 'AMB'} ${Math.round(volume * 100)}%`;
}
