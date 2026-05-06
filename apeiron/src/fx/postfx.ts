import type { CharGrid, Cell } from '../render/chargrid';
import { clamp } from '../math/lut';
import { fnv1a } from '../hash';

function dimColor(hex: string): string {
  if (!hex.startsWith('#') || hex.length < 7) return hex;
  const r = Math.max(0, (parseInt(hex.slice(1, 3), 16) * 0.5) | 0);
  const g = Math.max(0, (parseInt(hex.slice(3, 5), 16) * 0.5) | 0);
  const b = Math.max(0, (parseInt(hex.slice(5, 7), 16) * 0.5) | 0);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function applyDim(cell: Cell): void {
  cell.style = dimColor(cell.style);
}

export function applyScanlines(grid: CharGrid, period = 2): void {
  const w = grid.width;
  for (let row = 0; row < grid.height; row++) {
    if (row % period === 0) {
      const base = row * w;
      for (let col = 0; col < w; col++) applyDim(grid.cells[base + col]);
    }
  }
}

export function applyVignette(grid: CharGrid, strength = 0.5): void {
  strength = clamp(strength, 0, 1);
  if (strength < 1e-6) return;
  const cx = grid.width / 2, cy = grid.height / 2;
  if (cx < 1e-6 || cy < 1e-6) return;
  const invCx = 1 / Math.max(cx, 1), invCy = 1 / Math.max(cy, 1);
  const threshSq = (0.4 / strength) ** 2;
  const colNorm = Array.from({ length: grid.width }, (_, c) => ((c - cx) * invCx) ** 2);
  for (let row = 0; row < grid.height; row++) {
    const rn = ((row - cy) * invCy) ** 2;
    const base = row * grid.width;
    for (let col = 0; col < grid.width; col++) {
      if (rn + colNorm[col] > threshSq) applyDim(grid.cells[base + col]);
    }
  }
}

const BLOOM_CHARS = new Set('█#%@●◉');
export function applyBloom(grid: CharGrid): void {
  const w = grid.width, h = grid.height, cells = grid.cells;
  const sources: number[] = [];
  for (let i = 0; i < cells.length; i++) { if (BLOOM_CHARS.has(cells[i].char)) sources.push(i); }
  for (const idx of sources) {
    const col = idx % w, row = (idx / w) | 0;
    for (const ni of [col > 0 ? idx - 1 : -1, col + 1 < w ? idx + 1 : -1, row > 0 ? idx - w : -1, row + 1 < h ? idx + w : -1]) {
      if (ni >= 0 && cells[ni].char.trim() === '') { cells[ni].char = '·'; cells[ni].style = dimColor(cells[idx].style); }
    }
  }
}

export function applyNoiseGrain(grid: CharGrid, density = 0.05): void {
  const chars = ['·', '∙', '.'];
  for (const cell of grid.cells) {
    if (cell.char.trim() === '' && Math.random() < density) { cell.char = chars[(Math.random() * 3) | 0]; cell.style = '#333333'; }
  }
}

export function applyEdgeGlow(grid: CharGrid): void {
  const w = grid.width, h = grid.height, cells = grid.cells;
  const targets: number[] = [];
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].char.trim()) continue;
    const col = i % w, row = (i / w) | 0;
    if (col > 0 && !cells[i - 1].char.trim()) targets.push(i - 1);
    if (col + 1 < w && !cells[i + 1].char.trim()) targets.push(i + 1);
    if (row > 0 && !cells[i - w].char.trim()) targets.push(i - w);
    if (row + 1 < h && !cells[i + w].char.trim()) targets.push(i + w);
  }
  for (const i of targets) { if (!cells[i].char.trim()) { cells[i].char = '·'; cells[i].style = '#444444'; } }
}

