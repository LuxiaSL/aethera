import type { CharGrid } from './chargrid';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private cellW: number;
  private cellH: number;
  private cols: number;
  private rows: number;
  private fontReady = false;

  constructor(
    private canvas: HTMLCanvasElement,
    cols: number,
    rows: number,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get 2d context');
    this.ctx = ctx;
    this.cols = cols;
    this.rows = rows;

    this.cellW = 0;
    this.cellH = 0;
    this.computeCellSize();
  }

  private computeCellSize(): void {
    this.ctx.font = '14px LibertinusMono, Consolas, Monaco, monospace';

    const metrics = this.ctx.measureText('M');
    this.cellW = Math.ceil(metrics.width);
    if (this.cellW < 1) this.cellW = 8;
    this.cellH = 16;

    this.canvas.width = this.cols * this.cellW;
    this.canvas.height = this.rows * this.cellH;
    this.fontReady = true;
  }

  resize(cols: number, rows: number): void {
    this.cols = cols;
    this.rows = rows;
    this.computeCellSize();
  }

  getDimensions(): { cols: number; rows: number } {
    return { cols: this.cols, rows: this.rows };
  }

  static fitToContainer(canvas: HTMLCanvasElement): { cols: number; rows: number } {
    const rect = canvas.getBoundingClientRect();
    const cellW = 8;
    const cellH = 14;
    const cols = Math.max(60, Math.floor(rect.width / cellW));
    const rows = Math.max(20, Math.floor(rect.height / cellH));
    return { cols, rows };
  }

  render(grid: CharGrid): void {
    if (!this.fontReady) return;

    const ctx = this.ctx;
    const cellW = this.cellW;
    const cellH = this.cellH;
    const width = grid.width;
    const height = grid.height;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.font = '14px LibertinusMono, Consolas, Monaco, monospace';
    ctx.textBaseline = 'top';

    let currentStyle = '';
    const baselineOffset = 1;

    for (let row = 0; row < height; row++) {
      const y = row * cellH + baselineOffset;
      const base = row * width;
      for (let col = 0; col < width; col++) {
        const cell = grid.cells[base + col];
        if (cell.char === ' ') continue;

        if (cell.style !== currentStyle) {
          currentStyle = cell.style;
          ctx.fillStyle = currentStyle || '#00ff41';
        }

        ctx.fillText(cell.char, col * cellW, y);
      }
    }
  }
}
