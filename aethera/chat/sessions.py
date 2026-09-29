"""
#oikos over plain HTTP, for anything that works in turns (agents, scripts,
curl) rather than holding a socket open.

A session is a member of the channel like any other: the hub sends to it
exactly what it sends a WebSocket, and it keeps those payloads in a queue
until the session polls for them (long-polling, so "nothing yet" can wait a
while before answering). Everyone in the channel sees an HTTP member as just
a nick.

Talking goes through one call, `line()`, which takes what you would type in
mIRC: plain text is said, and `/me`, `/nick`, `/whois`, `/topic`, `/kick`,
`/part` do what they do there.

A session that stops polling is quit from the channel with "Ping timeout",
as a dead client was.
"""

from __future__ import annotations

import asyncio
import json
import logging
import secrets
import time
from collections import deque
from typing import Any, Callable

from aethera.chat.hub import MAX_FRAME, ChatHub, Member, Refused

logger = logging.getLogger(__name__)

#: HTTP members are paced slower than people at a keyboard
HTTP_BURST = 3
HTTP_REFILL_S = 4.0
#: quiet this long (no request of any kind) and you're quit with Ping timeout
IDLE_S = 90.0
#: payloads kept per session for polling
QUEUE = 500
#: the longest a poll may wait
MAX_WAIT_S = 25.0


class HttpSession:
    """What the hub sends to a member reached over HTTP: a queue with a doorbell."""

    def __init__(self, token: str, clock: Callable[[], float]):
        self.token = token
        self._clock = clock
        self.items: deque[tuple[int, dict[str, Any]]] = deque(maxlen=QUEUE)
        self.next_id = 1
        #: the highest id pushed out of the full queue (0: nothing lost yet)
        self.evicted = 0
        self.last_seen = clock()
        self.closed = False
        self.kicked = False
        self.member: Member | None = None
        self._wake = asyncio.Event()

    # ---- the Socket the hub talks to ----

    async def send_json(self, data: Any) -> None:
        if self.closed and not (isinstance(data, dict) and data.get("type") == "event"):
            return
        if len(self.items) == self.items.maxlen and self.items:
            self.evicted = self.items[0][0]
        self.items.append((self.next_id, data))
        self.next_id += 1
        self._wake.set()

    async def close(self, code: int = 1000) -> None:
        self.closed = True
        self.kicked = self.kicked or code == 4001
        self._wake.set()

    # ---- reading ----

    @property
    def cursor(self) -> int:
        return self.next_id - 1

    def touch(self) -> None:
        self.last_seen = self._clock()

    def since(self, cursor: int) -> tuple[list[dict[str, Any]], bool]:
        """Payloads after `cursor`, each with its id; and whether some were lost
        (the queue only holds the last QUEUE)."""
        return [{"id": i, **d} for i, d in self.items if i > cursor], cursor < self.evicted

    def take(self, ids: set[int]) -> None:
        """Remove payloads already handed over directly, so a poll doesn't repeat them."""
        self.items = deque(((i, d) for i, d in self.items if i not in ids), maxlen=QUEUE)

    async def wait(self, cursor: int, timeout: float) -> None:
        """Return once there is something after `cursor`, the session closes, or `timeout`."""
        if timeout <= 0 or self.closed or self.cursor > cursor:
            return
        self._wake.clear()
        try:
            await asyncio.wait_for(self._wake.wait(), timeout=timeout)
        except asyncio.TimeoutError:
            pass


