import { Vec3 } from '../math/vec';
import { clamp } from '../math/lut';
import { CharGrid } from './chargrid';
import type { ScreenPoint } from './transform';
import { ProjectionContext } from './transform';
import type { Mesh, PointCloud, VoxelGrid } from '../scene/geometry';

export const DONUT_LUMINANCE_RAMP = ' .,-~:;=!*#$@';

const STYLE_BRIGHT_CUTOFF = 0.50 ** (1.0 / 0.55);
const STYLE_PRIMARY_CUTOFF = 0.28 ** (1.0 / 0.55);
const STYLE_MID_CUTOFF = 0.10 ** (1.0 / 0.55);

export type StyleTuple = [string, string, string, string];

export interface SurfaceSample { pos: Vec3; normal: Vec3; }

export interface SurfaceSampler {
  samples(): SurfaceSample[];
}

export class Light {
  constructor(
    public direction: Vec3,
    public intensity: number = 1.0,
    public wrap: number = 0.0,
    public ambient: number = 0.18,
  ) {}

  shade(normal: Vec3): number {
    const ndotl = -(normal.dot(this.direction));
    let brightness: number;
    if (this.wrap > 0.0) {
      brightness = (ndotl + this.wrap) / (1.0 + this.wrap);
    } else {
      brightness = Math.max(0.0, ndotl);
    }
    const result = this.ambient + (1.0 - this.ambient) * brightness * this.intensity;
    return clamp(result, 0.0, 1.0);
  }
}

export const DEFAULT_LIGHT = new Light(
  new Vec3(0.3, -0.8, 0.5).normalized(),
  1.2,
);

export function depthToStyle(depth: number, bright: string, primary: string, mid: string, dim: string): string {
  if (depth < 0.35) return bright;
  if (depth < 0.55) return primary;
  if (depth < 0.75) return mid;
  return dim;
}

export function brightnessToStyle(brightness: number, bright: string, primary: string, mid: string, dim: string): string {
  if (brightness > STYLE_BRIGHT_CUTOFF) return bright;
  if (brightness > STYLE_PRIMARY_CUTOFF) return primary;
  if (brightness > STYLE_MID_CUTOFF) return mid;
  return dim;
}

export class AsciiRasterizer {
  grid: CharGrid;

  constructor(width: number, height: number) {
    this.grid = new CharGrid(width, height);
  }

  get width(): number { return this.grid.width; }
  get height(): number { return this.grid.height; }

  resize(width: number, height: number): void {
    if (width !== this.grid.width || height !== this.grid.height) {
      this.grid = new CharGrid(width, height);
    }
  }

  clear(): void { this.grid.clear(); }

  drawMeshFilled(
    mesh: Mesh,
    ctx: ProjectionContext,
    shaderChars: string,
    light: Light,
    styles: StyleTuple,
  ): void {
    const hasVnormals = mesh.vertexNormals.length > 0;
    if (mesh.normals.length === 0 && !hasVnormals) {
      mesh.computeNormals();
    }

    const nChars = shaderChars.length;
    const projected: ([number, number, number] | null)[] = [];
    for (const v of mesh.vertices) {
      projected.push(ctx.projectVertexUnclamped(v));
    }

    const vertBrightness: number[] = [];
    if (hasVnormals || mesh.vertexNormals.length > 0) {
      for (const vn of mesh.vertexNormals) {
        const viewN = ctx.transformNormal(vn);
        vertBrightness.push(light.shade(viewN));
      }
    }
    while (vertBrightness.length < mesh.vertices.length) {
      vertBrightness.push(0.5);
    }

    for (const face of mesh.faces) {
      const pts: [number, number, number][] = [];
      let skip = false;
      for (const vi of face) {
        const p = projected[vi];
        if (p === null) { skip = true; break; }
        pts.push(p);
      }
      if (skip || pts.length < 3) continue;

      const [ax, ay] = pts[0];
      const [bx, by] = pts[1];
      const [cx, cy] = pts[2];
      const crossZ = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
      if (crossZ > 0) continue;

      const faceBright = face.map(vi => vertBrightness[vi]);

      for (let ti = 1; ti < pts.length - 1; ti++) {
        this.fillTriangleGouraud(
          pts[0], pts[ti], pts[ti + 1],
          faceBright[0], faceBright[ti], faceBright[ti + 1],
          shaderChars, nChars, styles,
        );
      }
    }
  }

