import { Vec3, Vec4 } from '../math/vec';
import { Mat4 } from '../math/mat4';
import { fastSin } from '../math/lut';
import { smoothstep } from '../math/lut';
import { rotate4d, project4dTo3d } from '../math/project4d';
import { AsciiRasterizer, Light, DEFAULT_LIGHT, DONUT_LUMINANCE_RAMP } from '../render/rasterizer';
import type { StyleTuple, SurfaceSampler } from '../render/rasterizer';
import { applyEffects } from '../fx/postfx';
import { Camera, ProjectionContext } from '../render/transform';
import { Mesh, PointCloud, VoxelGrid, HeightMap, noise3 } from './geometry';
import { TransitionState, TransitionPhase, applyDissolve, applyForm, TransitionStyle } from './transition';

export enum GeomKind {
  MESH_FILLED, MESH_WIREFRAME, POINT_CLOUD, VOXEL_GRID,
  HEIGHTMAP, TESSERACT, DUAL_MESH, SURFACE_DIRECT,
}

export class AnimationState {
  time = 0;
  angleX = 0;
  angleY = 0;
  angleZ = 0;
  angle4dXW = 0;
  angle4dYZ = 0;
  morphT = 0;
  breath = 0;
  phase = 0;
  speedScale = 1.0;

  tick(dt: number): void {
    this.time += dt;
    const sdt = dt * this.speedScale;
    this.angleY += 0.4 * sdt;
    this.angleX += 0.15 * sdt;
    this.angle4dXW += 0.25 * sdt;
    this.angle4dYZ += 0.18 * sdt;
    this.breath = (fastSin(this.time * 1.5) + 1.0) * 0.5;
    this.phase = this.time;
  }
}

interface SceneSnapshot {
  geomKind: GeomKind;
  mesh: Mesh | null;
  meshB: Mesh | null;
  cloud: PointCloud | null;
  voxels: VoxelGrid | null;
  heightmap: HeightMap | null;
  heightmapMesh: Mesh | null;
  shaderChars: string;
  light: Light;
  camera: Camera;
  styles: StyleTuple;
  fragmentGroups: number[][];
  dualMeshMode: string;
  surfaceSampler: SurfaceSampler | null;
}

export class Scene {
  geomKind = GeomKind.MESH_FILLED;
  mesh: Mesh | null = null;
  meshB: Mesh | null = null;
  cloud: PointCloud | null = null;
  voxels: VoxelGrid | null = null;
  heightmap: HeightMap | null = null;
  heightmapMesh: Mesh | null = null;
  surfaceSampler: SurfaceSampler | null = null;

  tesseractVerts: Vec4[] = [];
  tesseractEdges: [number, number][] = [];

  shaderChars = ' .,-~:;=!*#$@';
  light: Light = DEFAULT_LIGHT;
  camera = new Camera(new Vec3(0, 0.3, 2.5), new Vec3(0, 0, 0));
  styles: StyleTuple = ['#00ff00', '#00ff41', '#005500', '#003300'];

  anim = new AnimationState();
  transition = new TransitionState();
  postfxNames: string[] = [];
  particleSystem: { tick(dt: number): void; particles: Array<{ pos: Vec3; brightness: number; char: string }> } | null = null;

  fragmentGroups: number[][] = [];
  dualMeshMode = 'overlay';
  transitionSource: SceneSnapshot | null = null;

  private hmapAccum = 0;
  private voxelTimer = 0;
  private voxelEroding = true;
  private voxelOriginalCells: boolean[] | null = null;
  private fragmentOffsets: Vec3[] | null = null;
  private fragmentTimer = 0;
  private fragmentCycle = 8.0;
  private lorenzState: [number, number, number] | null = null;

  modelMatrix(): Mat4 {
    return Mat4.rotationY(this.anim.angleY).mulMat(Mat4.rotationX(this.anim.angleX));
  }

  clearGeometry(): void {
    this.mesh = null; this.meshB = null;
    this.cloud = null; this.voxels = null;
    this.heightmap = null; this.heightmapMesh = null;
    this.surfaceSampler = null;
    this.fragmentGroups = [];
    this.dualMeshMode = 'overlay';
  }

  render(rast: AsciiRasterizer): void {
    rast.clear();
    const w = rast.width, h = rast.height;

    if (this.transition.active) {
      this.renderTransition(rast, w, h);
    } else {
      this.renderGeometry(rast, w, h);
    }

    this.renderParticles(rast, w, h);
    rast.grid.time = this.anim.time;
    if (this.postfxNames.length > 0) {
      applyEffects(rast.grid, this.postfxNames);
    }
  }

  private renderGeometry(rast: AsciiRasterizer, w: number, h: number): void {
    this.renderGeometryState(rast, w, h, this.geomKind, this.mesh, this.meshB,
      this.cloud, this.voxels, this.heightmap, this.heightmapMesh,
      this.shaderChars, this.light, this.styles, this.camera,
      this.fragmentGroups, this.dualMeshMode, this.surfaceSampler);
  }

