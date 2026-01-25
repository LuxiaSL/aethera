"""
Dreams API Routes

Provides endpoints for:
- Viewer page (HTML)
- Current frame (image)
- Status (JSON)
- WebSocket streams (browsers and GPU)
- Embed code
"""

import asyncio
import json
import logging
import os
import secrets
import time
from collections import defaultdict
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Request, Depends, HTTPException
from fastapi.responses import HTMLResponse, Response, JSONResponse

from aethera.utils.templates import templates

# GPU Authentication Token (set via environment variable)
GPU_AUTH_TOKEN = os.environ.get("DREAM_GEN_AUTH_TOKEN")

# Simple rate limiting for API endpoints
# Uses sliding window counter per IP
_rate_limit_data: dict[str, list[float]] = defaultdict(list)
_rate_limit_last_cleanup: float = 0  # Track last cleanup time
RATE_LIMIT_REQUESTS = 60  # Max requests per window
RATE_LIMIT_WINDOW = 60  # Window in seconds
RATE_LIMIT_CLEANUP_INTERVAL = 300  # Cleanup stale IPs every 5 minutes


def check_rate_limit(request: Request, limit: int = RATE_LIMIT_REQUESTS) -> bool:
    """
    Simple rate limiter using sliding window
    
    Args:
        request: FastAPI request
        limit: Max requests per window
    
    Returns:
        True if request is allowed
    
    Raises:
        HTTPException: If rate limit exceeded
    """
    global _rate_limit_last_cleanup
    
    client_ip = request.client.host if request.client else "unknown"
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    
    # Periodic cleanup of stale IPs to prevent unbounded memory growth
    if now - _rate_limit_last_cleanup > RATE_LIMIT_CLEANUP_INTERVAL:
        stale_ips = [
            ip for ip, times in _rate_limit_data.items()
            if not times or max(times) < window_start
        ]
        for ip in stale_ips:
            del _rate_limit_data[ip]
        if stale_ips:
            logger.debug(f"Rate limit cleanup: removed {len(stale_ips)} stale IPs")
        _rate_limit_last_cleanup = now
    
    # Clean old entries and add new
    _rate_limit_data[client_ip] = [
        t for t in _rate_limit_data[client_ip] if t > window_start
    ]
    
    if len(_rate_limit_data[client_ip]) >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Max {limit} requests per {RATE_LIMIT_WINDOW}s."
        )
    
    _rate_limit_data[client_ip].append(now)
    return True
from aethera.dreams import (
    DreamWebSocketHub, 
    FrameCache, 
    ViewerPresenceTracker,
    RunPodManager,
    GPUState,
    get_gpu_manager,
    configure_gpu_manager,
)
from aethera.dreams.admin_pod_manager import (
    AdminPanelPodManager,
    PodState,
    configure_pod_manager,
)

logger = logging.getLogger(__name__)

router = APIRouter(tags=["dreams"])

# ==================== Singleton Hub Instance ====================
# These are initialized once and shared across requests

_frame_cache: FrameCache | None = None
_presence_tracker: ViewerPresenceTracker | None = None
_websocket_hub: DreamWebSocketHub | None = None
_gpu_manager: RunPodManager | None = None
_pod_manager: AdminPanelPodManager | None = None

# Check which lifecycle mode to use
# - ADMIN_PANEL_URL: Use admin panel for two-pod orchestration (new)
# - RUNPOD_ENDPOINT_ID: Use serverless endpoint directly (legacy)
ADMIN_PANEL_URL = os.environ.get("ADMIN_PANEL_URL", "").rstrip("/")
USE_ADMIN_PANEL = bool(ADMIN_PANEL_URL)


