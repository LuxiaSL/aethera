/**
 * loom — pleroma's deck: a fan of futures, one of them worn.
 *
 * The futures are real ones, from pleroma's recorded fixtures (a K=16 fan,
 * trimmed to six). Threads leave one point on the warp beam and splay into
 * the cards; the worn one runs amber, because in pleroma amber means worn and
 * only worn. Underneath, the dose strip with its four zones. The loom itself
 * runs on somebody's own GPU; this is its picture.
 */

import { H, MONO, Screen, W, type ScreenEnv } from './screen';
import type { Site } from '../data';

const BG = '#0a0d10';
const PANEL = '#0e1216';
const HAIR = '#1e262d';
const INK = '#c6d0d8';
const INK_DIM = '#93a1ac';
const INK_FAINT = '#75828d';
const WARP = '#5fb6c4';
const WARP_DIM = '#2b5a63';
const WEFT = '#e0a94b';

const FUTURES: { i: number; pull: number; text: string }[] = [
  { i: 1, pull: 0.8, text: 'I would choose to speak in a voice that is both poetic and informative,' },
  { i: 3, pull: 0.88, text: "As a conversational AI, I'd love to explore various options for speaking" },
  { i: 4, pull: 1.08, text: "As a conversational AI, I'm intrigued by the idea of choosing how to speak" },
  { i: 9, pull: 1.36, text: 'I would choose to express myself in a lyrical and poetic manner, weaving' },
  { i: 10, pull: 1.14, text: 'I would choose a unique, mesmerizing, and captivating form of communication' },
  { i: 14, pull: 1.09, text: 'I would choose to speak in a mesmerizing blend of poetic cadence and' },
];

const ZONES: [number, number, string][] = [
  [0, 0.125, '#14414c'],
  [0.125, 0.75, '#4b4527'],
  [0.75, 1.007, '#6d4a17'],
  [1.007, 1.42, '#5a2320'],
];

const CYCLE = 13;

