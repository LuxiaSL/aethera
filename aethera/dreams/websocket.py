"""
WebSocket Hub for Dream Window

Manages two types of WebSocket connections:
1. Browser viewers: Receive frame broadcasts
2. GPU connection: Sends frames to broadcast

Frame protocol uses binary messages for efficiency:
- Type byte (0x01 = frame, 0x02 = state, etc.)
- Payload (WebP data, msgpack, etc.)
"""

import asyncio
import logging
import time
from typing import Optional, Set, TYPE_CHECKING
from fastapi import WebSocket, WebSocketDisconnect

from .frame_cache import FrameCache
from .presence import ViewerPresenceTracker
from .frame_playback import FramePlaybackQueue

if TYPE_CHECKING:
    from .gpu_manager import RunPodManager

logger = logging.getLogger(__name__)

# Message type bytes
MSG_FRAME = 0x01
MSG_STATE = 0x02
MSG_HEARTBEAT = 0x03
MSG_STATUS = 0x04


class DreamWebSocketHub:
    """
    Central hub for Dream Window WebSocket connections
    
    Responsibilities:
    - Accept browser viewer connections
    - Receive frames from GPU connection
    - Broadcast frames to all viewers
    - Track connection health
    """
    
    def __init__(
        self,
        frame_cache: FrameCache,
        presence_tracker: ViewerPresenceTracker,
        gpu_manager: Optional["RunPodManager"] = None,
    ):
        """
        Initialize WebSocket hub
        
        Args:
            frame_cache: Cache for storing received frames
            presence_tracker: Tracks viewer presence for GPU lifecycle
            gpu_manager: Optional GPU manager for lifecycle notifications
        """
        self.frame_cache = frame_cache
        self.presence = presence_tracker
        self.gpu_manager = gpu_manager
        
        self._viewers: Set[WebSocket] = set()
        self._gpu_websocket: Optional[WebSocket] = None
        self._lock = asyncio.Lock()
        
        # Status tracking
        self._status = "idle"  # idle, starting, ready, error
        self._status_message = "Waiting for connection..."
        self._last_frame_time: float = 0
        
        # Frame numbering counter (incremented on receive, not cache add)
        # Prevents duplicate frame numbers when frames queue before caching
        self._next_frame_number: int = 1
        
        # Frame playback queue for smooth pacing
        self._playback_queue = FramePlaybackQueue(
            broadcast_callback=self._broadcast_frame,
            on_frame_displayed=self._on_frame_displayed,
        )
        self._playback_task: Optional[asyncio.Task] = None
    
    @property
    def viewer_count(self) -> int:
        return len(self._viewers)
    
    @property
    def gpu_connected(self) -> bool:
        return self._gpu_websocket is not None
    
    @property
    def status(self) -> str:
        return self._status
    
    def set_status(self, status: str, message: str = "") -> None:
        """Update status and optionally broadcast to viewers"""
        self._status = status
        self._status_message = message
        logger.info(f"Status changed: {status} - {message}")
    
    # ==================== Viewer Connections ====================
    
    async def connect_viewer(self, websocket: WebSocket) -> None:
        """
        Handle a new browser viewer connection
        
        Args:
            websocket: The connecting WebSocket
        """
        await websocket.accept()
        
        async with self._lock:
            self._viewers.add(websocket)
        
        # Track presence (may trigger GPU start)
        await self.presence.on_viewer_connect(websocket)
        
        # Send current status
        await self._send_status_to_viewer(websocket)
        
        # Send current frame if available
        current_frame = await self.frame_cache.get_current_frame()
        if current_frame:
            try:
                await asyncio.wait_for(
                    websocket.send_bytes(bytes([MSG_FRAME]) + current_frame.data),
                    timeout=5.0
                )
            except (asyncio.TimeoutError, Exception) as e:
                logger.warning(f"Failed to send initial frame: {e}")
    
    async def disconnect_viewer(self, websocket: WebSocket) -> None:
        """
        Handle viewer disconnection
        
        Args:
            websocket: The disconnecting WebSocket
        """
        async with self._lock:
            self._viewers.discard(websocket)
        
        # Track presence (may trigger GPU shutdown timer)
        await self.presence.on_viewer_disconnect(websocket)
    
    async def handle_viewer_message(self, websocket: WebSocket, data: str) -> None:
        """
        Handle message from viewer
        
        Args:
            websocket: The viewer's WebSocket
            data: JSON message string
        """
        import json
        try:
            msg = json.loads(data)
            msg_type = msg.get("type")
            
            if msg_type == "ping":
                # Keepalive - just acknowledge
                await websocket.send_json({"type": "pong"})
            
            # Future: handle quality preferences, etc.
        
        except json.JSONDecodeError:
            logger.warning(f"Invalid JSON from viewer: {data[:100]}")
    
    async def _send_status_to_viewer(self, websocket: WebSocket) -> None:
        """Send current status to a specific viewer"""
        try:
            await asyncio.wait_for(
                websocket.send_json({
                    "type": "status",
                    "status": self._status,
                    "message": self._status_message,
                    "frame_count": self.frame_cache.total_frames_received,
                    "viewer_count": self.viewer_count,
                }),
                timeout=5.0
            )
        except (asyncio.TimeoutError, Exception) as e:
            logger.warning(f"Failed to send status: {e}")
    
    async def broadcast_status(self, status: str, message: str) -> None:
        """Broadcast status update to all viewers"""
        self.set_status(status, message)
        
        status_msg = {
            "type": "status",
            "status": status,
            "message": message,
            "frame_count": self.frame_cache.total_frames_received,
            "viewer_count": self.viewer_count,
        }
        
        await self._broadcast_json(status_msg)
    
    async def _broadcast_config(self, target_fps: float) -> None:
        """Broadcast playback config to all viewers"""
        config_msg = {
            "type": "config",
            "target_fps": target_fps,
        }
        
        await self._broadcast_json(config_msg)
        logger.debug(f"Broadcast config to {self.viewer_count} viewers: {target_fps} FPS")
    
    # ==================== GPU Connection ====================
    
    async def connect_gpu(self, websocket: WebSocket) -> None:
        """
        Handle GPU worker connection
        
        Only one GPU connection is allowed at a time.
        
        Args:
            websocket: The GPU's WebSocket connection
        """
        if self._gpu_websocket is not None:
            logger.warning("GPU already connected, rejecting new connection")
            await websocket.close(code=4000, reason="GPU already connected")
            return
        
        await websocket.accept()
        self._gpu_websocket = websocket
        self.presence.set_gpu_running(True)
        
        # Reset FPS session stats for accurate measurement
        self.frame_cache.reset_session()
        
        # Reset frame numbering counter
        self._next_frame_number = 1
        
        # Reset and start playback queue
        self._playback_queue.reset()
        self._playback_task = asyncio.create_task(self._playback_queue.run())
        logger.info("Playback queue started")
        
        # Notify GPU manager
        if self.gpu_manager:
            self.gpu_manager.on_gpu_connected()
        
        logger.info("GPU connected")
        await self.broadcast_status("ready", "Dreams flowing...")
    
    async def disconnect_gpu(self) -> None:
        """Handle GPU disconnection"""
        self._gpu_websocket = None
        self.presence.set_gpu_running(False)
        
        # Stop playback queue
        self._playback_queue.stop()
        if self._playback_task and not self._playback_task.done():
            self._playback_task.cancel()
            try:
                await self._playback_task
            except asyncio.CancelledError:
                pass
        self._playback_task = None
        logger.info("Playback queue stopped")
        
        # Notify GPU manager
        if self.gpu_manager:
            self.gpu_manager.on_gpu_disconnected()
        
        logger.info("GPU disconnected")
        await self.broadcast_status("idle", "Dream machine sleeping...")
    
    async def handle_gpu_message(self, data: bytes) -> None:
        """
        Handle binary message from GPU
        
        Args:
            data: Binary message (type byte + optional payload)
        """
        if len(data) < 1:
            return
        
        msg_type = data[0]
        payload = data[1:] if len(data) > 1 else b""
        
        if msg_type == MSG_FRAME:
            await self._handle_gpu_frame(payload)
        
        elif msg_type == MSG_STATE:
            await self._handle_gpu_state(payload)
        
        elif msg_type == MSG_HEARTBEAT:
            # Just update last contact time
            self._last_frame_time = time.time()
        
        elif msg_type == MSG_STATUS:
            # GPU status update (JSON) - may include config like target_fps
            import json
            try:
                status = json.loads(payload.decode())
                logger.debug(f"GPU status: {status}")
                
                # Check for FPS configuration
                if "target_fps" in status:
                    target_fps = float(status["target_fps"])
                    self._playback_queue.target_fps = target_fps
                    logger.info(f"GPU configured target FPS: {target_fps}")
                    
                    # Broadcast config to browser clients for client-side pacing
                    await self._broadcast_config(target_fps)
            except Exception as e:
                logger.warning(f"Failed to parse GPU status: {e}")
    
    async def _handle_gpu_frame(self, frame_data: bytes) -> None:
        """Queue a frame from GPU for smooth playback"""
        self._last_frame_time = time.time()
        
        # Notify GPU manager of frame receipt
        if self.gpu_manager:
            self.gpu_manager.on_frame_received()
        
        # Assign frame number now (at receive time, not cache time)
        # This prevents duplicate numbers when frames queue before caching
        frame_number = self._next_frame_number
        self._next_frame_number += 1
        
        # Queue for smooth playback (instead of immediate broadcast)
        # The playback loop will broadcast at steady FPS
        await self._playback_queue.add_frame(frame_data, frame_number)
    
    async def _on_frame_displayed(self, frame_data: bytes, frame_number: int) -> None:
        """Callback when playback queue displays a frame"""
        # Add to cache (for new viewer catchup and stats)
        await self.frame_cache.add_frame(
            data=frame_data,
            frame_number=frame_number,
        )
    
    async def _handle_gpu_state(self, state_data: bytes) -> None:
        """Handle state snapshot from GPU"""
        # TODO: Persist state to disk for recovery
        logger.debug(f"Received state snapshot: {len(state_data)} bytes")
    
    # ==================== Broadcasting ====================
    
    async def _broadcast_frame(self, frame_data: bytes) -> None:
        """Broadcast frame to all connected viewers"""
        if not self._viewers:
            return
        
        message = bytes([MSG_FRAME]) + frame_data
        dead_viewers = set()
        
        async with self._lock:
            viewers = set(self._viewers)
        
        for viewer in viewers:
            try:
                # Timeout prevents blocking on half-open connections
                await asyncio.wait_for(viewer.send_bytes(message), timeout=5.0)
            except (asyncio.TimeoutError, Exception):
                dead_viewers.add(viewer)
        
        # Clean up dead connections
        if dead_viewers:
            async with self._lock:
                self._viewers -= dead_viewers
            
            for viewer in dead_viewers:
                await self.presence.on_viewer_disconnect(viewer)
    
    async def _broadcast_json(self, data: dict) -> None:
        """Broadcast JSON message to all viewers"""
        if not self._viewers:
            return
        
        dead_viewers = set()
        
        async with self._lock:
            viewers = set(self._viewers)
        
        for viewer in viewers:
            try:
                # Timeout prevents blocking on half-open connections
                await asyncio.wait_for(viewer.send_json(data), timeout=5.0)
            except (asyncio.TimeoutError, Exception):
                dead_viewers.add(viewer)
        
        # Clean up dead connections
        if dead_viewers:
            async with self._lock:
                self._viewers -= dead_viewers
    
    # ==================== GPU Control ====================
    
    async def send_to_gpu(self, msg_type: int, payload: bytes = b"") -> bool:
        """
        Send control message to GPU
        
        Args:
            msg_type: Message type byte
            payload: Optional payload bytes
        
        Returns:
            True if sent successfully
        """
        if not self._gpu_websocket:
            return False
        
        try:
            await asyncio.wait_for(
                self._gpu_websocket.send_bytes(bytes([msg_type]) + payload),
                timeout=10.0
            )
            return True
        except asyncio.TimeoutError:
            logger.error("Timeout sending to GPU")
            return False
        except Exception as e:
            logger.error(f"Failed to send to GPU: {e}")
            return False
    
    async def request_gpu_shutdown(self) -> bool:
        """Request GPU to save state and shutdown"""
        return await self.send_to_gpu(0x13)  # SHUTDOWN
    
    async def request_gpu_save_state(self) -> bool:
        """Request GPU to save current state"""
        return await self.send_to_gpu(0x12)  # SAVE_STATE
    
    # ==================== Statistics ====================
    
    def get_stats(self) -> dict:
        """Get hub statistics"""
        cache_stats = self.frame_cache.get_stats()
        presence_stats = self.presence.get_status()
        playback_stats = self._playback_queue.get_stats()
        
        return {
            "status": self._status,
            "status_message": self._status_message,
            "viewer_count": self.viewer_count,
            "gpu_connected": self.gpu_connected,
            "last_frame_age_seconds": round(time.time() - self._last_frame_time, 1) if self._last_frame_time > 0 else None,
            **cache_stats,
            **presence_stats,
            "playback": playback_stats,
        }