def get_hub() -> DreamWebSocketHub:
    """Get or create the WebSocket hub singleton"""
    global _frame_cache, _presence_tracker, _websocket_hub, _gpu_manager, _pod_manager
    
    if _websocket_hub is None:
        # Initialize the appropriate GPU/pod manager based on config
        if USE_ADMIN_PANEL:
            # Two-pod architecture via admin panel
            _pod_manager = configure_pod_manager(
                admin_url=ADMIN_PANEL_URL,
                on_state_change=_on_pod_state_change,
            )
            logger.info(f"Using admin panel for pod lifecycle: {ADMIN_PANEL_URL}")
            # Still initialize gpu_manager for backward compat (status tracking)
            _gpu_manager = configure_gpu_manager(
                on_state_change=_on_gpu_state_change,
            )
        else:
            # Legacy serverless mode
            _gpu_manager = configure_gpu_manager(
                on_state_change=_on_gpu_state_change,
            )
            logger.info("Using serverless endpoint for GPU lifecycle")
        
        # Initialize frame cache
        _frame_cache = FrameCache(max_frames=30)
        
        # Initialize presence tracker with GPU callbacks
        # Longer shutdown delay to prevent premature GPU shutdown when tabbing away
        # Pass gpu_manager/pod_manager reference so presence tracker can check STARTING state
        _presence_tracker = ViewerPresenceTracker(
            shutdown_delay=300.0,  # 5 minutes - match API timeout
            api_timeout=300.0,
            on_should_start=_on_gpu_should_start,
            on_should_stop=_on_gpu_should_stop,
            gpu_manager=_gpu_manager,
            pod_manager=_pod_manager,
        )
        
        # Initialize WebSocket hub with all components
        _websocket_hub = DreamWebSocketHub(
            frame_cache=_frame_cache,
            presence_tracker=_presence_tracker,
            gpu_manager=_gpu_manager,
        )
        
        mode = "admin panel (two-pod)" if USE_ADMIN_PANEL else "serverless"
        logger.info(f"Dreams module initialized - lifecycle mode: {mode}")
    
    return _websocket_hub


async def _on_gpu_should_start() -> None:
    """Callback when GPU should start"""
    global _gpu_manager, _pod_manager, _websocket_hub
    
    if _websocket_hub:
        await _websocket_hub.broadcast_status("starting", "Waking up the dream machine...")
    
    # Try admin panel (two-pod) first, fall back to serverless
    if USE_ADMIN_PANEL and _pod_manager and _pod_manager.is_configured:
        logger.info("Starting pods via admin panel...")
        await _pod_manager.start_pods()
    elif _gpu_manager and _gpu_manager.is_configured:
        logger.info("Starting GPU via RunPod serverless...")
        await _gpu_manager.start_gpu()
    else:
        logger.info("GPU start requested (no lifecycle manager configured - waiting for manual connection)")
        if _websocket_hub:
            await _websocket_hub.broadcast_status("starting", "Waiting for GPU connection...")


async def _on_gpu_should_stop() -> None:
    """Callback when GPU should stop"""
    global _gpu_manager, _pod_manager, _websocket_hub
    
    # Request GPU to save state before stopping (regardless of mode)
    if _websocket_hub:
        await _websocket_hub.request_gpu_save_state()
        # Give a moment for state to be saved
        await asyncio.sleep(2)
    
    # Try admin panel (two-pod) first, fall back to serverless
    if USE_ADMIN_PANEL and _pod_manager and _pod_manager.is_configured:
        logger.info("Stopping pods via admin panel...")
        await _pod_manager.stop_pods()
    elif _gpu_manager and _gpu_manager.is_configured:
        logger.info("Stopping GPU via RunPod serverless...")
        await _gpu_manager.stop_gpu()
    else:
        logger.info("GPU stop requested (no lifecycle manager configured)")


async def _on_gpu_state_change(state: GPUState, error: str | None) -> None:
    """Callback when GPU state changes (serverless mode)"""
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


async def _on_pod_state_change(state: PodState, error: str | None) -> None:
    """Callback when pod state changes (two-pod mode)"""
    global _websocket_hub
    
    if _websocket_hub is None:
        return
    
    status_map = {
        PodState.IDLE: ("idle", "Dream machine sleeping..."),
        PodState.STARTING: ("starting", "Waking up both pods..."),
        PodState.RUNNING: ("ready", "Dreams flowing..."),
        PodState.STOPPING: ("stopping", "Saving dreams..."),
        PodState.ERROR: ("error", error or "Something went wrong"),
    }
    
    status, message = status_map.get(state, ("unknown", "Unknown state"))
    await _websocket_hub.broadcast_status(status, message)