const crtWarpCache = new Map<string, Int32Array>();
export function applyCrtWarp(grid: CharGrid): void {
  const w = grid.width, h = grid.height;
  if (w < 4 || h < 4) return;
  const cx = w / 2, cy = h / 2, k = 0.15;
  const key = `${w}x${h}`;
  let remap = crtWarpCache.get(key);
  if (!remap) {
    remap = new Int32Array(w * h).fill(-1);
    for (let row = 0; row < h; row++) {
      const dy = (row - cy) / cy;
      for (let col = 0; col < w; col++) {
        const dx = (col - cx) / cx;
        const r = Math.sqrt(dx * dx + dy * dy);
        const scale = r > 1e-6 ? (r + k * r * r * r) / r : 1;
        const sc = (cx + dx * scale * cx) | 0, sr = (cy + dy * scale * cy) | 0;
        if (sc >= 0 && sc < w && sr >= 0 && sr < h) remap[row * w + col] = sr * w + sc;
      }
    }
    crtWarpCache.set(key, remap);
  }
  const src = grid.cells;
  if (!grid.fxScratch || grid.fxScratch.length !== w * h) {
    grid.fxScratch = Array.from({ length: w * h }, () => ({ char: ' ', style: '', depth: 1 }));
  }
  const dst = grid.fxScratch;
  for (let i = 0; i < remap.length; i++) {
    const si = remap[i];
    if (si >= 0) { dst[i].char = src[si].char; dst[i].style = src[si].style; dst[i].depth = src[si].depth; }
    else { dst[i].char = ' '; dst[i].style = ''; dst[i].depth = 1; }
  }
  grid.cells = dst;
  grid.fxScratch = src;
}

export function applyDepthFog(grid: CharGrid, start = 0.35, fade = 0.7): void {
  let minD = 1, maxD = 0;
  for (const c of grid.cells) { if (c.char.trim()) { if (c.depth < minD) minD = c.depth; if (c.depth > maxD) maxD = c.depth; } }
  const range = maxD - minD;
  if (range < 1e-6) return;
  const inv = 1 / range;
  for (const c of grid.cells) {
    if (!c.char.trim()) continue;
    const nd = (c.depth - minD) * inv;
    if (nd <= start) continue;
    applyDim(c);
    if (nd > fade) c.char = '·';
  }
}

const DOF_RAMP = ' .,-~:;=!*#$@';
const DOF_BRIGHT: Record<string, number> = {};
for (let i = 0; i < DOF_RAMP.length; i++) DOF_BRIGHT[DOF_RAMP[i]] = i / Math.max(DOF_RAMP.length - 1, 1);

export function applyDepthOfField(grid: CharGrid, focus = 0.35, sharpRange = 0.2): void {
  let minD = 1, maxD = 0;
  for (const c of grid.cells) { if (c.char.trim()) { if (c.depth < minD) minD = c.depth; if (c.depth > maxD) maxD = c.depth; } }
  const range = maxD - minD;
  if (range < 1e-6) return;
  const inv = 1 / range;
  const maxBlur = Math.max(1 - sharpRange, 0.3);
  for (const c of grid.cells) {
    if (!c.char.trim()) continue;
    const nd = (c.depth - minD) * inv;
    const defocus = Math.abs(nd - focus);
    if (defocus <= sharpRange) continue;
    const blur = Math.min((defocus - sharpRange) / maxBlur, 1);
    const brightness = DOF_BRIGHT[c.char] ?? 0.5;
    const newB = brightness * (1 - blur * 0.7);
    const newIdx = Math.max(1, Math.min((newB * (DOF_RAMP.length - 1) + 0.5) | 0, DOF_RAMP.length - 1));
    c.char = DOF_RAMP[newIdx];
    if (blur > 0.3) applyDim(c);
  }
}

export function applyDepthContour(grid: CharGrid, threshold = 0.12): void {
  const w = grid.width, h = grid.height, cells = grid.cells;
  let minD = 1, maxD = 0;
  for (const c of cells) { if (c.char.trim()) { if (c.depth < minD) minD = c.depth; if (c.depth > maxD) maxD = c.depth; } }
  const range = maxD - minD;
  if (range < 1e-6) return;
  const absT = threshold * range;
  const contours: [number, string][] = [];
  for (let row = 0; row < h; row++) {
    const base = row * w;
    for (let col = 0; col < w; col++) {
      const idx = base + col;
      const d = cells[idx].depth;
      if (d >= 1) continue;
      const hEdge = row + 1 < h && Math.abs(d - cells[idx + w].depth) > absT;
      const vEdge = col + 1 < w && Math.abs(d - cells[idx + 1].depth) > absT;
      if (hEdge && vEdge) contours.push([idx, '┼']);
      else if (hEdge) contours.push([idx, '─']);
      else if (vEdge) contours.push([idx, '│']);
    }
  }
  for (const [idx, ch] of contours) cells[idx].char = ch;
}

export function applyRollingBars(grid: CharGrid, speed = 3, frequency = 0.4): void {
  const w = grid.width, t = grid.time;
  for (let row = 0; row < grid.height; row++) {
    if (Math.sin((row + t * speed) * frequency) < -0.3) {
      const base = row * w;
      for (let col = 0; col < w; col++) { if (grid.cells[base + col].char.trim()) applyDim(grid.cells[base + col]); }
    }
  }
}

