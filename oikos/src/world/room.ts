/**
 * room.ts — the Wired, assembled.
 *
 * Owns the renderer, the camera and the loop. Everything the rest of the page
 * needs from the 3D world goes through this surface: where a screen is on the
 * page (for balloons and panes), what the pointer is over, and three verbs —
 * focus a screen, play a tape, dive into a screen.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import type { Site } from '../data';
import type { Screen } from '../screens';
import { rng } from '../screens/screen';
import { Field } from './field';
import { placementFor, type Placement } from './layout';
import { Monitor } from './monitor';
import { Post } from './post';
import { Vcr, PLINTH_TOP } from './vcr';
import { Cable, floorRoute, makePowerLines, makeSky } from './wires';

export type Pickable = string; // a site id, or 'vcr'

export interface RoomEvents {
  pick(id: Pickable | null): void;
  hover(id: Pickable | null, x: number, y: number): void;
}

interface Station {
  site: Site;
  screen: Screen;
  monitor: Monitor;
  placement: Placement;
  cable: Cable;
  glow: THREE.Mesh;
  light: THREE.PointLight | null;
  power: number;
  powerAt: number;
  staticLeft: number;
  hover: number;
}

interface Pose {
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,0.9)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.3)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  }
  return new THREE.CanvasTexture(c);
}

export class Room {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(45, 1, 0.05, 160);
  // assigned in build(), which the constructor always runs (or throws)
  private controls!: OrbitControls;
  private post!: Post;
  private vcr = new Vcr();
  private field!: Field;
  private sky!: THREE.Mesh;
  private stations = new Map<string, Station>();
  private pickables: THREE.Object3D[] = [];
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(-9, -9);
  private pointerPx = { x: 0, y: 0 };
  private pointerDirty = false;
  private hovered: Pickable | null = null;
  private focused: Pickable | null = null;
  private tween: { from: Pose; to: Pose; k: number; dur: number; done?: () => void } | null = null;
  private playing: string | null = null; // a tape on its way down a cable
  // settles the pending play() promise: true when it arrived, false when
  // something else took the camera first
  private settlePlay: ((arrived: boolean) => void) | null = null;
  // bumped by every tuneIn/tuneOut, so a tune-in flight that lands after it
  // was called off doesn't lock the room
  private tuneSeq = 0;
  private lastAspect = 0;
  private later: { at: number; fn: () => void }[] = []; // scheduled on the room's clock, not the wall's
  private clock = new THREE.Clock();
  private t = 0;
  private running = false;
  private raf = 0;
  private lastInput = 0;
  private swayDir = 1;
  private pixelRatio: number;
  private maxPixelRatio: number;
  private frameTimes: number[] = [];
  private qualityStep = 0;
  private shift = { x: 0, y: 0 };
  // tuned in: a live page laid over a screen's glass (see tuneIn)
  private tuned: { id: string; place: (r: DOMRectReadOnly) => void } | null = null;
  private shiftTarget = { x: 0, y: 0 };
  private readonly reduced: boolean;
  private readonly lowPower: boolean;
  /** ?speed=N runs the room's clock faster; only for photographing it headless */
  private readonly speed = Math.min(10, Math.max(1, Number(new URLSearchParams(location.search).get('speed')) || 1));
  /**
   * ?drive: no loop of its own. The page exposes window.__oikos.step(n, dt),
   * which advances exactly n frames of dt seconds and reports where the time
   * went, so a harness can watch the room frame by frame at a true 30 fps
   * however slow the machine rendering it (there is no GPU in CI).
   */
  private readonly driven = new URLSearchParams(location.search).has('drive');
  private perf = { frames: 0, paint: 0, render: 0, uploads: 0 };
  // screens off camera aren't painted or uploaded (see frame)
  private frustum = new THREE.Frustum();
  private viewProj = new THREE.Matrix4();
  // a screen whose pane is open keeps painting even off camera: the pane shows its canvas
  private kept: string | null = null;
  private calm = 0; // consecutive quick windows, for stepping quality back up

  constructor(
    private readonly container: HTMLElement,
    sites: Site[],
    screens: Map<string, Screen>,
    private readonly events: RoomEvents,
  ) {
    this.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.lowPower = matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 600;
    this.maxPixelRatio = Math.min(devicePixelRatio || 1, this.lowPower ? 1.25 : 1.6);
    this.pixelRatio = this.maxPixelRatio;

    this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.id = 'oikos-gl';
    container.prepend(this.renderer.domElement);
    try {
      this.build(sites, screens);
    } catch (err) {
      // don't leave a dead canvas and a live GL context behind for the fallback desktop
      this.renderer.domElement.remove();
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      throw err;
    }
  }

  private build(sites: Site[], screens: Map<string, Screen>): void {

    this.scene.background = new THREE.Color(0x000000);
    // the sky's colour at the horizon (see makeSky), so the far floor dissolves into the ember
    this.scene.fog = new THREE.FogExp2(new THREE.Color().setRGB(0.049, 0.0063, 0.0089, THREE.LinearSRGBColorSpace), 0.042);

    this.sky = makeSky();
    this.scene.add(this.sky);
    this.scene.add(new THREE.HemisphereLight(0x4a4258, 0x060304, 0.8));
    const moon = new THREE.DirectionalLight(0x8a94b8, 0.35);
    moon.position.set(-4, 10, -6);
    this.scene.add(moon);
    const lamp = new THREE.SpotLight(0xd8dcff, 9, 7, 0.42, 0.65, 1.6);
    lamp.position.set(0.4, 4.6, 1.2);
    lamp.target.position.set(0, PLINTH_TOP, 0.1);
    this.scene.add(lamp, lamp.target);
    // and a little from where you stand, so its face (and the tape) can be read
    const fill = new THREE.PointLight(0x9fb3ff, 2.2, 4.5, 2);
    fill.position.set(-0.4, 1.35, 2.3);
    this.scene.add(fill);
    const ember = new THREE.PointLight(0xb3121f, 1.6, 4, 2);
    ember.position.set(0, 0.25, 1.4);
    this.scene.add(ember);

    this.buildFloor();
    this.scene.add(this.vcr.group);
    this.pickables.push(this.vcr.hit);
    this.vcr.hit.userData.pick = 'vcr';
    this.scene.add(makePowerLines());

    const rand = rng(1998);
    this.field = new Field(this.lowPower ? 40 : 90, rand, this.scene.fog as THREE.FogExp2);
    this.scene.add(this.field.group);

    this.buildStations(sites, screens, rand);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    this.controls.enablePan = false;
    this.controls.rotateSpeed = 0.28;
    this.controls.zoomSpeed = 0.6;
    this.controls.addEventListener('start', () => (this.lastInput = this.t));

    this.post = new Post(this.renderer, this.scene, this.camera);
    this.resize();
    const home = this.homePose();
    this.camera.position.copy(home.pos);
    this.controls.target.copy(home.target);
    this.applyLimits(null);
    this.controls.update();

    this.bindPointer();
    addEventListener('resize', () => this.resize());
  }

  // ---- building ---------------------------------------------------------------

  private buildFloor(): void {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0c0b0d';
      ctx.fillRect(0, 0, 512, 512);
      ctx.strokeStyle = 'rgba(120,110,130,0.10)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= 512; i += 128) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = `rgba(${Math.random() < 0.3 ? '120,20,30' : '90,90,100'},${Math.random() * 0.12})`;
        ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
      }
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(24, 24);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(96, 96),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.82, metalness: 0.15 }),
    );
    floor.rotation.x = -Math.PI / 2;
    this.scene.add(floor);
  }

  private buildStations(sites: Site[], screens: Map<string, Screen>, rand: () => number): void {
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x14110e, roughness: 0.85 });
    const wireMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.6 });
    const glowTex = glowTexture();
    const vcrRear = new THREE.Vector3();
    const placed = new Map<string, Monitor>();
    const pending = sites.map((site, i) => ({ site, i, p: placementFor(site.id, i) }));
    // stacked monitors must wait for what they stand on
    pending.sort((a, b) => Number(!!a.p.on) - Number(!!b.p.on));
    let port = 0;

    for (const { site, p } of pending) {
      const screen = screens.get(site.id);
      if (!screen) continue;
      const monitor = new Monitor({
        style: p.style,
        screenW: p.screenW,
        screen: screen.canvas,
        label: site.title,
        accent: site.accent,
        seed: Math.floor(rand() * 1000),
        stand: p.stand,
      });
      const a = THREE.MathUtils.degToRad(p.angle);
      const base = p.on ? placed.get(p.on) : undefined;
      if (base) {
        monitor.group.position.copy(base.group.position);
        monitor.group.position.y += base.height;
        monitor.group.rotation.copy(base.group.rotation);
        monitor.group.rotateY((rand() - 0.5) * 0.12);
        monitor.group.translateZ(-(base.depth - monitor.depth) * 0.3);
      } else {
        monitor.group.position.set(Math.sin(a) * p.r, p.y, -Math.cos(a) * p.r);
        const look = new THREE.Vector3(0, p.hang ? 1.3 : monitor.group.position.y + 0.6, 0.6);
        monitor.group.lookAt(look);
        if (!p.hang) {
          // lookAt pitched it; floor sets stand level
          monitor.group.rotation.set(0, Math.atan2(-monitor.group.position.x, 0.6 - monitor.group.position.z), 0);
          monitor.group.rotateY((rand() - 0.5) * 0.1);
        }
      }
      this.scene.add(monitor.group);
      placed.set(site.id, monitor);

      if (!p.hang && !p.on && p.y > 0.01) {
        const crate = new THREE.Mesh(new THREE.BoxGeometry(monitor.width * 0.92, p.y, monitor.depth * 0.9), crateMat);
        crate.position.set(0, -p.y / 2, -monitor.depth * 0.45);
        monitor.group.add(crate);
      }
      if (p.hang) {
        const top = monitor.world(monitor.topLocal);
        const support = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 16, 5), wireMat);
        support.position.set(top.x, top.y + 8, top.z);
        this.scene.add(support);
      }

      // the cable home
      const x = -0.5 + ((port++ * 0.37) % 1.0);
      vcrRear.set(x, this.vcr.rearY - 0.05, this.vcr.rearZ - 0.01);
      const from = monitor.world(monitor.portLocal);
      const back = monitor.normal().multiplyScalar(-1).setY(0).normalize();
      let points: THREE.Vector3[];
      const into = p.feeds ? placed.get(p.feeds) : undefined;
      if (into) {
        const to = into.world(into.portLocal.clone().add(new THREE.Vector3(-0.25, 0.15, 0)));
        const mid = new THREE.Vector3().lerpVectors(from, to, 0.5);
        mid.y = Math.min(from.y, to.y) - 0.6;
        points = [from, from.clone().addScaledVector(back, 0.3).setY(from.y - 0.2), mid, to.clone().add(new THREE.Vector3(0, 0.3, -0.3)), to];
      } else {
        points = floorRoute(from, back, vcrRear, 0.15 - 0.8, PLINTH_TOP, rand);
      }
      const cable = new Cable(points, p.hang ? 0.014 : 0.02, site.accent);
      this.scene.add(cable.mesh);

      // light pooling on the floor in front of the screen
      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(p.screenW * 2.6, p.screenW * 2.2),
        new THREE.MeshBasicMaterial({
          map: glowTex, color: site.accent, transparent: true, opacity: 0, depthWrite: false,
          blending: THREE.AdditiveBlending, fog: true,
        }),
      );
      const n = monitor.normal().setY(0).normalize();
      const gp = monitor.world(monitor.screenLocal).addScaledVector(n, p.screenW * 0.9);
      glow.position.set(gp.x, 0.012, gp.z);
      glow.rotation.x = -Math.PI / 2;
      glow.rotation.z = Math.atan2(n.x, n.z);
      if (!p.hang) this.scene.add(glow);

      let light: THREE.PointLight | null = null;
      if (!this.lowPower) {
        light = new THREE.PointLight(site.accent, 0, 3.2 + p.screenW, 2);
        // far enough out that it lights the floor and the neighbours, not a hot spot on its own bezel
        light.position.copy(monitor.world(monitor.screenLocal).addScaledVector(monitor.normal(), 1.1));
        this.scene.add(light);
      }

      monitor.hit.userData.pick = site.id;
      this.pickables.push(monitor.hit);
      this.stations.set(site.id, {
        site, screen, monitor, placement: p, cable, glow, light,
        power: 0, powerAt: Infinity, staticLeft: 0, hover: 0,
      });
    }
  }

  // ---- camera -----------------------------------------------------------------

  private homePose(): Pose {
    const aspect = this.camera.aspect;
    const portrait = aspect < 1;
    // a phone can't hold the whole arc: frame the VCR and the screens nearest it,
    // and let the rest be found by dragging
    const back = portrait ? 7.2 + (1 - aspect) * 2.4 : 7.8;
    return { pos: new THREE.Vector3(0, portrait ? 2.5 : 2.4, back), target: new THREE.Vector3(0, portrait ? 1.7 : 1.95, -1.6) };
  }

  private posesFor(id: Pickable): Pose | null {
    if (id === 'vcr') {
      const portrait = this.camera.aspect < 1;
      return {
        pos: new THREE.Vector3(0.3, 1.75, portrait ? 3.9 : 2.9),
        target: new THREE.Vector3(0, PLINTH_TOP + 0.12, 0.2),
      };
    }
    const s = this.stations.get(id);
    if (!s) return null;
    const m = s.monitor;
    const target = m.world(m.screenLocal);
    const n = m.normal();
    const vfov = THREE.MathUtils.degToRad(this.camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    const d = Math.max(
      m.screenH / 2 / Math.tan(vfov / 2) / 0.46,
      (m.screenH / 0.75) / 2 / Math.tan(hfov / 2) / 0.7,
    );
    return { pos: target.clone().addScaledVector(n, d + 0.05), target };
  }

  private applyLimits(id: Pickable | null): void {
    const c = this.controls;
    if (!id) {
      c.minDistance = 3;
      c.maxDistance = 15;
      // the arc is composed to be seen from the front: look round it, not behind it
      c.minAzimuthAngle = -0.8;
      c.maxAzimuthAngle = 0.8;
      c.minPolarAngle = 0.95;
      c.maxPolarAngle = 1.56;
      return;
    }
    const off = new THREE.Vector3().subVectors(this.camera.position, c.target);
    const sph = new THREE.Spherical().setFromVector3(off);
    c.minDistance = sph.radius * 0.45;
    c.maxDistance = sph.radius * 1.7;
    c.minAzimuthAngle = sph.theta - 0.6;
    c.maxAzimuthAngle = sph.theta + 0.6;
    c.minPolarAngle = Math.max(0.3, sph.phi - 0.45);
    c.maxPolarAngle = Math.min(1.6, sph.phi + 0.35);
  }

  private flyTo(to: Pose, dur: number, done?: () => void): void {
    this.controls.enabled = false;
    this.controls.minAzimuthAngle = -Infinity;
    this.controls.maxAzimuthAngle = Infinity;
    this.tween = {
      from: { pos: this.camera.position.clone(), target: this.controls.target.clone() },
      to,
      k: 0,
      dur: this.reduced ? 0.01 : dur,
      done,
    };
  }

  // ---- verbs --------------------------------------------------------------------

  focus(id: Pickable | null): void {
    const pose = id ? this.posesFor(id) : this.homePose();
    if (!pose) return;
    this.cancelPlay();
    this.focused = id;
    for (const [sid, s] of this.stations) s.cable.setLit(sid === id ? 1 : 0);
    this.flyTo(pose, id ? 1.15 : 1.3, () => {
      this.applyLimits(id);
      this.controls.enabled = !this.tuned;
      this.controls.update();
    });
  }

  get focusedId(): Pickable | null {
    return this.focused;
  }

  /** keep this screen painting while it's off camera (its pane is open) */
  keepAlive(id: string | null): void {
    this.kept = id;
  }

  /** a tape is on its way to its screen */
  get busy(): boolean {
    return this.playing !== null;
  }

  private cancelPlay(): void {
    this.playing = null;
    const settle = this.settlePlay;
    this.settlePlay = null;
    settle?.(false);
  }

  /**
   * The VCR takes a tape, and we watch it go in: the camera stops by the VCR
   * as the tape slides through the door, follows the surge down the cable,
   * and arrives as the screen changes channel. Resolves true on arrival, or
   * false if something else took the camera first (a click, a key).
   */
  play(id: string): Promise<boolean> {
    const s = this.stations.get(id);
    const pose = this.posesFor(id);
    if (!s || !pose) return Promise.resolve(true);
    this.cancelPlay();
    const done = new Promise<boolean>((r) => (this.settlePlay = r));
    this.vcr.load(s.site.title);
    this.vcr.vfd.play(s.placement.channel, s.site.title, this.t);
    this.focused = id;
    this.playing = id;
    for (const [sid, st] of this.stations) st.cable.setLit(sid === id ? 1 : 0);
    const arrive = () => {
      if (this.playing !== id) return;
      s.staticLeft = 0.9;
      this.post.kick(0.7);
      this.flyTo(pose, 1.15, () => {
        if (this.playing !== id) return;
        this.playing = null;
        this.applyLimits(id);
        this.controls.enabled = !this.tuned;
        this.controls.update();
        const settle = this.settlePlay;
        this.settlePlay = null;
        settle?.(true);
      });
    };
    if (this.reduced) {
      arrive();
      return done;
    }
    const side = Math.sign(s.monitor.group.position.x) || 1;
    const portrait = this.camera.aspect < 1;
    const glance: Pose = {
      pos: new THREE.Vector3(side * 0.45, 1.4, portrait ? 3.1 : 2.25),
      target: new THREE.Vector3(side * 0.05, PLINTH_TOP + 0.1, 0.25),
    };
    this.flyTo(glance, 0.8, () => {
      if (this.playing !== id) return;
      s.cable.surge();
      // let the tape finish going in before we leave it
      this.after(0.35, arrive);
    });
    return done;
  }

  private after(seconds: number, fn: () => void): void {
    this.later.push({ at: this.t + seconds, fn });
  }

  eject(): void {
    this.vcr.load(null);
    this.vcr.vfd.stop();
  }

  scroll(text: string): void {
    this.vcr.vfd.scroll(text, this.t);
  }

  /** Into the glass: resolves when the screen fills the view. */
  dive(id: string): Promise<void> {
    const s = this.stations.get(id);
    if (!s || this.reduced) return Promise.resolve();
    this.cancelPlay();
    const m = s.monitor;
    const target = m.world(m.screenLocal);
    const pos = target.clone().addScaledVector(m.normal(), m.screenH * 0.16);
    s.staticLeft = 0.8;
    this.post.kick(1);
    return new Promise((resolve) => this.flyTo({ pos, target }, 0.75, resolve));
  }

  powerOn(): void {
    let k = 0;
    const order = [...this.stations.values()].sort((a, b) => a.placement.channel - b.placement.channel);
    for (const s of order) s.powerAt = this.t + 0.25 + k++ * (this.reduced ? 0 : 0.14);
    this.vcr.vfd.scroll('present day  present time', this.t + 0.4);
  }

  /** Where a thing is on the page, in CSS px (null when it's behind us). */
  anchor(id: Pickable): { x: number; y: number } | null {
    let p: THREE.Vector3;
    if (id === 'vcr') p = new THREE.Vector3(0, PLINTH_TOP - 0.05, 0.95);
    else {
      const s = this.stations.get(id);
      if (!s) return null;
      p = s.monitor.world(s.monitor.screenLocal.clone().add(new THREE.Vector3(0, s.monitor.screenH * 0.5, 0)));
    }
    p.project(this.camera);
    if (p.z > 1) return null;
    const r = this.renderer.domElement.getBoundingClientRect();
    return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
  }

  /** Slide the picture (not the camera) so the subject sits in the part of
   *  the page the windows leave free. CSS px; positive x moves it left. */
  setShift(x: number, y: number): void {
    this.shiftTarget = { x, y };
  }

  private applyShift(dt: number): void {
    // a tuned-in page is laid out by CSS3D, which knows nothing of view offsets
    if (this.tuned) this.shiftTarget = { x: 0, y: 0 };
    const k = this.reduced ? 1 : Math.min(1, dt * 5);
    const sx = this.shift.x + (this.shiftTarget.x - this.shift.x) * k;
    const sy = this.shift.y + (this.shiftTarget.y - this.shift.y) * k;
    if (Math.abs(sx - this.shift.x) < 0.05 && Math.abs(sy - this.shift.y) < 0.05 && this.camera.view) return;
    this.shift = { x: sx, y: sy };
    const w = this.container.clientWidth || innerWidth;
    const h = this.container.clientHeight || innerHeight;
    this.camera.setViewOffset(w, h, sx, sy, w, h);
  }

  /**
   * Tune in: fly square to a screen and hold the camera there, then report
   * where its glass landed on the page, so a live page (real DOM, fully
   * alive: links, keys, sound) can be laid over it while the room keeps
   * rendering around it. `place` is called again whenever the page resizes.
   *
   * Not CSS3D: an iframe inside a preserve-3d context paints on the glass but
   * Chrome won't hit-test into it, so clicks fell through to the canvas.
   * Square on and held still, the glass projects to a plain rectangle anyway.
   */
  tuneIn(id: string, place: (r: DOMRectReadOnly) => void): Promise<void> {
    const s = this.stations.get(id);
    const pose = this.tunePose(id);
    if (!s || !pose) return Promise.resolve();
    this.tuneOut();
    this.cancelPlay();
    const seq = this.tuneSeq;
    this.focused = id;
    this.shiftTarget = { x: 0, y: 0 };
    for (const [sid, st] of this.stations) st.cable.setLit(sid === id ? 1 : 0);
    return new Promise((resolve) =>
      this.flyTo(pose, 1.1, () => {
        if (seq !== this.tuneSeq) {
          // called off in flight: land as an ordinary focus
          this.applyLimits(id);
          this.controls.enabled = true;
          return;
        }
        this.tuned = { id, place };
        s.staticLeft = 0;
        this.resize(); // settles the view offset to zero and lays the page
        resolve();
      }),
    );
  }

  /** square on to a screen, close enough that its glass nearly fills the view */
  private tunePose(id: string): Pose | null {
    const s = this.stations.get(id);
    if (!s) return null;
    const m = s.monitor;
    const sw = m.screenH / 0.75;
    const target = m.world(m.screenLocal);
    const vfov = THREE.MathUtils.degToRad(this.camera.fov);
    const hfov = 2 * Math.atan(Math.tan(vfov / 2) * this.camera.aspect);
    const d = Math.max(m.screenH / 2 / Math.tan(vfov / 2) / 0.84, sw / 2 / Math.tan(hfov / 2) / 0.94);
    return { pos: target.clone().addScaledVector(m.normal(), d), target };
  }

  tuneOut(): void {
    this.tuneSeq++;
    if (!this.tuned) return;
    this.tuned = null;
    // tune-in held the camera still; hand it back unless a flight owns it now
    if (!this.tween) {
      this.applyLimits(this.focused);
      this.controls.enabled = true;
    }
  }

  /** back from the bfcache after diving out: stand up from the glass */
  reset(): void {
    this.tuneOut();
    this.cancelPlay();
    this.focus(null);
  }

  /** the glass of a screen, as a rectangle on the page (CSS px) */
  glassRect(id: string): DOMRectReadOnly | null {
    const s = this.stations.get(id);
    if (!s) return null;
    const m = s.monitor;
    const sw = m.screenH / 0.75;
    const r = this.renderer.domElement.getBoundingClientRect();
    const xs: number[] = [];
    const ys: number[] = [];
    this.camera.updateMatrixWorld();
    for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]] as const) {
      const p = m.world(m.screenLocal.clone().add(new THREE.Vector3((dx * sw) / 2, (dy * m.screenH) / 2, sw * 0.02)));
      p.project(this.camera);
      xs.push(r.left + ((p.x + 1) / 2) * r.width);
      ys.push(r.top + ((1 - p.y) / 2) * r.height);
    }
    const left = Math.min(...xs);
    const top = Math.min(...ys);
    return new DOMRectReadOnly(left, top, Math.max(...xs) - left, Math.max(...ys) - top);
  }

  get tunedId(): string | null {
    return this.tuned?.id ?? null;
  }

  // ---- input --------------------------------------------------------------------

  private bindPointer(): void {
    const el = this.renderer.domElement;
    let down: { x: number; y: number; t: number } | null = null;
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      this.pointerPx = { x: e.clientX, y: e.clientY };
      this.pointerDirty = true;
      this.lastInput = this.t;
    });
    el.addEventListener('pointerleave', () => {
      this.pointer.set(-9, -9);
      this.pointerDirty = true;
    });
    el.addEventListener('pointerdown', (e) => {
      // a right or middle click is not a pick
      if (e.button !== 0 || !e.isPrimary) {
        down = null;
        return;
      }
      down = { x: e.clientX, y: e.clientY, t: performance.now() };
      this.lastInput = this.t;
    });
    el.addEventListener('pointerup', (e) => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
      const quick = performance.now() - down.t < 600;
      down = null;
      if (moved > 7 || !quick || this.tuned) return;
      const r = el.getBoundingClientRect();
      this.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      this.events.pick(this.pickAt());
    });
  }

  /** what's under a page point (for right-click menus); null for the empty room */
  pickFromPoint(clientX: number, clientY: number): Pickable | null {
    const r = this.renderer.domElement.getBoundingClientRect();
    const saved = this.pointer.clone();
    this.pointer.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    const id = this.pickAt();
    this.pointer.copy(saved);
    return id;
  }

  private pickAt(): Pickable | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.pickables, false)[0];
    return (hit?.object.userData.pick as Pickable | undefined) ?? null;
  }

  // ---- loop ---------------------------------------------------------------------

  private resize(): void {
    const w = this.container.clientWidth || innerWidth;
    const h = this.container.clientHeight || innerHeight;
    // only a new shape re-frames the home view; a same-shape resize (quality
    // step, phone chrome sliding) must not yank the camera from where it was dragged
    const reshaped = Math.abs(w / h - this.lastAspect) > 0.02;
    this.lastAspect = w / h;
    this.camera.aspect = w / h;
    this.camera.fov = this.camera.aspect < 1 ? 58 : 45;
    this.camera.setViewOffset(w, h, this.shift.x, this.shift.y, w, h);
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = `${w}px`;
    this.renderer.domElement.style.height = `${h}px`;
    this.post.setSize(w, h, this.pixelRatio);
    if (this.tuned) {
      // held still while tuned: re-aim for the new shape, then re-lay the page
      this.shift = { x: 0, y: 0 };
      this.camera.setViewOffset(w, h, 0, 0, w, h);
      const pose = this.tunePose(this.tuned.id);
      if (pose) {
        this.camera.position.copy(pose.pos);
        this.controls.target.copy(pose.target);
        this.camera.lookAt(pose.target);
      }
      const rect = this.glassRect(this.tuned.id);
      if (rect) this.tuned.place(rect);
    }
    if (reshaped && !this.tween && !this.focused && this.controls) {
      const home = this.homePose();
      this.camera.position.copy(home.pos);
      this.controls.target.copy(home.target);
    }
  }

  /**
   * Compile every program (and render one frame through the post chain)
   * while the boot screen is still up, so the room arrives whole instead of
   * black. Big lit shaders are slow to compile, most of all on Safari.
   * Capped: a slow compiler just finishes on the first real frame.
   */
  async warm(capMs = 5000): Promise<void> {
    try {
      await Promise.race([
        this.renderer.compileAsync(this.scene, this.camera),
        new Promise((r) => setTimeout(r, capMs)),
      ]);
      this.post.render(0, 0);
    } catch (err) {
      console.warn('oikos: warm-up skipped', err);
    }
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    if (this.driven) {
      const gl = this.renderer.getContext();
      (window as unknown as { __oikos: unknown }).__oikos = {
        step: (n = 1, dt = 1 / 30) => {
          this.perf = { frames: 0, paint: 0, render: 0, uploads: 0 };
          for (let i = 0; i < n; i++) {
            this.frame(dt);
            gl.finish();
          }
          return { ...this.perf, t: this.t, focused: this.focused, hovered: this.hovered, tuned: this.tuned?.id ?? null };
        },
        anchor: (id: Pickable) => this.anchor(id),
        glass: (id: string) => this.glassRect(id),
      };
      return;
    }
    const loop = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      this.frame();
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  private adapt(dt: number): void {
    this.frameTimes.push(dt);
    const spent = this.frameTimes.reduce((a, b) => a + b, 0);
    if (this.frameTimes.length < 90 && spent < 2) return;
    const avg = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    this.frameTimes = [];
    // three quick windows in a row (a busy moment passed, or it was a
    // one-off stall): step back up, one notch at a time
    this.calm = avg < 1 / 50 ? this.calm + 1 : 0;
    if (this.calm >= 3 && this.qualityStep > 0) {
      this.calm = 0;
      this.qualityStep--;
      this.pixelRatio = Math.min(this.maxPixelRatio, this.pixelRatio / 0.8);
      this.post.bloom.enabled = true;
      this.applyPixelRatio();
      return;
    }
    // 1/27 s, not 1/30: a browser capped at 30 fps (iOS low power) averages
    // ~33 ms however idle the GPU is, and shouldn't be stepped down for it
    if (avg > 1 / 27 && this.qualityStep < 3) {
      this.qualityStep++;
      this.pixelRatio = Math.max(0.6, this.pixelRatio * 0.8);
      if (this.qualityStep >= 3) this.post.bloom.enabled = false;
      this.applyPixelRatio();
    }
  }

  private applyPixelRatio(): void {
    this.renderer.setPixelRatio(this.pixelRatio);
    const w = this.container.clientWidth || innerWidth;
    const h = this.container.clientHeight || innerHeight;
    this.renderer.setSize(w, h, false);
    this.post.setSize(w, h, this.pixelRatio);
  }

  private frame(fixed?: number): void {
    const raw = fixed ?? this.clock.getDelta();
    const dt = Math.min(raw, 0.1) * this.speed;
    this.t += dt;
    const t = this.t;
    if (!this.driven) this.adapt(Math.min(raw, 0.5));
    this.applyShift(dt);
    if (this.later.length) {
      const due = this.later.filter((l) => l.at <= t);
      this.later = this.later.filter((l) => l.at > t);
      for (const l of due) l.fn();
    }

    if (this.tween) {
      const tw = this.tween;
      tw.k = Math.min(1, tw.k + dt / tw.dur);
      const e = easeInOut(tw.k);
      this.camera.position.lerpVectors(tw.from.pos, tw.to.pos, e);
      this.controls.target.lerpVectors(tw.from.target, tw.to.target, e);
      this.camera.lookAt(this.controls.target);
      if (tw.k >= 1) {
        this.tween = null;
        tw.done?.();
      }
    } else {
      // left alone, the room sways a little on its own
      if (!this.focused && !this.reduced && t - this.lastInput > 9) {
        this.controls.autoRotate = true;
        const theta = this.controls.getAzimuthalAngle();
        if (theta > 0.32) this.swayDir = 1;
        if (theta < -0.32) this.swayDir = -1;
        this.controls.autoRotateSpeed = 0.18 * this.swayDir;
      } else this.controls.autoRotate = false;
      this.controls.update(dt);
    }

    if (this.pointerDirty && !this.tween) {
      this.pointerDirty = false;
      const id = this.pickAt();
      if (id !== this.hovered) {
        this.hovered = id;
        this.renderer.domElement.style.cursor = id ? 'pointer' : '';
      }
      this.events.hover(id, this.pointerPx.x, this.pointerPx.y);
    }

    const t0 = performance.now();
    this.camera.updateMatrixWorld();
    this.viewProj.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.viewProj);
    for (const [id, s] of this.stations) {
      if (t >= s.powerAt) s.power = Math.min(1, s.power + dt / (this.reduced ? 0.01 : 0.8));
      s.staticLeft = Math.max(0, s.staticLeft - dt);
      s.hover += ((id === this.hovered ? 1 : 0) - s.hover) * Math.min(1, dt * 8);
      const u = s.monitor.crt.uniforms;
      u.uTime.value = t;
      u.uPower.value = s.power;
      u.uHover.value = s.hover;
      u.uStatic.value = Math.min(1, s.staticLeft * 1.6);
      const focused = this.focused === id;
      // off camera, a screen is neither painted nor uploaded: nobody would see
      // it (most of the room is off camera once you're close to one screen)
      const wanted = focused || id === this.kept || this.frustum.intersectsObject(s.monitor.glass);
      // with a screen focused, the rest are in the corner of your eye: half rate
      // (not the pane's screen, which you're looking at in its window)
      const slow = this.focused && this.focused !== 'vcr' && !focused && id !== this.kept ? 0.5 : 1;
      if (s.power > 0.2 && wanted && s.screen.tick(t, dt, focused, slow)) {
        s.monitor.texture.needsUpdate = true;
        this.perf.uploads++;
      }
      s.monitor.setLed(s.power > 0.5, s.site.accent);
      const glow = s.glow.material as THREE.MeshBasicMaterial;
      glow.opacity = s.power * (0.16 + s.hover * 0.12 + (focused ? 0.1 : 0));
      if (s.light) s.light.intensity = s.power * (2.2 + s.hover * 1.4 + (focused ? 0.6 : 0));
      s.cable.update(t, dt);
    }
    this.vcr.vfd.glow = this.hovered === 'vcr' ? 1 : 0.8;
    this.vcr.vfd.update(t, dt);
    this.vcr.update(dt);
    this.field.update(t);
    const t1 = performance.now();
    this.post.render(t, dt);
    if (this.driven) {
      this.renderer.getContext().finish();
      const t2 = performance.now();
      this.perf.frames++;
      this.perf.paint += t1 - t0;
      this.perf.render += t2 - t1;
    }
  }
}
