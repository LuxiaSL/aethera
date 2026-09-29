/**
 * parlor — Kleros, a table in progress.
 *
 * The board is Kleros' own (its forty spaces, districts, prices and the ₯),
 * seen from the corner of the table the way its 3D board is. The game is a
 * toy played out on this screen — two people and two model seats taking turns
 * — narrated in the parlor's own sentence shapes. The real tables are at
 * parlor.aetherawi.red.
 */

import { H, MONO, Screen, W, rng, type ScreenEnv } from './screen';
import type { Site } from '../data';

const GROUP: Record<string, string> = {
  pelos: '#8c6a4f', halon: '#6fa8a0', keramai: '#c2803a', chalkis: '#7d4a86',
  pyrrha: '#d14e3c', elektra: '#e0b33a', daphnaia: '#4e8b4a', ouranis: '#3d5fa8',
};

// [name, district, price]
const BOARD: [string, string | null, number][] = [
  ['Arche', null, 0], ['Ostrakon Row', 'pelos', 60], ['Grammateion', null, 0], ['Pelos Walk', 'pelos', 60],
  ['Eisphora', null, 0], ['Boreas Gate', null, 200], ['Halas Steps', 'halon', 100], ['Moira', null, 0],
  ['Tarichos Street', 'halon', 100], ['Limen Approach', 'halon', 120], ['Desmoterion', null, 0],
  ['Kerameikos Walk', 'keramai', 140], ['Pyrphoros', null, 150], ['Amphora Yard', 'keramai', 140],
  ['Pithos Street', 'keramai', 160], ['Eos Gate', null, 200], ['Chalkeion Gate', 'chalkis', 180],
  ['Grammateion', null, 0], ['Akmon Court', 'chalkis', 180], ['Orichalkon Row', 'chalkis', 200],
  ['Temenos', null, 0], ['Kaminos Way', 'pyrrha', 220], ['Moira', null, 0], ['Pyrrha Rise', 'pyrrha', 220],
  ['Phlox Avenue', 'pyrrha', 240], ['Notos Gate', null, 200], ['Elektron Quay', 'elektra', 260],
  ['Helios Terrace', 'elektra', 260], ['Krene', null, 150], ['Lampter Mile', 'elektra', 280],
  ['Kerux', null, 0], ['Daphne Green', 'daphnaia', 300], ['Myrtos Park', 'daphnaia', 300],
  ['Grammateion', null, 0], ['Kotinos Crown', 'daphnaia', 320], ['Zephyros Gate', null, 200],
  ['Moira', null, 0], ['Astron Hill', 'ouranis', 350], ['Choregia', null, 0], ['Ouranos Point', 'ouranis', 400],
];

const SEATS = [
  { name: 'ada', model: false, color: '#f2efe6' },
  { name: 'claude', model: true, color: '#d97757' },
  { name: 'tomas', model: false, color: '#6fb3e0' },
  { name: 'gemma', model: true, color: '#9be07a' },
];

/** grid position (0..10) of a space on the perimeter, 0 at the near corner */
function cell(i: number): [number, number] {
  if (i <= 10) return [10 - i, 10];
  if (i <= 20) return [0, 10 - (i - 10)];
  if (i <= 30) return [i - 20, 0];
  return [10, i - 30];
}

const S = 17; // cell size
const OX = W / 2;
const OY = 168;
/** board grid → screen, seen from a corner of the table */
function iso(gx: number, gy: number): [number, number] {
  const x = (gx - 5.5) * S;
  const y = (gy - 5.5) * S;
  return [OX + (x - y) * 0.72, OY + (x + y) * 0.42];
}