# ==================== Debug Endpoint (REMOVE IN PRODUCTION) ====================

@router.get("/api/dreams/debug-auth")
async def debug_auth():
    """
    Temporary debug endpoint to check auth configuration.
    REMOVE THIS IN PRODUCTION!
    """
    return {
        "token_configured": GPU_AUTH_TOKEN is not None,
        "token_length": len(GPU_AUTH_TOKEN) if GPU_AUTH_TOKEN else 0,
        "token_prefix": GPU_AUTH_TOKEN[:8] if GPU_AUTH_TOKEN else None,
        "token_suffix": GPU_AUTH_TOKEN[-4:] if GPU_AUTH_TOKEN else None,
    }


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


@router.get("/dreams/api", response_class=HTMLResponse)
async def dreams_api_docs(request: Request):
    """
    Dreams API documentation page
    
    Renders the API documentation in the same style as blog posts.
    """
    from pathlib import Path
    from aethera.utils.markdown import render_markdown
    
    # Read the markdown documentation
    # The docs folder is at the root of the aethera package (alongside aethera/, migrations/, etc.)
    # In Docker this is /app/docs/, locally it's relative to the package root
    docs_path = Path(__file__).resolve().parent.parent.parent / "docs" / "DREAMS_API.md"
    
    if docs_path.exists():
        content = docs_path.read_text(encoding="utf-8")
        content_html = render_markdown(content)
    else:
        logger.warning(f"Documentation not found at {docs_path}")
        content_html = "<p>Documentation not available. Please rebuild the Docker image to include the docs folder.</p>"
    
    return templates.TemplateResponse(
        request=request,
        name="dreams/api_docs.html",
        context={
            "request": request,
            "title": "Dreams API Documentation | æthera",
            "content_html": content_html,
        }
    )


# ==================== API Endpoints ====================

@router.get("/api/dreams/status")
async def dreams_status(request: Request):
    """
    Get Dream Window status
    
    Returns system status, viewer count, GPU state, and generation stats.
    Rate limited to 60 requests per minute per IP.
    
    NOTE: This is a monitoring endpoint - it does NOT trigger GPU start.
    Admin panels and monitoring tools can poll this without causing GPU spin-up.
    """
    check_rate_limit(request)
    global _gpu_manager
    
    hub = get_hub()
    # Status is a monitoring endpoint - don't trigger GPU start
    # This prevents the admin panel from causing infinite job submissions
    hub.presence.on_api_access(trigger_gpu_start=False)
    
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
            # Expose running job ID so admin panel can cancel it
            "running_job_id": gpu_stats.get("running_job_id"),
        },
        "generation": {
            "frame_count": stats["total_frames_received"],
            "current_frame": stats["current_frame_number"],
            "current_keyframe": stats["current_keyframe_number"],
            "fps": stats["average_fps"],  # Rolling FPS (last 30s)
            "session_fps": stats.get("session_fps", 0.0),  # FPS since GPU connected
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
        "playback": stats.get("playback", {}),
    })


