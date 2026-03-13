/**
 * Dream Window — H.264 Video Stream Client
 *
 * Two decode paths:
 * 1. WebCodecs VideoDecoder (Chrome 94+, Edge 94+)
 *    - Receives raw H.264 NAL units via WebSocket
 *    - Feeds EncodedVideoChunk to VideoDecoder
 *    - Draws VideoFrame directly to canvas
 *
 * 2. MSE fallback (Safari 17.1+, Firefox)
 *    - Receives raw H.264 NAL units via WebSocket
 *    - Client-side JS muxes NAL → fMP4 segments via jMuxer
 *    - Feeds fMP4 to MediaSource → hidden <video> → canvas
 *
 * If neither is available, shows "unsupported browser" message.
 */

const MSG_FRAME = 0x01;

class DreamViewer {
    constructor(options = {}) {
        // DOM elements
        this.canvasId = options.canvasId || 'dream-canvas';
        this.loadingId = options.loadingId || 'dream-loading';
        this.errorId = options.errorId || 'dream-error';
        this.statusId = options.statusId || 'dream-status';

        this.canvas = document.getElementById(this.canvasId);
        this.ctx = this.canvas?.getContext('2d');
        this.loadingEl = document.getElementById(this.loadingId);
        this.errorEl = document.getElementById(this.errorId);
        this.statusEl = document.getElementById(this.statusId);

        // WebSocket
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 1000;
        this.connected = false;

        // Frame tracking
        this.serverFrameNumber = 0;
        this.targetFps = 17.0;
        this.frameCount = 0;
        this.lastFrameTime = 0;

        // Decode path: 'webcodecs' | 'mse' | null
        this.decodePath = null;
        this.videoDecoder = null;        // WebCodecs
        this.jmuxer = null;             // jMuxer for MSE
        this.videoElement = null;        // MSE — hidden <video> for decode
        this.videoFrameCount = 0;
        this._lastFrameMetaIsVideoKeyframe = false;
        this._receivedFirstKeyframe = false;
        this._mseCanvasLoop = null;

        // Stats elements
        this.frameCountEl = document.querySelector(
            '#dream-frame-count .dream-stat-value'
        );
        this.viewerCountEl = document.querySelector(
            '#dream-viewer-count .dream-stat-value'
        );
        this.connectionIndicator = document.querySelector(
            '#dream-connection-status .dream-stat-indicator'
        );
        this.connectionStatus = document.querySelector(
            '#dream-connection-status .dream-stat-value'
        );

        this.setupEventListeners();
    }

    // ==================== Initialization ====================