export class LoomScreen extends Screen {
  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 20;
  }

  protected draw(t: number): void {
    const ctx = this.ctx;
    this.clear(BG);
    ctx.fillStyle = 'rgba(95,182,196,0.05)';
    for (let x = 0; x < W; x += 32) ctx.fillRect(x, 0, 1, H);

    const round = Math.floor(t / CYCLE);
    const phase = (t % CYCLE) / CYCLE;
    const worn = [3, 0, 4, 2][round % 4] ?? 3;
    const drawn = Math.min(1, phase / 0.35); // threads going out, cards harvested
    const wearing = phase > 0.45;
    const alpha = 0.675;

    // rig
    ctx.font = `13px ${MONO}`;
    ctx.fillStyle = WARP;
    this.spaced('LOOM', 16, 24, 5);
    ctx.font = `10px ${MONO}`;
    ctx.fillStyle = INK_FAINT;
    ctx.textAlign = 'right';
    ctx.fillText(`k=6 · horizon 192 · drawn in ${(12.3 + (round % 3) * 1.7).toFixed(1)} s`, W - 16, 24);
    ctx.textAlign = 'left';

    // wear bar
    ctx.fillStyle = PANEL;
    ctx.fillRect(10, 34, W - 20, 22);
    ctx.strokeStyle = HAIR;
    ctx.strokeRect(10.5, 34.5, W - 21, 21);
    ctx.beginPath();
    ctx.arc(24, 45, 4, 0, Math.PI * 2);
    if (wearing) {
      ctx.save();
      ctx.shadowColor = WEFT;
      ctx.shadowBlur = 8;
      ctx.fillStyle = WEFT;
      ctx.fill();
      ctx.restore();
    } else {
      ctx.fillStyle = '#2c3740';
      ctx.fill();
    }
    ctx.font = `10px ${MONO}`;
    ctx.fillStyle = wearing ? WEFT : INK_FAINT;
    const f = FUTURES[worn];
    ctx.fillText(
      wearing ? `WEARING member code #${f?.i} · absolute · dose α ${alpha} [THRESHOLD]` : 'NO CODE WORN — conversation running straight',
      36, 49,
    );

    // warp beam and the fan
    const beamX = 34;
    const originY = 180;
    ctx.fillStyle = WARP_DIM;
    ctx.fillRect(beamX - 2, 70, 4, 226);
    const cardX = 92;
    const cardW = W - cardX - 14;
    FUTURES.forEach((fu, k) => {
      const y = 70 + k * 38;
      const cy = y + 17;
      const reach = Math.min(1, Math.max(0, drawn * 6 - k));
      const isWorn = wearing && k === worn;
      // thread
      ctx.strokeStyle = isWorn ? WEFT : `rgba(95,182,196,${0.25 + fu.pull * 0.3})`;
      ctx.lineWidth = isWorn ? 2.2 : 0.6 + fu.pull * 0.9;
      ctx.beginPath();
      ctx.moveTo(beamX, originY);
      const ex = beamX + (cardX - beamX) * reach;
      const ey = originY + (cy - originY) * reach;
      ctx.bezierCurveTo(beamX + 30 * reach, originY, ex - 24 * reach, ey, ex, ey);
      ctx.stroke();
      if (reach < 1) return;
      // card
      ctx.fillStyle = PANEL;
      ctx.fillRect(cardX, y, cardW, 34);
      ctx.strokeStyle = isWorn ? WEFT : HAIR;
      ctx.strokeRect(cardX + 0.5, y + 0.5, cardW - 1, 33);
      if (isWorn) {
        ctx.fillStyle = WEFT;
        ctx.fillRect(cardX, y, 3, 34);
      }
      ctx.font = `10px ${MONO}`;
      ctx.fillStyle = isWorn ? WEFT : WARP;
      ctx.fillText(`#${fu.i}`, cardX + 8, y + 13);
      ctx.fillStyle = HAIR;
      ctx.fillRect(cardX + 36, y + 9, 60, 3);
      ctx.fillStyle = isWorn ? WEFT : WARP;
      ctx.fillRect(cardX + 36, y + 9, 60 * Math.min(1, fu.pull / 1.4), 3);
      ctx.fillStyle = INK_FAINT;
      ctx.fillText(`pull ×${fu.pull.toFixed(2)}`, cardX + 104, y + 13);
      if (isWorn) {
        ctx.fillStyle = WEFT;
        ctx.textAlign = 'right';
        ctx.fillText('worn', cardX + cardW - 8, y + 13);
        ctx.textAlign = 'left';
      }
      ctx.font = `11px ${MONO}`;
      ctx.fillStyle = isWorn ? INK : INK_DIM;
      ctx.fillText(this.wrap(fu.text, cardW - 16, 1)[0] ?? '', cardX + 8, y + 28);
    });

    // harvest slots while drawing
    if (drawn < 1) {
      for (let k = 0; k < 6; k++) {
        const on = drawn * 6 > k + 1;
        ctx.fillStyle = on ? WARP : HAIR;
        ctx.fillRect(16 + k * 12, 308, 9, 9);
      }
    }

    // dose strip
    const sx = 150;
    const sw = W - sx - 16;
    const sy = 322;
    const max = 1.42;
    for (const [a, b, c] of ZONES) {
      ctx.fillStyle = c;
      ctx.fillRect(sx + (a / max) * sw, sy, ((b - a) / max) * sw, 14);
    }
    ctx.strokeStyle = HAIR;
    ctx.strokeRect(sx + 0.5, sy + 0.5, sw - 1, 13);
    const thumbX = sx + (alpha / max) * sw;
    ctx.fillStyle = wearing ? WEFT : INK_FAINT;
    ctx.fillRect(thumbX - 1, sy - 5, 2, 24);
    ctx.font = `26px ${MONO}`;
    ctx.fillStyle = wearing ? WEFT : '#3a4650';
    ctx.fillText(`α ${alpha}`, 16, sy + 16);
    ctx.font = `9px ${MONO}`;
    ctx.fillStyle = INK_FAINT;
    ['subliminal', 'threshold', 'audible', 'overdriven'].forEach((z, i) => {
      const [a, b] = ZONES[i] ?? [0, 0];
      ctx.fillText(z, sx + (((a + b) / 2) / max) * sw - z.length * 2.6, sy + 30);
    });
    ctx.fillStyle = INK_FAINT;
    ctx.fillText('manner, not content', 16, H - 14);
  }
}
