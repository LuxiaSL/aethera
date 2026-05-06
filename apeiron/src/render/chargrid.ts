export interface Cell {
  char: string;
  style: string;
  depth: number;
}

export class CharGrid {
  cells: Cell[];
  zbuf: Float64Array;
  fxScratch: Cell[] | null = null;
  time = 0.0;

  constructor(
    public width: number,
    public height: number
  ) {
    const n = width * height;
    this.cells = new Array(n);
    for (let i = 0; i < n; i++) {
      this.cells[i] = { char: ' ', style: '', depth: 1.0 };
    }
    this.zbuf = new Float64Array(n).fill(1.0);
  }

  inBounds(col: number, row: number): boolean {
    return col >= 0 && col < this.width && row >= 0 && row < this.height;
  }

  get(col: number, row: number): Cell {
    if (!this.inBounds(col, row)) return { char: ' ', style: '', depth: 1.0 };
    return this.cells[row * this.width + col];
  }

  write(col: number, row: number, char: string, style: string, depth: number): boolean {
    if (!this.inBounds(col, row)) return false;
    const idx = row * this.width + col;
    if (depth < this.zbuf[idx]) {
      this.zbuf[idx] = depth;
      const cell = this.cells[idx];
      cell.char = char;
      cell.style = style;
      cell.depth = depth;
      return true;
    }
    return false;
  }

  clear(): void {
    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i];
      cell.char = ' ';
      cell.style = '';
      cell.depth = 1.0;
      this.zbuf[i] = 1.0;
    }
  }
}
