/**
 * dream_gen — the dreamer's own loop, running.
 *
 * Its README draws the core loop in box characters; this is that diagram,
 * with a pulse going round it. The keyframe box holds the dream's real latest
 * keyframe and the prompt underneath is the one it was drawn from (both from
 * the chronicle), so the engine screen and the dreams screen agree.
 */

import { H, MONO, Screen, W, type ScreenEnv } from './screen';
import type { Site } from '../data';

const BG = '#07050b';
const VIOLET = '#d59bff';
const DIM = '#4d3a63';
const INK = '#e9e0f5';
const FAINT = '#8a7b9e';

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
}

const KF_PREV: Box = { x: 18, y: 54, w: 128, h: 74, label: 'KEYFRAME N-1' };
const KF: Box = { x: 192, y: 54, w: 128, h: 74, label: 'KEYFRAME N' };
const FRESH: Box = { x: 366, y: 54, w: 128, h: 74, label: 'FRESH FRAME' };
const INTERP: Box = { x: 18, y: 176, w: 302, h: 52, label: 'INTERPOLATION' };
const GUARD: Box = { x: 340, y: 150, w: 154, h: 104, label: 'COLLAPSE PREVENTION' };

export class DreamGenScreen extends Screen {
  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 15;
  }

  private box(b: Box, lit: number): void {
    const ctx = this.ctx;
    ctx.strokeStyle = lit > 0 ? VIOLET : DIM;
    ctx.globalAlpha = 0.5 + lit * 0.5;
    ctx.lineWidth = 1;
    ctx.strokeRect(b.x + 0.5, b.y + 0.5, b.w, b.h);
    ctx.globalAlpha = 1;
    ctx.font = `10px ${MONO}`;
    ctx.fillStyle = lit > 0 ? INK : FAINT;
    ctx.fillText(b.label, b.x + 6, b.y + 13);
  }

  private arrow(x0: number, y0: number, x1: number, y1: number, label: string, pulse: number): void {
    const ctx = this.ctx;
    ctx.strokeStyle = DIM;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    const dir = Math.sign(x1 - x0 || y1 - y0);
    ctx.fillStyle = DIM;
    ctx.beginPath();
    if (y0 === y1) {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - 6 * dir, y1 - 4);
      ctx.lineTo(x1 - 6 * dir, y1 + 4);
    } else {
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - 4, y1 - 6 * dir);
      ctx.lineTo(x1 + 4, y1 - 6 * dir);
    }
    ctx.fill();
    if (pulse >= 0 && pulse <= 1) {
      const px = x0 + (x1 - x0) * pulse;
      const py = y0 + (y1 - y0) * pulse;
      const g = ctx.createRadialGradient(px, py, 0, px, py, 8);
      g.addColorStop(0, 'rgba(213,155,255,1)');
      g.addColorStop(1, 'rgba(213,155,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(px - 8, py - 8, 16, 16);
    }
    if (label) {
      ctx.font = `9px ${MONO}`;
      ctx.fillStyle = FAINT;
      ctx.textAlign = 'center';
      ctx.fillText(label, (x0 + x1) / 2, y0 === y1 ? y0 - 6 : (y0 + y1) / 2);
      ctx.textAlign = 'left';
    }
  }

  protected draw(t: number): void {
    const ctx = this.ctx;
    this.clear(BG);
    const chron = this.env.feeds.chronicle.value;
    const cycle = 6;
    const p = (t % cycle) / cycle; // 0..1 round the loop
    const kfNo = 400 + Math.floor(t / cycle);

    ctx.font = `14px ${MONO}`;
    ctx.fillStyle = VIOLET;
    ctx.fillText('dream_gen', 18, 28);
    ctx.font = `10px ${MONO}`;
    ctx.fillStyle = FAINT;
    ctx.fillText('a truly infinite diffusion stream', 110, 28);
    ctx.textAlign = 'right';
    ctx.fillText(`kf ${String(kfNo).padStart(5, '0')}`, W - 18, 28);
    ctx.textAlign = 'left';

    this.box(KF_PREV, p < 0.25 ? 1 : 0);
    this.box(KF, p >= 0.25 && p < 0.5 ? 1 : 0.2);
    this.box(FRESH, 0);
    this.box(INTERP, p >= 0.5 ? 1 : 0);
    this.box(GUARD, Math.sin(t * 0.8) > 0.6 ? 1 : 0);

    // the latest keyframe, in its box
    if (chron.thumb) {
      ctx.drawImage(chron.thumb, KF.x + 6, KF.y + 18, KF.w - 12, (KF.w - 12) / 2);
      ctx.globalAlpha = 0.35;
      ctx.drawImage(chron.thumb, KF_PREV.x + 6, KF_PREV.y + 18, KF_PREV.w - 12, (KF_PREV.w - 12) / 2);
      ctx.globalAlpha = 1;
    } else {
      for (const b of [KF_PREV, KF]) {
        const g = ctx.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
        g.addColorStop(0, `hsl(${(t * 8 + b.x) % 360} 40% 30%)`);
        g.addColorStop(1, `hsl(${(t * 8 + b.x + 90) % 360} 40% 18%)`);
        ctx.fillStyle = g;
        ctx.fillRect(b.x + 6, b.y + 18, b.w - 12, (b.w - 12) / 2);
      }
    }
    ctx.fillStyle = '#1b1426';
    ctx.fillRect(FRESH.x + 6, FRESH.y + 18, FRESH.w - 12, (FRESH.w - 12) / 2);
    ctx.fillStyle = FAINT;
    ctx.font = `9px ${MONO}`;
    ctx.fillText('txt2img on swap', FRESH.x + 10, FRESH.y + 50);

    this.arrow(KF_PREV.x + KF_PREV.w, 91, KF.x, 91, 'img2img', p < 0.25 ? p / 0.25 : -1);
    this.arrow(FRESH.x, 91, KF.x + KF.w, 91, '', -1);
    this.arrow(KF.x + KF.w / 2, KF.y + KF.h, KF.x + KF.w / 2, INTERP.y, '', p >= 0.25 && p < 0.5 ? (p - 0.25) / 0.25 : -1);

    // interpolation frames filling
    const frames = 16;
    const done = p >= 0.5 ? Math.floor(((p - 0.5) / 0.5) * frames) : 0;
    for (let i = 0; i < frames; i++) {
      ctx.fillStyle = i < done ? VIOLET : '#1e1629';
      ctx.fillRect(INTERP.x + 8 + i * 18, INTERP.y + 22, 14, 18);
    }
    ctx.fillStyle = FAINT;
    ctx.font = `9px ${MONO}`;
    ctx.textAlign = 'right';
    ctx.fillText(`${done}/${frames} → stream`, INTERP.x + INTERP.w - 6, INTERP.y + 13);
    ctx.textAlign = 'left';

    // the three layers
    const layers: [string, string][] = [
      ['1 mutation', 'BEND 0.7'],
      ['2 cache', 'blend ~60%'],
      ['3 swap', 'fresh txt2img'],
    ];
    layers.forEach(([a, b], i) => {
      const y = GUARD.y + 34 + i * 22;
      ctx.fillStyle = INK;
      ctx.font = `10px ${MONO}`;
      ctx.fillText(a, GUARD.x + 8, y);
      ctx.fillStyle = FAINT;
      ctx.fillText(b, GUARD.x + 78, y);
    });

    // the prompt it's dreaming from
    ctx.fillStyle = 'rgba(20,12,30,0.8)';
    ctx.fillRect(0, H - 110, W, 110);
    ctx.fillStyle = DIM;
    ctx.fillRect(18, H - 110, W - 36, 1);
    ctx.font = `10px ${MONO}`;
    ctx.fillStyle = FAINT;
    ctx.fillText(chron.prompt ? `prompt${chron.template ? ` · ${chron.template}` : ''}` : 'prompt', 18, H - 92);
    ctx.font = `12px ${MONO}`;
    ctx.fillStyle = INK;
    const text = chron.prompt || 'the dreamer is asleep; its last prompt will appear here when the chronicle has one.';
    this.wrap(text, W - 36, 5).forEach((l, i) => ctx.fillText(l, 18, H - 72 + i * 15));
  }
}
