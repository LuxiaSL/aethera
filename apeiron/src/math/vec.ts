export class Vec3 {
  constructor(
    public x: number,
    public y: number,
    public z: number
  ) {}

  add(o: Vec3): Vec3 { return new Vec3(this.x + o.x, this.y + o.y, this.z + o.z); }
  sub(o: Vec3): Vec3 { return new Vec3(this.x - o.x, this.y - o.y, this.z - o.z); }
  scale(s: number): Vec3 { return new Vec3(this.x * s, this.y * s, this.z * s); }
  neg(): Vec3 { return new Vec3(-this.x, -this.y, -this.z); }

  div(s: number): Vec3 {
    const inv = 1.0 / s;
    return new Vec3(this.x * inv, this.y * inv, this.z * inv);
  }

  dot(o: Vec3): number { return this.x * o.x + this.y * o.y + this.z * o.z; }

  cross(o: Vec3): Vec3 {
    return new Vec3(
      this.y * o.z - this.z * o.y,
      this.z * o.x - this.x * o.z,
      this.x * o.y - this.y * o.x,
    );
  }

  lengthSq(): number { return this.x * this.x + this.y * this.y + this.z * this.z; }
  length(): number { return Math.sqrt(this.lengthSq()); }

  normalized(): Vec3 {
    const sq = this.lengthSq();
    if (sq < 1e-20) return new Vec3(0, 0, 0);
    const inv = 1.0 / Math.sqrt(sq);
    return new Vec3(this.x * inv, this.y * inv, this.z * inv);
  }

  lerp(o: Vec3, t: number): Vec3 {
    const u = 1.0 - t;
    return new Vec3(this.x * u + o.x * t, this.y * u + o.y * t, this.z * u + o.z * t);
  }

  toVec4(w = 1.0): Vec4 { return new Vec4(this.x, this.y, this.z, w); }
}

export class Vec4 {
  constructor(
    public x: number,
    public y: number,
    public z: number,
    public w: number
  ) {}

  add(o: Vec4): Vec4 { return new Vec4(this.x + o.x, this.y + o.y, this.z + o.z, this.w + o.w); }
  sub(o: Vec4): Vec4 { return new Vec4(this.x - o.x, this.y - o.y, this.z - o.z, this.w - o.w); }
  scale(s: number): Vec4 { return new Vec4(this.x * s, this.y * s, this.z * s, this.w * s); }
  neg(): Vec4 { return new Vec4(-this.x, -this.y, -this.z, -this.w); }
  dot(o: Vec4): number { return this.x * o.x + this.y * o.y + this.z * o.z + this.w * o.w; }
  length(): number { return Math.sqrt(this.dot(this)); }

  normalized(): Vec4 {
    const sq = this.dot(this);
    if (sq < 1e-20) return new Vec4(0, 0, 0, 0);
    const inv = 1.0 / Math.sqrt(sq);
    return new Vec4(this.x * inv, this.y * inv, this.z * inv, this.w * inv);
  }

  lerp(o: Vec4, t: number): Vec4 {
    const u = 1.0 - t;
    return new Vec4(
      this.x * u + o.x * t, this.y * u + o.y * t,
      this.z * u + o.z * t, this.w * u + o.w * t,
    );
  }

  toVec3(): Vec3 { return new Vec3(this.x, this.y, this.z); }

  perspectiveDivide(): Vec3 {
    if (Math.abs(this.w) < 1e-10) return new Vec3(0, 0, 0);
    const inv = 1.0 / this.w;
    return new Vec3(this.x * inv, this.y * inv, this.z * inv);
  }
}

export const ORIGIN = new Vec3(0, 0, 0);
export const UP = new Vec3(0, 1, 0);
