/**
 * irc — the channel, live.
 *
 * The room listens to /ws/irc like any other viewer: the broadcast is a
 * replay of a pre-generated bank, so one more listener costs nothing, and
 * every visitor's screen shows the same line at the same moment as the real
 * page. Lines are formatted exactly as irc.js formats them. When the channel
 * collapses the tube tears.
 */

import { H, MONO, Screen, W, type ScreenEnv } from './screen';
import type { IrcLine, Site } from '../data';

const COL = {
  bg: '#181522',
  screen: '#231f36',
  fg: '#c9d1d9',
  dim: '#6e7681',
  sys: '#8b949e',
  quit: '#f85149',
  action: '#a371f7',
  join: '#3fb950',
};

const NICK_COLORS = [
  '#58a6ff', '#3fb950', '#d29922', '#a371f7', '#f778ba', '#39c5cf',
  '#ff7b72', '#7ee787', '#ffa657', '#79c0ff', '#d2a8ff', '#56d364',
];

function nickColor(n: string): string {
  let h = 0;
  for (const c of n) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return NICK_COLORS[h % NICK_COLORS.length] ?? COL.fg;
}

type Chunk = { text: string; color: string };

function chunks(m: IrcLine): Chunk[] {
  const out: Chunk[] = [{ text: `[${m.stamp}] `, color: COL.dim }];
  const nk = m.nick;
  const ct = m.content;
  switch (m.type) {
    case 'message':
      out.push({ text: `<${nk}> `, color: nickColor(nk) }, { text: ct, color: COL.fg });
      break;
    case 'action':
      out.push({ text: `* ${nk} ${ct}`, color: COL.action });
      break;
    case 'quit':
      out.push({ text: `⫫ ${nk} has quit${ct ? ` (${ct})` : ''}`, color: COL.quit });
      break;
    case 'part':
      out.push({ text: `← ${nk} has left${ct ? ` (${ct})` : ''}`, color: COL.sys });
      break;
    case 'join':
      out.push({ text: `→ ${nk} has joined`, color: COL.join });
      break;
    case 'kick':
      out.push({ text: `⚠ ${nk} kicked someone${ct ? ` (${ct})` : ''}`, color: COL.quit });
      break;
    default:
      out.push({ text: `*** ${ct || nk}`, color: COL.sys });
  }
  return out;
}

const LINE_H = 16;
const PAD_X = 16;
const TOP = 50;

export class IrcScreen extends Screen {
  private laidOut: { rows: Chunk[][]; at: number }[] = [];
  private seen = -1;

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 15;
  }

  private layout(): void {
    const irc = this.env.feeds.irc.value;
    if (irc.version === this.seen) return;
    this.seen = irc.version;
    this.ctx.font = `12.5px ${MONO}`;
    this.laidOut = irc.lines.map((l) => ({ rows: this.wrapChunks(chunks(l), W - PAD_X * 2), at: l.at }));
  }

  /** Word-wrap coloured chunks; continuation rows are indented. */
  private wrapChunks(cs: Chunk[], width: number): Chunk[][] {
    const ctx = this.ctx;
    const rows: Chunk[][] = [[]];
    let x = 0;
    for (const c of cs) {
      for (const word of c.text.split(/(\s+)/)) {
        if (!word) continue;
        const w = ctx.measureText(word).width;
        if (x + w > width && x > 0 && word.trim()) {
          rows.push([{ text: '    ', color: c.color }]);
          x = ctx.measureText('    ').width;
        }
        rows[rows.length - 1]?.push({ text: word, color: c.color });
        x += w;
      }
    }
    return rows;
  }

  protected draw(t: number): void {
    this.layout();
    const ctx = this.ctx;
    const irc = this.env.feeds.irc.value;
    this.clear(COL.bg);
    ctx.fillStyle = COL.screen;
    ctx.fillRect(6, 6, W - 12, H - 12);

    // title bar
    ctx.fillStyle = 'rgba(88,166,255,0.1)';
    ctx.fillRect(6, 6, W - 12, 28);
    ctx.font = `13px ${MONO}`;
    ctx.fillStyle = '#58a6ff';
    ctx.fillText('#aethera', PAD_X, 25);
    ctx.fillStyle = COL.dim;
    ctx.font = `11px ${MONO}`;
    ctx.textAlign = 'right';
    const live = irc.connected ? (Math.sin(t * 3) > -0.3 ? '● live' : '○ live') : '○ connecting…';
    ctx.fillStyle = irc.connected ? COL.join : COL.dim;
    ctx.fillText(live, W - PAD_X, 25);
    ctx.textAlign = 'left';

    const collapse = irc.collapse ? Math.min(1, (performance.now() - irc.collapse.at) / 1500) : 0;
    ctx.font = `12.5px ${MONO}`;
    const rows: { chunks: Chunk[]; fresh: number }[] = [];
    const now = performance.now();
    for (const l of this.laidOut) for (const r of l.rows) rows.push({ chunks: r, fresh: Math.max(0, 1 - (now - l.at) / 600) });
    const fit = Math.floor((H - TOP - 12) / LINE_H);
    const visible = rows.slice(-fit);
    if (!visible.length) {
      ctx.fillStyle = COL.sys;
      ctx.fillText(irc.connected ? '*** the channel is quiet between fragments' : '*** connecting to #aethera…', PAD_X, TOP + 12);
    }
    visible.forEach((row, i) => {
      let x = PAD_X;
      const y = TOP + 12 + i * LINE_H;
      const tear = collapse ? Math.sin(y * 0.3 + t * 40) * 8 * collapse * (Math.random() < 0.3 ? 1 : 0) : 0;
      for (const c of row.chunks) {
        ctx.fillStyle = collapse > 0.2 && Math.random() < collapse * 0.4 ? COL.quit : c.color;
        ctx.globalAlpha = 1 - row.fresh * 0.6;
        ctx.fillText(c.text, x + tear, y);
        x += ctx.measureText(c.text).width;
      }
      ctx.globalAlpha = 1;
    });
    if (irc.collapse) {
      ctx.fillStyle = `rgba(248,81,73,${0.08 * collapse})`;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = COL.quit;
      ctx.font = `11px ${MONO}`;
      ctx.textAlign = 'right';
      ctx.fillText(`*** ${irc.collapse.type}`, W - PAD_X, H - 14);
      ctx.textAlign = 'left';
    }
  }
}
