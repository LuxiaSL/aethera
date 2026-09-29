/**
 * afterlife — the real universe, on a small terminal.
 *
 * Not a picture of it: this is afterlife's own engine and terminal renderer
 * (imported from ../afterlife/src), stepping at the screen's frame rate on a
 * 64×24 terminal the size of the tube. If this browser has a universe saved
 * at /afterlife, the screen adopts it, generation and all, and the ticker says
 * so; otherwise it runs a genesis of its own. It never saves: yours only
 * moves when you're at /afterlife (the screen is a view of the place, like
 * syrinx's screen is of the creature). No sound here either.
 */

import { InfiniteLife } from '../../../afterlife/src/engine/life';
import { load } from '../../../afterlife/src/engine/persist';
import { Terminal } from '../../../afterlife/src/term/render';
import type { Site, UniverseInfo } from '../data';
import { H, Screen, W, type ScreenEnv } from './screen';

export class AfterlifeScreen extends Screen {
  private term: Terminal;
  private life: InfiniteLife | null = null;
  private seenSave: UniverseInfo | null | undefined = undefined;

  constructor(site: Site, env: ScreenEnv) {
    super(site, env);
    this.fps = 15;
    this.term = new Terminal(this.ctx);
    this.term.resize(W, H, 8);
  }

  private sync(): void {
    const info = this.env.feeds.universe.value;
    if (this.life && info?.savedAt === this.seenSave?.savedAt) return;
    this.seenSave = info;
    const save = info ? load() : null;
    const life = new InfiniteLife(this.term.gridRows, this.term.cols, !save);
    if (save) {
      life.adopt(save);
      life.ticker.queueSpecial(`the universe remembers generation ${life.generation.toLocaleString('en-US')}`);
    }
    this.life = life;
  }

  protected draw(): void {
    this.sync();
    const life = this.life;
    if (!life) return;
    life.step();
    if (life.generation > 0 && life.generation % 150 === 0) life.takeCensus();
    const st = this.term.status(life, '');
    if (st.tickerWidth >= 10) life.tickTicker(st.tickerWidth);
    this.term.render(life, st, false);
  }
}
