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

    // ==================== Annex B → AVC Conversion ====================
    // WebCodecs VideoDecoder expects AVC format (length-prefixed NALs)
    // with an avcC description, NOT raw Annex B (start codes).
    // We parse the Annex B stream, extract SPS/PPS for the description,
    // and convert NAL units to length-prefixed format.

    /**
     * Find NAL unit boundaries in Annex B byte stream.
     * Returns array of {offset, length, type} for each NAL unit.
     */
    _parseAnnexBNALs(data) {
        const view = new Uint8Array(data);
        const nals = [];
        let i = 0;

        while (i < view.length) {
            // Find start code: 00 00 01 or 00 00 00 01
            let startCodeLen = 0;
            if (i + 2 < view.length &&
                view[i] === 0 && view[i + 1] === 0 && view[i + 2] === 1) {
                startCodeLen = 3;
            } else if (i + 3 < view.length &&
                view[i] === 0 && view[i + 1] === 0 &&
                view[i + 2] === 0 && view[i + 3] === 1) {
                startCodeLen = 4;
            }

            if (startCodeLen === 0) {
                i++;
                continue;
            }

            const nalStart = i + startCodeLen;

            // Find next start code (or end of data)
            let nalEnd = view.length;
            for (let j = nalStart + 1; j < view.length - 2; j++) {
                if (view[j] === 0 && view[j + 1] === 0 &&
                    (view[j + 2] === 1 || (j + 3 < view.length && view[j + 2] === 0 && view[j + 3] === 1))) {
                    nalEnd = j;
                    break;
                }
            }

            if (nalStart < nalEnd) {
                const nalType = view[nalStart] & 0x1f;
                nals.push({
                    offset: nalStart,
                    length: nalEnd - nalStart,
                    type: nalType,
                });
            }

            i = nalEnd;
        }

        return nals;
    }

    /**
     * Build avcC description from SPS and PPS NAL units.
     * This is required by VideoDecoder.configure() for H.264.
     */
    _buildAvcCDescription(spsData, ppsData) {
        // avcC format:
        // 1 byte: version (1)
        // 1 byte: profile (from SPS[1])
        // 1 byte: compatibility (from SPS[2])
        // 1 byte: level (from SPS[3])
        // 1 byte: 0xFF (length size minus 1 = 3, i.e., 4-byte lengths)
        // 1 byte: 0xE1 (number of SPS = 1)
        // 2 bytes: SPS length
        // N bytes: SPS data
        // 1 byte: number of PPS (1)
        // 2 bytes: PPS length
        // N bytes: PPS data

        const totalLen = 6 + 2 + spsData.length + 1 + 2 + ppsData.length;
        const buf = new Uint8Array(totalLen);
        let offset = 0;

        buf[offset++] = 1;                  // version
        buf[offset++] = spsData[1];         // profile
        buf[offset++] = spsData[2];         // compatibility
        buf[offset++] = spsData[3];         // level
        buf[offset++] = 0xFF;               // 4-byte NAL length size
        buf[offset++] = 0xE1;               // 1 SPS

        // SPS length (big-endian 16-bit)
        buf[offset++] = (spsData.length >> 8) & 0xFF;
        buf[offset++] = spsData.length & 0xFF;

        // SPS data
        buf.set(spsData, offset);
        offset += spsData.length;

        buf[offset++] = 1;                  // 1 PPS

        // PPS length (big-endian 16-bit)
        buf[offset++] = (ppsData.length >> 8) & 0xFF;
        buf[offset++] = ppsData.length & 0xFF;

        // PPS data
        buf.set(ppsData, offset);

        return buf;
    }

    /**
     * Convert Annex B NAL units to AVC format (4-byte length prefixes).
     * Strips SPS/PPS (type 7/8) since they're in the avcC description.
     */
    _annexBToAvc(data, nals) {
        // Calculate total size for non-parameter-set NALs
        let totalSize = 0;
        for (const nal of nals) {
            if (nal.type !== 7 && nal.type !== 8) { // Skip SPS/PPS
                totalSize += 4 + nal.length; // 4-byte length prefix + NAL data
            }
        }

        if (totalSize === 0) return null;

        const view = new Uint8Array(data);
        const output = new Uint8Array(totalSize);
        let offset = 0;

        for (const nal of nals) {
            if (nal.type === 7 || nal.type === 8) continue; // Skip SPS/PPS

            // 4-byte big-endian length
            output[offset++] = (nal.length >> 24) & 0xFF;
            output[offset++] = (nal.length >> 16) & 0xFF;
            output[offset++] = (nal.length >> 8) & 0xFF;
            output[offset++] = nal.length & 0xFF;

            // NAL data
            output.set(view.subarray(nal.offset, nal.offset + nal.length), offset);
            offset += nal.length;
        }

        return output.buffer;
    }

    // ==================== WebCodecs Path ====================

    async _initWebCodecs() {
        // Don't configure yet — we need SPS/PPS from the first I-frame
        // to build the avcC description. Decoder is created but configured
        // lazily in _feedWebCodecs when the first keyframe arrives.
        this._webCodecsConfigured = false;
        this._spsData = null;
        this._ppsData = null;
        console.log('WebCodecs path selected — waiting for first I-frame to configure');
        return true;
    }

    _configureWebCodecsFromKeyframe(nals, data) {
        const view = new Uint8Array(data);

        // Extract SPS and PPS
        for (const nal of nals) {
            if (nal.type === 7) { // SPS
                this._spsData = view.slice(nal.offset, nal.offset + nal.length);
            } else if (nal.type === 8) { // PPS
                this._ppsData = view.slice(nal.offset, nal.offset + nal.length);
            }
        }

        if (!this._spsData || !this._ppsData) {
            console.warn('I-frame missing SPS or PPS — cannot configure decoder');
            return false;
        }

        // Build avcC description
        const description = this._buildAvcCDescription(this._spsData, this._ppsData);

        // Build codec string from SPS: avc1.PPCCLL
        const profile = this._spsData[1].toString(16).padStart(2, '0');
        const compat = this._spsData[2].toString(16).padStart(2, '0');
        const level = this._spsData[3].toString(16).padStart(2, '0');
        const codecStr = `avc1.${profile}${compat}${level}`;

        const config = {
            codec: codecStr,
            codedWidth: 1024,
            codedHeight: 512,
            description: description,
        };

        console.log(`Configuring VideoDecoder: ${codecStr}`);

        try {
            this.videoDecoder = new VideoDecoder({
                output: (frame) => this._onVideoFrame(frame),
                error: (e) => {
                    console.error('VideoDecoder error:', e);
                    this._resetDecoder();
                },
            });

            this.videoDecoder.configure(config);
            this._webCodecsConfigured = true;
            console.log('VideoDecoder configured successfully');
            return true;
        } catch (e) {
            console.error('VideoDecoder configure failed:', e);
            return false;
        }
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
        const isKey = this._lastFrameMetaIsVideoKeyframe;

        // Must receive a keyframe first before decoding can start
        if (!isKey && !this._receivedFirstKeyframe) return;

        // Parse Annex B NAL units
        const nals = this._parseAnnexBNALs(nalData);
        if (nals.length === 0) return;

        // On first keyframe: extract SPS/PPS and configure decoder
        if (isKey && !this._webCodecsConfigured) {
            if (!this._configureWebCodecsFromKeyframe(nals, nalData)) {
                return; // Can't decode without config
            }
        }

        if (!this.videoDecoder || this.videoDecoder.state === 'closed') return;
        if (!this._webCodecsConfigured) return;

        if (isKey) this._receivedFirstKeyframe = true;

        // Convert Annex B → AVC format (length-prefixed, no SPS/PPS)
        const avcData = this._annexBToAvc(nalData, nals);
        if (!avcData) return;

        // Timestamp in microseconds
        const timestamp = this.videoFrameCount * (1_000_000 / this.targetFps);
        this.videoFrameCount++;

        try {
            this.videoDecoder.decode(new EncodedVideoChunk({
                type: isKey ? 'key' : 'delta',
                timestamp: timestamp,
                data: avcData,
            }));
        } catch (e) {
            console.error('Failed to decode frame', this.videoFrameCount, e);
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
        this._webCodecsConfigured = false;
        this._spsData = null;
        this._ppsData = null;
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
