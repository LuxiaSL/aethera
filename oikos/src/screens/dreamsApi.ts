/**
 * dreams api — a terminal that keeps asking the dream how it is.
 *
 * The JSON is the real answer from /api/dreams/status (the one endpoint that
 * never wakes the GPU), re-typed every time the room polls it.
 */

import { H, MONO, Screen, W, type ScreenEnv } from './screen';
import type { Site } from '../data';

const BG = '#04060c';
const FG = '#9fc6ff';
const DIM = '#3d5378';
const KEY = '#c9d1d9';
const STR = '#a5e3b5';
const NUM = '#ffc387';

const ENDPOINTS: [string, string, string][] = [
  ['GET', '/api/dreams/status', 'how it is (never wakes it)'],
  ['WS ', '/ws/dreams', 'the dream itself, h264'],
  ['GET', '/api/dreams/stream', 'MPEG-TS'],
  ['SSE', '/api/dreams/sse', 'events'],
  ['GET', '/api/dreams/embed', 'take it with you'],
];

export class DreamsApiScreen extends Screen {
  private askedAt = -10;
  private lastRaw: unknown = undefined;

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 12;
  }

  protected draw(t: number): void {
    const ctx = this.ctx;
    this.clear(BG);
    const raw = this.env.feeds.dreams.value.raw;
    if (raw !== this.lastRaw) {
      this.lastRaw = raw;
      this.askedAt = t;
    }
    const since = t - this.askedAt;

    ctx.font = `13px ${MONO}`;
    const cmd = `curl -s ${location.host}/api/dreams/status`;
    const typed = cmd.slice(0, Math.floor(since * 38));
    ctx.fillStyle = DIM;
    ctx.fillText('$', 16, 28);
    ctx.fillStyle = FG;
    ctx.fillText(typed + (typed.length < cmd.length || Math.floor(t * 2) % 2 ? '▌' : ''), 32, 28);

    if (typed.length >= cmd.length) {
      const lines = raw ? jsonLines(raw, 11) : [[{ text: 'curl: (52) the dream did not answer', color: '#e58a8a' }]];
      const shown = Math.floor((since - cmd.length / 38) * 30);
      lines.slice(0, shown).forEach((segs, i) => {
        let x = 16;
        for (const s of segs) {
          ctx.fillStyle = s.color;
          ctx.fillText(s.text, x, 52 + i * 17);
          x += ctx.measureText(s.text).width;
        }
      });
    }

    // the map of ways in
    const top = H - 128;
    ctx.fillStyle = 'rgba(159,198,255,0.06)';
    ctx.fillRect(10, top - 20, W - 20, 138);
    ctx.strokeStyle = 'rgba(159,198,255,0.25)';
    ctx.strokeRect(10.5, top - 19.5, W - 21, 137);
    ctx.font = `11px ${MONO}`;
    ctx.fillStyle = DIM;
    ctx.fillText('ENDPOINTS', 20, top - 4);
    ENDPOINTS.forEach(([m, path, note], i) => {
      const y = top + 16 + i * 19;
      const lit = Math.floor(t / 2.5) % ENDPOINTS.length === i;
      ctx.fillStyle = lit ? NUM : DIM;
      ctx.fillText(m, 20, y);
      ctx.fillStyle = lit ? '#ffffff' : FG;
      ctx.fillText(path, 58, y);
      ctx.fillStyle = DIM;
      ctx.fillText(note, 250, y);
    });
  }
}

type Seg = { text: string; color: string };

/** Pretty-print JSON as coloured segments, a line at a time. */
function jsonLines(value: unknown, maxLines: number): Seg[][] {
  const out: Seg[][] = [];
  const walk = (v: unknown, indent: string, key: string | null, last: boolean) => {
    if (out.length >= maxLines) return;
    const head: Seg[] = [{ text: indent, color: KEY }];
    if (key !== null) head.push({ text: `"${key}": `, color: KEY });
    const comma = last ? '' : ',';
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const entries = Object.entries(v as Record<string, unknown>);
      out.push([...head, { text: '{', color: KEY }]);
      entries.forEach(([k, val], i) => walk(val, `${indent}  `, k, i === entries.length - 1));
      if (out.length < maxLines) out.push([{ text: `${indent}}${comma}`, color: KEY }]);
      return;
    }
    let text: string;
    let color: string;
    if (typeof v === 'string') {
      text = `"${v}"`;
      color = STR;
    } else if (Array.isArray(v)) {
      text = JSON.stringify(v);
      color = NUM;
    } else {
      text = String(v);
      color = NUM;
    }
    out.push([...head, { text, color }, { text: comma, color: KEY }]);
  };
  walk(value, '', null, true);
  if (out.length >= maxLines) out[maxLines - 1] = [{ text: '  …', color: DIM }];
  return out;
}
