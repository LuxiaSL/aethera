/**
 * vcr.ts — the way in.
 *
 * A VCR on a plinth in the middle of the room, every cable in the room running
 * into its back. Its display blinks 12:00 like every VCR nobody ever set;
 * choose a site and a tape goes into the slot, the display says PLAY and the
 * channel, and the cable to that screen lights up.
 */

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// ---- the display --------------------------------------------------------------

const SEG: Record<string, string> = {
  // segments a b c d e f g
  '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd',
  '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcfgd', '-': 'g', ' ': '',
};

class Vfd {
  readonly canvas = document.createElement('canvas');
  readonly texture: THREE.CanvasTexture;
  private ctx: CanvasRenderingContext2D;
  private mode: 'clock' | 'play' = 'clock';
  private channel = 0;
  private marquee = '';
  private marqueeAt = 0;
  private acc = 1;
  glow = 1;

  constructor() {
    this.canvas.width = 512;
    this.canvas.height = 112;
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('oikos: no 2d context');
    this.ctx = ctx;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
  }

  scroll(text: string, t: number): void {
    this.marquee = text;
    this.marqueeAt = t;
  }

  play(channel: number, name: string, t: number): void {
    this.mode = 'play';
    this.channel = channel;
    this.scroll(name, t);
  }

  stop(): void {
    this.mode = 'clock';
  }

  update(t: number, dt: number): void {
    this.acc += dt;
    if (this.acc < 1 / 12) return;
    this.acc = 0;
    const ctx = this.ctx;
    ctx.fillStyle = '#020807';
    ctx.fillRect(0, 0, 512, 112);
    const on = `rgba(127,245,225,${0.85 * this.glow + 0.15})`;
    const off = 'rgba(127,245,225,0.07)';
    ctx.shadowColor = '#7ff5e1';
    ctx.shadowBlur = 10 * this.glow;
    ctx.lineCap = 'round';

    const playing = this.mode === 'play';
    ctx.font = 'bold 15px ui-monospace, monospace';
    const flag = (label: string, x: number, lit: boolean) => {
      ctx.fillStyle = lit ? on : off;
      ctx.fillText(label, x, 24);
    };
    flag('VHS', 18, true);
    flag('HQ', 62, true);
    flag('▶ PLAY', 100, playing);
    flag('REC', 180, false);
    flag('CH', 226, playing);
    flag('PM', 470, !playing);

    const scrolling = this.marquee && t - this.marqueeAt < 2 + this.marquee.length * 0.22;
    if (scrolling) {
      const px = 512 - (t - this.marqueeAt) * 150;
      ctx.fillStyle = on;
      ctx.font = 'bold 50px ui-monospace, "Courier New", monospace';
      ctx.fillText(this.marquee.toUpperCase(), px, 92);
    } else if (playing) {
      this.digits(String(this.channel).padStart(2, '0'), 228, 36, on, off);
      ctx.fillStyle = on;
      ctx.font = 'bold 40px ui-monospace, monospace';
      ctx.fillText('▶', 360, 88);
    } else {
      // 12:00, blinking, as it always has
      const lit = Math.floor(t * 1.4) % 2 === 0;
      this.digits('1200', 150, 36, lit ? on : off, off, true, lit);
    }
    ctx.shadowBlur = 0;
    this.texture.needsUpdate = true;
  }