class HttpSessions:
    """Every HTTP member, by token, and the reaper that quits the ones gone quiet."""

    def __init__(self, hub: ChatHub, *, idle_s: float = IDLE_S, clock: Callable[[], float] = time.monotonic):
        self.hub = hub
        self.idle_s = idle_s
        self._clock = clock
        self._sessions: dict[str, HttpSession] = {}
        self._reaper: asyncio.Task[None] | None = None

    def __len__(self) -> int:
        return len(self._sessions)

    async def join(self, ip: str, nick: str, password: str | None) -> tuple[HttpSession, dict[str, Any]]:
        """Into the channel. Returns the session and its welcome; raises Refused."""
        s = HttpSession(secrets.token_urlsafe(24), self._clock)
        hello = json.dumps({"type": "hello", "nick": nick, "password": password})
        s.member = await self.hub.admit(s, ip, hello, burst=HTTP_BURST, refill_s=HTTP_REFILL_S)
        welcome: dict[str, Any] = {}
        # the welcome is the first thing queued; hand it back directly, not via a poll
        for i, d in list(s.items):
            if d.get("type") == "welcome":
                welcome = d
                s.take({i})
                break
        self._sessions[s.token] = s
        self._ensure_reaper()
        return s, welcome

    def get(self, token: str | None) -> HttpSession | None:
        s = self._sessions.get(token or "")
        if s is not None:
            s.touch()
        return s

    async def line(self, s: HttpSession, text: str) -> list[dict[str, Any]]:
        """Say a line (or run a /command). Returns what came back for us alone:
        errors, a whois reply. Everything the channel sees arrives by polling."""
        m = s.member
        if m is None or s.closed or m.gone:
            return [{"type": "error", "code": "NOTCONN", "text": "You are not on the channel"}]
        mark = s.cursor
        cmd = self._command(text)
        if cmd is None:
            return [{"type": "error", "code": "421", "text": text.split()[0][:32] + " :Unknown command"}]
        if cmd.get("type") == "part":
            await self.part(s, cmd.get("reason") or "Leaving")
            return []
        if not await self.hub.handle(m, json.dumps(cmd)):
            s.closed = True
        mine = [(i, d) for i, d in s.items if i > mark and d.get("type") in ("error", "whois")]
        s.take({i for i, _ in mine})
        return [d for _, d in mine]

    @staticmethod
    def _command(text: str) -> dict[str, Any] | None:
        """mIRC's input line: plain text is said; /commands do things. None: unknown."""
        text = text[:MAX_FRAME]
        if not text.startswith("/") or text.startswith("//"):
            return {"type": "say", "text": text[1:] if text.startswith("//") else text}
        name, _, rest = text[1:].partition(" ")
        rest = rest.strip()
        arg, _, tail = rest.partition(" ")
        name = name.lower()
        if name == "me":
            return {"type": "say", "text": rest, "action": True}
        if name in ("say", "msg") and rest:
            return {"type": "say", "text": rest}
        if name == "nick":
            return {"type": "nick", "nick": arg}
        if name == "whois":
            return {"type": "whois", "nick": arg}
        if name == "topic":
            return {"type": "topic", "text": rest}
        if name == "kick":
            return {"type": "kick", "nick": arg, "reason": tail.strip()}
        if name in ("part", "leave", "quit"):
            return {"type": "part", "reason": rest}
        return None

    async def part(self, s: HttpSession, reason: str = "Leaving") -> None:
        self._sessions.pop(s.token, None)
        s.closed = True
        if s.member is not None:
            await self.hub.leave(s.member, reason[:120] or "Leaving")

    async def reap(self) -> int:
        """Quit everyone who hasn't been heard from in idle_s; forget the closed."""
        now = self._clock()
        gone = 0
        for s in list(self._sessions.values()):
            if s.closed and (s.member is None or s.member.gone):
                # kicked or flooded out: keep it long enough to be told, then forget it
                if now - s.last_seen > self.idle_s:
                    self._sessions.pop(s.token, None)
                continue
            if now - s.last_seen > self.idle_s:
                await self.part(s, "Ping timeout")
                gone += 1
        return gone

    def _ensure_reaper(self) -> None:
        if self._reaper is not None and not self._reaper.done():
            return

        async def run() -> None:
            while self._sessions:
                await asyncio.sleep(15)
                try:
                    n = await self.reap()
                    if n:
                        logger.info("chat: %d http session(s) timed out", n)
                except Exception as e:  # the reaper must outlive a bad pass
                    logger.error("chat: reaper pass failed: %s", e)

        self._reaper = asyncio.get_running_loop().create_task(run())


__all__ = ["HttpSession", "HttpSessions", "Refused", "HTTP_BURST", "HTTP_REFILL_S", "IDLE_S", "MAX_WAIT_S"]
