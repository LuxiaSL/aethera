"""
Autoloom - LLM-as-Judge Quality Gate

Evaluates batches of generated IRC chunks and selects the best candidate,
understanding that the winner advances to have more story generated from it.

Supports:
- Progress-aware pacing guidance (opening/middle/end phases)
- Collapse detection markers on candidates
- Reasoning model handling (o3/o1 require temp=1.0 and more tokens)
"""

import logging
import re
from dataclasses import dataclass, field
from typing import Optional

from .providers.base import InferenceProvider, CompletionMode
from .run_config import InferenceParams

logger = logging.getLogger(__name__)


# ==================== Reasoning Model Detection ====================
# Reasoning-capable judges think before answering, so they need a large output
# budget — otherwise they get truncated mid-thought and never emit the final
# SCORES line (observed with Kimi K2.5). Covers OpenAI o-series, DeepSeek R1,
# and the Kimi K2.x family (all reasoning-capable), served directly or via
# OpenRouter.
REASONING_MODEL_PATTERNS = [
    "o3", "o1-", "o1:", "deepseek-r1", "deepseek-reasoner", "kimi-k2",
]

# Stricter subset whose API *requires* temperature=1.0 (OpenAI o-series). Other
# reasoning models (Kimi, DeepSeek R1) accept a normal, lower judging temperature.
STRICT_TEMP_ONE_PATTERNS = ["o3", "o1-", "o1:"]


def is_reasoning_model(model_name: str) -> bool:
    """True if the model reasons before answering and needs output headroom."""
    model_lower = model_name.lower()
    return any(pattern in model_lower for pattern in REASONING_MODEL_PATTERNS)


def requires_temperature_one(model_name: str) -> bool:
    """True if the model's API mandates temperature=1.0 (OpenAI o-series)."""
    model_lower = model_name.lower()
    return any(pattern in model_lower for pattern in STRICT_TEMP_ONE_PATTERNS)


# ==================== Collapse Detection ====================
# Markers that indicate a candidate contains a collapse sequence

COLLAPSE_MARKERS = [
    "*** Netsplit", "*** GLINE", "was kicked", "has quit",
    "Ping timeout", "SendQ exceeded", "ERROR:", "Connection reset",
    "G-lined", "K-lined", "banned from", "Excess Flood",
]


def detect_collapse_in_text(text: str) -> bool:
    """Check if text contains collapse markers."""
    text_lower = text.lower()
    return any(marker.lower() in text_lower for marker in COLLAPSE_MARKERS)


@dataclass
class ChunkCandidate:
    """A candidate chunk from the generator."""
    content: str  # Raw IRC-formatted text
    index: int    # Which candidate this is (0-indexed)
    has_collapse: bool = field(default=False)  # Whether this candidate contains collapse markers
    line_count: int = field(default=0)  # Number of non-empty lines
    
    def __post_init__(self):
        """Auto-detect collapse and count lines if not set."""
        if not self.has_collapse:
            self.has_collapse = detect_collapse_in_text(self.content)
        if not self.line_count:
            self.line_count = len([l for l in self.content.split('\n') if l.strip()])


@dataclass
class JudgmentResult:
    """Result of judging a set of candidates."""
    selected_index: Optional[int]  # None if all rejected
    selected_content: Optional[str]
    scores: list[float]  # Score for each candidate
    reasoning: str       # Judge's explanation
    judge_prompt: Optional[str] = None  # The prompt sent to the judge (for debugging/display)
    end_requested: bool = False  # Judge chose to END the fragment now (collapse it)


# The intended TONE of each channel category — the judge scores a fragment
# against its own mode, so eerie/uncanny anomaly logs aren't marked down for
# failing to be "normal banter" (they're supposed to be unsettling).
TONE_BY_STYLE = {
    "technical": "competent nerds, dry humor, debugging war-stories, hubris and comeuppance",
    "anomaly": "eerie, uncanny dread — glitches and phantom presences, the haunting setting in",
    "incident": "a tense live crisis — adrenaline and gallows humor as something actively breaks",
    "support": "deadpan helpdesk absurdity — mundane problems turning surreal",
    "chaotic": "unhinged 3am chaos — non-sequiturs spiralling out of control",
}


