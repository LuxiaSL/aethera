/**
 * core.ts — æthera itself: the machine in the middle of the room.
 *
 * Every cable in the room ends here. A low black desk with the red hairline
 * round its lip; on it a beige monitor, a beige tower, a keyboard. The
 * monitor is the room's one readout (it took over from the VCR's display):
 * the system's name, the day and the time, what's being opened, a line of
 * text when there's something to say. Clicking the machine opens ~.
 *
 * It has the small surface the room used from the VCR (group, hit, the rear
 * the cables plug into, load(), and a display with play/scroll/stop), so the
 * room swaps one for the other without learning anything new.
 *
 * The display is a Screen-sized canvas under the same CRT shader as every
 * other tube, painted only when something on it changes (a state, the
 * cursor's blink, the minute): most frames it costs nothing.
 */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

import { Monitor } from './monitor';
import { Cable } from './wires';

/** height of the desk's top: what the lamp aims at, and the cables climb to */
export const DESK_TOP = 0.62;
const DESK_W = 1.6;
const DESK_D = 1.1;
const DESK_Z = 0.1;
/** the desk's back face, z in world space (the cables come in over it) */
export const DESK_BACK_Z = DESK_Z - DESK_D / 2;

const AMBER = '#ffb347';
const AMBER_DIM = 'rgba(255,179,71,0.68)';
const FACE = '"VT323", "IBM Plex Mono", ui-monospace, monospace';

type Mode =
  | { kind: 'idle' }
  | { kind: 'play'; channel: number; name: string; at: number }
  | { kind: 'scroll'; text: string; at: number };

/** The monitor's picture: 512×384, painted on demand. */
export class CoreDisplay {
  readonly canvas = document.createElement('canvas');
  /** 0..1, how bright the tube is (the room raises it on hover) */
  glow = 0.8;
  private ctx: CanvasRenderingContext2D | null;
  private mode: Mode = { kind: 'idle' };
  private dirty = true;
  private lastKey = '';
  private fontsReady = false;

  constructor() {
    this.canvas.width = 512;
    this.canvas.height = 384;
    this.ctx = this.canvas.getContext('2d');
    // the face may land after the first paint; paint again when it does
    document.fonts?.load(`40px ${FACE}`).then(
      () => { this.fontsReady = true; this.dirty = true; },
      () => { this.fontsReady = true; },
    );
  }

  /** A line of text, once across. */
  scroll(text: string, t: number): void {
    this.mode = { kind: 'scroll', text, at: t };
    this.dirty = true;
  }

  /** A place being opened. */
  play(channel: number, name: string, t: number): void {
    this.mode = { kind: 'play', channel, name, at: t };
    this.dirty = true;
  }

  stop(): void {
    this.mode = { kind: 'idle' };
    this.dirty = true;
  }

  /**
   * Repaint if anything visible changed since the last paint. Returns whether
   * it did (the caller uploads the texture only then).
   */
  update(t: number, _dt: number): boolean {
    const m = this.mode;
    // a scroll runs its course, then the screen settles back to idle
    if (m.kind === 'scroll') {
      const width = 512 + m.text.length * 22;
      if ((t - m.at) * 120 > width) this.stop();
    }
    const now = new Date();
    const cursorOn = Math.floor(t * 2) % 2 === 0;
    const marquee = this.mode.kind === 'scroll' ? Math.floor((t - this.mode.at) * 15) : 0;
    const key = `${this.mode.kind}|${now.getHours()}:${now.getMinutes()}|${cursorOn}|${marquee}|${this.fontsReady}`;
    if (!this.dirty && key === this.lastKey) return false;
    this.lastKey = key;
    this.dirty = false;
    try {
      this.paint(t, now, cursorOn);
    } catch {
      return false; // a canvas that can't paint shows its last picture
    }
    return true;
  }

