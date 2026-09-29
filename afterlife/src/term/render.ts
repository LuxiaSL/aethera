/**
 * render.ts — a terminal, drawn.
 *
 * afterlife is a curses program: a grid of character cells, each one an
 * upper-half block (▀) whose foreground paints the top pixel and background
 * the bottom, so every cell holds two pixels of the universe. This draws
 * exactly that, in the same xterm colours, and keeps the terminal's grid for
 * the status line: every character sits in its own column.
 *
 * The cells are drawn as pixels (an ImageData one texel per half-cell, scaled
 * up without smoothing) rather than as ▀ glyphs, which is what a glyph would
 * look like on a perfect font and is the same on every machine.
 *
 * `render()` is life.py's render() and _draw_stats_overlay(), case for case.
 */

import { GHOST_COLORS, GHOST_FRAMES, GRADIENT, HAUNT_DUAL, HAUNT_FRAMES, HAUNT_SINGLE, SPARKS, ZOOM_LABELS } from '../engine/constants';
import type { InfiniteLife } from '../engine/life';
import { NewsTicker, cols } from '../engine/ticker';
import { css, packed, xterm } from './palette';

/** The terminal's default background and foreground (curses' -1). */
export const BG: [number, number, number] = [10, 10, 12];
const FG = 'rgb(200,200,200)';
const FG_DIM = 'rgb(112,112,116)';

const NG = GRADIENT.length;
const GRAD_PX = GRADIENT.map((c) => packed(xterm(c)));
const GHOST_PX = GHOST_COLORS.map((c) => packed(xterm(c)));
const HAUNT_SINGLE_PX = HAUNT_SINGLE.map(([f, b]) => [packed(xterm(f)), packed(xterm(b))] as const);
const HAUNT_DUAL_PX = HAUNT_DUAL.map(([f, b]) => [packed(xterm(f)), packed(xterm(b))] as const);
const BG_PX = packed(BG);

/** Terminal fonts first: the status line was written for one. */
export const TERM_FONT = 'ui-monospace, "SF Mono", "Cascadia Mono", "DejaVu Sans Mono", Menlo, Consolas, monospace';

/** What the status line holds this frame (life.py builds it inside render()). */
export interface Status {
  left: string;
  right: string;
  tickerCol: number;
  tickerWidth: number;
}

let lut: { maxAge: number; table: Uint8Array } | null = null;

/** age → gradient index: log-scaled so the young get most of the colours */
function colorLut(maxAge: number): Uint8Array {
  if (lut && lut.maxAge === maxAge) return lut.table;
  const table = new Uint8Array(maxAge + 1);
  const logMax = Math.log1p(maxAge);
  for (let a = 1; a <= maxAge; a++) table[a] = Math.min(Math.trunc((Math.log1p(a) / logMax) * (NG - 1)), NG - 1);
  lut = { maxAge, table };
  return table;
}

function fmt(n: number): string {
  return n.toLocaleString('en-US');
}

export class Terminal {
  /** device pixels per column; a row is two of these (square half-blocks) */
  cw = 8;
  cols = 80;
  rows = 24;
  /**
   * Status rows at the bottom. One, as in the terminal, when it is wide
   * enough for the ticker to have room between the stats and the keys;
   * otherwise two (stats above, the ticker on a line of its own) rather than
   * lose the ticker to the narrow-terminal fallback on every phone.
   */
  statusRows = 1;
  /** show the key legend at the right of the status line */
  keys = true;

  private img: ImageData | null = null;
  private widths = new Map<string, number>();
  private px: Uint32Array | null = null;
  private off: HTMLCanvasElement | OffscreenCanvas | null = null;

  constructor(private readonly ctx: CanvasRenderingContext2D) {}

  /** Rows the universe gets (life.py's max_y - 1). */
  get gridRows(): number {
    return Math.max(1, this.rows - this.statusRows);
  }

