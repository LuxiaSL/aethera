"""
chat — #oikos, where the people are.

The haunted channel (#aethera, see aethera/irc) is a replay nobody can speak
into. This is its neighbour: a small live channel for whoever is in the room,
reached from oikos's mIRC window. It is shaped like IRC on purpose (nicks,
masks, joins and quits, ops who can kick, a topic) so the client draws it the
way it draws the ghosts.

Identity is the blog's: a nick and, optionally, a password that becomes the
same tripcode a comment would carry (Comment.generate_tripcode, same salt).
The trip is shown as the host in the mask. Nothing else about a person (never
their IP) leaves the server.

Nothing is stored. The channel keeps its last few lines in memory for whoever
joins next and forgets everything on restart, the way IRC did.

A dropped connection isn't a quit, not at once: the seat is held for
GRACE_S, and whoever comes back in time (the same tripcode; or, without one,
the same address) sits straight back down with nobody the wiser. Tabs that
are frozen and thawed, laptops that sleep, networks that blink: no join/quit
churn. A tripcode can also take its seat back from a connection that hasn't
noticed it's dead yet (that one is closed with 4002).
"""

from __future__ import annotations

import asyncio
import logging
import re
import time
from collections import deque
from dataclasses import dataclass, field
from typing import Annotated, Any, Callable, Literal, Protocol, Union

from pydantic import BaseModel, Field, TypeAdapter, ValidationError

from aethera.models.models import Comment

logger = logging.getLogger(__name__)

CHANNEL = "#oikos"
DEFAULT_TOPIC = "the living room | be kind, you are being haunted next door"
HOST = "aetherawi.red"

#: how long a dropped connection keeps its seat
GRACE_S = 30.0
#: the close code for a connection whose seat was taken back by its own tripcode
TAKEN_OVER = 4002

MAX_TEXT = 400
MAX_TOPIC = 200
MAX_REASON = 120
#: a raw frame longer than this is not parsed at all
MAX_FRAME = 4096

#: IRC's nick alphabet (RFC 2812), a little shorter than most networks allowed
NICK_RE = re.compile(r"^[A-Za-z\[\]\\`_^{|}][A-Za-z0-9\[\]\\`_^{|}\-]{0,15}$")
#: services' names, and the house's own: only an op's tripcode may wear these
RESERVED = frozenset({
    "chanserv", "nickserv", "operserv", "memoserv", "hostserv", "global",
    "server", "services", "ircop", "oper", "luxia", "celeste",
})

#: C0/C1 controls (mIRC colour codes among them) and the bidi overrides that
#: would let one line pretend to be another
_STRIP = re.compile(r"[\x00-\x1f\x7f-\x9f‎‏‪-‮⁦-⁩]")


def clean(text: str, limit: int) -> str:
    """One line of plain text: no controls, no newlines, trimmed to `limit`."""
    return _STRIP.sub("", text.replace("\r", " ").replace("\n", " ")).strip()[:limit]


# ---- what a client may send -------------------------------------------------------

class Hello(BaseModel):
    type: Literal["hello"]
    nick: str = Field(max_length=64)
    password: str | None = Field(default=None, max_length=256)


class Say(BaseModel):
    type: Literal["say"]
    text: str = Field(max_length=MAX_FRAME)
    action: bool = False


class NickChange(BaseModel):
    type: Literal["nick"]
    nick: str = Field(max_length=64)


class Kick(BaseModel):
    type: Literal["kick"]
    nick: str = Field(max_length=64)
    reason: str = Field(default="", max_length=MAX_FRAME)


class SetTopic(BaseModel):
    type: Literal["topic"]
    text: str = Field(max_length=MAX_FRAME)


class Whois(BaseModel):
    type: Literal["whois"]
    nick: str = Field(max_length=64)


Command = Annotated[Union[Say, NickChange, Kick, SetTopic, Whois], Field(discriminator="type")]
_commands: TypeAdapter[Command] = TypeAdapter(Command)


# ---- what the channel says ----------------------------------------------------------

EventKind = Literal["message", "action", "join", "part", "quit", "kick", "nick", "topic"]


class ChatEvent(BaseModel):
    kind: EventKind
    nick: str
    at: float  # epoch milliseconds
    mask: str | None = None
    text: str = ""
    #: kick: who was kicked; nick: the new nick
    target: str | None = None


class Name(BaseModel):
    nick: str
    op: bool


