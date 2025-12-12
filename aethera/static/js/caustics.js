// WebGL Caustics Effect
// Simulates light refracting through a water surface

(function() {
    const canvas = document.getElementById('caustics-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { antialias: true });
    if (!gl) {
        console.warn('WebGL not supported');
        return;
    }

    // Vertex shader - simple fullscreen quad
    const vertexShaderSource = `
        attribute vec2 a_position;
        varying vec2 v_uv;
        void main() {
            v_uv = a_position * 0.5 + 0.5;
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    // Fragment shader - caustics glow
    const fragmentShaderSource = `
        precision highp float;
        varying vec2 v_uv;
        uniform float u_time;
        uniform vec2 u_resolution;

        vec3 caustic(vec2 uv, float time) {
            // Scale UV to appropriate range for the algorithm
            vec2 p = uv * 4.0 - 2.0;

            // Mirror for left/right symmetry - fold at x=0
            p.x = -abs(p.x);
            float t = time * 0.15;

            vec2 i = vec2(p);
            float c = 1.0;
            float inten = 1.0;

            for (int n = 0; n < 4; n++) {
                float t2 = t * (1.0 - (3.5 / float(n + 1)));
                i = p + vec2(
                    cos(t2 - i.x) + sin(t2 + i.y),
                    sin(t2 - i.y) + cos(t2 + i.x)
                );
                c += 1.0 / length(vec2(
                    p.x / (sin(i.x + t2) / inten),
                    p.y / (cos(i.y + t2) / inten)
                ));
            }

            c /= 4.0;
            c = 1.5 - pow(c, 1.4);

            vec3 color = vec3(pow(abs(c), 30.0));
            return clamp(color, 0.0, 1.0);
        }

        float sampleCaustic(vec2 p, vec2 uv, float time) {
            // Center caustic for bright middle
            vec3 cCenter = caustic(p, time);

            // Edge detection for "web of lines" - sample nearby points and find difference
            float eps = 0.02;
            vec3 cL = caustic(p + vec2(-eps, 0.0), time);
            vec3 cR = caustic(p + vec2(eps, 0.0), time);
            vec3 cU = caustic(p + vec2(0.0, eps), time);
            vec3 cD = caustic(p + vec2(0.0, -eps), time);

            // Lines are where there's rapid change (edges)
            vec3 edges = abs(cL - cR) + abs(cU - cD);

            // Edge lines define the boundaries
            float edgeVal = (edges.r + edges.g + edges.b) / 3.0;

            // Fill where edges are LOW - higher threshold to ignore small edges in center
            float filledRegion = smoothstep(0.35, 0.1, edgeVal);

            // Boost edge lines for sharper periphery
            float sharpEdges = smoothstep(0.03, 0.2, edgeVal);

            // Combine: filled regions + sharp edge lines
            float brightness = filledRegion + sharpEdges * 1.5;

            // Radial fade for ellipse shape
            vec2 center = vec2(0.5, 0.5);
            vec2 fromCenter = (uv - center) * vec2(1.0, 1.8);
            float dist = length(fromCenter);
            float radialFade = smoothstep(0.5, 0.1, dist);

            return brightness * radialFade;
        }

        void main() {
            vec2 uv = v_uv;
            float aspect = u_resolution.x / u_resolution.y;
            float time = u_time * 0.3;

            // Supersampling - 4 samples in a 2x2 grid
            float aa = 0.5 / u_resolution.y;
            float alpha = 0.0;

            for (int x = 0; x < 2; x++) {
                for (int y = 0; y < 2; y++) {
                    vec2 offset = vec2(float(x) - 0.5, float(y) - 0.5) * aa;
                    vec2 sampleUV = uv + offset;
                    vec2 p = sampleUV;
                    p.x = (p.x - 0.5) * aspect + 0.5;
                    alpha += sampleCaustic(p, sampleUV, time);
                }
            }
            alpha /= 4.0;

            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
    `;

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    // Fullscreen quad
    const positions = new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    function resize() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let startTime = performance.now();

    function render() {
        const time = (performance.now() - startTime) / 1000;

        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform1f(timeLocation, time);
        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
    }

    render();
})();
