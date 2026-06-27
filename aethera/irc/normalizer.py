"""
IRC Normalizer

Parses raw LLM output into structured IRCMessage objects,
detects collapse sequences, and assigns timing based on pacing style.
"""

import re
import random
import logging
from dataclasses import dataclass
from typing import Optional

from .models import (
    IRCMessage,
    IRCFragment,
    MessageType,
    CollapseType,
    PacingStyle,
    generate_fragment_id,
)

logger = logging.getLogger(__name__)


# ==================== Line Normalization ====================
# Fixes line wrapping issues from token cutoffs during generation

# Pattern for valid IRC line starts
VALID_LINE_START = re.compile(r'^\[\d{2}:\d{2}\]|^\*{3}')


def normalize_lines(lines: list[str]) -> list[str]:
    """
    Fix line wrapping issues from token cutoffs.
    
    When generation hits a token limit mid-line, the next chunk may start
    with a partial line like ", restoring..." or ":18] <user>...".
    
    Simple rule: A valid line starts with [MM:SS] or ***.
    Everything else is a continuation of the previous line.
    
    This handles:
    - Continuation text like ", restoring..."
    - Split timestamps like ":18] <user>..."
    - Any other partial lines from token cutoffs
    
    Args:
        lines: List of raw lines (may include partial/wrapped lines)
        
    Returns:
        List of properly merged lines
    """
    if not lines:
        return lines
    
    normalized = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        if VALID_LINE_START.match(stripped):
            # Valid new line - add it
            normalized.append(stripped)
        elif normalized:
            # Continuation - merge with previous line
            prev = normalized[-1]
            # If prev ends with [ and stripped starts with digits, join directly (timestamp split)
            if prev.endswith('[') or re.search(r'\[\d{1,2}$', prev):
                normalized[-1] = prev + stripped
            else:
                # Normal continuation - add space
                normalized[-1] = prev.rstrip() + " " + stripped
        else:
            # First line but not valid - add anyway (edge case)
            normalized.append(stripped)
    
    return normalized


# Line-level dedup (used DURING generation so the running message count is
# honest and duplicates don't feed back into the next prompt). Mirrors the
# adjacent near-duplicate collapsing that parse_messages does on final output,
# but operates on raw lines. Adjacent-only, so in-fiction non-adjacent
# repetition (a nick saying the same thing across the conversation) is kept.
_DEDUP_MSG_RE = re.compile(r'^(?:\[\d+:\d+\]\s*)?<([^>]+)>\s*(.*)$')
_DEDUP_ACT_RE = re.compile(r'^(?:\[\d+:\d+\]\s*)?\*(?!\*)\s*(\S+)\s+(.*)$')


def _dedup_key(line: str) -> Optional[tuple[str, str, str]]:
    """(kind, nick, content) for message/action lines, else None."""
    s = line.strip()
    if m := _DEDUP_MSG_RE.match(s):
        return ("msg", m.group(1).strip(), m.group(2).strip())
    if m := _DEDUP_ACT_RE.match(s):
        return ("act", m.group(1).strip(), m.group(2).strip())
    return None


def dedup_adjacent_lines(lines: list[str]) -> list[str]:
    """Collapse consecutive near-duplicate message/action lines.

    Same nick + same type, where one content is a prefix of the other (covers
    the base-model "stuck record" echo) -> keep the longer/more-complete line.
    Non-message lines and non-adjacent repeats are left untouched.
    """
    out: list[str] = []
    for line in lines:
        key = _dedup_key(line)
        if out and key:
            prev = _dedup_key(out[-1])
            if prev and prev[0] == key[0] and prev[1] == key[1]:
                a, b = key[2], prev[2]
                if a and b and (a == b or a.startswith(b) or b.startswith(a)):
                    if len(a) > len(b):
                        out[-1] = line  # keep the more-complete version
                    continue
        out.append(line)
    return out


# Pacing configurations (delays in milliseconds)
PACING_CONFIGS = {
    PacingStyle.SLOW: {
        "base_delay": 3000,
        "char_delay": 50,
        "jitter": 2000,
        "collapse_pause": 8000,
        "action_multiplier": 1.5,
    },
    PacingStyle.NORMAL: {
        "base_delay": 1500,
        "char_delay": 30,
        "jitter": 1000,
        "collapse_pause": 5000,
        "action_multiplier": 1.3,
    },
    PacingStyle.FRANTIC: {
        "base_delay": 500,
        "char_delay": 15,
        "jitter": 500,
        "collapse_pause": 3000,
        "action_multiplier": 1.1,
    },
}

