"""
IRC Simulation API Routes

Provides endpoints for:
- WebSocket stream (main broadcast)
- Status endpoint (read-only)
- Health check

No admin endpoints - follows site philosophy of autonomous operation.
Management happens via CLI tools, not HTTP.
"""

import asyncio
import logging
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse

from aethera.irc import IRCBroadcaster
from aethera.irc.broadcaster import get_test_fragment

logger = logging.getLogger(__name__)

router = APIRouter(tags=["irc"])

# ==================== Singleton Broadcaster ====================

_broadcaster: Optional[IRCBroadcaster] = None


def get_broadcaster() -> IRCBroadcaster:
    """Get or create the broadcaster singleton."""
    global _broadcaster
    
    if _broadcaster is None:
        # For now, use test data. Later this will pull from DB.
        _broadcaster = IRCBroadcaster(
            get_next_fragment=get_test_fragment,
            channel_name="#aethera",
        )
        logger.info("IRC broadcaster initialized with test data")
    
    return _broadcaster


# ==================== WebSocket Endpoint ====================

@router.websocket("/ws/irc")
async def irc_stream(websocket: WebSocket):
    """
    WebSocket endpoint for IRC stream.
    
    Clients connect here to receive the synchronized IRC broadcast.
    All clients see the same messages at the same time.
    
    Messages sent (server → client):
    - { type: 'connected', channel: '#aethera' }
    - { type: 'message', data: IRCMessage }
    - { type: 'collapse_start', collapseType: 'netsplit' | ... }
    - { type: 'fragment_end' }
    
    No history is sent on connect - clients join the stream in progress.
    
    The broadcaster auto-starts when the first client connects and runs
    indefinitely, cycling through fragments. No manual start/stop needed.
    """
    broadcaster = get_broadcaster()
    
    # Auto-start broadcaster on first connection
    if not broadcaster.is_running:
        await broadcaster.start()
        logger.info("IRC broadcaster auto-started on first client connection")
    
    try:
        await broadcaster.connect(websocket)
        
        while True:
            try:
                # Keep connection alive, ignore client messages
                await websocket.receive_text()
            except WebSocketDisconnect:
                break
    
    except Exception as e:
        logger.error(f"IRC WebSocket error: {e}")
    
    finally:
        await broadcaster.disconnect(websocket)


# ==================== Read-Only API Endpoints ====================

@router.get("/api/irc/status")
async def irc_status():
    """
    Get IRC simulation status.
    
    Returns current playback state, client count, and fragment info.
    Read-only endpoint, safe to expose publicly.
    """
    broadcaster = get_broadcaster()
    stats = broadcaster.get_stats()
    
    return JSONResponse({
        "status": "running" if stats["is_running"] else "idle",
        "channel": stats["channel"],
        "clients": {
            "websocket_count": stats["client_count"],
        },
        "playback": {
            "current_fragment_id": stats["current_fragment_id"],
            "message_index": stats["message_index"],
        },
    })


@router.get("/api/irc/health")
async def irc_health():
    """
    Health check for IRC module.
    
    Returns basic health status without affecting playback.
    Suitable for monitoring and load balancer probes.
    """
    try:
        broadcaster = get_broadcaster()
        return JSONResponse({
            "status": "healthy",
            "broadcaster_running": broadcaster.is_running,
            "client_count": broadcaster.client_count,
        })
    except Exception as e:
        return JSONResponse(
            {"status": "unhealthy", "error": str(e)},
            status_code=503
        )
