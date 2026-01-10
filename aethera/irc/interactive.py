"""
Interactive IRC Generator

Wraps IRCGenerator to support step-by-step execution with pause points
for user intervention. Enables:
- Autonomous mode: runs to completion
- Confirm step mode: pauses after each judgment for user confirmation
- Manual select mode: pauses after candidates generated, user picks winner

Emits events for real-time UI updates via callback system.
"""

import asyncio
import logging
import random
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional, Callable, Awaitable, Any
from enum import Enum

from .models import IRCFragment, CollapseType, PacingStyle
from .normalizer import IRCNormalizer, RawFragment, NormalizationError, normalize_lines
from .autoloom import Autoloom, ChunkCandidate, JudgmentResult, detect_collapse_in_text
from .providers.base import InferenceProvider, CompletionMode
from .prompts.templates import (
    build_scaffold_prompt,
    build_system_prompt,
    load_random_examples,
    load_examples_for_style,
    get_style_pacing,
    COLLAPSE_NAMES,
    STYLE_DESCRIPTIONS,
    EXAMPLES_DIR,
)
from .run_config import (
    GenerationRunConfig,
    ControlMode,
    InferenceParams,
    ProviderConfig,
    SessionState,
)

logger = logging.getLogger(__name__)


class EventType(str, Enum):
    """Types of events emitted during generation."""
    STARTED = "started"
    CANDIDATES = "candidates"
    JUDGMENT = "judgment"
    PROGRESS = "progress"
    WAITING = "waiting"
    TRANSCRIPT = "transcript"
    COMPLETE = "complete"
    ERROR = "error"
    LOG = "log"


@dataclass
class GenerationEvent:
    """Event emitted during generation."""
    type: EventType
    data: dict = field(default_factory=dict)
    timestamp: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# Type alias for event callback
EventCallback = Callable[[GenerationEvent], Awaitable[None]]


@dataclass
class InteractiveState:
    """Internal state for interactive generation."""
    # Accumulated transcript
    transcript_lines: list[str] = field(default_factory=list)
    message_count: int = 0
    chunk_count: int = 0
    chunk_failures: int = 0
    
    # Fragment parameters
    style: str = ""
    collapse_type: CollapseType = CollapseType.NETSPLIT
    pacing: PacingStyle = PacingStyle.NORMAL
    target_messages: int = 25
    target_users: int = 4
    
    # Prompt components (cached)
    stable_prefix: str = ""
    target_intro: str = ""
    prefill: str = ""
    
    # Pending state for user interaction
    pending_candidates: list[ChunkCandidate] = field(default_factory=list)
    pending_judgment: Optional[JudgmentResult] = None
    
    # Stats
    total_tokens: int = 0
    total_cost: float = 0.0
    start_time: Optional[float] = None
    
    # Control
    should_stop: bool = False
    
    @property
    def accumulated_content(self) -> str:
        """Get accumulated content as string."""
        return "\n".join(self.transcript_lines)
    
    @property
    def progress_pct(self) -> float:
        """Get progress as percentage."""
        if self.target_messages <= 0:
            return 0.0
        return (self.message_count / self.target_messages) * 100


