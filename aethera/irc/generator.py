"""
IRC Generator

Progressive chunked generation with batch autoloom quality gating.
Generates IRC chat fragments by building up conversation incrementally,
with quality judgment selecting the best from multiple candidates.

Features:
- Cache-friendly prompt splitting (stable_prefix for cross-chunk reuse)
- Prefill-based continuation for format consistency
- Progress-aware pacing with percentage-based collapse acceptance
- Collapse detection on candidates
- Line normalization for token cutoff handling
"""

import asyncio
import random
import logging
import re
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from .models import IRCFragment, CollapseType, PacingStyle
from .normalizer import (
    IRCNormalizer,
    RawFragment,
    NormalizationError,
    normalize_lines,
    dedup_adjacent_lines,
    is_degenerate_chunk,
)
from .autoloom import Autoloom, ChunkCandidate, detect_collapse_in_text
from .providers.base import InferenceProvider
from .prompts.templates import (
    build_scaffold_prompt,
    build_system_prompt,
    build_chat_messages,
    build_header,
    load_examples_for_style,
    load_random_examples,
    get_style_topics,
    get_style_pacing,
    roll_axes,
    COLLAPSE_NAMES,
)

logger = logging.getLogger(__name__)


# Style definitions
STYLES = {
    "technical": {
        "topics": ["programming", "debugging", "linux", "networking", "security", "hardware"],
        "description": "Technical discussion, code talk, system administration",
    },
    "anomaly": {
        "topics": ["missing_time", "wrong_logs", "phantom_user", "recursion", "deja_vu", "self_part"],
        "description": "Users reporting increasingly wrong things until the channel itself goes wrong",
    },
    "incident": {
        "topics": ["prod_outage", "data_breach", "runaway_proc", "cascading_fail", "oom_spiral", "ddos_inbound"],
        "description": "On-call crew scrambling as something actively breaks, escalating to breakdown",
    },
    "support": {
        "topics": ["cant_login", "printer_haunted", "layer8_error", "pebkac", "worked_yesterday", "reboot_didnt_help"],
        "description": "Helpdesk channel, concrete problems turning absurd, exasperation to breakdown",
    },
    "chaotic": {
        "topics": ["random", "absurdist", "chaos", "memes", "shitposting", "late night"],
        "description": "Unhinged energy, non-sequiturs, classic IRC chaos",
    },
}


@dataclass
class GenerationConfig:
    """Configuration for fragment generation."""
    # Message thresholds
    min_messages_before_collapse: int = 20
    max_messages_before_collapse: int = 35
    max_total_messages: int = 140  # hard cap; raised for long two-act fragments so
                                   # the loop doesn't cap before Act 2 (counts are
                                   # honest/deduped now, so 140 is a true ceiling)

    # Two-act length mix. Per fragment we flip a coin: a LONG two-act arc (a normal
    # phase that plants a thread, a turn, then a collapse it earned) or a SHORT
    # single-arc snippet. Variety keeps the broadcast from being monotonously long.
    # Both get the same act-aware pacing (scaled by %); only the target differs.
    two_act_probability: float = 0.5
    long_target_range: tuple = (75, 100)
    short_target_range: tuple = (25, 40)
    # Styles that are ALWAYS short single-arc (no two-act coinflip). chaotic is
    # the laggard and meanders when stretched to two acts — it works best short.
    short_only_styles: tuple = ("chaotic",)
    
    # Collapse acceptance threshold (percentage of target)
    # Accept collapse only once we're at least this far through the target — too
    # low and fragments end at ~half their target length.
    min_collapse_percentage: float = 0.8  # 80% of target
    
    # Batch generation settings
    candidates_per_batch: int = 10  # Generate 10 candidates per round
    tokens_per_candidate: int = 100  # ~5-7 lines worth
    candidate_temperature: float = 0.7  # Sampling temp for candidates; >0.85
                                        # base models degenerate (runaway nicks,
                                        # keyboard-mash) even with rep penalties
    candidate_top_p: float = 1.0        # nucleus cutoff (1.0 = off). Some models
                                        # (e.g. K3) need top_p<1 + min_p to stay
                                        # coherent at temp >1.0; min_p is set on
                                        # the provider (extra_body)
    examples_per_prompt: int = 1  # ONE bash.org example as a format anchor only
                                  # (the base model knows IRC from pretraining; 4
                                  # over-anchored to short repetitive snippets)
    use_combinatorial_axes: bool = True  # roll tone/era/bots/clock per fragment
                                         # (probe-validated steering axes); False
                                         # = baseline header (style+collapse only)
    
    # Retry settings
    max_restart_attempts: int = 10
    max_chunk_failures: int = 5  # Max failures in a row before restart
    max_early_collapse_strips: int = 3  # Max times to strip early collapse

    # Forced-collapse safeguards. The natural exit is the judge SELECTING a
    # collapse candidate past min_collapse_percentage. But a judge can decline to
    # ever collapse (esp. the stateful judge, which over-anchors on its arc), and
    # late-game repetition gets deduped so the message count stalls below
    # max_total_messages — together that spins the loop forever. These force a
    # clean, deterministic collapse (a cascade built from the transcript's own
    # nicks) instead of spinning, and keep fragments from wandering past target.
    # Early end: let the JUDGE call END to wrap up on a narrative peak (rather
    # than padding to target). Honored once the log is at least this fraction of
    # target so it can't bail into a stub; then the forced collapse is issued.
    allow_early_end: bool = True
    early_end_min_percentage: float = 0.65  # raised from 0.5: the judge can't END
                                            # during Act 1 of a two-act fragment

    max_rounds: int = 45            # absolute backstop on generation rounds (raised
                                    # from 24 for longer fragments — must not fire
                                    # mid-Act-1; the forced cascade is the backstop)
    max_stall_rounds: int = 3       # force if message count doesn't grow for N rounds
    stall_min_percentage: float = 0.6  # min fraction of target before a stall may
                                       # force-collapse (lets long unsustainable
                                       # targets end gracefully instead of grinding)
    collapse_grace_rounds: int = 1  # once AT/over target, allow this many more
                                    # rounds for a natural collapse before forcing.
                                    # Kept tight: base models degrade past their
                                    # stated length (repetition, empty lines), so
                                    # letting the judge wander past target tanks
                                    # quality. The judge can still end EARLIER via
                                    # the natural has_collapse path at >=80%.
    
    # Channel
    channel: str = "#aethera"
    
    # Generation mode
    use_instruct_mode: bool = True  # Use system prompt for instruct models


