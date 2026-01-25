"""
WebSocket Hub for Dream Window

Manages two types of WebSocket connections:
1. Browser viewers: Receive frame broadcasts
2. GPU connection: Sends frames to broadcast

Frame protocol uses binary messages for efficiency:
- Type byte (0x01 = frame, 0x02 = state, etc.)
- Payload (WebP data, msgpack, etc.)

Frame Message Format (v2 from GPU):
  0x01 | metadata_len (4 bytes BE) | JSON metadata | WebP data

Metadata JSON:
  {
    "fn": frame_number,      // Sequential frame number from GPU
    "kf": keyframe_number,   // Current keyframe number
    "p": "prompt text"       // Prompt for this keyframe (optional)
  }
"""

import asyncio
import json
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

# Message type bytes (GPU -> VPS)
MSG_FRAME = 0x01
MSG_STATE = 0x02
MSG_HEARTBEAT = 0x03
MSG_STATUS = 0x04

# Control message types (VPS -> GPU)
CTRL_LOAD_STATE = 0x11  # VPS sends saved state to GPU for restoration
CTRL_SAVE_STATE = 0x12  # Request GPU to save state
CTRL_SHUTDOWN = 0x13    # Request GPU shutdown


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
        
        # Current prompt (updated with each keyframe from GPU)
        # This is the prompt that generated the current/recent keyframe
        self._current_prompt: Optional[str] = None
        
        # Frame playback queue for smooth pacing
        self._playback_queue = FramePlaybackQueue(
            broadcast_callback=self._broadcast_frame_with_metadata,
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
        
        # Send current frame if available (with metadata)
        current_frame = await self.frame_cache.get_current_frame()
        if current_frame:
            try:
                # Send metadata first
                meta_msg = {
                    "type": "frame_meta",
                    "fn": current_frame.frame_number,
                    "kf": current_frame.keyframe_number,
                }
                if current_frame.prompt:
                    meta_msg["p"] = current_frame.prompt
                elif self._current_prompt:
                    meta_msg["p"] = self._current_prompt
                
                await asyncio.wait_for(
                    websocket.send_json(meta_msg),
                    timeout=5.0
                )
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
        On connect, sends any saved state to GPU for restoration.
        
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
        
        # Send saved state if available (for resume after pod restart)
        await self._send_saved_state_to_gpu(websocket)
        
        await self.broadcast_status("ready", "Dreams flowing...")
    
    async def _send_saved_state_to_gpu(self, websocket: WebSocket) -> None:
        """
        Send any saved state to GPU for restoration
        
        Called immediately after GPU connects. If state exists on disk,
        it's sent to the GPU so it can resume generation from where it left off.
        """
        from .state_storage import load_state, get_state_info
        
        try:
            # Check if we have saved state
            state_info = await get_state_info()
            if state_info is None:
                logger.info("No saved state to restore")
                return
            
            # Load the state
            saved_state = await load_state()
            if saved_state is None:
                logger.warning("State metadata exists but load failed")
                return
            
            # Send to GPU: CTRL_LOAD_STATE + state bytes
            logger.info(f"Sending saved state to GPU: {len(saved_state)} bytes (age: {state_info.get('age_seconds', '?')}s)")
            await asyncio.wait_for(
                websocket.send_bytes(bytes([CTRL_LOAD_STATE]) + saved_state),
                timeout=30.0  # State can be large
            )
            logger.info("Saved state sent to GPU for restoration")
            
        except asyncio.TimeoutError:
            logger.error("Timeout sending saved state to GPU")
        except Exception as e:
            logger.error(f"Failed to send saved state to GPU: {e}")
    
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
    
    async def _handle_gpu_frame(self, payload: bytes) -> None:
        """
        Queue a frame from GPU for smooth playback
        
        Frame message format (v2):
            metadata_len (4 bytes BE) | JSON metadata | WebP data
        
        Falls back to legacy format (just WebP data) if no metadata header.
        """
        self._last_frame_time = time.time()
        
        # Notify GPU manager of frame receipt
        if self.gpu_manager:
            self.gpu_manager.on_frame_received()
        
        # Parse metadata if present (v2 format)
        frame_number = self._next_frame_number
        keyframe_number = 0
        prompt = None
        frame_data = payload
        
        # Check if this is v2 format (has metadata header)
        # v2 format: metadata_len (4 bytes) + metadata + frame
        # Legacy format: just WebP bytes (starts with RIFF header: 0x52 0x49 0x46 0x46)
        if len(payload) > 4:
            # Check if first bytes look like a length prefix (not RIFF header)
            first_four = payload[:4]
            if first_four != b'RIFF':
                try:
                    # Parse v2 format
                    metadata_len = int.from_bytes(first_four, 'big')
                    
                    if metadata_len > 0 and metadata_len < len(payload) - 4:
                        metadata_bytes = payload[4:4 + metadata_len]
                        frame_data = payload[4 + metadata_len:]
                        
                        # Parse JSON metadata
                        metadata = json.loads(metadata_bytes.decode('utf-8'))
                        frame_number = metadata.get('fn', frame_number)
                        keyframe_number = metadata.get('kf', 0)
                        
                        # Update current prompt if provided (must be a string)
                        if 'p' in metadata and isinstance(metadata['p'], str):
                            self._current_prompt = metadata['p']
                            prompt = metadata['p']
                            logger.debug(f"Frame {frame_number} prompt: {prompt[:60]}...")
                except Exception as e:
                    # Fall back to legacy format only if we haven't successfully extracted frame_data yet
                    # This check prevents corrupting good frame_data due to non-critical errors (e.g., logging)
                    if frame_data is payload:
                        logger.debug(f"Metadata parse failed, using legacy format: {e}")
                    else:
                        logger.warning(f"Error after frame extraction (frame data preserved): {e}")
        
        # Use GPU-provided frame number if available, otherwise assign locally
        if frame_number == self._next_frame_number:
            # Using local counter (legacy or parse failed)
            self._next_frame_number += 1
        else:
            # Using GPU-provided number, sync local counter
            self._next_frame_number = frame_number + 1
        
        # Queue for smooth playback with metadata
        await self._playback_queue.add_frame(
            frame_data, 
            frame_number,
            keyframe_number=keyframe_number,
            prompt=self._current_prompt  # Use cached prompt for all frames
        )
    
    async def _on_frame_displayed(
        self, 
        frame_data: bytes, 
        frame_number: int,
        keyframe_number: int = 0,
        prompt: Optional[str] = None
    ) -> None:
        """Callback when playback queue displays a frame"""
        # Add to cache (for new viewer catchup and stats)
        await self.frame_cache.add_frame(
            data=frame_data,
            frame_number=frame_number,
            keyframe_number=keyframe_number,
            prompt=prompt,
        )
    
    async def _handle_gpu_state(self, state_data: bytes) -> None:
        """Handle state snapshot from GPU - persist to disk for recovery"""
        from .state_storage import save_state
        
        logger.debug(f"Received state snapshot: {len(state_data)} bytes")
        
        # Persist to disk for resume after pod restart
        saved = await save_state(state_data)
        if saved:
            logger.debug("State persisted to disk")
        else:
            logger.warning("Failed to persist state to disk")
    
    # ==================== Broadcasting ====================
    
    async def _broadcast_frame(self, frame_data: bytes) -> None:
        """Broadcast frame to all connected viewers (legacy method)"""
        await self._broadcast_frame_with_metadata(frame_data, 0, 0, None)
    
    async def _broadcast_frame_with_metadata(
        self, 
        frame_data: bytes,
        frame_number: int = 0,
        keyframe_number: int = 0,
        prompt: Optional[str] = None
    ) -> None:
        """
        Broadcast frame to all connected viewers with metadata
        
        Sends a JSON metadata message followed by the binary frame data.
        This allows viewers to receive frame_number and prompt server-authoritatively.
        
        Protocol to viewers:
        1. JSON message: {"type": "frame_meta", "fn": N, "kf": K, "p": "prompt"}
        2. Binary message: 0x01 + WebP data
        """
        if not self._viewers:
            return
        
        # Build metadata JSON for viewers
        meta_msg = {
            "type": "frame_meta",
            "fn": frame_number,
            "kf": keyframe_number,
        }
        if prompt:
            meta_msg["p"] = prompt
        
        # Binary frame message
        frame_message = bytes([MSG_FRAME]) + frame_data
        dead_viewers = set()
        
        async with self._lock:
            viewers = set(self._viewers)
        
        for viewer in viewers:
            try:
                # Send metadata first (JSON), then frame (binary)
                # Timeout prevents blocking on half-open connections
                await asyncio.wait_for(viewer.send_json(meta_msg), timeout=5.0)
                await asyncio.wait_for(viewer.send_bytes(frame_message), timeout=5.0)
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
        return await self.send_to_gpu(CTRL_SHUTDOWN)
    
    async def request_gpu_save_state(self) -> bool:
        """Request GPU to save current state"""
        return await self.send_to_gpu(CTRL_SAVE_STATE)
    
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