  private digits(s: string, x0: number, y0: number, on: string, off: string, colon = false, colonLit = true): void {
    const ctx = this.ctx;
    const w = 34;
    const h = 60;
    [...s].forEach((ch, i) => {
      const x = x0 + i * (w + 16) + (colon && i >= 2 ? 22 : 0);
      const lit = SEG[ch] ?? '';
      const seg = (name: string, ax: number, ay: number, bx: number, by: number) => {
        ctx.strokeStyle = lit.includes(name) ? on : off;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(x + ax, y0 + ay);
        ctx.lineTo(x + bx, y0 + by);
        ctx.stroke();
      };
      seg('a', 5, 0, w - 5, 0);
      seg('b', w, 5, w, h / 2 - 5);
      seg('c', w, h / 2 + 5, w, h - 5);
      seg('d', 5, h, w - 5, h);
      seg('e', 0, h / 2 + 5, 0, h - 5);
      seg('f', 0, 5, 0, h / 2 - 5);
      seg('g', 5, h / 2, w - 5, h / 2);
    });
    if (colon) {
      ctx.fillStyle = colonLit ? on : off;
      const cx = x0 + 2 * (w + 16) + 2;
      ctx.fillRect(cx, y0 + 16, 7, 7);
      ctx.fillRect(cx, y0 + 40, 7, 7);
    }
  }
}

// ---- the cassette -------------------------------------------------------------

function labelTexture(text: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 160;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f1ede2';
    ctx.fillRect(0, 0, 512, 160);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(0, 0, 512, 16);
    ctx.fillStyle = '#9aa1b0';
    for (let y = 40; y < 160; y += 30) ctx.fillRect(16, y + 20, 480, 1);
    ctx.fillStyle = '#15151a';
    ctx.font = 'bold 56px "Libertinus Mono", "Comic Sans MS", cursive';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 26, 92);
    ctx.font = '18px "Libertinus Mono", monospace';
    ctx.fillStyle = '#6b6f7a';
    ctx.textAlign = 'right';
    ctx.fillText('T-120  SP', 496, 142);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// ---- the machine --------------------------------------------------------------

const VW = 1.3;
const VH = 0.27;
const VD = 0.95;
export const PLINTH_TOP = 0.66;

type TapeState = 'rest' | 'in';

export class Vcr {
  readonly group = new THREE.Group();
  readonly hit: THREE.Mesh;
  readonly vfd = new Vfd();
  /** local-space rear, where the cables go in */
  readonly rearZ: number;
  readonly rearY: number;
  private flap: THREE.Mesh;
  private tape: THREE.Group;
  private tapeLabel: THREE.MeshStandardMaterial;
  private restPose = { pos: new THREE.Vector3(), rotY: 0 };
  private slotPose = { pos: new THREE.Vector3(), rotY: 0 };
  private insidePose = { pos: new THREE.Vector3(), rotY: 0 };
  private state: TapeState = 'rest';
  private anim: { from: TapeState; to: TapeState; k: number; label: string } | null = null;
  private queue: { to: TapeState; label: string }[] = [];
  private currentLabel = '~';