class Socket(Protocol):
    """The part of a WebSocket the hub uses (so tests can hand it a fake)."""

    async def send_json(self, data: Any) -> None: ...

    async def close(self, code: int = 1000) -> None: ...


@dataclass(eq=False)
class Member:
    ws: Socket
    nick: str
    trip: str | None
    ip: str
    op: bool
    signon: float
    tokens: float
    refilled: float
    #: flood control: how many lines at once, and how fast the bucket refills
    burst: int
    refill_s: float
    strikes: deque[float] = field(default_factory=deque)
    gone: bool = False
    #: while the connection is lost and the seat is held: the timer that ends it
    grace: asyncio.Task[None] | None = None

    @property
    def away(self) -> bool:
        """Connection lost, seat still held (see ChatHub.drop)."""
        return self.ws is VOID

    @property
    def mask(self) -> str:
        ident = f"~{self.nick.lower()[:9]}"
        return f"{ident}@{self.trip}.trip.{HOST}" if self.trip else f"{ident}@guest.oikos"


class _Void:
    """Where a dropped member's messages go while their seat is held: nowhere."""

    async def send_json(self, data: Any) -> None:
        return None

    async def close(self, code: int = 1000) -> None:
        return None


VOID = _Void()


class Refused(Exception):
    """A join the channel turns away, with IRC's numeric for why."""

    def __init__(self, code: str, text: str):
        super().__init__(text)
        self.code = code
        self.text = text


