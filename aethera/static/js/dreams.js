/**
 * Dream Window WebSocket Client
 * 
 * Connects to the dreams WebSocket endpoint and displays
 * live AI-generated frames on a canvas element.
 */

class DreamViewer {
    constructor(options = {}) {
        this.canvasId = options.canvasId || 'dream-canvas';
        this.containerId = options.containerId || 'dream-container';
        this.loadingId = options.loadingId || 'dream-loading';
        this.errorId = options.errorId || 'dream-error';
        this.statusId = options.statusId || 'dream-status';
        
        // Elements
        this.canvas = document.getElementById(this.canvasId);
        this.container = document.getElementById(this.containerId);
        this.ctx = this.canvas?.getContext('2d');
        this.loadingEl = document.getElementById(this.loadingId);
        this.errorEl = document.getElementById(this.errorId);
        this.statusEl = document.getElementById(this.statusId);
        this.fullscreenBtn = document.getElementById('dream-fullscreen-btn');
        
        // WebSocket
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 1000;
        
        // State
        this.connected = false;
        this.frameCount = 0;
        this.lastFrameTime = 0;
        this.isFullscreen = false;
        
        // Stats elements
        this.frameCountEl = document.querySelector('#dream-frame-count .dream-stat-value');
        this.viewerCountEl = document.querySelector('#dream-viewer-count .dream-stat-value');
        this.connectionIndicator = document.querySelector('#dream-connection-status .dream-stat-indicator');
        this.connectionStatus = document.querySelector('#dream-connection-status .dream-stat-value');
        
        // Bind methods
        this.connect = this.connect.bind(this);
        this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
        this.toggleFullscreen = this.toggleFullscreen.bind(this);
        this.handleFullscreenChange = this.handleFullscreenChange.bind(this);
        
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
        
        // Fullscreen controls
        if (this.fullscreenBtn) {
            this.fullscreenBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFullscreen();
            });
        }
        
        // Click canvas to toggle fullscreen
        if (this.canvas) {
            this.canvas.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
        
        // Keyboard shortcut: F for fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'f' || e.key === 'F') {
                // Only if not typing in an input
                if (document.activeElement.tagName !== 'INPUT' && 
                    document.activeElement.tagName !== 'TEXTAREA') {
                    this.toggleFullscreen();
                }
            }
        });
        
        // Listen for fullscreen change events
        document.addEventListener('fullscreenchange', this.handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', this.handleFullscreenChange);
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
        if (!this.ctx) return;
        
        const blob = new Blob([frameData], { type: 'image/webp' });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        
        img.onload = () => {
            // Draw to canvas
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            URL.revokeObjectURL(url);
            
            // Update stats
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
    
    // ==================== Fullscreen ====================
    
    toggleFullscreen() {
        if (!this.container) return;
        
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }
    
    enterFullscreen() {
        const container = this.container;
        
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
            container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
    }
    
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    
    handleFullscreenChange() {
        const isNowFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
        
        this.isFullscreen = isNowFullscreen;
        
        if (this.container) {
            if (isNowFullscreen) {
                this.container.classList.add('is-fullscreen');
            } else {
                this.container.classList.remove('is-fullscreen');
            }
        }
        
        // Resize canvas to fit fullscreen properly
        if (isNowFullscreen && this.canvas) {
            this.resizeCanvasForFullscreen();
        }
    }
    
    resizeCanvasForFullscreen() {
        // Calculate optimal size to maintain 2:1 aspect ratio
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const targetRatio = 2; // 1024:512 = 2:1
        
        let canvasWidth, canvasHeight;
        
        if (screenWidth / screenHeight > targetRatio) {
            // Screen is wider than content - fit to height
            canvasHeight = screenHeight;
            canvasWidth = screenHeight * targetRatio;
        } else {
            // Screen is taller than content - fit to width
            canvasWidth = screenWidth;
            canvasHeight = screenWidth / targetRatio;
        }
        
        // Apply via CSS (canvas buffer stays 1024x512)
        this.canvas.style.width = `${canvasWidth}px`;
        this.canvas.style.height = `${canvasHeight}px`;
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


