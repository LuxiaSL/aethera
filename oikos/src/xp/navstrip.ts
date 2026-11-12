/**
 * navstrip.ts — the browser on a tuned-in screen.
 *
 * Tuned in, a screen is a small browser: back and forward inside the page,
 * the page's real address (it follows every link you take, and a path typed
 * into it goes there), reload, go to the page itself, and tune out.
 *
 * The page's history is kept here, not in the browser's: every navigation the
 * strip makes is a location.replace, and links inside the page are taken over
 * the same way, so Back and Forward here never reach past the page into the
 * room's own routes, and the browser's own Back stays the room's.
 *
 * Two kinds of link never load on the glass: a link back to the room (it would
 * boot a second room inside this one), which tunes out instead; and a link to
 * another site (most refuse to be framed), which opens in a new window.
 */

import { h } from './chrome';

const ICON = {
  back: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  forward: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  reload: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M12.6 6A5 5 0 1 0 13 9.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13.4 2.6v3.8H9.6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  go: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.5 2.5h4v4M13.5 2.5 8.5 7.5M6.5 13.5h-4v-4M2.5 13.5l5-5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  out: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 3.5 9 9m0-9-9 9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
};

/** paths that are the room itself, wherever it's served */
const ROOM_PATHS = new Set(['/', '/oikos', '/oikos/', '/~']);

export function isRoomUrl(url: URL): boolean {
  return url.origin === location.origin && ROOM_PATHS.has(url.pathname);
}

export interface NavStripHooks {
  /** close the screen: back to the room */
  tuneOut(): void;
  /** leave the room for this page, at this address */
  leave(href: string): void;
}

type Pending = 'go' | 'back' | 'forward' | 'reload';

export class NavStrip {
  readonly el: HTMLElement;
  private readonly frame: HTMLIFrameElement;
  private readonly hooks: NavStripHooks;
  private readonly backBtn: HTMLButtonElement;
  private readonly forwardBtn: HTMLButtonElement;
  private readonly input: HTMLInputElement;
  /** the page's own history: same-origin paths, newest last */
  private stack: string[] = [];
  private i = -1;
  private pending: Pending | null = null;

