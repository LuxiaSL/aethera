/**
 * apeiron — a hyperobject in phosphor, and the prompt it stands for.
 *
 * The prompts are real apeiron prompts: its own templates, filled from its own
 * component lists (the two JSON files it ships). Each one gets a coordinate
 * and a colour of its own, the way apeiron repaints itself per generation.
 * The figure is a 4D object turning through the fourth axis, rasterised to
 * characters with a depth buffer.
 */

import { H, MONO, Screen, W, hash01, rng, type ScreenEnv } from './screen';
import type { ApeironGrammar, Site } from '../data';

const COLS = 62;
const ROWS = 21;
const CW = W / COLS;
const CH = 12.4;
const TOP = 42;
const RAMP = ' .,:;-=+*#%@';

type V4 = [number, number, number, number];

function tesseract(): V4[] {
  const verts: V4[] = [];
  for (let i = 0; i < 16; i++) {
    verts.push([i & 1 ? 1 : -1, i & 2 ? 1 : -1, i & 4 ? 1 : -1, i & 8 ? 1 : -1]);
  }
  const pts: V4[] = [];
  for (let i = 0; i < 16; i++) {
    for (let b = 0; b < 4; b++) {
      const j = i ^ (1 << b);
      if (j < i) continue;
      const a = verts[i];
      const c = verts[j];
      if (!a || !c) continue;
      for (let s = 0; s <= 18; s++) {
        const k = s / 18;
        pts.push([a[0] + (c[0] - a[0]) * k, a[1] + (c[1] - a[1]) * k, a[2] + (c[2] - a[2]) * k, a[3] + (c[3] - a[3]) * k]);
      }
    }
  }
  return pts;
}

function clifford(): V4[] {
  const pts: V4[] = [];
  const n = 44;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const a = (i / n) * Math.PI * 2;
      const b = (j / n) * Math.PI * 2;
      pts.push([Math.cos(a) * 1.3, Math.sin(a) * 1.3, Math.cos(b) * 1.3, Math.sin(b) * 1.3]);
    }
  }
  return pts;
}

const FIGURES = [tesseract(), clifford()];

interface Generation {
  prompt: string;
  template: string;
  coordinate: string;
  hue: number;
  figure: V4[];
  bornAt: number;
}

