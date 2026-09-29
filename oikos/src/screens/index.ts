/**
 * Which painter plays which tape. A site added to the directory (oikos.py)
 * without a painter here still gets a screen: colour bars and its name, the
 * universal sign for "this channel exists, nobody has programmed it yet".
 */

import type { Site } from '../data';
import { AfterlifeScreen } from './afterlife';
import { ApeironScreen } from './apeiron';
import { ChronicleScreen } from './chronicle';
import { DreamGenScreen } from './dreamGen';
import { DreamsScreen } from './dreams';
import { DreamsApiScreen } from './dreamsApi';
import { IrcScreen } from './irc';
import { ParlorScreen } from './parlor';
import { H, MONO, Screen, W, type ScreenEnv } from './screen';
import { SyrinxScreen } from './syrinx';
import { TransmissionsScreen } from './transmissions';

export { Screen } from './screen';
export type { ScreenEnv } from './screen';

const PAINTERS: Record<string, new (site: Site, env: ScreenEnv) => Screen> = {
  transmissions: TransmissionsScreen,
  dreams: DreamsScreen,
  chronicle: ChronicleScreen,
  'dreams-api': DreamsApiScreen,
  apeiron: ApeironScreen,
  syrinx: SyrinxScreen,
  afterlife: AfterlifeScreen,
  irc: IrcScreen,
  parlor: ParlorScreen,
  dream_gen: DreamGenScreen,
};

class TestCard extends Screen {
  protected draw(t: number): void {
    const ctx = this.ctx;
    const bars = ['#c0c0c0', '#c0c000', '#00c0c0', '#00c000', '#c000c0', '#c00000', '#0000c0'];
    bars.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.fillRect((i * W) / bars.length, 0, W / bars.length + 1, H * 0.66);
    });
    ctx.fillStyle = '#111';
    ctx.fillRect(0, H * 0.66, W, H * 0.34);
    ctx.fillStyle = '#fff';
    ctx.font = `22px ${MONO}`;
    ctx.textAlign = 'center';
    ctx.fillText(this.site.title, W / 2, H * 0.82);
    ctx.font = `12px ${MONO}`;
    ctx.fillStyle = Math.floor(t) % 2 ? '#888' : '#555';
    ctx.fillText('no programme yet', W / 2, H * 0.92);
    ctx.textAlign = 'left';
  }
}

export function makeScreen(site: Site, env: ScreenEnv): Screen {
  const Painter = PAINTERS[site.id] ?? TestCard;
  return new Painter(site, env);
}
