"""
Dreams Module - Live AI Art Streaming

This module provides the infrastructure for streaming Dream Window
frames to web browsers via WebSocket.

Components:
- websocket: WebSocket hub for browser connections and frame broadcasting
- frame_cache: Frame storage and serving
- presence: Viewer presence tracking for GPU lifecycle
- state_storage: State persistence on VPS disk for resume after restart
- comfyui_registry: Service registry for ComfyUI endpoint discovery
"""

from .websocket import DreamWebSocketHub
from .frame_cache import FrameCache
from .presence import ViewerPresenceTracker
from .state_storage import save_state, load_state, get_state_info, clear_state
from .comfyui_registry import (
    register_comfyui,
    get_comfyui_endpoint,
    unregister_comfyui,
    health_check_comfyui,
    get_registry_status,
    is_registered as is_comfyui_registered,
)

__all__ = [
    "DreamWebSocketHub",
    "FrameCache",
    "ViewerPresenceTracker",
    "save_state",
    "load_state",
    "get_state_info",
    "clear_state",
    "register_comfyui",
    "get_comfyui_endpoint",
    "unregister_comfyui",
    "health_check_comfyui",
    "get_registry_status",
    "is_comfyui_registered",
]


