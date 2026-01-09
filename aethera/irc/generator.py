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
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from .models import IRCFragment, CollapseType, PacingStyle
from .normalizer import IRCNormalizer, RawFragment, NormalizationError, normalize_lines
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
    COLLAPSE_NAMES,
)

logger = logging.getLogger(__name__)


# Style definitions
STYLES = {
    "technical": {
        "topics": ["programming", "debugging", "linux", "networking", "security", "hardware"],
        "description": "Technical discussion, code talk, system administration",
    },
    "philosophical": {
        "topics": ["existence", "consciousness", "meaning", "time", "reality", "perception"],
        "description": "Deep conversations about life, the universe, and everything",
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
    max_total_messages: int = 60
    
    # Collapse acceptance threshold (percentage of target)
    # Accept collapse if we're at least this far through the target
    min_collapse_percentage: float = 0.6  # 60% of target
    
    # Batch generation settings
    candidates_per_batch: int = 10  # Generate 10 candidates per round
    tokens_per_candidate: int = 100  # ~5-7 lines worth
    examples_per_prompt: int = 4  # How many examples to include
    
    # Retry settings
    max_restart_attempts: int = 10
    max_chunk_failures: int = 5  # Max failures in a row before restart
    max_early_collapse_strips: int = 3  # Max times to strip early collapse
    
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
        target_messages = target_messages or random.randint(25, 40)
        target_users = random.randint(3, 6)
        
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
        """Reset state for a new attempt."""
        state.transcript_lines = []
        state.message_count = 0
        state.chunk_failures = 0
        state.collapse_triggered = False
        state.early_collapse_strips = 0
    
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
        
        while state.message_count < self.config.max_total_messages:
            round_num += 1
            
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
            judgment = await self.autoloom.select_best(
                context=state.accumulated_content,
                candidates=candidates,
                current_messages=state.message_count,
                target_messages=state.target_messages,
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
                    
                    if total_count >= min_acceptable:
                        # Accept - we're far enough through the target
                        # Merge and normalize as usual
                        combined = state.transcript_lines + new_lines
                        state.transcript_lines = normalize_lines(combined)
                        state.message_count = self._count_irc_messages(state.transcript_lines)
                        
                        logger.info(
                            f"Round {round_num}: Selected candidate {judgment.selected_index + 1} "
                            f"(score={judgment.scores[judgment.selected_index]:.2f}), "
                            f"messages: {state.message_count}/{state.target_messages} [COLLAPSE]"
                        )
                        logger.info(
                            f"Fragment complete at {state.message_count}/{state.target_messages} "
                            f"messages with collapse"
                        )
                        return state.accumulated_content
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
                            state.transcript_lines = normalize_lines(combined)
                            return state.accumulated_content
                
                # Combine with existing transcript and normalize
                # This fixes any line wrapping issues from token cutoffs
                combined = state.transcript_lines + new_lines
                state.transcript_lines = normalize_lines(combined)
                
                # Count IRC messages (lines with <username> format)
                state.message_count = self._count_irc_messages(state.transcript_lines)
                state.chunk_failures = 0
                
                logger.info(
                    f"Round {round_num}: Selected candidate {judgment.selected_index + 1} "
                    f"(score={judgment.scores[judgment.selected_index]:.2f}), "
                    f"messages: {state.message_count}/{state.target_messages}"
                    f"{' [COLLAPSE]' if selected.has_collapse else ''}"
                )
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
        n = self.config.candidates_per_batch
        stop = ["\n---", "$ cat", "[LOG:"]
        
        # Check if we're using an Anthropic model (supports stable_prefix caching)
        is_anthropic = self._is_anthropic_model()
        
        # Build system prompt for instruct mode
        system_prompt = None
        if self.config.use_instruct_mode:
            system_prompt = build_system_prompt()
        
        try:
            if state.transcript_lines:
                # Continuation: target_intro + accumulated content
                accumulated = "\n".join(state.transcript_lines)
                variable_prompt = state.target_intro + accumulated + "\n"
                current_prefill = ""  # Continue from last line
                
                # For non-Anthropic, combine stable_prefix with variable
                if is_anthropic:
                    prompt = variable_prompt
                else:
                    prompt = state.stable_prefix + variable_prompt
                
                # Use the last line as prefill for continuation
                prefill_text = state.transcript_lines[-1] if state.transcript_lines else ""
                
                batch_result = await self.provider.complete_batch_with_prefill(
                    prompt=prompt,
                    prefill=prefill_text,
                    n=n,
                    max_tokens=self.config.tokens_per_candidate,
                    temperature=0.9,
                    stop=stop,
                    system=system_prompt if is_anthropic else None,
                    stable_prefix=state.stable_prefix if is_anthropic else None,
                )
            else:
                # First chunk: use prefill to force format "[00:00] <"
                variable_prompt = state.target_intro
                
                if is_anthropic:
                    prompt = variable_prompt
                else:
                    prompt = state.stable_prefix + variable_prompt
                
                # Always use prefill for first chunk to ensure format
                batch_result = await self.provider.complete_batch_with_prefill(
                    prompt=prompt,
                    prefill=state.prefill,  # "[00:00] <"
                    n=n,
                    max_tokens=self.config.tokens_per_candidate,
                    temperature=0.9,
                    stop=stop,
                    system=system_prompt if is_anthropic else None,
                    stable_prefix=state.stable_prefix if is_anthropic else None,
                )
            
            # Log efficiency stats
            if batch_result.cached_tokens > 0:
                logger.debug(
                    f"Batch generation: {batch_result.cached_tokens} tokens cached"
                    + (f", cost=${batch_result.cost_usd:.4f}" if batch_result.cost_usd else "")
                )
            
            # Extract and filter candidates (ChunkCandidate auto-detects collapse)
            candidates = []
            for i, text in enumerate(batch_result.texts):
                chunk = self._extract_chunk(text, state)
                if chunk and chunk.strip():
                    # ChunkCandidate.__post_init__ will detect collapse and count lines
                    candidates.append(ChunkCandidate(
                        content=chunk.strip(),
                        index=i,
                    ))
            
            return candidates
            
        except Exception as e:
            logger.warning(f"Batch generation failed: {e}")
            import traceback
            logger.debug(traceback.format_exc())
            return []
    
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
) -> list[IRCFragment]:
    """
    Generate multiple fragments until target count is reached.
    
    Args:
        generator: IRCGenerator instance
        storage: FragmentStorage for saving
        target_count: Number of fragments to generate
        max_attempts: Maximum generation attempts
        
    Returns:
        List of successfully generated fragments
    """
    generated = []
    attempts = 0
    
    while len(generated) < target_count and attempts < max_attempts:
        attempts += 1
        
        # Randomize parameters
        style = random.choice(list(STYLES.keys()))
        collapse_type = random.choice(list(CollapseType))
        
        fragment = await generator.generate_fragment(
            style=style,
            collapse_type=collapse_type,
        )
        
        if fragment:
            # Score with autoloom
            score, reasoning = await generator.autoloom.evaluate_fragment(
                "\n".join(m.content for m in fragment.messages if m.content)
            )
            fragment.quality_score = score
            
            # Save to storage
            await storage.save(fragment)
            generated.append(fragment)
            
            logger.info(
                f"Generated fragment {len(generated)}/{target_count} "
                f"(score={score:.2f}, attempts={attempts})"
            )
    
    logger.info(f"Batch complete: {len(generated)}/{target_count} fragments in {attempts} attempts")
    return generated
