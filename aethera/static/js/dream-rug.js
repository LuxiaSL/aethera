/*
 * DreamRug — everything that isn't the stage or the dream is swept under the rug.
 *
 * The stage's bottom-left corner lifts when the pointer drifts near, folds back
 * as a heavy sheet when clicked, tapped or dragged, and reveals backstage: the
 * frame count, the chronicle, who's watching, the small print. DreamStage draws
 * the fold; this module decides where the crease is and clips the backstage
 * links to exactly the revealed region, so they are only reachable when shown.
 *
 * Once, a few seconds after load, the corner breathes (lifts and settles) so
 * people learn it's there. Keyboard users get a "backstage" button that is the
 * first tab stop and only visible when focused. Escape or a click on the stage
 * lays the rug back down.
 */
(function (global) {
    'use strict';

    const N0 = (() => { const x = 0.78, y = -0.62, l = Math.hypot(x, y); return [x / l, y / l]; })();

    class DreamRug {
        /** backstage: the clipped layer; door: the keyboard button; reduced: prefers-reduced-motion */
        constructor({ backstage, door, reduced }) {
            this.backstage = backstage;
            this.door = door;
            this.reduced = !!reduced;
            this.open = false;
            this.dragging = false;
            this.moved = false;
            this.grab = null;
            this.ptr = null;
            this.held = null;
            this.dist = 0;
            this.start = performance.now();
            this._poly = '';
            this._bind();
        }

        _openDist() { return Math.max(200, Math.min(250, Math.min(innerWidth, innerHeight) * 0.3)); }
        _corner(p) { return Math.hypot(p[0], innerHeight - p[1]); }

        setOpen(open) {
            this.open = open;
            this.door.setAttribute('aria-expanded', String(open));
            this.door.textContent = open ? 'close backstage' : 'backstage';
            this.backstage.inert = !open;
        }

        _bind() {
            const pt = e => [e.clientX, e.clientY];
            this.door.addEventListener('click', () => {
                this.setOpen(!this.open);
                if (this.open) setTimeout(() => this.backstage.querySelector('a')?.focus(), 300);
            });
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape' && this.open) { this.setOpen(false); this.door.focus(); }
            });
            addEventListener('pointermove', e => {
                this.ptr = pt(e);
                if (this.dragging && Math.hypot(this.ptr[0] - this.grab[0], this.ptr[1] - this.grab[1]) > 6) this.moved = true;
                document.body.classList.toggle('rug-near', !this.open && this._corner(this.ptr) < 140);
            });
            document.documentElement.addEventListener('pointerleave', () => { this.ptr = null; });
            addEventListener('pointerdown', e => {
                if (e.target.closest && e.target.closest('a, button, input, .dream-error, .dream-debug-chip')) return;
                const p = pt(e);
                if (this._corner(p) < 150 || (this.open && this._corner(p) < this._openDist() * 2.2)) {
                    this.dragging = true;
                    this.moved = false;
                    this.grab = p;
                    this.ptr = p;
                    const d0 = Math.max(this.dist, 0);                   // pick it up where it is
                    this.held = [2 * d0 * N0[0], innerHeight + 2 * d0 * N0[1]];
                    document.body.classList.add('rug-dragging');
                } else if (this.open) {
                    this.setOpen(false);                                 // a click on the stage lays it down
                }
            });
            addEventListener('pointerup', () => {
                if (!this.dragging) return;
                this.dragging = false;
                document.body.classList.remove('rug-dragging');
                const pulled = this.held ? this._corner(this.held) : 0;
                if (this.held) this.dist = pulled / 2;                   // let go from where the sheet is
                this.held = null;
                if (!this.moved) this.setOpen(!this.open);               // a tap toggles
                else this.setOpen(pulled > 150);                         // a drag past halfway stays open
            });
        }

        _target(now) {
            if (this.open) return this._openDist();
            let d = 0;
            if (this.ptr) { const r = this._corner(this.ptr); if (r < 260) d = 34 * Math.pow(1 - r / 260, 2); }
            const t = (now - this.start) / 1000;                         // once: the curtain breathes
            if (!this.reduced && t > 3.5 && t < 5.7) d = Math.max(d, 38 * Math.sin(Math.PI * (t - 3.5) / 2.2));
            return d;
        }

        /** The fold for this frame ({ n, d } or null when flat); also clips the backstage layer. */
        fold(now, dt) {
            const C = [0, innerHeight];
            let f = null;
            if (this.dragging && this.ptr) {
                // the corner has weight: it follows the hand a beat behind
                const k = this.reduced ? 1 : 1 - Math.exp(-dt * 11);
                this.held = this.held
                    ? [this.held[0] + (this.ptr[0] - this.held[0]) * k, this.held[1] + (this.ptr[1] - this.held[1]) * k]
                    : this.ptr.slice();
                const v = [this.held[0] - C[0], this.held[1] - C[1]], l = Math.hypot(v[0], v[1]);
                if (l >= 6) {
                    const n = [v[0] / l, v[1] / l];
                    this.dist = l / 2;
                    f = { n, d: n[0] * C[0] + n[1] * C[1] + l / 2 };
                }
            } else {
                // heavy cloth: slower to lift, firmer to fall; an exponential ease can't overshoot
                const goal = this._target(now);
                this.dist = this.reduced ? goal : goal + (this.dist - goal) * Math.exp(-dt * (goal > this.dist ? 4.2 : 6.5));
                if (this.dist >= 0.4) f = { n: N0, d: N0[0] * C[0] + N0[1] * C[1] + this.dist };
            }
            const poly = DreamRug.reveal(f);
            if (poly !== this._poly) { this.backstage.style.clipPath = poly; this._poly = poly; }
            return f;
        }

        /** The screen on the corner's side of the crease, as a CSS clip-path. */
        static reveal(f) {
            const none = 'polygon(0 0, 0 0, 0 0)';
            if (!f) return none;
            const W = innerWidth, H = innerHeight;
            const pts = [[0, 0], [W, 0], [W, H], [0, H]], out = [];
            const side = p => p[0] * f.n[0] + p[1] * f.n[1] - f.d;       // < 0: revealed
            for (let i = 0; i < 4; i++) {
                const a = pts[i], b = pts[(i + 1) % 4], sa = side(a), sb = side(b);
                if (sa <= 0) out.push(a);
                if ((sa < 0) !== (sb < 0)) { const t = sa / (sa - sb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
            }
            return out.length < 3 ? none : 'polygon(' + out.map(p => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(', ') + ')';
        }
    }

    global.DreamRug = DreamRug;
})(window);