  private renderGeometryState(
    rast: AsciiRasterizer, w: number, h: number,
    kind: GeomKind, mesh: Mesh | null, meshB: Mesh | null,
    cloud: PointCloud | null, voxels: VoxelGrid | null,
    heightmap: HeightMap | null, heightmapMesh: Mesh | null,
    shaderChars: string, light: Light, styles: StyleTuple,
    camera: Camera, fragmentGroups: number[][], dualMeshMode: string,
    surfaceSampler: SurfaceSampler | null,
  ): void {
    const model = this.modelMatrix();
    const ctx = ProjectionContext.build(model, camera, w, h);

    switch (kind) {
      case GeomKind.MESH_FILLED: {
        const renderMesh = this.meshForRender(mesh, fragmentGroups);
        if (renderMesh) rast.drawMeshFilled(renderMesh, ctx, shaderChars, light, styles);
        break;
      }
      case GeomKind.MESH_WIREFRAME:
        if (mesh) rast.drawMeshWireframe(mesh, ctx, '·', styles, '•');
        break;
      case GeomKind.POINT_CLOUD:
        if (cloud) rast.drawPoints(cloud, ctx, '·∙•●', styles);
        break;
      case GeomKind.VOXEL_GRID:
        if (voxels) rast.drawVoxels(voxels, ctx, '█', styles);
        break;
      case GeomKind.HEIGHTMAP: {
        let hmMesh = heightmapMesh;
        if (heightmap && !hmMesh) {
          hmMesh = heightmap.toMesh();
          if (heightmap === this.heightmap) this.heightmapMesh = hmMesh;
        }
        if (hmMesh) rast.drawHeightmap(hmMesh, ctx, shaderChars, light, styles);
        break;
      }
      case GeomKind.SURFACE_DIRECT: {
        const sampler = surfaceSampler ?? this.surfaceSampler;
        if (sampler) rast.drawSurfaceDirect(sampler, ctx, light, styles, DONUT_LUMINANCE_RAMP);
        break;
      }
      case GeomKind.TESSERACT:
        this.renderTesseract(rast, w, h);
        break;
      case GeomKind.DUAL_MESH: {
        if (dualMeshMode === 'morph' && mesh && meshB) {
          const morphed = this.morphMesh(mesh, meshB, this.anim.morphT);
          rast.drawMeshFilled(morphed, ctx, shaderChars, light, styles);
        } else if (mesh) {
          rast.drawMeshFilled(mesh, ctx, shaderChars, light, styles);
        }
        if (dualMeshMode !== 'morph' && meshB) {
          const modelB = Mat4.rotationY(this.anim.angleY * 1.618).mulMat(Mat4.rotationX(this.anim.angleX * 0.7));
          const ctxB = ProjectionContext.build(modelB, camera, w, h);
          rast.drawMeshFilled(meshB, ctxB, shaderChars, light, styles);
        }
        break;
      }
    }
  }

  private renderTesseract(rast: AsciiRasterizer, w: number, h: number): void {
    if (this.tesseractVerts.length === 0) return;
    const rotated = this.tesseractVerts.map(v => rotate4d(v, this.anim.angle4dXW, this.anim.angle4dYZ));
    const verts3d = rotated.map(v => project4dTo3d(v, 2.5));
    const scale = Mat4.scale(1.4, 1.4, 1.4);
    const rot = Mat4.rotationY(this.anim.angleY * 0.3);
    const model = rot.mulMat(scale);
    const ctx = ProjectionContext.build(model, this.camera, w, h);
    rast.drawTesseractWireframe(verts3d, this.tesseractEdges, ctx, '─', '●', this.styles);
  }

  private renderTransition(rast: AsciiRasterizer, w: number, h: number): void {
    const phase = this.transition.phase;
    const t = this.transition.phaseProgress();

    if (phase === TransitionPhase.DISSOLVE) {
      if (this.transitionSource) {
        const s = this.transitionSource;
        this.renderGeometryState(rast, w, h, s.geomKind, s.mesh, s.meshB,
          s.cloud, s.voxels, s.heightmap, s.heightmapMesh,
          s.shaderChars, s.light, s.styles, s.camera,
          s.fragmentGroups, s.dualMeshMode, s.surfaceSampler);
      } else {
        this.renderGeometry(rast, w, h);
      }
      applyDissolve(this.transition.dissolveStyle, rast.grid.cells, w, h, t);

    } else if (phase === TransitionPhase.TESSERACT) {
      this.renderTesseract(rast, w, h);
      let blankProb = 0;
      if (t < 0.15) blankProb = 1 - smoothstep(0, 1, t / 0.15);
      else if (t > 0.85) blankProb = smoothstep(0, 1, (t - 0.85) / 0.15);
      if (blankProb > 0) {
        for (const cell of rast.grid.cells) {
          if (cell.char !== ' ' && Math.random() < blankProb) { cell.char = ' '; cell.style = ''; }
        }
      }

    } else if (phase === TransitionPhase.FORM) {
      this.renderGeometry(rast, w, h);
      applyForm(this.transition.formStyle, rast.grid.cells, w, h, t);
    }
  }