# Pattern to extract timestamp from line start
TIMESTAMP_PATTERN = re.compile(r"^\[(\d+):(\d+)\]\s*")

# Pattern to extract header metadata
HEADER_PATTERN = re.compile(
    r"^\[LOG:\s*([#\w]+)\s*\|\s*(\d+)\s*users?\s*\|\s*(\d+)\s*messages?\s*\|\s*(\w+)(?:\s*\|\s*ENDS:\s*(\w+))?\]$",
    re.IGNORECASE
)

# Patterns for parsing IRC-style messages (timestamps optional, captured separately)
PATTERNS = {
    # Standard message: [timestamp] <nick> message
    "message": re.compile(
        r"^(?:\[\d+:\d+\]\s*)?<([^>]+)>\s*(.+)$"
    ),
    # Action: [timestamp] * nick does something. The negative lookahead keeps
    # this from swallowing server notices ("*** nick has quit", "*** ▓▓▓ ...")
    # as actions with nick="**" — IRC actions are single-star, "***" is a notice.
    "action": re.compile(
        r"^(?:\[\d+:\d+\]\s*)?\*(?!\*)\s*(\S+)\s+(.+)$"
    ),
    # Nick change: * nick is now known as newnick
    "nick_change": re.compile(
        r"^(?:\[\d+:\d+\]\s*)?\*\s*(\S+)\s+is\s+now\s+known\s+as\s+(\S+)$",
        re.IGNORECASE
    ),
    # Join: *** nick has joined
    "join": re.compile(
        r"^(?:\[\d+:\d+\]\s*)?\*{3}\s*(\S+)\s+has\s+joined(?:\s+\S+)?$",
        re.IGNORECASE
    ),
    # Part: *** nick has left (reason)
    "part": re.compile(
        r"^(?:\[\d+:\d+\]\s*)?\*{3}\s*(\S+)\s+has\s+left(?:\s+\S+)?(?:\s+\((.+)\))?$",
        re.IGNORECASE
    ),
    # Quit: *** nick has quit (reason)
    "quit": re.compile(
        r"^(?:\[\d+:\d+\]\s*)?\*{3}\s*(\S+)\s+has\s+quit(?:\s+IRC)?(?:\s+\((.+)\))?$",
        re.IGNORECASE
    ),
    # Kick: *** nick was kicked by op (reason)
    "kick": re.compile(
        r"^(?:\[\d+:\d+\]\s*)?\*{3}\s*(\S+)\s+was\s+kicked\s+by\s+(\S+)(?:\s+\((.+)\))?$",
        re.IGNORECASE
    ),
    # System/Server notice: *** message
    "system": re.compile(
        r"^(?:\[\d+:\d+\]\s*)?\*{3}\s+(.+)$"
    ),
    # Netsplit pattern in quit reason
    "netsplit": re.compile(
        r"(\S+\.?\S*)\s+(\S+\.?\S*)",
        re.IGNORECASE
    ),
}

# Collapse detection patterns
COLLAPSE_PATTERNS = {
    CollapseType.NETSPLIT: [
        re.compile(r"netsplit", re.IGNORECASE),
        re.compile(r"\S+\.\S+\s+\S+\.\S+"),  # server.net other.net pattern
    ],
    CollapseType.GLINE: [
        re.compile(r"g-?line", re.IGNORECASE),
        re.compile(r"k-?line", re.IGNORECASE),
        re.compile(r"banned\s+from\s+network", re.IGNORECASE),
    ],
    CollapseType.MASS_KICK: [
        re.compile(r"was\s+kicked", re.IGNORECASE),
    ],
    CollapseType.PING_TIMEOUT: [
        re.compile(r"ping\s+timeout", re.IGNORECASE),
        re.compile(r"timed?\s*out", re.IGNORECASE),
    ],
    CollapseType.SENDQ_EXCEEDED: [
        re.compile(r"sendq\s+exceeded", re.IGNORECASE),
        re.compile(r"excess\s+flood", re.IGNORECASE),
    ],
    CollapseType.CORRUPTION: [
        re.compile(r"[░▒▓█�]+"),  # Corruption characters
        re.compile(r"ERR_"),
        re.compile(r"connection.*reset", re.IGNORECASE),
    ],
    CollapseType.KILL: [
        re.compile(r"\bkilled\b", re.IGNORECASE),  # quit reason "Killed (oper (...))"
    ],
    CollapseType.SERVER_SHUTDOWN: [
        re.compile(r"server\s+terminating", re.IGNORECASE),
        re.compile(r"closing\s+link", re.IGNORECASE),
        re.compile(r"server\s+shut", re.IGNORECASE),
    ],
    CollapseType.TAKEOVER: [
        re.compile(r"seized", re.IGNORECASE),
        re.compile(r"sets\s+mode\s+\+\S*[bimo]", re.IGNORECASE),
    ],
    CollapseType.ERASURE: [
        re.compile(r"has\s+been\s+removed", re.IGNORECASE),
        re.compile(r"was\s+never\s+here", re.IGNORECASE),
        re.compile(r"no\s+longer\s+exists", re.IGNORECASE),
        re.compile(r"is\s+forgetting", re.IGNORECASE),
    ],
}

