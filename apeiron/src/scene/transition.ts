import type { Cell } from '../render/chargrid';
import { smoothstep } from '../math/lut';

export enum TransitionPhase {
  NONE, DISSOLVE, TESSERACT, FORM,
}

export enum TransitionStyle {
  SCATTER, RADIAL, SCANLINE, GLITCH, COLUMN_DRAIN, CRYSTALLIZE, TYPEWRITER,
}

export const DISSOLVE_STYLES: Record<string, TransitionStyle> = {
  material_study: TransitionStyle.RADIAL,
  minimal_object: TransitionStyle.RADIAL,
  essence: TransitionStyle.RADIAL,
  process_state: TransitionStyle.RADIAL,
  textural_macro: TransitionStyle.SCANLINE,
  environmental: TransitionStyle.SCANLINE,
  temporal_diptych: TransitionStyle.SCANLINE,
  material_collision: TransitionStyle.GLITCH,
  abstract_field: TransitionStyle.GLITCH,
  site_decay: TransitionStyle.GLITCH,
  specimen: TransitionStyle.COLUMN_DRAIN,
  liminal: TransitionStyle.COLUMN_DRAIN,
  ruin_state: TransitionStyle.COLUMN_DRAIN,
  atmospheric_depth: TransitionStyle.SCATTER,
};

export const FORM_STYLES: Record<string, TransitionStyle> = {
  material_study: TransitionStyle.RADIAL,
  minimal_object: TransitionStyle.RADIAL,
  material_collision: TransitionStyle.RADIAL,
  textural_macro: TransitionStyle.SCANLINE,
  environmental: TransitionStyle.SCANLINE,
  liminal: TransitionStyle.SCANLINE,
  atmospheric_depth: TransitionStyle.CRYSTALLIZE,
  abstract_field: TransitionStyle.CRYSTALLIZE,
  essence: TransitionStyle.CRYSTALLIZE,
  process_state: TransitionStyle.CRYSTALLIZE,
  specimen: TransitionStyle.TYPEWRITER,
  temporal_diptych: TransitionStyle.TYPEWRITER,
  site_decay: TransitionStyle.TYPEWRITER,
  ruin_state: TransitionStyle.SCATTER,
};

export class TransitionState {
  phase = TransitionPhase.NONE;
  progress = 0;
  totalFrames = 504;
  currentFrame = 0;
  dissolveEnd = 0.20;
  tesseractEnd = 0.75;
  dissolveStyle = TransitionStyle.SCATTER;
  formStyle = TransitionStyle.SCATTER;

  get active(): boolean { return this.phase !== TransitionPhase.NONE; }

  start(dissolveStyle: TransitionStyle, formStyle: TransitionStyle): void {
    this.phase = TransitionPhase.DISSOLVE;
    this.progress = 0;
    this.currentFrame = 0;
    this.dissolveStyle = dissolveStyle;
    this.formStyle = formStyle;
  }

  tick(): void {
    if (!this.active) return;
    this.currentFrame++;
    this.progress = Math.min(this.currentFrame / Math.max(this.totalFrames, 1), 1.0);

    if (this.progress < this.dissolveEnd) this.phase = TransitionPhase.DISSOLVE;
    else if (this.progress < this.tesseractEnd) this.phase = TransitionPhase.TESSERACT;
    else this.phase = TransitionPhase.FORM;

    if (this.progress >= 1.0) {
      this.phase = TransitionPhase.NONE;
      this.progress = 0;
      this.currentFrame = 0;
    }
  }

  phaseProgress(): number {
    if (this.phase === TransitionPhase.DISSOLVE) return this.progress / this.dissolveEnd;
    if (this.phase === TransitionPhase.TESSERACT) return (this.progress - this.dissolveEnd) / (this.tesseractEnd - this.dissolveEnd);
    if (this.phase === TransitionPhase.FORM) return (this.progress - this.tesseractEnd) / (1.0 - this.tesseractEnd);
    return 0;
  }
}

const GLITCH_CHARS = '░▒▓█╗╔╚╝║═▀▄▐▌';

type TransitionFn = (cells: Cell[], width: number, height: number, t: number) => void;

function dissolveScatter(cells: Cell[], _w: number, _h: number, t: number): void {
  const threshold = t * t;
  for (const cell of cells) {
    if (cell.char !== ' ' && Math.random() < threshold) { cell.char = ' '; cell.style = ''; }
  }
}

function dissolveRadial(cells: Cell[], w: number, h: number, t: number): void {
  const cx = w / 2, cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + (cy * 2) ** 2);
  const cutoff = (1 - t) * maxDist;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].char === ' ') continue;
    const col = i % w, row = (i / w) | 0;
    const dx = col - cx, dy = (row - cy) * 2;
    if (Math.sqrt(dx * dx + dy * dy) > cutoff + (Math.random() * 6 - 3)) {
      cells[i].char = ' '; cells[i].style = '';
    }
  }
}

