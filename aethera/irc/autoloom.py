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
# o3/o1 models require temperature=1.0 and much higher max_tokens
# because reasoning tokens count against the limit

REASONING_MODEL_PATTERNS = ["o3", "o1-", "o1:"]


def is_reasoning_model(model_name: str) -> bool:
    """Check if a model is a reasoning model that needs special handling."""
    model_lower = model_name.lower()
    return any(pattern in model_lower for pattern in REASONING_MODEL_PATTERNS)


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


# Batch judge system prompt - emphasizes that winner continues the story
JUDGE_SYSTEM_PROMPT = """You are evaluating snippets of simulated IRC chat logs for a progressive story generation system.

IMPORTANT: The candidate you rate highest will be selected to CONTINUE the conversation. Your choice directly determines which narrative branch the story follows. Choose the candidate with the most interesting potential for continuation.

Evaluation criteria:
1. **Coherence**: Does the conversation flow naturally from the context? Do responses make sense?
2. **Voice distinctiveness**: Do different nicks sound like different people with their own personalities?
3. **Authenticity**: Does it feel like real IRC banter, not AI-generated? No overly formal language, no "As an AI" patterns.
4. **Momentum**: Does the conversation have energy and direction? Is there something to build on?
5. **Story potential**: Which continuation opens the most interesting possibilities for what comes next?

You will see multiple candidates (typically 10-12). Evaluate them ALL and select the one with the best potential for the story to continue from.

Respond in this exact format:
SCORES: [score1, score2, score3, ...] (each 0.0 to 1.0, one per candidate)
BEST: N (the 1-indexed number of the best candidate, or 0 if ALL are too bad to continue)
REASONING: (brief explanation of why the winner was chosen)

Only set BEST to 0 if genuinely no candidate is salvageable (scores all below 0.4)."""


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
    
    if progress_pct < 30:
        return "We're in the OPENING phase. Favor candidates that establish interesting dynamics and characters."
    elif progress_pct < 70:
        return "We're in the MIDDLE phase. Favor candidates that develop the conversation naturally."
    elif progress_pct < 90:
        return f"We're APPROACHING THE END ({remaining} messages left). Favor candidates that start steering toward a natural conclusion."
    else:
        return f"We're at the END ({remaining} messages left). Favor candidates that bring the conversation to a satisfying collapse/ending."


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
        """
        self.provider = judge_provider
        self.threshold = threshold
        self.max_retries = max_retries
        
        # Custom prompts (None = use defaults)
        self.system_prompt = custom_system_prompt or JUDGE_SYSTEM_PROMPT
        self.user_template = custom_user_template or JUDGE_USER_TEMPLATE_CONTINUATION
        self.user_template_first = custom_user_template_first or JUDGE_USER_TEMPLATE_FIRST
        
        # Judge inference params (None = use defaults)
        self.judge_params = judge_params
        
        # Validate provider mode
        if self.provider.mode != CompletionMode.CHAT:
            logger.warning(
                f"Judge provider is {self.provider.mode.value} mode, "
                "but CHAT mode is recommended for judging"
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
            )
        
        # Build candidates text with collapse markers
        candidates_parts = []
        for i, c in enumerate(candidates):
            collapse_note = " [CONTAINS COLLAPSE]" if c.has_collapse else ""
            candidates_parts.append(
                f"### Candidate {i + 1} ({c.line_count} lines){collapse_note}:\n```\n{c.content}\n```"
            )
        candidates_text = "\n\n".join(candidates_parts)
        
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
        
        # Determine temperature, top_p, and max_tokens
        # Use user-configured params if provided, with defaults as fallback
        # Reasoning models (o3, o1) require temp=1.0 and need much more tokens
        use_reasoning_mode = is_reasoning_model(self.provider.model)
        
        if use_reasoning_mode:
            # Reasoning models MUST use temp=1.0 (API requirement)
            temperature = 1.0
            max_tokens = 16000  # Reasoning models need headroom for thinking
            top_p = self.judge_params.top_p if self.judge_params else 1.0
            logger.debug(f"Using reasoning model settings for {self.provider.model} (temp forced to 1.0)")
        else:
            # Use user-configured params or defaults
            temperature = self.judge_params.temperature if self.judge_params else 0.3
            max_tokens = self.judge_params.max_tokens if self.judge_params else 800
            top_p = self.judge_params.top_p if self.judge_params else 1.0
        
        # Get judgment from model
        for attempt in range(self.max_retries + 1):
            try:
                if self.provider.mode == CompletionMode.CHAT:
                    result = await self.provider.complete(
                        prompt=f"{self.system_prompt}\n\n{user_prompt}",
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                    )
                else:
                    # For completion mode, include system in prompt
                    result = await self.provider.complete(
                        prompt=f"{self.system_prompt}\n\n{user_prompt}\n\nSCORES:",
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                    )
                
                judgment = self._parse_judgment(result.text, candidates)
                
                logger.info(
                    f"Autoloom batch judgment: best={judgment.selected_index}, "
                    f"top_score={max(judgment.scores) if judgment.scores else 0:.2f}, "
                    f"candidates_evaluated={len(candidates)}, "
                    f"progress={current_messages}/{target_messages}"
                )
                return judgment
                
            except ValueError as e:
                logger.warning(f"Failed to parse judgment (attempt {attempt + 1}): {e}")
                logger.debug(f"Raw response: {result.text[:500]}...")
                if attempt == self.max_retries:
                    # Give up and reject all
                    return JudgmentResult(
                        selected_index=None,
                        selected_content=None,
                        scores=[0.0] * len(candidates),
                        reasoning=f"Parse failure after {self.max_retries + 1} attempts",
                    )
        
        # Should not reach here
        return JudgmentResult(
            selected_index=None,
            selected_content=None,
            scores=[0.0] * len(candidates),
            reasoning="Unexpected error",
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
        )
    
    async def evaluate_fragment(
        self,
        fragment_content: str,
    ) -> tuple[float, str]:
        """
        Evaluate a complete fragment for final quality scoring.
        
        Used for scoring fragments after full generation, not for chunk selection.
        
        Args:
            fragment_content: Complete IRC-formatted fragment
            
        Returns:
            (score, reasoning) tuple
        """
        eval_prompt = f"""Evaluate this complete IRC chat log fragment for quality.

Criteria:
- Coherence and natural flow
- Voice distinctiveness between nicks
- Authenticity (feels like real IRC, not AI)
- Interesting content or dynamics
- Clean ending (natural conclusion or dramatic collapse)

Log:
```
{fragment_content}
```

Respond with:
SCORE: (0.0 to 1.0)
REASONING: (brief explanation)"""

        # Reasoning models need different settings
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