@router.get("/api/dreams/current")
async def dreams_current_frame(request: Request):
    """
    Get the current frame as a WebP image
    
    Returns the most recent frame, or 204 No Content if no frames available.
    Rate limited to 60 requests per minute per IP.
    """
    check_rate_limit(request)
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
    Get embeddable code snippets and API endpoints for Dream Window
    
    Returns iframe code, all available endpoints, and documentation.
    """
    base_url = str(request.base_url).rstrip("/")
    ws_protocol = "wss" if request.url.scheme == "https" else "ws"
    ws_base = f"{ws_protocol}://{request.url.netloc}"
    
    return JSONResponse({
        "iframe": f'<iframe src="{base_url}/dreams?embed=1" width="1024" height="512" frameborder="0" allow="autoplay" loading="lazy"></iframe>',
        "endpoints": {
            "viewer_page": f"{base_url}/dreams",
            "current_frame": f"{base_url}/api/dreams/current",
            "status": f"{base_url}/api/dreams/status",
            "health": f"{base_url}/api/dreams/health",
            "recent_frames": f"{base_url}/api/dreams/frames/recent",
            "websocket": f"{ws_base}/ws/dreams",
            "sse": f"{base_url}/api/dreams/sse",
        },
        # Backwards compatibility
        "image_url": f"{base_url}/api/dreams/current",
        "stream_url": f"{ws_base}/ws/dreams",
        "status_url": f"{base_url}/api/dreams/status",
        "resolution": {
            "width": 1024,
            "height": 512,
        },
    })


# ==================== Health & Streaming Endpoints ====================

@router.get("/api/dreams/health")
async def dreams_health():
    """
    Health check endpoint for monitoring and load balancers
    
    Returns basic health status - does not trigger GPU lifecycle.
    Suitable for Kubernetes liveness/readiness probes.
    
    Response:
        200: Service is healthy
        503: Service unavailable (hub failed to initialize)
    """
    try:
        hub = get_hub()
        return JSONResponse({
            "status": "healthy",
            "gpu_connected": hub.gpu_connected,
            "viewer_count": hub.viewer_count,
            "frames_cached": hub.frame_cache.total_frames_received > 0,
        })
    except Exception as e:
        return JSONResponse(
            {"status": "unhealthy", "error": str(e)},
            status_code=503
        )


@router.post("/api/dreams/stop")
async def dreams_stop_gpu(request: Request):
    """
    Force stop the GPU / abort startup
    
    Used by admin panel to abort GPU startup when user clicks "Stop GPU"
    during the STARTING phase. This immediately stops the health check loop
    and resets the GPU state to IDLE.
    
    This is an admin-only endpoint - no rate limiting since it's called
    programmatically by the admin panel.
    
    Returns:
        200: GPU stopped successfully
        500: Error stopping GPU
    """
    global _gpu_manager
    
    try:
        hub = get_hub()
        
        if _gpu_manager is None:
            return JSONResponse({
                "success": False,
                "error": "GPU manager not initialized",
            }, status_code=500)
        
        current_state = _gpu_manager.stats.state.value
        logger.info(f"Admin requested GPU stop (current state: {current_state})")
        
        # Stop the GPU (this cancels health check loop and resets state)
        result = await _gpu_manager.stop_gpu()
        
        return JSONResponse({
            "success": result,
            "previous_state": current_state,
            "new_state": _gpu_manager.stats.state.value,
            "message": "GPU stopped" if result else "GPU stop failed",
        })
    
    except Exception as e:
        logger.error(f"Error stopping GPU: {e}")
        return JSONResponse({
            "success": False,
            "error": str(e),
        }, status_code=500)


@router.get("/api/dreams/frames/recent")
async def dreams_recent_frames(request: Request, count: int = 5, format: str = "metadata"):
    """
    Get recent frames from the cache
    
    Args:
        count: Number of frames to retrieve (1-30, default 5)
        format: "metadata" returns frame info, "urls" includes data URLs
    
    Returns:
        List of recent frames with metadata
    
    Rate limited to 60 requests per minute per IP.
    """
    check_rate_limit(request)
    hub = get_hub()
    hub.presence.on_api_access()
    
    # Clamp count to valid range
    count = max(1, min(30, count))
    
    frames = await hub.frame_cache.get_recent_frames(count)
    
    if format == "urls":
        # Include base64 data URLs (larger response, but useful for clients)
        import base64
        return JSONResponse({
            "frames": [
                {
                    "frame_number": f.frame_number,
                    "keyframe_number": f.keyframe_number,
                    "timestamp": f.timestamp,
                    "generation_time_ms": f.generation_time_ms,
                    "size_bytes": len(f.data),
                    "prompt": f.prompt,
                    "data_url": f"data:image/webp;base64,{base64.b64encode(f.data).decode('ascii')}",
                }
                for f in frames
            ],
            "count": len(frames),
        })
    else:
        # Metadata only (lightweight)
        return JSONResponse({
            "frames": [
                {
                    "frame_number": f.frame_number,
                    "keyframe_number": f.keyframe_number,
                    "timestamp": f.timestamp,
                    "generation_time_ms": f.generation_time_ms,
                    "size_bytes": len(f.data),
                    "prompt": f.prompt,
                }
                for f in frames
            ],
            "count": len(frames),
        })


@router.get("/api/dreams/frame/{frame_number}")
async def dreams_frame_by_number(request: Request, frame_number: int):
    """
    Get a specific frame by number from the cache
    
    Args:
        frame_number: The frame number to retrieve
    
    Returns:
        The frame as a WebP image, or 404 if not in cache
    
    Rate limited to 60 requests per minute per IP.
    """
    check_rate_limit(request)
    hub = get_hub()
    hub.presence.on_api_access()
    
    frames = await hub.frame_cache.get_recent_frames(hub.frame_cache.max_frames)
    
    for frame in frames:
        if frame.frame_number == frame_number:
            return Response(
                content=frame.data,
                media_type="image/webp",
                headers={
                    "X-Frame-Number": str(frame.frame_number),
                    "X-Keyframe-Number": str(frame.keyframe_number),
                    "X-Generation-Time-Ms": str(frame.generation_time_ms),
                    "Cache-Control": "public, max-age=3600",  # Can cache historical frames
                }
            )
    
    raise HTTPException(status_code=404, detail=f"Frame {frame_number} not in cache")


@router.get("/api/dreams/sse")
async def dreams_sse_stream(request: Request):
    """
    Server-Sent Events stream for frame updates
    
    Alternative to WebSocket for simpler clients. Sends:
    - status: JSON status updates
    - frame: Base64-encoded frame data
    
    Note: WebSocket is more efficient for high-frequency frame data.
    SSE is useful for status-only monitoring or constrained environments.
    
    Rate limited: Initial connection counts against rate limit.
    """
    from sse_starlette.sse import EventSourceResponse
    import base64
    
    check_rate_limit(request)
    hub = get_hub()
    
    async def event_generator():
        # Track this as API activity (keeps GPU warm)
        hub.presence.on_api_access()
        
        # Send initial status
        stats = hub.get_stats()
        yield {
            "event": "status",
            "data": json.dumps({
                "status": stats["status"],
                "gpu_connected": stats["gpu_connected"],
                "viewer_count": stats["viewer_count"],
                "frame_count": stats["total_frames_received"],
            })
        }
        
        # Send current frame if available
        current = await hub.frame_cache.get_current_frame()
        if current:
            frame_data = {
                "frame_number": current.frame_number,
                "keyframe_number": current.keyframe_number,
                "data": base64.b64encode(current.data).decode('ascii'),
            }
            if current.prompt:
                frame_data["prompt"] = current.prompt
            yield {
                "event": "frame",
                "data": json.dumps(frame_data)
            }
        
        # Poll for new frames (SSE doesn't have push like WS)
        # This is less efficient but works for simple clients
        last_frame_number = current.frame_number if current else 0
        last_status_time = time.time()
        
        while True:
            # Check if client disconnected
            if await request.is_disconnected():
                break
            
            # Check for new frame
            current = await hub.frame_cache.get_current_frame()
            if current and current.frame_number > last_frame_number:
                last_frame_number = current.frame_number
                frame_data = {
                    "frame_number": current.frame_number,
                    "keyframe_number": current.keyframe_number,
                    "data": base64.b64encode(current.data).decode('ascii'),
                }
                if current.prompt:
                    frame_data["prompt"] = current.prompt
                yield {
                    "event": "frame",
                    "data": json.dumps(frame_data)
                }
                hub.presence.on_api_access()  # Keep GPU warm
            
            # Send status update every 5 seconds
            if time.time() - last_status_time > 5:
                last_status_time = time.time()
                stats = hub.get_stats()
                yield {
                    "event": "status", 
                    "data": json.dumps({
                        "status": stats["status"],
                        "gpu_connected": stats["gpu_connected"],
                        "viewer_count": stats["viewer_count"],
                        "frame_count": stats["total_frames_received"],
                    })
                }
            
            await asyncio.sleep(0.1)  # 10 Hz poll rate
    
    return EventSourceResponse(event_generator())


# ==================== ComfyUI Registry Endpoints ====================
# These endpoints enable the two-pod architecture:
# - ComfyUI pod registers its IP on startup
# - DreamGen pod queries for ComfyUI endpoint
# - Admin panel can check registration status

@router.post("/api/dreams/comfyui/register")
async def register_comfyui_endpoint(request: Request):
    """
    ComfyUI pod registers its IP on startup.
    
    Called by ComfyUI startup script (comfyui-start.sh) with pod's public IP.
    Requires VPS auth token in Authorization header.
    
    Body:
        ip: Public IP of ComfyUI pod
        port: ComfyUI port (default 8188)
        auth_user: Basic auth username (optional)
        auth_pass: Basic auth password (optional)
        pod_id: RunPod pod ID (optional, for correlation)
    
    Returns:
        200: Registration successful
        401: Unauthorized (bad token)
    """
    # Verify auth token
    auth_header = request.headers.get("authorization")
    if not verify_gpu_token(auth_header):
        raise HTTPException(401, "Unauthorized")
    
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(400, "Invalid JSON body")
    
    ip = body.get("ip")
    if not ip:
        raise HTTPException(400, "ip is required")
    
    port = body.get("port", 8188)
    url = body.get("url", "")  # Full URL (e.g., RunPod proxy URL)
    auth_user = body.get("auth_user", "")
    auth_pass = body.get("auth_pass", "")
    pod_id = body.get("pod_id")
    
    from aethera.dreams.comfyui_registry import register_comfyui
    await register_comfyui(ip, port, url, auth_user, auth_pass, pod_id)
    
    # Return the effective URL (proxy URL if provided, otherwise ip:port)
    effective_url = url if url else f"http://{ip}:{port}"
    logger.info(f"ComfyUI registered via API: {effective_url}")
    return JSONResponse({
        "status": "registered",
        "endpoint": effective_url,
    })


@router.get("/api/dreams/comfyui")
async def get_comfyui_endpoint_api(request: Request):
    """
    DreamGen pod queries for ComfyUI endpoint.
    
    Returns the registered ComfyUI URL and credentials so DreamGen
    can connect to ComfyUI for image generation.
    Requires VPS auth token in Authorization header.
    
    Returns:
        200: Endpoint info (url, auth credentials)
        401: Unauthorized
        503: ComfyUI not registered
    """
    auth_header = request.headers.get("authorization")
    if not verify_gpu_token(auth_header):
        raise HTTPException(401, "Unauthorized")
    
    from aethera.dreams.comfyui_registry import get_comfyui_endpoint
    endpoint = await get_comfyui_endpoint()
    
    if endpoint is None:
        raise HTTPException(503, "ComfyUI not registered - start ComfyUI pod first")
    
    return JSONResponse(endpoint)


@router.delete("/api/dreams/comfyui")
async def unregister_comfyui_endpoint(request: Request):
    """
    Unregister ComfyUI (pod stopped).
    
    Called by admin panel when stopping ComfyUI pod.
    Requires VPS auth token in Authorization header.
    
    Returns:
        200: Unregistered successfully
        401: Unauthorized
    """
    auth_header = request.headers.get("authorization")
    if not verify_gpu_token(auth_header):
        raise HTTPException(401, "Unauthorized")
    
    from aethera.dreams.comfyui_registry import unregister_comfyui
    await unregister_comfyui()
    
    logger.info("ComfyUI unregistered via API")
    return JSONResponse({"status": "unregistered"})


@router.get("/api/dreams/comfyui/status")
async def get_comfyui_status(request: Request):
    """
    Get ComfyUI registry status for admin monitoring.
    
    No auth required - status is public info for monitoring.
    Does not expose credentials, only registration state.
    
    Returns:
        200: Registry status
    """
    check_rate_limit(request)
    
    from aethera.dreams.comfyui_registry import get_registry_status
    status = await get_registry_status()
    
    # Strip auth credentials from public status
    if status.get("endpoint"):
        status["endpoint"].pop("auth_user", None)
        status["endpoint"].pop("auth_pass", None)
    
    return JSONResponse(status)


@router.post("/api/dreams/comfyui/health-check")
async def trigger_comfyui_health_check(request: Request):
    """
    Trigger a health check to the registered ComfyUI endpoint.
    
    Requires VPS auth token (admin only).
    Updates the registry's healthy flag based on result.
    
    Returns:
        200: Health check result
        401: Unauthorized
        503: ComfyUI not registered
    """
    auth_header = request.headers.get("authorization")
    if not verify_gpu_token(auth_header):
        raise HTTPException(401, "Unauthorized")
    
    from aethera.dreams.comfyui_registry import health_check_comfyui, is_registered
    
    if not is_registered():
        raise HTTPException(503, "ComfyUI not registered")
    
    healthy = await health_check_comfyui()
    
    return JSONResponse({
        "healthy": healthy,
        "message": "ComfyUI is responding" if healthy else "ComfyUI health check failed",
    })


# ==================== State Management Endpoints ====================
# These endpoints manage generation state persistence for resume functionality

@router.get("/api/dreams/state")
async def get_state_info_api(request: Request):
    """
    Get info about saved generation state.
    
    Returns metadata about the persisted state (if any) without
    loading the full state bytes. Useful for admin monitoring.
    
    Returns:
        200: State info (has_state, saved_at, size_bytes, age)
    """
    check_rate_limit(request)
    
    from aethera.dreams.state_storage import get_state_info
    info = await get_state_info()
    
    return JSONResponse({
        "has_state": info is not None,
        "info": info,
    })


@router.delete("/api/dreams/state")
async def clear_saved_state_api(request: Request):
    """
    Clear saved generation state (fresh start).
    
    Called when you want to start fresh rather than resume.
    Requires VPS auth token (admin only).
    
    Returns:
        200: State cleared
        401: Unauthorized
    """
    auth_header = request.headers.get("authorization")
    if not verify_gpu_token(auth_header):
        raise HTTPException(401, "Unauthorized")
    
    from aethera.dreams.state_storage import clear_state
    await clear_state()
    
    logger.info("Generation state cleared via API")
    return JSONResponse({"status": "cleared"})


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


def verify_gpu_token(auth_header: str | None) -> bool:
    """
    Verify GPU authentication token
    
    Args:
        auth_header: Authorization header value (e.g., "Bearer <token>")
    
    Returns:
        True if token is valid or auth is disabled
    """
    # If no token configured, allow all connections (dev mode)
    if not GPU_AUTH_TOKEN:
        logger.warning("GPU auth disabled (DREAM_GEN_AUTH_TOKEN not set)")
        return True
    
    if not auth_header:
        logger.warning("GPU auth rejected: no auth header provided")
        return False
    
    # Extract token from "Bearer <token>" format
    parts = auth_header.split(" ", 1)
    if len(parts) != 2 or parts[0].lower() != "bearer":
        logger.warning(f"GPU auth rejected: malformed header (got {len(parts)} parts)")
        return False
    
    token = parts[1].strip()  # Strip any whitespace
    
    # Debug logging (show partial tokens for troubleshooting)
    logger.info(f"GPU auth attempt: provided={token[:8]}...{token[-4:]} (len={len(token)})")
    logger.info(f"GPU auth expected: expected={GPU_AUTH_TOKEN[:8]}...{GPU_AUTH_TOKEN[-4:]} (len={len(GPU_AUTH_TOKEN)})")
    
    # Constant-time comparison to prevent timing attacks
    result = secrets.compare_digest(token, GPU_AUTH_TOKEN)
    if not result:
        logger.warning("GPU auth rejected: token mismatch")
    return result


@router.websocket("/ws/gpu")
async def gpu_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for GPU worker connection
    
    Receives:
    - Binary messages (frame data, state snapshots)
    
    Sends:
    - Binary control messages (pause, resume, shutdown)
    
    Authentication:
    - Set DREAM_GEN_AUTH_TOKEN env var on both VPS and GPU
    - GPU sends token in Authorization header: "Bearer <token>"
    - If env var not set, auth is disabled (dev mode)
    """
    # Verify authentication token
    auth_header = websocket.headers.get("authorization")
    if not verify_gpu_token(auth_header):
        logger.warning(f"GPU connection rejected: invalid auth token")
        await websocket.close(code=4001, reason="Unauthorized")
        return
    
    hub = get_hub()
    connected = False
    
    try:
        await hub.connect_gpu(websocket)
        connected = True
        
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
        # Only disconnect if we successfully connected (avoid disconnecting existing GPU)
        if connected:
            await hub.disconnect_gpu()


