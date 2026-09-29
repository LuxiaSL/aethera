/**
 * heimdall — the MAGI deck, as a replica.
 *
 * Heimdall lives on a private network with no public view, so this screen is
 * a replica of its command tab in its own colours: the ring of sixteen
 * monoliths (one per GPU, glowing with load), the pillar of cluster sync, and
 * the readout strip. The numbers are invented and the screen says so. Nothing
 * here talks to the cluster.
 */

import { H, Screen, W, clamp, rng, type ScreenEnv } from './screen';
import type { Site } from '../data';

const BG = '#060404';
const ORANGE = '#ff8a1f';
const RED = '#ff2a2f';
const INK = '#f2eadf';
const DIM = '#9b8b7d';
const GHOST = '#54463d';
const SERIF = 'Georgia, "Noto Serif Display", "Times New Roman", serif';
const COND = '"Barlow Condensed", "Arial Narrow", "Helvetica Neue", Arial, sans-serif';

export class HeimdallScreen extends Screen {
  private util = new Float32Array(16);
  private target = new Float32Array(16);
  private state: ('free' | 'active' | 'stalled')[] = Array.from({ length: 16 }, () => 'free');
  private rand = rng(16);
  private nextShuffle = 0;
  private redUntil = -1;
  private nextRed = 34;

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 15;
  }

  private simulate(t: number, dt: number): void {
    if (t > this.nextShuffle) {
      this.nextShuffle = t + 4 + this.rand() * 6;
      // jobs come and go in blocks of GPUs, as they do
      const start = Math.floor(this.rand() * 16);
      const size = [1, 2, 4, 8][Math.floor(this.rand() * 4)] ?? 1;
      const on = this.rand() < 0.62;
      for (let k = 0; k < size; k++) {
        const i = (start + k) % 16;
        this.state[i] = on ? (this.rand() < 0.05 ? 'stalled' : 'active') : 'free';
        this.target[i] = on ? 0.55 + this.rand() * 0.45 : 0;
      }
    }
    for (let i = 0; i < 16; i++) {
      const jitter = this.state[i] === 'active' ? (this.rand() - 0.5) * 0.08 : 0;
      this.util[i] = clamp((this.util[i] ?? 0) + ((this.target[i] ?? 0) - (this.util[i] ?? 0)) * dt * 1.5 + jitter, 0, 1);
    }
    if (t > this.nextRed) {
      this.redUntil = t + 2.4;
      this.nextRed = t + 45 + this.rand() * 40;
    }
  }

  protected draw(t: number, dt: number): void {
    this.simulate(t, Math.min(dt, 0.2));
    const ctx = this.ctx;
    this.clear(BG);

    const engaged = this.state.filter((s) => s !== 'free').length;
    const sync = this.util.reduce((a, b) => a + b, 0) / 16;

    // scanlines
    ctx.fillStyle = 'rgba(255,255,255,0.015)';
    for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);

    // header bar
    ctx.fillStyle = ORANGE;
    ctx.fillRect(0, 0, W, 24);
    ctx.fillStyle = '#120806';
    ctx.font = `bold 15px ${COND}`;
    this.condensed('HEIMDALL  ·  CENTRAL DOGMA  ·  16 UNITS', 12, 17, 0.8);
    const secs = Math.floor(t);
    const clock = `T+ ${String(Math.floor(secs / 3600)).padStart(2, '0')}:${String(Math.floor(secs / 60) % 60).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
    this.condensed(clock, W - 12, 17, 0.8, 'right');

    ctx.font = `12px ${COND}`;
    ctx.fillStyle = GHOST;
    this.condensed('REPLICA · NO UPLINK · ヘイムダル 番人', 12, 42, 0.85);

    // the ring
    const cx = W / 2;
    const cy = 150;
    const rx = 178;
    const ry = 46;
    const slabs = Array.from({ length: 16 }, (_, i) => {
      const a = (i / 16) * Math.PI * 2 + t * 0.12;
      return { i, a, x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry, depth: Math.sin(a) };
    }).sort((p, q) => p.depth - q.depth);

    const pillar = (front: boolean) => {
      if (front) return;
      const g = ctx.createLinearGradient(cx - 20, 0, cx + 20, 0);
      const a = 0.25 + sync * 0.6;
      g.addColorStop(0, 'rgba(255,42,47,0)');
      g.addColorStop(0.5, `rgba(255,${Math.round(90 + sync * 80)},${Math.round(60 + sync * 40)},${a})`);
      g.addColorStop(1, 'rgba(255,42,47,0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx - 20, 48, 40, cy + 20 - 48);
    };
    pillar(false);
    for (const s of slabs) {
      const scale = 0.75 + (s.depth + 1) * 0.2;
      const w = 16 * scale;
      const h = 64 * scale;
      const u = this.util[s.i] ?? 0;
      const st = this.state[s.i];
      const glow = st === 'stalled' ? '#ffb627' : RED;
      ctx.fillStyle = '#140707';
      ctx.fillRect(s.x - w / 2, s.y - h, w, h);
      ctx.save();
      ctx.shadowColor = glow;
      ctx.shadowBlur = 16 * u;
      ctx.globalAlpha = 0.18 + u * 0.82;
      ctx.fillStyle = st === 'free' ? '#4a0d10' : glow;
      ctx.fillRect(s.x - w / 2 + 2, s.y - h + 2, w - 4, h - 4);
      ctx.restore();
      ctx.fillStyle = ORANGE;
      ctx.globalAlpha = 0.5 + (s.depth + 1) * 0.25;
      ctx.font = `${Math.round(8 * scale)}px ${COND}`;
      ctx.textAlign = 'center';
      ctx.fillText(String(s.i).padStart(2, '0'), s.x, s.y + 10 * scale);
      ctx.textAlign = 'left';
      ctx.globalAlpha = 1;
    }

    // readout strip
    const cells: [string, string][] = [
      ['UNITS ENGAGED', `${engaged}/16`],
      ['CLUSTER SYNC', `${Math.round(sync * 100)}%`],
      ['RUNNING', String(Math.max(0, Math.round(engaged / 2.3)))],
      ['QUEUED', String(Math.max(0, 5 - Math.round(engaged / 4)))],
      ['NODES', '2/2'],
    ];
    const cw = (W - 24) / cells.length;
    cells.forEach(([label, value], i) => {
      const x = 12 + i * cw;
      const y = 236;
      ctx.strokeStyle = '#2a1c16';
      ctx.strokeRect(x + 0.5, y + 0.5, cw - 4, 62);
      ctx.fillStyle = ORANGE;
      ctx.fillRect(x, y, 6, 1);
      ctx.fillRect(x, y, 1, 6);
      ctx.font = `bold 11px ${COND}`;
      this.condensed(label, x + 8, y + 16, 0.85);
      ctx.fillStyle = INK;
      ctx.font = `bold 30px ${SERIF}`;
      this.condensed(value, x + 8, y + 50, 0.62);
    });

    // one phase bar per node
    ['BAYES-1', 'SOLOMONOFF-2'].forEach((name, n) => {
      const y = 316 + n * 18;
      ctx.fillStyle = DIM;
      ctx.font = `bold 11px ${COND}`;
      this.condensed(`MAGI ${name}`, 12, y + 9, 0.85);
      for (let g = 0; g < 8; g++) {
        const i = n * 8 + g;
        const u = this.util[i] ?? 0;
        const x = 132 + g * 46;
        ctx.fillStyle = '#0d0908';
        ctx.fillRect(x, y, 42, 11);
        ctx.fillStyle = this.state[i] === 'stalled' ? '#ffb627' : '#4dffa6';
        ctx.globalAlpha = this.state[i] === 'free' ? 0.15 : 0.9;
        ctx.fillRect(x, y, 42 * u, 11);
        ctx.globalAlpha = 1;
        ctx.fillStyle = BG;
        for (let k = 6; k < 42; k += 6) ctx.fillRect(x + k, y, 1, 11);
      }
    });

    if (t < this.redUntil) this.patternRed(t);
    else {
      // the hazard stripe, idling
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, H - 10, W, 10);
      ctx.clip();
      for (let x = -20 + ((t * 12) % 20); x < W; x += 20) {
        ctx.fillStyle = '#2a0406';
        ctx.beginPath();
        ctx.moveTo(x, H);
        ctx.lineTo(x + 10, H - 10);
        ctx.lineTo(x + 20, H - 10);
        ctx.lineTo(x + 10, H);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  private patternRed(t: number): void {
    const ctx = this.ctx;
    if (Math.floor(t * 4) % 2) return;
    ctx.fillStyle = 'rgba(138,11,18,0.88)';
    ctx.fillRect(0, 120, W, 72);
    ctx.fillStyle = INK;
    ctx.font = `bold 40px ${SERIF}`;
    this.condensed('PATTERN RED', W / 2, 166, 0.66, 'center');
    ctx.font = `bold 12px ${COND}`;
    ctx.fillStyle = ORANGE;
    this.condensed('A JOB HAS DIED · A HUMAN IS NEEDED', W / 2, 184, 0.85, 'center');
  }
}
