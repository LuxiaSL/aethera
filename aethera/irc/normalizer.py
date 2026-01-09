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
    # Action: [timestamp] * nick does something
    "action": re.compile(
        r"^(?:\[\d+:\d+\]\s*)?\*\s*(\S+)\s+(.+)$"
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
}


@dataclass
class CollapseDetection:
    """Result of collapse detection analysis."""
    detected: bool
    collapse_type: CollapseType
    start_index: int
    involved_nicks: list[str]
    confidence: float  # 0.0 to 1.0


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
        
        # Build and return fragment
        return IRCFragment(
            id=generate_fragment_id(),
            messages=messages,
            style=raw.style,
            collapse_type=collapse.collapse_type if collapse.detected else raw.intended_collapse,
            pacing=raw.pacing,
            collapse_start_index=collapse.start_index if collapse.detected else len(messages) - 3,
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
        
        return messages
    
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
            action = match.group(2)
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
            content = match.group(2)
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
            
            return IRCMessage(
                timestamp=timestamp_str,
                nick="",
                content=content,
                type=MessageType.SYSTEM,
                delay_after=0,
            )
        
        # Fallback: treat as system message if nothing else matches
        if line_content and not line_content.startswith("[LOG:"):
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
                if msg.meta and msg.meta.get("target"):
                    involved_nicks.append(msg.meta["target"])
                
                if consecutive_kicks >= 2 and collapse_start > i - consecutive_kicks + 1:
                    collapse_start = i - consecutive_kicks + 1
                    detected_type = CollapseType.MASS_KICK
                    confidence = 0.8
            else:
                consecutive_kicks = 0
            
            # Check for corruption in system messages
            if msg.type == MessageType.SYSTEM:
                for pattern in COLLAPSE_PATTERNS[CollapseType.CORRUPTION]:
                    if pattern.search(msg.content):
                        if collapse_start > i:
                            collapse_start = i
                        detected_type = CollapseType.CORRUPTION
                        confidence = 0.85
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
                    if not msg.meta.get("reason"):
                        formatted[i] = IRCMessage(
                            timestamp=msg.timestamp,
                            nick=msg.nick,
                            content=msg.content,
                            type=MessageType.KICK,
                            delay_after=msg.delay_after,
                            meta={**msg.meta, "reason": "flood"},
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
            
            timed.append(IRCMessage(
                timestamp=msg.timestamp,
                nick=msg.nick,
                content=msg.content,
                type=msg.type,
                delay_after=delay,
                meta=msg.meta,
            ))
        
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
            return False
        
        # Must have nick diversity
        nicks = set(m.nick for m in fragment.messages if m.nick and m.type == MessageType.MESSAGE)
        if len(nicks) < 2:
            return False
        
        # Must have collapse start within valid range
        if fragment.collapse_start_index < 0 or fragment.collapse_start_index >= len(fragment.messages):
            return False
        
        # All messages must have timing
        if any(m.delay_after <= 0 for m in fragment.messages[:-1]):
            return False
        
        return True

