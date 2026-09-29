/**
 * worklet.ts — where the music engine plays.
 *
 * life_music.py rendered on PyAudio's callback thread and read the latest
 * SimulationSnapshot the main thread had swapped in. This is the same shape:
 * the page posts snapshots and control changes, and the engine renders
 * BUFFER_SIZE-frame blocks on the audio thread, handed out 128 frames at a
 * time. vite.config.ts bundles this file on its own and inlines it into the
 * page as a string, so it loads from a blob: URL without a second request.
 */

import { BUFFER_SIZE, LifeMusicEngine, type SimulationSnapshot, type Style } from './engine';

// The AudioWorkletGlobalScope, which lib.dom doesn't describe
declare abstract class AudioWorkletProcessor {
  readonly port: MessagePort;
  abstract process(inputs: Float32Array[][], outputs: Float32Array[][]): boolean;
}
declare function registerProcessor(name: string, ctor: new () => AudioWorkletProcessor): void;

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

  constructor() {
    super();
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
        this.engine.renderBlock(this.left, this.right, BUFFER_SIZE);
        this.pos = 0;
      }
      const take = Math.min(l.length - written, BUFFER_SIZE - this.pos);
      l.set(this.left.subarray(this.pos, this.pos + take), written);
      if (r !== l) r.set(this.right.subarray(this.pos, this.pos + take), written);
      this.pos += take;
      written += take;
    }
    return this.running;
  }
}

registerProcessor('afterlife-music', AfterlifeProcessor);