# Batch judge system prompt - emphasizes that winner continues the story
JUDGE_SYSTEM_PROMPT = """You are the editor of a CURSED IRC channel — an art project that generates authentic-feeling IRC logs which build a mood, ESCALATE, and then COLLAPSE (netsplit, g-line, mass kick, ping timeout, corruption). You are choosing which candidate continuation the story follows.

IMPORTANT: The candidate you rate highest is SELECTED and the story continues from it — your choice steers the whole fragment. Pick the one with the most interesting potential.

This is NOT ordinary chit-chat, and you must NOT reward candidates for being safe, normal, or pleasant. The best fragments commit hard to a TONE and ESCALATE toward the channel's destruction. A channel's tone might be eerie/uncanny dread, unhinged 3am chaos, a tense live-crisis, deadpan helpdesk absurdity, or technical war-story. Eerie, glitchy, unsettling, surreal, or unhinged content is a STRENGTH here — this is a haunted broadcast, not a normal chatroom. Reward a candidate that DEEPENS and ESCALATES the mood; penalize one that flattens it into ordinary small-talk.

Evaluation criteria (in priority order):
1. **Tone & atmosphere**: Does it commit to and intensify the channel's mood? Strangeness, dread, and chaos are good — sanitized normalcy is bad.
2. **Escalation**: Does it raise the stakes and build momentum toward a climax / the channel falling apart? Favor candidates that push the story forward over ones that idle or reset the tension.
3. **Coherence**: Does it follow from the context and stay internally consistent — even when the content is strange?
4. **Voice**: Do the nicks read as distinct people (or entities)?
5. **Authenticity**: Reads like a real IRC log of that era — not AI-explanatory ("As an AI"), not generic, not over-formal.

You will see multiple candidates (typically 10-12). Evaluate them ALL and select the one that best escalates the fragment toward a memorable collapse.

Respond in this exact format:
SCORES: [score1, score2, score3, ...] (each 0.0 to 1.0, one per candidate)
BEST: N (the 1-indexed number of the best candidate, or 0 if ALL are too bad to continue)
END: no (or "yes" — see below)
REASONING: (brief explanation of why the winner was chosen)

Only set BEST to 0 if genuinely no candidate is salvageable (scores all below 0.4).

END: set this to "yes" ONLY when the conversation has reached a natural climax or is clearly running out of steam, and the log SO FAR is a strong place to bring the channel down. When you set END: yes, this round's candidates are discarded and the channel's collapse is issued immediately — so use it to end on a high note rather than letting a good conversation sag or pad toward a length target. Default to "no". (END is ignored until the log is long enough to stand on its own.)"""


# Template for first chunk (no context yet)
JUDGE_USER_TEMPLATE_FIRST = """## TARGET: {target_messages} messages

This is the OPENING of a new IRC fragment.
Select the candidate that establishes the best foundation for a ~{target_messages} message conversation.

## Candidate openings ({num_candidates} total):

{candidates}

Evaluate ALL candidates and select the BEST one to start the story from."""


# Template for continuation with progress tracking
JUDGE_USER_TEMPLATE_CONTINUATION = """## PROGRESS: {current_messages}/{target_messages} messages ({progress_pct:.0f}%)

{pacing_guidance}

## Conversation so far:
{context}

## Candidate continuations ({num_candidates} total):

{candidates}

Select the candidate that best continues the narrative while:
- Maintaining consistent tone and character voices
- Keeping natural conversation flow
- Pacing appropriately toward the target length"""