  private paint(t: number, now: Date, cursorOn: boolean): void {
    const c = this.ctx;
    if (!c) return;
    const W = this.canvas.width;
    const H = this.canvas.height;
    c.fillStyle = '#060302';
    c.fillRect(0, 0, W, H);
    c.textBaseline = 'alphabetic';

    // the head: the system's name, and the day it is
    c.fillStyle = AMBER;
    c.font = `48px ${FACE}`;
    c.fillText('æthera', 26, 56);
    c.fillStyle = AMBER_DIM;
    c.font = `36px ${FACE}`;
    c.textAlign = 'right';
    c.fillText(`day ${dayOfYear(now)} · ${pad(now.getHours())}:${pad(now.getMinutes())}`, W - 26, 54);
    c.textAlign = 'left';
    c.fillRect(26, 72, W - 52, 2);

    const m = this.mode;
    if (m.kind === 'play') {
      c.fillStyle = AMBER_DIM;
      c.font = `30px ${FACE}`;
      c.fillText(`▸ ch ${pad(m.channel)}`, 26, 150);
      c.fillStyle = AMBER;
      c.font = `64px ${FACE}`;
      c.fillText(clip(c, m.name, W - 52), 26, 214);
      c.fillStyle = AMBER_DIM;
      c.font = `26px ${FACE}`;
      c.fillText(`opening${'.'.repeat(1 + (Math.floor(t * 2) % 3))}`, 26, 262);
    } else {
      // idle: the letter, large, and a prompt
      c.save();
      c.fillStyle = AMBER;
      c.shadowColor = 'rgba(255,138,61,0.55)';
      c.shadowBlur = 18;
      c.font = `180px ${FACE}`;
      c.textAlign = 'center';
      c.fillText('æ', W / 2, 250);
      c.restore();
    }

    // the foot: the prompt, or a line crossing once
    c.fillStyle = AMBER;
    c.font = `40px ${FACE}`;
    if (m.kind === 'scroll') {
      const x = W - (t - m.at) * 120;
      c.fillText(m.text, x, H - 30);
    } else {
      c.fillText(`~ ${cursorOn ? '_' : ' '}`, 26, H - 30);
    }
  }
}

/**
 * The machine: desk, monitor, tower, keyboard, and the short cable between
 * tower and monitor. Origin at the room's centre, facing +z (you).
 */
export class Core {
  readonly group = new THREE.Group();
  readonly hit: THREE.Mesh;
  readonly display = new CoreDisplay();
  readonly monitor: Monitor;
  /** where the room's cables plug in: world-space, the desk's back edge */
  readonly rearY = DESK_TOP - 0.02;
  readonly rearZ = DESK_BACK_Z;
  private hddLed: THREE.MeshBasicMaterial;
  private busyLeft = 0;
  private power = 0;
  private hover = 0;
  private link: Cable;

