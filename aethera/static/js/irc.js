/**
 * IRC "Haunted Broadcast" — Public Viewer Client
 *
 * Opens a WebSocket to /ws/irc and renders the synchronized broadcast. The
 * SERVER paces the reveal (it sleeps each message's delayAfter between sends),
 * so this client just renders messages as they arrive.
 *
 * Two render paths:
 *   1. WebGL CRT (primary) — the transcript is drawn to an offscreen 2D canvas
 *      ("the tube"), which is fed as a texture to a fragment shader ported from
 *      luxia's ghostty CRT shaders (crt-glow / grain / moire / warmth / poweron):
 *      barrel warp, edge chromatic aberration, ripple glitch, crackling
 *      scanlines, holographic pixel-rain sparks, VHS wobble, heat shimmer,
 *      moire breathing, night-amber warmth, power-on raster expansion. A
 *      uCollapse uniform cranks everything as the channel dies.
 *   2. DOM (fallback) — the #irc-log list + CSS effects, for no-WebGL browsers.
 *      Kept underneath the canvas as the accessibility layer either way.
 *
 * Server → client messages (see api/irc.py):
 *   { type:'connected', channel } | { type:'message', data:{...} }
 *   { type:'collapse_start', collapseType } | { type:'fragment_end' }
 */