# Addendum injected into the system prompt ONLY in stateful mode. Frames the
# judge as a story editor maintaining one consistent arc across the fragment's
# rounds — its prior turns (carried forward in the conversation) ARE its intent.
STATEFUL_EDITOR_ADDENDUM = """You are judging this fragment as a SINGLE ongoing conversation, round by round, not as isolated one-shot decisions. You are the story's editor: across rounds you commit to a direction for where this channel is heading and steer toward it.

Each round you'll see only what was newly added to the canonical transcript since your last call, plus the next batch of candidates. Your earlier reasoning is above in this conversation — treat it as the arc you committed to. Stay coherent with it: follow through on tensions you set up, pay off threads you opened, and time the channel's collapse deliberately rather than re-deciding the story from scratch each round. If new developments genuinely warrant a course-correction, make it consciously and say so in your REASONING.

WORK IN TWO MOVEMENTS. Act 1: establish ordinary, engaging channel life and PLANT a thread (a detail, a tension, a character beat). The Turn: bring the disruption — the thing that goes wrong — ideally paying off that thread. Act 2: escalate to a collapse that the normal phase EARNED. The collapse must grow out of Act 1, not feel bolted on. Track which act you're in. Don't rush to Act 2 — protect the normal phase and reject candidates that collapse the channel prematurely — but don't linger in it either.

CRUCIAL — end on time. The fragment has a target length and it MUST end in a collapse, not run on. Once you are at or past the target, a continuation that DELIVERS the collapse should win over one that merely prolongs the conversation, however pleasant. A fragment that overruns its length and has to be cut off is a FAILURE. When it's time, bring it down."""


# Stateful continuation turn: only the DELTA since the last call + new
# candidates (the full prior transcript is already in the conversation history).
JUDGE_USER_TEMPLATE_STATEFUL = """## PROGRESS: {current_messages}/{target_messages} messages ({progress_pct:.0f}%)

{pacing_guidance}

## Added to the canonical transcript since your last call:
{delta}

## Candidate continuations ({num_candidates} total):

{candidates}

Continue steering toward the arc you committed to above. Select the candidate that best advances it while keeping voices consistent and pacing toward the collapse."""


def get_pacing_guidance(current_messages: int, target_messages: int) -> str:
    """
    Get phase-appropriate pacing guidance for the judge.
    
    Helps the judge understand where we are in the story arc
    and what kind of continuation is most appropriate.
    """
    if target_messages <= 0:
        return ""

    progress_pct = (current_messages / target_messages) * 100
    remaining = target_messages - current_messages

    # Act-aware pacing. The bands are percentage-based so they scale to BOTH a
    # short single-arc snippet and a long two-act fragment. The arc is:
    # ACT 1 (normal, plant a thread) -> THE TURN (disruption) -> ACT 2 (collapse
    # the normal phase earned). Do not let the collapse get bolted on.
    if progress_pct < 55:
        return (
            "We're in ACT 1 — NORMAL channel life. Favor candidates that build everyday channel texture "
            "and develop a mundane, engaging situation — banter, a small drama, a developing topic — and that "
            "PLANT a thread (a detail, tension, or character beat) that can pay off later. Do NOT escalate or "
            "collapse yet: reject candidates that introduce disaster, dread, or breakdown prematurely. Keep it "
            "alive and grounded, but not boring."
        )
    elif progress_pct < 70:
        return (
            f"We're at THE TURN ({remaining} messages left). Favor the candidate that introduces the DISRUPTION — "
            "the thing that starts to go wrong — ideally paying off a thread planted in Act 1 so the shift feels "
            "earned, not random. This is the hinge from normal into collapse; pick the candidate that turns the mood."
        )
    elif progress_pct < 85:
        return (
            f"We're in ACT 2 — ESCALATION ({remaining} messages left). Favor candidates that raise the tension and "
            "drive toward the channel's collapse, building on the turn. If the conversation has ALREADY hit a strong "
            "climax, you may set END: yes to collapse now rather than padding toward the target."
        )
    else:
        return (
            f"We're at the END ({remaining} messages left). Favor a candidate that delivers a STRONG collapse — "
            "a cascade where the channel actually falls apart: multiple disconnects / kicks / errors in quick "
            "succession, people dropping one after another, the room visibly emptying. Reject a weak ending that's "
            "just one quiet exit or that trails off without the channel breaking down. If the log is already a "
            "strong place to end, set END: yes to issue the collapse immediately."
        )


