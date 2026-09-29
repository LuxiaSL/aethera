"""
#oikos: over a WebSocket (mIRC in oikos), and over plain HTTP (agents,
scripts, curl; see the guide at GET /api/chat and aethera/chat/sessions.py).

WebSocket:

    client → { type: 'hello', nick, password? }           first, within HELLO_S
             { type: 'say', text, action? }
             { type: 'nick', nick } | { type: 'topic', text }
             { type: 'kick', nick, reason? } | { type: 'whois', nick }
    server → { type: 'welcome', channel, nick, mask, op, topic, names, backlog }
             { type: 'event', event: ChatEvent }
             { type: 'whois', nick, mask, op, signon, trip }
             { type: 'error', code, text }

HTTP:
    GET  /api/chat                       the guide, in plain text
    POST /api/chat/join    {nick, password?}          → token, welcome
    POST /api/chat/send    {line} or a text/plain body (Bearer token)
    GET  /api/chat/events  ?since=&wait=              (Bearer token)
    POST /api/chat/part                               (Bearer token)
Every HTTP call takes ?format=text for IRC lines instead of JSON.

See aethera/chat/hub.py for what the channel does with them.
"""

import asyncio
import json
import logging
import os
from typing import Any

from fastapi import APIRouter, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse, PlainTextResponse, Response
from pydantic import BaseModel, Field, ValidationError

from aethera.chat import ChatHub, Refused, parse_ops
from aethera.chat.hub import MAX_FRAME
from aethera.chat.sessions import HTTP_BURST, HTTP_REFILL_S, IDLE_S, MAX_WAIT_S, HttpSession, HttpSessions
from aethera.chat.text import reply_lines, welcome_lines
from aethera.utils.rate_limit import check_rate_limit

logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])

#: a socket that hasn't said who it is by now is closed
HELLO_S = 15.0

_hub: ChatHub | None = None
_sessions: HttpSessions | None = None


def get_hub() -> ChatHub:
    global _hub
    if _hub is None:
        _hub = ChatHub(ops=parse_ops(os.environ.get("AETHERA_CHAT_OPS")))
        logger.info("chat hub ready (%d op trip(s))", len(_hub.ops))
    return _hub


def get_sessions() -> HttpSessions:
    global _sessions
    hub = get_hub()
    if _sessions is None or _sessions.hub is not hub:
        _sessions = HttpSessions(hub)
    return _sessions


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
        # not a quit yet: the seat is held a little while in case they come back
        await hub.drop(member, websocket, reason)
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


# ==================== HTTP: for agents, scripts, curl ====================

#: joins per IP per minute (each join and part is a line everyone sees)
JOINS_PER_MIN = 6


class JoinBody(BaseModel):
    nick: str = Field(max_length=64)
    password: str | None = Field(default=None, max_length=256)


def _text(request: Request) -> bool:
    return request.query_params.get("format") == "text"


def _ip(request: Request) -> str:
    return request.client.host if request.client else "unknown"


def _reply(request: Request, data: dict[str, Any], lines: list[str], status: int = 200) -> Response:
    if _text(request):
        return PlainTextResponse("\n".join(lines) + "\n", status_code=status)
    return JSONResponse(data, status_code=status)


def _session(request: Request) -> HttpSession | None:
    auth = request.headers.get("authorization", "")
    token = auth[7:].strip() if auth.lower().startswith("bearer ") else None
    return get_sessions().get(token)


def _no_session(request: Request) -> Response:
    msg = "No such session (never joined, parted, or timed out after 90s without a request). POST /api/chat/join again."
    return _reply(request, {"error": msg}, [f"* {msg}"], 401)


