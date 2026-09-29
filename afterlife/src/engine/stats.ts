/**
 * stats.ts — engine telemetry, for post-hoc tuning.
 *
 * life.py always logs to life_stats.csv beside itself. A page has no "beside
 * itself", so the log is kept in memory (the newest MAX_LINES rows) and the
 * keys panel offers it as a download under the same name and header.
 */

const HEADER = 'gen,time_s,total_pop,spread_150,pop_floor,cycle_period,zoom,cam_y,cam_x,event\n';
const MAX_LINES = 50_000;

export interface StatsRow {
  gen: number;
  pop: number;
  spread: number;
  floor: number;
  cycle: number;
  zoom: number;
  camY: number;
  camX: number;
  event?: string;
}

export class StatsLogger {
  private lines: string[] = [];
  private readonly t0 = performance.now();

  log(r: StatsRow): void {
    const t = (performance.now() - this.t0) / 1000;
    this.lines.push(
      `${r.gen},${t.toFixed(1)},${r.pop},${r.spread},${r.floor},${r.cycle},${r.zoom},${r.camY},${r.camX},${r.event ?? ''}\n`,
    );
    if (this.lines.length > MAX_LINES * 1.2) this.lines = this.lines.slice(-MAX_LINES);
  }

  get length(): number {
    return this.lines.length;
  }

  csv(): string {
    return HEADER + this.lines.join('');
  }
}
