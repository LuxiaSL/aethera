import { Vec3 } from '../math/vec';
import { Mat4 } from '../math/mat4';
import { clamp } from '../math/lut';

export const CHAR_ASPECT = 0.5;

export interface ScreenPoint {
  col: number;
  row: number;
  depth: number;
}

export class Camera {
  constructor(
    public position: Vec3,
    public target: Vec3,
    public fov: number = 1.2,
    public near: number = 0.1,
    public far: number = 50.0
  ) {}

  viewMatrix(): Mat4 {
    return Mat4.lookAt(this.position, this.target, new Vec3(0, 1, 0));
  }

  projectionMatrix(width: number, height: number): Mat4 {
    const charAspect = (width / Math.max(height, 1)) * CHAR_ASPECT;
    return Mat4.perspective(this.fov, charAspect, this.near, this.far);
  }
}

export class ProjectionContext {
  halfW: number;
  halfH: number;
  maxCol: number;
  maxRow: number;
  clipMargin = 1.25;
  unclampedMargin = 2.0;
  depthMargin = 1.05;

  m0: number; m1: number; m2: number; m3: number;
  m4: number; m5: number; m6: number; m7: number;
  m8: number; m9: number; m10: number; m11: number;
  m12: number; m13: number; m14: number; m15: number;

  nm0: number; nm1: number; nm2: number;
  nm4: number; nm5: number; nm6: number;
  nm8: number; nm9: number; nm10: number;

  constructor(
    public model: Mat4,
    public view: Mat4,
    public projection: Mat4,
    public mvp: Mat4,
    public width: number,
    public height: number
  ) {
    this.halfW = width / 2.0;
    this.halfH = height / 2.0;
    this.maxCol = Math.max(width - 1, 0);
    this.maxRow = Math.max(height - 1, 0);
    const mv = mvp.m;
    this.m0 = mv[0]; this.m1 = mv[1]; this.m2 = mv[2]; this.m3 = mv[3];
    this.m4 = mv[4]; this.m5 = mv[5]; this.m6 = mv[6]; this.m7 = mv[7];
    this.m8 = mv[8]; this.m9 = mv[9]; this.m10 = mv[10]; this.m11 = mv[11];
    this.m12 = mv[12]; this.m13 = mv[13]; this.m14 = mv[14]; this.m15 = mv[15];
    const mo = model.m;
    this.nm0 = mo[0]; this.nm1 = mo[1]; this.nm2 = mo[2];
    this.nm4 = mo[4]; this.nm5 = mo[5]; this.nm6 = mo[6];
    this.nm8 = mo[8]; this.nm9 = mo[9]; this.nm10 = mo[10];
  }

  static build(model: Mat4, camera: Camera, width: number, height: number): ProjectionContext {
    const view = camera.viewMatrix();
    const proj = camera.projectionMatrix(width, height);
    const mvp = proj.mulMat(view).mulMat(model);
    return new ProjectionContext(model, view, proj, mvp, width, height);
  }

  projectVertex(v: Vec3): ScreenPoint | null {
    const { x: vx, y: vy, z: vz } = v;
    const clipX = this.m0 * vx + this.m1 * vy + this.m2 * vz + this.m3;
    const clipY = this.m4 * vx + this.m5 * vy + this.m6 * vz + this.m7;
    const clipZ = this.m8 * vx + this.m9 * vy + this.m10 * vz + this.m11;
    const clipW = this.m12 * vx + this.m13 * vy + this.m14 * vz + this.m15;

    if (clipW <= 0.0) return null;

    const invW = 1.0 / clipW;
    const ndcX = clipX * invW;
    const ndcY = clipY * invW;
    const ndcZ = clipZ * invW;

    const margin = this.clipMargin;
    if (Math.abs(ndcX) > margin || Math.abs(ndcY) > margin || Math.abs(ndcZ) > this.depthMargin) {
      return null;
    }

    const col = ((ndcX * 0.5 + 0.5) * this.maxCol + 0.5) | 0;
    const row = (((1.0 - ndcY) * 0.5) * this.maxRow + 0.5) | 0;
    const depth = clamp((ndcZ + 1.0) * 0.5, 0.0, 1.0);

    return { col, row, depth };
  }

  projectVertexUnclamped(v: Vec3): [number, number, number] | null {
    const { x: vx, y: vy, z: vz } = v;
    const clipX = this.m0 * vx + this.m1 * vy + this.m2 * vz + this.m3;
    const clipY = this.m4 * vx + this.m5 * vy + this.m6 * vz + this.m7;
    const clipZ = this.m8 * vx + this.m9 * vy + this.m10 * vz + this.m11;
    const clipW = this.m12 * vx + this.m13 * vy + this.m14 * vz + this.m15;

    if (clipW <= 0.0) return null;

    const invW = 1.0 / clipW;
    const ndcX = clipX * invW;
    const ndcY = clipY * invW;
    const ndcZ = clipZ * invW;

    if (Math.abs(ndcX) > this.unclampedMargin || Math.abs(ndcY) > this.unclampedMargin || Math.abs(ndcZ) > this.depthMargin) {
      return null;
    }

    const col = (ndcX * 0.5 + 0.5) * this.maxCol;
    const row = ((1.0 - ndcY) * 0.5) * this.maxRow;
    const depth = clamp((ndcZ + 1.0) * 0.5, 0.0, 1.0);

    return [col, row, depth];
  }

  transformNormal(n: Vec3): Vec3 {
    const { x: nx, y: ny, z: nz } = n;
    const tx = this.nm0 * nx + this.nm1 * ny + this.nm2 * nz;
    const ty = this.nm4 * nx + this.nm5 * ny + this.nm6 * nz;
    const tz = this.nm8 * nx + this.nm9 * ny + this.nm10 * nz;
    const lenSq = tx * tx + ty * ty + tz * tz;
    if (lenSq < 1e-20) return new Vec3(0, 0, 0);
    const invLen = 1.0 / Math.sqrt(lenSq);
    return new Vec3(tx * invLen, ty * invLen, tz * invLen);
  }
}

export function edgeFunction(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): number {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}