  /** Size the terminal: a canvas of w × h device pixels, cells `cw` wide. */
  resize(w: number, h: number, cw: number): void {
    this.cw = Math.max(2, Math.round(cw));
    this.cols = Math.max(20, Math.floor(w / this.cw));
    this.rows = Math.max(6, Math.floor(h / (this.cw * 2)));
    this.statusRows = this.cols >= 150 ? 1 : 2;
    this.keys = this.cols >= 150;
    this.img = null;
    this.widths.clear();
  }

  /** The status line, as render() lays it out (and so the ticker's width). */
  status(life: InfiniteLife, musicStatus: string): Status {
    // a phone's status line can't spare 24 columns of history
    const spark = life.sparkline(this.cols < 100 ? 10 : 24);
    const cam = life.autoCam ? 'auto' : 'pan';
    const zoom = ZOOM_LABELS[life.zoomLevel] ?? `${2 ** life.zoomLevel}x`;
    const focus = life.autoFocusMode ? '[F]' : '';
    const haunt = life.haunted ? '[HAUNTED]' : '';
    const music = musicStatus ? ` ${musicStatus}` : '';
    const left = `  ${life.epoch()}  gen ${fmt(life.generation)}  pop ${fmt(life.population())}  ${spark}`;
    const legend = this.keys ? '  q r spc +/- arrows h z/x f g s  ' : '  ';
    const right = `${music} ${haunt}${focus} ${zoom} ${cam}${legend}`;
    if (this.statusRows === 1) {
      // Ticker occupies the region between left stats and right controls
      return { left, right, tickerCol: cols(left) + 1, tickerWidth: this.cols - cols(left) - cols(right) - 2 };
    }
    return { left, right, tickerCol: 1, tickerWidth: this.cols - 2 };
  }

  /** Paint one frame. */
  render(life: InfiniteLife, st: Status, showStats: boolean): void {
    const ctx = this.ctx;
    const cw = this.cw;
    const W = this.cols * cw;
    const H = this.rows * cw * 2;
    ctx.fillStyle = css(BG);
    ctx.fillRect(0, 0, W, H);

    this.paintGrid(life);

    ctx.font = `${Math.round(cw * 1.62)}px ${TERM_FONT}`;
    ctx.textBaseline = 'middle';
    if (showStats) this.statsOverlay(life);

    // ── Status bar (with scrolling news ticker) ──
    const last = this.rows - 1;
    if (this.statusRows === 1) {
      if (st.tickerWidth < 10) {
        // Terminal too narrow for ticker — compact fallback
        this.text(`${st.left}  ${st.right}`.slice(0, this.cols - 1), last, 0, FG_DIM);
      } else {
        this.text(st.left, last, 0, FG_DIM);
        this.ticker(life, last, st);
        const rightCol = this.cols - cols(st.right);
        this.text([...st.right].slice(0, this.cols - 1 - rightCol).join(''), last, rightCol, FG_DIM);
      }
    } else {
      // two-line status: the stats and the switches, then the ticker below
      const room = this.cols - 1;
      const line = cols(st.left) + cols(st.right) <= room
        ? st.left + ' '.repeat(room - cols(st.left) - cols(st.right)) + st.right
        : `${st.left}  ${st.right}`;
      this.text([...line].slice(0, room).join(''), last - 1, 0, FG_DIM);
      this.ticker(life, last, st);
    }
  }

