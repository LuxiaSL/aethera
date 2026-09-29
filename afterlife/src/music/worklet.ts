/**
 * worklet.ts — where the music engine plays.
 *
 * life_music.py rendered on PyAudio's callback thread and read the latest
 * SimulationSnapshot the main thread had swapped in. This is the same shape:
 * the page posts snapshots and control changes, and the engine renders
 * BUFFER_SIZE-frame blocks on the audio thread, handed out 128 frames at a
 * time. vite.config.ts bundles this file on its own and inlines it into the
 * page as a string, so it loads from a blob: URL without a second request.
 *
 * Nothing here allocates per quantum (the engine renders into scratch it
 * owns), so the audio thread gives the garbage collector nothing to pause
 * for. A block that comes out NaN — a NaN in a snapshot is enough, and one
 * NaN in a filter's state would be the rest of the evening — is played as
 * silence while the engine puts its state back.
 */

import { BUFFER_SIZE, LifeMusicEngine, SAMPLE_RATE, type SimulationSnapshot, type Style } from './engine';

// The AudioWorkletGlobalScope, which lib.dom doesn't describe
declare abstract class AudioWorkletProcessor {
  readonly port: MessagePort;
  abstract process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean;
}
declare function registerProcessor(name: string, ctor: new () => AudioWorkletProcessor): void;
declare const sampleRate: number;

export type ToWorklet =
  | { type: 'snapshot'; snap: SimulationSnapshot }
  | { type: 'controls'; muted: boolean; volume: number; style: Style }
  | { type: 'stop' };

class AfterlifeProcessor extends AudioWorkletProcessor {
  private engine = new LifeMusicEngine();
  private left = new Float32Array(BUFFER_SIZE);
  private right = new Float32Array(BUFFER_SIZE);
  private pos = BUFFER_SIZE; // empty: render on the first quantum
  private running = true;
  private nanWarned = false;

  constructor() {
    super();
    // Every pitch and time constant in the engine assumes SAMPLE_RATE; at
    // another rate it all plays sharp or flat (audio.ts asks for SAMPLE_RATE)
    if (typeof sampleRate === 'number' && sampleRate !== SAMPLE_RATE) {
      console.warn(`afterlife music: context runs at ${sampleRate} Hz, the engine at ${SAMPLE_RATE} Hz — pitches will be off`);
    }
    this.port.onmessage = (e: MessageEvent<ToWorklet>) => {
      const m = e.data;
      if (m.type === 'snapshot') this.engine.update(m.snap);
      else if (m.type === 'controls') {
        this.engine.muted = m.muted;
        this.engine.masterVolume = m.volume;
        this.engine.setStyle(m.style);
      } else if (m.type === 'stop') this.running = false;
    };
  }

  process(_inputs: Float32Array[][], outputs: Float32Array[][]): boolean {
    const out = outputs[0];
    const l = out?.[0];
    if (!out || !l) return this.running;
    const r = out[1] ?? l;
    let written = 0;
    while (written < l.length) {
      if (this.pos >= BUFFER_SIZE) {
        this.renderBlock();
        this.pos = 0;
      }
      const take = Math.min(l.length - written, BUFFER_SIZE - this.pos);
      // A copy loop, not set(subarray()), which makes two views a quantum
      const src = this.pos - written;
      for (let i = written; i < written + take; i++) l[i] = this.left[src + i] ?? 0;
      if (r !== l) for (let i = written; i < written + take; i++) r[i] = this.right[src + i] ?? 0;
      this.pos += take;
      written += take;
    }
    return this.running;
  }

  /** The next block into left/right, or silence (and a healed engine) if it came out NaN. */
  private renderBlock(): void {
    const { left, right } = this;
    this.engine.renderBlock(left, right, BUFFER_SIZE);
    // tanh keeps every finite sample in [-1, 1], so the sum is finite unless one is NaN
    let sum = 0;
    for (let i = 0; i < BUFFER_SIZE; i++) sum += (left[i] ?? 0) + (right[i] ?? 0);
    if (Number.isFinite(sum)) return;
    left.fill(0);
    right.fill(0);
    this.engine.recover();
    if (!this.nanWarned) {
      this.nanWarned = true;
      console.warn('afterlife music: a block came out NaN; played silence and reset the engine state');
    }
  }
}

registerProcessor('afterlife-music', AfterlifeProcessor);
