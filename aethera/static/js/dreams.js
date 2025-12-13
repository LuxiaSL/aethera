/**
 * Dream Window WebSocket Client
 * 
 * Connects to the dreams WebSocket endpoint and displays
 * live AI-generated frames on a canvas element.
 */

class DreamViewer {
    constructor(options = {}) {
        this.loadingId = options.loadingId || 'dream-loading';
        this.errorId = options.errorId || 'dream-error';
        this.statusId = options.statusId || 'dream-status';
        
        // Dual-canvas for smooth crossfade (no black flicker)
        this.canvasA = document.getElementById('dream-canvas-a');
        this.canvasB = document.getElementById('dream-canvas-b');
        this.ctxA = this.canvasA?.getContext('2d');
        this.ctxB = this.canvasB?.getContext('2d');
        this.activeCanvas = 'a';  // Track which canvas is currently visible
        
        // Initialize canvas A as active
        if (this.canvasA) this.canvasA.classList.add('active');
        
        // Other elements
        this.loadingEl = document.getElementById(this.loadingId);
        this.errorEl = document.getElementById(this.errorId);
        this.statusEl = document.getElementById(this.statusId);
        
        // WebSocket
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 1000;
        
        // State
        this.connected = false;
        this.frameCount = 0;
        this.lastFrameTime = 0;
        
        // Stats elements
        this.frameCountEl = document.querySelector('#dream-frame-count .dream-stat-value');
        this.viewerCountEl = document.querySelector('#dream-viewer-count .dream-stat-value');
        this.connectionIndicator = document.querySelector('#dream-connection-status .dream-stat-indicator');
        this.connectionStatus = document.querySelector('#dream-connection-status .dream-stat-value');
        
        // Bind methods
        this.connect = this.connect.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Visibility API - disconnect when tab hidden
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
            // Tab hidden - but KEEP connection alive!
            // Disconnecting triggers GPU shutdown on server.
            // Instead, just reduce activity (stop rendering new frames)
            console.log('Tab hidden - keeping connection alive');
            // Don't disconnect - the server will keep sending frames
            // which we'll display when tab becomes visible again
        } else {
            // Tab visible - reconnect
            if (!this.connected) {
                this.reconnectAttempts = 0;
                this.connect();
            }
        }
    }
    
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
            // Frame data
            const frameData = data.slice(1);
            this.displayFrame(frameData);
        }
    }
    
    handleJsonMessage(data) {
        try {
            const msg = JSON.parse(data);
            
            switch (msg.type) {
                case 'status':
                    this.handleStatusMessage(msg);
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
    
    handleStatusMessage(msg) {
        this.setStatus(msg.status, msg.message);
        
        // Update viewer count
        if (msg.viewer_count !== undefined && this.viewerCountEl) {
            this.viewerCountEl.textContent = msg.viewer_count;
        }
        
        // Update frame count
        if (msg.frame_count !== undefined && this.frameCountEl) {
            this.frameCountEl.textContent = msg.frame_count.toLocaleString();
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
    
    handleClose(event) {
        console.log('Dream WebSocket closed:', event.code, event.reason);
        this.connected = false;
        this.stopPingInterval();
        
        if (event.code === 1000) {
            // Normal close (tab hidden, page unload)
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
    
    displayFrame(frameData) {
        // Dual-canvas crossfade: draw to back canvas, then swap
        const isAActive = this.activeCanvas === 'a';
        const backCanvas = isAActive ? this.canvasB : this.canvasA;
        const backCtx = isAActive ? this.ctxB : this.ctxA;
        const frontCanvas = isAActive ? this.canvasA : this.canvasB;
        
        if (!backCtx) return;
        
        const blob = new Blob([frameData], { type: 'image/webp' });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        
        img.onload = () => {
            // Draw new frame to BACK canvas (currently hidden)
            backCtx.drawImage(img, 0, 0, backCanvas.width, backCanvas.height);
            URL.revokeObjectURL(url);
            
            // Swap: make back canvas active (fades in), front becomes inactive (fades out)
            backCanvas.classList.add('active');
            frontCanvas.classList.remove('active');
            
            // Update tracking
            this.activeCanvas = isAActive ? 'b' : 'a';
            this.frameCount++;
            this.lastFrameTime = Date.now();
            
            if (this.frameCountEl) {
                this.frameCountEl.textContent = this.frameCount.toLocaleString();
            }
            
            // Hide loading on first frame
            this.hideLoading();
        };
        
        img.onerror = () => {
            URL.revokeObjectURL(url);
            console.error('Failed to load frame');
        };
        
        img.src = url;
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


