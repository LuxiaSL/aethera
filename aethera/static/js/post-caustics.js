// WebGL Background Effect for Post Content and Comments
// Uses single WebGL context to avoid browser limits

(function() {
    // Check if post content has segments (split by <hr>)
    const postSegments = document.querySelectorAll('.post-content .post-segment');
    const mainCanvas = document.getElementById('post-caustics-canvas');

    // Collect all canvas targets (will be 2D canvases that receive rendered frames)
    const canvasTargets = [];

    // If we have segments, hide the main canvas and create one per segment
    if (postSegments.length > 0 && mainCanvas) {
        mainCanvas.style.display = 'none';
        postSegments.forEach(function(segment) {
            segment.style.position = 'relative';
            const canvas = document.createElement('canvas');
            canvas.className = 'segment-bg-canvas';
            segment.insertBefore(canvas, segment.firstChild);
            canvasTargets.push({
                canvas: canvas,
                parent: segment,
                type: 'segment'
            });
        });
    } else if (mainCanvas) {
        canvasTargets.push({
            canvas: mainCanvas,
            parent: null,
            type: 'main'
        });
    }

    // Also create canvases for comments and comment form
    const commentElements = document.querySelectorAll('.comments-section .comment');
    const commentForm = document.querySelector('.comments-section .comment-form');

    if (commentForm) {
        const canvas = document.createElement('canvas');
        canvas.className = 'comment-bg-canvas';
        commentForm.style.position = 'relative';
        commentForm.insertBefore(canvas, commentForm.firstChild);
        canvasTargets.push({
            canvas: canvas,
            parent: commentForm,
            type: 'comment'
        });
    }

    commentElements.forEach(function(comment) {
        const canvas = document.createElement('canvas');
        canvas.className = 'comment-bg-canvas';
        comment.style.position = 'relative';
        comment.insertBefore(canvas, comment.firstChild);
        canvasTargets.push({
            canvas: canvas,
            parent: comment,
            type: 'comment'
        });
    });

    if (canvasTargets.length === 0) return;

    // Create single offscreen WebGL canvas
    const glCanvas = document.createElement('canvas');
    const gl = glCanvas.getContext('webgl', { antialias: true, preserveDrawingBuffer: true });
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

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Get 2D contexts for all target canvases
    canvasTargets.forEach(function(target) {
        target.ctx2d = target.canvas.getContext('2d');
    });

    function renderToTarget(target) {
        const needsParentMeasure = target.type === 'segment' || target.type === 'comment';
        const measureEl = needsParentMeasure ? target.parent : target.canvas;
        const rect = measureEl.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Add padding for canvas overflow
        const extraWidth = needsParentMeasure ? 192 : 0;
        const extraHeight = needsParentMeasure ? 32 : 0;

        const width = rect.width + extraWidth;
        const height = rect.height + extraHeight;

        if (width <= 0 || height <= 0) return;

        // Set target canvas size
        if (needsParentMeasure) {
            target.canvas.style.width = width + 'px';
            target.canvas.style.height = height + 'px';
        }
        target.canvas.width = width * dpr;
        target.canvas.height = height * dpr;

        // Resize WebGL canvas to match
        glCanvas.width = width * dpr;
        glCanvas.height = height * dpr;
        gl.viewport(0, 0, glCanvas.width, glCanvas.height);

        // Render to WebGL canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(resolutionLocation, glCanvas.width, glCanvas.height);
        gl.uniform1f(horizFadePxLocation, horizFadePx * dpr);
        gl.uniform1f(vertFadePxLocation, vertFadePx * dpr);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // Copy to target 2D canvas
        target.ctx2d.clearRect(0, 0, target.canvas.width, target.canvas.height);
        target.ctx2d.drawImage(glCanvas, 0, 0);
    }

    function render() {
        canvasTargets.forEach(renderToTarget);
        requestAnimationFrame(render);
    }

    // Delay start to ensure layout is complete
    requestAnimationFrame(function() {
        requestAnimationFrame(function() {
            render();
        });
    });

    window.addEventListener('resize', function() {
        // Resize is handled in renderToTarget
    });
})();