export class ApeironScreen extends Screen {
  private gen: Generation | null = null;
  private seq = 0;
  private depth = new Float32Array(COLS * ROWS);
  private glyph = new Uint8Array(COLS * ROWS);

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 18;
  }

  private generate(t: number): Generation {
    const grammar = this.env.feeds.apeiron.value;
    const seed = Math.floor(Math.random() * 2 ** 31);
    const rand = rng(seed);
    const { prompt, template } = grammar ? compose(grammar, rand) : { prompt: '', template: 'waking' };
    const coordinate = (seed >>> 0).toString(16).padStart(8, '0').replace(/(....)(....)/, '$1·$2');
    return {
      prompt,
      template,
      coordinate,
      hue: grammar ? Math.floor(hash01(prompt) * 360) : 135,
      figure: FIGURES[this.seq++ % FIGURES.length] ?? FIGURES[0] ?? [],
      bornAt: t,
    };
  }

  protected draw(t: number): void {
    if (!this.gen || t - this.gen.bornAt > 9 || (!this.gen.prompt && this.env.feeds.apeiron.value)) {
      this.gen = this.generate(t);
    }
    const gen = this.gen;
    const ctx = this.ctx;
    const primary = `hsl(${gen.hue} 100% 58%)`;
    const bright = `hsl(${gen.hue} 100% 76%)`;
    const dim = `hsl(${gen.hue} 60% 22%)`;

    const bg = ctx.createRadialGradient(W / 2, H * 0.4, 20, W / 2, H * 0.4, W * 0.7);
    bg.addColorStop(0, `hsl(${gen.hue} 60% 7%)`);
    bg.addColorStop(1, '#030309');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // hud
    ctx.font = `12px ${MONO}`;
    ctx.fillStyle = primary;
    ctx.fillText('apeiron', 14, 22);
    ctx.fillStyle = dim;
    ctx.fillText('·  æthera', 76, 22);
    ctx.textAlign = 'right';
    ctx.fillStyle = primary;
    ctx.fillText(gen.template.replace(/_/g, ' '), W - 14, 22);
    ctx.textAlign = 'left';

    this.raster(t, gen.figure);
    ctx.font = `12px ${MONO}`;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const g = this.glyph[r * COLS + c] ?? 0;
        if (!g) continue;
        ctx.fillStyle = g > 9 ? bright : g > 4 ? primary : dim;
        ctx.fillText(RAMP[g] ?? '.', c * CW, TOP + r * CH + 10);
      }
    }

    // the inscription, typed
    const age = t - gen.bornAt;
    const text = gen.prompt || 'reading the grammar…';
    ctx.font = `12px ${MONO}`;
    const lines = this.wrap(text.slice(0, Math.floor(age * 70)), W - 28, 4);
    ctx.fillStyle = 'rgba(3,3,9,0.7)';
    ctx.fillRect(0, H - 98, W, 98);
    ctx.fillStyle = dim;
    ctx.fillRect(14, H - 98, W - 28, 1);
    ctx.fillStyle = bright;
    lines.forEach((l, i) => ctx.fillText(l, 14, H - 78 + i * 15));
    ctx.fillStyle = primary;
    ctx.font = `11px ${MONO}`;
    ctx.fillText(`⌖ ${gen.coordinate}`, 14, H - 12);
    ctx.fillStyle = dim;
    ctx.textAlign = 'right';
    ctx.fillText('␣ generate   F keep   A auto', W - 14, H - 12);
    ctx.textAlign = 'left';
  }

  /** Rotate through the fourth axis, project twice, keep the nearest per cell. */
  private raster(t: number, pts: V4[]): void {
    this.depth.fill(-Infinity);
    this.glyph.fill(0);
    const a = t * 0.45;
    const b = t * 0.31;
    const c = t * 0.23;
    const [ca, sa, cb, sb, cc, sc] = [Math.cos(a), Math.sin(a), Math.cos(b), Math.sin(b), Math.cos(c), Math.sin(c)];
    for (const p of pts) {
      let [x, y, z, w] = p;
      // xw
      [x, w] = [x * ca - w * sa, x * sa + w * ca];
      // yz
      [y, z] = [y * cb - z * sb, y * sb + z * cb];
      // zw
      [z, w] = [z * cc - w * sc, z * sc + w * cc];
      const k4 = 2.6 / (3.2 - w);
      x *= k4;
      y *= k4;
      z *= k4;
      // a slow tilt so it never faces us square
      const k3 = 3.4 / (4.6 - z);
      const sx = Math.round(COLS / 2 + x * k3 * 11.5);
      const sy = Math.round(ROWS / 2 + y * k3 * 5.6);
      if (sx < 0 || sx >= COLS || sy < 0 || sy >= ROWS) continue;
      const i = sy * COLS + sx;
      if (z > (this.depth[i] ?? -Infinity)) {
        this.depth[i] = z;
        this.glyph[i] = Math.max(1, Math.min(RAMP.length - 1, Math.round(((z + 2.2) / 4.4) * (RAMP.length - 1))));
      }
    }
  }
}

function compose(grammar: ApeironGrammar, rand: () => number): { prompt: string; template: string } {
  const tpl = grammar.templates[Math.floor(rand() * grammar.templates.length)];
  if (!tpl) return { prompt: '', template: '' };
  const prompt = tpl.structure.replace(/\{(\w+)\}/g, (_, key: string) => {
    const pool = grammar.components[key];
    if (!pool?.length) return key.replace(/_/g, ' ');
    return pool[Math.floor(rand() * pool.length)]?.word ?? key;
  });
  return { prompt, template: tpl.id };
}
