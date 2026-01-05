// Ethereal floating star that follows cursor and drifts to posts on hover
(function() {
    const canvas = document.createElement('canvas');
    canvas.id = 'hover-star-canvas';
    canvas.style.cssText = 'position: fixed; pointer-events: none; z-index: 10000; width: 64px; height: 64px; opacity: 0; transition: opacity 0.5s ease;';
    canvas.width = 128;
    canvas.height = 128;
    document.body.appendChild(canvas);

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) return;

    // Simple shader for the star spikes
    const spikeVertexShader = `
        attribute vec3 a_position;
        uniform mat4 u_matrix;
        varying float v_dist;
        void main() {
            v_dist = length(a_position);
            gl_Position = u_matrix * vec4(a_position, 1.0);
        }
    `;

    const spikeFragmentShader = `
        precision mediump float;
        varying float v_dist;
        void main() {
            // Bright solid spikes
            float alpha = 1.0 - smoothstep(0.4, 0.68, v_dist);
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.95);
        }
    `;

    // Shader for soft glow halo (screen-space)
    const glowVertexShader = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    const glowFragmentShader = `
        precision mediump float;
        varying vec2 v_uv;
        uniform float u_pulse;
        void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = length(v_uv - center) * 2.0;

            // Soft radial glow
            float glow = exp(-dist * dist * 3.0);
            float outerGlow = exp(-dist * dist * 1.2) * 0.5;
            float alpha = (glow + outerGlow) * (0.6 + u_pulse * 0.15);

            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    // Create spike program
    const spikeVS = createShader(gl, gl.VERTEX_SHADER, spikeVertexShader);
    const spikeFS = createShader(gl, gl.FRAGMENT_SHADER, spikeFragmentShader);
    if (!spikeVS || !spikeFS) return;

    const spikeProgram = gl.createProgram();
    gl.attachShader(spikeProgram, spikeVS);
    gl.attachShader(spikeProgram, spikeFS);
    gl.linkProgram(spikeProgram);
    if (!gl.getProgramParameter(spikeProgram, gl.LINK_STATUS)) {
        console.error('Spike program link error');
        return;
    }

    const spikePositionLoc = gl.getAttribLocation(spikeProgram, 'a_position');
    const spikeMatrixLoc = gl.getUniformLocation(spikeProgram, 'u_matrix');

    // Create glow program
    const glowVS = createShader(gl, gl.VERTEX_SHADER, glowVertexShader);
    const glowFS = createShader(gl, gl.FRAGMENT_SHADER, glowFragmentShader);
    if (!glowVS || !glowFS) return;

    const glowProgram = gl.createProgram();
    gl.attachShader(glowProgram, glowVS);
    gl.attachShader(glowProgram, glowFS);
    gl.linkProgram(glowProgram);
    if (!gl.getProgramParameter(glowProgram, gl.LINK_STATUS)) {
        console.error('Glow program link error');
        return;
    }

    const glowPositionLoc = gl.getAttribLocation(glowProgram, 'a_position');
    const glowPulseLoc = gl.getUniformLocation(glowProgram, 'u_pulse');

    // 6-pointed 3D star - spikes in all axis directions
    function createStarGeometry() {
        const verts = [];
        const pointLength = 0.65;
        const baseSize = 0.14;

        const points = [
            [pointLength, 0, 0],
            [-pointLength, 0, 0],
            [0, pointLength, 0],
            [0, -pointLength, 0],
            [0, 0, pointLength],
            [0, 0, -pointLength],
        ];

        const base = [
            [baseSize, 0, 0],
            [-baseSize, 0, 0],
            [0, baseSize, 0],
            [0, -baseSize, 0],
            [0, 0, baseSize],
            [0, 0, -baseSize],
        ];

        function addSpike(tip, b1, b2, b3, b4) {
            verts.push(...tip, ...b1, ...b2);
            verts.push(...tip, ...b2, ...b3);
            verts.push(...tip, ...b3, ...b4);
            verts.push(...tip, ...b4, ...b1);
        }

        addSpike(points[0], base[2], base[4], base[3], base[5]);
        addSpike(points[1], base[2], base[5], base[3], base[4]);
        addSpike(points[2], base[0], base[5], base[1], base[4]);
        addSpike(points[3], base[0], base[4], base[1], base[5]);
        addSpike(points[4], base[0], base[2], base[1], base[3]);
        addSpike(points[5], base[0], base[3], base[1], base[2]);

        return new Float32Array(verts);
    }

    const starVertices = createStarGeometry();
    const spikeBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, spikeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, starVertices, gl.STATIC_DRAW);

    // Full-screen quad for glow
    const quadVertices = new Float32Array([
        -1, -1,  1, -1,  -1, 1,
        -1,  1,  1, -1,   1, 1
    ]);
    const glowBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glowBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    // Smooth position tracking
    let currentX = 0, currentY = 0;
    let targetX = 0, targetY = 0;
    let mouseX = 0, mouseY = 0;
    let time = 0;
    let isVisible = false;
    let isOnPage = false;
    let hoveredPost = null;

    // Track mouse position globally
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Check if we're on a page with posts
        if (document.querySelector('.posts-section')) {
            if (!isOnPage) {
                isOnPage = true;
                isVisible = true;
                canvas.style.opacity = '1';
                currentX = mouseX;
                currentY = mouseY;
                if (!animationId) {
                    animationId = requestAnimationFrame(render);
                }
            }
        }
    });

    document.addEventListener('mouseleave', () => {
        isOnPage = false;
        isVisible = false;
        canvas.style.opacity = '0';
    });

    let animationId = null;

    function render() {
        time += 0.016;

        // Determine target position
        if (hoveredPost) {
            const title = hoveredPost.querySelector('.post-title');
            const linkRect = hoveredPost.getBoundingClientRect();
            const titleRect = title ? title.getBoundingClientRect() : linkRect;
            targetX = titleRect.left - 61;
            // Center vertically on the post
            targetY = (titleRect.top + linkRect.bottom) / 2 - 32;
        } else {
            // Float around cursor, not directly on it
            const orbitX = Math.sin(time * 0.8) * 25;
            const orbitY = Math.cos(time * 0.6) * 20;
            targetX = mouseX + orbitX - 20;
            targetY = mouseY + orbitY - 20;
        }

        // Slower, more flowy easing
        const easing = hoveredPost ? 0.025 : 0.04;
        currentX += (targetX - currentX) * easing;
        currentY += (targetY - currentY) * easing;

        // Gentle floating motion (always)
        const floatX = Math.sin(time * 0.9) * 5 + Math.sin(time * 1.7) * 2;
        const floatY = Math.cos(time * 0.7) * 5 + Math.cos(time * 1.4) * 2;

        canvas.style.left = (currentX + floatX) + 'px';
        canvas.style.top = (currentY + floatY) + 'px';

        // Render the star
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // Soft pulsing
        const pulse = (Math.sin(time * 2) + 1) / 2;

        // Draw glow first (background)
        gl.disable(gl.DEPTH_TEST);
        gl.useProgram(glowProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, glowBuffer);
        gl.enableVertexAttribArray(glowPositionLoc);
        gl.vertexAttribPointer(glowPositionLoc, 2, gl.FLOAT, false, 0, 0);
        gl.uniform1f(glowPulseLoc, pulse);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Draw spikes on top
        gl.enable(gl.DEPTH_TEST);
        gl.useProgram(spikeProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, spikeBuffer);
        gl.enableVertexAttribArray(spikePositionLoc);
        gl.vertexAttribPointer(spikePositionLoc, 3, gl.FLOAT, false, 0, 0);

        // Gentle, flowing rotation (slower)
        const rotX = time * 0.15 + Math.sin(time * 0.4) * 0.25;
        const rotY = time * 0.25 + Math.cos(time * 0.3) * 0.35;
        const rotZ = time * 0.1 + Math.sin(time * 0.5) * 0.2;

        const cx = Math.cos(rotX), sx = Math.sin(rotX);
        const cy = Math.cos(rotY), sy = Math.sin(rotY);
        const cz = Math.cos(rotZ), sz = Math.sin(rotZ);

        const matrix = new Float32Array([
            cy * cz,                      cy * sz,                      -sy,     0,
            sx * sy * cz - cx * sz,       sx * sy * sz + cx * cz,       sx * cy, 0,
            cx * sy * cz + sx * sz,       cx * sy * sz - sx * cz,       cx * cy, 0,
            0,                            0,                            0,       1
        ]);

        gl.uniformMatrix4fv(spikeMatrixLoc, false, matrix);
        gl.drawArrays(gl.TRIANGLES, 0, starVertices.length / 3);

        if (isVisible || isOnPage) {
            animationId = requestAnimationFrame(render);
        } else {
            animationId = null;
        }
    }

    // Track post hovers
    function attachListeners() {
        const postLinks = document.querySelectorAll('.post-preview .post-link');
        postLinks.forEach(link => {
            if (link.dataset.starListener) return;
            link.dataset.starListener = 'true';
            link.addEventListener('mouseenter', () => {
                hoveredPost = link;
            });
            link.addEventListener('mouseleave', () => {
                hoveredPost = null;
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachListeners);
    } else {
        attachListeners();
    }

    document.body.addEventListener('htmx:afterSwap', function() {
        setTimeout(attachListeners, 10);
    });
})();
