"""
Dreams API Routes

Provides endpoints for:
- Viewer page (HTML)
- Current frame (image)
- Status (JSON)
- WebSocket streams (browsers and GPU)
- Embed code
"""

import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request, Depends
from fastapi.responses import HTMLResponse, Response, JSONResponse

from aethera.utils.templates import templates
from aethera.dreams import (
    DreamWebSocketHub, 
    FrameCache, 
    ViewerPresenceTracker,
    RunPodManager,
    GPUState,
    get_gpu_manager,
    configure_gpu_manager,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["dreams"])

# ==================== Singleton Hub Instance ====================
# These are initialized once and shared across requests

_frame_cache: FrameCache | None = None
_presence_tracker: ViewerPresenceTracker | None = None
_websocket_hub: DreamWebSocketHub | None = None
_gpu_manager: RunPodManager | None = None


def get_hub() -> DreamWebSocketHub:
    """Get or create the WebSocket hub singleton"""
    global _frame_cache, _presence_tracker, _websocket_hub, _gpu_manager
    
    if _websocket_hub is None:
        # Initialize GPU manager first
        _gpu_manager = configure_gpu_manager(
            on_state_change=_on_gpu_state_change,
        )
        
        # Initialize frame cache
        _frame_cache = FrameCache(max_frames=30)
        
        # Initialize presence tracker with GPU callbacks
        _presence_tracker = ViewerPresenceTracker(
            shutdown_delay=30.0,
            api_timeout=300.0,
            on_should_start=_on_gpu_should_start,
            on_should_stop=_on_gpu_should_stop,
        )
        
        # Initialize WebSocket hub with all components
        _websocket_hub = DreamWebSocketHub(
            frame_cache=_frame_cache,
            presence_tracker=_presence_tracker,
            gpu_manager=_gpu_manager,
        )
        logger.info("Dreams module initialized (WebSocket hub + GPU manager)")
    
    return _websocket_hub


async def _on_gpu_should_start() -> None:
    """Callback when GPU should start"""
    global _gpu_manager, _websocket_hub
    
    if _gpu_manager is None:
        logger.warning("GPU manager not initialized")
        return
    
    if _gpu_manager.is_configured:
        logger.info("Starting GPU via RunPod...")
        if _websocket_hub:
            await _websocket_hub.broadcast_status("starting", "Waking up the dream machine...")
        await _gpu_manager.start_gpu()
    else:
        logger.info("GPU start requested (RunPod not configured - waiting for manual GPU connection)")
        if _websocket_hub:
            await _websocket_hub.broadcast_status("starting", "Waiting for GPU connection...")


async def _on_gpu_should_stop() -> None:
    """Callback when GPU should stop"""
    global _gpu_manager, _websocket_hub
    
    if _gpu_manager is None:
        logger.warning("GPU manager not initialized")
        return
    
    if _gpu_manager.is_configured:
        logger.info("Stopping GPU via RunPod...")
        # Request GPU to save state before stopping
        if _websocket_hub:
            await _websocket_hub.request_gpu_save_state()
        await _gpu_manager.stop_gpu()
    else:
        logger.info("GPU stop requested (RunPod not configured)")


async def _on_gpu_state_change(state: GPUState, error: str | None) -> None:
    """Callback when GPU state changes"""
    global _websocket_hub
    
    if _websocket_hub is None:
        return
    
    status_map = {
        GPUState.IDLE: ("idle", "Dream machine sleeping..."),
        GPUState.STARTING: ("starting", "Waking up the dream machine..."),
        GPUState.RUNNING: ("ready", "Dreams flowing..."),
        GPUState.STOPPING: ("stopping", "Saving dreams..."),
        GPUState.ERROR: ("error", error or "Something went wrong"),
    }
    
    status, message = status_map.get(state, ("unknown", "Unknown state"))
    await _websocket_hub.broadcast_status(status, message)


# ==================== HTML Pages ====================

@router.get("/dreams", response_class=HTMLResponse)
async def dreams_viewer(request: Request, embed: int = 0):
    """
    Dream Window viewer page
    
    Args:
        embed: If 1, render minimal embed version without header/footer
    """
    hub = get_hub()
    
    template_name = "dreams/viewer.html"
    context = {
        "request": request,
        "title": "Dreams | æthera",
        "embed": embed == 1,
        "status": hub.status,
        "viewer_count": hub.viewer_count,
    }
    
    return templates.TemplateResponse(request=request, name=template_name, context=context)


# ==================== API Endpoints ====================