  private renderParticles(rast: AsciiRasterizer, w: number, h: number): void {
    if (!this.particleSystem) return;
    const model = Mat4.identity();
    const ctx = ProjectionContext.build(model, this.camera, w, h);
    const [, primaryS, , dimS] = this.styles;
    for (const p of this.particleSystem.particles) {
      const sp = ctx.projectVertex(p.pos);
      if (!sp) continue;
      const adjustedDepth = Math.min(sp.depth + 0.1, 1.0);
      const style = p.brightness < 0.5 ? dimS : primaryS;
      rast.grid.write(sp.col, sp.row, p.char, style, adjustedDepth);
    }
  }

  tick(dt: number): void {
    const wasTransitioning = this.transition.active;
    this.anim.tick(dt);
    this.anim.morphT = 0.5 + 0.5 * fastSin(this.anim.time * 0.7);

    if (this.transition.active) {
      this.transition.tick();
      if (wasTransitioning && !this.transition.active) {
        this.transitionSource = null;
      }
    }

    if (this.particleSystem) {
      try { this.particleSystem.tick(dt); } catch { /* ignore */ }
    }

    if (this.geomKind === GeomKind.HEIGHTMAP) this.animateHeightmap(dt);
    else if (this.geomKind === GeomKind.VOXEL_GRID) this.animateVoxels(dt);
    else if (this.geomKind === GeomKind.POINT_CLOUD && this.cloud) this.animateCloud(dt);
    if (this.fragmentGroups.length > 0 && this.mesh) this.animateFragments(dt);
  }

  private animateHeightmap(dt: number): void {
    if (!this.heightmap) return;
    this.hmapAccum += dt;
    if (this.hmapAccum < 0.15) return;
    this.hmapAccum = 0;

    const hm = this.heightmap;
    const t = this.anim.time;
    const freq = 0.3, amp = 0.4;
    const tx = t * 0.3, tz = t * 0.2;
    let idx = 0;
    for (let z = 0; z < hm.depth; z++) {
      const zf = z * freq + tz;
      for (let x = 0; x < hm.width; x++) {
        hm.heights[idx] = noise3(x * freq + tx, 0, zf) * amp;
        idx++;
      }
    }
    this.heightmapMesh = null;
  }

  private animateVoxels(dt: number): void {
    if (!this.voxels) return;
    if (!this.voxelOriginalCells) this.voxelOriginalCells = [...this.voxels.cells];

    this.voxelTimer += dt;
    const stepInterval = 0.12 / Math.max(this.anim.speedScale, 0.1);
    if (this.voxelTimer < stepInterval) return;
    this.voxelTimer = 0;

    if (this.voxelEroding) {
      const occupied: number[] = [];
      for (let i = 0; i < this.voxels.cells.length; i++) {
        if (this.voxels.cells[i]) occupied.push(i);
      }
      const nRemove = Math.min(occupied.length, 1 + (Math.random() * 3) | 0);
      for (let i = 0; i < nRemove; i++) {
        const idx = (Math.random() * occupied.length) | 0;
        this.voxels.cells[occupied[idx]] = false;
        occupied.splice(idx, 1);
      }
      if (this.voxels.fillRatio() < 0.08) this.voxelEroding = false;
    } else {
      const missing: number[] = [];
      for (let i = 0; i < this.voxels.cells.length; i++) {
        if (!this.voxels.cells[i] && this.voxelOriginalCells![i]) missing.push(i);
      }
      if (missing.length > 0) {
        this.voxels.cells[missing[(Math.random() * missing.length) | 0]] = true;
      }
      if (this.voxels.fillRatio() > 0.65) this.voxelEroding = true;
    }
  }

  private animateFragments(dt: number): void {
    if (!this.fragmentGroups.length || !this.mesh) return;
    if (!this.fragmentOffsets) {
      this.fragmentOffsets = [];
      for (const group of this.fragmentGroups) {
        if (!group.length) { this.fragmentOffsets.push(new Vec3(0, 0, 0)); continue; }
        let cx = 0, cy = 0, cz = 0, count = 0;
        for (const fi of group) {
          if (fi < this.mesh.faces.length) {
            for (const vi of this.mesh.faces[fi]) {
              const v = this.mesh.vertices[vi];
              cx += v.x; cy += v.y; cz += v.z; count++;
            }
          }
        }
        this.fragmentOffsets.push(count > 0
          ? new Vec3(cx / count, cy / count, cz / count).normalized()
          : new Vec3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalized());
      }
    }
    this.fragmentTimer += dt;
  }