class ChatHub:
    """One channel, its members, its last few lines."""

    def __init__(
        self,
        *,
        channel: str = CHANNEL,
        backlog: int = 100,
        max_members: int = 200,
        per_ip: int = 3,
        ops: frozenset[str] = frozenset(),
        burst: int = 5,
        refill_s: float = 1.2,
        ban_s: float = 600.0,
        send_timeout_s: float = 5.0,
        grace_s: float = GRACE_S,
        clock: Callable[[], float] = time.monotonic,
        wall: Callable[[], float] = time.time,
    ):
        self.channel = channel
        self.topic = DEFAULT_TOPIC
        self.max_members = max_members
        self.per_ip = per_ip
        self.ops = ops
        self.burst = burst
        self.refill_s = refill_s
        self.ban_s = ban_s
        self.send_timeout_s = send_timeout_s
        self.grace_s = grace_s
        self._clock = clock
        self._wall = wall
        self._members: dict[str, Member] = {}  # nick.lower() -> member
        self._backlog: deque[ChatEvent] = deque(maxlen=backlog)
        self._bans: dict[str, float] = {}  # ip -> monotonic expiry

    # ---- reading ----

    @property
    def count(self) -> int:
        return len(self._members)

    def names(self) -> list[Name]:
        ms = sorted(self._members.values(), key=lambda m: (not m.op, m.nick.lower()))
        return [Name(nick=m.nick, op=m.op) for m in ms]

    def _event(self, kind: EventKind, m: Member, **kw: Any) -> ChatEvent:
        return ChatEvent(kind=kind, nick=m.nick, at=self._wall() * 1000, **kw)

    # ---- joining and leaving ----

    def _check_nick(self, nick: str, trip: str | None, me: Member | None = None) -> str:
        nick = nick.strip()
        if not NICK_RE.match(nick) or (nick.lower() in RESERVED and not (trip and trip in self.ops)):
            raise Refused("432", f"{nick[:32]} :Erroneous Nickname")
        taken = self._members.get(nick.lower())
        if taken is not None and taken is not me:
            raise Refused("433", f"{nick} :Nickname is already in use")
        return nick

    def _banned(self, ip: str) -> bool:
        until = self._bans.get(ip)
        if until is None:
            return False
        if until <= self._clock():
            del self._bans[ip]
            return False
        return True

    async def admit(
        self,
        ws: Socket,
        ip: str,
        raw: str,
        *,
        burst: int | None = None,
        refill_s: float | None = None,
    ) -> Member:
        """Parse the hello, let them in, greet them, and tell the channel.

        `burst`/`refill_s` override the channel's flood pace for this member
        (the HTTP API is paced slower: a program can say things far faster
        than anyone can read them). Raises Refused (after telling the socket
        why) when they can't join.
        """
        try:
            try:
                hello = Hello.model_validate_json(raw[:MAX_FRAME])
            except ValidationError:
                raise Refused("451", "You have not registered")
            if self._banned(ip):
                raise Refused("474", f"{self.channel} :Cannot join channel (+b)")
            trip = Comment.generate_tripcode(hello.password) if hello.password else None
            seat = self._members.get(hello.nick.strip().lower())
            if seat is not None and self._may_reclaim(seat, trip, ip):
                return await self._reclaim(seat, ws, ip)
            if len(self._members) >= self.max_members:
                raise Refused("471", f"{self.channel} :Cannot join channel (+l)")
            if sum(1 for m in self._members.values() if m.ip == ip) >= self.per_ip:
                raise Refused("465", "Too many connections from your host")
            nick = self._check_nick(hello.nick, trip)
        except Refused as r:
            await self._send(ws, {"type": "error", "code": r.code, "text": r.text})
            raise

        now = self._clock()
        # no await between the nick check and here: nobody else can take it meanwhile
        b = self.burst if burst is None else burst
        m = Member(ws=ws, nick=nick, trip=trip, ip=ip, op=bool(trip and trip in self.ops),
                   signon=self._wall() * 1000, tokens=float(b), refilled=now,
                   burst=b, refill_s=self.refill_s if refill_s is None else refill_s)
        self._members[nick.lower()] = m
        logger.info("chat: %s joined %s (%d here)", nick, self.channel, len(self._members))

        await self._welcome(m)
        await self._broadcast(self._event("join", m, mask=m.mask), skip=m)
        return m

    async def _welcome(self, m: Member) -> None:
        await self._send(m.ws, {
            "type": "welcome",
            "channel": self.channel,
            "nick": m.nick,
            "mask": m.mask,
            "op": m.op,
            "topic": self.topic,
            "names": [n.model_dump() for n in self.names()],
            "backlog": [e.model_dump() for e in self._backlog],
        })

    @staticmethod
    def _may_reclaim(seat: Member, trip: str | None, ip: str) -> bool:
        """May this hello have that seat back? A tripcode proves it's them (and may
        even take the seat from a connection that hasn't noticed it's dead); with
        no tripcode, only a held seat, and only from the same address."""
        if seat.gone:
            return False
        if seat.trip:
            return trip == seat.trip
        return trip is None and seat.away and seat.ip == ip

    async def _reclaim(self, m: Member, ws: Socket, ip: str) -> Member:
        """Sit back down: no join, no quit; the channel never saw them go."""
        old = m.ws
        self._cancel_grace(m)
        m.ws = ws
        m.ip = ip
        if old is not VOID:
            try:
                await old.close(code=TAKEN_OVER)
            except Exception:
                pass
        logger.info("chat: %s is back in %s", m.nick, self.channel)
        await self._welcome(m)
        return m

    def _cancel_grace(self, m: Member) -> None:
        t, m.grace = m.grace, None
        if t is not None and t is not asyncio.current_task():
            t.cancel()

    async def drop(self, m: Member, ws: Socket, reason: str = "Client exited") -> None:
        """Their connection (`ws`) is gone. Hold the seat for grace_s before
        telling the channel they quit; nothing to do if the seat has already
        moved to a newer connection, or they already left."""
        if m.gone or m.ws is not ws:
            return
        if self.grace_s <= 0:
            await self.leave(m, reason)
            return
        m.ws = VOID
        m.grace = asyncio.get_running_loop().create_task(self._expire(m, reason))

    async def _expire(self, m: Member, reason: str) -> None:
        try:
            await asyncio.sleep(self.grace_s)
        except asyncio.CancelledError:
            return
        if m.away and not m.gone:
            await self.leave(m, reason)

    async def leave(self, m: Member, reason: str = "Client exited") -> None:
        """They're gone (parted, kicked, flooded, timed out, or their seat's
        grace ran out). Idempotent."""
        if m.gone:
            return
        m.gone = True
        self._cancel_grace(m)
        if self._members.get(m.nick.lower()) is m:
            del self._members[m.nick.lower()]
        await self._broadcast(self._event("quit", m, mask=m.mask, text=reason))

    # ---- talking ----

    def _take_token(self, m: Member) -> bool:
        now = self._clock()
        m.tokens = min(float(m.burst), m.tokens + (now - m.refilled) / m.refill_s)
        m.refilled = now
        if m.tokens >= 1:
            m.tokens -= 1
            return True
        return False

    async def handle(self, m: Member, raw: str) -> bool:
        """One frame from a member. False means drop them (they've been quit)."""
        if m.gone:
            return False
        if len(raw) > MAX_FRAME:
            await self.leave(m, "Excess Flood")
            return False
        if not self._take_token(m):
            now = self._clock()
            m.strikes.append(now)
            while m.strikes and m.strikes[0] < now - 30:
                m.strikes.popleft()
            if len(m.strikes) >= 3:
                await self.leave(m, "Excess Flood")
                return False
            await self._error(m, "FLOOD", "Slow down: you are sending too fast")
            return True
        try:
            cmd = _commands.validate_json(raw)
        except ValidationError:
            await self._error(m, "421", "Unknown command")
            return True

        if isinstance(cmd, Say):
            text = clean(cmd.text, MAX_TEXT + 1)
            if not text:
                return True
            if len(text) > MAX_TEXT:
                await self._error(m, "417", "Input line was too long")
                return True
            await self._broadcast(self._event("action" if cmd.action else "message", m, text=text))
        elif isinstance(cmd, NickChange):
            try:
                new = self._check_nick(cmd.nick, m.trip, me=m)
            except Refused as r:
                await self._error(m, r.code, r.text)
                return True
            if new == m.nick:
                return True
            old = m.nick
            del self._members[old.lower()]
            m.nick = new
            self._members[new.lower()] = m
            await self._broadcast(ChatEvent(kind="nick", nick=old, target=new, at=self._wall() * 1000))
        elif isinstance(cmd, Kick):
            await self._kick(m, cmd)
        elif isinstance(cmd, SetTopic):
            if not m.op:
                await self._error(m, "482", f"{self.channel} :You're not channel operator")
                return True
            self.topic = clean(cmd.text, MAX_TOPIC) or DEFAULT_TOPIC
            await self._broadcast(self._event("topic", m, text=self.topic))
        elif isinstance(cmd, Whois):
            who = self._members.get(cmd.nick.strip().lower())
            if who is None:
                await self._error(m, "401", f"{cmd.nick[:32]} :No such nick")
            else:
                await self._send(m.ws, {
                    "type": "whois", "nick": who.nick, "mask": who.mask,
                    "op": who.op, "signon": who.signon, "trip": who.trip,
                })
        return True

    async def _kick(self, m: Member, cmd: Kick) -> None:
        if not m.op:
            await self._error(m, "482", f"{self.channel} :You're not channel operator")
            return
        victim = self._members.get(cmd.nick.strip().lower())
        if victim is None:
            await self._error(m, "401", f"{cmd.nick[:32]} :No such nick")
            return
        if victim is m:
            await self._error(m, "KICK", "You can't kick yourself; /quit instead")
            return
        reason = clean(cmd.reason, MAX_REASON) or m.nick
        victim.gone = True
        del self._members[victim.nick.lower()]
        # a kick keeps them out a while, or a reload would undo it
        self._bans[victim.ip] = self._clock() + self.ban_s
        event = self._event("kick", m, target=victim.nick, text=reason)
        await self._send(victim.ws, {"type": "event", "event": event.model_dump()})
        try:
            await victim.ws.close(code=4001)
        except Exception:
            pass
        await self._broadcast(event)

    # ---- sending ----

    async def _error(self, m: Member, code: str, text: str) -> None:
        await self._send(m.ws, {"type": "error", "code": code, "text": text})

    async def _send(self, ws: Socket, data: dict[str, Any]) -> bool:
        try:
            await asyncio.wait_for(ws.send_json(data), timeout=self.send_timeout_s)
            return True
        except Exception:
            return False

    async def _broadcast(self, event: ChatEvent, skip: Member | None = None) -> None:
        self._backlog.append(event)
        payload = {"type": "event", "event": event.model_dump()}
        targets = [m for m in self._members.values() if m is not skip]
        results = await asyncio.gather(*(self._send(m.ws, payload) for m in targets))
        # whoever couldn't be reached is gone; tell the rest (one level deep: the
        # dead are removed before the next broadcast, so this ends)
        for m, ok in zip(targets, results):
            if not ok and not m.gone:
                await self.leave(m, "Connection reset by peer")


def parse_ops(raw: str | None) -> frozenset[str]:
    """AETHERA_CHAT_OPS: comma-separated tripcodes that are ops on sight."""
    if not raw:
        return frozenset()
    return frozenset(t.strip() for t in raw.split(",") if t.strip())


__all__ = ["ChatHub", "ChatEvent", "Member", "Refused", "parse_ops", "CHANNEL"]