export function applyFlicker(grid: CharGrid, intensity = 0.08): void {
  const frameSeed = ((grid.time * 8) | 0) * 0x9E3779B9 & 0xFFFFFFFF;
  const thresh = (clamp(intensity, 0, 1) * 255) | 0;
  for (let i = 0; i < grid.cells.length; i++) {
    if (!grid.cells[i].char.trim()) continue;
    if ((((i * 2654435761) ^ frameSeed) & 0xFF) < thresh) applyDim(grid.cells[i]);
  }
}

export function applyPulse(grid: CharGrid, speed = 1.5, wavelength = 0.4): void {
  const w = grid.width, h = grid.height, cx = w / 2, cy = h / 2, t = grid.time;
  const invWl = 1 / Math.max(wavelength, 0.01);
  const invCx = 1 / Math.max(cx, 1), invCy = 1 / Math.max(cy, 1);
  for (let row = 0; row < h; row++) {
    const dy = (row - cy) * invCy, dySq = dy * dy, base = row * w;
    for (let col = 0; col < w; col++) {
      const cell = grid.cells[base + col];
      if (!cell.char.trim()) continue;
      const dx = (col - cx) * invCx;
      if (Math.sin((Math.sqrt(dx * dx + dySq) - t * speed) * invWl * Math.PI * 2) < -0.3) applyDim(cell);
    }
  }
}

export function applyChromaticSplit(grid: CharGrid, offset = 1): void {
  const w = grid.width, h = grid.height, n = w * h, src = grid.cells;
  if (!grid.fxScratch || grid.fxScratch.length !== n) {
    grid.fxScratch = Array.from({ length: n }, () => ({ char: ' ', style: '', depth: 1 }));
  }
  const dst = grid.fxScratch;
  for (let i = 0; i < n; i++) { dst[i].char = src[i].char; dst[i].style = src[i].style; dst[i].depth = src[i].depth; }
  for (let row = 0; row < h; row++) {
    const base = row * w;
    for (let col = 0; col < w; col++) {
      if (!src[base + col].char.trim()) continue;
      const dc = col + offset;
      if (dc >= 0 && dc < w && !dst[base + dc].char.trim()) {
        dst[base + dc].char = src[base + col].char;
        dst[base + dc].style = dimColor(src[base + col].style);
        dst[base + dc].depth = src[base + col].depth;
      }
    }
  }
  grid.cells = dst;
  grid.fxScratch = src;
}

export function applyGhosting(grid: CharGrid, maxOffset = 2): void {
  const w = grid.width, h = grid.height, cells = grid.cells;
  const ghosts: [number, string, string][] = [];
  for (let row = 0; row < h; row++) {
    const base = row * w;
    for (let col = 0; col < w; col++) {
      if (!cells[base + col].char.trim()) continue;
      for (let dy = 1; dy <= maxOffset; dy++) {
        if (row + dy >= h) break;
        ghosts.push([(row + dy) * w + col, cells[base + col].char, dy === 1 ? dimColor(cells[base + col].style) : '#333333']);
      }
    }
  }
  for (const [idx, ch, style] of ghosts) { if (!cells[idx].char.trim()) { cells[idx].char = ch; cells[idx].style = style; } }
}

export function applyContourExtract(grid: CharGrid): void {
  const w = grid.width, h = grid.height, cells = grid.cells;
  const isEdge = new Uint8Array(w * h);
  for (let row = 0; row < h; row++) {
    const base = row * w;
    for (let col = 0; col < w; col++) {
      const idx = base + col;
      if (!cells[idx].char.trim()) continue;
      if (col === 0 || col + 1 >= w || row === 0 || row + 1 >= h ||
        !cells[idx - 1].char.trim() || !cells[idx + 1].char.trim() ||
        !cells[idx - w].char.trim() || !cells[idx + w].char.trim()) {
        isEdge[idx] = 1;
      }
    }
  }
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].char.trim() && !isEdge[i]) { cells[i].char = ' '; cells[i].style = ''; }
  }
}

const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map(r => r.map(v => v / 16));
const HALFTONE_DENSITY: Record<string, number> = {};
const DENSITY_RAMP = ' .·,:-~;=+*#$@█';
for (let i = 0; i < DENSITY_RAMP.length; i++) HALFTONE_DENSITY[DENSITY_RAMP[i]] = i / Math.max(DENSITY_RAMP.length - 1, 1);

