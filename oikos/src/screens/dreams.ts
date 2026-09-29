/**
 * dreams — the stage, and whatever the dream last remembered on it.
 *
 * The frame in the curtains is real: the chronicle's latest keyframe
 * thumbnail, which costs nothing to fetch. The live stream is one click away
 * and deliberately not here — a viewer socket is what wakes the dreamer (see
 * data.ts). When the chronicle has nothing to show, the stage plays a slow
 * procedural stand-in, and says so.
 */

import { H, MONO, Screen, W, fmtInt, type ScreenEnv } from './screen';
import type { Site } from '../data';

const stage = new Image();
stage.src = '/static/oikos/stage.jpg';

// the curtain opening, in screen px (the frame is 2:1, like the stream)
const FW = 372;
const FH = 186;
const FX = (W - FW) / 2;
const FY = 118;

export class DreamsScreen extends Screen {
  private frame = document.createElement('canvas');
  private fctx: CanvasRenderingContext2D;
  private prev: HTMLImageElement | null = null;
  private cur: HTMLImageElement | null = null;
  private swapAt = 0;

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 20;
    this.frame.width = FW;
    this.frame.height = FH;
    const fctx = this.frame.getContext('2d');
    if (!fctx) throw new Error('oikos: no 2d context');
    this.fctx = fctx;
  }

  protected draw(t: number): void {
    const ctx = this.ctx;
    this.clear('#120406');
    if (stage.complete && stage.naturalWidth) {
      ctx.globalAlpha = 0.95;
      ctx.drawImage(stage, 0, 0, W, H);
      ctx.globalAlpha = 1;
    }

    const chron = this.env.feeds.chronicle.value;
    if (chron.thumb && chron.thumb !== this.cur) {
      this.prev = this.cur;
      this.cur = chron.thumb;
      this.swapAt = t;
    }

    // paint the dream into its own canvas, then melt its edges into the stage
    const f = this.fctx;
    f.globalCompositeOperation = 'source-over';
    f.globalAlpha = 1;
    if (this.cur) {
      const mix = Math.min(1, (t - this.swapAt) / 2.5);
      if (this.prev && mix < 1) this.kenBurns(this.prev, t - 20);
      f.globalAlpha = this.prev ? mix : 1;
      this.kenBurns(this.cur, t);
      f.globalAlpha = 1;
    } else {
      this.standIn(t);
    }
    const g = f.createRadialGradient(FW / 2, FH / 2, FH * 0.25, FW / 2, FH / 2, FW * 0.56);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(0.72, 'rgba(0,0,0,0.9)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    f.globalCompositeOperation = 'destination-in';
    f.fillStyle = g;
    f.fillRect(0, 0, FW, FH);
    f.globalCompositeOperation = 'source-over';

    // the dream's light spills onto the boards
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.18;
    ctx.drawImage(this.frame, FX - 30, FY + FH - 20, FW + 60, 90);
    ctx.restore();
    ctx.drawImage(this.frame, FX, FY);

    this.status(t);

    // the marquee
    ctx.fillStyle = 'rgba(8,4,4,0.72)';
    ctx.fillRect(0, H - 34, W, 34);
    ctx.fillStyle = '#efe6d2';
    ctx.font = `12px ${MONO}`;
    this.spaced('NOW SHOWING · A DREAM · ALL NIGHT', W / 2, H - 13, 3, 'center');
  }

  private kenBurns(img: HTMLImageElement, t: number): void {
    const s = 1.06 + 0.05 * Math.sin(t * 0.07);
    const dx = Math.sin(t * 0.05) * 10;
    const dy = Math.cos(t * 0.043) * 5;
    const w = FW * s;
    const h = FH * s;
    this.fctx.drawImage(img, (FW - w) / 2 + dx, (FH - h) / 2 + dy, w, h);
  }

  /** No frame yet: slow soft bodies drifting through each other. */
  private standIn(t: number): void {
    const f = this.fctx;
    const bg = f.createLinearGradient(0, 0, 0, FH);
    bg.addColorStop(0, '#3a2440');
    bg.addColorStop(1, '#170d1c');
    f.fillStyle = bg;
    f.fillRect(0, 0, FW, FH);
    const hues = [12, 330, 280, 20, 350];
    for (let i = 0; i < 5; i++) {
      const a = t * (0.11 + i * 0.03) + i * 1.7;
      const x = FW / 2 + Math.cos(a) * (60 + i * 14) * (i % 2 ? 1 : -1);
      const y = FH / 2 + Math.sin(a * 1.3) * 30;
      const r = 52 + 22 * Math.sin(a * 0.7 + i);
      const g = f.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `hsla(${hues[i]} 90% 66% / 0.75)`);
      g.addColorStop(1, `hsla(${hues[i]} 90% 50% / 0)`);
      f.fillStyle = g;
      f.fillRect(0, 0, FW, FH);
    }
  }

  private status(t: number): void {
    const ctx = this.ctx;
    const d = this.env.feeds.dreams.value;
    const chron = this.env.feeds.chronicle.value;
    ctx.font = `12px ${MONO}`;
    let label: string;
    let dot: string;
    if (d.known && d.awake) {
      dot = Math.sin(t * 4) > 0 ? '#ff3b3b' : '#6a1010';
      label = `LIVE  frame ${fmtInt(d.frame)}${d.viewers ? `  ·  ${d.viewers} watching` : ''}`;
    } else if (d.known) {
      dot = '#5a5a5a';
      label = chron.thumb ? 'asleep  ·  last remembered' : 'asleep  ·  wakes when watched';
    } else {
      dot = '#3a3a3a';
      label = chron.thumb ? 'last remembered' : 'no signal  ·  a stand-in';
    }
    const w = ctx.measureText(label).width + 34;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(14, 14, w, 24);
    ctx.fillStyle = dot;
    ctx.beginPath();
    ctx.arc(27, 26, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f2e9dc';
    ctx.fillText(label, 38, 30);
  }
}