# Collapse types whose signature appears in SYSTEM (***) lines rather than in
# quit/kick reasons — scanned against system-message content during detection.
SYSTEM_COLLAPSE_TYPES = (
    CollapseType.CORRUPTION, CollapseType.TAKEOVER, CollapseType.ERASURE,
)


@dataclass
class CollapseDetection:
    """Result of collapse detection analysis."""
    detected: bool
    collapse_type: CollapseType
    start_index: int
    involved_nicks: list[str]
    confidence: float  # 0.0 to 1.0


# ==================== Garbage / degeneration filters ====================
# Base models produce two failure modes that aren't repetition (so sampling
# penalties don't help): runaway nicks (absurdly long handles) and keyboard-mash
# (long whitespace-free token runs). These drop such lines at parse time.

MAX_NICK_LEN = 32
MAX_UNBROKEN_RUN = 42  # longest whitespace-free token before a line reads as mash

# A bracketed timestamp ([HH:MM]) only legitimately starts a line. When one
# appears mid-content it's a leaked, truncated next-line start — strip from
# there to the end. Matches [HH:, [HH:MM, [HH:MM] (timestamp-shaped only, so
# footnote-style brackets like [1] or [citation] survive).
_INLINE_TIMESTAMP = re.compile(r"\s*\[\d{1,2}:\d{0,2}\]?.*$")


def strip_inline_timestamp(content: str) -> str:
    """Remove a leaked mid-line timestamp fragment and everything after it."""
    return _INLINE_TIMESTAMP.sub("", content).rstrip()


# Leading "addressee:" the model tics on — it prefixes nearly every line with a
# participant nick + colon ("<Gerald> vapor: ..."). Matches a single non-space,
# non-colon word (1-24 chars) followed by ": " — so it can't touch "http://"
# (no space after colon), "5:30 pm" (no space before "30"), ":)" (no leading
# word), or "ERROR:" (filtered later by the known-nick check). The DOTALL lets
# the captured remainder span the rest of the line.
_ADDRESS_PREFIX_RE = re.compile(r"^([^\s:]{1,24})\s*:\s+(\S.*)$", re.DOTALL)


def strip_leading_address(content: str, known_nicks_lower: set[str]) -> str:
    """Strip a leading 'nick:' address prefix IFF the nick is a known participant.

    Returns the content unchanged when the leading word isn't a known nick (so
    'ERROR: ...', 'Re: ...', 'TODO: ...' survive). Shared by the normalizer and
    the one-off backfill migration so both clean identically.
    """
    m = _ADDRESS_PREFIX_RE.match(content)
    if m and m.group(1).lower() in known_nicks_lower:
        return m.group(2).strip()
    return content


# Scaffold/meta leak: the base model occasionally bleeds HTML (bash.org pages are
# HTML) or shell-prompt fragments into dialogue ("...come back. <br /><br />",
# "</p> <h3>", "archivist@irc-archive:~/logs$ cat"). Stop sequences catch most at
# generation time; this strips whatever slips through. Conservative tag whitelist
# so a literal "<3" or "<- arrow" in chat survives — only real markup is removed.
_HTML_TAG_RE = re.compile(
    r"</?\s*(?:p|br|hr|div|span|pre|code|blockquote|h[1-6]|ul|ol|li|a|b|i|"
    r"em|strong|table|tr|td|th|img|html|body|head|title|!--)\b[^>]*/?>",
    re.IGNORECASE,
)
_SHELL_PROMPT_RE = re.compile(r"\S+@\S+:[~/\w.\-]*\$\s.*$")  # user@host:~/path$ ...


