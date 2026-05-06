import { Vec3 } from '../math/vec';
import type { SurfaceSample, SurfaceSampler } from './rasterizer';

export class TorusSampler implements SurfaceSampler {
  private _samples: SurfaceSample[];

  constructor(
    public R: number = 1.0,
    public r: number = 0.5,
    public thetaStep: number = 0.09,
    public phiStep: number = 0.03,
  ) {
    this._samples = this.buildSamples();
  }

  private buildSamples(): SurfaceSample[] {
    const samples: SurfaceSample[] = [];
    const TWO_PI = 2.0 * Math.PI;
    for (let theta = 0; theta < TWO_PI; theta += this.thetaStep) {
      const cosT = Math.cos(theta), sinT = Math.sin(theta);
      for (let phi = 0; phi < TWO_PI; phi += this.phiStep) {
        const cosP = Math.cos(phi), sinP = Math.sin(phi);
        const ring = this.R + this.r * cosT;
        samples.push({
          pos: new Vec3(ring * cosP, this.r * sinT, ring * sinP),
          normal: new Vec3(cosT * cosP, sinT, cosT * sinP),
        });
      }
    }
    return samples;
  }

  samples(): SurfaceSample[] { return this._samples; }
}

export class SphereSampler implements SurfaceSampler {
  private _samples: SurfaceSample[];

  constructor(
    public radius: number = 1.0,
    public thetaStep: number = 0.07,
    public phiStep: number = 0.04,
  ) {
    this._samples = this.buildSamples();
  }

  private buildSamples(): SurfaceSample[] {
    const samples: SurfaceSample[] = [];
    const PI = Math.PI, TWO_PI = 2.0 * PI;
    for (let theta = 0; theta < PI; theta += this.thetaStep) {
      const cosT = Math.cos(theta), sinT = Math.sin(theta);
      for (let phi = 0; phi < TWO_PI; phi += this.phiStep) {
        const cosP = Math.cos(phi), sinP = Math.sin(phi);
        const nx = sinT * cosP, ny = cosT, nz = sinT * sinP;
        samples.push({
          pos: new Vec3(nx * this.radius, ny * this.radius, nz * this.radius),
          normal: new Vec3(nx, ny, nz),
        });
      }
    }
    return samples;
  }

  samples(): SurfaceSample[] { return this._samples; }
}

export class MobiusSampler implements SurfaceSampler {
  private _samples: SurfaceSample[];
  private _scale: number;

  constructor(
    public uStep: number = 0.05,
    public vSteps: number = 14,
    public vMin: number = -0.4,
    public vMax: number = 0.4,
  ) {
    this._scale = this.computeScale();
    this._samples = this.buildSamples();
  }

  private rawPoint(u: number, v: number): Vec3 {
    const halfV = v / 2.0;
    const cosU = Math.cos(u), sinU = Math.sin(u);
    const cosU2 = Math.cos(u / 2.0), sinU2 = Math.sin(u / 2.0);
    return new Vec3(
      (1.0 + halfV * cosU2) * cosU,
      (1.0 + halfV * cosU2) * sinU,
      halfV * sinU2,
    );
  }

  private computeScale(): number {
    let maxR = 0;
    const TWO_PI = 2.0 * Math.PI;
    const vRange = this.vMax - this.vMin;
    for (let u = 0; u < TWO_PI; u += this.uStep) {
      for (let j = 0; j <= this.vSteps; j++) {
        const v = this.vMin + vRange * j / this.vSteps;
        const r = this.rawPoint(u, v).length();
        if (r > maxR) maxR = r;
      }
    }
    return maxR > 1e-10 ? 1.0 / maxR : 1.0;
  }

  private buildSamples(): SurfaceSample[] {
    const samples: SurfaceSample[] = [];
    const TWO_PI = 2.0 * Math.PI;
    const eps = 0.01;
    const vRange = this.vMax - this.vMin;

    for (let u = 0; u < TWO_PI; u += this.uStep) {
      for (let j = 0; j <= this.vSteps; j++) {
        const v = this.vMin + vRange * j / this.vSteps;
        const pt = this.rawPoint(u, v).scale(this._scale);
        const du = this.rawPoint(u + eps, v).sub(this.rawPoint(u - eps, v));
        const dv = this.rawPoint(u, v + eps).sub(this.rawPoint(u, v - eps));
        const normal = du.cross(dv).normalized();
        samples.push({ pos: pt, normal });
      }
    }
    return samples;
  }

  samples(): SurfaceSample[] { return this._samples; }
}