  constructor() {
    // the desk: black, low, the red hairline round its lip kept from the old plinth
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.7, metalness: 0.1 });
    const desk = new THREE.Mesh(new RoundedBoxGeometry(DESK_W, DESK_TOP, DESK_D, 2, 0.02), deskMat);
    desk.position.set(0, DESK_TOP / 2, DESK_Z);
    this.group.add(desk);
    const seam = new THREE.Mesh(
      new THREE.BoxGeometry(DESK_W + 0.02, 0.006, DESK_D + 0.02),
      new THREE.MeshBasicMaterial({ color: 0xb3121f }),
    );
    seam.position.set(0, DESK_TOP - 0.03, DESK_Z);
    this.group.add(seam);

    // the monitor: a real CRT, the same build as every screen in the room
    this.monitor = new Monitor({
      style: 'beige',
      screenW: 0.66,
      screen: this.display.canvas,
      label: 'aethera',
      accent: AMBER,
      seed: 315,
    });
    this.monitor.group.position.set(-0.22, DESK_TOP, DESK_Z + 0.14);
    this.monitor.group.rotation.y = 0.05;
    this.group.add(this.monitor.group);

    // the tower, the same plastic (no environment map in the room: satin, never metal)
    const beige = new THREE.MeshStandardMaterial({ color: 0xb9ae94, roughness: 0.62, metalness: 0.05 });
    const towerW = 0.25;
    const towerH = 0.56;
    const towerD = 0.52;
    const tower = new THREE.Group();
    tower.position.set(0.53, DESK_TOP, DESK_Z - 0.04);
    tower.rotation.y = -0.12;
    this.group.add(tower);
    const case_ = new THREE.Mesh(new RoundedBoxGeometry(towerW, towerH, towerD, 3, 0.012), beige);
    case_.position.y = towerH / 2;
    tower.add(case_);
    const slotMat = new THREE.MeshStandardMaterial({ color: 0x3a352c, roughness: 0.5 });
    for (const [y, h] of [[0.49, 0.04], [0.435, 0.04], [0.37, 0.014]] as const) {
      const bay = new THREE.Mesh(new THREE.PlaneGeometry(towerW * 0.78, h), slotMat);
      bay.position.set(0, y, towerD / 2 + 0.001);
      tower.add(bay);
    }
    const led = (color: number, y: number): THREE.MeshBasicMaterial => {
      const mat = new THREE.MeshBasicMaterial({ color });
      const m = new THREE.Mesh(new THREE.CircleGeometry(0.006, 10), mat);
      m.position.set(towerW * 0.28, y, towerD / 2 + 0.002);
      tower.add(m);
      return mat;
    };
    led(0x6dff7a, 0.08);
    this.hddLed = led(0x3a2410, 0.06);

    // the keyboard: a slab, angled up to the hands
    const board = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.028, 0.17, 2, 0.006), beige);
    board.position.set(-0.22, DESK_TOP + 0.016, DESK_Z + 0.4);
    board.rotation.set(0.06, 0.04, 0);
    this.group.add(board);
    const keys = new THREE.Mesh(
      new THREE.PlaneGeometry(0.46, 0.13),
      new THREE.MeshStandardMaterial({ map: keyTexture(), roughness: 0.6 }),
    );
    keys.rotation.x = -Math.PI / 2;
    keys.position.set(0, 0.0145, 0);
    board.add(keys);

    // tower → monitor
    this.group.updateMatrixWorld(true);
    const from = new THREE.Vector3(0.53 - 0.05, DESK_TOP + 0.12, DESK_Z - 0.3);
    const to = this.monitor.world(this.monitor.portLocal);
    const mid = new THREE.Vector3().lerpVectors(from, to, 0.5).setY(DESK_TOP + 0.01);
    this.link = new Cable([from, from.clone().setY(DESK_TOP + 0.02), mid, to.clone().setY(DESK_TOP + 0.03), to], 0.01, AMBER);
    this.group.add(this.link.mesh);

    // one box for the whole machine: monitor and tower and the desk top between them
    this.hit = new THREE.Mesh(
      new THREE.BoxGeometry(DESK_W, 0.82, DESK_D),
      new THREE.MeshBasicMaterial({ visible: false }),
    );
    this.hit.position.set(0, DESK_TOP + 0.36, DESK_Z);
    this.group.add(this.hit);
  }

  /** world-space centre of the display's glass (camera poses, balloons aim here) */
  screenWorld(): THREE.Vector3 {
    return this.monitor.world(this.monitor.screenLocal);
  }

  /** Something is being opened (`label`) or put away (null): the drive works either way. */
  load(label: string | null): void {
    this.busyLeft = label ? 1.4 : 0.5;
  }

  update(t: number, dt: number, hovered: boolean): void {
    this.power = Math.min(1, this.power + dt / 0.8);
    this.hover += ((hovered ? 1 : 0) - this.hover) * Math.min(1, dt * 8);
    this.display.glow = 0.8 + this.hover * 0.2;
    const u = this.monitor.crt.uniforms;
    u.uTime.value = t;
    u.uPower.value = this.power;
    u.uHover.value = this.hover;
    if (this.power > 0.2 && this.display.update(t, dt)) this.monitor.texture.needsUpdate = true;
    this.monitor.setLed(this.power > 0.5, AMBER);

    // the drive light flickers while something's being opened
    this.busyLeft = Math.max(0, this.busyLeft - dt);
    const busy = this.busyLeft > 0 && Math.sin(t * 47) + Math.sin(t * 29) > 0.3;
    this.hddLed.color.setHex(busy ? 0xffb347 : 0x3a2410);
    this.link.update(t, dt);
  }
}

function keyTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 72;
  const g = c.getContext('2d');
  if (g) {
    g.fillStyle = '#8e8571';
    g.fillRect(0, 0, 256, 72);
    g.fillStyle = '#cfc6ae';
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 15; col++) {
        g.fillRect(4 + col * 16.6 + (row % 2) * 4, 5 + row * 16, 13.5, 13);
      }
    }
    g.fillRect(56, 69 - 4, 120, 4); // the space bar's edge
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function dayOfYear(d: Date): number {
  const start = Date.UTC(d.getFullYear(), 0, 0);
  const today = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((today - start) / 86_400_000);
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** cut a line to fit `max` px, with an ellipsis */
function clip(c: CanvasRenderingContext2D, s: string, max: number): string {
  if (c.measureText(s).width <= max) return s;
  let out = s;
  while (out.length > 1 && c.measureText(`${out}…`).width > max) out = out.slice(0, -1);
  return `${out}…`;
}
