/**
 * afterlife — the real universe, on a small terminal.
 *
 * Not a picture of it: this is afterlife's own engine and terminal renderer
 * (imported from ../afterlife/src), on a 64×24 terminal the size of the tube,
 * at no more than GENS_PER_SEC generations a second however fast the screen
 * is drawn. If this browser has a universe saved at /afterlife, the screen
 * adopts it, generation and all, and the ticker says so; otherwise it runs a
 * genesis of its own. The world here is only 5× the view (life.py's 400×800
 * floor would cost a 320k-cell step per frame for a 64-column tube), so a
 * bigger save is cropped to its centre, in memory. It never saves, so that
 * crop never reaches yours: it only moves when you're at /afterlife (the
 * screen is a view of the place, like syrinx's screen is of the creature).
 * No sound here either.
 */

import { InfiniteLife } from '../../../afterlife/src/engine/life';
import { load } from '../../../afterlife/src/engine/persist';
import { Terminal } from '../../../afterlife/src/term/render';
import type { Site, UniverseInfo } from '../data';
import { H, Screen, W, type ScreenEnv } from './screen';

/** Focused screens draw at 30 fps; the universe doesn't need to keep up. */
const GENS_PER_SEC = 15;
/** a small world: 5× the view, not life.py's floor */
const SMALL_WORLD = { minH: 0, minW: 0 };

export class AfterlifeScreen extends Screen {
  private term: Terminal;
  private life: InfiniteLife | null = null;
  private seenSave: UniverseInfo | null | undefined = undefined;
  private genAcc = 1 / GENS_PER_SEC; // step on the first draw

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
    const life = new InfiniteLife(this.term.gridRows, this.term.cols, !save, SMALL_WORLD);
    if (save) {
      life.adopt(save);
      life.ticker.queueSpecial(`the universe remembers generation ${life.generation.toLocaleString('en-US')}`);
    }
    this.life = life;
  }

  protected draw(_t: number, dt: number): void {
    this.sync();
    const life = this.life;
    if (!life) return;
    // one generation at most per draw; the remainder carries (so 30 fps
    // gives 15/s, not 10), but a slow or hidden spell is dropped, not replayed
    const period = 1 / GENS_PER_SEC;
    this.genAcc += dt;
    if (this.genAcc < period) return;
    this.genAcc = Math.min(this.genAcc - period, period);
    life.step();
    if (life.generation > 0 && life.generation % 150 === 0) life.takeCensus();
    const st = this.term.status(life, '');
    if (st.tickerWidth >= 10) life.tickTicker(st.tickerWidth);
    this.term.render(life, st, false);
  }
}