def strip_meta_artifacts(content: str) -> str:
    """Strip leaked HTML tags and trailing shell-prompt fragments from content.

    Returns the cleaned text (possibly empty, if the line was pure markup — the
    caller drops empty husks, same as the address-prefix strip)."""
    s = _HTML_TAG_RE.sub("", content)
    s = _SHELL_PROMPT_RE.sub("", s)
    if s != content:
        # Collapse the whitespace gap left where a tag was removed ("a <br /> b"
        # -> "a  b" -> "a b"). Only when we actually stripped something, so spaced
        # content we didn't touch is preserved.
        s = re.sub(r"\s{2,}", " ", s)
    return s.strip()


def _looks_like_mash(text: str) -> bool:
    """True if text has an implausibly long whitespace-free run."""
    if not text:
        return False
    return any(len(tok) > MAX_UNBROKEN_RUN for tok in text.split())


def _is_garbage_nick(nick: str) -> bool:
    """True if a nick is too long or itself looks like mash (runaway handle)."""
    if not nick:
        return False
    return len(nick) > MAX_NICK_LEN or _looks_like_mash(nick)


def _is_garbage_system_line(line: str) -> bool:
    """True for fallback 'system' lines that are really truncation artifacts:
    bare punctuation, truncated nick stubs ('<Refle' with no '>'), near-empty
    fragments, symbol soup, or mash."""
    s = line.strip()
    if len(s) < 3:
        return True
    if "<" in s and ">" not in s:  # truncated '<nick' fragment, no closing '>'
        return True
    alnum = sum(c.isalnum() for c in s)
    if alnum < max(2, len(s) * 0.3):  # mostly non-alphanumeric
        return True
    return _looks_like_mash(s)


def is_degenerate_chunk(chunk: str) -> bool:
    """True if a generated candidate chunk is dominated by degeneration
    (keyboard-mash, runaway nicks, truncated-nick stubs).

    Used to reroll bad candidates BEFORE judging, so the judge always sees clean
    options. Tolerates ordinary trailing truncation (the normalizer fixes that);
    only flags catastrophic garbage.
    """
    lines = [l.strip() for l in chunk.split("\n") if l.strip()]
    if not lines:
        return True
    bad = 0
    for line in lines:
        if _looks_like_mash(line):
            return True  # any mash run means the candidate degenerated
        m = re.search(r"<([^>]+)>", line)
        if m and _is_garbage_nick(m.group(1)):
            bad += 1
        elif "<" in line and ">" not in line:  # truncated '<nick' stub
            bad += 1
    return bad >= max(1, len(lines) * 0.4)


@dataclass
class RawFragment:
    """Raw output from LLM before normalization."""
    content: str
    style: str
    intended_collapse: CollapseType
    pacing: PacingStyle


class NormalizationError(Exception):
    """Raised when normalization fails."""
    pass


