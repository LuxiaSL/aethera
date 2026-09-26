/*
 * DreamStage — the dream melting into the stage.
 *
 * One WebGL2 pass composites two live canvases:
 *   stage  the stage loop (curtains, beam, glitter floor), already frame-blended
 *   dream  the live dream frame (the viewer's #dream-canvas)
 *
 * The whole picture is drawn untouched. Nothing is cut from it: the fade grows
 * outward. Past each edge the image folds back on itself (a compressed mirror,
 * so there is never a seam) and streams outward along a slow curl, softening
 * as it goes, until an amorphous, drifting limit well outside the picture,
 * where it dissolves through the stage's own grain: bright glitter and curtain
 * fibre take it first. The light that leaves it tints the stage it lands on.
 *
 * Settings: melt (0 = today's hard rectangle; 0.8 chosen), shape (0 calm, 1 lobes,
 * 2 tendrils; tendrils chosen). Designed with Luxia and approved by the stage's author.
 * No WebGL2 -> create() returns null and the caller keeps the plain layout.
 */
(function (global) {
    'use strict';

    const VS = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

    const FS = `#version 300 es
precision highp float;
uniform vec2 uRes;          // CSS px
uniform float uPxRatio;     // drawing-buffer px per CSS px
uniform float uTime;
uniform sampler2D uStage, uDream;
uniform vec2 uStageSize;
uniform vec4 uRect;         // image rect x y w h, CSS px, y down
uniform float uMelt, uMotion, uShape;   // shape 0 calm, 1 lobes, 2 tendrils
out vec4 fragColor;

float h21(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p), u = f * f * (3.0 - 2.0 * f);
    return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p = p * 2.07 + 13.7; a *= 0.5; } return s; }

float sdRoundRect(vec2 p, vec2 half_, float r) {
    vec2 q = abs(p) - half_ + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
    vec2 px = vec2(gl_FragCoord.x, uRes.y * uPxRatio - gl_FragCoord.y) / uPxRatio;
    float t = uTime * uMotion;

    // ---- the stage, cover-fit, untouched except for the light it receives
    float s = max(uRes.x / uStageSize.x, uRes.y / uStageSize.y);
    vec2 suv = ((px - 0.5 * uRes) / s + 0.5 * uStageSize) / uStageSize;
    vec3 stage = texture(uStage, suv).rgb;
    float stLum = dot(stage, vec3(0.3, 0.59, 0.11));

    vec2 half_ = 0.5 * uRect.zw;
    vec2 ctr = uRect.xy + half_;
    vec2 uv = (px - uRect.xy) / uRect.zw;
    float H = uRect.w;
    float m = uMelt;

    if (m < 0.01) {                                   // today's page
        vec3 col = stage;
        if (all(greaterThanEqual(uv, vec2(0.0))) && all(lessThanEqual(uv, vec2(1.0))))
            col = texture(uDream, uv).rgb;
        fragColor = vec4(col, 1.0);
        return;
    }

    // ---- inside the rectangle the picture is exactly itself
    float ex = max(max(-uv.x, uv.x - 1.0) * uRect.z, 0.0);
    float ey = max(max(-uv.y, uv.y - 1.0) * uRect.w, 0.0);
    float e = length(vec2(ex, ey)) / H;               // distance outside the picture, in picture-heights
    // generated frames carry a thin off-colour row at their very edge (VAE artifact):
    // the fold starts a few texels in, and the picture's last pixels feather into it
    vec2 lo = 3.0 / vec2(textureSize(uDream, 0)), hi = 1.0 - lo;
    if (e <= 0.0) {
        float din = min(min(uv.x, 1.0 - uv.x) * uRect.z, min(uv.y, 1.0 - uv.y) * uRect.w);
        vec3 c = texture(uDream, uv).rgb;
        c = mix(c, textureLod(uDream, clamp(uv, lo, hi), 1.0).rgb, 1.0 - smoothstep(0.0, 0.02 * H, din));
        fragColor = vec4(c, 1.0);
        return;
    }

    // ---- past the edge it folds back on itself and streams outward along a slow curl
    vec2 q = (px - ctr) / H;
    vec2 w1 = vec2(fbm(q * 1.4 + vec2(t * 0.020, -t * 0.013)), fbm(q * 1.4 + vec2(5.2 - t * 0.017, 1.3 + t * 0.011)));
    vec2 w2 = vec2(fbm(q * 3.1 + w1 * 1.8 + t * 0.03), fbm(q * 3.1 - w1 * 1.4 + 7.7 - t * 0.025));
    vec2 flow = (w2 - 0.5) * 2.0;
    vec2 away = normalize((px - ctr) / half_ + 1e-4);
    vec2 along = vec2(-away.y, away.x);
    vec2 fuv = uv + (along * flow.x * 0.55 + away * flow.y * 0.25) * e * m * vec2(0.5, 1.0);
    // mirror at the edges, compressed: a reflection that has been pulled outward
    vec2 over = max(fuv - 1.0, 0.0) + max(-fuv, 0.0);
    vec2 inner = clamp(fuv, lo, hi);
    // right at the edge the picture smears straight out; the fold back eases in after,
    // so the mirror's brightness crease never lands on the border
    float fold = smoothstep(0.0, 0.1, e);
    vec2 muv = clamp(inner - sign(fuv - 0.5) * over * 0.55 * fold, lo, hi);
    float lod = 1.0 + smoothstep(0.0, 0.35, e) * 2.2;
    vec3 ext = textureLod(uDream, muv, lod).rgb;

    // ---- the amorphous limit, well outside the picture, dissolving through the stage's grain
    float reachR = 0.5 * m;                           // how far the fold reaches
    float warp = (w1.x - 0.5) * 0.45 + (w2.y - 0.5) * 0.2;

    // the silhouette: calm follows the picture; lobes and tendrils forget it had corners.
    // Every shaping multiplies distance or reach, so at the picture's edge (e = 0) nothing changes.
    vec2 qa = q * vec2(0.5, 1.0);                     // aspect-corrected direction around the picture
    float ang = atan(qa.y, qa.x);
    vec2 ring = vec2(cos(ang), sin(ang));
    float lobe = fbm(ring * 1.25 + vec2(t * 0.022, -t * 0.017) + 3.0);            // 0..1, a few big swells
    float lobeMul = mix(0.5, 2.3, smoothstep(0.3, 0.72, lobe));   // never so short that the corner shows
    // sampled on the circle (not on the raw angle, which jumps from +pi to -pi on the left
    // and left a seam there); constant along each outward direction, so fingers stay radial
    float drift = e * 0.8 - t * 0.04;
    float fing = vnoise(ring * 5.0 + (w1 - 0.5) * 0.9 + vec2(drift, -drift));
    fing = 1.0 - abs(2.0 * fing - 1.0);                                            // ridged: thin bright fingers
    float fingMul = 0.3 + 2.4 * pow(fing, 3.0);
    float shapeMul = uShape < 0.5 ? 1.0 : (uShape < 1.5 ? lobeMul : lobeMul * 0.55 + fingMul * 0.75);
    e *= 1.0 + (w1.y - 0.5) * 0.9 * step(0.5, uShape);                            // contours bend away from the rectangle
    reachR *= shapeMul;
    // grain and warp decide where the fold ENDS, never where it starts: at the
    // picture's edge it is always fully there, so no border can show
    float grain = (stLum - 0.3) * 0.9 + (vnoise(px * 0.35) - 0.5) * 0.12;
    float limit = max(reachR * (1.0 + warp * 1.6 - grain), 0.04);
    float alpha = 1.0 - smoothstep(0.0, limit, e);
    alpha *= alpha;                                   // hold near the picture, thin out toward the limit

    vec3 col = mix(stage, ext, alpha);

    // ---- light that leaves the picture lands on the stage it touches
    vec3 glowC = textureLod(uDream, inner, 6.0).rgb;
    col += stage * glowC * exp(-e / (0.45 * m + 0.001)) * (1.0 - alpha) * 0.8 * min(m, 1.2);

    fragColor = vec4(col, 1.0);
}`;

    function compile(gl, type, src) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.warn('DreamStage shader:', gl.getShaderInfoLog(sh));
            gl.deleteShader(sh);
            return null;
        }
        return sh;
    }

    class DreamStage {
        /**
         * canvas: the full-viewport output canvas
         * stageSrc / dreamSrc: canvases (or videos) read every frame
         * layout(w, h) -> [x, y, w, h] of the image in CSS px
         */
        static create(canvas, opts) {
            const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, premultipliedAlpha: false });
            if (!gl) return null;
            const vs = compile(gl, gl.VERTEX_SHADER, VS), fs = compile(gl, gl.FRAGMENT_SHADER, FS);
            if (!vs || !fs) return null;
            const prog = gl.createProgram();
            gl.attachShader(prog, vs);
            gl.attachShader(prog, fs);
            gl.bindAttribLocation(prog, 0, 'aPos');
            gl.linkProgram(prog);
            if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
                console.warn('DreamStage link:', gl.getProgramInfoLog(prog));
                return null;
            }
            return new DreamStage(canvas, gl, prog, opts);
        }

        constructor(canvas, gl, prog, opts) {
            this.canvas = canvas;
            this.gl = gl;
            this.prog = prog;
            this.stageSrc = opts.stageSrc;
            this.dreamSrc = opts.dreamSrc;
            this.layout = opts.layout;
            this.melt = opts.melt != null ? opts.melt : 0.8;
            this.reducedMotion = !!opts.reducedMotion;
            this.scale = Math.min(window.devicePixelRatio || 1, 1.5);
            this._slow = 0;
            this._loc = {};
            this.shape = opts.shape != null ? opts.shape : 2;
            this.liveLayout = !!opts.liveLayout;
            for (const n of ['uRes', 'uPxRatio', 'uTime', 'uStage', 'uDream', 'uStageSize', 'uRect', 'uMelt', 'uMotion', 'uShape'])
                this._loc[n] = gl.getUniformLocation(prog, n);

            const buf = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

            this.texStage = this._tex(false);
            this.texDream = this._tex(true);
            this._t0 = performance.now();
            this._last = this._t0;
        }

        _tex(mips) {
            const gl = this.gl, tx = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, tx);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mips ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
            return tx;
        }

        _upload(tx, src, mips) {
            const gl = this.gl;
            const w = src.videoWidth || src.width, h = src.videoHeight || src.height;
            if (!w || !h) return false;
            gl.bindTexture(gl.TEXTURE_2D, tx);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
            if (mips) gl.generateMipmap(gl.TEXTURE_2D);
            return [w, h];
        }

        resize() {
            const w = window.innerWidth, h = window.innerHeight;
            const r = this.scale;
            this.canvas.width = Math.round(w * r);
            this.canvas.height = Math.round(h * r);
            this.canvas.style.width = w + 'px';
            this.canvas.style.height = h + 'px';
            this.rect = this.layout(w, h);
        }

        frame(now) {
            const gl = this.gl, L = this._loc;
            if (!this.rect) this.resize();
            const dt = now - this._last;
            this._last = now;
            if (dt > 26 && dt < 200) this._slow++; else this._slow = Math.max(0, this._slow - 1);
            if (this._slow > 45 && this.scale > 0.6) { this.scale = Math.max(0.6, this.scale - 0.2); this._slow = 0; this.resize(); }

            if (this.liveLayout) this.rect = this.layout(window.innerWidth, window.innerHeight);  // follows scroll
            const ss = this._upload(this.texStage, this.stageSrc, false);
            this._upload(this.texDream, this.dreamSrc, true);
            if (!ss) return;
            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            gl.useProgram(this.prog);
            gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.texStage); gl.uniform1i(L.uStage, 0);
            gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.texDream); gl.uniform1i(L.uDream, 1);
            gl.uniform2f(L.uRes, window.innerWidth, window.innerHeight);
            gl.uniform1f(L.uPxRatio, this.scale);
            gl.uniform1f(L.uTime, (now - this._t0) / 1000);
            gl.uniform1f(L.uMotion, this.reducedMotion ? 0 : 1);
            gl.uniform2f(L.uStageSize, ss[0], ss[1]);
            const r = this.rect;
            gl.uniform4f(L.uRect, r[0], r[1], r[2], r[3]);
            gl.uniform1f(L.uMelt, this.melt);
            gl.uniform1f(L.uShape, this.shape);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    }

    /** Where the picture sits: under the title, a little smaller than today's so the fold has room. */
    DreamStage.defaultLayout = function (w, h) {
        const W = h > w * 1.1 ? w - 32 : Math.min(920, w - 32, w * 0.58);
        const H = W / 2;
        const y = Math.min(Math.max(h * 0.21, 150), h - H - 150);
        return [(w - W) / 2, Math.max(y, 110), W, H];
    };

    global.DreamStage = DreamStage;
})(window);