    setupEventListeners() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.connected) {
                this.reconnectAttempts = 0;
                this.connect();
            }
        });

        const retryBtn = document.getElementById('dream-retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.hideError();
                this.reconnectAttempts = 0;
                this.connect();
            });
        }

        window.addEventListener('beforeunload', () => {
            if (this.ws) this.ws.close(1000, 'page_unload');
        });
    }

    _detectDecodePath() {
        // Prefer WebCodecs (lower latency, direct canvas output)
        try {
            if (typeof VideoDecoder === 'function'
                && typeof EncodedVideoChunk === 'function') {
                return 'webcodecs';
            }
        } catch (e) { /* not available */ }

        // Fall back to MSE via jMuxer (if loaded)
        if (typeof JMuxer === 'function') {
            return 'mse';
        }

        // Raw MSE without jMuxer — check if browser supports it
        if (typeof MediaSource === 'function'
            && MediaSource.isTypeSupported('video/mp4; codecs="avc1.42001e"')) {
            return 'mse';
        }

        return null;
    }

    // ==================== WebCodecs Path ====================

    async _initWebCodecs() {
        const config = {
            codec: 'avc1.42001e',  // Baseline Level 3.0
            codedWidth: 1024,
            codedHeight: 512,
        };

        try {
            const support = await VideoDecoder.isConfigSupported(config);
            if (!support.supported) {
                console.warn('H.264 Baseline not supported');
                return false;
            }
        } catch (e) {
            console.warn('isConfigSupported failed:', e);
            return false;
        }

        this.videoDecoder = new VideoDecoder({
            output: (frame) => this._onVideoFrame(frame),
            error: (e) => {
                console.error('VideoDecoder error:', e);
                this._resetDecoder();
            },
        });

        this.videoDecoder.configure(config);
        console.log('WebCodecs VideoDecoder initialized');
        return true;
    }

    _onVideoFrame(frame) {
        if (!this.ctx) { frame.close(); return; }

        // Draw decoded frame directly to canvas
        this.ctx.drawImage(frame, 0, 0, this.canvas.width, this.canvas.height);
        frame.close();  // MUST close to free GPU memory

        this.frameCount++;
        this.lastFrameTime = Date.now();
        this.hideLoading();
    }

    _feedWebCodecs(nalData) {
        if (!this.videoDecoder || this.videoDecoder.state === 'closed') return;

        const isKey = this._lastFrameMetaIsVideoKeyframe;

        // Must receive a keyframe first before decoding can start
        if (!isKey && !this._receivedFirstKeyframe) return;
        if (isKey) this._receivedFirstKeyframe = true;

        // Timestamp in microseconds (VideoDecoder requirement)
        const timestamp = this.videoFrameCount * (1_000_000 / this.targetFps);
        this.videoFrameCount++;

        try {
            this.videoDecoder.decode(new EncodedVideoChunk({
                type: isKey ? 'key' : 'delta',
                timestamp: timestamp,
                data: nalData,
            }));
        } catch (e) {
            console.error('Decode failed:', e);
            if (!isKey) this._resetDecoder();
        }
    }

    // ==================== MSE Path (jMuxer) ====================

    async _initMSE() {
        if (typeof JMuxer === 'function') {
            return this._initJMuxer();
        }

        // Fallback: raw MSE (more complex, less tested)
        console.warn('jMuxer not loaded — MSE fallback unavailable');
        return false;
    }

    _initJMuxer() {
        // Create hidden video element
        this.videoElement = document.createElement('video');
        this.videoElement.id = 'dream-video-mse';
        this.videoElement.muted = true;
        this.videoElement.autoplay = true;
        this.videoElement.playsInline = true;
        this.videoElement.style.cssText = 'position:absolute;opacity:0;pointer-events:none;width:1px;height:1px';
        document.body.appendChild(this.videoElement);

        try {
            this.jmuxer = new JMuxer({
                node: 'dream-video-mse',
                mode: 'video',
                fps: this.targetFps,
                flushingTime: 0,  // Immediate playback
                debug: false,
            });

            // Draw video frames to canvas
            this._startMSECanvasLoop();

            console.log('jMuxer MSE initialized');
            return true;
        } catch (e) {
            console.error('jMuxer init failed:', e);
            return false;
        }
    }

    _startMSECanvasLoop() {
        const draw = () => {
            if (this.videoElement && this.ctx
                && this.videoElement.readyState >= 2) {
                this.ctx.drawImage(
                    this.videoElement, 0, 0,
                    this.canvas.width, this.canvas.height
                );
                this.frameCount++;
                this.lastFrameTime = Date.now();
                this.hideLoading();
            }
            this._mseCanvasLoop = requestAnimationFrame(draw);
        };
        this._mseCanvasLoop = requestAnimationFrame(draw);
    }

    _feedMSE(nalData) {
        const isKey = this._lastFrameMetaIsVideoKeyframe;

        // Must receive a keyframe first
        if (!isKey && !this._receivedFirstKeyframe) return;
        if (isKey) this._receivedFirstKeyframe = true;

        if (this.jmuxer) {
            try {
                this.jmuxer.feed({
                    video: new Uint8Array(nalData),
                });
            } catch (e) {
                console.error('jMuxer feed error:', e);
            }
        }
    }

    // ==================== Shared Logic ====================

    _resetDecoder() {
        if (this.videoDecoder) {
            try { this.videoDecoder.close(); } catch (e) { /* ignore */ }
            this.videoDecoder = null;
        }
        this._receivedFirstKeyframe = false;
        this.videoFrameCount = 0;
        console.log('Decoder reset — waiting for I-frame');
    }

    _cleanupMSE() {
        if (this._mseCanvasLoop) {
            cancelAnimationFrame(this._mseCanvasLoop);
            this._mseCanvasLoop = null;
        }
        if (this.jmuxer) {
            try { this.jmuxer.destroy(); } catch (e) { /* ignore */ }
            this.jmuxer = null;
        }
        if (this.videoElement) {
            this.videoElement.remove();
            this.videoElement = null;
        }
    }

    // ==================== WebSocket ====================

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) return;

        this.decodePath = this._detectDecodePath();

        if (!this.decodePath) {
            this.showError(
                'Your browser does not support H.264 video decoding. ' +
                'Please use Chrome, Edge, or Safari 17.1+.'
            );
            return;
        }

        this.setStatus('connecting', 'connecting...');
        this.setConnectionState('connecting');

        const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${location.host}/ws/dreams`;

        try {
            this.ws = new WebSocket(wsUrl);
            this.ws.binaryType = 'arraybuffer';
            this.ws.onopen = () => this.handleOpen();
            this.ws.onmessage = (e) => this.handleMessage(e);
            this.ws.onclose = (e) => this.handleClose(e);
            this.ws.onerror = (e) => this.handleError(e);
        } catch (e) {
            console.error('WebSocket failed:', e);
            this.handleError(e);
        }
    }

    async handleOpen() {
        console.log(`Dream WebSocket connected (decode: ${this.decodePath})`);
        this.connected = true;
        this.reconnectAttempts = 0;
        this.setConnectionState('connected');

        // Reset state
        this._resetDecoder();
        this._cleanupMSE();
        this._receivedFirstKeyframe = false;
        this._lastFrameMetaIsVideoKeyframe = false;

        // Initialize decode path
        let ok = false;
        if (this.decodePath === 'webcodecs') {
            ok = await this._initWebCodecs();
        } else if (this.decodePath === 'mse') {
            ok = await this._initMSE();
        }

        if (!ok) {
            console.error(`Failed to initialize ${this.decodePath} decoder`);
            this.showError('Failed to initialize video decoder');
            return;
        }

        this.startPingInterval();
    }

    handleMessage(event) {
        if (event.data instanceof ArrayBuffer) {
            this.handleBinaryMessage(event.data);
        } else {
            this.handleJsonMessage(event.data);
        }
    }

    handleBinaryMessage(data) {
        const view = new Uint8Array(data);
        if (view[0] !== MSG_FRAME) return;

        const nalData = data.slice(1);

        if (this.decodePath === 'webcodecs') {
            this._feedWebCodecs(nalData);
        } else if (this.decodePath === 'mse') {
            this._feedMSE(nalData);
        }
    }

    handleJsonMessage(data) {
        try {
            const msg = JSON.parse(data);
            switch (msg.type) {
                case 'status':
                    this.handleStatusMessage(msg);
                    break;
                case 'config':
                    if (msg.target_fps > 0) this.targetFps = msg.target_fps;
                    break;
                case 'frame_meta':
                    this.handleFrameMetaMessage(msg);
                    break;
                case 'pong':
                    break;
            }
        } catch (e) {
            console.error('JSON parse failed:', e);
        }
    }

    handleFrameMetaMessage(msg) {
        if (msg.fn !== undefined) {
            this.serverFrameNumber = msg.fn;
            if (this.frameCountEl) {
                this.frameCountEl.textContent =
                    this.serverFrameNumber.toLocaleString();
            }
        }
        this._lastFrameMetaIsVideoKeyframe = msg.vk === true;
    }

    handleStatusMessage(msg) {
        this.setStatus(msg.status, msg.message);
        if (msg.viewer_count !== undefined && this.viewerCountEl) {
            this.viewerCountEl.textContent = msg.viewer_count;
        }
        if (msg.target_fps > 0) this.targetFps = msg.target_fps;

        if (msg.status === 'starting' || msg.status === 'loading_models') {
            this.showLoading();
        } else if (msg.status === 'error') {
            this.showError(msg.message);
        }
    }

    handleClose(event) {
        this.connected = false;
        this.stopPingInterval();

        // Clean up decoders
        this._resetDecoder();
        this._cleanupMSE();

        if (event.code === 1000) {
            this.setConnectionState('offline');
            return;
        }
        this.scheduleReconnect();
    }

    handleError(error) {
        console.error('WebSocket error:', error);
        this.setConnectionState('error');
    }

    scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.showError('Unable to connect after multiple attempts');
            return;
        }
        this.reconnectAttempts++;
        const delay = Math.min(
            this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1),
            30000
        );
        this.setStatus('reconnecting',
            `reconnecting in ${Math.round(delay / 1000)}s...`);
        this.setConnectionState('connecting');
        setTimeout(() => { if (!document.hidden) this.connect(); }, delay);
    }

    // ==================== UI Helpers ====================

    setStatus(status, message) {
        if (this.statusEl) {
            this.statusEl.textContent = message;
            this.statusEl.className = `dream-status dream-status-${status}`;
        }
    }

    setConnectionState(state) {
        if (this.connectionIndicator) {
            this.connectionIndicator.className =
                `dream-stat-indicator ${state}`;
        }
        if (this.connectionStatus) {
            const labels = {
                connected: 'live', connecting: 'connecting',
                offline: 'offline', error: 'error'
            };
            this.connectionStatus.textContent = labels[state] || state;
        }
    }

    showLoading() {
        this.loadingEl?.classList.remove('hidden');
        this.errorEl?.classList.add('hidden');
    }

    hideLoading() {
        this.loadingEl?.classList.add('hidden');
    }

    showError(message) {
        const msgEl = document.getElementById('dream-error-message');
        if (msgEl) msgEl.textContent = message;
        this.errorEl?.classList.remove('hidden');
        this.loadingEl?.classList.add('hidden');
        this.setConnectionState('error');
    }

    hideError() {
        this.errorEl?.classList.add('hidden');
    }

    startPingInterval() {
        this.pingInterval = setInterval(() => {
            if (this.ws?.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({ type: 'ping' }));
            }
        }, 30000);
    }

    stopPingInterval() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }
}

// ==================== Init ====================
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('embed') === '1') {
        document.body.classList.add('embed-mode');
    }

    window.dreamViewer = new DreamViewer();
    window.dreamViewer.connect();
});
