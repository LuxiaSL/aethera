import { Vec3, Vec4 } from '../math/vec';
import { Mesh, PointCloud, VoxelGrid, HeightMap, noise3, fbm } from './geometry';

export function makeIcosahedron(subdivisions = 0): Mesh {
  const t = (1.0 + Math.sqrt(5.0)) / 2.0;
  const mesh = new Mesh();

  const raw: [number, number, number][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  for (const [x, y, z] of raw) {
    mesh.vertices.push(new Vec3(x, y, z).normalized());
  }

  mesh.faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];

  for (let i = 0; i < subdivisions; i++) {
    subdivide(mesh);
  }

  mesh.computeNormals();
  return mesh;
}

function subdivide(mesh: Mesh): void {
  const midCache = new Map<string, number>();
  const newFaces: number[][] = [];

  function getMidpoint(a: number, b: number): number {
    const key = a < b ? `${a},${b}` : `${b},${a}`;
    const cached = midCache.get(key);
    if (cached !== undefined) return cached;
    const va = mesh.vertices[a], vb = mesh.vertices[b];
    const mid = va.add(vb).scale(0.5).normalized();
    const idx = mesh.vertices.length;
    mesh.vertices.push(mid);
    midCache.set(key, idx);
    return idx;
  }

  for (const face of mesh.faces) {
    const [a, b, c] = face;
    const ab = getMidpoint(a, b);
    const bc = getMidpoint(b, c);
    const ca = getMidpoint(c, a);
    newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
  }
  mesh.faces = newFaces;
}

function makeCube(radius = 1.0): Mesh {
  const s = radius / Math.sqrt(3);
  const mesh = new Mesh();
  mesh.vertices = [
    new Vec3(-s, -s, -s), new Vec3(s, -s, -s), new Vec3(s, s, -s), new Vec3(-s, s, -s),
    new Vec3(-s, -s, s), new Vec3(s, -s, s), new Vec3(s, s, s), new Vec3(-s, s, s),
  ];
  mesh.faces = [
    [0,1,2,3], [5,4,7,6], [1,5,6,2], [4,0,3,7], [3,2,6,7], [4,5,1,0],
  ];
  mesh.computeNormals();
  return mesh;
}

function makeOctahedron(radius = 1.0): Mesh {
  const mesh = new Mesh();
  mesh.vertices = [
    new Vec3(0, radius, 0), new Vec3(0, -radius, 0),
    new Vec3(radius, 0, 0), new Vec3(-radius, 0, 0),
    new Vec3(0, 0, radius), new Vec3(0, 0, -radius),
  ];
  mesh.faces = [
    [0,4,2], [0,2,5], [0,5,3], [0,3,4],
    [1,2,4], [1,5,2], [1,3,5], [1,4,3],
  ];
  mesh.computeNormals();
  return mesh;
}

function makeSphere(nRings = 7, nSectors = 8, radius = 1.0): Mesh {
  const mesh = new Mesh();
  mesh.vertices.push(new Vec3(0, radius, 0));
  for (let ring = 1; ring < nRings; ring++) {
    const phi = (Math.PI * ring) / nRings;
    const sp = Math.sin(phi), cp = Math.cos(phi);
    for (let sec = 0; sec < nSectors; sec++) {
      const theta = (2 * Math.PI * sec) / nSectors;
      mesh.vertices.push(new Vec3(radius * sp * Math.cos(theta), radius * cp, radius * sp * Math.sin(theta)));
    }
  }
  mesh.vertices.push(new Vec3(0, -radius, 0));

  for (let sec = 0; sec < nSectors; sec++) {
    mesh.faces.push([0, 1 + sec, 1 + (sec + 1) % nSectors]);
  }
  for (let ring = 0; ring < nRings - 2; ring++) {
    const base = 1 + ring * nSectors;
    const next = base + nSectors;
    for (let sec = 0; sec < nSectors; sec++) {
      const s1 = (sec + 1) % nSectors;
      mesh.faces.push([base + sec, next + sec, next + s1]);
      mesh.faces.push([base + sec, next + s1, base + s1]);
    }
  }
  const bot = mesh.vertices.length - 1;
  const lastRing = 1 + (nRings - 2) * nSectors;
  for (let sec = 0; sec < nSectors; sec++) {
    mesh.faces.push([bot, lastRing + (sec + 1) % nSectors, lastRing + sec]);
  }
  mesh.computeNormals();
  return mesh;
}

export function makeTesseract(): { vertices: Vec4[]; edges: [number, number][] } {
  const vertices: Vec4[] = [];
  const s = 1.0;
  for (let i = 0; i < 16; i++) {
    vertices.push(new Vec4(
      (i & 1) ? s : -s,
      (i & 2) ? s : -s,
      (i & 4) ? s : -s,
      (i & 8) ? s : -s,
    ));
  }
  const edges: [number, number][] = [];
  for (let i = 0; i < 16; i++) {
    for (let bit = 0; bit < 4; bit++) {
      const j = i ^ (1 << bit);
      if (j > i) edges.push([i, j]);
    }
  }
  return { vertices, edges };
}

export function makeNoiseSurface(width = 24, depth = 24, scale = 0.3, amplitude = 0.4): HeightMap {
  const hm = new HeightMap(width, depth, 0.2);
  for (let z = 0; z < depth; z++) {
    for (let x = 0; x < width; x++) {
      hm.set(x, z, fbm(x * scale, 0, z * scale) * amplitude);
    }
  }
  return hm;
}