  constructor(frame: HTMLIFrameElement, title: string, hooks: NavStripHooks) {
    this.frame = frame;
    this.hooks = hooks;
    this.el = h('div', { class: 'oikos-tuned', role: 'toolbar', 'aria-label': title });
    const button = (name: string, html: string, run: () => void): HTMLButtonElement => {
      const b = h('button', { type: 'button', class: 'nb', 'aria-label': name, title: name, html }) as HTMLButtonElement;
      b.addEventListener('click', run);
      return b;
    };
    this.backBtn = button('Back', ICON.back, () => this.step(-1));
    this.forwardBtn = button('Forward', ICON.forward, () => this.step(1));
    const reload = button('Reload', ICON.reload, () => this.reload());
    const addr = h('label', { class: 'addr' });
    addr.append(h('span', { class: 'host' }, [location.host]));
    this.input = h('input', { type: 'text', spellcheck: 'false', autocomplete: 'off', 'aria-label': 'Address' }) as HTMLInputElement;
    this.input.addEventListener('focus', () => this.input.select());
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.open(this.input.value);
        this.frame.focus();
      } else if (e.key === 'Escape' && this.input.value !== this.current()) {
        // the first Esc puts the address back; the next one tunes out
        e.preventDefault();
        this.input.value = this.current();
      }
    });
    addr.append(this.input);
    const go = button('Go to this page', ICON.go, () => this.hooks.leave(this.current() || '/'));
    const out = button('Tune Out', ICON.out, () => this.hooks.tuneOut());
    this.el.append(this.backBtn, this.forwardBtn, reload, addr, go, out, h('i', { class: 'load' }));
    frame.addEventListener('load', () => this.loaded());
    this.loading(true);
    this.render();
  }

  /** put the strip along the top edge of the glass (inside it when there's no room above) */
  place(r: DOMRectReadOnly): void {
    const height = this.el.offsetHeight || 32;
    const top = r.top - height - 6 >= 4 ? r.top - height - 6 : r.top + 4;
    this.el.style.left = `${Math.max(4, r.left)}px`;
    this.el.style.width = `${Math.max(240, Math.min(r.width, innerWidth - 8))}px`;
    this.el.style.top = `${top}px`;
  }

  private current(): string {
    return this.stack[this.i] ?? '';
  }

  private win(): Window | null {
    try {
      // touching location throws for another origin: then we can't drive it
      void this.frame.contentWindow?.location.href;
      return this.frame.contentWindow;
    } catch {
      return null;
    }
  }

  private navigate(path: string, kind: Pending): void {
    const w = this.win();
    if (!w) return;
    this.pending = kind;
    this.loading(true);
    w.location.replace(path);
  }

  private step(d: -1 | 1): void {
    const to = this.stack[this.i + d];
    if (to !== undefined) this.navigate(to, d < 0 ? 'back' : 'forward');
  }

  private reload(): void {
    const w = this.win();
    if (!w) return;
    this.pending = 'reload';
    this.loading(true);
    w.location.reload();
  }

  /** a typed address, or a link taken inside the page */
  private open(raw: string): void {
    let url: URL;
    try {
      url = new URL(raw.trim() || '/', location.origin);
    } catch {
      this.input.value = this.current();
      return;
    }
    if (url.origin !== location.origin) {
      window.open(url.href, '_blank', 'noopener');
      this.input.value = this.current();
      return;
    }
    if (isRoomUrl(url)) {
      this.hooks.tuneOut();
      return;
    }
    this.navigate(url.pathname + url.search + url.hash, 'go');
  }

  private loaded(): void {
    this.loading(false);
    const w = this.win();
    if (!w) {
      this.pending = null;
      this.render();
      return;
    }
    const url = new URL(w.location.href);
    // the page sent itself back to the room (a redirect, a script): never boot it on the glass
    if (isRoomUrl(url) && w.document.getElementById('oikos')) {
      this.hooks.tuneOut();
      return;
    }
    this.dress(w.document);
    const here = url.pathname + url.search + url.hash;
    const kind = this.pending;
    this.pending = null;
    if (kind === 'back') this.i = Math.max(0, this.i - 1);
    else if (kind === 'forward') this.i = Math.min(this.stack.length - 1, this.i + 1);
    if (kind === 'reload' || kind === 'back' || kind === 'forward') this.stack[this.i] = here;
    else if (here !== this.current()) {
      // a link we took, or a navigation the page made by itself
      this.stack = this.stack.slice(0, this.i + 1);
      this.stack.push(here);
      this.i = this.stack.length - 1;
    }
    this.watch(w);
    this.render();
  }

  /**
   * A plain-text page (llms.txt, a post's .txt) has no background of its own:
   * on the tube it would be black on black. Read it as the tube would show it.
   */
  private dress(doc: Document): void {
    try {
      if (doc.contentType !== 'text/plain' || !doc.head) return;
      const style = doc.createElement('style');
      style.textContent =
        "html { background: #0c0605; color: #ead2b6; color-scheme: dark; }" +
        "body { margin: 0; padding: 28px 34px; }" +
        "pre { font: 15px/1.6 'IBM Plex Mono', ui-monospace, monospace; white-space: pre-wrap; text-shadow: 0 0 6px rgba(255, 140, 60, 0.25); }";
      doc.head.append(style);
    } catch {
      /* not ours to dress */
    }
  }

  /** take over the page's links (see the header), and show a load as it starts */
  private watch(w: Window): void {
    w.addEventListener('pagehide', () => this.loading(true));
    w.addEventListener(
      'click',
      (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
        if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
        let url: URL;
        try {
          url = new URL(a.href, w.location.href);
        } catch {
          return;
        }
        if (!/^https?:$/.test(url.protocol)) return; // mailto: and the like: the browser's business
        // a jump within the same page: let it scroll
        const cur = new URL(w.location.href);
        if (url.origin === cur.origin && url.pathname === cur.pathname && url.search === cur.search && url.hash) return;
        // ahead of the page's own handlers (htmx's boost among them)
        e.preventDefault();
        e.stopImmediatePropagation();
        this.open(url.href);
      },
      true,
    );
  }

  private loading(on: boolean): void {
    this.el.classList.toggle('loading', on);
  }

  private render(): void {
    this.backBtn.disabled = this.i <= 0;
    this.forwardBtn.disabled = this.i >= this.stack.length - 1;
    if (document.activeElement !== this.input) this.input.value = this.current();
  }
}
