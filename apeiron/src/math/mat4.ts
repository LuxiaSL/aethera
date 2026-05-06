import { Vec3, Vec4 } from './vec';
import { fastSin, fastCos } from './lut';

export class Mat4 {
  constructor(public m: number[]) {}

  static identity(): Mat4 {
    return new Mat4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  static translation(tx: number, ty: number, tz: number): Mat4 {
    return new Mat4([
      1, 0, 0, tx,
      0, 1, 0, ty,
      0, 0, 1, tz,
      0, 0, 0, 1,
    ]);
  }

  static scale(sx: number, sy: number, sz: number): Mat4 {
    return new Mat4([
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1,
    ]);
  }

  static rotationX(angle: number): Mat4 {
    const s = fastSin(angle), c = fastCos(angle);
    return new Mat4([
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1,
    ]);
  }

  static rotationY(angle: number): Mat4 {
    const s = fastSin(angle), c = fastCos(angle);
    return new Mat4([
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1,
    ]);
  }

  static rotationZ(angle: number): Mat4 {
    const s = fastSin(angle), c = fastCos(angle);
    return new Mat4([
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  static perspective(fovY: number, aspect: number, near: number, far: number): Mat4 {
    const f = 1.0 / Math.tan(fovY / 2.0);
    const nf = 1.0 / (near - far);
    return new Mat4([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, 2.0 * far * near * nf,
      0, 0, -1, 0,
    ]);
  }

  static lookAt(eye: Vec3, target: Vec3, up: Vec3): Mat4 {
    const fwd = target.sub(eye).normalized();
    const right = fwd.cross(up).normalized();
    const trueUp = right.cross(fwd);
    return new Mat4([
      right.x, right.y, right.z, -right.dot(eye),
      trueUp.x, trueUp.y, trueUp.z, -trueUp.dot(eye),
      -fwd.x, -fwd.y, -fwd.z, fwd.dot(eye),
      0, 0, 0, 1,
    ]);
  }

  mulMat(other: Mat4): Mat4 {
    const a = this.m, b = other.m;
    const r = new Array<number>(16);
    for (let row = 0; row < 4; row++) {
      const r0 = row * 4;
      const a0 = a[r0], a1 = a[r0 + 1], a2 = a[r0 + 2], a3 = a[r0 + 3];
      for (let col = 0; col < 4; col++) {
        r[r0 + col] = a0 * b[col] + a1 * b[4 + col] + a2 * b[8 + col] + a3 * b[12 + col];
      }
    }
    return new Mat4(r);
  }

  mulVec(v: Vec4): Vec4 {
    const m = this.m;
    return new Vec4(
      m[0] * v.x + m[1] * v.y + m[2] * v.z + m[3] * v.w,
      m[4] * v.x + m[5] * v.y + m[6] * v.z + m[7] * v.w,
      m[8] * v.x + m[9] * v.y + m[10] * v.z + m[11] * v.w,
      m[12] * v.x + m[13] * v.y + m[14] * v.z + m[15] * v.w,
    );
  }

  transformPoint(v: Vec3): Vec3 {
    return this.mulVec(v.toVec4(1.0)).perspectiveDivide();
  }

  transformDirection(v: Vec3): Vec3 {
    return this.mulVec(v.toVec4(0.0)).toVec3();
  }
}
