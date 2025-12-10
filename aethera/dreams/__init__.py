"""
Dreams Module - Live AI Art Streaming

This module provides the infrastructure for streaming Dream Window
frames to web browsers via WebSocket, with smart GPU lifecycle management.

Components:
- websocket: WebSocket hub for browser connections and frame broadcasting
- frame_cache: Frame storage and serving
- presence: Viewer presence tracking for GPU lifecycle
- gpu_manager: RunPod orchestration (placeholder for Phase 3)
- state: State persistence on VPS side
"""

from .websocket import DreamWebSocketHub
from .frame_cache import FrameCache
from .presence import ViewerPresenceTracker

__all__ = [
    "DreamWebSocketHub",
    "FrameCache",
    "ViewerPresenceTracker",
]


