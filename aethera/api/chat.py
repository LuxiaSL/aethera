"""
#oikos over a WebSocket.

    client → { type: 'hello', nick, password? }           first, within HELLO_S
             { type: 'say', text, action? }
             { type: 'nick', nick } | { type: 'topic', text }
             { type: 'kick', nick, reason? } | { type: 'whois', nick }
    server → { type: 'welcome', channel, nick, mask, op, topic, names, backlog }
             { type: 'event', event: ChatEvent }
             { type: 'whois', nick, mask, op, signon, trip }
             { type: 'error', code, text }

See aethera/chat/hub.py for what the channel does with them.
"""

import asyncio
import logging
import os

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse

from aethera.chat import ChatHub, Refused, parse_ops

logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])

#: a socket that hasn't said who it is by now is closed
HELLO_S = 15.0

_hub: ChatHub | None = None


def get_hub() -> ChatHub:
    global _hub
    if _hub is None:
        _hub = ChatHub(ops=parse_ops(os.environ.get("AETHERA_CHAT_OPS")))
        logger.info("chat hub ready (%d op trip(s))", len(_hub.ops))
    return _hub


@router.websocket("/ws/chat")
async def chat_socket(websocket: WebSocket):
    hub = get_hub()
    await websocket.accept()
    # behind Caddy (which overwrites X-Forwarded-For) uvicorn's proxy headers
    # make this the visitor's own address; it is used for bans and never sent out
    ip = websocket.client.host if websocket.client else "unknown"

    try:
        raw = await asyncio.wait_for(websocket.receive_text(), timeout=HELLO_S)
    except (asyncio.TimeoutError, WebSocketDisconnect):
        await _close(websocket)
        return
    except Exception as e:
        logger.warning("chat: bad hello frame: %s", e)
        await _close(websocket)
        return

    try:
        member = await hub.admit(websocket, ip, raw)
    except Refused:
        await _close(websocket)
        return

    reason = "Client exited"
    try:
        while True:
            raw = await websocket.receive_text()
            if not await hub.handle(member, raw):
                break
    except WebSocketDisconnect:
        pass
    except Exception as e:
        logger.warning("chat: %s dropped: %s", member.nick, e)
        reason = "Connection reset by peer"
    finally:
        await hub.leave(member, reason)
        await _close(websocket)


async def _close(websocket: WebSocket) -> None:
    try:
        await websocket.close()
    except Exception:
        pass  # already closed


@router.get("/api/chat/status")
async def chat_status():
    """How many are in #oikos, and who (nicks only)."""
    hub = get_hub()
    return JSONResponse({
        "channel": hub.channel,
        "count": hub.count,
        "names": [n.model_dump() for n in hub.names()],
    })