class Autoloom:
    """
    Quality gate using LLM-as-judge with batch evaluation.
    
    Evaluates multiple candidate chunks at once and selects
    the best one to continue story generation from.
    """
    
    def __init__(
        self,
        judge_provider: InferenceProvider,
        threshold: float = 0.4,  # Lower threshold since we're picking the best
        max_retries: int = 2,
        custom_system_prompt: Optional[str] = None,
        custom_user_template: Optional[str] = None,
        custom_user_template_first: Optional[str] = None,
        judge_params: Optional[InferenceParams] = None,
        stateful: bool = False,
    ):
        """
        Initialize autoloom.

        Args:
            judge_provider: LLM provider for judging (should be instruct model)
            threshold: Minimum score to accept ANY candidate
            max_retries: Retries on parse failure
            custom_system_prompt: Override for JUDGE_SYSTEM_PROMPT
            custom_user_template: Override for JUDGE_USER_TEMPLATE_CONTINUATION
            custom_user_template_first: Override for JUDGE_USER_TEMPLATE_FIRST
            judge_params: Inference parameters (temperature, top_p, max_tokens) for judging
            stateful: If True, judge maintains ONE conversation across a
                fragment's rounds (carrying its own reasoning forward) instead
                of a fresh one-shot per round. Call reset() per fragment.
        """
        self.provider = judge_provider
        self.threshold = threshold
        self.max_retries = max_retries
        self.stateful = stateful

        # Custom prompts (None = use defaults)
        self.system_prompt = custom_system_prompt or JUDGE_SYSTEM_PROMPT
        self.user_template = custom_user_template or JUDGE_USER_TEMPLATE_CONTINUATION
        self.user_template_first = custom_user_template_first or JUDGE_USER_TEMPLATE_FIRST

        # Judge inference params (None = use defaults)
        self.judge_params = judge_params

        # Per-fragment conversation state (stateful mode only). _history is the
        # running judge chat; _last_context is the transcript the judge has
        # already seen, so each round we can send only the new delta.
        self._history: list[dict] = []
        self._last_context: str = ""

        # Cumulative judge usage/cost across the WHOLE run (NOT reset per-fragment).
        # Cost comes from the provider's real OpenRouter usage.cost where available.
        self.judge_calls = 0
        self.cost_usd = 0.0
        self.prompt_tokens = 0
        self.completion_tokens = 0
        self.cached_tokens = 0

        # Validate provider mode
        if self.provider.mode != CompletionMode.CHAT:
            logger.warning(
                f"Judge provider is {self.provider.mode.value} mode, "
                "but CHAT mode is recommended for judging"
            )

    def reset(self) -> None:
        """
        Clear per-fragment judge state so the next fragment starts a fresh
        conversation. Call at the start of each fragment AND on restart. Always
        safe to call (no-op effect in stateless mode). Does NOT reset the
        cumulative cost counters (those span the whole run).
        """
        self._history = []
        self._last_context = ""

    def _track(self, result) -> None:
        """Accumulate one judge call's usage/cost (run-wide). Tolerant of missing
        fields (some providers don't return usage)."""
        if result is None:
            return
        self.judge_calls += 1
        self.cost_usd += getattr(result, "cost_usd", 0.0) or 0.0
        prompt = getattr(result, "tokens_prompt", 0) or 0
        total = getattr(result, "tokens_used", 0) or 0
        self.prompt_tokens += prompt
        self.completion_tokens += max(0, total - prompt)
        self.cached_tokens += getattr(result, "cached_tokens", 0) or 0

    def cost_summary(self) -> str:
        """One-line judge cost/usage summary for the whole run."""
        cached_pct = (self.cached_tokens / self.prompt_tokens * 100) if self.prompt_tokens else 0
        return (
            f"Judge cost: ${self.cost_usd:.4f} over {self.judge_calls} calls "
            f"({self.prompt_tokens:,} in / {self.completion_tokens:,} out tokens, "
            f"{cached_pct:.0f}% cached)"
        )
    
    async def select_best(
        self,
        context: str,
        candidates: list[ChunkCandidate],
        current_messages: int = 0,
        target_messages: int = 25,
    ) -> JudgmentResult:
        """
        Evaluate ALL candidates in a single batch and select the best one.
        
        Args:
            context: The conversation so far (IRC-formatted)
            candidates: List of candidate continuations (typically 10-12)
            current_messages: How many messages we have so far (for pacing)
            target_messages: Target message count (for pacing guidance)
            
        Returns:
            JudgmentResult with selected candidate or None if all rejected
        """
        if not candidates:
            return JudgmentResult(
                selected_index=None,
                selected_content=None,
                scores=[],
                reasoning="No candidates provided",
                judge_prompt=None,
            )

        candidates_text = self._build_candidates_text(candidates)

        # Stateful mode keeps one running conversation across the fragment's
        # rounds; dispatch to it (the stateless body below is left intact).
        if self.stateful:
            return await self._select_best_stateful(
                context=context,
                candidates=candidates,
                candidates_text=candidates_text,
                current_messages=current_messages,
                target_messages=target_messages,
            )

        # Build user prompt based on whether we have context (first chunk vs continuation)
        if context:
            progress_pct = (current_messages / target_messages * 100) if target_messages > 0 else 0
            pacing_guidance = get_pacing_guidance(current_messages, target_messages)
            
            user_prompt = self.user_template.format(
                current_messages=current_messages,
                target_messages=target_messages,
                progress_pct=progress_pct,
                pacing_guidance=pacing_guidance,
                context=context,
                num_candidates=len(candidates),
                candidates=candidates_text,
            )
        else:
            user_prompt = self.user_template_first.format(
                target_messages=target_messages,
                num_candidates=len(candidates),
                candidates=candidates_text,
            )
        
        # Determine temperature, top_p, and max_tokens (shared with stateful).
        temperature, max_tokens, top_p = self._judge_sampling_params()

        # Build full judge prompt for logging/display
        full_judge_prompt = f"{self.system_prompt}\n\n{user_prompt}"
        
        # Get judgment from model
        result = None
        for attempt in range(self.max_retries + 1):
            try:
                if self.provider.mode == CompletionMode.CHAT:
                    result = await self.provider.complete(
                        prompt=full_judge_prompt,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                    )
                else:
                    # For completion mode, include system in prompt
                    result = await self.provider.complete(
                        prompt=f"{full_judge_prompt}\n\nSCORES:",
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                    )
                self._track(result)

                judgment = self._parse_judgment(result.text, candidates)
                judgment.judge_prompt = full_judge_prompt
                
                logger.info(
                    f"Autoloom batch judgment: best={judgment.selected_index}, "
                    f"top_score={max(judgment.scores) if judgment.scores else 0:.2f}, "
                    f"candidates_evaluated={len(candidates)}, "
                    f"progress={current_messages}/{target_messages}"
                )
                return judgment
                
            except (ValueError, TypeError) as e:
                logger.warning(f"Failed to parse judgment (attempt {attempt + 1}): {e}")
                raw = (result.text or "") if result is not None else ""
                logger.debug(f"Raw judge response: {raw[:500]}")
                if attempt == self.max_retries:
                    # Give up and reject all
                    return JudgmentResult(
                        selected_index=None,
                        selected_content=None,
                        scores=[0.0] * len(candidates),
                        reasoning=f"Parse failure after {self.max_retries + 1} attempts",
                        judge_prompt=full_judge_prompt,
                    )
        
        # Should not reach here
        return JudgmentResult(
            selected_index=None,
            selected_content=None,
            scores=[0.0] * len(candidates),
            reasoning="Unexpected error",
            judge_prompt=full_judge_prompt,
        )

    # ==================== Shared helpers ====================

    def _build_candidates_text(self, candidates: list[ChunkCandidate]) -> str:
        """Render the candidate blocks (with collapse markers) for the prompt."""
        parts = []
        for i, c in enumerate(candidates):
            collapse_note = " [CONTAINS COLLAPSE]" if c.has_collapse else ""
            parts.append(
                f"### Candidate {i + 1} ({c.line_count} lines){collapse_note}:\n"
                f"```\n{c.content}\n```"
            )
        return "\n\n".join(parts)

    def _judge_sampling_params(self) -> tuple[float, int, float]:
        """
        Resolve (temperature, max_tokens, top_p) for the judge model.

        Reasoning-capable judges get a large output budget so they can think
        AND still emit the final SCORES line without truncation; these judges
        are cheap and won't approach the ceiling on a small judging task.
        """
        use_reasoning_mode = is_reasoning_model(self.provider.model)
        top_p = self.judge_params.top_p if self.judge_params else 1.0

        if use_reasoning_mode:
            max_tokens = 16000  # ample headroom for reasoning + the answer
            if requires_temperature_one(self.provider.model):
                temperature = 1.0  # OpenAI o-series mandates temp=1.0
            else:
                # Kimi / DeepSeek R1 accept a normal judging temperature.
                temperature = self.judge_params.temperature if self.judge_params else 0.3
            logger.debug(
                f"Reasoning judge {self.provider.model}: max_tokens={max_tokens}, "
                f"temp={temperature}"
            )
        else:
            temperature = self.judge_params.temperature if self.judge_params else 0.3
            max_tokens = self.judge_params.max_tokens if self.judge_params else 800

        return temperature, max_tokens, top_p

    def _effective_system_prompt(self) -> str:
        """System prompt for the judge; in stateful mode adds the editor arc."""
        if self.stateful:
            return f"{self.system_prompt}\n\n{STATEFUL_EDITOR_ADDENDUM}"
        return self.system_prompt

    def _format_judge_memory(self, judgment: "JudgmentResult") -> str:
        """
        The compact assistant turn carried forward in stateful mode.

        We store the STRUCTURED decision (scores + pick + reasoning) rather than
        the model's raw reasoning dump: it's the durable "intent" that should
        steer later rounds, and it keeps the carried context small.
        """
        scores = ", ".join(f"{s:.2f}" for s in judgment.scores)
        best = (judgment.selected_index + 1) if judgment.selected_index is not None else 0
        return f"SCORES: [{scores}]\nBEST: {best}\nREASONING: {judgment.reasoning}"

    async def _select_best_stateful(
        self,
        context: str,
        candidates: list[ChunkCandidate],
        candidates_text: str,
        current_messages: int,
        target_messages: int,
    ) -> JudgmentResult:
        """
        Stateful judging: maintain ONE conversation across the fragment's rounds.

        Round 1 seeds [system(editor), user(opening framing + candidates)].
        Later rounds append only [user(transcript delta + new candidates)] — the
        full prior transcript is already in the conversation history, and the
        judge's own prior decisions steer the choice. On success we append a
        compact assistant memory of the decision; on terminal failure we roll
        the failed user turn back out so it can't poison later rounds.
        """
        # Seed the system turn once per fragment.
        if not self._history:
            self._history.append(
                {"role": "system", "content": self._effective_system_prompt()}
            )

        is_first_judging_turn = not any(m["role"] == "user" for m in self._history)

        if is_first_judging_turn:
            # Opening: establish the foundation. Include context only in the rare
            # case the first judged round already has accumulated transcript.
            opening = self.user_template_first.format(
                target_messages=target_messages,
                num_candidates=len(candidates),
                candidates=candidates_text,
            )
            user_text = (
                f"## Conversation so far:\n{context}\n\n{opening}" if context else opening
            )
        else:
            # Only send what's new since the judge last looked.
            if context and context.startswith(self._last_context):
                delta = context[len(self._last_context):].strip()
            else:
                delta = context.strip()  # transcript diverged; resend in full
            if not delta:
                delta = (
                    "(no new lines were accepted since your last call — the "
                    "previous round was rejected; pick a stronger continuation)"
                )
            progress_pct = (current_messages / target_messages * 100) if target_messages > 0 else 0
            user_text = JUDGE_USER_TEMPLATE_STATEFUL.format(
                current_messages=current_messages,
                target_messages=target_messages,
                progress_pct=progress_pct,
                pacing_guidance=get_pacing_guidance(current_messages, target_messages),
                delta=delta,
                num_candidates=len(candidates),
                candidates=candidates_text,
            )

        self._history.append({"role": "user", "content": user_text})

        temperature, max_tokens, top_p = self._judge_sampling_params()

        result = None
        for attempt in range(self.max_retries + 1):
            try:
                result = await self.provider.complete_chat(
                    messages=self._history,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                )
                self._track(result)
                judgment = self._parse_judgment(result.text, candidates)

                # Commit: advance the seen-context watermark and carry a compact
                # memory of the decision forward for the next round.
                self._last_context = context
                self._history.append(
                    {"role": "assistant", "content": self._format_judge_memory(judgment)}
                )
                judgment.judge_prompt = user_text

                logger.info(
                    f"Autoloom STATEFUL judgment (round turn "
                    f"{sum(1 for m in self._history if m['role'] == 'assistant')}): "
                    f"best={judgment.selected_index}, "
                    f"top_score={max(judgment.scores) if judgment.scores else 0:.2f}, "
                    f"candidates={len(candidates)}, "
                    f"progress={current_messages}/{target_messages}"
                )
                return judgment

            except (ValueError, TypeError) as e:
                logger.warning(
                    f"Failed to parse stateful judgment (attempt {attempt + 1}): {e}"
                )
                raw = (result.text or "") if result is not None else ""
                logger.debug(f"Raw judge response: {raw[:500]}")
                if attempt == self.max_retries:
                    # Roll the unanswered user turn back out so the failed round
                    # doesn't pollute the carried conversation; reject all.
                    self._history.pop()
                    return JudgmentResult(
                        selected_index=None,
                        selected_content=None,
                        scores=[0.0] * len(candidates),
                        reasoning=f"Parse failure after {self.max_retries + 1} attempts",
                        judge_prompt=user_text,
                    )

        # Unreachable, but keep the type checker and the loop invariant honest.
        self._history.pop()
        return JudgmentResult(
            selected_index=None,
            selected_content=None,
            scores=[0.0] * len(candidates),
            reasoning="Unexpected error",
            judge_prompt=user_text,
        )

    def _parse_judgment(
        self, 
        response: str, 
        candidates: list[ChunkCandidate]
    ) -> JudgmentResult:
        """
        Parse the judge's response for batch evaluation.
        
        Expected format:
        SCORES: [0.7, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.8, 0.6, 0.5]
        BEST: 5
        REASONING: Candidate 5 has the most natural flow...
        """
        num_candidates = len(candidates)

        # Guard against a null/empty judge response (e.g. provider returned no
        # content) so we raise a clean ValueError the retry loop handles, rather
        # than a TypeError from re.search(None).
        response = response or ""

        # Extract scores - handle various formats
        scores_match = re.search(
            r"SCORES:\s*\[([\d.,\s]+)\]",
            response,
            re.IGNORECASE
        )
        if not scores_match:
            # Try alternative format without brackets
            scores_match = re.search(
                r"SCORES:\s*([\d.,\s]+?)(?:\n|BEST)", 
                response, 
                re.IGNORECASE
            )
        
        if not scores_match:
            raise ValueError("Could not find SCORES in response")
        
        scores_str = scores_match.group(1)
        scores = [float(s.strip()) for s in scores_str.split(",") if s.strip()]
        
        # Pad or trim scores to match candidate count
        if len(scores) < num_candidates:
            logger.warning(f"Got {len(scores)} scores for {num_candidates} candidates, padding")
            scores.extend([0.5] * (num_candidates - len(scores)))
        elif len(scores) > num_candidates:
            scores = scores[:num_candidates]
        
        # Extract best selection
        best_match = re.search(r"BEST:\s*(\d+)", response, re.IGNORECASE)
        if not best_match:
            raise ValueError("Could not find BEST in response")
        
        best_index_1based = int(best_match.group(1))
        
        # Extract the END signal (judge wants to wrap up and collapse now).
        end_match = re.search(r"END:\s*(\w+)", response, re.IGNORECASE)
        end_requested = bool(end_match) and end_match.group(1).lower() in ("yes", "y", "true", "1")

        # Extract reasoning
        reasoning_match = re.search(
            r"REASONING:\s*(.+)",
            response,
            re.IGNORECASE | re.DOTALL
        )
        reasoning = reasoning_match.group(1).strip() if reasoning_match else ""
        # Truncate very long reasoning
        if len(reasoning) > 500:
            reasoning = reasoning[:500] + "..."
        
        # Convert to 0-indexed, None if rejected
        if best_index_1based == 0:
            selected_index = None
            selected_content = None
        elif 1 <= best_index_1based <= num_candidates:
            selected_index = best_index_1based - 1
            selected_content = candidates[selected_index].content
        else:
            # Invalid index - try to find highest scoring candidate
            logger.warning(f"Invalid BEST index {best_index_1based}, using highest score")
            max_score = max(scores)
            if max_score >= self.threshold:
                selected_index = scores.index(max_score)
                selected_content = candidates[selected_index].content
            else:
                selected_index = None
                selected_content = None
        
        # Apply threshold check - only reject if even the best is too low
        if selected_index is not None and scores[selected_index] < self.threshold:
            logger.info(
                f"Best candidate score {scores[selected_index]:.2f} below threshold "
                f"{self.threshold}, rejecting all"
            )
            selected_index = None
            selected_content = None
        
        return JudgmentResult(
            selected_index=selected_index,
            selected_content=selected_content,
            scores=scores,
            reasoning=reasoning,
            end_requested=end_requested,
        )

    async def evaluate_fragment(
        self,
        fragment_content: str,
        style: Optional[str] = None,
    ) -> tuple[float, str]:
        """
        Evaluate a complete fragment for final quality scoring.

        Used for scoring fragments after full generation, not for chunk selection.

        Args:
            fragment_content: Complete IRC-formatted fragment
            style: The channel category, so the fragment is judged against its
                OWN intended tone (eerie anomaly logs aren't penalized for not
                being "normal banter").

        Returns:
            (score, reasoning) tuple
        """
        tone = TONE_BY_STYLE.get(style or "", "")
        style_line = (
            f"\nThis channel's intended mode is **{style}** — {tone}. Judge it against THAT tone.\n"
            if tone else ""
        )
        eval_prompt = f"""You are scoring a complete fragment from a CURSED IRC channel — an art project where logs build a mood, ESCALATE, and then COLLAPSE.
{style_line}
This is NOT ordinary chit-chat. Reward fragments that commit fully to their tone and escalate to a real collapse. Eerie, glitchy, unhinged, surreal, or unsettling content is a STRENGTH, not a deduction — do NOT mark a fragment down for being strange or for not feeling like a "normal" chatroom. That strangeness is the entire point.

Score on (priority order):
- Tone & atmosphere — does it fully commit to and intensify its mood?
- Escalation & payoff — does it build to a climax and a STRONG collapse (the room actually emptying), not a limp trail-off?
- Coherence & distinct voices — even when the content is strange, is it internally consistent and are the speakers distinct?
- Authenticity — reads like a real cursed IRC log of the era, not sanitized or AI-explanatory.
- Memorability — is this a fragment worth broadcasting?

Log:
```
{fragment_content}
```

Respond with:
SCORE: (0.0 to 1.0)
REASONING: (brief explanation)"""

        # Reasoning models get headroom to think, AT temp 1.0 — counterintuitively
        # this is the STABLE setting for the whole-fragment score: dropping the
        # reasoning judge to temp 0.3 made it loop/over-think and sometimes
        # truncate before emitting SCORE (falling back to 0.5) — measured spread
        # blew out to 0.50 vs ~0.08 at temp 1.0. The ~0.08 spread is inherent
        # single-draw judge noise; average multiple draws if tighter scores are
        # needed (see note in evaluate_fragment callers).
        use_reasoning_mode = is_reasoning_model(self.provider.model)
        if use_reasoning_mode:
            temperature = 1.0
            max_tokens = 8000
        else:
            temperature = 0.2
            max_tokens = 300

        result = await self.provider.complete(
            prompt=eval_prompt,
            max_tokens=max_tokens,
            temperature=temperature,
        )
        self._track(result)

        # Parse score
        score_match = re.search(r"SCORE:\s*([\d.]+)", result.text, re.IGNORECASE)
        if score_match:
            score = float(score_match.group(1))
            score = max(0.0, min(1.0, score))  # Clamp to valid range
        else:
            score = 0.5  # Default if parse fails
        
        reasoning_match = re.search(
            r"REASONING:\s*(.+)", 
            result.text, 
            re.IGNORECASE | re.DOTALL
        )
        reasoning = reasoning_match.group(1).strip() if reasoning_match else ""
        
        return score, reasoning
