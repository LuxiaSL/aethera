/**
 * audio.ts — the creature's voice.
 *
 * Three layers:
 *  - plucks: a breath crossing a string (short chime, brightness = youth)
 *  - drones: the eldest strings sustain quietly; the chord *is* the geometry,
 *    gliding as the body deforms
 *  - falls: a string dying releases a slow descending tone
 *
 *  - pulses: a node's Kuramoto phase coming round, strumming every string it
 *    holds — an octave up, soft, brightening as the node locks with its
 *    neighbours. Breaths are the melody; pulses are the weather.
 *
 * Everything runs through a soft compressor and a long feedback delay, so the
 * body always sounds like it lives in a large, dark room.
 */

/**
 * A fully locked body strums every string at once (~36 tones on a grown
 * creature). That should sound like one animal, so the ceiling has to clear it
 * — this is a runaway guard, not a mixing decision.
 */
const MAX_PULSE_VOICES = 48;

export interface DroneTarget {
  id: number;
  freq: number;
  pan: number;
  level: number;
}

interface DroneVoice {
  osc: OscillatorNode;
  overtone: OscillatorNode;
  gain: GainNode;
  panner: StereoPannerNode;
  lfo: OscillatorNode;
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private delaySend: GainNode | null = null;
  private drones = new Map<number, DroneVoice>();
  private muted = false;
  private activePulses = 0;

  get running(): boolean {
    return this.ctx !== null && this.ctx.state === 'running';
  }