  private animateCloud(dt: number): void {
    if (!this.cloud || this.cloud.count < 100) return;
    this.growAttractor(dt);
  }

  private growAttractor(dt: number): void {
    if (!this.cloud || this.cloud.count === 0) return;
    if (!this.lorenzState) {
      const last = this.cloud.points[this.cloud.points.length - 1];
      const ns = this.cloud.normScale || 0.03;
      const inv = 1 / ns;
      this.lorenzState = [last.x * inv, last.y * inv, last.z * inv];
    }
    const sigma = 10, rho = 28, beta = 8 / 3;
    const ldt = 0.005;
    let [x, y, z] = this.lorenzState;
    const ns = this.cloud.normScale;
    const steps = Math.min(10, Math.max(1, (dt * 200 * this.anim.speedScale) | 0));
    for (let i = 0; i < steps; i++) {
      const dx = sigma * (y - x) * ldt;
      const dy = (x * (rho - z) - y) * ldt;
      const dz = (x * y - beta * z) * ldt;
      x += dx; y += dy; z += dz;
    }
    this.lorenzState = [x, y, z];
    this.cloud.add(new Vec3(x * ns, y * ns, z * ns), 1.0);
    const maxPts = 5000;
    if (this.cloud.count > maxPts) this.cloud.trim(maxPts);
    for (let i = 0; i < this.cloud.brightness.length; i++) {
      const age = 1 - i / Math.max(this.cloud.count, 1);
      this.cloud.brightness[i] = Math.max(0.1, 1 - age * 0.9);
    }
  }

  startTransition(dissolveStyle: TransitionStyle, formStyle: TransitionStyle): void {
    this.transition.start(dissolveStyle, formStyle);
    this.fragmentOffsets = null;
    this.fragmentTimer = 0;
    this.lorenzState = null;
    this.voxelTimer = 0;
    this.voxelEroding = true;
    this.voxelOriginalCells = null;
  }

  captureTransitionSource(): void {
    this.transitionSource = {
      geomKind: this.geomKind,
      mesh: this.mesh, meshB: this.meshB,
      cloud: this.cloud, voxels: this.voxels,
      heightmap: this.heightmap, heightmapMesh: this.heightmapMesh,
      shaderChars: this.shaderChars, light: this.light,
      camera: this.camera, styles: this.styles,
      fragmentGroups: this.fragmentGroups,
      dualMeshMode: this.dualMeshMode,
      surfaceSampler: this.surfaceSampler,
    };
  }

  private meshForRender(mesh: Mesh | null, fragmentGroups: number[][]): Mesh | null {
    if (!mesh) return null;
    if (fragmentGroups.length > 0 && this.fragmentOffsets) {
      const drift = this.fragmentDriftAmount();
      if (drift > 0) return this.buildFragmentMesh(mesh, fragmentGroups, drift);
    }
    return mesh;
  }

  private fragmentDriftAmount(): number {
    if (!this.fragmentGroups.length) return 0;
    const cycleT = (this.fragmentTimer % this.fragmentCycle) / this.fragmentCycle;
    if (cycleT >= 0.8) return 0;
    return (cycleT / 0.8) ** 2 * 1.5;
  }

  private buildFragmentMesh(mesh: Mesh, fragmentGroups: number[][], drift: number): Mesh {
    if (!this.fragmentOffsets) return mesh;
    const scaledOffsets = this.fragmentOffsets.map(o => o.scale(drift));
    const vertices: Vec3[] = [];
    const faces: number[][] = [];
    const vertexGroupIndices: number[] = [];

    for (let gi = 0; gi < fragmentGroups.length; gi++) {
      for (const fi of fragmentGroups[gi]) {
        if (fi >= mesh.faces.length) continue;
        const face = mesh.faces[fi];
        const renderFace: number[] = [];
        for (const vi of face) {
          vertices.push(mesh.vertices[vi].add(scaledOffsets[gi]));
          vertexGroupIndices.push(gi);
          renderFace.push(vertices.length - 1);
        }
        faces.push(renderFace);
      }
    }
    if (!faces.length) return mesh;
    const result = new Mesh();
    result.vertices = vertices;
    result.faces = faces;
    result.computeNormals();
    return result;
  }

  private morphMesh(a: Mesh, b: Mesh, t: number): Mesh {
    if (a.vertices.length !== b.vertices.length) return a;
    const st = smoothstep(0, 1, t);
    const result = new Mesh();
    result.vertices = a.vertices.map((va, i) => va.lerp(b.vertices[i], st));
    result.faces = a.faces.map(f => [...f]);
    result.computeNormals();
    return result;
  }
}
