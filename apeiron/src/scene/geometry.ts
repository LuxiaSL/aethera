import { Vec3 } from '../math/vec';

export class Mesh {
  vertices: Vec3[] = [];
  edges: [number, number][] = [];
  faces: number[][] = [];
  normals: Vec3[] = [];
  vertexNormals: Vec3[] = [];

  computeNormals(): void {
    this.normals = [];
    for (const face of this.faces) {
      if (face.length < 3) {
        this.normals.push(new Vec3(0, 1, 0));
        continue;
      }
      const v0 = this.vertices[face[0]];
      const v1 = this.vertices[face[1]];
      const v2 = this.vertices[face[2]];
      const e1 = v1.sub(v0);
      const e2 = v2.sub(v0);
      this.normals.push(e1.cross(e2).normalized());
    }

    const nVerts = this.vertices.length;
    const accum: Vec3[] = [];
    for (let i = 0; i < nVerts; i++) accum.push(new Vec3(0, 0, 0));
    for (let fi = 0; fi < this.faces.length; fi++) {
      const fn = this.normals[fi];
      for (const vi of this.faces[fi]) {
        if (vi < nVerts) accum[vi] = accum[vi].add(fn);
      }
    }
    this.vertexNormals = accum.map(a => a.normalized());
  }

  computeEdgesFromFaces(): void {
    const edgeSet = new Set<string>();
    const edges: [number, number][] = [];
    for (const face of this.faces) {
      const n = face.length;
      for (let i = 0; i < n; i++) {
        const a = face[i], b = face[(i + 1) % n];
        const key = a < b ? `${a},${b}` : `${b},${a}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push(a < b ? [a, b] : [b, a]);
        }
      }
    }
    this.edges = edges;
  }

  translate(offset: Vec3): Mesh {
    const m = new Mesh();
    m.vertices = this.vertices.map(v => v.add(offset));
    m.edges = this.edges.map(e => [...e] as [number, number]);
    m.faces = this.faces.map(f => [...f]);
    m.normals = [...this.normals];
    return m;
  }

  scaleUniform(factor: number): Mesh {
    const m = new Mesh();
    m.vertices = this.vertices.map(v => v.scale(factor));
    m.edges = this.edges.map(e => [...e] as [number, number]);
    m.faces = this.faces.map(f => [...f]);
    m.normals = [...this.normals];
    return m;
  }

  centroid(): Vec3 {
    if (this.vertices.length === 0) return new Vec3(0, 0, 0);
    let sx = 0, sy = 0, sz = 0;
    for (const v of this.vertices) { sx += v.x; sy += v.y; sz += v.z; }
    const n = this.vertices.length;
    return new Vec3(sx / n, sy / n, sz / n);
  }

  boundingRadius(): number {
    let max = 0;
    for (const v of this.vertices) {
      const l = v.length();
      if (l > max) max = l;
    }
    return max;
  }
}

export class PointCloud {
  points: Vec3[] = [];
  brightness: number[] = [];
  normScale = 1.0;

  add(point: Vec3, bright = 1.0): void {
    this.points.push(point);
    this.brightness.push(bright);
  }

  trim(maxPoints: number): void {
    if (this.points.length > maxPoints) {
      const excess = this.points.length - maxPoints;
      this.points.splice(0, excess);
      this.brightness.splice(0, excess);
    }
  }

  get count(): number { return this.points.length; }
}

export class VoxelGrid {
  cells: boolean[];

  constructor(
    public sizeX: number,
    public sizeY: number,
    public sizeZ: number,
    public spacing: number = 0.3
  ) {
    this.cells = new Array(sizeX * sizeY * sizeZ).fill(true);
  }

  private idx(x: number, y: number, z: number): number {
    return x + y * this.sizeX + z * this.sizeX * this.sizeY;
  }

  get(x: number, y: number, z: number): boolean {
    if (x >= 0 && x < this.sizeX && y >= 0 && y < this.sizeY && z >= 0 && z < this.sizeZ) {
      return this.cells[this.idx(x, y, z)];
    }
    return false;
  }

  set(x: number, y: number, z: number, alive: boolean): void {
    if (x >= 0 && x < this.sizeX && y >= 0 && y < this.sizeY && z >= 0 && z < this.sizeZ) {
      this.cells[this.idx(x, y, z)] = alive;
    }
  }

  aliveCount(): number { return this.cells.filter(Boolean).length; }
  totalCount(): number { return this.sizeX * this.sizeY * this.sizeZ; }
  fillRatio(): number { const t = this.totalCount(); return t === 0 ? 0 : this.aliveCount() / t; }

  centerOffset(): Vec3 {
    return new Vec3(
      -this.sizeX * this.spacing / 2.0,
      -this.sizeY * this.spacing / 2.0,
      -this.sizeZ * this.spacing / 2.0,
    );
  }

  cellCenter(x: number, y: number, z: number): Vec3 {
    const off = this.centerOffset();
    return new Vec3(
      (x + 0.5) * this.spacing + off.x,
      (y + 0.5) * this.spacing + off.y,
      (z + 0.5) * this.spacing + off.z,
    );
  }
}

export class HeightMap {
  heights: number[];
  private meshCache: Mesh | null = null;

  constructor(
    public width: number,
    public depth: number,
    public spacing: number = 0.2,
  ) {
    this.heights = new Array(width * depth).fill(0);
  }

  get(x: number, z: number): number {
    if (x >= 0 && x < this.width && z >= 0 && z < this.depth) {
      return this.heights[x + z * this.width];
    }
    return 0;
  }

  set(x: number, z: number, h: number): void {
    if (x >= 0 && x < this.width && z >= 0 && z < this.depth) {
      this.heights[x + z * this.width] = h;
    }
  }

  toMesh(): Mesh {
    if (!this.meshCache) {
      this.meshCache = this.buildMeshCache();
    }
    this.updateMesh(this.meshCache);
    return this.meshCache;
  }

  private buildMeshCache(): Mesh {
    const cx = (this.width - 1) * this.spacing / 2.0;
    const cz = (this.depth - 1) * this.spacing / 2.0;

    const mesh = new Mesh();
    for (let z = 0; z < this.depth; z++) {
      const pz = z * this.spacing - cz;
      const base = z * this.width;
      for (let x = 0; x < this.width; x++) {
        const px = x * this.spacing - cx;
        mesh.vertices.push(new Vec3(px, this.heights[base + x], pz));
      }
    }

    for (let z = 0; z < this.depth - 1; z++) {
      const row = z * this.width;
      const nextRow = row + this.width;
      for (let x = 0; x < this.width - 1; x++) {
        const i00 = row + x, i10 = i00 + 1;
        const i01 = nextRow + x, i11 = i01 + 1;
        mesh.faces.push([i00, i10, i11]);
        mesh.faces.push([i00, i11, i01]);
      }
    }

    mesh.vertexNormals = mesh.vertices.map(() => new Vec3(0, 1, 0));
    return mesh;
  }

  private updateMesh(mesh: Mesh): void {
    for (let i = 0; i < mesh.vertices.length; i++) {
      mesh.vertices[i].y = this.heights[i];
    }
    this.updateVertexNormals(mesh);
  }

  private updateVertexNormals(mesh: Mesh): void {
    const { width, depth, spacing, heights } = this;
    if (width === 0 || depth === 0) return;

    while (mesh.vertexNormals.length < mesh.vertices.length) {
      mesh.vertexNormals.push(new Vec3(0, 1, 0));
    }

    const inv2s = 1.0 / Math.max(spacing * 2.0, 1e-9);

    for (let z = 0; z < depth; z++) {
      const row = z * width;
      const prevRow = Math.max(z - 1, 0) * width;
      const nextRow = Math.min(z + 1, depth - 1) * width;
      for (let x = 0; x < width; x++) {
        const idx = row + x;
        const left = heights[row + (x > 0 ? x - 1 : 0)];
        const right = heights[row + (x + 1 < width ? x + 1 : width - 1)];
        const down = heights[prevRow + x];
        const up = heights[nextRow + x];

        const nx = (right - left) * inv2s;
        const ny = -1.0;
        const nz = (up - down) * inv2s;
        const invLen = 1.0 / Math.sqrt(nx * nx + ny * ny + nz * nz);

        const normal = mesh.vertexNormals[idx];
        normal.x = nx * invLen;
        normal.y = ny * invLen;
        normal.z = nz * invLen;
      }
    }
  }
}

// Perlin noise
const PERM: number[] = [];
for (let i = 0; i < 256; i++) PERM.push(i);
let seed = 42;
for (let i = 255; i > 0; i--) {
  seed = (seed * 1103515245 + 12345) & 0x7FFFFFFF;
  const j = seed % (i + 1);
  [PERM[i], PERM[j]] = [PERM[j], PERM[i]];
}
for (let i = 0; i < 256; i++) PERM.push(PERM[i]);

const GRAD3: [number, number, number][] = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1],
];

function fade(t: number): number {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

function grad3(h: number, x: number, y: number, z: number): number {
  const g = GRAD3[h % 12];
  return g[0] * x + g[1] * y + g[2] * z;
}

export function noise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const zi = Math.floor(z) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const zf = z - Math.floor(z);

  const u = fade(xf), v = fade(yf), w = fade(zf);
  const p = PERM;

  const aaa = p[p[p[xi] + yi] + zi];
  const aba = p[p[p[xi] + yi + 1] + zi];
  const aab = p[p[p[xi] + yi] + zi + 1];
  const abb = p[p[p[xi] + yi + 1] + zi + 1];
  const baa = p[p[p[xi + 1] + yi] + zi];
  const bba = p[p[p[xi + 1] + yi + 1] + zi];
  const bab = p[p[p[xi + 1] + yi] + zi + 1];
  const bbb = p[p[p[xi + 1] + yi + 1] + zi + 1];

  const x1a = grad3(aaa, xf, yf, zf) + (grad3(baa, xf - 1, yf, zf) - grad3(aaa, xf, yf, zf)) * u;
  const x2a = grad3(aba, xf, yf - 1, zf) + (grad3(bba, xf - 1, yf - 1, zf) - grad3(aba, xf, yf - 1, zf)) * u;
  const y1 = x1a + (x2a - x1a) * v;

  const x1b = grad3(aab, xf, yf, zf - 1) + (grad3(bab, xf - 1, yf, zf - 1) - grad3(aab, xf, yf, zf - 1)) * u;
  const x2b = grad3(abb, xf, yf - 1, zf - 1) + (grad3(bbb, xf - 1, yf - 1, zf - 1) - grad3(abb, xf, yf - 1, zf - 1)) * u;
  const y2 = x1b + (x2b - x1b) * v;

  return y1 + (y2 - y1) * w;
}

export function fbm(x: number, y: number, z: number, octaves = 4, lacunarity = 2.0, gain = 0.5): number {
  let value = 0, amplitude = 1, frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise3(x * frequency, y * frequency, z * frequency);
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return value;
}
