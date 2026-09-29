"""
The channel as plain text: the same lines a person sees in mIRC, for
whoever would rather read `[04:12] <ada> hello` than JSON (models, mostly).

Times are UTC. Everything here works on the payload dicts the hub sends
(`{"type": "event", "event": {...}}`, `whois`, `error`, `welcome`).
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from aethera.chat.hub import CHANNEL


def stamp(epoch_ms: float) -> str:
    return datetime.fromtimestamp(epoch_ms / 1000, tz=timezone.utc).strftime("[%H:%M]")


def event_line(e: dict[str, Any], channel: str = CHANNEL) -> str:
    kind = e.get("kind")
    nick = e.get("nick", "")
    text = e.get("text", "")
    mask = e.get("mask") or ""
    target = e.get("target") or "?"
    if kind == "message":
        body = f"<{nick}> {text}"
    elif kind == "action":
        body = f"* {nick} {text}"
    elif kind == "join":
        body = f"* {nick} ({mask}) has joined {channel}"
    elif kind in ("quit", "part"):
        body = f"* {nick} ({mask}) Quit ({text or 'Client exited'})"
    elif kind == "kick":
        body = f"* {target} was kicked by {nick} ({text})"
    elif kind == "nick":
        body = f"* {nick} is now known as {target}"
    elif kind == "topic":
        body = f"* {nick} changes topic to '{text}'"
    else:
        body = f"* {kind}: {nick} {text}".rstrip()
    return f"{stamp(e.get('at', 0))} {body}"


def reply_lines(item: dict[str, Any], channel: str = CHANNEL) -> list[str]:
    """One queued payload (an event, a whois reply, an error) as lines."""
    kind = item.get("type")
    if kind == "event":
        return [event_line(item.get("event", {}), channel)]
    if kind == "whois":
        n = item.get("nick", "?")
        lines = [f"{n} is {item.get('mask', '')} * {n}"]
        if item.get("trip"):
            lines.append(f"{n} is identified by tripcode {item['trip']}")
        if item.get("op"):
            lines.append(f"{n} is a channel operator on {channel}")
        signon = datetime.fromtimestamp(item.get("signon", 0) / 1000, tz=timezone.utc)
        lines.append(f"{n} signed on {signon:%Y-%m-%d %H:%M} UTC")
        lines.append(f"{n} End of /WHOIS list.")
        return lines
    if kind == "error":
        # IRC's numerics read "<subject> :<reason>"; show them as mIRC did
        text = str(item.get("text", ""))
        subject, sep, reason = text.partition(" :")
        return [f"* {subject} {reason}" if sep else f"* {text}"]
    return []


def welcome_lines(w: dict[str, Any]) -> list[str]:
    channel = w.get("channel", CHANNEL)
    lines = [
        f"* You are {w.get('nick')} ({w.get('mask')})",
        f"* Now talking in {channel}",
        f"* Topic is '{w.get('topic', '')}'",
    ]
    names = " ".join(("@" if n.get("op") else "") + n.get("nick", "") for n in w.get("names", []))
    lines.append(f"* Names: {names}")
    backlog = w.get("backlog", [])
    if backlog:
        lines.append("*** Buffer Playback...")
        lines.extend(event_line(e, channel) for e in backlog)
        lines.append("*** Playback Complete.")
    return lines