@router.get("/api/dreams/status")
async def dreams_status(request: Request):
    """
    Get Dream Window status
    
    Returns system status, viewer count, GPU state, and generation stats.
    """
    global _gpu_manager
    
    hub = get_hub()
    hub.presence.on_api_access()  # Track API activity
    
    stats = hub.get_stats()
    gpu_stats = _gpu_manager.get_status() if _gpu_manager else {}
    
    return JSONResponse({
        "status": stats["status"],
        "gpu": {
            "active": stats["gpu_connected"],
            "state": gpu_stats.get("state", "unknown"),
            "configured": gpu_stats.get("configured", False),
            "provider": "runpod",
            "uptime_seconds": gpu_stats.get("uptime_seconds", 0),
            "frames_received": gpu_stats.get("frames_received", 0),
            "error_message": gpu_stats.get("error_message"),
        },
        "generation": {
            "frame_count": stats["total_frames_received"],
            "current_frame": stats["current_frame_number"],
            "current_keyframe": stats["current_keyframe_number"],
            "fps": stats["average_fps"],
            "resolution": [1024, 512],
        },
        "viewers": {
            "websocket_count": stats["viewer_count"],
            "api_active": stats["has_recent_api_activity"],
        },
        "cache": {
            "frames_cached": stats["frames_cached"],
            "total_bytes": stats["total_bytes_received"],
        },
    })


@router.get("/api/dreams/current")
async def dreams_current_frame(request: Request):
    """
    Get the current frame as a WebP image
    
    Returns the most recent frame, or 204 No Content if no frames available.
    """
    hub = get_hub()
    hub.presence.on_api_access()
    
    current_frame = await hub.frame_cache.get_current_frame()
    
    if current_frame is None:
        return Response(status_code=204)
    
    return Response(
        content=current_frame.data,
        media_type="image/webp",
        headers={
            "X-Frame-Number": str(current_frame.frame_number),
            "X-Keyframe-Number": str(current_frame.keyframe_number),
            "X-Generation-Time-Ms": str(current_frame.generation_time_ms),
            "Cache-Control": "no-cache, no-store, must-revalidate",
        }
    )


@router.get("/api/dreams/embed")
async def dreams_embed_code(request: Request):
    """
    Get embeddable code snippets for Dream Window
    
    Returns iframe code, image URL, and streaming endpoints.
    """
    base_url = str(request.base_url).rstrip("/")
    ws_protocol = "wss" if request.url.scheme == "https" else "ws"
    ws_base = f"{ws_protocol}://{request.url.netloc}"
    
    return JSONResponse({
        "iframe": f'<iframe src="{base_url}/dreams?embed=1" width="1024" height="512" frameborder="0" allow="autoplay" loading="lazy"></iframe>',
        "image_url": f"{base_url}/api/dreams/current",
        "stream_url": f"{ws_base}/ws/dreams",
        "status_url": f"{base_url}/api/dreams/status",
        "resolution": {
            "width": 1024,
            "height": 512,
        },
    })


# ==================== WebSocket Endpoints ====================

@router.websocket("/ws/dreams")
async def dreams_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for browser viewers
    
    Receives:
    - JSON messages (ping, preferences)
    
    Sends:
    - JSON status messages
    - Binary frame data (0x01 + WebP bytes)
    """
    hub = get_hub()
    
    try:
        await hub.connect_viewer(websocket)
        
        while True:
            try:
                # Handle text messages (JSON)
                data = await websocket.receive_text()
                await hub.handle_viewer_message(websocket, data)
            except WebSocketDisconnect:
                break
    
    except Exception as e:
        logger.error(f"Viewer WebSocket error: {e}")
    
    finally:
        await hub.disconnect_viewer(websocket)


@router.websocket("/ws/gpu")
async def gpu_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for GPU worker connection
    
    Receives:
    - Binary messages (frame data, state snapshots)
    
    Sends:
    - Binary control messages (pause, resume, shutdown)
    
    Authentication: TODO Phase 3 - verify auth token
    """
    hub = get_hub()
    
    # TODO Phase 3: Verify authentication token
    # auth_token = websocket.headers.get("Authorization")
    # if not verify_gpu_token(auth_token):
    #     await websocket.close(code=4001, reason="Unauthorized")
    #     return
    
    try:
        await hub.connect_gpu(websocket)
        
        while True:
            try:
                # Receive binary messages
                data = await websocket.receive_bytes()
                await hub.handle_gpu_message(data)
            except WebSocketDisconnect:
                break
    
    except Exception as e:
        logger.error(f"GPU WebSocket error: {e}")
    
    finally:
        await hub.disconnect_gpu()