@dataclass
class GenerationState:
    """State during progressive generation."""
    # Accumulated transcript (list of lines for proper normalization)
    transcript_lines: list = field(default_factory=list)
    message_count: int = 0
    chunk_failures: int = 0
    restart_count: int = 0
    collapse_triggered: bool = False
    early_collapse_strips: int = 0  # How many times we've stripped early collapse
    
    # Fragment parameters
    style: str = ""
    collapse_type: CollapseType = CollapseType.NETSPLIT
    pacing: PacingStyle = PacingStyle.NORMAL
    target_messages: int = 25  # What we tell the LLM in the prompt header
    target_users: int = 4
    
    # Cache-friendly prompt components (set once at start)
    stable_prefix: str = ""  # Examples portion (cacheable)
    target_intro: str = ""   # Target header (variable)
    prefill: str = ""        # Initial prefill "[00:00] <"
    
    @property
    def accumulated_content(self) -> str:
        """Get accumulated content as string."""
        return "\n".join(self.transcript_lines)


class IRCGenerator:
    """
    Generates IRC fragments using progressive batch generation.
    
    Algorithm:
    1. Generate N candidate chunks in parallel (10-12 candidates)
    2. Judge ALL candidates in one batch call
    3. The highest-scoring candidate advances
    4. Use winning chunk as prefill for next round
    5. Repeat until minimum length reached
    6. Inject collapse and finish
    """
    
    def __init__(
        self,
        generation_provider: InferenceProvider,
        autoloom: Autoloom,
        normalizer: IRCNormalizer,
        config: Optional[GenerationConfig] = None,
        examples_dir: Optional[Path] = None,
    ):
        """
        Initialize generator.
        
        Args:
            generation_provider: LLM for generation
            autoloom: Quality judge (batch evaluates candidates)
            normalizer: For final fragment normalization
            config: Generation parameters
            examples_dir: Path to few-shot examples
        """
        self.provider = generation_provider
        self.autoloom = autoloom
        self.normalizer = normalizer
        self.config = config or GenerationConfig()
        self.examples_dir = examples_dir
    
    async def generate_fragment(
        self,
        style: Optional[str] = None,
        collapse_type: Optional[CollapseType] = None,
        pacing: Optional[PacingStyle] = None,
        target_messages: Optional[int] = None,
    ) -> Optional[IRCFragment]:
        """
        Generate a complete IRC fragment.
        
        Args:
            style: Style to generate (random if None)
            collapse_type: How the fragment ends (random if None)
            pacing: Timing style (random if None, or inferred from style)
            target_messages: Target message count (random 25-40 if None)
            
        Returns:
            Normalized IRCFragment or None if generation fails
        """
        # Set defaults
        style = style or random.choice(list(STYLES.keys()))
        collapse_type = collapse_type or random.choice(list(CollapseType))
        pacing = pacing or get_style_pacing(style)
        # Coinflip the length: a LONG two-act arc or a SHORT single-arc snippet
        # (unless the caller pinned an explicit target). Same act-aware pacing
        # applies to both — only the runway differs. short_only styles (chaotic)
        # skip the coinflip and stay short.
        if target_messages is None:
            long_allowed = style not in self.config.short_only_styles
            if long_allowed and random.random() < self.config.two_act_probability:
                lo, hi = self.config.long_target_range
            else:
                lo, hi = self.config.short_target_range
            target_messages = random.randint(lo, hi)
        target_users = random.randint(3, 6)

        # Roll the combinatorial axis subset for this fragment (tone/era/bots/clock)
        # — the lightweight grammar. Disabled via config for A/B baselines.
        axes = roll_axes(style) if self.config.use_combinatorial_axes else {}
        if axes:
            logger.info(
                "Axes: %s",
                ", ".join(f"{k}={v}" for k, v in axes.items() if k != "start_time")
                + f", clock={axes.get('start_time')}",
            )

        # Load examples and build cache-friendly prompt split
        examples = load_random_examples(count=self.config.examples_per_prompt)

        stable_prefix, target_intro, prefill = build_scaffold_prompt(
            examples=examples,
            target_style=style,
            target_collapse=collapse_type,
            target_users=target_users,
            target_messages=target_messages,
            channel=self.config.channel,
            split_for_caching=True,
            **axes,
        )
        
        state = GenerationState(
            style=style,
            collapse_type=collapse_type,
            pacing=pacing,
            target_messages=target_messages,
            target_users=target_users,
            stable_prefix=stable_prefix,
            target_intro=target_intro,
            prefill=prefill,
        )
        
        logger.info(
            f"Starting generation: style={style}, collapse={collapse_type.value}, "
            f"pacing={pacing.value}, target={target_messages} messages"
        )

        # Fresh judge conversation per fragment (no-op in stateless mode).
        self.autoloom.reset()

        while state.restart_count < self.config.max_restart_attempts:
            try:
                content = await self._generate_progressive(state)
                if content:
                    # Normalize the fragment
                    raw = RawFragment(
                        content=content,
                        style=style,
                        intended_collapse=collapse_type,
                        pacing=pacing,
                    )
                    fragment = self.normalizer.normalize(raw)
                    
                    # Validate
                    if self.normalizer.validate_fragment(fragment):
                        logger.info(
                            f"Generated fragment {fragment.id} with "
                            f"{len(fragment.messages)} messages"
                        )
                        return fragment
                    else:
                        logger.warning("Fragment failed validation, restarting")
                        state.restart_count += 1
                        self._reset_state(state)
                else:
                    state.restart_count += 1
                    self._reset_state(state)
                    
            except NormalizationError as e:
                logger.warning(f"Normalization failed: {e}, restarting")
                state.restart_count += 1
                self._reset_state(state)
        
        logger.error(f"Generation failed after {self.config.max_restart_attempts} attempts")
        return None
    
    def _reset_state(self, state: GenerationState) -> None:
        """Reset state for a new attempt (a restart is a fresh story)."""
        state.transcript_lines = []
        state.message_count = 0
        state.chunk_failures = 0
        state.collapse_triggered = False
        state.early_collapse_strips = 0
        # A restart re-tells the story from scratch, so the judge conversation
        # must start over too (else the prior failed arc bleeds in).
        self.autoloom.reset()
    
    async def _generate_progressive(self, state: GenerationState) -> Optional[str]:
        """
        Progressive batch generation loop.
        
        Each round:
        1. Generate N candidates in parallel (with prefill for format consistency)
        2. Judge all candidates with progress-aware pacing
        3. Winner becomes the new context (with line normalization)
        4. Check for collapse with percentage-based acceptance
        5. Repeat until done
        """
        round_num = 0
        prev_count = 0       # message_count at the end of the previous round
        stall_rounds = 0     # consecutive rounds where message_count didn't grow
        rounds_past_target = 0  # rounds spent at/over target without collapsing

        while state.message_count < self.config.max_total_messages:
            round_num += 1

            # Safety backstops: if the loop can't reach a NATURAL collapse (judge
            # won't pick one, or the count stalled on deduped repetition), force a
            # clean collapse instead of spinning. Only meaningful once we have a
            # transcript to collapse.
            if state.transcript_lines:
                # Stall-forcing is gated on having enough length so a transient
                # dedup stall early in the story can't end it short. Gate at 60%
                # (not 80%): a long two-act target the model can't sustain stalls
                # WELL below 80% (e.g. 54/85=63%) and would otherwise grind to the
                # round cap; ending a genuine 3-round stall at 60%+ is graceful.
                near_target = state.message_count >= int(
                    state.target_messages * self.config.stall_min_percentage
                )
                # Round cap scales with target so a long non-stalling fragment has
                # room to actually reach it (the flat 45 capped long ones short).
                round_cap = max(self.config.max_rounds, int(state.target_messages * 0.7))
                force_reason = None
                if rounds_past_target >= self.config.collapse_grace_rounds:
                    force_reason = (
                        f"{rounds_past_target} round(s) past target, no natural collapse"
                    )
                elif stall_rounds >= self.config.max_stall_rounds and near_target:
                    force_reason = f"message count stalled {stall_rounds} rounds at {state.message_count}/{state.target_messages}"
                elif round_num > round_cap:
                    force_reason = f"round cap {round_cap} reached"
                if force_reason:
                    logger.warning(
                        f"Round {round_num}: forcing collapse ({force_reason}) at "
                        f"{state.message_count}/{state.target_messages} messages"
                    )
                    return self._finalize_with_forced_collapse(state)

            logger.debug(
                f"Round {round_num}: {state.message_count}/{state.target_messages} messages"
            )

            # Generate batch of candidates in parallel
            candidates = await self._generate_batch_candidates(state)
            
            if not candidates:
                logger.warning(f"Round {round_num}: No candidates generated")
                state.chunk_failures += 1
                if state.chunk_failures >= self.config.max_chunk_failures:
                    return None
                continue
            
            logger.debug(f"Round {round_num}: Generated {len(candidates)} candidates")
            
            # Judge ALL candidates with progress info for pacing guidance
            judge_start = time.monotonic()
            judgment = await self.autoloom.select_best(
                context=state.accumulated_content,
                candidates=candidates,
                current_messages=state.message_count,
                target_messages=state.target_messages,
            )
            logger.info(f"Judge: {len(candidates)} candidates in {time.monotonic() - judge_start:.1f}s")

            # Early end: the judge may call END to collapse on a narrative peak
            # rather than padding to target. Honor it once the log can stand on
            # its own; otherwise fall through and keep building.
            if judgment.end_requested and self.config.allow_early_end:
                early_floor = max(12, int(state.target_messages * self.config.early_end_min_percentage))
                if state.message_count >= early_floor:
                    logger.info(
                        f"Round {round_num}: judge called END at "
                        f"{state.message_count}/{state.target_messages} — issuing collapse"
                    )
                    return self._finalize_with_forced_collapse(state)
                logger.debug(
                    f"Round {round_num}: judge requested END but only "
                    f"{state.message_count}/{state.target_messages} (< floor {early_floor}); continuing"
                )

            if judgment.selected_index is not None:
                # Accept the winning chunk
                selected = candidates[judgment.selected_index]
                
                # Parse new lines from winner
                new_lines = selected.content.strip().split("\n")
                
                # For first chunk, prepend the prefill to maintain format
                if not state.transcript_lines and state.prefill:
                    if new_lines and not new_lines[0].startswith("["):
                        new_lines[0] = state.prefill + new_lines[0]
                
                # Check for early collapse BEFORE merging into transcript
                # This way we only strip from new_lines, preserving earlier content
                if selected.has_collapse:
                    min_acceptable = int(state.target_messages * self.config.min_collapse_percentage)
                    current_count = self._count_irc_messages(state.transcript_lines)
                    new_count = self._count_irc_messages(new_lines)
                    total_count = current_count + new_count
                    
                    drops = self._count_member_drops("\n".join(new_lines))
                    if total_count >= min_acceptable and drops >= 2:
                        # Accept — far enough through target AND a real exodus (the
                        # room actually empties), not a lone quiet exit / error line.
                        combined = state.transcript_lines + new_lines
                        state.transcript_lines = dedup_adjacent_lines(normalize_lines(combined))
                        state.message_count = self._count_irc_messages(state.transcript_lines)

                        logger.info(
                            f"Round {round_num}: Selected candidate {judgment.selected_index + 1} "
                            f"(score={judgment.scores[judgment.selected_index]:.2f}), "
                            f"messages: {state.message_count}/{state.target_messages} [COLLAPSE x{drops}]"
                        )
                        logger.info(
                            f"Fragment complete at {state.message_count}/{state.target_messages} "
                            f"messages with collapse"
                        )
                        return state.accumulated_content
                    elif total_count >= min_acceptable:
                        # Far enough, but the collapse is WEAK (no member exodus —
                        # e.g. a single quiet exit or a lone error line). Strip it
                        # and issue a real forced cascade so the room visibly empties.
                        logger.info(
                            f"Round {round_num}: weak natural collapse ({drops} member drop(s)) "
                            f"at {total_count}/{state.target_messages} — stripping, forcing a real cascade"
                        )
                        new_lines = self._strip_collapse_markers(new_lines)
                        combined = state.transcript_lines + new_lines
                        state.transcript_lines = dedup_adjacent_lines(normalize_lines(combined))
                        state.message_count = self._count_irc_messages(state.transcript_lines)
                        return self._finalize_with_forced_collapse(state)
                    else:
                        # Too early - strip collapse markers ONLY from new lines
                        state.early_collapse_strips += 1
                        logger.warning(
                            f"Collapse too early! {total_count}/{state.target_messages} "
                            f"(need {min_acceptable}+). Strip #{state.early_collapse_strips}"
                        )
                        
                        # Strip collapse markers only from the new chunk, not the entire transcript
                        new_lines = self._strip_collapse_markers(new_lines)
                        
                        # If we've stripped too many times, just accept what we have
                        if state.early_collapse_strips >= self.config.max_early_collapse_strips:
                            logger.warning("Too many strip attempts. Accepting current fragment.")
                            # Still merge the (now-stripped) new lines before returning
                            combined = state.transcript_lines + new_lines
                            state.transcript_lines = dedup_adjacent_lines(normalize_lines(combined))
                            return state.accumulated_content
                
                # Combine with existing transcript and normalize
                # This fixes any line wrapping issues from token cutoffs
                combined = state.transcript_lines + new_lines
                state.transcript_lines = dedup_adjacent_lines(normalize_lines(combined))
                
                # Count IRC messages (lines with <username> format)
                state.message_count = self._count_irc_messages(state.transcript_lines)
                state.chunk_failures = 0
                
                logger.info(
                    f"Round {round_num}: Selected candidate {judgment.selected_index + 1} "
                    f"(score={judgment.scores[judgment.selected_index]:.2f}), "
                    f"messages: {state.message_count}/{state.target_messages}"
                    f"{' [COLLAPSE]' if selected.has_collapse else ''}"
                )

                # Update the safety-backstop trackers (checked at the top of the
                # next round). A round that adds no new messages counts as a
                # stall; rounds at/over target accrue toward the collapse grace.
                if state.message_count <= prev_count:
                    stall_rounds += 1
                else:
                    stall_rounds = 0
                prev_count = state.message_count
                if state.message_count >= state.target_messages:
                    rounds_past_target += 1
            else:
                # All rejected
                state.chunk_failures += 1
                logger.warning(
                    f"Round {round_num}: All candidates rejected "
                    f"(failure {state.chunk_failures}/{self.config.max_chunk_failures})"
                )
                
                if state.chunk_failures >= self.config.max_chunk_failures:
                    logger.warning("Too many consecutive failures, restarting")
                    return None
        
        # Hit max messages, return what we have
        if state.transcript_lines:
            return state.accumulated_content
        
        return None
    
    def _count_irc_messages(self, lines: list[str]) -> int:
        """Count actual IRC messages (lines with <username> format)."""
        return len([l for l in lines if l.strip() and "<" in l and not l.startswith("***")])

    # Lines that signal a member actually LEAVING (the room emptying), used to
    # tell a strong collapse (real exodus) from a weak one (a lone quiet exit or
    # a single error line that leaves everyone still sitting there).
    _DROP_MARKERS = (
        "has quit", "was kicked", "g-lined", "k-lined", "has left",
        "connection reset", "killed", "banned from",
        "has been removed", "was never here",  # erasure
    )

    def _count_member_drops(self, text: str) -> int:
        """Number of lines in `text` that drop a member (quit/kick/gline/etc.)."""
        count = 0
        for line in text.split("\n"):
            low = line.lower()
            if any(marker in low for marker in self._DROP_MARKERS):
                count += 1
        return count
    
    def _strip_collapse_markers(self, lines: list[str]) -> list[str]:
        """Remove collapse-related lines from transcript."""
        collapse_markers = [
            "*** Netsplit", "*** GLINE", "was kicked", "has quit",
            "Ping timeout", "SendQ exceeded", "ERROR:", "Connection reset",
            "*** Only", "users remain", "got disconnected", "everyone left",
            "G-lined", "K-lined", "banned from", "Excess Flood",
        ]
        
        return [
            l for l in lines
            if not any(marker.lower() in l.lower() for marker in collapse_markers)
        ]

    def _extract_active_nicks(self, lines: list[str], limit: int = 6) -> list[str]:
        """Distinct speaker nicks from the transcript, in order of appearance.

        Used to build a forced collapse from the conversation's OWN participants
        (never an injected reference — that leaks; see handoff/ff7375a). Skips
        obviously-garbage handles so the cascade reads clean.
        """
        nicks: list[str] = []
        seen: set[str] = set()
        for line in lines:
            m = re.search(r"<([^>]+)>", line)
            if not m:
                continue
            nick = m.group(1).strip()
            if not nick or nick in seen or len(nick) > 32 or " " in nick:
                continue
            seen.add(nick)
            nicks.append(nick)
        return nicks[:limit]

    def _last_timestamp_seconds(self, lines: list[str]) -> Optional[int]:
        """Seconds-from-start of the last timestamped line, for continuity."""
        for line in reversed(lines):
            m = re.match(r"\[(\d+):(\d+)\]", line.strip())
            if m:
                return int(m.group(1)) * 60 + int(m.group(2))
        return None

    def _build_forced_collapse(self, state: GenerationState) -> list[str]:
        """
        Build a deterministic, on-theme collapse cascade for state.collapse_type
        using the transcript's own active nicks. Lines are shaped to match the
        normalizer's collapse-detection patterns so the fragment classifies and
        indexes the collapse correctly.
        """
        nicks = self._extract_active_nicks(state.transcript_lines)
        if len(nicks) < 2:
            # Degenerate transcript — fall back to neutral handles so the cascade
            # still reads as a room emptying.
            nicks = (nicks + ["ghost", "echo_", "void_"])[: max(2, len(nicks) + 2)]

        base = self._last_timestamp_seconds(state.transcript_lines)
        if base is None:
            base = state.message_count * 5  # rough continuation if untimed

        def ts(offset: int) -> str:
            t = base + offset
            return f"[{t // 60:02d}:{t % 60:02d}]"

        ct = state.collapse_type
        lines: list[str] = []

        if ct == CollapseType.MASS_KICK:
            for i, nk in enumerate(nicks):
                lines.append(f"{ts(i + 1)} *** {nk} was kicked by ChanServ (Flood limit exceeded)")
        elif ct == CollapseType.CORRUPTION:
            lines.append(f"{ts(1)} *** ERR_UNKNOWN: conn̸ection ██ reset")
            lines.append(f"{ts(2)} *** ▓▓▓ CHANNEL STATE CORRUPTED ▓▓▓")
            for i, nk in enumerate(nicks):
                lines.append(f"{ts(i + 3)} *** {nk} has quit (Connection reset by peer)")
        elif ct == CollapseType.TAKEOVER:
            # An entity seizes ops, locks the channel, and forces everyone out.
            entity = random.choice(["Erebus", "OperServ", "root", "nobody", "the_operator"])
            lines.append(f"{ts(1)} *** {entity} sets mode +o {entity}")
            lines.append(f"{ts(2)} *** {entity} sets mode +b *!*@*")
            lines.append(f"{ts(3)} *** {entity} sets mode +im")
            for i, nk in enumerate(nicks):
                lines.append(f"{ts(i + 4)} *** {nk} has quit (Channel seized by {entity})")
        elif ct == CollapseType.ERASURE:
            # Members and the channel itself are erased one by one (no quit/kick —
            # they were never here). Detected via the system-line ERASURE patterns.
            for i, nk in enumerate(nicks):
                marker = "has been removed" if i % 2 == 0 else "was never here"
                lines.append(f"{ts(i + 1)} *** {nk} {marker}")
            lines.append(f"{ts(len(nicks) + 1)} *** the channel is forgetting")
            lines.append(f"{ts(len(nicks) + 2)} *** {self.config.channel} no longer exists")
        else:
            # Quit-based collapses (netsplit / gline / ping_timeout / sendq / kill /
            # server_shutdown). Light per-fragment variation so the forced ending
            # isn't identical every time (it's now the common stateful ending).
            tail: list[str] = []
            if ct == CollapseType.NETSPLIT:
                a, b = random.choice([
                    ("irc.aethera.net", "void.aethera.net"),
                    ("hub.aethera.net", "leaf.aethera.net"),
                    ("east.aethera.net", "west.aethera.net"),
                ])
                reason = f"{a} {b}"
            elif ct == CollapseType.GLINE:
                reason = random.choice([
                    "G-lined (Network ban)",
                    "G-lined: Banned from network",
                    "K-lined (Global ban)",
                ])
            elif ct == CollapseType.PING_TIMEOUT:
                reason = f"Ping timeout: {random.choice([240, 245, 252, 268, 276])} seconds"
            elif ct == CollapseType.SENDQ_EXCEEDED:
                reason = random.choice(["SendQ exceeded", "Excess Flood", "Max SendQ exceeded"])
            elif ct == CollapseType.KILL:
                killer = random.choice(["OperServ", "the_operator", "Erebus", "root", "nobody"])
                what = random.choice([
                    "Channel terminated", "you were warned", "Connection terminated",
                    "Local kill", "no reason given",
                ])
                reason = f"Killed ({killer} ({what}))"
            elif ct == CollapseType.SERVER_SHUTDOWN:
                reason = random.choice([
                    "Server Terminating", "Server shutting down",
                    "irc.aethera.net Server Terminating",
                ])
                tail.append(f"{ts(len(nicks) + 1)} *** ERROR :Closing Link: "
                            f"{self.config.channel} (Server shutting down)")
            else:
                reason = "irc.aethera.net void.aethera.net"
            for i, nk in enumerate(nicks):
                lines.append(f"{ts(i + 1)} *** {nk} has quit ({reason})")
            lines.extend(tail)

        return lines

    def _finalize_with_forced_collapse(self, state: GenerationState) -> str:
        """Append a forced collapse cascade and return the finished transcript."""
        collapse_lines = self._build_forced_collapse(state)
        combined = state.transcript_lines + collapse_lines
        state.transcript_lines = dedup_adjacent_lines(normalize_lines(combined))
        state.message_count = self._count_irc_messages(state.transcript_lines)
        state.collapse_triggered = True
        logger.info(
            f"Forced collapse appended ({len(collapse_lines)} lines, "
            f"type={state.collapse_type.value}); finalized at "
            f"{state.message_count}/{state.target_messages} messages"
        )
        return state.accumulated_content

    async def _generate_batch_candidates(
        self, 
        state: GenerationState
    ) -> list[ChunkCandidate]:
        """
        Generate a batch of candidates efficiently.
        
        Uses:
        - stable_prefix for cache-friendly prompt splitting (Anthropic models)
        - Prefill for format consistency (always starts with "[00:00] <")
        - Native `n` parameter if supported, else parallel calls
        """
        target_n = self.config.candidates_per_batch
        # Stop on scaffold/meta artifacts the base model leaks from pretraining
        # (bash.org pages are HTML; archive logs have shell prompts). These halt
        # generation before the leak lands in dialogue. All are safe in IRC: a nick
        # line is "<nick>" so "</", "<br", "<pre", "<h1".. never start one, and the
        # markdown fence / shell-prompt forms don't occur in chat. Defense in depth
        # with the normalizer's HTML stripper (catches anything that slips through).
        stop = [
            "\n---", "$ cat", "[LOG:",
            "</", "<br", "<p>", "<pre", "<div", "<span", "<h1", "<h2", "<h3",
            "<!--", "<html", "<body", "```",
        ]

        # Check if we're using an Anthropic model (supports stable_prefix caching)
        is_anthropic = self._is_anthropic_model()

        # Build system prompt for instruct mode
        system_prompt = None
        if self.config.use_instruct_mode:
            system_prompt = build_system_prompt()

        # Build the prompt + prefill once (identical across rerolls).
        if state.transcript_lines:
            # Continuation: target_intro + accumulated content
            accumulated = "\n".join(state.transcript_lines)
            variable_prompt = state.target_intro + accumulated + "\n"
            prompt = variable_prompt if is_anthropic else state.stable_prefix + variable_prompt
            # Use the last line as prefill for continuation
            prefill_text = state.transcript_lines[-1] if state.transcript_lines else ""
        else:
            # First chunk: use prefill to force format "[00:00] <"
            prompt = state.target_intro if is_anthropic else state.stable_prefix + state.target_intro
            prefill_text = state.prefill  # "[00:00] <"

        # Reroll degenerate candidates so the judge always sees a full batch of
        # CLEAN options. Garbage is heaviest on the first chunk (cold start);
        # later chunks continue an established clean transcript, so the model has
        # a strong bridge to stick to and the reroll rate drops sharply.
        candidates: list[ChunkCandidate] = []
        attempts = 0
        max_attempts = target_n * 3  # cap total generations to bound cost
        gen_start = time.monotonic()

        while len(candidates) < target_n and attempts < max_attempts:
            need = target_n - len(candidates)
            attempts += need
            try:
                batch_result = await self.provider.complete_batch_with_prefill(
                    prompt=prompt,
                    prefill=prefill_text,
                    n=need,
                    max_tokens=self.config.tokens_per_candidate,
                    temperature=self.config.candidate_temperature,
                    top_p=self.config.candidate_top_p,
                    stop=stop,
                    system=system_prompt if is_anthropic else None,
                    stable_prefix=state.stable_prefix if is_anthropic else None,
                )
            except Exception as e:
                logger.warning(f"Batch generation failed: {e}")
                import traceback
                logger.debug(traceback.format_exc())
                break

            if batch_result.cached_tokens > 0:
                logger.debug(f"Batch generation: {batch_result.cached_tokens} tokens cached")

            reasons = batch_result.finish_reasons or [None] * len(batch_result.texts)
            for text, reason in zip(batch_result.texts, reasons):
                chunk = self._extract_chunk(text, state)
                if not chunk or not chunk.strip():
                    continue
                # If the candidate hit the token cap ("length"), its final line is
                # almost certainly truncated mid-text — drop it (unless it's the
                # only line). Lines that ended on a stop sequence are left intact.
                if reason == "length":
                    lines = chunk.split("\n")
                    if len(lines) > 1:
                        chunk = "\n".join(lines[:-1])
                if is_degenerate_chunk(chunk):
                    continue  # reroll: don't waste a judge slot on garbage
                # ChunkCandidate.__post_init__ detects collapse and counts lines
                candidates.append(ChunkCandidate(content=chunk.strip(), index=len(candidates)))
                if len(candidates) >= target_n:
                    break

        gen_elapsed = time.monotonic() - gen_start
        rerolled = attempts - len(candidates)
        logger.info(
            f"Candidates: {len(candidates)}/{target_n} clean in {gen_elapsed:.1f}s "
            f"({attempts} generated, {rerolled} rerolled as garbage)"
        )
        return candidates
    
    def _is_anthropic_model(self) -> bool:
        """Check if the generation provider is an Anthropic model."""
        provider_name = self.provider.name.lower()
        return "anthropic" in provider_name or "claude" in provider_name
    
    def _extract_chunk(self, generated: str, state: GenerationState) -> str:
        """
        Extract valid IRC lines from generation.
        
        Filters out shell commands and other noise.
        """
        lines = generated.strip().split("\n")
        valid_lines = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            # Skip shell commands and headers
            if line.startswith("$") or line.startswith("[LOG:"):
                continue
            # Skip if it looks like metadata
            if line.startswith("---") or line.startswith("==="):
                continue
            # Accept IRC-formatted lines
            if any([
                line.startswith("["),  # Timestamped line
                line.startswith("<"),  # <nick> message
                line.startswith("*"),  # Action or system
            ]):
                valid_lines.append(line)
        
        return "\n".join(valid_lines)
    
    def _is_collapse_complete(self, chunk: str, state: GenerationState) -> bool:
        """
        Check if the collapse sequence appears complete.
        """
        chunk_lower = chunk.lower()
        
        # Count collapse indicators
        quit_count = chunk_lower.count("has quit")
        kick_count = chunk_lower.count("was kicked")
        error_count = chunk_lower.count("err_") + chunk_lower.count("connection")
        
        # Collapse type specific checks
        if state.collapse_type == CollapseType.NETSPLIT:
            return quit_count >= 2
        elif state.collapse_type == CollapseType.MASS_KICK:
            return kick_count >= 2
        elif state.collapse_type == CollapseType.CORRUPTION:
            return error_count >= 1 or "█" in chunk or "�" in chunk
        elif state.collapse_type in (CollapseType.PING_TIMEOUT, CollapseType.SENDQ_EXCEEDED):
            return quit_count >= 1
        elif state.collapse_type == CollapseType.GLINE:
            return "banned" in chunk_lower or "g-line" in chunk_lower
        
        # Default: any quit/kick is considered collapse completion
        return quit_count >= 1 or kick_count >= 1


