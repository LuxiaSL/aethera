/**
 * transmissions — the blog, as its own index page: the mark, the latest
 * titles, and one of them read aloud underneath. The titles are real (the
 * server hands them over with the page); the star is the post list's own.
 */

import { H, HAND, MONO, Screen, W, rng, type ScreenEnv } from './screen';
import type { Site } from '../data';

const logo = new Image();
logo.src = '/static/uploads/aethera_trimmed.png';

export class TransmissionsScreen extends Screen {
  private specks: { x: number; y: number; r: number; red: boolean; v: number }[];

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 12;
    const rand = rng(7);
    this.specks = Array.from({ length: 70 }, () => ({
      x: rand() * W, y: rand() * H, r: rand() * 1.2 + 0.3, red: rand() < 0.35, v: rand() * 4 + 1,
    }));
  }

  protected draw(t: number): void {
    const ctx = this.ctx;
    this.clear('#000');

    // the og card's dust: faint, some of it red
    for (const s of this.specks) {
      const y = (s.y - t * s.v + H) % H;
      ctx.fillStyle = s.red ? 'rgba(170,40,50,0.55)' : 'rgba(255,255,255,0.28)';
      ctx.fillRect(s.x, y, s.r, s.r);
    }

    if (logo.complete && logo.naturalWidth) {
      const w = 210;
      const h = (w * logo.naturalHeight) / logo.naturalWidth;
      ctx.globalAlpha = 0.92 + 0.08 * Math.sin(t * 1.3);
      ctx.drawImage(logo, (W - w) / 2, 26, w, h);
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = '#7d7d7d';
    ctx.font = `13px ${MONO}`;
    this.spaced('transmissions', W / 2, 118, 3, 'center');
    ctx.fillStyle = '#262626';
    ctx.fillRect(40, 132, W - 80, 1);

    const posts = this.env.dir.posts.slice(0, 6);
    if (!posts.length) {
      ctx.fillStyle = '#9a9a9a';
      ctx.font = `16px ${MONO}`;
      ctx.textAlign = 'center';
      ctx.fillText(`no transmissions yet${Math.floor(t * 2) % 2 ? '_' : ' '}`, W / 2, 230);
      ctx.textAlign = 'left';
      return;
    }

    const period = 3.6;
    const active = Math.floor(t / period) % posts.length;
    const phase = (t % period) / period;
    posts.forEach((p, i) => {
      const y = 162 + i * 29;
      const on = i === active;
      ctx.font = `11px ${MONO}`;
      ctx.fillStyle = on ? '#bdbdbd' : '#555';
      ctx.fillText(p.date, 46, y);
      ctx.font = `16px ${HAND}`;
      ctx.fillStyle = on ? '#ffffff' : '#9a9a9a';
      const title = p.title.length > 38 ? `${p.title.slice(0, 37)}…` : p.title;
      ctx.fillText(title, 132, y);
      if (on) this.star(28, y - 5, t);
    });

    // the active post's excerpt, typed out beneath the list
    const post = posts[active];
    if (post?.excerpt) {
      ctx.font = `italic 12px ${MONO}`;
      ctx.fillStyle = '#8a8a8a';
      const chars = Math.floor(Math.min(1, phase * 1.6) * post.excerpt.length);
      const lines = this.wrap(post.excerpt.slice(0, chars), W - 92, 2);
      lines.forEach((l, i) => ctx.fillText(l, 46, 344 + i * 16));
    }
  }

  /** hover-star.js's many-pointed glow, small */
  private star(x: number, y: number, t: number): void {
    const ctx = this.ctx;
    const r = 7 + Math.sin(t * 5) * 1.2;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * 0.8);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const rr = i % 2 ? r * 0.28 : i % 4 ? r * 0.7 : r;
      ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