export class ParlorScreen extends Screen {
  private pos = [0, 0, 0, 0];
  private hop = { seat: 0, from: 0, left: 0, k: 0 };
  private dice: [number, number] = [3, 4];
  private owner = new Map<number, number>();
  private log: string[] = ['A new game begins with 4 players.'];
  private turn = 0;
  private wait = 1.2;
  private rand = rng(4242);

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 20;
  }

  private say(line: string): void {
    this.log = [...this.log, line].slice(-3);
  }

  private step(dt: number): void {
    if (this.hop.left > 0) {
      this.hop.k += dt / 0.16;
      if (this.hop.k >= 1) {
        this.hop.k = 0;
        this.hop.left--;
        this.pos[this.hop.seat] = ((this.pos[this.hop.seat] ?? 0) + 1) % 40;
        if (this.hop.left === 0) this.land(this.hop.seat);
      }
      return;
    }
    this.wait -= dt;
    if (this.wait > 0) return;
    const seat = this.turn % SEATS.length;
    const d1 = 1 + Math.floor(this.rand() * 6);
    const d2 = 1 + Math.floor(this.rand() * 6);
    this.dice = [d1, d2];
    this.say(`${SEATS[seat]?.name} rolls ${d1} and ${d2}.`);
    this.hop = { seat, from: this.pos[seat] ?? 0, left: d1 + d2, k: 0 };
    this.turn++;
    this.wait = 1.6;
  }

  private land(seat: number): void {
    const at = this.pos[seat] ?? 0;
    const [name, group, price] = BOARD[at] ?? ['', null, 0];
    const who = SEATS[seat]?.name ?? '';
    const owner = this.owner.get(at);
    if (price && owner === undefined && this.rand() < 0.75) {
      this.owner.set(at, seat);
      this.say(`${who} buys ${name} for ₯${price}.`);
    } else if (owner !== undefined && owner !== seat) {
      const rent = Math.max(2, Math.round(price / (group ? 12 : 8)));
      this.say(`${who} pays ₯${rent} to ${SEATS[owner]?.name} for ${name}.`);
    } else if (name === 'Moira' || name === 'Grammateion') {
      this.say(`${who} draws from ${name}.`);
    } else if (name === 'Kerux') {
      this.say(`${who} is sent to the Desmoterion.`);
      this.pos[seat] = 10;
    }
    if (this.owner.size > 22) this.owner.clear();
  }

  protected draw(t: number, dt: number): void {
    this.step(Math.min(dt, 0.2));
    const ctx = this.ctx;
    const bg = ctx.createRadialGradient(W / 2, OY, 40, W / 2, OY, W * 0.7);
    bg.addColorStop(0, '#2a241f');
    bg.addColorStop(1, '#141210');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // the board's plate
    const corners = [iso(-0.4, -0.4), iso(11.4, -0.4), iso(11.4, 11.4), iso(-0.4, 11.4)];
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    corners.forEach(([x, y], i) => (i ? ctx.lineTo(x, y + 8) : ctx.moveTo(x, y + 8)));
    ctx.fill();
    ctx.fillStyle = '#d9ccb2';
    ctx.beginPath();
    corners.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.fill();

    for (let i = 0; i < 40; i++) {
      const [gx, gy] = cell(i);
      const [, group] = BOARD[i] ?? ['', null, 0];
      const quad = [iso(gx, gy), iso(gx + 1, gy), iso(gx + 1, gy + 1), iso(gx, gy + 1)];
      ctx.fillStyle = group ? (GROUP[group] ?? '#efe4cf') : i % 10 === 0 ? '#e6d6b6' : '#efe4cf';
      ctx.strokeStyle = '#7a6a52';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      quad.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      const owner = this.owner.get(i);
      if (owner !== undefined) {
        const [cx, cy] = iso(gx + 0.5, gy + 0.5);
        ctx.fillStyle = SEATS[owner]?.color ?? '#fff';
        ctx.fillRect(cx - 2, cy - 5, 4, 5);
      }
    }
    const [cx, cy] = iso(5.5, 5.5);
    ctx.fillStyle = '#7a6a52';
    ctx.font = `15px ${MONO}`;
    this.spaced('KLEROS', cx, cy + 5, 5, 'center');

    // tokens
    SEATS.forEach((seat, s) => {
      let p = this.pos[s] ?? 0;
      let lift = 0;
      let [gx, gy] = cell(p);
      if (this.hop.left > 0 && this.hop.seat === s) {
        const [nx, ny] = cell((p + 1) % 40);
        gx += (nx - gx) * this.hop.k;
        gy += (ny - gy) * this.hop.k;
        lift = Math.sin(this.hop.k * Math.PI) * 9;
        p = -1;
      }
      const off = [[0.3, 0.3], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7]][s] ?? [0.5, 0.5];
      const [x, y] = iso(gx + (off[0] ?? 0.5), gy + (off[1] ?? 0.5));
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(x, y + 1, 5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = seat.color;
      ctx.beginPath();
      ctx.arc(x, y - 5 - lift, 4.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.stroke();
    });

    // dice
    this.dice.forEach((d, i) => this.die(W - 70 + i * 30, 22, d, t));

    // seats
    ctx.font = `11px ${MONO}`;
    SEATS.forEach((seat, s) => {
      const y = 26 + s * 16;
      ctx.fillStyle = seat.color;
      ctx.fillRect(16, y - 8, 8, 8);
      ctx.fillStyle = (this.turn - 1) % SEATS.length === s ? '#f5ecd9' : '#8c826f';
      ctx.fillText(`${seat.name}${seat.model ? '  ◆ model' : ''}`, 30, y);
    });

    // narration
    ctx.fillStyle = 'rgba(10,8,6,0.75)';
    ctx.fillRect(0, H - 62, W, 62);
    ctx.font = `12px ${MONO}`;
    this.log.forEach((line, i) => {
      ctx.fillStyle = i === this.log.length - 1 ? '#f1e6cc' : '#8a7f6a';
      ctx.fillText(line, 16, H - 42 + i * 16);
    });
  }

  private die(x: number, y: number, v: number, t: number): void {
    const ctx = this.ctx;
    const wob = this.hop.left > 0 ? Math.sin(t * 30) * 0.15 : 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(wob);
    ctx.fillStyle = '#efe4cf';
    ctx.fillRect(-10, -10, 20, 20);
    ctx.fillStyle = '#3a2f24';
    const pips: Record<number, [number, number][]> = {
      1: [[0, 0]], 2: [[-5, -5], [5, 5]], 3: [[-5, -5], [0, 0], [5, 5]],
      4: [[-5, -5], [5, -5], [-5, 5], [5, 5]], 5: [[-5, -5], [5, -5], [0, 0], [-5, 5], [5, 5]],
      6: [[-5, -5], [5, -5], [-5, 0], [5, 0], [-5, 5], [5, 5]],
    };
    for (const [px, py] of pips[v] ?? []) {
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}
