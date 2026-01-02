// WebGL Background Effect for Post Content and Comments
// Simple rectangular fade at edges

(function() {
    // Static canvases by ID
    const canvasIds = ['post-caustics-canvas'];

    // Also create canvases for comments and comment form
    const commentElements = document.querySelectorAll('.comments-section .comment');
    const commentForm = document.querySelector('.comments-section .comment-form');

    // Create canvas for comment form
    if (commentForm) {
        const canvas = document.createElement('canvas');
        canvas.className = 'comment-bg-canvas';
        commentForm.style.position = 'relative';
        commentForm.insertBefore(canvas, commentForm.firstChild);
    }

    // Create canvas for each comment
    commentElements.forEach(function(comment) {
        const canvas = document.createElement('canvas');
        canvas.className = 'comment-bg-canvas';
        comment.style.position = 'relative';
        comment.insertBefore(canvas, comment.firstChild);
    });

    // Collect all canvases to initialize
    const allCanvases = [
        ...canvasIds.map(id => document.getElementById(id)).filter(Boolean),
        ...document.querySelectorAll('.comment-bg-canvas')
    ];

    allCanvases.forEach(function(canvas) {
        if (!canvas) return;

        // Determine if this is a comment canvas (needs larger vertical fade)
        const isComment = canvas.classList.contains('comment-bg-canvas');

        const gl = canvas.getContext('webgl', { antialias: true });
        if (!gl) {
            console.warn('WebGL not supported');
            return;
        }

        const vertexShaderSource = `
            attribute vec2 a_position;
            varying vec2 v_uv;
            void main() {
                v_uv = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            varying vec2 v_uv;
            uniform vec2 u_resolution;
            uniform float u_horizFadePx;
            uniform float u_vertFadePx;

            void main() {
                vec2 uv = v_uv;
                vec2 pixelPos = uv * u_resolution;

                // Fade edges using absolute pixel values
                float horizFade = smoothstep(0.0, u_horizFadePx, pixelPos.x) * smoothstep(u_resolution.x, u_resolution.x - u_horizFadePx, pixelPos.x);
                float vertFade = smoothstep(0.0, u_vertFadePx, pixelPos.y) * smoothstep(u_resolution.y, u_resolution.y - u_vertFadePx, pixelPos.y);

                float alpha = horizFade * vertFade;

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
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
        const horizFadePxLocation = gl.getUniformLocation(program, 'u_horizFadePx');
        const vertFadePxLocation = gl.getUniformLocation(program, 'u_vertFadePx');

        // Absolute pixel values for fade edges
        const horizFadePx = 48.0;
        const vertFadePx = 48.0;

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

        function render() {
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            const dpr = window.devicePixelRatio || 1;
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.uniform1f(horizFadePxLocation, horizFadePx * dpr);
            gl.uniform1f(vertFadePxLocation, vertFadePx * dpr);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestAnimationFrame(render);
        }

        render();
    });
})();