export function applyHalftone(grid: CharGrid): void {
  const w = grid.width, cells = grid.cells;
  for (let i = 0; i < cells.length; i++) {
    if (!cells[i].char.trim()) continue;
    const col = i % w, row = (i / w) | 0;
    const thresh = BAYER[row & 3][col & 3];
    if ((HALFTONE_DENSITY[cells[i].char] ?? 0.5) < thresh) { cells[i].char = ' '; cells[i].style = ''; }
  }
}

const EFFECT_FN: Record<string, (grid: CharGrid) => void> = {
  scanlines: applyScanlines, vignette: applyVignette, bloom: applyBloom,
  noise_grain: applyNoiseGrain, edge_glow: applyEdgeGlow, crt_warp: applyCrtWarp,
  depth_fog: applyDepthFog, depth_of_field: applyDepthOfField, depth_contour: applyDepthContour,
  rolling_bars: applyRollingBars, flicker: applyFlicker, pulse: applyPulse,
  chromatic_split: applyChromaticSplit, ghosting: applyGhosting,
  contour_extract: applyContourExtract, halftone: applyHalftone,
};

const EFFECT_MAP: Record<string, string[]> = {
  oil_impasto: ['bloom', 'edge_glow'], charcoal: ['noise_grain', 'edge_glow', 'vignette'],
  risograph: ['scanlines', 'noise_grain'], daguerreotype: ['vignette', 'noise_grain', 'depth_fog'],
  '3d_render': [], '3d render': [], glitch_art: ['scanlines', 'noise_grain', 'crt_warp'],
  crt: ['scanlines', 'crt_warp', 'bloom'], blueprint: ['scanlines', 'edge_glow'],
  'glass plate negative': ['depth_fog', 'vignette', 'noise_grain'],
  'carbon print process': ['halftone', 'vignette', 'depth_fog'],
  'mri scan': ['contour_extract', 'scanlines', 'depth_fog'],
  'holographic interferometry': ['chromatic_split', 'rolling_bars', 'bloom'],
  'cross-processed film': ['ghosting', 'chromatic_split', 'vignette'],
  'fresco buon': ['halftone', 'noise_grain', 'edge_glow'],
  'electron micrograph': ['contour_extract', 'depth_of_field', 'scanlines'],
  'infrared photography': ['depth_fog', 'bloom', 'flicker'],
  cyanotype: ['contour_extract', 'vignette', 'depth_fog'],
  tintype: ['depth_fog', 'noise_grain', 'vignette'],
  'screen print': ['halftone', 'chromatic_split'],
  'thermal imaging': ['depth_contour', 'bloom', 'pulse'],
  'x-ray': ['contour_extract', 'depth_fog', 'flicker'],
  'kirlian photograph': ['edge_glow', 'bloom', 'ghosting', 'flicker'],
  linocut: ['contour_extract', 'halftone'],
};

const FALLBACK_STACKS: string[][] = [
  ['vignette'], ['scanlines', 'bloom'], ['noise_grain', 'edge_glow'],
  ['vignette', 'scanlines'], ['bloom', 'noise_grain'], ['edge_glow', 'vignette'],
  ['crt_warp', 'scanlines'], ['bloom', 'edge_glow', 'vignette'],
  ['depth_fog', 'vignette'], ['ghosting', 'scanlines'], ['chromatic_split', 'bloom'],
  ['rolling_bars', 'depth_fog'], ['contour_extract', 'edge_glow'],
  ['halftone', 'vignette', 'depth_fog'], ['depth_of_field', 'noise_grain'],
  ['ghosting', 'chromatic_split'], ['flicker', 'scanlines', 'depth_fog'],
  ['pulse', 'bloom', 'edge_glow'], ['depth_contour', 'depth_fog'],
  ['chromatic_split', 'ghosting', 'vignette'],
];

export function effectForWord(word: string): string[] {
  const key = word.toLowerCase().trim();
  if (EFFECT_MAP[key]) return [...EFFECT_MAP[key]];
  return [...FALLBACK_STACKS[fnv1a(key) % FALLBACK_STACKS.length]];
}

export function applyEffects(grid: CharGrid, effectNames: string[]): void {
  for (const name of effectNames) {
    const fn = EFFECT_FN[name];
    if (fn) { try { fn(grid); } catch { /* never crash the renderer */ } }
  }
}
