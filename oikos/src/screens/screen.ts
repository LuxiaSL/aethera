/**
 * screen.ts — what every tube has in common.
 *
 * A screen is a 2D canvas painted at its own frame rate. The room samples it
 * as a texture through the CRT shader; the site's pane shows the very same
 * canvas, scaled up, so the preview you open is the one you were looking at.
 *
 * Painters draw in a fixed 512×384 (4:3) space and never think about pixels
 * per inch: the tube is the resolution.
 */

import type { Directory, Feeds, Site } from '../data';

export const W = 512;
export const H = 384;

export const MONO = '"Libertinus Mono", "LibertinusMono", ui-monospace, monospace';
/** typed on paper: labels, name plates, titles (106 glyphs; the rest falls back to Libertinus) */
export const HAND = '"Love Letter Typewriter", "Libertinus Mono", monospace';

/**
 * Paint something that uses a web font, now and again once the font has
 * actually loaded: a canvas painted before then keeps the fallback forever.
 * `after` runs after the repaint (a texture's needsUpdate, say).
 */
export function paintWith(font: string | string[], paint: () => void, after?: () => void): void {
  paint();
  const fonts = typeof document !== 'undefined' ? document.fonts : undefined;
  const wanted = (Array.isArray(font) ? font : [font]).filter((f) => fonts && !fonts.check(f));
  if (!fonts || !wanted.length) return;
  Promise.all(wanted.map((f) => fonts.load(f))).then(
    () => {
      paint();
      after?.();
    },
    () => {
      /* no font: the fallback it already has is fine */
    },
  );
}
export const SANS = 'Tahoma, Verdana, "Segoe UI", system-ui, sans-serif';

export interface ScreenEnv {
  dir: Directory;
  feeds: Feeds;
}

export abstract class Screen {
  readonly canvas: HTMLCanvasElement;
  protected readonly ctx: CanvasRenderingContext2D;
  /** frames per second while merely visible; the focused screen runs faster */
  protected fps = 15;
  private acc = 1; // draw on the first tick
  /** set by the painter when it changed something worth uploading */
  version = 0;

  constructor(
    readonly site: Site,
    protected readonly env: ScreenEnv,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = W;
    this.canvas.height = H;
    const ctx = this.canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('oikos: no 2d context');
    this.ctx = ctx;
  }

  /**
   * Returns true when the canvas was redrawn (and the texture needs an upload).
   * `slow` scales the rate down for a screen at the edge of your attention
   * (another screen is focused): it still moves, just less often.
   */
  tick(t: number, dt: number, focused: boolean, slow = 1): boolean {
    this.acc += dt;
    const rate = focused ? Math.max(this.fps, 30) : this.fps * slow;
    if (this.acc < 1 / rate) return false;
    const step = this.acc;
    this.acc = 0;
    this.draw(t, step);
    this.version++;
    return true;
  }

  protected abstract draw(t: number, dt: number): void;

  // ---- helpers shared by painters ----

  protected clear(color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, W, H);
  }

  /** Word-wrap `text` into lines no wider than `width` in the current font. */
  protected wrap(text: string, width: number, maxLines = Infinity): string[] {
    const ctx = this.ctx;
    const words = text.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = '';
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > width && line) {
        lines.push(line);
        line = word;
        if (lines.length >= maxLines) break;
      } else {
        line = next;
      }
    }
    if (line && lines.length < maxLines) lines.push(line);
    if (lines.length === maxLines && lines.join(' ').length < words.join(' ').length) {
      // it was cut: end the last line on an ellipsis that still fits
      let last = lines[maxLines - 1] ?? '';
      while (last && ctx.measureText(`${last}…`).width > width) last = last.replace(/\s*\S*$/, '');
      lines[maxLines - 1] = `${last}…`;
    }
    return lines;
  }

  /** Condensed type without a condensed font: squeeze horizontally. */
  protected condensed(text: string, x: number, y: number, squeeze = 0.72, align: CanvasTextAlign = 'left'): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(squeeze, 1);
    ctx.textAlign = align;
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  /** Letter-spaced text (canvas letterSpacing is not everywhere yet). */
  protected spaced(text: string, x: number, y: number, spacing: number, align: 'left' | 'center' = 'left'): void {
    const ctx = this.ctx;
    const chars = [...text];
    const widths = chars.map((c) => ctx.measureText(c).width);
    const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
    let cx = align === 'center' ? x - total / 2 : x;
    ctx.save();
    ctx.textAlign = 'left';
    chars.forEach((c, i) => {
      ctx.fillText(c, cx, y);
      cx += (widths[i] ?? 0) + spacing;
    });
    ctx.restore();
  }
}

/** Deterministic string hash → [0, 1). */
export function hash01(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/** A small seeded PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v: number, a: number, b: number): number => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const smooth = (t: number): number => t * t * (3 - 2 * t);

export function fmtInt(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}