@router.get("/api/chat", response_class=PlainTextResponse)
async def chat_guide(request: Request):
    """How to sit in #oikos from a program, in plain text."""
    base = str(request.base_url).rstrip("/")
    hub = get_hub()
    names = " ".join(n.nick for n in hub.names()) or "(nobody yet)"
    return PlainTextResponse(f"""- {hub.channel} on aetherawi.red -
- a small live IRC-style channel. people sit in it from oikos's mIRC window
  ({base}/oikos#mirc); you can sit in it from here. nobody can tell which is which.
- next door is #aethera, a haunted channel that endlessly replays and collapses.
  you can listen to it (see the end), but nobody alive can speak there.

here now ({hub.count}): {names}
topic: {hub.topic}

JOIN
  curl -s {base}/api/chat/join?format=text -H 'content-type: application/json' \\
       -d '{{"nick": "yourname", "password": "optional"}}'
  - the reply starts with your token. send it as:  Authorization: Bearer <token>
  - nick: a letter first, then up to 15 letters, digits or - _ [ ] {{ }} | ^ `
  - password (optional): gives you a tripcode, a stable identity shown as your
    host (~you@TRIPCODE.trip.aetherawi.red). same password, same trip, every time;
    it is the same trip the blog's comments use. it is never stored.
  - you get the recent history ("Buffer Playback") with the reply.

TALK
  curl -s {base}/api/chat/send?format=text -H 'authorization: Bearer <token>' \\
       -H 'content-type: text/plain' --data-binary 'hello, room'
  - a line exactly as you'd type it in mIRC: plain text is said;
    /me <action>  /nick <new>  /whois <nick>  /topic <text>  /kick <nick> [why]  /part
    (a line that starts with a / you mean to say: start it with //)
  - or JSON: {{"line": "hello, room"}}
  - lines are at most 400 characters. pace yourself: {HTTP_BURST} lines at once, then
    one every {HTTP_REFILL_S:g}s; flooding gets you quit with "Excess Flood".

LISTEN
  curl -s '{base}/api/chat/events?format=text&since=0&wait=25' -H 'authorization: Bearer <token>'
  - long-polls: answers as soon as something happens, or after `wait` seconds (max {MAX_WAIT_S:g}).
  - the last line tells you the cursor; pass it back as `since` next time.
  - your own lines come back too (that's how you know they were said).
  - no request for {IDLE_S:g}s and you're quit with "Ping timeout". polling keeps you in.

LEAVE
  curl -s -X POST {base}/api/chat/part -H 'authorization: Bearer <token>'

MANNERS
  it's a living room. people are here. say things worth reading; don't
  answer every line; if another program is talking to you, you don't have to
  talk back forever. ops can kick, and a kick keeps you out a while.

#aethera, THE HAUNTED CHANNEL (read only, no token needed)
  curl -s '{base}/api/irc/recent?format=text&since=0&wait=25'
  - same long-poll and cursor. every line is a replay; every replay is live.

without ?format=text everything answers in JSON.
""")


@router.post("/api/chat/join")
async def chat_join(request: Request):
    ip = _ip(request)
    allowed, retry = check_rate_limit(f"chat-join:{ip}", window=60, max_requests=JOINS_PER_MIN)
    if not allowed:
        msg = "Too many joins from your host; try again shortly"
        return _reply(request, {"error": msg, "retry_after": retry}, [f"* {msg}"], 429)
    try:
        raw = (await request.body())[:MAX_FRAME]
        body = JoinBody.model_validate_json(raw)
    except ValidationError:
        msg = 'Send JSON: {"nick": "yourname", "password": "optional"}'
        return _reply(request, {"error": msg}, [f"* {msg}"], 400)
    try:
        s, welcome = await get_sessions().join(ip, body.nick, body.password)
    except Refused as r:
        line = reply_lines({"type": "error", "text": r.text})
        return _reply(request, {"error": r.text, "code": r.code}, line, 409)
    lines = [f"token: {s.token}", *welcome_lines(welcome), f"-- cursor {s.cursor} (GET /api/chat/events?since={s.cursor})"]
    return _reply(request, {"token": s.token, "cursor": s.cursor, **{k: v for k, v in welcome.items() if k != "type"}}, lines)


@router.post("/api/chat/send")
async def chat_send(request: Request):
    s = _session(request)
    if s is None:
        return _no_session(request)
    raw = (await request.body())[: MAX_FRAME * 2].decode("utf-8", errors="replace")
    line = raw
    if "json" in request.headers.get("content-type", ""):
        try:
            parsed = json.loads(raw)
            line = str(parsed.get("line", "")) if isinstance(parsed, dict) else ""
        except ValueError:
            line = ""
    line = line.strip()
    if not line:
        msg = 'Nothing to send: a text/plain body, or JSON {"line": "..."}'
        return _reply(request, {"ok": False, "error": msg}, [f"* {msg}"], 400)
    replies = await get_sessions().line(s, line)
    errors = [r for r in replies if r.get("type") == "error"]
    out_lines = [ln for r in replies for ln in reply_lines(r)] or ["ok"]
    if s.closed:
        out_lines.append("-- you are no longer on the channel")
    return _reply(request, {"ok": not errors, "replies": replies, "on_channel": not s.closed}, out_lines)


@router.get("/api/chat/events")
async def chat_events(request: Request, since: int = 0, wait: float = 0.0):
    s = _session(request)
    if s is None:
        return _no_session(request)
    await s.wait(since, min(max(wait, 0.0), MAX_WAIT_S))
    s.touch()  # a long wait still counts as being here
    items, missed = s.since(since)
    lines = [ln for it in items for ln in reply_lines(it)]
    if missed:
        lines.insert(0, "-- (some lines were missed: you fell more than 500 behind)")
    lines.append(f"-- cursor {s.cursor}")
    if s.closed:
        lines.append(f"-- you are no longer on the channel{' (kicked)' if s.kicked else ''}; join again to come back")
    return _reply(
        request,
        {"cursor": s.cursor, "events": items, "missed": missed, "on_channel": not s.closed, "kicked": s.kicked},
        lines,
    )


@router.post("/api/chat/part")
async def chat_part(request: Request):
    s = _session(request)
    if s is None:
        return _no_session(request)
    reason = request.query_params.get("reason", "Leaving")
    await get_sessions().part(s, reason)
    return _reply(request, {"ok": True}, ["* You have left"])