  private fillTriangleGouraud(
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number],
    brightA: number, brightB: number, brightC: number,
    shaderChars: string, nChars: number,
    styles: StyleTuple,
  ): void {
    const [ax, ay, az] = a;
    const [bx, by, bz] = b;
    const [cx, cy, cz] = c;
    const [brightS, primaryS, midS, dimS] = styles;

    const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (area > -1e-10 && area < 1e-10) return;
    const orient = area > 0.0 ? 1.0 : -1.0;
    const invArea = 1.0 / Math.abs(area);

    const minCol = Math.max(0, Math.floor(Math.min(ax, bx, cx)));
    const maxCol = Math.min(this.width - 1, Math.floor(Math.max(ax, bx, cx)) + 1);
    const minRow = Math.max(0, Math.floor(Math.min(ay, by, cy)));
    const maxRow = Math.min(this.height - 1, Math.floor(Math.max(ay, by, cy)) + 1);

    if (minCol > maxCol || minRow > maxRow) return;

    const width = this.width;
    const zbuf = this.grid.zbuf;
    const cells = this.grid.cells;
    const shaderLast = nChars - 1;
    const eps = -0.001;

    const e0dx = (by - cy) * orient;
    const e0dy = (cx - bx) * orient;
    const e1dx = (cy - ay) * orient;
    const e1dy = (ax - cx) * orient;
    const e2dx = (ay - by) * orient;
    const e2dy = (bx - ax) * orient;

    const startX = minCol + 0.5;
    const startY = minRow + 0.5;
    let rowE0 = ((cx - bx) * (startY - by) - (cy - by) * (startX - bx)) * orient;
    let rowE1 = ((ax - cx) * (startY - cy) - (ay - cy) * (startX - cx)) * orient;
    let rowE2 = ((bx - ax) * (startY - ay) - (by - ay) * (startX - ax)) * orient;

    for (let row = minRow; row <= maxRow; row++) {
      let e0 = rowE0, e1 = rowE1, e2 = rowE2;
      let idx = row * width + minCol;

      for (let col = minCol; col <= maxCol; col++) {
        if (e0 >= eps && e1 >= eps && e2 >= eps) {
          const u = e0 * invArea;
          const v = e1 * invArea;
          const w = 1.0 - u - v;

          const depth = u * az + v * bz + w * cz;
          if (depth < zbuf[idx]) {
            const brightness = u * brightA + v * brightB + w * brightC;
            let charIdx = (brightness * shaderLast) | 0;
            if (charIdx < 0) charIdx = 0;
            else if (charIdx > shaderLast) charIdx = shaderLast;
            const ch = shaderChars[charIdx];
            if (ch !== ' ') {
              let style: string;
              if (brightness > STYLE_BRIGHT_CUTOFF) style = brightS;
              else if (brightness > STYLE_PRIMARY_CUTOFF) style = primaryS;
              else if (brightness > STYLE_MID_CUTOFF) style = midS;
              else style = dimS;
              zbuf[idx] = depth;
              const cell = cells[idx];
              cell.char = ch;
              cell.style = style;
              cell.depth = depth;
            }
          }
        }
        idx++;
        e0 += e0dx; e1 += e1dx; e2 += e2dx;
      }
      rowE0 += e0dy; rowE1 += e1dy; rowE2 += e2dy;
    }
  }

  private drawProjectedLine(p0: ScreenPoint, p1: ScreenPoint, char: string, styles: StyleTuple): void {
    const [brightS, primaryS, midS, dimS] = styles;
    const width = this.width, height = this.height;
    const zbuf = this.grid.zbuf, cells = this.grid.cells;

    let x0 = p0.col, y0 = p0.row;
    const x1 = p1.col, y1 = p1.row;
    const depth0 = p0.depth, depth1 = p1.depth;
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    const steps = Math.max(dx, dy, 1);
    const depthDelta = depth1 - depth0;
    let step = 0;

    while (true) {
      if (x0 >= 0 && x0 < width && y0 >= 0 && y0 < height) {
        const depth = depth0 + depthDelta * (step / steps);
        const idx = y0 * width + x0;
        if (depth < zbuf[idx]) {
          let style: string;
          if (depth < 0.35) style = brightS;
          else if (depth < 0.55) style = primaryS;
          else if (depth < 0.75) style = midS;
          else style = dimS;
          zbuf[idx] = depth;
          const cell = cells[idx];
          cell.char = char;
          cell.style = style;
          cell.depth = depth;
        }
      }
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
      step++;
    }
  }

  drawMeshWireframe(
    mesh: Mesh, ctx: ProjectionContext, edgeChar = '·',
    styles: StyleTuple = ['#ffffff', '#cccccc', '#888888', '#555555'],
    vertexChar = '',
  ): void {
    const projected: (ScreenPoint | null)[] = mesh.vertices.map(v => ctx.projectVertex(v));

    if (mesh.edges.length === 0) mesh.computeEdgesFromFaces();
    for (const [i0, i1] of mesh.edges) {
      const p0 = projected[i0], p1 = projected[i1];
      if (p0 && p1) this.drawProjectedLine(p0, p1, edgeChar, styles);
    }

    if (vertexChar) {
      const [brightS, primaryS, midS, dimS] = styles;
      for (const sp of projected) {
        if (sp && sp.col >= 0 && sp.col < this.width && sp.row >= 0 && sp.row < this.height) {
          const style = depthToStyle(sp.depth, brightS, primaryS, midS, dimS);
          this.grid.write(sp.col, sp.row, vertexChar, style, sp.depth);
        }
      }
    }
  }

  drawPoints(
    cloud: PointCloud, ctx: ProjectionContext,
    pointChars = '·∙•●', styles: StyleTuple = ['#ffffff', '#cccccc', '#888888', '#555555'],
  ): void {
    if (!pointChars) return;
    const [brightS, primaryS, midS, dimS] = styles;
    const lastCharIdx = pointChars.length - 1;
    const width = this.width, height = this.height;
    const { maxCol, maxRow, clipMargin, depthMargin } = ctx;
    const { m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15 } = ctx;
    const zbuf = this.grid.zbuf, cells = this.grid.cells;

    for (let i = 0; i < cloud.points.length; i++) {
      const pt = cloud.points[i];
      const { x: px, y: py, z: pz } = pt;
      const clipW = m12 * px + m13 * py + m14 * pz + m15;
      if (clipW <= 0.0) continue;

      const invW = 1.0 / clipW;
      const ndcX = (m0 * px + m1 * py + m2 * pz + m3) * invW;
      const ndcY = (m4 * px + m5 * py + m6 * pz + m7) * invW;
      const ndcZ = (m8 * px + m9 * py + m10 * pz + m11) * invW;
      if (Math.abs(ndcX) > clipMargin || Math.abs(ndcY) > clipMargin || Math.abs(ndcZ) > depthMargin) continue;

      const col = ((ndcX * 0.5 + 0.5) * maxCol + 0.5) | 0;
      const row = (((1.0 - ndcY) * 0.5) * maxRow + 0.5) | 0;
      if (col < 0 || col >= width || row < 0 || row >= height) continue;

      const depth = clamp((ndcZ + 1.0) * 0.5, 0.0, 1.0);
      const idx = row * width + col;
      if (depth >= zbuf[idx]) continue;

      const ptBright = i < cloud.brightness.length ? cloud.brightness[i] : 0.5;
      const combined = ptBright * (1.0 - depth * 0.5);
      let cIdx = (combined * lastCharIdx) | 0;
      if (cIdx < 0) cIdx = 0;
      else if (cIdx > lastCharIdx) cIdx = lastCharIdx;

      let style: string;
      if (depth < 0.35) style = brightS;
      else if (depth < 0.55) style = primaryS;
      else if (depth < 0.75) style = midS;
      else style = dimS;

      zbuf[idx] = depth;
      const cell = cells[idx];
      cell.char = pointChars[cIdx];
      cell.style = style;
      cell.depth = depth;
    }
  }

  drawVoxels(
    voxels: VoxelGrid, ctx: ProjectionContext,
    blockChar = '█', styles: StyleTuple = ['#ffffff', '#cccccc', '#888888', '#555555'],
  ): void {
    const [brightS, primaryS, midS, dimS] = styles;
    for (let z = 0; z < voxels.sizeZ; z++) {
      for (let y = 0; y < voxels.sizeY; y++) {
        for (let x = 0; x < voxels.sizeX; x++) {
          if (!voxels.get(x, y, z)) continue;
          const center = voxels.cellCenter(x, y, z);
          const sp = ctx.projectVertex(center);
          if (!sp) continue;
          const style = depthToStyle(sp.depth, brightS, primaryS, midS, dimS);
          this.grid.write(sp.col, sp.row, blockChar, style, sp.depth);
        }
      }
    }
  }

  drawTesseractWireframe(
    vertices3d: Vec3[], edges: [number, number][], ctx: ProjectionContext,
    edgeChar = '─', vertexChar = '●',
    styles: StyleTuple = ['#ffffff', '#cccccc', '#888888', '#555555'],
  ): void {
    const [brightS] = styles;
    const projected: (ScreenPoint | null)[] = vertices3d.map(v => ctx.projectVertex(v));

    for (const [i0, i1] of edges) {
      const p0 = projected[i0], p1 = projected[i1];
      if (p0 && p1) this.drawProjectedLine(p0, p1, edgeChar, styles);
    }

    const zbuf = this.grid.zbuf, cells = this.grid.cells;
    for (const sp of projected) {
      if (sp) {
        const { col, row } = sp;
        const depth = sp.depth * 0.9;
        if (col >= 0 && col < this.width && row >= 0 && row < this.height) {
          const idx = row * this.width + col;
          if (depth < zbuf[idx]) {
            zbuf[idx] = depth;
            const cell = cells[idx];
            cell.char = vertexChar;
            cell.style = brightS;
            cell.depth = depth;
          }
        }
      }
    }
  }

  drawHeightmap(mesh: Mesh, ctx: ProjectionContext, shaderChars: string, light: Light, styles: StyleTuple): void {
    this.drawMeshFilled(mesh, ctx, shaderChars, light, styles);
  }

  drawSurfaceDirect(
    surface: SurfaceSampler, ctx: ProjectionContext, light: Light,
    styles: StyleTuple, luminanceRamp = DONUT_LUMINANCE_RAMP,
  ): void {
    const [brightS, primaryS, midS, dimS] = styles;
    const nChars = luminanceRamp.length;
    const w = this.width, h = this.height;
    const maxCol = Math.max(w - 1, 0);
    const maxRow = Math.max(h - 1, 0);

    const { m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15 } = ctx;
    const { nm0, nm1, nm2, nm4, nm5, nm6, nm8, nm9, nm10 } = ctx;
    const ldx = -light.direction.x;
    const ldy = -light.direction.y;
    const ldz = -light.direction.z;
    const lIntensity = light.intensity;
    const lWrap = light.wrap;
    const lAmbient = light.ambient;

    const zbuf = this.grid.zbuf, cells = this.grid.cells;

    for (const { pos, normal } of surface.samples()) {
      const px = pos.x, py = pos.y, pz = pos.z;
      const clipW = m12 * px + m13 * py + m14 * pz + m15;
      if (clipW <= 0.0) continue;

      const invW = 1.0 / clipW;
      const ndcX = (m0 * px + m1 * py + m2 * pz + m3) * invW;
      const ndcY = (m4 * px + m5 * py + m6 * pz + m7) * invW;

      if (ndcX < -1.2 || ndcX > 1.2 || ndcY < -1.2 || ndcY > 1.2) continue;

      const col = ((ndcX * 0.5 + 0.5) * maxCol + 0.5) | 0;
      const row = (((1.0 - ndcY) * 0.5) * maxRow + 0.5) | 0;
      if (col < 0 || col >= w || row < 0 || row >= h) continue;

      const ndcZ = (m8 * px + m9 * py + m10 * pz + m11) * invW;
      let depth = (ndcZ + 1.0) * 0.5;
      if (depth < 0.0) depth = 0.0;
      else if (depth > 1.0) depth = 1.0;

      const idx = row * w + col;
      if (depth >= zbuf[idx]) continue;

      const nx = normal.x, ny = normal.y, nz = normal.z;
      let wnx = nm0 * nx + nm1 * ny + nm2 * nz;
      let wny = nm4 * nx + nm5 * ny + nm6 * nz;
      let wnz = nm8 * nx + nm9 * ny + nm10 * nz;
      const invLenSq = wnx * wnx + wny * wny + wnz * wnz;
      if (invLenSq > 1e-20) {
        const il = 1.0 / Math.sqrt(invLenSq);
        wnx *= il; wny *= il; wnz *= il;
      }

      const ndotl = wnx * ldx + wny * ldy + wnz * ldz;
      let brightness: number;
      if (lWrap > 0.0) {
        brightness = (ndotl + lWrap) / (1.0 + lWrap);
      } else {
        brightness = ndotl > 0.0 ? ndotl : 0.0;
      }
      brightness = lAmbient + (1.0 - lAmbient) * brightness * lIntensity;
      if (brightness < 0.0) brightness = 0.0;
      else if (brightness > 1.0) brightness = 1.0;

      let charIdx = (brightness * (nChars - 1)) | 0;
      if (charIdx < 0) charIdx = 0;
      else if (charIdx >= nChars) charIdx = nChars - 1;
      const ch = luminanceRamp[charIdx];
      if (ch === ' ') continue;

      let style: string;
      if (brightness > STYLE_BRIGHT_CUTOFF) style = brightS;
      else if (brightness > STYLE_PRIMARY_CUTOFF) style = primaryS;
      else if (brightness > STYLE_MID_CUTOFF) style = midS;
      else style = dimS;

      zbuf[idx] = depth;
      const cell = cells[idx];
      cell.char = ch;
      cell.style = style;
      cell.depth = depth;
    }
  }

  overlay(other: CharGrid): void {
    for (let i = 0; i < other.cells.length; i++) {
      const cell = other.cells[i];
      if (cell.char !== ' ' && cell.depth < this.grid.zbuf[i]) {
        this.grid.cells[i] = cell;
        this.grid.zbuf[i] = cell.depth;
      }
    }
  }
}
