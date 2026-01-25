/**
 * Dream Window WebSocket Client
 *
 * Connects to the dreams WebSocket endpoint and displays
 * live AI-generated frames on a canvas element.
 *
 * Features:
 * - Client-side frame queue for smooth playback
 * - Canvas alpha blending for seamless transitions
 * - Adaptive FPS for buffer management
 * - Tab visibility handling (pause/skip-to-live)
 */

class DreamViewer {
    constructor(options = {}) {
        this.canvasId = options.canvasId || 'dream-canvas';
        this.loadingId = options.loadingId || 'dream-loading';
        this.errorId = options.errorId || 'dream-error';
        this.statusId = options.statusId || 'dream-status';
        this.promptId = options.promptId || 'dream-prompt-text';
        
        // Canvas elements
        this.canvas = document.getElementById(this.canvasId);
        this.ctx = this.canvas?.getContext('2d');
        this.loadingEl = document.getElementById(this.loadingId);
        this.errorEl = document.getElementById(this.errorId);
        this.statusEl = document.getElementById(this.statusId);
        this.promptEl = document.getElementById(this.promptId);
        
        // WebSocket
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 1000;
        
        // Connection state
        this.connected = false;
        this.frameCount = 0;           // Local display count (deprecated, kept for compat)
        this.serverFrameNumber = 0;    // Server-authoritative frame number
        this.currentPrompt = '';       // Current prompt from server
        this.lastFrameTime = 0;
        
        // ==================== Frame Queue System ====================
        this.frameQueue = [];           // Decoded Image objects waiting to display
        this.targetFps = 3.0;           // Updated from server config
        this.minBufferFrames = 3;       // Wait for ~1s buffer before starting
        this.maxQueueSize = 30;         // ~10s max buffer
        this.targetBufferFrames = 5;    // Ideal buffer size for adaptive FPS
        this.playbackStarted = false;
        this.playbackInterval = null;
        this.playbackPaused = false;    // Paused when tab hidden
        
        // ==================== Alpha Blend System ====================
        this.currentImage = null;       // Currently displayed image
        this.blendingImage = null;      // Image being blended in
        this.blendStartTime = null;
        this.blendDuration = 500;       // 500ms crossfade
        this.blendAnimationId = null;
        
        // Stats elements
        this.frameCountEl = document.querySelector('#dream-frame-count .dream-stat-value');
        this.viewerCountEl = document.querySelector('#dream-viewer-count .dream-stat-value');
        this.connectionIndicator = document.querySelector('#dream-connection-status .dream-stat-indicator');
        this.connectionStatus = document.querySelector('#dream-connection-status .dream-stat-value');
        
        // Bind methods
        this.connect = this.connect.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.playbackTick = this.playbackTick.bind(this);
        this.blendLoop = this.blendLoop.bind(this);
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Visibility API - pause/resume playback
        document.addEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Retry button
        const retryBtn = document.getElementById('dream-retry-btn');
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                this.hideError();
                this.reconnectAttempts = 0;
                this.connect();
            });
        }
        
        // Before unload - clean disconnect
        window.addEventListener('beforeunload', () => {
            if (this.ws) {
                this.ws.close(1000, 'page_unload');
            }
        });
    }
    
    handleVisibilityChange() {
        if (document.hidden) {
            // Tab hidden - pause playback (frames keep queueing)
            console.log('Tab hidden - pausing playback');
            this.pausePlayback();
        } else {
            // Tab visible - skip to live if we fell behind, then resume
            console.log('Tab visible - resuming playback');
            this.skipToLiveIfNeeded();
            this.resumePlayback();
            
            // Reconnect if disconnected
            if (!this.connected) {
                this.reconnectAttempts = 0;
                this.connect();
            }
        }
    }
    
    // ==================== Frame Queue Management ====================
    
    queueFrame(frameData) {
        // Decode image asynchronously
        const blob = new Blob([frameData], { type: 'image/webp' });
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
            URL.revokeObjectURL(url);

            // Add to queue
            this.frameQueue.push(img);

            // Start playback if we have enough buffer
            if (!this.playbackStarted && !this.playbackPaused &&
                this.frameQueue.length >= this.minBufferFrames) {
                this.startPlayback();
            }
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url);
            console.error('Failed to decode frame');
        };
        
        img.src = url;
    }
    
    startPlayback() {
        if (this.playbackInterval) return;

        this.playbackStarted = true;
        this.scheduleNextFrame();
    }
    
    scheduleNextFrame() {
        if (this.playbackPaused) return;
        
        // Calculate effective FPS with adaptive adjustment
        const effectiveFps = this.calculateEffectiveFps();
        const intervalMs = 1000 / effectiveFps;
        
        this.playbackInterval = setTimeout(() => {
            this.playbackTick();
            this.scheduleNextFrame();
        }, intervalMs);
    }
    
    calculateEffectiveFps() {
        const queueDepth = this.frameQueue.length;
        const overrun = queueDepth - this.targetBufferFrames;
        
        if (overrun <= 0) {
            // At or below target - play at normal speed
            return this.targetFps;
        } else if (overrun <= 5) {
            // Small overrun - speed up gently (3-15% faster)
            const boost = 1 + (overrun * 0.03);
            return this.targetFps * boost;
        } else {
            // Larger overrun - cap at 15% faster
            // (skip-to-live handles extreme cases)
            return this.targetFps * 1.15;
        }
    }
    
    playbackTick() {
        if (this.frameQueue.length === 0) {
            // Underrun - hold current frame (nothing to do)
            return;
        }

        const nextImage = this.frameQueue.shift();

        // Start alpha blend to new frame
        this.startBlend(nextImage);
        
        // Update stats (local count kept for compat, but display uses server frame number)
        this.frameCount++;
        this.lastFrameTime = Date.now();
        
        // Note: frame count display is now updated in handleFrameMetaMessage
        // using the server-authoritative frame number
        
        // Hide loading on first displayed frame
        this.hideLoading();
    }
    
    pausePlayback() {
        this.playbackPaused = true;
        if (this.playbackInterval) {
            clearTimeout(this.playbackInterval);
            this.playbackInterval = null;
        }
    }
    
    resumePlayback() {
        this.playbackPaused = false;
        if (this.playbackStarted && !this.playbackInterval) {
            this.scheduleNextFrame();
        }
    }
    
    skipToLiveIfNeeded() {
        // If queue has grown large (tab was hidden), skip to near-live
        const skipThreshold = 10;
        const keepFrames = 3;
        
        if (this.frameQueue.length > skipThreshold) {
            const dropped = this.frameQueue.length - keepFrames;
            this.frameQueue = this.frameQueue.slice(-keepFrames);
            console.log(`Skipped to live: dropped ${dropped} frames, keeping ${keepFrames}`);
        }
    }
    
    // ==================== Canvas Alpha Blending ====================
    
    startBlend(newImage) {
        if (!this.ctx) return;

        // If no current image, just draw directly (first frame)
        if (!this.currentImage) {
            this.currentImage = newImage;
            this.ctx.drawImage(newImage, 0, 0, this.canvas.width, this.canvas.height);
            return;
        }

        // If mid-blend, complete it first (promote blending to current)
        if (this.blendingImage) {
            this.currentImage = this.blendingImage;
        }
        if (this.blendAnimationId) {
            cancelAnimationFrame(this.blendAnimationId);
        }

        // Start crossfade blend
        this.blendingImage = newImage;
        this.blendStartTime = performance.now();

        this.blendLoop();
    }

    blendLoop() {
        if (!this.blendingImage || !this.ctx) return;

        const elapsed = performance.now() - this.blendStartTime;
        const progress = Math.min(1.0, elapsed / this.blendDuration);
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Draw current image at full opacity (base layer)
        this.ctx.globalAlpha = 1.0;
        this.ctx.drawImage(this.currentImage, 0, 0, w, h);
        
        // Draw new image at blend progress (fading in on top)
        this.ctx.globalAlpha = progress;
        this.ctx.drawImage(this.blendingImage, 0, 0, w, h);
        
        // Reset alpha
        this.ctx.globalAlpha = 1.0;
        
        if (progress < 1.0) {
            // Continue blending
            this.blendAnimationId = requestAnimationFrame(this.blendLoop);
        } else {
            // Blend complete - new becomes current
            this.currentImage = this.blendingImage;
            this.blendingImage = null;
            this.blendAnimationId = null;
        }
    }
    
    // ==================== WebSocket Connection ====================
    
    connect() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            return;
        }
        
        this.setStatus('connecting', 'connecting...');
        this.setConnectionState('connecting');
        
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/dreams`;
        
        try {
            this.ws = new WebSocket(wsUrl);
            this.ws.binaryType = 'arraybuffer';
            
            this.ws.onopen = () => this.handleOpen();
            this.ws.onmessage = (event) => this.handleMessage(event);
            this.ws.onclose = (event) => this.handleClose(event);
            this.ws.onerror = (error) => this.handleError(error);
        } catch (error) {
            console.error('WebSocket connection failed:', error);
            this.handleError(error);
        }
    }
    
    handleOpen() {
        console.log('Dream WebSocket connected');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.setConnectionState('connected');
        
        // Reset playback state for new session
        this.frameQueue = [];
        this.playbackStarted = false;
        this.currentImage = null;
        this.blendingImage = null;
        
        // Start ping interval
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
        const messageType = view[0];

        if (messageType === 0x01) {
            // Frame data - queue it for smooth playback
            const frameData = data.slice(1);
            this.queueFrame(frameData);
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
                    this.handleConfigMessage(msg);
                    break;
                case 'frame_meta':
                    this.handleFrameMetaMessage(msg);
                    break;
                case 'pong':
                    // Heartbeat response
                    break;
                default:
                    console.log('Unknown message type:', msg.type);
            }
        } catch (error) {
            console.error('Failed to parse JSON message:', error);
        }
    }
    
    handleFrameMetaMessage(msg) {
        // Server-authoritative frame metadata
        // This arrives just before each binary frame
        
        // Update server frame number
        if (msg.fn !== undefined) {
            this.serverFrameNumber = msg.fn;
            // Update display with server frame number
            if (this.frameCountEl) {
                this.frameCountEl.textContent = this.serverFrameNumber.toLocaleString();
            }
        }
        
        // Update prompt if changed
        if (msg.p !== undefined && msg.p !== this.currentPrompt) {
            this.currentPrompt = msg.p;
            this.updatePromptDisplay();
        }
    }
    
    updatePromptDisplay() {
        if (this.promptEl && this.currentPrompt) {
            this.promptEl.textContent = this.currentPrompt;
            // Show the prompt container if it was hidden
            const container = this.promptEl.closest('.dream-prompt');
            if (container) {
                container.classList.remove('hidden');
            }
        }
    }
    
    handleStatusMessage(msg) {
        this.setStatus(msg.status, msg.message);
        
        // Update viewer count
        if (msg.viewer_count !== undefined && this.viewerCountEl) {
            this.viewerCountEl.textContent = msg.viewer_count;
        }
        
        // Update frame count from server
        if (msg.frame_count !== undefined && this.frameCountEl) {
            // Don't override local count - server count is total received
        }
        
        // Check for target_fps in status (GPU config passthrough)
        if (msg.target_fps !== undefined) {
            this.updateTargetFps(msg.target_fps);
        }
        
        // Handle different statuses
        switch (msg.status) {
            case 'ready':
                // Frames should start flowing
                break;
            case 'starting':
            case 'loading_models':
                // Show loading with appropriate message
                this.showLoading();
                break;
            case 'error':
                this.showError(msg.message);
                break;
        }
    }
    
    handleConfigMessage(msg) {
        // Config from server (GPU settings)
        if (msg.target_fps !== undefined) {
            this.updateTargetFps(msg.target_fps);
        }
    }
    
    updateTargetFps(fps) {
        if (fps > 0 && fps !== this.targetFps) {
            console.log(`Target FPS updated: ${this.targetFps} → ${fps}`);
            this.targetFps = fps;
            // Adjust buffer thresholds based on FPS
            this.minBufferFrames = Math.max(2, Math.ceil(fps));  // ~1s buffer
            this.targetBufferFrames = Math.ceil(fps * 1.5);      // ~1.5s target
        }
    }
    
    handleClose(event) {
        console.log('Dream WebSocket closed:', event.code, event.reason);
        this.connected = false;
        this.stopPingInterval();
        this.pausePlayback();
        
        if (event.code === 1000) {
            // Normal close (page unload)
            this.setConnectionState('offline');
            return;
        }
        
        // Abnormal close - attempt reconnect
        this.scheduleReconnect();
    }
    
    handleError(error) {
        console.error('Dream WebSocket error:', error);
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
        
        this.setStatus('reconnecting', `reconnecting in ${Math.round(delay / 1000)}s...`);
        this.setConnectionState('connecting');
        
        setTimeout(() => {
            if (!document.hidden) {
                this.connect();
            }
        }, delay);
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
            this.connectionIndicator.className = `dream-stat-indicator ${state}`;
        }
        if (this.connectionStatus) {
            const labels = {
                'connected': 'live',
                'connecting': 'connecting',
                'offline': 'offline',
                'error': 'error'
            };
            this.connectionStatus.textContent = labels[state] || state;
        }
    }
    
    showLoading() {
        if (this.loadingEl) {
            this.loadingEl.classList.remove('hidden');
        }
        if (this.errorEl) {
            this.errorEl.classList.add('hidden');
        }
    }
    
    hideLoading() {
        if (this.loadingEl) {
            this.loadingEl.classList.add('hidden');
        }
    }
    
    showError(message) {
        if (this.errorEl) {
            const messageEl = document.getElementById('dream-error-message');
            if (messageEl) {
                messageEl.textContent = message;
            }
            this.errorEl.classList.remove('hidden');
        }
        if (this.loadingEl) {
            this.loadingEl.classList.add('hidden');
        }
        this.setConnectionState('error');
    }
    
    hideError() {
        if (this.errorEl) {
            this.errorEl.classList.add('hidden');
        }
    }
    
    // ==================== Heartbeat ====================
    
    startPingInterval() {
        this.pingInterval = setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
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

// ==================== Initialization ====================

document.addEventListener('DOMContentLoaded', () => {
    // Check for embed mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('embed') === '1') {
        document.body.classList.add('embed-mode');
    }
    
    // Initialize viewer
    window.dreamViewer = new DreamViewer();
    window.dreamViewer.connect();
});
