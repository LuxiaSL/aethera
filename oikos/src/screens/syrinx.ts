/**
 * syrinx — your creature, if you have one.
 *
 * Syrinx keeps its creature in this origin's localStorage, so the room can draw
 * the very body you left: its nodes, its strings, its name and its age. A
 * Kuramoto toy runs over its real topology so the nodes fall into step and
 * flash gold together, and pale breaths walk the strings — a picture of the
 * instrument, not the instrument (the sound stays at /syrinx).
 *
 * Nobody has woken one in this browser? Then an unborn body turns in the dark.
 */

import { H, MONO, Screen, W, rng, type ScreenEnv } from './screen';
import type { Creature, Site } from '../data';

interface Body {
  name: string;
  age: string;
  born: boolean;
  nodes: { x: number; y: number; z: number; phase: number; omega: number; flash: number }[];
  edges: { a: number; b: number; elder: boolean }[];
  adj: number[][];
}

export class SyrinxScreen extends Screen {
  private body: Body;
  private creatureRef: Creature | null | undefined = undefined;
  private stars: { x: number; y: number; a: number }[];
  private breaths: { edge: number; k: number; fwd: boolean }[] = [];

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 24;
    const rand = rng(33);
    this.stars = Array.from({ length: 90 }, () => ({ x: rand() * W, y: rand() * H, a: rand() * 0.5 + 0.1 }));
    this.body = unborn();
  }

  private sync(): void {
    const c = this.env.feeds.creature.value;
    if (c === this.creatureRef) return;
    this.creatureRef = c;
    this.body = c ? fromCreature(c) : unborn();
    this.breaths = Array.from({ length: Math.min(4, this.body.edges.length) }, (_, i) => ({
      edge: (i * 7) % Math.max(1, this.body.edges.length), k: 0, fwd: true,
    }));
  }

  protected draw(t: number, dt: number): void {
    this.sync();
    const ctx = this.ctx;
    const body = this.body;
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#070b14');
    sky.addColorStop(1, '#02030a');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    for (const s of this.stars) {
      ctx.fillStyle = `rgba(200,215,255,${s.a * (0.7 + 0.3 * Math.sin(t + s.x))})`;
      ctx.fillRect(s.x, s.y, 1, 1);
    }

    // Kuramoto over the real topology
    const K = body.born ? 1.4 : 0.9;
    const step = Math.min(dt, 0.1);
    const next = body.nodes.map((n, i) => {
      const nb = body.adj[i] ?? [];
      let pull = 0;
      for (const j of nb) pull += Math.sin((body.nodes[j]?.phase ?? 0) - n.phase);
      return n.phase + (n.omega + (nb.length ? (K * pull) / nb.length : 0)) * step;
    });
    body.nodes.forEach((n, i) => {
      const p = next[i] ?? n.phase;
      if (Math.floor(p / (Math.PI * 2)) > Math.floor(n.phase / (Math.PI * 2))) n.flash = 1;
      n.phase = p;
      n.flash = Math.max(0, n.flash - step * 2.2);
    });

    // project: turn slowly about the vertical, breathe a little
    const rot = t * 0.18;
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    const pts = body.nodes.map((n, i) => {
      const wob = Math.sin(t * 0.9 + i) * 0.02;
      const x = n.x * cr - n.z * sr;
      const z = n.x * sr + n.z * cr;
      const k = 2.8 / (3.6 - z);
      return { x: W / 2 + x * k * 150, y: 176 + (n.y + wob) * k * 150, k };
    });

    ctx.lineCap = 'round';
    for (const e of body.edges) {
      const a = pts[e.a];
      const b = pts[e.b];
      if (!a || !b) continue;
      ctx.strokeStyle = e.elder ? 'rgba(160,200,235,0.55)' : 'rgba(140,170,210,0.28)';
      ctx.lineWidth = e.elder ? 1.4 : 0.8;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    // breaths walk the strings
    for (const br of this.breaths) {
      const e = body.edges[br.edge];
      if (!e) continue;
      br.k += step / 0.75;
      if (br.k >= 1) {
        const at = br.fwd ? e.b : e.a;
        const options = (body.adj[at] ?? []).map((j) => body.edges.findIndex((x) => (x.a === at && x.b === j) || (x.b === at && x.a === j)));
        const pick = options[Math.floor(Math.random() * options.length)] ?? br.edge;
        const ne = body.edges[pick];
        br.edge = pick;
        br.fwd = ne ? ne.a === at : true;
        br.k = 0;
        continue;
      }
      const from = pts[br.fwd ? e.a : e.b];
      const to = pts[br.fwd ? e.b : e.a];
      if (!from || !to) continue;
      const x = from.x + (to.x - from.x) * br.k;
      const y = from.y + (to.y - from.y) * br.k;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
      g.addColorStop(0, 'rgba(235,245,255,0.95)');
      g.addColorStop(1, 'rgba(180,220,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 9, y - 9, 18, 18);
    }

    // nodes: stars with diffraction spikes; gold when they fire
    body.nodes.forEach((n, i) => {
      const p = pts[i];
      if (!p) return;
      const f = n.flash;
      const r = 2 + p.k * 1.2 + f * 3;
      const col = f > 0.05 ? `rgba(255,${Math.round(210 - f * 40)},${Math.round(120 - f * 60)},${0.6 + f * 0.4})` : 'rgba(200,225,255,0.85)';
      ctx.strokeStyle = col;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(p.x - r * 3, p.y);
      ctx.lineTo(p.x + r * 3, p.y);
      ctx.moveTo(p.x, p.y - r * 3);
      ctx.lineTo(p.x, p.y + r * 3);
      ctx.stroke();
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.4);
      g.addColorStop(0, col);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(p.x - r * 3, p.y - r * 3, r * 6, r * 6);
    });

    ctx.font = `15px ${MONO}`;
    ctx.fillStyle = body.born ? '#e6f1ff' : '#8190a8';
    ctx.fillText(body.name, 18, H - 40);
    ctx.font = `11px ${MONO}`;
    ctx.fillStyle = '#6f7f99';
    ctx.fillText(body.age, 18, H - 20);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#4b5870';
    ctx.fillText(body.born ? `${body.nodes.length} nodes · ${body.edges.length} strings` : 'click to wake it', W - 18, H - 20);
    ctx.textAlign = 'left';
  }
}