export function makeTerrain(width = 32, depth = 32, scale = 0.15, amplitude = 0.8): HeightMap {
  const hm = new HeightMap(width, depth, 0.2);
  for (let z = 0; z < depth; z++) {
    for (let x = 0; x < width; x++) {
      hm.set(x, z, fbm(x * scale, 0, z * scale, 6, 2.2, 0.45) * amplitude);
    }
  }
  return hm;
}

export function makeParticleNebula(count = 300, spread = 1.2): PointCloud {
  const cloud = new PointCloud();
  const sigma = spread * 0.4;
  const rng = mulberry32(42);
  for (let i = 0; i < count; i++) {
    const x = gaussRng(rng) * sigma;
    const y = gaussRng(rng) * sigma;
    const z = gaussRng(rng) * sigma;
    const dist = Math.sqrt(x * x + y * y + z * z);
    cloud.add(new Vec3(x, y, z), Math.max(0.05, 1.0 - dist / (spread * 1.5)));
  }
  return cloud;
}

export function makeLorenzAttractor(): PointCloud {
  const cloud = new PointCloud();
  let x = 0.1, y = 0, z = 0;
  const dt = 0.005;
  const sigma = 10, rho = 28, beta = 8 / 3;
  let maxR = 0;
  const pts: [number, number, number][] = [];
  for (let i = 0; i < 5000; i++) {
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    x += dx * dt; y += dy * dt; z += dz * dt;
    if (i > 100) {
      pts.push([x, y, z]);
      const r = Math.sqrt(x * x + y * y + z * z);
      if (r > maxR) maxR = r;
    }
  }
  const ns = maxR > 0 ? 1.5 / maxR : 0.04;
  cloud.normScale = ns;
  for (let i = 0; i < pts.length; i++) {
    const [px, py, pz] = pts[i];
    cloud.add(new Vec3(px * ns, py * ns, pz * ns), 0.1 + (i / pts.length) * 0.9);
  }
  return cloud;
}

export function makeVoxelGrid(): VoxelGrid {
  const g = new VoxelGrid(8, 6, 8, 0.3);
  const rng = mulberry32(42);
  for (let z = 0; z < 8; z++) {
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 8; x++) {
        g.set(x, y, z, rng() < 0.7);
      }
    }
  }
  return g;
}

export function makeWireframeOrganism(): Mesh {
  const mesh = makeIcosahedron(2);
  for (let i = 0; i < mesh.vertices.length; i++) {
    const v = mesh.vertices[i];
    const offset = noise3(v.x * 3, v.y * 3, v.z * 3) * 0.2;
    mesh.vertices[i] = v.scale(1.0 + offset);
  }
  mesh.computeEdgesFromFaces();
  return mesh;
}

export function makeCorridor(): Mesh {
  const mesh = new Mesh();
  const frames = 12;
  const halfW = 1.0, halfH = 0.7;
  const shrink = 0.92;
  const spacing = 0.3;
  for (let i = 0; i < frames; i++) {
    const z = -(i * spacing) + (frames * spacing) / 2;
    const s = Math.pow(shrink, i);
    const w = halfW * s, h = halfH * s;
    mesh.vertices.push(
      new Vec3(-w, -h, z), new Vec3(w, -h, z),
      new Vec3(w, h, z), new Vec3(-w, h, z),
    );
  }
  for (let i = 0; i < frames; i++) {
    const b = i * 4;
    mesh.edges.push([b, b + 1], [b + 1, b + 2], [b + 2, b + 3], [b + 3, b]);
    if (i < frames - 1) {
      const nb = b + 4;
      mesh.edges.push([b, nb], [b + 1, nb + 1], [b + 2, nb + 2], [b + 3, nb + 3]);
    }
  }
  return mesh;
}

export function makeFragmentingSolid(): { mesh: Mesh; groups: number[][] } {
  const mesh = makeIcosahedron(2);
  mesh.computeNormals();
  const groups: number[][] = [];
  const groupCount = 8;
  const groupSize = Math.ceil(mesh.faces.length / groupCount);
  for (let i = 0; i < mesh.faces.length; i += groupSize) {
    const g: number[] = [];
    for (let j = i; j < Math.min(i + groupSize, mesh.faces.length); j++) g.push(j);
    groups.push(g);
  }
  return { mesh, groups };
}

export function makeIntersectingSolids(): [Mesh, Mesh] {
  const a = makeCube(1.0);
  const b = makeOctahedron(1.0);
  return [a, b];
}

export function makeSplitMorphPair(): [Mesh, Mesh] {
  const a = makeSphere(7, 8, 1.0);
  const vertCount = a.vertices.length;
  const b = makeIcosahedron(0);
  while (b.vertices.length < vertCount) {
    subdivide(b);
  }
  b.vertices.length = vertCount;
  b.computeNormals();
  return [a, b];
}

export function makeMetaballs(nBlobs = 3, _resolution = 30): Mesh {
  const mesh = makeIcosahedron(2);
  for (let i = 0; i < mesh.vertices.length; i++) {
    const v = mesh.vertices[i];
    let field = 0;
    for (let b = 0; b < nBlobs; b++) {
      const angle = (b / nBlobs) * Math.PI * 2;
      const cx = Math.cos(angle) * 0.5, cy = Math.sin(angle) * 0.5;
      const dx = v.x - cx, dy = v.y - cy, dz = v.z;
      const distSq = dx * dx + dy * dy + dz * dz;
      field += 1.0 / (distSq + 0.01);
    }
    mesh.vertices[i] = v.scale(Math.min(field * 0.3, 1.5));
  }
  mesh.computeNormals();
  return mesh;
}

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussRng(rng: () => number): number {
  const u1 = rng() || 1e-10;
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