class MockProvider(InferenceProvider):
    """
    Mock provider for dry-run mode.
    
    Generates plausible-looking IRC content without API calls.
    """
    
    def __init__(self, model: str = "mock-model"):
        self._model = model
        self._call_count = 0
    
    @property
    def name(self) -> str:
        return f"mock/{self._model}"
    
    @property
    def mode(self) -> CompletionMode:
        return CompletionMode.CHAT
    
    @property
    def model(self) -> str:
        return self._model
    
    async def complete(self, prompt: str, max_tokens: int, temperature: float = 1.0, 
                       top_p: float = 1.0, stop: Optional[list[str]] = None):
        from .providers.base import CompletionResult
        self._call_count += 1
        
        # Generate mock IRC content
        nicks = ["zero", "void_", "lucid", "dreamer", "null_ptr", "entropy_"]
        lines = []
        for i in range(random.randint(3, 6)):
            nick = random.choice(nicks)
            content = random.choice([
                "anyone here?",
                "lol",
                "that's interesting",
                "wait what",
                "i don't think that's right",
                "hmm",
                "yeah exactly",
                "no way",
                "brb",
            ])
            lines.append(f"[00:{i:02d}] <{nick}> {content}")
        
        # Sometimes add collapse
        if random.random() < 0.2:
            lines.append("*** void_ has quit (Ping timeout: 245 seconds)")
        
        await asyncio.sleep(0.1)  # Simulate latency
        
        return CompletionResult(
            text="\n".join(lines),
            tokens_used=100,
            tokens_prompt=50,
            model=self._model,
            latency_ms=100,
            cost_usd=0.0,
        )
    
    async def complete_with_prefill(self, prompt: str, prefill: str, max_tokens: int,
                                     temperature: float = 1.0, top_p: float = 1.0,
                                     stop: Optional[list[str]] = None):
        return await self.complete(prompt, max_tokens, temperature, top_p, stop)
    
    async def complete_batch_with_prefill(self, prompt: str, prefill: str, n: int,
                                           max_tokens: int, temperature: float = 1.0,
                                           top_p: float = 1.0, stop: Optional[list[str]] = None,
                                           system: Optional[str] = None,
                                           stable_prefix: Optional[str] = None):
        from .providers.base import BatchCompletionResult
        
        results = []
        for _ in range(n):
            r = await self.complete(prompt, max_tokens, temperature, top_p, stop)
            results.append(r.text)
        
        return BatchCompletionResult(
            texts=results,
            tokens_used=100 * n,
            tokens_prompt=50,
            model=self._model,
            latency_ms=100,
            cost_usd=0.0,
        )


