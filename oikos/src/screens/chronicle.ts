/**
 * chronicle — the core sample.
 *
 * Real strata when the chronicle has them: the hourly tiles, one row per
 * fifteen seconds of dream, flipped so the newest lies on top and each older
 * hour pressed thinner than the one above it. Beside the core, the era titles
 * the chronicle wrote.
 */

import { H, MONO, Screen, W, rng, type ScreenEnv } from './screen';
import type { Site } from '../data';

const INK = '#e8e2d4';
const INK_SOFT = '#a39d90';
const INK_FAINT = '#5d5850';
const CORE_X = 34;
const CORE_W = 250;
const CORE_Y = 84;
const CORE_H = H - CORE_Y - 22;

export class ChronicleScreen extends Screen {
  private standIn: HTMLCanvasElement;

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 10;
    this.standIn = makeStandIn();
  }

  protected draw(t: number): void {
    const ctx = this.ctx;
    this.clear('#070707');

    ctx.fillStyle = INK;
    ctx.font = `22px ${MONO}`;
    this.spaced('chronicle', W / 2, 38, 11, 'center');
    ctx.fillStyle = INK_SOFT;
    ctx.font = `11px ${MONO}`;
    this.spaced('what the dream remembers', W / 2, 60, 2, 'center');

    const chron = this.env.feeds.chronicle.value;
    const tiles = [...chron.strata].reverse(); // newest first
    ctx.fillStyle = '#000';
    ctx.fillRect(CORE_X - 1, CORE_Y - 1, CORE_W + 2, CORE_H + 2);
    ctx.imageSmoothingEnabled = true;
    if (tiles.length) {
      // each older hour is pressed thinner: 1, 0.6, 0.35 …
      const weights = tiles.map((_, i) => Math.pow(0.6, i));
      const sum = weights.reduce((a, b) => a + b, 0);
      let y = CORE_Y;
      tiles.forEach((img, i) => {
        const h = (CORE_H * (weights[i] ?? 0)) / sum;
        ctx.save();
        ctx.translate(CORE_X, y + h);
        ctx.scale(1, -1);
        ctx.drawImage(img, 0, 0, CORE_W, h);
        ctx.restore();
        y += h;
        ctx.fillStyle = 'rgba(232,226,212,0.08)';
        ctx.fillRect(CORE_X, y, CORE_W, 1);
      });
    } else {
      ctx.globalAlpha = 0.75;
      ctx.drawImage(this.standIn, CORE_X, CORE_Y, CORE_W, CORE_H);
      ctx.globalAlpha = 1;
    }

    // the reading head, drifting down the core
    const ry = CORE_Y + ((t * 14) % CORE_H);
    const g = ctx.createLinearGradient(0, ry - 16, 0, ry + 2);
    g.addColorStop(0, 'rgba(232,226,212,0)');
    g.addColorStop(1, 'rgba(232,226,212,0.22)');
    ctx.fillStyle = g;
    ctx.fillRect(CORE_X, ry - 16, CORE_W, 18);
    ctx.fillStyle = 'rgba(232,226,212,0.5)';
    ctx.fillRect(CORE_X - 6, ry, 4, 1);

    this.log(t);
  }

  private log(t: number): void {
    const ctx = this.ctx;
    const chron = this.env.feeds.chronicle.value;
    const x = CORE_X + CORE_W + 24;
    const width = W - x - 18;
    ctx.font = `11px ${MONO}`;
    ctx.fillStyle = INK_FAINT;
    ctx.fillText(chron.known ? `${chron.eraCount || chron.eras.length} eras` : 'reading the core…', x, CORE_Y + 8);

    const eras = [...chron.eras].reverse().slice(0, 7);
    let y = CORE_Y + 34;
    if (!eras.length) {
      ctx.fillStyle = INK_SOFT;
      for (const l of this.wrap('every fifteen seconds of the dream settles here as one line of its own colour.', width, 6)) {
        ctx.fillText(l, x, y);
        y += 15;
      }
      return;
    }
    for (const era of eras) {
      if (y > H - 30) break;
      const when = new Date(era.t0 * 1000);
      ctx.fillStyle = era.open ? INK : INK_FAINT;
      ctx.font = `10px ${MONO}`;
      const stamp = `${when.getHours().toString().padStart(2, '0')}:${when.getMinutes().toString().padStart(2, '0')}`;
      ctx.fillText(era.open ? `${stamp}  now` : stamp, x, y);
      if (era.open) {
        ctx.fillStyle = Math.sin(t * 3) > 0 ? '#d6c9a8' : '#6d6555';
        ctx.fillRect(x - 10, y - 6, 4, 4);
      }
      ctx.font = `12px ${MONO}`;
      ctx.fillStyle = era.open ? INK : INK_SOFT;
      const lines = this.wrap(era.title || 'untitled', width, 2);
      lines.forEach((l, i) => ctx.fillText(l, x, y + 15 + i * 14));
      y += 22 + lines.length * 14;
    }
  }
}

/** Sediment in the dream's usual colours, for when the core can't be read. */
function makeStandIn(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 240;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const rand = rng(1729);
  const pal = ['#5c3b36', '#7a4f45', '#3f3a4c', '#8a6f64', '#2d4a4f', '#6b2c3a', '#a38a74', '#40302c'];
  let color = pal[0] ?? '#444';
  for (let y = 0; y < c.height; y++) {
    if (rand() < 0.12) color = pal[Math.floor(rand() * pal.length)] ?? color;
    ctx.fillStyle = color;
    ctx.fillRect(0, y, c.width, 1);
    for (let k = 0; k < 6; k++) {
      ctx.fillStyle = `rgba(255,255,255,${rand() * 0.08})`;
      ctx.fillRect(rand() * c.width, y, rand() * 12, 1);
    }
  }
  return c;
}
