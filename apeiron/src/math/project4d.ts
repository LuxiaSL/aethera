import { Vec3, Vec4 } from './vec';
import { fastSin, fastCos } from './lut';

export function rotate4d(v: Vec4, angleXW: number, angleYZ: number): Vec4 {
  const sxw = fastSin(angleXW), cxw = fastCos(angleXW);
  const syz = fastSin(angleYZ), cyz = fastCos(angleYZ);
  const x1 = v.x * cxw - v.w * sxw;
  const w1 = v.x * sxw + v.w * cxw;
  const y1 = v.y * cyz - v.z * syz;
  const z1 = v.y * syz + v.z * cyz;
  return new Vec4(x1, y1, z1, w1);
}

export function project4dTo3d(v: Vec4, distance = 2.5): Vec3 {
  let denom = distance - v.w;
  if (Math.abs(denom) < 1e-10) denom = 1e-10;
  const factor = 1.0 / denom;
  return new Vec3(v.x * factor, v.y * factor, v.z * factor);
}