  /** Must be called from a user gesture. Safe to call repeatedly. */
  async start(): Promise<void> {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') await this.ctx.resume().catch(() => undefined);
      return;
    }
    try {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = 0.7;

      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -22;
      compressor.knee.value = 18;
      compressor.ratio.value = 5;
      compressor.attack.value = 0.01;
      compressor.release.value = 0.35;

      // dark-room feedback delay
      const delay = ctx.createDelay(2);
      delay.delayTime.value = 0.48;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.34;
      const delayColor = ctx.createBiquadFilter();
      delayColor.type = 'lowpass';
      delayColor.frequency.value = 1800;
      const delaySend = ctx.createGain();
      delaySend.gain.value = 0.5;

      delaySend.connect(delay);
      delay.connect(delayColor);
      delayColor.connect(feedback);
      feedback.connect(delay);
      delayColor.connect(master);

      master.connect(compressor);
      compressor.connect(ctx.destination);

      this.ctx = ctx;
      this.master = master;
      this.delaySend = delaySend;
      if (ctx.state === 'suspended') await ctx.resume().catch(() => undefined);
    } catch (err) {
      console.warn('syrinx: audio unavailable, running silent', err);
      this.ctx = null;
    }
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.1);
    }
  }

  get isMuted(): boolean {
    return this.muted;
  }

  /** A breath crossing a string. brightness in (0,1]: young = bright. */
  pluck(freq: number, pan: number, gain: number, brightness: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.delaySend) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;

      const shimmer = ctx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.value = freq * 2;

      const shimmerGain = ctx.createGain();
      shimmerGain.gain.value = 0.25 * brightness;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 700 + brightness * 3800;
      filter.Q.value = 0.7;

      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(gain, t + 0.008);
      env.gain.exponentialRampToValueAtTime(0.0004, t + 2.8);

      const panner = ctx.createStereoPanner();
      panner.pan.value = clampPan(pan);

      osc.connect(filter);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(filter);
      filter.connect(env);
      env.connect(panner);
      panner.connect(this.master);
      panner.connect(this.delaySend);

      osc.start(t);
      shimmer.start(t);
      osc.stop(t + 3);
      shimmer.stop(t + 3);
      cleanup([osc, shimmer, shimmerGain, filter, env, panner], osc);
    } catch (err) {
      console.warn('syrinx: pluck failed', err);
    }
  }

  /**
   * One string of a node's strum, an octave above the melody.
   *
   * Softer and rounder than a pluck — the pulse layer is texture, not tune, and
   * must sit *under* the breaths even though it sits above them in pitch.
   * `sync` (0..1, how locked the node is with its neighbours) opens the filter
   * and lifts the gain, so coherence is not something you infer from the HUD:
   * a cluster falling into step is a cluster getting brighter.
   */
  pulse(freq: number, pan: number, gain: number, sync: number, delay = 0): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.delaySend) return;
    if (this.activePulses >= MAX_PULSE_VOICES) return; // a wall of strums is mud
    try {
      const t = ctx.currentTime + Math.max(0, delay);
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;

      // a locked node speaks with a little more body
      const body = ctx.createOscillator();
      body.type = 'triangle';
      body.frequency.value = freq;
      const bodyGain = ctx.createGain();
      bodyGain.gain.value = 0.1 + sync * 0.3;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900 + sync * 2600;
      filter.Q.value = 0.6;

      const level = gain * (0.55 + sync * 0.45);
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(level, t + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0004, t + 1.5);

      const panner = ctx.createStereoPanner();
      panner.pan.value = clampPan(pan);

      osc.connect(filter);
      body.connect(bodyGain);
      bodyGain.connect(filter);
      filter.connect(env);
      env.connect(panner);
      panner.connect(this.master);
      panner.connect(this.delaySend);

      this.activePulses++;
      osc.start(t);
      body.start(t);
      osc.stop(t + 1.7);
      body.stop(t + 1.7);
      osc.onended = () => {
        this.activePulses = Math.max(0, this.activePulses - 1);
        for (const n of [osc, body, bodyGain, filter, env, panner]) {
          try {
            n.disconnect();
          } catch {
            /* fine */
          }
        }
      };
    } catch (err) {
      console.warn('syrinx: pulse failed', err);
    }
  }

  /** A string dying: a slow fall of a fifth into silence. */
  fall(freq: number, pan: number): void {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.delaySend) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(Math.max(30, freq * (2 / 3)), t + 2.2);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.12, t + 0.05);
      env.gain.exponentialRampToValueAtTime(0.0004, t + 3.2);

      const panner = ctx.createStereoPanner();
      panner.pan.value = clampPan(pan);

      osc.connect(env);
      env.connect(panner);
      panner.connect(this.master);
      panner.connect(this.delaySend);
      osc.start(t);
      osc.stop(t + 3.5);
      cleanup([osc, env, panner], osc);
    } catch (err) {
      console.warn('syrinx: fall failed', err);
    }
  }

  /**
   * Reconcile the sustained layer with the current elder strings.
   * Existing voices glide; new voices swell in; absent voices fade out.
   */
  updateDrones(targets: DroneTarget[]): void {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const t = ctx.currentTime;
    const wanted = new Set(targets.map((d) => d.id));

    for (const [id, voice] of this.drones) {
      if (!wanted.has(id)) {
        voice.gain.gain.setTargetAtTime(0, t, 0.8);
        const toStop = voice;
        setTimeout(() => {
          try {
            toStop.osc.stop();
            toStop.overtone.stop();
            toStop.lfo.stop();
          } catch {
            /* already stopped */
          }
        }, 4000);
        this.drones.delete(id);
      }
    }

    for (const target of targets) {
      const existing = this.drones.get(target.id);
      if (existing) {
        existing.osc.frequency.setTargetAtTime(target.freq, t, 0.5);
        existing.overtone.frequency.setTargetAtTime(target.freq * 2, t, 0.5);
        existing.gain.gain.setTargetAtTime(target.level, t, 0.6);
        existing.panner.pan.setTargetAtTime(clampPan(target.pan), t, 0.5);
        continue;
      }
      try {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = target.freq;
        const overtone = ctx.createOscillator();
        overtone.type = 'sine';
        overtone.frequency.value = target.freq * 2;
        const overtoneGain = ctx.createGain();
        overtoneGain.gain.value = 0.18;

        // slow breathing wobble, a few cents
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.06 + Math.random() * 0.08;
        const lfoDepth = ctx.createGain();
        lfoDepth.gain.value = 4;
        lfo.connect(lfoDepth);
        lfoDepth.connect(osc.detune);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, t);
        gain.gain.setTargetAtTime(target.level, t, 2.0);

        const panner = ctx.createStereoPanner();
        panner.pan.value = clampPan(target.pan);

        osc.connect(gain);
        overtone.connect(overtoneGain);
        overtoneGain.connect(gain);
        gain.connect(panner);
        panner.connect(this.master);

        osc.start(t);
        overtone.start(t);
        lfo.start(t);
        this.drones.set(target.id, { osc, overtone, gain, panner, lfo });
      } catch (err) {
        console.warn('syrinx: drone voice failed', err);
      }
    }
  }
}

function clampPan(pan: number): number {
  return Math.max(-0.8, Math.min(0.8, Number.isFinite(pan) ? pan : 0));
}

function cleanup(nodes: AudioNode[], driver: OscillatorNode): void {
  driver.onended = () => {
    for (const n of nodes) {
      try {
        n.disconnect();
      } catch {
        /* fine */
      }
    }
  };
}
