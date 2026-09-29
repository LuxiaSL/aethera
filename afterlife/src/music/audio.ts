/**
 * audio.ts — the page's side of the music.
 *
 * Owns the AudioContext and the worklet node, mirrors the controls (mute,
 * volume, style) so the status line can be written without asking the audio
 * thread, and forwards each frame's snapshot. The browser only lets sound
 * start from a gesture, so start() is called from the first click or key;
 * until then there is no engine, which the status line shows the way the
 * terminal showed a missing PyAudio: by saying nothing.
 */

import workletSource from 'virtual:afterlife-worklet';
import { SAMPLE_RATE, STYLES, statusString, type SimulationSnapshot, type Style } from './engine';
import type { ToWorklet } from './worklet';

export class Music {
  private ctx: AudioContext | null = null;
  private node: AudioWorkletNode | null = null;
  private starting: Promise<boolean> | null = null;
  /** failed starts so far; past a few, stop building contexts on every key */
  private failures = 0;
  muted = false;
  volume = 0.5;
  style: Style = STYLES[1]; // Start with ambient

  get running(): boolean {
    return this.node !== null;
  }

  /** Must be called from a user gesture. Resolves false when there's no audio to be had. */
  start(): Promise<boolean> {
    if (this.ctx) {
      // iOS parks a context as 'interrupted' (a call, Siri, another app's
      // audio); like 'suspended', a gesture is what brings it back
      const state: string = this.ctx.state;
      if (state === 'suspended' || state === 'interrupted') void this.ctx.resume().catch(() => undefined);
      return this.starting ?? Promise.resolve(this.running);
    }
    if (this.failures >= 3) return Promise.resolve(false);
    Music.preferPlayback();
    let ctx: AudioContext | null = null;
    const attempt = (async () => {
      try {
        ctx = new AudioContext({ sampleRate: SAMPLE_RATE, latencyHint: 'playback' });
        this.ctx = ctx;
        const url = URL.createObjectURL(new Blob([workletSource], { type: 'text/javascript' }));
        try {
          await ctx.audioWorklet.addModule(url);
        } finally {
          URL.revokeObjectURL(url);
        }
        const node = new AudioWorkletNode(ctx, 'afterlife-music', { numberOfInputs: 0, outputChannelCount: [2] });
        node.connect(ctx.destination);
        this.node = node;
        this.sendControls();
        if (ctx.state === 'suspended') await ctx.resume().catch(() => undefined);
        return true;
      } catch (err) {
        console.warn('afterlife: no music tonight', err);
        this.failures++;
        // a failed start isn't final: let the context go, so a later gesture
        // tries afresh instead of finding a half-built one
        if (ctx) void (ctx as AudioContext).close().catch(() => undefined);
        if (this.ctx === ctx) {
          this.ctx = null;
          this.node = null;
          this.starting = null;
        }
        return false;
      }
    })();
    // a synchronous failure has already reset us; don't pin its promise
    if (this.ctx) this.starting = attempt;
    return attempt;
  }

  /**
   * iOS plays web audio as 'ambient' by default, which the silent switch
   * mutes; 'playback' is what music is. Safari 17+ only, so looked up loosely.
   */
  private static preferPlayback(): void {
    try {
      const session = (navigator as Navigator & { audioSession?: { type?: string } }).audioSession;
      if (session && session.type !== 'playback') session.type = 'playback';
    } catch {
      // not ours to insist on
    }
  }

  private post(m: ToWorklet): void {
    this.node?.port.postMessage(m);
  }

  private sendControls(): void {
    this.post({ type: 'controls', muted: this.muted, volume: this.volume, style: this.style });
  }

  update(snap: SimulationSnapshot): void {
    this.post({ type: 'snapshot', snap });
  }

  toggleMute(): void {
    this.muted = !this.muted;
    this.sendControls();
  }

  adjustVolume(delta: number): void {
    this.volume = Math.max(0, Math.min(1, Math.round((this.volume + delta) * 100) / 100));
    this.sendControls();
  }

  cycleStyle(): void {
    this.style = STYLES[(STYLES.indexOf(this.style) + 1) % STYLES.length] ?? STYLES[1];
    this.sendControls();
  }

  /** Hidden tab: stop the clock so it doesn't hum over a frozen universe. */
  suspend(): void {
    void this.ctx?.suspend().catch(() => undefined);
  }

  resume(): void {
    void this.ctx?.resume().catch(() => undefined);
  }

  statusString(): string {
    return this.running ? statusString(this.muted, this.style, this.volume) : '';
  }

  stop(): void {
    this.post({ type: 'stop' });
    void this.ctx?.close().catch(() => undefined);
    this.ctx = null;
    this.node = null;
    this.starting = null;
  }
}
