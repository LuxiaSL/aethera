/**
 * wm.ts — windows: open, focus, drag, minimise, maximise, close.
 *
 * Deliberately small. One window per id (opening an open window focuses it);
 * the most recently focused is active and the rest go pale, as in Luna. The
 * taskbar subscribes to changes and draws a button per window.
 */

export interface WindowOpts {
  id: string;
  title: string;
  icon: string; // svg markup
  body: HTMLElement;
  width: number;
  x?: number;
  y?: number;
  dock?: 'left' | 'right' | 'center';
  dialog?: boolean;
  onClose?: () => void;
  onFocus?: () => void;
}

export class XPWindow {
  readonly el: HTMLElement;
  minimized = false;
  closed = false;

  constructor(
    readonly opts: WindowOpts,
    private readonly wm: WindowManager,
  ) {
    const el = document.createElement('section');
    el.className = `xp-window${opts.dialog ? ' xp-dialog' : ''}`;
    el.setAttribute('role', opts.dialog ? 'alertdialog' : 'dialog');
    el.setAttribute('aria-label', opts.title);
    el.innerHTML = `
      <header class="xp-titlebar">
        <span class="xp-title-icon">${opts.icon}</span>
        <span class="xp-title"></span>
        <span class="xp-controls">
          ${opts.dialog ? '' : '<button class="xp-min" aria-label="Minimize" title="Minimize"></button><button class="xp-max" aria-label="Maximize" title="Maximize"></button>'}
          <button class="xp-close" aria-label="Close" title="Close"></button>
        </span>
      </header>`;
    const title = el.querySelector('.xp-title');
    if (title) title.textContent = opts.title;
    el.append(opts.body);
    el.style.width = `${opts.width}px`;
    this.el = el;

    el.querySelector('.xp-close')?.addEventListener('click', () => this.close());
    el.querySelector('.xp-min')?.addEventListener('click', () => this.minimize());
    el.querySelector('.xp-max')?.addEventListener('click', () => this.toggleMax());
    el.addEventListener('pointerdown', () => this.focus(), true);
    this.bindDrag(el.querySelector('.xp-titlebar') as HTMLElement);
    el.querySelector('.xp-titlebar')?.addEventListener('dblclick', (e) => {
      if ((e.target as HTMLElement).closest('.xp-controls') || opts.dialog) return;
      this.toggleMax();
    });
  }

  setTitle(t: string): void {
    const title = this.el.querySelector('.xp-title');
    if (title) title.textContent = t;
    this.el.setAttribute('aria-label', t);
  }

  place(desk: HTMLElement): void {
    const W = desk.clientWidth;
    const H = desk.clientHeight;
    const w = Math.min(this.opts.width, W - 16);
    this.el.style.width = `${w}px`;
    desk.append(this.el);
    const h = Math.min(this.el.offsetHeight, H - 16);
    let x = this.opts.x ?? 0;
    let y = this.opts.y ?? 0;
    if (this.opts.x === undefined) {
      if (this.opts.dock === 'left') x = 18;
      else if (this.opts.dock === 'right') x = W - w - 18;
      else x = (W - w) / 2;
    }
    if (this.opts.y === undefined) y = this.opts.dialog ? (H - h) / 2.4 : Math.max(8, Math.min(60, (H - h) / 2));
    this.moveTo(x, y);
  }

  moveTo(x: number, y: number): void {
    const desk = this.el.parentElement;
    if (!desk) return;
    const maxX = desk.clientWidth - 60;
    const maxY = desk.clientHeight - 30;
    this.el.style.left = `${Math.round(Math.max(-this.el.offsetWidth + 80, Math.min(maxX, x)))}px`;
    this.el.style.top = `${Math.round(Math.max(0, Math.min(maxY, y)))}px`;
  }

  private bindDrag(bar: HTMLElement): void {
    let start: { x: number; y: number; left: number; top: number } | null = null;
    bar.addEventListener('pointerdown', (e) => {
      if ((e.target as HTMLElement).closest('.xp-controls')) return;
      if (this.el.classList.contains('maximized') || innerWidth <= 720) return;
      start = { x: e.clientX, y: e.clientY, left: this.el.offsetLeft, top: this.el.offsetTop };
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener('pointermove', (e) => {
      if (!start) return;
      this.moveTo(start.left + e.clientX - start.x, start.top + e.clientY - start.y);
    });
    const end = () => {
      if (start) this.wm.changed();
      start = null;
    };
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
  }

  focus(): void {
    this.wm.focus(this);
  }

  minimize(): void {
    this.minimized = true;
    this.el.classList.add('minimized');
    this.wm.focusTop();
    this.wm.changed();
  }

  restore(): void {
    this.minimized = false;
    this.el.classList.remove('minimized');
    this.focus();
  }

  toggleMax(): void {
    this.el.classList.toggle('maximized');
    this.wm.changed();
  }

  close(): void {
    if (this.closed) return;
    this.closed = true;
    this.el.remove();
    this.wm.remove(this);
    this.opts.onClose?.();
  }
}

export class WindowManager {
  private windows: XPWindow[] = [];
  private active: XPWindow | null = null;
  private z = 30;
  private listeners = new Set<() => void>();

  constructor(readonly desk: HTMLElement) {}

  get list(): readonly XPWindow[] {
    return this.windows;
  }

  get activeWindow(): XPWindow | null {
    return this.active;
  }

  get(id: string): XPWindow | undefined {
    return this.windows.find((w) => w.opts.id === id);
  }

  open(opts: WindowOpts): XPWindow {
    const existing = this.get(opts.id);
    if (existing) {
      if (existing.minimized) existing.restore();
      else existing.focus();
      return existing;
    }
    const w = new XPWindow(opts, this);
    this.windows.push(w);
    w.place(this.desk);
    this.focus(w);
    return w;
  }

  focus(w: XPWindow): void {
    if (w.closed) return;
    const changed = this.active !== w;
    this.active = w;
    w.el.style.zIndex = String(++this.z);
    for (const other of this.windows) other.el.classList.toggle('inactive', other !== w);
    if (changed) w.opts.onFocus?.();
    this.changed();
  }

  focusTop(): void {
    const visible = this.windows.filter((w) => !w.minimized);
    const top = visible.sort((a, b) => Number(b.el.style.zIndex) - Number(a.el.style.zIndex))[0];
    if (top) this.focus(top);
    else {
      this.active = null;
      this.changed();
    }
  }

  remove(w: XPWindow): void {
    this.windows = this.windows.filter((x) => x !== w);
    if (this.active === w) {
      this.active = null;
      this.focusTop();
    }
    this.changed();
  }

  closeTop(): boolean {
    const top = this.active && !this.active.minimized ? this.active : null;
    if (!top) return false;
    top.close();
    return true;
  }

  on(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  changed(): void {
    for (const fn of this.listeners) fn();
  }
}