  private paintGrid(life: InfiniteLife): void {
    const grid = life.displayGrid();
    const ages = life.displayAge();
    const drawRows = Math.min(Math.floor(grid.h / 2), Math.floor(ages.h / 2), this.gridRows);
    const drawCols = Math.min(grid.w, ages.w, this.cols);
    const w = this.cols;
    const h = this.gridRows * 2;
    if (!this.img || this.img.width !== w || this.img.height !== h) {
      this.img = new ImageData(w, h);
      this.px = new Uint32Array(this.img.data.buffer);
      this.off = typeof OffscreenCanvas !== 'undefined' ? new OffscreenCanvas(w, h) : Object.assign(document.createElement('canvas'), { width: w, height: h });
    }
    const px = this.px as Uint32Array;
    px.fill(BG_PX);

    // ages.max() works because alive ages > 0, ghost ages < 0, dead = 0
    let maxAge = 1;
    for (let i = 0; i < ages.data.length; i++) if ((ages.data[i] ?? 0) > maxAge) maxAge = ages.data[i] ?? 0;
    const table = colorLut(maxAge);

    // Disable ghost rendering when zoomed out — too much visual noise.
    // Haunted mode inverts that judgment: the noise is the exhibit.
    const haunted = life.haunted;
    const showGhosts = life.zoomLevel >= 0 || haunted;
    const gf = haunted ? HAUNT_FRAMES : GHOST_FRAMES;
    const gidx = (a: number): number => Math.min(Math.max(-a - 1, 0), gf - 1);
    const cidx = (a: number): number => table[Math.min(Math.max(a, 0), maxAge)] ?? 0;
    const ghostTop = (i: number): number => (haunted ? (HAUNT_SINGLE_PX[i]?.[0] ?? 0) : (GHOST_PX[i] ?? 0));
    const ghostBgOf = (i: number): number => (haunted ? (HAUNT_SINGLE_PX[i]?.[1] ?? 0) : BG_PX);

    for (let r = 0; r < drawRows; r++) {
      const gt = 2 * r * grid.w;
      const gb = gt + grid.w;
      const at = 2 * r * ages.w;
      const ab = at + ages.w;
      const pt = 2 * r * w;
      const pb = pt + w;
      for (let c = 0; c < drawCols; c++) {
        const tAlive = (grid.data[gt + c] ?? 0) > 0;
        const bAlive = (grid.data[gb + c] ?? 0) > 0;
        const tAge = ages.data[at + c] ?? 0;
        const bAge = ages.data[ab + c] ?? 0;
        const tGhost = showGhosts && tAge < 0;
        const bGhost = showGhosts && bAge < 0;
        if (!(tAlive || bAlive || tGhost || bGhost)) continue;

        let top = BG_PX;
        let bot = BG_PX;
        if ((tAlive || tGhost) && (bAlive || bGhost)) {
          if (tAlive && bAlive) {
            top = GRAD_PX[cidx(tAge)] ?? 0;
            bot = GRAD_PX[cidx(bAge)] ?? 0;
          } else if (tGhost && bGhost) {
            const ti = gidx(tAge);
            const bi = gidx(bAge);
            if (haunted) {
              const pair = HAUNT_DUAL_PX[ti * HAUNT_FRAMES + bi];
              top = pair?.[0] ?? 0;
              bot = pair?.[1] ?? 0;
            } else {
              top = GHOST_PX[ti] ?? 0;
              bot = GHOST_PX[bi] ?? 0;
            }
          } else if (tAlive) {
            top = GRAD_PX[cidx(tAge)] ?? 0; // ▀ on the default background
          } else {
            bot = GRAD_PX[cidx(bAge)] ?? 0; // ▄ on the default background
          }
        } else if (tAlive) {
          top = GRAD_PX[cidx(tAge)] ?? 0;
        } else if (bAlive) {
          bot = GRAD_PX[cidx(bAge)] ?? 0;
        } else if (tGhost) {
          // ▀ in the ghost pair: its fg on top, its bg (the aliased colour,
          // when haunted) below
          const i = gidx(tAge);
          top = ghostTop(i);
          bot = ghostBgOf(i);
        } else {
          // ▄: the pair's fg below, its bg above
          const i = gidx(bAge);
          bot = ghostTop(i);
          top = ghostBgOf(i);
        }
        px[pt + c] = top;
        px[pb + c] = bot;
      }
    }

    const off = this.off as HTMLCanvasElement | OffscreenCanvas;
    const octx = off.getContext('2d') as CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
    if (!octx || !this.img) return;
    octx.putImageData(this.img, 0, 0);
    const ctx = this.ctx;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, w * this.cw, h * this.cw);
  }

  /** Draw visible ticker messages; they breathe between dim and normal. */
  private ticker(life: InfiniteLife, row: number, st: Status): void {
    const color = NewsTicker.dim(life.generation) ? FG_DIM : FG;
    for (const msg of life.ticker.messages) {
      const col = Math.trunc(msg.x);
      const chars = [...msg.text];
      // Clip to the ticker region
      const visStart = Math.max(col, 0);
      const visEnd = Math.min(col + chars.length, st.tickerWidth);
      if (visStart >= visEnd) continue;
      this.text(chars.slice(visStart - col, visEnd - col).join(''), row, st.tickerCol + visStart, color);
    }
  }

  /** The engine telemetry panel in the bottom-right. */
  private statsOverlay(life: InfiniteLife): void {
    const census = life.lastCensus.size
      ? [...life.lastCensus.entries()].sort((a, b) => b[1] - a[1]).map(([n, c]) => `${c}×${n}`).join(' ')
      : 'none';
    const panelW = 36;
    const panelH = 11;
    const x0 = this.cols - panelW - 2;
    const y0 = this.rows - (this.statusRows - 1) - panelH - 2;
    if (x0 < 0 || y0 < 0) return;
    const lines = [
      '─'.repeat(panelW - 2),
      ' infinity engine',
      ` pop floor  : ${fmt(life.popFloor)}`,
      ` spread/150 : ${fmt(life.spread)}`,
      ` cycle       : ${life.cyclePeriod === 0 ? 'none' : `period ${life.cyclePeriod}`}`,
      ` injections  : ${life.totalInjections}`,
      ` last event  : ${life.lastEvent || 'none'}`,
      life.lastEvent ? `   @ gen     : ${fmt(life.lastEventGen)}` : '               ',
      ` world       : ${life.worldH}x${life.worldW}`,
      ` census      : ${[...census].slice(0, panelW - 16).join('')}`,
      ` tempo       : ${(1 / Math.max(life.dilation, 0.01)).toFixed(2)}x`,
    ];
    const ctx = this.ctx;
    ctx.fillStyle = css(BG);
    ctx.fillRect(x0 * this.cw, y0 * this.cw * 2, panelW * this.cw, lines.length * this.cw * 2);
    lines.forEach((line, i) => {
      const padded = [...` ${line}`.padEnd(panelW)].slice(0, panelW).join('');
      this.text(padded, y0 + i, x0, FG_DIM);
    });
  }

  /** Write a string into the character grid, one glyph per column. */
  text(s: string, row: number, col: number, color: string): void {
    const ctx = this.ctx;
    const cw = this.cw;
    const y = row * cw * 2;
    ctx.fillStyle = color;
    let x = col;
    for (const ch of s) {
      if (x >= this.cols) break;
      if (x >= 0 && ch !== ' ') {
        const spark = SPARKS.indexOf(ch);
        if (spark >= 0) {
          // block elements drawn, not typeset: same on every font
          const hh = Math.max(1, Math.round((cw * 2 * (spark + 1)) / 8));
          ctx.fillRect(x * cw, y + cw * 2 - hh, cw, hh);
        } else if (ch === '─') {
          ctx.fillRect(x * cw, y + cw - Math.max(1, Math.round(cw / 8)) / 2, cw, Math.max(1, Math.round(cw / 8)));
        } else {
          let cw2 = this.widths.get(ch);
          if (cw2 === undefined) {
            cw2 = ctx.measureText(ch).width;
            this.widths.set(ch, cw2);
          }
          ctx.fillText(ch, x * cw + cw / 2 - cw2 / 2, y + cw);
        }
      }
      x++;
    }
  }
}