class IRCNormalizer:
    """
    Normalizes raw LLM output into structured IRC fragments.
    
    Responsibilities:
    - Parse IRC-formatted text into IRCMessage objects
    - Detect and classify collapse sequences
    - Assign timing delays based on pacing style
    - Validate output schema compliance
    """
    
    def __init__(self, channel: str = "#aethera"):
        self.channel = channel
    
    def normalize(self, raw: RawFragment) -> IRCFragment:
        """
        Normalize a raw fragment into a structured IRCFragment.
        
        Args:
            raw: Raw LLM output with metadata
            
        Returns:
            Normalized IRCFragment ready for storage/broadcast
            
        Raises:
            NormalizationError: If parsing fails or output is invalid
        """
        # Parse raw content into messages
        messages = self.parse_messages(raw.content)
        
        if not messages:
            raise NormalizationError("No valid messages parsed from content")
        
        # Detect collapse sequence
        collapse = self.detect_collapse(messages, raw.intended_collapse)
        
        # Format collapse messages (ensure proper structure)
        if collapse.detected:
            messages = self.format_collapse(messages, collapse)
        
        # Assign timing to all messages
        messages = self.assign_timing(messages, raw.pacing, collapse)

        # Clamp the collapse index into range — line filtering/dedup can shift it
        # relative to where detect_collapse found it, and an out-of-range value
        # would otherwise fail validation and discard a good fragment.
        raw_collapse_idx = collapse.start_index if collapse.detected else len(messages) - 3
        collapse_start_index = max(0, min(raw_collapse_idx, len(messages) - 1))

        # Build and return fragment
        return IRCFragment(
            id=generate_fragment_id(),
            messages=messages,
            style=raw.style,
            collapse_type=collapse.collapse_type if collapse.detected else raw.intended_collapse,
            pacing=raw.pacing,
            collapse_start_index=collapse_start_index,
        )
    
    def parse_messages(self, content: str) -> list[IRCMessage]:
        """
        Parse raw text content into IRCMessage objects.
        
        Handles various IRC log formats:
        - <nick> message
        - [MM:SS] <nick> message (with timestamp)
        - * nick action
        - *** nick has joined/left/quit
        
        Timestamps are extracted and used for delay calculation.
        
        Automatically normalizes lines to handle token cutoff issues
        where lines may be split across generation chunks.
        """
        messages = []
        raw_lines = content.strip().split("\n")
        
        # Filter out header lines first
        filtered_lines = [
            line.strip() for line in raw_lines 
            if line.strip() and not line.strip().startswith("[LOG:")
        ]
        
        # Normalize lines to fix token cutoff wrapping issues
        lines = normalize_lines(filtered_lines)
        
        for i, line in enumerate(lines):
            msg = self._parse_line(line, i)
            if msg:
                messages.append(msg)

        # Strip leaked HTML / shell-prompt scaffold from content (a message that
        # was pure markup becomes empty and is dropped). Before the other passes so
        # cleaned lines dedup and address-strip normally.
        messages = self._strip_meta_artifacts(messages)

        # Strip the model's "addressee:" tic. It prefixes nearly every line with
        # a participant nick + colon ("<Gerald> vapor: ..."); strip it when the
        # prefix is a KNOWN nick (so ERROR:/Re:/http:/times/emoticons survive).
        # Done before dedup so any newly-identical lines collapse too.
        messages = self._strip_address_prefixes(messages)

        # Collapse consecutive near-duplicate lines (base-model stuck-record:
        # "No! No! We've got" then "No! No! We've got to tell Mantega" -> keep
        # the longer; exact repeats -> drop).
        deduped: list[IRCMessage] = []
        for msg in messages:
            if deduped:
                prev = deduped[-1]
                a = (msg.content or "").strip()
                b = (prev.content or "").strip()
                if (msg.nick == prev.nick and msg.type == prev.type and a and b
                        and (a == b or a.startswith(b) or b.startswith(a))):
                    if len(a) > len(b):
                        deduped[-1] = msg  # keep the more-complete version
                    continue
            deduped.append(msg)

        return deduped
    
    def _strip_meta_artifacts(self, messages: list[IRCMessage]) -> list[IRCMessage]:
        """Strip leaked HTML/shell-prompt scaffold from every message's content.

        A message whose content was ONLY markup becomes empty and is dropped (same
        husk-drop policy as the address-prefix strip)."""
        out: list[IRCMessage] = []
        for m in messages:
            if m.content:
                cleaned = strip_meta_artifacts(m.content)
                if cleaned != m.content:
                    if not cleaned.strip():
                        continue  # was pure markup — drop the empty husk
                    m = m.model_copy(update={"content": cleaned})
            out.append(m)
        return out

    def _strip_address_prefixes(self, messages: list[IRCMessage]) -> list[IRCMessage]:
        """Remove leading 'knownnick:' address prefixes from message content.

        A message that was ONLY a prefix ('vapor:') becomes empty and is dropped.
        """
        known = {
            (m.nick or "").strip().lower()
            for m in messages
            if m.type == MessageType.MESSAGE and m.nick
        }
        known.discard("")
        if not known:
            return messages

        out: list[IRCMessage] = []
        for m in messages:
            if m.type == MessageType.MESSAGE and m.content:
                cleaned = strip_leading_address(m.content, known)
                if cleaned != m.content:
                    if not cleaned.strip():
                        continue  # was only 'nick:' — drop the empty husk
                    m = m.model_copy(update={"content": cleaned})
            out.append(m)
        return out

    def _extract_timestamp(self, line: str) -> tuple[str, Optional[int]]:
        """
        Extract timestamp from line start if present.
        
        Returns:
            (line_without_timestamp, seconds_from_start or None)
        """
        match = TIMESTAMP_PATTERN.match(line)
        if match:
            minutes = int(match.group(1))
            seconds = int(match.group(2))
            total_seconds = minutes * 60 + seconds
            remaining_line = line[match.end():]
            return remaining_line, total_seconds
        return line, None
    
    def _parse_line(self, line: str, index: int) -> Optional[IRCMessage]:
        """Parse a single line into an IRCMessage."""
        # Extract timestamp first
        line_content, timestamp_seconds = self._extract_timestamp(line)

        # Drop whole-line keyboard-mash before pattern matching.
        if _looks_like_mash(line_content):
            return None
        
        # Generate timestamp string
        if timestamp_seconds is not None:
            minutes = timestamp_seconds // 60
            seconds = timestamp_seconds % 60
            timestamp_str = f"{minutes:02d}:{seconds:02d}"
        else:
            timestamp_str = self._generate_timestamp(index)
            timestamp_seconds = index * 10  # Fallback: ~10 seconds per message
        
        # Store raw seconds for delay calculation (will be used later)
        # We embed it in the timestamp field in a parseable format
        
        # Try each pattern in order of specificity
        
        # Quit
        if match := PATTERNS["quit"].match(line_content):
            nick = match.group(1)
            reason = match.group(2) or ""
            return IRCMessage(
                timestamp=timestamp_str,
                nick=nick,
                content=reason,
                type=MessageType.QUIT,
                delay_after=0,
            )
        
        # Kick
        if match := PATTERNS["kick"].match(line_content):
            target = match.group(1)
            op = match.group(2)
            reason = match.group(3) or ""
            return IRCMessage(
                timestamp=timestamp_str,
                nick=op,
                content="",
                type=MessageType.KICK,
                delay_after=0,
                meta={"target": target, "reason": reason},
            )
        
        # Join
        if match := PATTERNS["join"].match(line_content):
            nick = match.group(1)
            return IRCMessage(
                timestamp=timestamp_str,
                nick=nick,
                content="",
                type=MessageType.JOIN,
                delay_after=0,
            )
        
        # Part
        if match := PATTERNS["part"].match(line_content):
            nick = match.group(1)
            reason = match.group(2) or ""
            return IRCMessage(
                timestamp=timestamp_str,
                nick=nick,
                content=reason,
                type=MessageType.PART,
                delay_after=0,
            )
        
        # Nick change (before action, as it uses * prefix)
        if match := PATTERNS["nick_change"].match(line_content):
            old_nick = match.group(1)
            new_nick = match.group(2)
            return IRCMessage(
                timestamp=timestamp_str,
                nick=old_nick,
                content=f"is now known as {new_nick}",
                type=MessageType.ACTION,
                delay_after=0,
            )
        
        # Action
        if match := PATTERNS["action"].match(line_content):
            nick = match.group(1)
            action = strip_inline_timestamp(match.group(2))
            return IRCMessage(
                timestamp=timestamp_str,
                nick=nick,
                content=action,
                type=MessageType.ACTION,
                delay_after=0,
            )
        
        # Standard message
        if match := PATTERNS["message"].match(line_content):
            nick = match.group(1)
            content = strip_inline_timestamp(match.group(2))
            # Drop runaway-nick / keyboard-mash degeneration the model emits.
            if _is_garbage_nick(nick) or _looks_like_mash(content):
                return None
            return IRCMessage(
                timestamp=timestamp_str,
                nick=nick,
                content=content,
                type=MessageType.MESSAGE,
                delay_after=0,
            )
        
        # System message (catch-all for *** lines)
        if line_content.startswith("***") or line_content.startswith("-"):
            if match := PATTERNS["system"].match(line_content):
                content = match.group(1) or line_content
            else:
                content = line_content.lstrip("*- ")

            # Drop bare/near-empty notices ("***", "*** ") and symbol soup —
            # degraded generation emits these as empty '*  (system)' litter.
            if len(content.strip()) < 2 or _is_garbage_system_line(content):
                return None

            return IRCMessage(
                timestamp=timestamp_str,
                nick="",
                content=content,
                type=MessageType.SYSTEM,
                delay_after=0,
            )
        
        # Fallback: treat as system message if nothing else matches — but drop
        # truncation artifacts (bare '<', '<Refle', symbol soup) instead of
        # emitting them as garbage '* ... (system)' lines.
        if line_content and not line_content.startswith("[LOG:"):
            if _is_garbage_system_line(line_content):
                return None
            return IRCMessage(
                timestamp=timestamp_str,
                nick="",
                content=line_content,
                type=MessageType.SYSTEM,
                delay_after=0,
            )

        return None
    
    def _generate_timestamp(self, index: int) -> str:
        """Generate a relative timestamp based on message index."""
        # Assume ~30 seconds between messages on average
        total_seconds = index * 30
        minutes = total_seconds // 60
        seconds = total_seconds % 60
        return f"{minutes:02d}:{seconds:02d}"
    
    def detect_collapse(
        self, 
        messages: list[IRCMessage], 
        intended_type: CollapseType
    ) -> CollapseDetection:
        """
        Detect where and what type of collapse occurs in the messages.
        
        Uses heuristics to find collapse sequences:
        - Multiple quits in succession
        - Kick chains
        - System error messages
        - Corruption patterns
        """
        # Start from the end and work backwards to find collapse start
        collapse_start = len(messages)
        involved_nicks: list[str] = []
        detected_type: Optional[CollapseType] = None
        confidence = 0.0
        
        # Look for collapse indicators in last third of messages
        search_start = max(0, len(messages) * 2 // 3)
        
        consecutive_quits = 0
        consecutive_kicks = 0
        
        for i in range(search_start, len(messages)):
            msg = messages[i]
            
            # Track consecutive quits (netsplit indicator)
            if msg.type == MessageType.QUIT:
                consecutive_quits += 1
                involved_nicks.append(msg.nick)
                
                # Check quit reason for collapse type hints
                if msg.content:
                    for collapse_type, patterns in COLLAPSE_PATTERNS.items():
                        for pattern in patterns:
                            if pattern.search(msg.content):
                                detected_type = collapse_type
                                confidence = 0.9
                                break
                
                if consecutive_quits >= 2 and collapse_start > i - consecutive_quits + 1:
                    collapse_start = i - consecutive_quits + 1
                    if not detected_type:
                        detected_type = CollapseType.NETSPLIT
                        confidence = 0.7
            else:
                consecutive_quits = 0
            
            # Track consecutive kicks (mass_kick indicator)
            if msg.type == MessageType.KICK:
                consecutive_kicks += 1
                if msg.meta and msg.meta.target:
                    involved_nicks.append(msg.meta.target)
                
                if consecutive_kicks >= 2 and collapse_start > i - consecutive_kicks + 1:
                    collapse_start = i - consecutive_kicks + 1
                    detected_type = CollapseType.MASS_KICK
                    confidence = 0.8
            else:
                consecutive_kicks = 0
            
            # Check system messages for corruption / takeover / erasure signatures
            # (these collapses manifest as *** notices, not quit/kick lines).
            if msg.type == MessageType.SYSTEM:
                matched = False
                for sys_type in SYSTEM_COLLAPSE_TYPES:
                    for pattern in COLLAPSE_PATTERNS[sys_type]:
                        if pattern.search(msg.content):
                            if collapse_start > i:
                                collapse_start = i
                            detected_type = sys_type
                            confidence = 0.85
                            matched = True
                            break
                    if matched:
                        break
        
        # If no collapse detected but intended, mark it at the end
        if not detected_type:
            detected_type = intended_type
            collapse_start = max(0, len(messages) - 3)
            confidence = 0.5
        
        return CollapseDetection(
            detected=confidence > 0.5,
            collapse_type=detected_type,
            start_index=collapse_start,
            involved_nicks=list(set(involved_nicks)),
            confidence=confidence,
        )
    
    def format_collapse(
        self, 
        messages: list[IRCMessage], 
        collapse: CollapseDetection
    ) -> list[IRCMessage]:
        """
        Format collapse messages to ensure canonical structure.
        
        Adds proper metadata (server names for netsplit, reasons for kicks, etc.)
        """
        if not collapse.detected:
            return messages
        
        formatted = messages.copy()
        
        # Add metadata based on collapse type
        if collapse.collapse_type == CollapseType.NETSPLIT:
            servers = ("irc.aethera.net", "void.aethera.net")
            for i in range(collapse.start_index, len(formatted)):
                msg = formatted[i]
                if msg.type == MessageType.QUIT:
                    formatted[i] = IRCMessage(
                        timestamp=msg.timestamp,
                        nick=msg.nick,
                        content=msg.content or f"{servers[0]} {servers[1]}",
                        type=MessageType.QUIT,
                        delay_after=msg.delay_after,
                        meta={"servers": list(servers)},
                    )
        
        elif collapse.collapse_type == CollapseType.MASS_KICK:
            for i in range(collapse.start_index, len(formatted)):
                msg = formatted[i]
                if msg.type == MessageType.KICK and msg.meta:
                    if not msg.meta.reason:
                        formatted[i] = IRCMessage(
                            timestamp=msg.timestamp,
                            nick=msg.nick,
                            content=msg.content,
                            type=MessageType.KICK,
                            delay_after=msg.delay_after,
                            meta=msg.meta.model_copy(update={"reason": "flood"}),
                        )
        
        return formatted
    
    def _parse_timestamp_seconds(self, timestamp: str) -> Optional[int]:
        """Parse MM:SS timestamp string to total seconds."""
        match = re.match(r"(\d+):(\d+)", timestamp)
        if match:
            return int(match.group(1)) * 60 + int(match.group(2))
        return None
    
    def assign_timing(
        self, 
        messages: list[IRCMessage], 
        pacing: PacingStyle,
        collapse: CollapseDetection,
    ) -> list[IRCMessage]:
        """
        Assign delay_after to each message based on timestamps or pacing config.
        
        Strategy:
        1. If messages have parseable timestamps, use differences between them
        2. Scale timestamp-derived delays by pacing style
        3. Apply minimums/maximums for good UX
        4. Fall back to synthetic timing for messages without timestamps
        """
        config = PACING_CONFIGS[pacing]
        timed = []
        cumulative_ms = 0  # running playback time, for monotonic display stamps

        # Pacing multipliers for timestamp-derived delays
        pacing_scale = {
            PacingStyle.SLOW: 1.5,
            PacingStyle.NORMAL: 1.0,
            PacingStyle.FRANTIC: 0.6,
        }
        scale = pacing_scale.get(pacing, 1.0)
        
        for i, msg in enumerate(messages):
            delay: int
            
            # Try to calculate delay from timestamp difference
            if i < len(messages) - 1:
                current_secs = self._parse_timestamp_seconds(msg.timestamp)
                next_secs = self._parse_timestamp_seconds(messages[i + 1].timestamp)
                
                if current_secs is not None and next_secs is not None:
                    # Calculate delay in milliseconds from timestamp difference
                    time_diff = next_secs - current_secs
                    delay = int(time_diff * 1000 * scale)
                    
                    # Clamp to reasonable bounds
                    delay = max(500, min(delay, 15000))  # 0.5s to 15s
                else:
                    # Fall back to synthetic timing
                    delay = self._calculate_synthetic_delay(msg, config)
            else:
                # Last message: pause before next fragment
                delay = config["collapse_pause"]
            
            # Apply modifiers for special message types
            if msg.type == MessageType.ACTION:
                delay = int(delay * config["action_multiplier"])
            
            # Collapse zone: rapid succession
            if collapse.detected and i >= collapse.start_index:
                if i == len(messages) - 1:
                    # Last message: long pause before next fragment
                    delay = config["collapse_pause"]
                else:
                    # Collapse messages come fast
                    delay = max(200, delay // 3)
            
            # System messages are quick
            if msg.type == MessageType.SYSTEM:
                delay = max(300, delay // 2)

            # Display timestamp derived from cumulative playback time, so the
            # clock is always monotonic even when the model emits out-of-order
            # timestamps (and it matches the actual playback pacing).
            total_s = cumulative_ms // 1000
            disp_ts = f"{total_s // 60:02d}:{total_s % 60:02d}"

            timed.append(IRCMessage(
                timestamp=disp_ts,
                nick=msg.nick,
                content=msg.content,
                type=msg.type,
                delay_after=delay,
                meta=msg.meta,
            ))
            cumulative_ms += delay

        return timed
    
    def _calculate_synthetic_delay(self, msg: IRCMessage, config: dict) -> int:
        """Calculate delay using heuristics when no timestamp available."""
        base = config["base_delay"]
        char_component = len(msg.content) * config["char_delay"]
        jitter = random.randint(0, config["jitter"])
        return base + char_component + jitter
    
    def validate_fragment(self, fragment: IRCFragment) -> bool:
        """
        Validate that a fragment meets quality requirements.
        
        Returns:
            True if fragment is valid
        """
        # Must have minimum messages
        if len(fragment.messages) < 10:
            logger.warning(f"Validation: too few messages ({len(fragment.messages)} < 10)")
            return False

        # Must have nick diversity
        nicks = set(m.nick for m in fragment.messages if m.nick and m.type == MessageType.MESSAGE)
        if len(nicks) < 2:
            logger.warning(f"Validation: too few distinct speakers ({len(nicks)} < 2)")
            return False

        # Must have collapse start within valid range
        if fragment.collapse_start_index < 0 or fragment.collapse_start_index >= len(fragment.messages):
            logger.warning(
                f"Validation: collapse_start_index {fragment.collapse_start_index} "
                f"out of range (0..{len(fragment.messages) - 1})"
            )
            return False

        # All messages must have timing
        bad = [i for i, m in enumerate(fragment.messages[:-1]) if m.delay_after <= 0]
        if bad:
            logger.warning(
                f"Validation: {len(bad)} message(s) with non-positive delay "
                f"(first at index {bad[0]}, type={fragment.messages[bad[0]].type})"
            )
            return False

        return True