  constructor() {
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.7, metalness: 0.1 });
    const plinth = new THREE.Mesh(new RoundedBoxGeometry(1.9, PLINTH_TOP, 1.6, 2, 0.02), plinthMat);
    plinth.position.set(0, PLINTH_TOP / 2, 0.15);
    this.group.add(plinth);
    // Lain red: one hairline of it round the plinth's lip
    const seam = new THREE.Mesh(
      new THREE.BoxGeometry(1.92, 0.006, 1.62),
      new THREE.MeshBasicMaterial({ color: 0xb3121f }),
    );
    seam.position.set(0, PLINTH_TOP - 0.03, 0.15);
    this.group.add(seam);

    const vcr = new THREE.Group();
    vcr.position.set(0, PLINTH_TOP + VH / 2 + 0.012, -0.12);
    this.group.add(vcr);
    // the room has no environment map, so true metal renders black: satin plastic instead
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x26272c, roughness: 0.42, metalness: 0.12 });
    vcr.add(new THREE.Mesh(new RoundedBoxGeometry(VW, VH, VD, 3, 0.018), bodyMat));
    const topMat = new THREE.MeshStandardMaterial({ color: 0x6a6d75, roughness: 0.34, metalness: 0.2 });
    const top = new THREE.Mesh(new THREE.BoxGeometry(VW - 0.04, 0.004, VD - 0.04), topMat);
    top.position.y = VH / 2 + 0.001;
    vcr.add(top);
    for (const [x, z] of [[-0.55, 0.38], [0.55, 0.38], [-0.55, -0.38], [0.55, -0.38]] as const) {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.012, 12), plinthMat);
      foot.position.set(x, -VH / 2 - 0.006, z);
      vcr.add(foot);
    }

    const front = VD / 2 + 0.001;
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(VW - 0.03, VH - 0.03),
      new THREE.MeshStandardMaterial({ map: this.panelTexture(), roughness: 0.5, metalness: 0.08 }),
    );
    panel.position.z = front;
    vcr.add(panel);

    // the door, hinged along its top edge
    const doorW = 0.58;
    const doorH = 0.095;
    const doorX = -0.21;
    const doorY = 0.035;
    const hole = new THREE.Mesh(new THREE.PlaneGeometry(doorW, doorH), new THREE.MeshBasicMaterial({ color: 0x010101 }));
    hole.position.set(doorX, doorY, front + 0.001);
    vcr.add(hole);
    const hinge = new THREE.Group();
    hinge.position.set(doorX, doorY + doorH / 2, front + 0.004);
    vcr.add(hinge);
    this.flap = new THREE.Mesh(
      new THREE.BoxGeometry(doorW - 0.01, doorH - 0.006, 0.006),
      new THREE.MeshStandardMaterial({ color: 0x1a1b1f, roughness: 0.35, metalness: 0.1 }),
    );
    this.flap.position.y = -doorH / 2;
    hinge.add(this.flap);

    const vfd = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.0875), new THREE.MeshBasicMaterial({ map: this.vfd.texture, toneMapped: false }));
    vfd.position.set(0.36, 0.045, front + 0.002);
    vcr.add(vfd);

    const btnMat = new THREE.MeshStandardMaterial({ color: 0x3a3b42, roughness: 0.4, metalness: 0.1 });
    const recMat = new THREE.MeshStandardMaterial({ color: 0x8a1520, roughness: 0.4 });
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Mesh(new RoundedBoxGeometry(0.058, 0.024, 0.02, 2, 0.006), i === 5 ? recMat : btnMat);
      b.position.set(0.19 + i * 0.075, -0.075, front + 0.006);
      vcr.add(b);
    }
    const power = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 20), btnMat);
    power.rotation.x = Math.PI / 2;
    power.position.set(-0.57, 0.04, front + 0.008);
    vcr.add(power);
    const powerLed = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), new THREE.MeshBasicMaterial({ color: 0xff3030 }));
    powerLed.position.set(-0.57, -0.01, front + 0.004);
    vcr.add(powerLed);

    this.rearZ = vcr.position.z - VD / 2;
    this.rearY = vcr.position.y;

    // the tape, waiting on the plinth
    this.tape = new THREE.Group();
    const shell = new THREE.Mesh(
      new RoundedBoxGeometry(0.54, 0.07, 0.3, 2, 0.01),
      new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.45, metalness: 0.2 }),
    );
    this.tape.add(shell);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 0.06), new THREE.MeshStandardMaterial({ color: 0x2a2320, roughness: 0.1, metalness: 0.3 }));
    win.rotation.x = -Math.PI / 2;
    win.position.set(0, 0.0355, -0.05);
    this.tape.add(win);
    this.tapeLabel = new THREE.MeshStandardMaterial({ map: labelTexture('~'), roughness: 0.8 });
    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.1), this.tapeLabel);
    label.rotation.x = -Math.PI / 2;
    label.position.set(0, 0.036, 0.085);
    this.tape.add(label);
    this.group.add(this.tape);

    this.restPose = { pos: new THREE.Vector3(-0.38, PLINTH_TOP + 0.036, 0.66), rotY: 0.32 };
    this.slotPose = { pos: new THREE.Vector3(doorX, vcr.position.y + doorY, vcr.position.z + front + 0.34), rotY: 0 };
    this.insidePose = { pos: new THREE.Vector3(doorX, vcr.position.y + doorY, vcr.position.z + front - 0.36), rotY: 0 };
    this.applyPose(this.restPose, this.restPose, 0);

    this.hit = new THREE.Mesh(new THREE.BoxGeometry(1.9, PLINTH_TOP + VH + 0.1, 1.6), new THREE.MeshBasicMaterial({ visible: false }));
    this.hit.position.set(0, (PLINTH_TOP + VH + 0.1) / 2, 0.15);
    this.group.add(this.hit);
  }

  private panelTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 200;
    const ctx = c.getContext('2d');
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 200);
      g.addColorStop(0, '#1f2024');
      g.addColorStop(1, '#131417');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 200);
      ctx.fillStyle = '#3a3c43';
      for (let x = 0; x < 1024; x += 3) ctx.fillRect(x, 0, 1, 200); // brushed
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#c9ccd4';
      ctx.font = '30px "Libertinus Mono", monospace';
      ctx.fillText('æthera', 26, 176);
      ctx.font = '13px ui-monospace, monospace';
      ctx.fillStyle = '#8b8f99';
      ctx.fillText('VIDEO CASSETTE RECORDER   ·   4 HEAD HI-FI   ·   HQ', 150, 172);
      ctx.fillText('POWER', 16, 26);
      const labels = ['EJECT', 'REW', 'PLAY', 'FF', 'STOP', 'REC'];
      labels.forEach((l, i) => ctx.fillText(l, 632 + i * 58.5, 184));
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }

  private applyPose(a: { pos: THREE.Vector3; rotY: number }, b: { pos: THREE.Vector3; rotY: number }, k: number): void {
    this.tape.position.lerpVectors(a.pos, b.pos, k);
    this.tape.rotation.y = a.rotY + (b.rotY - a.rotY) * k;
  }

  /** Put a tape labelled `label` in (ejecting whatever was in first), or take it out. */
  load(label: string | null): void {
    this.queue = [];
    if (this.state === 'in' || this.anim?.to === 'in') this.queue.push({ to: 'rest', label: this.currentLabel });
    if (label) this.queue.push({ to: 'in', label });
  }

  update(dt: number): void {
    if (!this.anim && this.queue.length) {
      const next = this.queue.shift();
      if (next && next.to !== this.state) {
        if (next.to === 'in') {
          this.currentLabel = next.label;
          const old = this.tapeLabel.map;
          this.tapeLabel.map = labelTexture(next.label);
          this.tapeLabel.needsUpdate = true;
          old?.dispose();
        }
        this.anim = { from: this.state, to: next.to, k: 0, label: next.label };
      }
    }
    const a = this.anim;
    if (!a) return;
    a.k = Math.min(1, a.k + dt / (a.to === 'in' ? 1.3 : 0.9));
    // in: rest → before the slot → through the door; out is the same in reverse
    const k = a.to === 'in' ? a.k : 1 - a.k;
    const ease = (x: number) => x * x * (3 - 2 * x);
    if (k < 0.45) {
      const u = ease(k / 0.45);
      this.applyPose(this.restPose, this.slotPose, u);
      this.tape.position.y += Math.sin(u * Math.PI) * 0.18;
    } else {
      this.applyPose(this.slotPose, this.insidePose, ease(Math.min(1, (k - 0.5) / 0.4)) * (k > 0.5 ? 1 : 0));
    }
    const open = k < 0.4 ? 0 : k < 0.5 ? (k - 0.4) / 0.1 : k < 0.85 ? 1 : 1 - (k - 0.85) / 0.15;
    this.flap.parent?.rotation.set(open * 1.25, 0, 0); // swings inward, into the machine
    if (a.k >= 1) {
      this.state = a.to;
      this.anim = null;
    }
  }
}