class InteractiveGenerator:
    """
    Interactive IRC fragment generator with step-by-step control.
    
    Supports three control modes:
    - AUTONOMOUS: Runs to completion without pausing
    - CONFIRM_STEP: Pauses after each judgment for confirmation
    - MANUAL_SELECT: Pauses after candidates generated, user picks winner
    
    Emits events for real-time UI updates.
    """
    
    def __init__(
        self,
        config: GenerationRunConfig,
        generation_provider: Optional[InferenceProvider] = None,
        judge_provider: Optional[InferenceProvider] = None,
        normalizer: Optional[IRCNormalizer] = None,
        event_callback: Optional[EventCallback] = None,
    ):
        """
        Initialize interactive generator.
        
        Args:
            config: Runtime configuration
            generation_provider: Provider for generation (or None to create from config)
            judge_provider: Provider for judging (or None to create from config)
            normalizer: IRC normalizer (or None to create default)
            event_callback: Async callback for events
        """
        self.config = config
        self.normalizer = normalizer or IRCNormalizer()
        self.event_callback = event_callback
        
        # Create providers if not provided
        if config.dry_run:
            self.generation_provider = MockProvider("mock-generation")
            self.judge_provider = MockProvider("mock-judge")
        else:
            self.generation_provider = generation_provider or self._create_provider(config.generation)
            self.judge_provider = judge_provider or self._create_provider(config.judge)
        
        # Create autoloom with custom prompts and judge params if provided
        self.autoloom = Autoloom(
            judge_provider=self.judge_provider,
            threshold=config.autoloom_threshold,
            custom_system_prompt=config.prompts.judge_system_prompt,
            custom_user_template=config.prompts.judge_user_template,
            custom_user_template_first=config.prompts.judge_user_template_first,
            judge_params=config.judge.params,
        )
        
        # State
        self.state: Optional[InteractiveState] = None
        self._user_input_event = asyncio.Event()
        self._user_selection: Optional[int] = None
    
    def _create_provider(self, provider_config: ProviderConfig) -> InferenceProvider:
        """Create a provider from config.
        
        Uses API key from provider_config if provided, otherwise falls back to env vars.
        """
        from .config import IRCConfig
        
        # Use the existing config factory for env var fallbacks
        irc_config = IRCConfig.from_env()
        
        if provider_config.provider == "anthropic":
            from .providers.anthropic import AnthropicProvider
            api_key = provider_config.api_key or irc_config.anthropic_api_key
            if not api_key:
                raise ValueError("Anthropic API key not provided and ANTHROPIC_API_KEY not set")
            return AnthropicProvider(
                api_key=api_key,
                model=provider_config.model,
                enable_caching=True,
            )
        elif provider_config.provider == "openai":
            from .providers.openai import OpenAIProvider
            api_key = provider_config.api_key or irc_config.openai_api_key
            if not api_key:
                raise ValueError("OpenAI API key not provided and OPENAI_API_KEY not set")
            return OpenAIProvider(
                api_key=api_key,
                model=provider_config.model,
            )
        elif provider_config.provider == "openrouter":
            from .providers.openrouter import OpenRouterProvider
            api_key = provider_config.api_key or irc_config.openrouter_api_key
            if not api_key:
                raise ValueError("OpenRouter API key not provided and OPENROUTER_API_KEY not set")
            return OpenRouterProvider(
                api_key=api_key,
                model=provider_config.model,
            )
        elif provider_config.provider == "local":
            from .providers.openai_compatible import OpenAICompatibleProvider
            base_url = provider_config.base_url or irc_config.local_base_url
            if not base_url:
                raise ValueError("Base URL not provided for local provider")
            return OpenAICompatibleProvider(
                base_url=base_url,
                model=provider_config.model,
                api_key=provider_config.api_key or irc_config.local_api_key,
                provider_name="local",
            )
        else:
            raise ValueError(f"Unknown provider: {provider_config.provider}")
    
    async def _emit(self, event_type: EventType, data: dict = None):
        """Emit an event to the callback."""
        if self.event_callback:
            event = GenerationEvent(type=event_type, data=data or {})
            try:
                await self.event_callback(event)
            except Exception as e:
                logger.warning(f"Event callback error: {e}")
    
    async def _log(self, level: str, message: str):
        """Emit a log event."""
        await self._emit(EventType.LOG, {
            "level": level,
            "message": message,
        })
        
        # Also log normally
        log_fn = getattr(logger, level, logger.info)
        log_fn(message)
    
    async def generate(self) -> Optional[IRCFragment]:
        """
        Run the generation loop.
        
        Returns:
            Generated IRCFragment or None if generation fails
        """
        # Initialize state
        self.state = InteractiveState()
        self.state.start_time = time.time()
        
        # Set fragment parameters
        style = self.config.style or random.choice(list(STYLE_DESCRIPTIONS.keys()))
        collapse_type_str = self.config.collapse_type
        if collapse_type_str:
            collapse_type = CollapseType(collapse_type_str)
        else:
            collapse_type = random.choice(list(CollapseType))
        
        self.state.style = style
        self.state.collapse_type = collapse_type
        self.state.pacing = get_style_pacing(style)
        self.state.target_messages = self.config.target_messages
        self.state.target_users = self.config.target_users
        
        # Load examples
        if self.config.prompts.example_files:
            # Use specific example files
            examples = []
            for filename in self.config.prompts.example_files:
                try:
                    filepath = EXAMPLES_DIR / filename
                    if filepath.exists():
                        examples.append(filepath.read_text().strip())
                except Exception as e:
                    await self._log("warning", f"Failed to load example {filename}: {e}")
        else:
            # Random examples
            examples = load_random_examples(count=self.config.prompts.examples_count)
        
        # Build prompt
        stable_prefix, target_intro, prefill = build_scaffold_prompt(
            examples=examples,
            target_style=style,
            target_collapse=collapse_type,
            target_users=self.state.target_users,
            target_messages=self.state.target_messages,
            channel=self.config.channel,
            split_for_caching=True,
        )
        
        self.state.stable_prefix = stable_prefix
        self.state.target_intro = target_intro
        self.state.prefill = prefill
        
        await self._emit(EventType.STARTED)
        await self._log("info", 
            f"Starting generation: style={style}, collapse={collapse_type.value}, "
            f"target={self.state.target_messages} messages"
        )
        
        try:
            content = await self._run_generation_loop()
            
            if content and not self.state.should_stop:
                # Normalize the fragment
                raw = RawFragment(
                    content=content,
                    style=style,
                    intended_collapse=collapse_type,
                    pacing=self.state.pacing,
                )
                fragment = self.normalizer.normalize(raw)
                
                # Validate
                if self.normalizer.validate_fragment(fragment):
                    duration_ms = (time.time() - self.state.start_time) * 1000
                    
                    await self._emit(EventType.COMPLETE, {
                        "transcript": content,
                        "stats": {
                            "chunks": self.state.chunk_count,
                            "messages": len(fragment.messages),
                            "tokens": self.state.total_tokens,
                            "cost": self.state.total_cost,
                            "duration_ms": duration_ms,
                        }
                    })
                    
                    return fragment
                else:
                    await self._log("error", "Fragment failed validation")
            
            return None
            
        except Exception as e:
            await self._emit(EventType.ERROR, {
                "message": str(e),
                "recoverable": False,
            })
            raise
    
    async def _run_generation_loop(self) -> Optional[str]:
        """Run the main generation loop."""
        max_messages = self.config.target_messages + 20  # Allow some overshoot
        
        while self.state.message_count < max_messages and not self.state.should_stop:
            self.state.chunk_count += 1
            
            await self._log("debug", 
                f"Chunk {self.state.chunk_count}: {self.state.message_count}/{self.state.target_messages} messages"
            )
            
            # Generate candidates
            candidates = await self._generate_candidates()
            
            if not candidates:
                self.state.chunk_failures += 1
                await self._log("warning", f"No candidates generated (failure {self.state.chunk_failures})")
                
                if self.state.chunk_failures >= self.config.max_chunk_failures:
                    await self._log("error", "Too many consecutive failures")
                    return None
                continue
            
            self.state.pending_candidates = candidates
            
            # Emit candidates event
            # Use list position as index for selection, store batch_index for reference
            await self._emit(EventType.CANDIDATES, {
                "chunk": self.state.chunk_count,
                "candidates": [
                    {
                        "index": list_idx,  # List position for selection
                        "batch_index": c.index,  # Original batch position for reference
                        "content": c.content,
                        "has_collapse": c.has_collapse,
                        "line_count": c.line_count,
                    }
                    for list_idx, c in enumerate(candidates)
                ]
            })
            
            # Handle based on control mode
            if self.config.control_mode == ControlMode.MANUAL_SELECT:
                # Wait for user selection
                await self._emit(EventType.WAITING, {
                    "mode": "select",
                    "timeout_seconds": None,
                })
                
                selected_index = await self._wait_for_user_selection()
                
                if selected_index is None or self.state.should_stop:
                    return self.state.accumulated_content if self.state.transcript_lines else None
                
                # Apply user selection
                selected = candidates[selected_index]
                judgment = JudgmentResult(
                    selected_index=selected_index,
                    selected_content=selected.content,
                    scores=[0.5] * len(candidates),  # Dummy scores
                    reasoning="User selection",
                )
                
            else:
                # Run autoloom judgment
                judgment = await self.autoloom.select_best(
                    context=self.state.accumulated_content,
                    candidates=candidates,
                    current_messages=self.state.message_count,
                    target_messages=self.state.target_messages,
                )
                
                self.state.pending_judgment = judgment
                
                # Emit judgment event
                await self._emit(EventType.JUDGMENT, {
                    "selected_index": judgment.selected_index,
                    "scores": judgment.scores,
                    "reasoning": judgment.reasoning,
                })
                
                if self.config.control_mode == ControlMode.CONFIRM_STEP:
                    # Wait for user confirmation
                    await self._emit(EventType.WAITING, {
                        "mode": "confirm",
                        "timeout_seconds": None,
                    })
                    
                    confirmed = await self._wait_for_user_confirmation()
                    
                    if not confirmed or self.state.should_stop:
                        return self.state.accumulated_content if self.state.transcript_lines else None
            
            # Apply the selection
            if judgment.selected_index is not None:
                selected = candidates[judgment.selected_index]
                
                # Parse new lines
                new_lines = selected.content.strip().split("\n")
                
                # For first chunk, prepend prefill
                if not self.state.transcript_lines and self.state.prefill:
                    if new_lines and not new_lines[0].startswith("["):
                        new_lines[0] = self.state.prefill + new_lines[0]
                
                # Check for early collapse
                if selected.has_collapse:
                    min_acceptable = int(self.state.target_messages * self.config.min_collapse_percentage)
                    current_count = self._count_messages(self.state.transcript_lines)
                    new_count = self._count_messages(new_lines)
                    total_count = current_count + new_count
                    
                    if total_count >= min_acceptable:
                        # Accept collapse
                        combined = self.state.transcript_lines + new_lines
                        self.state.transcript_lines = normalize_lines(combined)
                        self.state.message_count = self._count_messages(self.state.transcript_lines)
                        
                        await self._log("info", 
                            f"Chunk {self.state.chunk_count}: Selected candidate {judgment.selected_index + 1}, "
                            f"messages: {self.state.message_count}/{self.state.target_messages} [COLLAPSE]"
                        )
                        
                        await self._emit_transcript_update(new_lines)
                        return self.state.accumulated_content
                    else:
                        # Strip collapse markers
                        await self._log("warning", 
                            f"Collapse too early ({total_count}/{self.state.target_messages}), stripping"
                        )
                        new_lines = self._strip_collapse_markers(new_lines)
                
                # Merge and normalize
                combined = self.state.transcript_lines + new_lines
                self.state.transcript_lines = normalize_lines(combined)
                self.state.message_count = self._count_messages(self.state.transcript_lines)
                self.state.chunk_failures = 0
                
                await self._log("info", 
                    f"Chunk {self.state.chunk_count}: Selected candidate {judgment.selected_index + 1} "
                    f"(score={judgment.scores[judgment.selected_index]:.2f}), "
                    f"messages: {self.state.message_count}/{self.state.target_messages}"
                )
                
                await self._emit_transcript_update(new_lines)
                await self._emit_progress()
                
            else:
                # All rejected
                self.state.chunk_failures += 1
                await self._log("warning", 
                    f"Chunk {self.state.chunk_count}: All candidates rejected "
                    f"(failure {self.state.chunk_failures}/{self.config.max_chunk_failures})"
                )
                
                if self.state.chunk_failures >= self.config.max_chunk_failures:
                    await self._log("error", "Too many consecutive failures")
                    return None
            
            # Check chunk limit
            if self.state.chunk_count >= self.config.max_chunks:
                await self._log("warning", f"Reached max chunks ({self.config.max_chunks})")
                break
        
        return self.state.accumulated_content if self.state.transcript_lines else None
    
    async def _generate_candidates(self) -> list[ChunkCandidate]:
        """Generate a batch of candidates."""
        n = self.config.candidates_per_batch
        stop = ["\n---", "$ cat", "[LOG:"]
        
        # Get inference params
        params = self.config.generation.params
        
        # Check if Anthropic model
        is_anthropic = "anthropic" in self.generation_provider.name.lower() or \
                       "claude" in self.generation_provider.name.lower()
        
        # Build system prompt
        system_prompt = None
        if self.config.use_instruct_mode:
            system_prompt = self.config.prompts.generation_system_prompt or build_system_prompt()
        
        try:
            if self.state.transcript_lines:
                # Continuation
                accumulated = "\n".join(self.state.transcript_lines)
                variable_prompt = self.state.target_intro + accumulated + "\n"
                
                if is_anthropic:
                    prompt = variable_prompt
                else:
                    prompt = self.state.stable_prefix + variable_prompt
                
                prefill_text = self.state.transcript_lines[-1] if self.state.transcript_lines else ""
                
                batch_result = await self.generation_provider.complete_batch_with_prefill(
                    prompt=prompt,
                    prefill=prefill_text,
                    n=n,
                    max_tokens=params.max_tokens,
                    temperature=params.temperature,
                    top_p=params.top_p,
                    stop=params.stop_sequences or stop,
                    system=system_prompt if is_anthropic else None,
                    stable_prefix=self.state.stable_prefix if is_anthropic else None,
                )
            else:
                # First chunk
                variable_prompt = self.state.target_intro
                
                if is_anthropic:
                    prompt = variable_prompt
                else:
                    prompt = self.state.stable_prefix + variable_prompt
                
                batch_result = await self.generation_provider.complete_batch_with_prefill(
                    prompt=prompt,
                    prefill=self.state.prefill,
                    n=n,
                    max_tokens=params.max_tokens,
                    temperature=params.temperature,
                    top_p=params.top_p,
                    stop=params.stop_sequences or stop,
                    system=system_prompt if is_anthropic else None,
                    stable_prefix=self.state.stable_prefix if is_anthropic else None,
                )
            
            # Track stats
            self.state.total_tokens += batch_result.tokens_used
            if batch_result.cost_usd:
                self.state.total_cost += batch_result.cost_usd
            
            # Extract candidates
            candidates = []
            for i, text in enumerate(batch_result.texts):
                chunk = self._extract_chunk(text)
                if chunk and chunk.strip():
                    candidates.append(ChunkCandidate(
                        content=chunk.strip(),
                        index=i,
                    ))
            
            return candidates
            
        except Exception as e:
            await self._log("error", f"Batch generation failed: {e}")
            return []
    
    def _extract_chunk(self, generated: str) -> str:
        """Extract valid IRC lines from generation."""
        lines = generated.strip().split("\n")
        valid_lines = []
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if line.startswith("$") or line.startswith("[LOG:"):
                continue
            if line.startswith("---") or line.startswith("==="):
                continue
            if any([
                line.startswith("["),
                line.startswith("<"),
                line.startswith("*"),
            ]):
                valid_lines.append(line)
        
        return "\n".join(valid_lines)
    
    def _count_messages(self, lines: list[str]) -> int:
        """Count actual IRC messages."""
        return len([l for l in lines if l.strip() and "<" in l and not l.startswith("***")])
    
    def _strip_collapse_markers(self, lines: list[str]) -> list[str]:
        """Remove collapse-related lines."""
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
    
    async def _emit_transcript_update(self, new_lines: list[str]):
        """Emit transcript update event."""
        await self._emit(EventType.TRANSCRIPT, {
            "lines": self.state.transcript_lines,
            "new_lines": new_lines,
        })
    
    async def _emit_progress(self):
        """Emit progress event."""
        await self._emit(EventType.PROGRESS, {
            "chunk": self.state.chunk_count,
            "messages": self.state.message_count,
            "target": self.state.target_messages,
            "tokens_used": self.state.total_tokens,
            "cost_usd": self.state.total_cost,
        })
    
    async def _wait_for_user_selection(self) -> Optional[int]:
        """Wait for user to select a candidate."""
        self._user_input_event.clear()
        self._user_selection = None
        
        await self._user_input_event.wait()
        
        return self._user_selection
    
    async def _wait_for_user_confirmation(self) -> bool:
        """Wait for user to confirm continuation."""
        self._user_input_event.clear()
        self._user_selection = None
        
        await self._user_input_event.wait()
        
        # Any non-None selection means continue
        return self._user_selection is not None
    
    def provide_selection(self, candidate_index: int):
        """Provide user selection (called from outside)."""
        self._user_selection = candidate_index
        self._user_input_event.set()
    
    def provide_confirmation(self):
        """Provide user confirmation to continue (called from outside)."""
        self._user_selection = 0  # Any value means continue
        self._user_input_event.set()
    
    def stop(self):
        """Stop the generation."""
        if self.state:
            self.state.should_stop = True
        self._user_input_event.set()
    
    def get_state(self) -> Optional[SessionState]:
        """Get current state as serializable SessionState."""
        if not self.state:
            return None
        
        status = "idle"
        if self.state.start_time:
            if self.state.should_stop:
                status = "stopped"
            elif self.state.pending_candidates:
                status = "paused"
            else:
                status = "running"
        
        waiting_for = None
        if self.state.pending_candidates and self.config.control_mode == ControlMode.MANUAL_SELECT:
            waiting_for = "select"
        elif self.state.pending_judgment and self.config.control_mode == ControlMode.CONFIRM_STEP:
            waiting_for = "confirm"
        
        return SessionState(
            session_id="",  # Set by session manager
            config=self.config,
            status=status,
            current_chunk=self.state.chunk_count,
            message_count=self.state.message_count,
            transcript_lines=self.state.transcript_lines,
            waiting_for=waiting_for,
            pending_candidates=[
                {
                    "index": list_idx,  # List position for selection
                    "batch_index": c.index,  # Original batch position
                    "content": c.content,
                    "has_collapse": c.has_collapse,
                    "line_count": c.line_count,
                }
                for list_idx, c in enumerate(self.state.pending_candidates)
            ],
            pending_judgment={
                "selected_index": self.state.pending_judgment.selected_index,
                "scores": self.state.pending_judgment.scores,
                "reasoning": self.state.pending_judgment.reasoning,
            } if self.state.pending_judgment else None,
            total_tokens=self.state.total_tokens,
            total_cost=self.state.total_cost,
            start_time=datetime.fromtimestamp(self.state.start_time, tz=timezone.utc).isoformat() if self.state.start_time else None,
        )