async def generate_batch(
    generator: IRCGenerator,
    storage,  # FragmentStorage
    target_count: int,
    max_attempts: int = 50,
    min_quality: float = 0.0,
    style: Optional[str] = None,
    dedup_index=None,          # dedup.NearDupIndex prebuilt from the pool, or None
    max_similarity: float = 1.0,  # reject a fragment this lexically close to the pool
    semantic_index=None,       # semantic_dedup.SemanticIndex prebuilt from the pool
    embedder=None,             # semantic_dedup.Embedder (live embedding), or None
    max_semantic_similarity: float = 1.0,  # reject a fragment this thematically close
) -> list[IRCFragment]:
    """
    Generate fragments until target_count are BANKED (or attempts run out).

    Args:
        generator: IRCGenerator instance
        storage: FragmentStorage for saving
        target_count: Number of fragments to bank
        max_attempts: Maximum generation attempts
        min_quality: Quality floor — fragments scoring below this are discarded
            (NOT banked) and generation continues, so the pool stays curated.
            0.0 banks everything (the original behavior).

    Returns:
        List of successfully banked fragments
    """
    gating = dedup_index is not None and max_similarity < 1.0
    if gating:
        from .dedup import tokens_from_fragment  # local import: optional dependency path

    sem_gating = (semantic_index is not None and embedder is not None
                  and max_semantic_similarity < 1.0)
    if sem_gating:
        from .dedup import text_from_fragment

    generated = []
    attempts = 0
    discarded = 0
    near_dups = 0
    sem_dups = 0
    total_msgs = 0  # messages across banked fragments (for the $/msg trail)

    while len(generated) < target_count and attempts < max_attempts:
        attempts += 1

        # Randomize parameters (style fixed if requested)
        chosen_style = style or random.choice(list(STYLES.keys()))
        collapse_type = random.choice(list(CollapseType))

        fragment = await generator.generate_fragment(
            style=chosen_style,
            collapse_type=collapse_type,
        )

        if not fragment:
            continue

        # Lexical novelty gate FIRST (free, local) — reject a verbatim near-dup
        # before spending an embed call or a judge call scoring it.
        toks = None
        if gating:
            toks = tokens_from_fragment(fragment)
            sim, near = dedup_index.max_similarity(toks)
            if sim >= max_similarity:
                near_dups += 1
                logger.info(
                    f"Discarded near-duplicate (sim={sim:.2f} ~ "
                    f"{(near or '?')[:8]}); not banked [{near_dups} near-dups]"
                )
                continue

        # Semantic novelty gate SECOND (one embed call) — reject a THEMATIC dup
        # (same premise, different words) the lexical gate can't see. Still before
        # the judge. A transient embed failure must not kill banking — skip it.
        vec = None
        if sem_gating:
            try:
                vec = embedder.embed([text_from_fragment(fragment)])[0]
                ssim, snear = semantic_index.max_similarity(vec)
                if ssim >= max_semantic_similarity:
                    sem_dups += 1
                    logger.info(
                        f"Discarded thematic near-duplicate (cosine={ssim:.2f} ~ "
                        f"{(snear or '?')[:8]}); not banked [{sem_dups} thematic dups]"
                    )
                    continue
            except Exception as e:
                logger.warning(f"Semantic gate skipped for this fragment (embed error: {e})")
                vec = None

        # Score with autoloom (stateless whole-fragment eval), judged against
        # the fragment's own intended tone.
        score, reasoning = await generator.autoloom.evaluate_fragment(
            "\n".join(m.content for m in fragment.messages if m.content),
            style=fragment.style,
        )
        fragment.quality_score = score

        # Quality floor: drop weak fragments instead of diluting the pool.
        if score < min_quality:
            discarded += 1
            logger.info(
                f"Discarded fragment (score={score:.2f} < floor {min_quality:.2f}, "
                f"{chosen_style}/{collapse_type.value}); not banked [{discarded} discarded]"
            )
            continue

        # Save to storage; add to the live novelty indexes so later fragments this
        # run are also checked against it.
        await storage.save(fragment)
        if gating:
            dedup_index.add(fragment.id, toks)
        if sem_gating and vec is not None:
            semantic_index.add(fragment.id, vec)
        generated.append(fragment)
        total_msgs += len(fragment.messages)

        logger.info(
            f"Generated fragment {len(generated)}/{target_count} "
            f"(score={score:.2f}, attempts={attempts})"
        )

        # Running cost trail — cumulative judge spend amortized over BANKED output
        # (so it fairly includes the cost of discarded attempts). $/msg uses total
        # banked messages. Real OpenRouter cost where available, else estimated.
        cost = generator.autoloom.cost_usd
        banked = len(generated)
        logger.info(
            f"  [cost] ${cost:.4f} cumulative | ${cost/banked:.4f}/frag avg | "
            f"${cost/total_msgs:.5f}/msg ({banked} banked, {total_msgs} msgs, "
            f"{generator.autoloom.judge_calls} judge calls)"
        )

    logger.info(
        f"Batch complete: {len(generated)}/{target_count} banked in {attempts} attempts "
        f"({discarded} below floor {min_quality:.2f}, {near_dups} near-duplicates, "
        f"{sem_dups} thematic duplicates)"
    )
    # Judge cost for this run + a per-banked-fragment unit cost for forecasting.
    try:
        summary = generator.autoloom.cost_summary()
        if generated:
            per = generator.autoloom.cost_usd / len(generated)
            summary += f" | ${per:.4f}/banked fragment"
        logger.info(summary)
    except Exception:
        pass
    return generated
