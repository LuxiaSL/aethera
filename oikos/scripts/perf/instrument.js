// Injected before any page script (page.addInitScript). Counts what the page
// does, without touching the page's code: GL calls per context, 2D canvas
// calls, rAF callbacks, timers, sockets, fetches. Read via window.__perf.
(() => {
  const P = (window.__perf = {
    t0: performance.now(),
    gl: new Map(), // canvas label -> counters
    c2d: { fillText: 0, fillRect: 0, drawImage: 0, stroke: 0, fill: 0, gradients: 0, measureText: 0, putImageData: 0, getImageData: 0 },
    raf: 0,
    timers: [], // {kind, delay, at, stack, cleared}
    sockets: [], // {url, at, closedAt}
    fetches: [], // {url, at}
    glAlive: { tex: 0, buf: 0, fb: 0, rb: 0, prog: 0 },
  });
  const label = (gl) => {
    const c = gl.canvas;
    return (c && (c.id || (c.isConnected ? c.className || 'canvas' : 'offscreen'))) || 'unknown';
  };
  const stat = (gl) => {
    const k = label(gl);
    let s = P.gl.get(k);
    if (!s) {
      s = { draws: 0, instancedDraws: 0, tris: 0, texUploads: 0, texBytes: 0, fbBinds: 0, programs: 0, clears: 0 };
      P.gl.set(k, s);
    }
    return s;
  };
  const sizeOf = (src) => (src && typeof src === 'object' && 'width' in src && 'height' in src ? src.width * src.height * 4 : 0);
  const triCount = (mode, count) => (mode === 4 ? count / 3 : mode === 5 || mode === 6 ? Math.max(0, count - 2) : 0);
  for (const Ctx of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!Ctx) continue;
    const p = Ctx.prototype;
    const wrap = (name, fn) => {
      const orig = p[name];
      if (!orig) return;
      p[name] = function (...a) {
        try {
          fn(this, a);
        } catch {}
        return orig.apply(this, a);
      };
    };
    wrap('drawArrays', (g, a) => { const s = stat(g); if (!s.firstDraw) s.firstDraw = Math.round(performance.now()); s.draws++; s.tris += triCount(a[0], a[2]); });
    wrap('drawElements', (g, a) => { const s = stat(g); if (!s.firstDraw) s.firstDraw = Math.round(performance.now()); s.draws++; s.tris += triCount(a[0], a[1]); });
    wrap('drawArraysInstanced', (g, a) => { const s = stat(g); s.draws++; s.instancedDraws++; s.tris += triCount(a[0], a[2]) * a[3]; });
    wrap('drawElementsInstanced', (g, a) => { const s = stat(g); s.draws++; s.instancedDraws++; s.tris += triCount(a[0], a[1]) * a[4]; });
    wrap('texImage2D', (g, a) => { const s = stat(g); s.texUploads++; s.texBytes += sizeOf(a[a.length - 1]) || (typeof a[3] === 'number' && typeof a[4] === 'number' ? a[3] * a[4] * 4 : 0); });
    wrap('texSubImage2D', (g, a) => { const s = stat(g); s.texUploads++; s.texBytes += sizeOf(a[a.length - 1]) || (typeof a[4] === 'number' && typeof a[5] === 'number' ? a[4] * a[5] * 4 : 0); });
    // allocations, for a VRAM estimate: {w,h,fmt,levels,kind}
    wrap('texStorage2D', (g, a) => { (P.allocs ||= []).push({ kind: 'texStorage2D', ctx: label(g), levels: a[1], fmt: a[2], w: a[3], h: a[4], at: Math.round(performance.now()) }); });
    wrap('renderbufferStorage', (g, a) => { (P.allocs ||= []).push({ kind: 'rb', ctx: label(g), fmt: a[1], w: a[2], h: a[3], at: Math.round(performance.now()) }); });
    wrap('renderbufferStorageMultisample', (g, a) => { (P.allocs ||= []).push({ kind: 'rbMS', ctx: label(g), samples: a[1], fmt: a[2], w: a[3], h: a[4], at: Math.round(performance.now()) }); });
    wrap('bindFramebuffer', (g, a) => { const s = stat(g); s.fbBinds++; if (a[1] === null) s.screenBinds = (s.screenBinds ?? 0) + 1; });
    wrap('useProgram', (g) => { stat(g).programs++; });
    wrap('clear', (g) => { stat(g).clears++; });
    wrap('createTexture', () => P.glAlive.tex++);
    wrap('deleteTexture', () => P.glAlive.tex--);
    wrap('createBuffer', () => P.glAlive.buf++);
    wrap('deleteBuffer', () => P.glAlive.buf--);
    wrap('createFramebuffer', () => P.glAlive.fb++);
    wrap('deleteFramebuffer', () => P.glAlive.fb--);
    wrap('createRenderbuffer', () => P.glAlive.rb++);
    wrap('deleteRenderbuffer', () => P.glAlive.rb--);
    wrap('createProgram', () => P.glAlive.prog++);
    wrap('deleteProgram', () => P.glAlive.prog--);
  }
  const c2 = CanvasRenderingContext2D.prototype;
  for (const name of Object.keys(P.c2d)) {
    const real = name === 'gradients' ? null : c2[name];
    if (real) {
      c2[name] = function (...a) {
        P.c2d[name]++;
        return real.apply(this, a);
      };
    }
  }
  for (const g of ['createRadialGradient', 'createLinearGradient']) {
    const real = c2[g];
    c2[g] = function (...a) {
      P.c2d.gradients++;
      return real.apply(this, a);
    };
  }
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((t) => { P.raf++; cb(t); });
  const where = () => {
    const s = new Error().stack?.split('\n').slice(3, 5).map((l) => l.trim()).join(' | ') ?? '';
    return s.replace(/https?:\/\/[^/]+/g, '');
  };
  const si = window.setInterval.bind(window);
  const ci = window.clearInterval.bind(window);
  window.setInterval = (fn, delay, ...rest) => {
    const id = si(fn, delay, ...rest);
    P.timers.push({ kind: 'interval', id, delay, at: Math.round(performance.now()), stack: where(), cleared: false });
    return id;
  };
  window.clearInterval = (id) => {
    for (const t of P.timers) if (t.kind === 'interval' && t.id === id) t.cleared = true;
    return ci(id);
  };
  const RealWS = window.WebSocket;
  window.WebSocket = class extends RealWS {
    constructor(url, proto) {
      super(url, proto);
      const rec = { url: String(url).replace(/^wss?:\/\/[^/]+/, ''), at: Math.round(performance.now()), closedAt: null };
      P.sockets.push(rec);
      this.addEventListener('close', () => (rec.closedAt = Math.round(performance.now())));
    }
  };
  const rf = window.fetch.bind(window);
  window.fetch = (input, init) => {
    P.fetches.push({ url: String(typeof input === 'string' ? input : input.url).replace(/^https?:\/\/[^/]+/, ''), at: Math.round(performance.now()) });
    return rf(input, init);
  };
  P.longtasks = [];
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) P.longtasks.push({ start: Math.round(e.startTime), dur: Math.round(e.duration) }); }).observe({ type: 'longtask', buffered: true });
  } catch {}
  P.marks = {};
  const watchBoot = () => {
    const b = document.getElementById('oikos-boot');
    if (!b) return false;
    new MutationObserver(() => { if (b.classList.contains('gone') && !P.marks.bootGone) P.marks.bootGone = Math.round(performance.now()); }).observe(b, { attributes: true });
    return true;
  };
  document.addEventListener('DOMContentLoaded', () => { P.marks.dcl = Math.round(performance.now()); watchBoot(); });
  addEventListener('load', () => (P.marks.load = Math.round(performance.now())));
  P.snapshot = () => ({
    t: performance.now(),
    gl: Object.fromEntries([...P.gl].map(([k, v]) => [k, { ...v }])),
    c2d: { ...P.c2d },
    raf: P.raf,
    glAlive: { ...P.glAlive },
    activeIntervals: P.timers.filter((t) => t.kind === 'interval' && !t.cleared).length,
    sockets: P.sockets.filter((s) => s.closedAt === null).map((s) => s.url),
    fetchCount: P.fetches.length,
  });
})();