function adjacency(n: number, edges: Body['edges']): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const e of edges) {
    adj[e.a]?.push(e.b);
    adj[e.b]?.push(e.a);
  }
  return adj;
}

function fromCreature(c: Creature): Body {
  const index = new Map(c.nodes.map((n, i) => [n.id, i]));
  // centre and scale the body to a unit-ish sphere, whatever its size
  const cx = c.nodes.reduce((s, n) => s + n.x, 0) / c.nodes.length;
  const cy = c.nodes.reduce((s, n) => s + n.y, 0) / c.nodes.length;
  const cz = c.nodes.reduce((s, n) => s + n.z, 0) / c.nodes.length;
  const span = Math.max(1, ...c.nodes.map((n) => Math.hypot(n.x - cx, n.y - cy, n.z - cz)));
  const nodes = c.nodes.map((n, i) => ({
    x: (n.x - cx) / span,
    y: (n.y - cy) / span,
    z: (n.z - cz) / span,
    phase: i * 1.3,
    omega: 2.4 + (i % 5) * 0.21,
    flash: 0,
  }));
  const edges = c.edges
    .map((e) => ({ a: index.get(e.a) ?? -1, b: index.get(e.b) ?? -1, elder: e.age > 150 }))
    .filter((e) => e.a >= 0 && e.b >= 0);
  const seconds = Math.max(c.lifetime, (Date.now() - c.bornAt) / 1000);
  return { name: c.name, age: `${formatAge(seconds)} old · yours`, born: true, nodes, edges, adj: adjacency(nodes.length, edges) };
}

function unborn(): Body {
  const rand = rng(9);
  const n = 9;
  const nodes = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return {
      x: Math.cos(a) * 0.8 + (rand() - 0.5) * 0.3,
      y: (rand() - 0.5) * 0.9,
      z: Math.sin(a) * 0.8,
      phase: rand() * 6,
      omega: 2.2 + rand() * 0.8,
      flash: 0,
    };
  });
  const edges: Body['edges'] = [];
  for (let i = 0; i < n; i++) edges.push({ a: i, b: (i + 1) % n, elder: i % 3 === 0 });
  edges.push({ a: 0, b: 4, elder: false }, { a: 2, b: 6, elder: false }, { a: 3, b: 8, elder: true });
  return { name: 'something stirs', age: 'unborn in this browser', born: false, nodes, edges, adj: adjacency(n, edges) };
}

function formatAge(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