function dissolveScanline(cells: Cell[], w: number, h: number, t: number): void {
  const sweep = t * (h + 2);
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].char === ' ') continue;
    const row = (i / w) | 0;
    if (row < sweep + (Math.random() * 3 - 1.5)) { cells[i].char = ' '; cells[i].style = ''; }
  }
}

function dissolveGlitch(cells: Cell[], _w: number, _h: number, t: number): void {
  const n = GLITCH_CHARS.length;
  for (const cell of cells) {
    if (cell.char === ' ') continue;
    if (t < 0.5) {
      if (Math.random() < t * 1.8) cell.char = GLITCH_CHARS[(Math.random() * n) | 0];
    } else {
      const bt = (t - 0.5) * 2;
      if (Math.random() < bt * bt) { cell.char = ' '; cell.style = ''; }
      else if (Math.random() < 0.3) cell.char = GLITCH_CHARS[(Math.random() * n) | 0];
    }
  }
}

function dissolveColumnDrain(cells: Cell[], w: number, h: number, t: number): void {
  for (let col = 0; col < w; col++) {
    const colSpeed = 0.7 + 0.6 * ((col * 2654435761) & 0xFF) / 255;
    const drainRow = t * colSpeed * (h + 2);
    for (let row = 0; row < h; row++) {
      const cell = cells[row * w + col];
      if (cell.char !== ' ' && row < drainRow + (Math.random() * 3 - 1.5)) {
        cell.char = ' '; cell.style = '';
      }
    }
  }
}

function formScatter(cells: Cell[], _w: number, _h: number, t: number): void {
  const threshold = 1 - smoothstep(0, 1, t);
  for (const cell of cells) {
    if (cell.char !== ' ' && Math.random() < threshold) { cell.char = ' '; cell.style = ''; }
  }
}

function formRadial(cells: Cell[], w: number, h: number, t: number): void {
  const cx = w / 2, cy = h / 2;
  const maxDist = Math.sqrt(cx * cx + (cy * 2) ** 2);
  const cutoff = t * maxDist;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].char === ' ') continue;
    const col = i % w, row = (i / w) | 0;
    const dx = col - cx, dy = (row - cy) * 2;
    if (Math.sqrt(dx * dx + dy * dy) > cutoff + (Math.random() * 6 - 3)) {
      cells[i].char = ' '; cells[i].style = '';
    }
  }
}

function formScanline(cells: Cell[], w: number, h: number, t: number): void {
  const sweep = t * (h + 2);
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].char === ' ') continue;
    const row = (i / w) | 0;
    if (row > sweep + (Math.random() * 3 - 1.5)) { cells[i].char = ' '; cells[i].style = ''; }
  }
}

function formCrystallize(cells: Cell[], _w: number, _h: number, t: number): void {
  const reveal = t * t * t;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].char === ' ') continue;
    const rank = ((i * 2654435761) & 0xFFFFFFFF) / 4294967295;
    if (rank > reveal + (Math.random() * 0.1 - 0.05)) { cells[i].char = ' '; cells[i].style = ''; }
  }
}

function formTypewriter(cells: Cell[], w: number, h: number, t: number): void {
  const sweep = t * (h + 3);
  const invW = 1.5 / Math.max(w, 1);
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].char === ' ') continue;
    const row = (i / w) | 0, col = i % w;
    if (row + col * invW > sweep) { cells[i].char = ' '; cells[i].style = ''; }
  }
}

const DISSOLVE_FN: Record<TransitionStyle, TransitionFn> = {
  [TransitionStyle.SCATTER]: dissolveScatter,
  [TransitionStyle.RADIAL]: dissolveRadial,
  [TransitionStyle.SCANLINE]: dissolveScanline,
  [TransitionStyle.GLITCH]: dissolveGlitch,
  [TransitionStyle.COLUMN_DRAIN]: dissolveColumnDrain,
  [TransitionStyle.CRYSTALLIZE]: dissolveScatter,
  [TransitionStyle.TYPEWRITER]: dissolveScatter,
};

const FORM_FN: Record<TransitionStyle, TransitionFn> = {
  [TransitionStyle.SCATTER]: formScatter,
  [TransitionStyle.RADIAL]: formRadial,
  [TransitionStyle.SCANLINE]: formScanline,
  [TransitionStyle.CRYSTALLIZE]: formCrystallize,
  [TransitionStyle.TYPEWRITER]: formTypewriter,
  [TransitionStyle.GLITCH]: formScatter,
  [TransitionStyle.COLUMN_DRAIN]: formScatter,
};

export function applyDissolve(style: TransitionStyle, cells: Cell[], w: number, h: number, t: number): void {
  (DISSOLVE_FN[style] ?? dissolveScatter)(cells, w, h, t);
}

export function applyForm(style: TransitionStyle, cells: Cell[], w: number, h: number, t: number): void {
  (FORM_FN[style] ?? formScatter)(cells, w, h, t);
}