(function () {
    'use strict';

    // ---- Palette (mirrors the review tool) ----
    const COL = {
        bg: '#231f36',   // terminal fog: between dark gray and midnight purple
        fg: '#c9d1d9',
        dim: '#6e7681',
        accent: '#58a6ff',
        sys: '#8b949e',
        quit: '#f85149',
        action: '#a371f7',
        join: '#3fb950',
    };

    const NICK_COLORS = [
        '#58a6ff', '#3fb950', '#d29922', '#a371f7', '#f778ba', '#39c5cf',
        '#ff7b72', '#7ee787', '#ffa657', '#79c0ff', '#d2a8ff', '#56d364',
    ];

    function nickColor(n) {
        let h = 0;
        for (const c of n) h = (h * 31 + c.charCodeAt(0)) >>> 0;
        return NICK_COLORS[h % NICK_COLORS.length];
    }

    function esc(s) {
        return (s || '').replace(/[&<>]/g, (c) => (
            { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]
        ));
    }

    const MAX_LINES = 250;
    const FONT_PX = 15;
    const LINE_H = 1.5;
    // Edge-feather band widths — MUST match the CSS mask on .irc-screen so text
    // padding can clear the feather and stay inside the fully-opaque center.
    const FEATHER_X = 70;
    const FEATHER_Y = 56;
    const HEADER_ROWS = 2;

    // Build colored chunks for one IRC line (parallels the DOM renderer).
    function lineChunks(m) {
        const chunks = [{ text: `[${m.timestamp || ''}] `, color: COL.dim }];
        const t = m.type || 'message';
        const nk = m.nick || '';
        const ct = m.content || '';
        if (t === 'message') {
            chunks.push({ text: `<${nk}> `, color: nickColor(nk) });
            chunks.push({ text: ct, color: COL.fg });
        } else if (t === 'action') {
            chunks.push({ text: `* ${nk} ${ct}`, color: COL.action });
        } else if (t === 'quit') {
            chunks.push({ text: `⫫ ${nk} has quit${ct ? ` (${ct})` : ''}`, color: COL.quit });
        } else if (t === 'part') {
            chunks.push({ text: `← ${nk} has left${ct ? ` (${ct})` : ''}`, color: COL.sys });
        } else if (t === 'join') {
            chunks.push({ text: `→ ${nk} has joined`, color: COL.join });
        } else if (t === 'kick') {
            const meta = m.meta || {};
            chunks.push({ text: `⚠ ${meta.target || ''} was kicked by ${nk}${meta.reason ? ` (${meta.reason})` : ''}`, color: COL.quit });
        } else {
            chunks.push({ text: `*** ${ct || nk}`, color: COL.sys });
        }
        return chunks;
    }

    // ============================================================
    //  Tube renderer — transcript → offscreen 2D canvas (the texture)
    // ============================================================
    class TubeRenderer {
        constructor() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.w = 0; this.h = 0; this.dpr = 1;
            this.charW = 8; this.rowH = FONT_PX * LINE_H;
            this.cols = 80;
            this.channel = '#aethera';
        }

        resize(cssW, cssH, dpr) {
            this.dpr = dpr;
            this.w = Math.max(1, Math.floor(cssW * dpr));
            this.h = Math.max(1, Math.floor(cssH * dpr));
            this.canvas.width = this.w;
            this.canvas.height = this.h;
            this.rowH = FONT_PX * dpr * LINE_H;
        }

        _tokenize(text) { return text.match(/\s+|\S+/g) || []; }

        // Word-wrap one line by MEASURED pixel width (font-agnostic, so it's
        // correct regardless of whether the webfont has loaded or whether a
        // glyph is monospaced). Continuation rows hang-indent under the body.
        _wrapLine(m, startX, maxX, indent) {
            const ctx = this.ctx;
            const rows = [];
            let row = [];
            let lineStart = startX;
            let x = startX;
            const newRow = () => { rows.push(row); row = []; lineStart = startX + indent; x = lineStart; };
            const put = (text, color) => { const w = ctx.measureText(text).width; row.push({ text, color, x }); x += w; };

            for (const ch of lineChunks(m)) {
                for (const tok of this._tokenize(ch.text)) {
                    const w = ctx.measureText(tok).width;
                    const atStart = (x === lineStart);
                    if (!atStart && x + w > maxX) newRow();
                    if (x === lineStart && /^\s+$/.test(tok)) continue; // drop leading space after a wrap
                    if (w > maxX - lineStart) {
                        // token longer than a whole line → hard-break by chars
                        let cur = '';
                        for (const c of tok) {
                            if (x + ctx.measureText(cur + c).width > maxX && cur !== '') {
                                put(cur, ch.color); newRow(); cur = '';
                            }
                            cur += c;
                        }
                        if (cur !== '') put(cur, ch.color);
                    } else {
                        put(tok, ch.color);
                    }
                }
            }
            rows.push(row);
            return rows;
        }

        render(lines) {
            const ctx = this.ctx;
            const dpr = this.dpr;
            // Pad past the edge-feather band (mirrors the CSS breakpoint) so the
            // timestamps/header/text all sit inside the opaque center, never the fog.
            const cssW = this.w / dpr;
            const small = cssW < 768;
            const fx = small ? 28 : FEATHER_X;
            const fy = small ? 28 : FEATHER_Y;
            const padX = (fx + (small ? 12 : 18)) * dpr;
            const padY = (fy + (small ? 12 : 16)) * dpr;
            const rowH = FONT_PX * dpr * LINE_H;
            const maxX = this.w - padX;

            ctx.fillStyle = COL.bg;
            ctx.fillRect(0, 0, this.w, this.h);
            ctx.font = `${FONT_PX * dpr}px 'Libertinus Mono', 'JetBrains Mono', monospace`;
            ctx.textBaseline = 'top';

            // Header: channel + a dim rule out to the edge
            ctx.fillStyle = COL.accent;
            ctx.fillText(this.channel, padX, padY);
            const chW = ctx.measureText(this.channel).width;
            const dashW = ctx.measureText('─').width || (FONT_PX * dpr * 0.6);
            const dashes = Math.max(0, Math.floor((maxX - padX - chW - dashW) / dashW));
            if (dashes > 0) {
                ctx.fillStyle = COL.dim;
                ctx.fillText(' ' + '─'.repeat(dashes), padX + chW, padY);
            }

            const headerH = rowH * HEADER_ROWS;
            const areaTop = padY + headerH;
            const areaH = this.h - areaTop - padY;
            const maxRows = Math.max(1, Math.floor(areaH / rowH));

            const indent = ctx.measureText('[00:00:00] ').width;
            let allRows = [];
            for (const m of lines) {
                const rs = this._wrapLine(m, padX, maxX, indent);
                for (const r of rs) allRows.push(r);
            }

            const visible = allRows.slice(Math.max(0, allRows.length - maxRows));
            let y = areaTop;
            for (const r of visible) {
                for (const run of r) {
                    ctx.fillStyle = run.color;
                    ctx.fillText(run.text, run.x, y);
                }
                y += rowH;
            }
        }
    }

    // ============================================================
    //  CRT shader — WebGL post-process over the tube texture
    // ============================================================
    const VERT = `
        attribute vec2 a_pos;
        varying vec2 v_uv;
        void main(){ v_uv = a_pos*0.5+0.5; gl_Position = vec4(a_pos,0.0,1.0); }
    `;

    const FRAG = `
        precision highp float;
        varying vec2 v_uv;
        uniform sampler2D uTex;
        uniform vec2  uRes;
        uniform float uTime;     // seconds, monotonic
        uniform float uBoot;     // seconds since last tune-in
        uniform float uCollapse; // 0..1
        uniform float uReduce;   // 0/1
        uniform float uWarmth;   // 0..1 night amber

        const float TAU = 6.28318530718;

        float hash11(float p){ p=fract(p*0.1031); p*=p+33.33; p*=p+p; return fract(p); }
        float noise1(float x){ float i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f); return mix(hash11(i),hash11(i+1.0),f); }
        float hash21(vec2 p){ p=fract(p*vec2(234.34,435.345)); p+=dot(p,p+34.23); return fract(p.x*p.y); }

        void main(){
            vec2 uv = v_uv;                 // texture uploaded with FLIP_Y → upright
            vec2 fragCoord = uv * uRes;
            float t = uTime;
            float col = clamp(uCollapse, 0.0, 1.0);
            float motion = 1.0 - uReduce*0.85;

            // ---- barrel warp ----
            vec2 center = uv - 0.5;
            float dist2 = dot(center, center);
            float curve = 0.06 + col*0.06;
            vec2 dUV = uv + center * dist2 * curve;

            // ---- edge chromatic aberration ----
            float edgeW = smoothstep(0.04, 0.64, dist2);
            float aberr = (0.0016*(0.3+edgeW*0.7)) + col*0.011*(0.4+edgeW);

            // ---- ripple line glitch ----
            float every = mix(2.0, 0.55, col);
            float gseed = floor(t/every);
            float gActive = max(step(0.86, hash11(gseed)), step(0.0001,col)*step(0.45, hash11(gseed+7.0)));
            float gY = hash11(gseed+100.0);
            float el = t - gseed*every;
            float hold=0.12, rip=0.8;
            float phase = clamp((el-hold)/rip, 0.0, 1.0);
            float alive = gActive*step(0.0,el)*step(el,hold+rip);
            float front = phase*0.25;
            float dOrig = abs(uv.y-gY);
            float reach = smoothstep(front+0.003, front-0.003, dOrig);
            float wave = sin(dOrig*40.0 - el*12.0)*exp(-dOrig*10.0)*reach*alive;
            dUV.x += wave*0.008*(1.0-phase*0.6)*motion;

            // ---- crackling scanlines ----
            float band = alive*smoothstep(front+0.008,front-0.008,dOrig)*smoothstep(front-0.055,front-0.008,dOrig);
            float scanY = floor(fragCoord.y);
            float crackleT = floor(t*25.0);
            float crackle = step(0.70, hash11(scanY*0.1+crackleT*0.3+gseed))*band;
            dUV.x += crackle*(hash11(scanY+crackleT+gseed*2.0)*2.0-1.0)*0.016*motion;
            float crackleChroma = crackle*0.0025;

            // ---- collapse horizontal tearing ----
            float tear = step(0.78, hash11(scanY*0.05+floor(t*18.0)))*col;
            dUV.x += tear*(hash11(scanY+floor(t*18.0))*2.0-1.0)*0.04*motion;

            // ---- VHS wobble + heat shimmer ----
            float wob = noise1(uv.y*6.0+t*0.25)*0.0006 + noise1(uv.y*20.0+t*0.32)*0.0003;
            dUV.x += wob*motion;
            float heat = (sin(uv.x*12.0+t*0.3+uv.y*3.0)+sin(uv.x*7.0-t*0.2+uv.y*5.0)*0.6)*(uv.y)*0.0018;
            dUV.y += heat*motion;

            // ---- chromatic sampling ----
            vec2 rO = vec2(aberr*1.2+crackleChroma, aberr*0.3);
            vec2 gO = vec2(-aberr*0.2, -aberr*0.1);
            vec2 bO = vec2(-aberr*1.0-crackleChroma, aberr*0.4);
            float r = texture2D(uTex, dUV+rO).r;
            float g = texture2D(uTex, dUV+gO).g;
            float b = texture2D(uTex, dUV+bO).b;
            vec3 c = vec3(r,g,b);

            // ---- holographic pixel-rain sparks (glitch-synced) ----
            vec3 spark = vec3(0.0);
            for(int i=0;i<3;i++){
                float ps = gseed - float(i);
                float pa = max(step(0.86,hash11(ps)), col*step(0.6,hash11(ps+3.0)));
                float e2 = t - ps*every;
                if(pa*step(e2,1.0)*step(0.0,e2) < 0.5) continue;
                float sx = hash11(ps+800.0);
                float sy = hash11(ps+100.0) - e2*(0.15+hash11(ps+900.0)*0.08);
                vec2 tf = uv - vec2(sx, sy);
                float dd = dot(tf,tf);
                float rl = 0.006+hash11(ps+970.0)*0.006 + col*0.005;
                if(dd > (rl+0.003)*(rl+0.003)) continue;
                float d = sqrt(dd);
                float core = step(dd, 0.0025*0.0025)*0.95;
                float ang = atan(tf.y, tf.x);
                float nr = 3.0+floor(hash11(ps+950.0)*3.0);
                float ra = mod(ang+hash11(ps+960.0)*TAU, TAU)*(nr/TAU);
                float inray = step(abs(fract(ra)-0.5),0.08);
                float rb = inray*smoothstep(rl,0.001,d)*0.8;
                float s = max(core, rb*step(d,rl));
                float fade = 1.0 - clamp(e2,0.0,1.0);
                spark += s*fade*(0.5+0.5*cos(ang*2.0+vec3(0.0,2.094,4.188)));
            }
            c += spark*motion;

            // ---- grain ----
            float gn = hash21(fragCoord*0.5 + floor(t*24.0)) - 0.5;
            c += gn*(0.025 + col*0.11)*motion;

            // ---- moire breathing bands ----
            float aspect = uRes.x/uRes.y;
            vec2 cc = vec2(center.x*aspect, center.y);
            float breathe = sin(t*0.02)*0.02;
            float mA = sin((length(cc-vec2(0.012,0.0))+breathe)*200.0*TAU);
            float mB = sin((length(cc+vec2(0.012,0.0))-breathe)*200.0*TAU);
            float mo = smoothstep(0.4,0.7,mA*mB*0.5+0.5)*0.03;
            float edge = length(cc);
            mo *= smoothstep(0.1,0.3,edge)*smoothstep(0.9,0.5,edge);
            c += (mo-0.01)*0.012;

            // ---- scanlines + interlace ----
            float scan = sin(fragCoord.y)*0.045*motion + 1.0;
            float inter = sin(fragCoord.y*0.5 + t*6.0)*0.01*motion + 1.0;
            c *= scan*inter;

            // ---- warmth (night amber) ----
            c = mix(c, c*vec3(1.04,1.0,0.92), uWarmth*0.6);

            // ---- collapse desaturate + red bias ----
            float lum = dot(c, vec3(0.299,0.587,0.114));
            c = mix(c, vec3(lum)*vec3(1.25,0.66,0.66), col*0.55);

            // ---- vignette + flicker ----
            c *= (1.0 - dist2*(0.6+col*0.45));
            c *= (1.0 + sin(t*50.0)*0.003*motion + col*sin(t*80.0)*0.025*motion);

            // ---- power-on (raster expansion) ----
            float tb = uBoot;
            float boot = smoothstep(0.5, 1.5, tb);
            float halfH = boot*0.5;
            float rmask = smoothstep(0.5-halfH-0.01, 0.5-halfH+0.01, uv.y)
                        * smoothstep(0.5+halfH+0.01, 0.5+halfH-0.01, uv.y);
            float linePhase = smoothstep(0.15,0.3,tb)*(1.0-smoothstep(0.6,1.1,tb));
            float dm = abs(uv.y-0.5);
            float sigma = 0.002+smoothstep(0.4,0.7,tb)*0.02;
            float line = exp(-dm*dm/(sigma*sigma))*linePhase;
            vec3 bootCol = c*rmask + vec3(0.92,0.97,0.95)*line;
            vec3 outc = mix(bootCol, c, smoothstep(1.2, 2.6, tb)) * smoothstep(0.0,0.2,tb);

            // (edges are feathered into the page by a CSS mask on .irc-screen)
            gl_FragColor = vec4(outc, 1.0);
        }
    `;

    class CRTScreen {
        constructor(canvas, tube) {
            this.canvas = canvas;
            this.tube = tube;
            this.ok = false;
            this.collapse = 0;
            this.collapseTarget = 0;
            this.bootStart = 0;     // ms
            this.startTime = 0;     // ms
            this.reduce = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0;
            this.warmth = this._nightWarmth();
            this._raf = null;
            this._dirty = true;
            this._init();
        }

        _nightWarmth() {
            // Haunted late-night channel: warm at night, neutral midday.
            try {
                const h = new Date().getHours();
                const dayPhase = Math.cos((h - 12) / 12 * Math.PI);
                return Math.min(1, Math.max(0, (1 - dayPhase) * 0.5 + 0.25));
            } catch (e) { return 0.5; }
        }

        _compile(type, src) {
            const gl = this.gl;
            const sh = gl.createShader(type);
            gl.shaderSource(sh, src);
            gl.compileShader(sh);
            if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
                console.warn('IRC CRT shader compile error:', gl.getShaderInfoLog(sh));
                gl.deleteShader(sh);
                return null;
            }
            return sh;
        }

        _init() {
            let gl;
            try {
                gl = this.canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false })
                    || this.canvas.getContext('experimental-webgl');
            } catch (e) { gl = null; }
            if (!gl) return;
            this.gl = gl;

            const vs = this._compile(gl.VERTEX_SHADER, VERT);
            const fs = this._compile(gl.FRAGMENT_SHADER, FRAG);
            if (!vs || !fs) return;

            const prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                console.warn('IRC CRT link error:', gl.getProgramInfoLog(prog));
                return;
            }
            this.prog = prog;

            this.posLoc = gl.getAttribLocation(prog, 'a_pos');

            this.u = {
                tex: gl.getUniformLocation(prog, 'uTex'),
                res: gl.getUniformLocation(prog, 'uRes'),
                time: gl.getUniformLocation(prog, 'uTime'),
                boot: gl.getUniformLocation(prog, 'uBoot'),
                collapse: gl.getUniformLocation(prog, 'uCollapse'),
                reduce: gl.getUniformLocation(prog, 'uReduce'),
                warmth: gl.getUniformLocation(prog, 'uWarmth'),
            };

            this.tex = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            this.ok = true;
        }

        markDirty() { this._dirty = true; }

        setCollapse(v) { this.collapseTarget = v; }

        resize(cssW, cssH, dpr) {
            this.canvas.width = Math.max(1, Math.floor(cssW * dpr));
            this.canvas.height = Math.max(1, Math.floor(cssH * dpr));
            if (this.gl) this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            this.markDirty();
        }

        start() {
            if (!this.ok) return;
            this.startTime = performance.now();
            this.bootStart = this.startTime;
            const loop = (now) => {
                this._frame(now);
                this._raf = requestAnimationFrame(loop);
            };
            this._raf = requestAnimationFrame(loop);
        }

        stop() { if (this._raf) cancelAnimationFrame(this._raf); this._raf = null; }

        _frame(now) {
            const gl = this.gl;
            if (!gl) return;

            // Ease collapse toward target
            this.collapse += (this.collapseTarget - this.collapse) * 0.06;

            // Re-upload the tube texture only when it changed
            if (this._dirty) {
                gl.bindTexture(gl.TEXTURE_2D, this.tex);
                try {
                    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.tube.canvas);
                } catch (e) { /* tube not ready */ }
                this._dirty = false;
            }

            const tSec = (now - this.startTime) / 1000;
            const bootSec = (now - this.bootStart) / 1000;

            gl.useProgram(this.prog);
            gl.bindBuffer(gl.ARRAY_BUFFER, this._quad());
            gl.enableVertexAttribArray(this.posLoc);
            gl.vertexAttribPointer(this.posLoc, 2, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.tex);
            gl.uniform1i(this.u.tex, 0);
            gl.uniform2f(this.u.res, this.canvas.width, this.canvas.height);
            gl.uniform1f(this.u.time, tSec);
            gl.uniform1f(this.u.boot, bootSec);
            gl.uniform1f(this.u.collapse, this.collapse);
            gl.uniform1f(this.u.reduce, this.reduce);
            gl.uniform1f(this.u.warmth, this.warmth);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        _quad() {
            if (this._quadBuf) return this._quadBuf;
            const gl = this.gl;
            const b = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, b);
            gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            this._quadBuf = b;
            return b;
        }
    }

    // ============================================================
    //  Viewer — WS client + orchestration
    // ============================================================
    class IRCViewer {
        constructor() {
            this.screen = document.getElementById('irc-screen');
            this.glCanvas = document.getElementById('irc-gl');
            this.log = document.getElementById('irc-log');
            this.loading = document.getElementById('irc-loading');
            this.loadingText = document.getElementById('irc-loading-text');
            this.channelEl = document.getElementById('irc-channel');
            this.connEl = document.getElementById('irc-conn');
            this.connLabel = this.connEl ? this.connEl.querySelector('.irc-conn-label') : null;

            this.statChannel = document.getElementById('irc-stat-channel');
            this.statViewers = document.getElementById('irc-stat-viewers');
            this.statIndicator = document.getElementById('irc-stat-indicator');
            this.statStatus = document.getElementById('irc-stat-status');

            this.lines = [];
            this.collapsing = false;
            this.gotFirst = false;

            this.ws = null;
            this.connected = false;
            this.reconnectAttempts = 0;
            this.maxReconnectAttempts = 12;
            this.reconnectDelay = 1000;
            this._reconnectTimer = null;

            // Try to bring up the WebGL CRT; fall back to DOM if it fails.
            this.tube = new TubeRenderer();
            this.crt = new CRTScreen(this.glCanvas, this.tube);
            this.useGL = !!this.crt.ok;

            if (this.useGL && this.screen) {
                this.screen.classList.add('webgl-active');
                this._resizeGL();
                this.crt.start();
                window.addEventListener('resize', () => this._resizeGL());
                // Re-measure + re-render once the webfont loads — otherwise the
                // wrap is computed against fallback metrics and lines overrun.
                if (document.fonts && document.fonts.load) {
                    document.fonts.load(`${FONT_PX}px 'Libertinus Mono'`).then(() => this._resizeGL()).catch(() => {});
                    if (document.fonts.ready) document.fonts.ready.then(() => this._resizeGL());
                }
            }

            this._setupEventListeners();
        }

        _resizeGL() {
            if (!this.useGL || !this.screen) return;
            const rect = this.screen.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            this.tube.resize(rect.width, rect.height, dpr);
            this.crt.resize(rect.width, rect.height, dpr);
            this._renderTube();
        }

        _renderTube() {
            if (!this.useGL) return;
            this.tube.render(this.lines);
            this.crt.markDirty();
        }

        _setupEventListeners() {
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && !this.connected) {
                    this.reconnectAttempts = 0;
                    this.connect();
                }
            });
            window.addEventListener('beforeunload', () => {
                if (this.ws) { try { this.ws.close(1000, 'page_unload'); } catch (e) { /* noop */ } }
            });
        }

        connect() {
            if (this._reconnectTimer) { clearTimeout(this._reconnectTimer); this._reconnectTimer = null; }
            this._setConn('connecting', 'connecting');
            let ws;
            try {
                const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
                ws = new WebSocket(`${proto}//${location.host}/ws/irc`);
            } catch (e) { this._scheduleReconnect(); return; }
            this.ws = ws;

            ws.onopen = () => { this.reconnectAttempts = 0; this.reconnectDelay = 1000; };
            ws.onmessage = (ev) => {
                let msg; try { msg = JSON.parse(ev.data); } catch (e) { return; }
                this._handle(msg);
            };
            ws.onclose = () => {
                this.connected = false;
                this._setConn('lost', 'signal lost');
                this._scheduleReconnect();
            };
            ws.onerror = () => { try { ws.close(); } catch (e) { /* noop */ } };
        }

        _scheduleReconnect() {
            if (this._reconnectTimer) return;
            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                this._setConn('lost', 'disconnected');
                if (this.loading) {
                    this.loading.classList.remove('hidden');
                    if (this.loadingText) this.loadingText.textContent = 'carrier lost — refresh to reconnect';
                }
                return;
            }
            const delay = Math.min(this.reconnectDelay * Math.pow(1.6, this.reconnectAttempts), 15000);
            this.reconnectAttempts += 1;
            this._reconnectTimer = setTimeout(() => { this._reconnectTimer = null; this.connect(); }, delay);
        }

        _handle(msg) {
            switch (msg.type) {
                case 'connected':
                    this.connected = true;
                    this._setConn('connected', 'connected');
                    if (msg.channel) this._setChannel(msg.channel);
                    // Carrier up — reveal the (booting) screen even before first line.
                    if (this.loading) this.loading.classList.add('hidden');
                    break;
                case 'message':
                    this._appendLine(msg.data || {});
                    break;
                case 'collapse_start':
                    this.collapsing = true;
                    if (this.crt.ok) this.crt.setCollapse(1);
                    if (this.screen) this.screen.classList.add('collapsing');
                    break;
                case 'fragment_end':
                    this._endFragment();
                    break;
                default: break;
            }
        }

        _appendLine(data) {
            if (!this.gotFirst) { this.gotFirst = true; if (this.loading) this.loading.classList.add('hidden'); }

            this.lines.push(data);
            while (this.lines.length > MAX_LINES) this.lines.shift();

            // DOM layer (a11y + fallback)
            if (this.log) {
                const line = document.createElement('div');
                const type = data.type || 'message';
                line.className = `irc-line ${type}` + (this.collapsing ? ' in-collapse' : '');
                line.innerHTML =
                    `<span class="ts">[${esc(data.timestamp || '')}]</span>` +
                    `<span class="content">${this._domInner(data)}</span>`;
                const nearBottom = (this.log.scrollHeight - this.log.scrollTop - this.log.clientHeight) < 80;
                this.log.appendChild(line);
                while (this.log.childElementCount > MAX_LINES) this.log.removeChild(this.log.firstChild);
                if (nearBottom) this.log.scrollTop = this.log.scrollHeight;
            }

            // GL layer
            this._renderTube();
        }

        _domInner(m) {
            const t = m.type || 'message';
            const nk = esc(m.nick || '');
            const ct = esc(m.content || '');
            if (t === 'message') return `<span class="nick" style="color:${nickColor(m.nick || '')}">&lt;${nk}&gt;</span> <span class="body">${ct}</span>`;
            if (t === 'action') return `<span class="body">* ${nk} ${ct}</span>`;
            if (t === 'quit') return `<span class="body">⫫ ${nk} has quit${ct ? ` (${ct})` : ''}</span>`;
            if (t === 'part') return `<span class="body">← ${nk} has left${ct ? ` (${ct})` : ''}</span>`;
            if (t === 'join') return `<span class="body">→ ${nk} has joined</span>`;
            if (t === 'kick') { const meta = m.meta || {}; return `<span class="body">⚠ ${esc(meta.target || '')} was kicked by ${nk}${meta.reason ? ` (${esc(meta.reason)})` : ''}</span>`; }
            return `<span class="body">*** ${ct || nk}</span>`;
        }

        _endFragment() {
            // Continuous broadcast: DON'T clear. Let the dead channel sit a beat
            // with the collapse glitch still raging, then settle the screen. The
            // next fragment (after the server's 15–30s gap) just keeps rolling on
            // below — old lines scroll off naturally at the line cap.
            this.collapsing = false;
            setTimeout(() => {
                if (this.crt.ok) this.crt.setCollapse(0);
                if (this.screen) this.screen.classList.remove('collapsing');
            }, 1500);
        }

        _setChannel(ch) {
            if (this.channelEl) this.channelEl.textContent = ch;
            if (this.statChannel) this.statChannel.textContent = ch;
            if (this.tube) this.tube.channel = ch;
            this._renderTube();
        }

        _setConn(state, label) {
            if (this.connEl) {
                this.connEl.classList.remove('connecting', 'connected', 'lost');
                this.connEl.classList.add(state);
            }
            if (this.connLabel) this.connLabel.textContent = label;
            if (this.statIndicator) {
                this.statIndicator.classList.remove('connecting', 'connected', 'error');
                if (state === 'connected') this.statIndicator.classList.add('connected');
                else if (state === 'connecting') this.statIndicator.classList.add('connecting');
                else this.statIndicator.classList.add('error');
            }
            if (this.statStatus) {
                this.statStatus.textContent = state === 'connected' ? 'live'
                    : state === 'connecting' ? 'connecting' : 'offline';
            }
        }

        startStatusPolling() {
            const poll = async () => {
                try {
                    const r = await fetch('/api/irc/status', { cache: 'no-store' });
                    if (!r.ok) return;
                    const s = await r.json();
                    const n = s && s.clients ? s.clients.websocket_count : null;
                    if (this.statViewers && n != null) this.statViewers.textContent = String(n);
                } catch (e) { /* cosmetic */ }
            };
            poll();
            setInterval(poll, 5000);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        if (!document.getElementById('irc-screen')) return;
        const viewer = new IRCViewer();
        viewer.connect();
        viewer.startStatusPolling();
        window.__ircViewer = viewer;
    });
})();
