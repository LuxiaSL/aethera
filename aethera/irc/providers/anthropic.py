"""
Anthropic Provider

Claude API access for generation and judging.
Supports prompt caching via beta API for cost efficiency.

Prompt Caching (https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching):
- Requires beta header: prompt-caching-2024-07-31
- Uses cache_control breakpoints in message content
- Cache writes: 1.25x input cost
- Cache reads: 0.1x input cost (90% savings!)
- Minimum 1024 tokens to cache
- 5-minute TTL by default
"""

import time
import asyncio
import logging
from typing import Optional

from .base import (
    InferenceProvider, 
    CompletionResult, 
    BatchCompletionResult,
    CompletionMode,
)
from ..utils.retry import rate_limit_retry

logger = logging.getLogger(__name__)


class AnthropicProvider(InferenceProvider):
    """
    Anthropic Claude API provider with prompt caching support.
    
    Claude models use the Messages API which is chat-based,
    but supports:
    - Prefill for assistant responses
    - Prompt caching via beta API (significant cost savings)
    
    Note: Anthropic does NOT support `n` parameter for multiple completions.
    Batch completions use parallel API calls, but benefit from prompt caching.
    """
    
    # Beta feature flag for prompt caching
    PROMPT_CACHING_BETA = "prompt-caching-2024-07-31"
    
    def __init__(
        self,
        api_key: str,
        model: str = "claude-3-5-sonnet-20241022",
        enable_caching: bool = True,
    ):
        """
        Initialize Anthropic provider.
        
        Args:
            api_key: Anthropic API key
            model: Model identifier (e.g., claude-3-5-sonnet-20241022)
            enable_caching: Whether to use prompt caching (recommended)
        """
        self._api_key = api_key
        self._model = model
        self._enable_caching = enable_caching
        self._client = None
    
    @property
    def name(self) -> str:
        return f"anthropic/{self._model}"
    
    @property
    def mode(self) -> CompletionMode:
        return CompletionMode.CHAT
    
    @property
    def model(self) -> str:
        return self._model
    
    @property
    def supports_native_n(self) -> bool:
        """Anthropic does NOT support n parameter."""
        return False
    
    @property
    def supports_prompt_caching(self) -> bool:
        """Anthropic supports caching via beta API."""
        return self._enable_caching
    
    def _get_client(self):
        """Lazy-load the Anthropic client."""
        if self._client is None:
            try:
                from anthropic import AsyncAnthropic
                self._client = AsyncAnthropic(api_key=self._api_key)
            except ImportError:
                raise ImportError(
                    "anthropic package required. Install with: pip install anthropic"
                )
        return self._client
    
    def _build_cached_content(self, text: str, variable_suffix: str = None) -> list[dict]:
        """
        Build content array with cache_control for prompt caching.
        
        If variable_suffix is provided, the main text is cached (stable prefix)
        and the suffix is appended without caching (variable part).
        
        Args:
            text: The stable prefix to cache
            variable_suffix: Optional variable content to append (not cached)
        """
        if self._enable_caching:
            content = [
                {
                    "type": "text",
                    "text": text,
                    "cache_control": {"type": "ephemeral"},  # Cache breakpoint
                }
            ]
            if variable_suffix:
                content.append({
                    "type": "text",
                    "text": variable_suffix,
                    # No cache_control - this is the variable part
                })
            return content
        
        # No caching - just combine
        full_text = text + (variable_suffix or "")
        return [{"type": "text", "text": full_text}]
    
    @rate_limit_retry
    async def complete(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float = 1.0,
        stop: Optional[list[str]] = None,
        system: Optional[str] = None,
        stable_prefix: Optional[str] = None,
    ) -> CompletionResult:
        """
        Generate completion using Anthropic API with caching.
        
        Args:
            prompt: The prompt (or variable suffix if stable_prefix provided)
            max_tokens: Max tokens to generate
            temperature: Sampling temperature
            stop: Stop sequences
            system: Optional system prompt
            stable_prefix: Optional stable prefix to cache separately
                          If provided, this is cached and prompt is appended without caching
        """
        client = self._get_client()
        start_time = time.time()
        
        # Build message with optional prefix caching
        if stable_prefix:
            # stable_prefix is cached, prompt is the variable part
            messages = [{
                "role": "user",
                "content": self._build_cached_content(stable_prefix, variable_suffix=prompt),
            }]
        else:
            # No prefix splitting - just use prompt as-is
            messages = [{
                "role": "user",
                "content": prompt,
            }]
        
        # System prompt - cache if caching is enabled
        kwargs = {}
        if system:
            if self._enable_caching:
                kwargs["system"] = [
                    {
                        "type": "text",
                        "text": system,
                        "cache_control": {"type": "ephemeral"},
                    }
                ]
            else:
                kwargs["system"] = system
        
        if self._enable_caching:
            # Use beta API for prompt caching
            response = await client.beta.messages.create(
                model=self._model,
                max_tokens=max_tokens,
                temperature=temperature,
                stop_sequences=stop or [],
                messages=messages,
                betas=[self.PROMPT_CACHING_BETA],
                **kwargs,
            )
        else:
            response = await client.messages.create(
                model=self._model,
                max_tokens=max_tokens,
                temperature=temperature,
                stop_sequences=stop or [],
                messages=messages,
                **kwargs,
            )
        
        text = response.content[0].text if response.content else ""
        latency = (time.time() - start_time) * 1000
        
        # Extract cache info
        cached_tokens = 0
        if hasattr(response.usage, 'cache_read_input_tokens'):
            cached_tokens = response.usage.cache_read_input_tokens or 0
        
        cache_created = 0
        if hasattr(response.usage, 'cache_creation_input_tokens'):
            cache_created = response.usage.cache_creation_input_tokens or 0
        
        if cached_tokens > 0:
            logger.debug(f"Anthropic cache hit: {cached_tokens} tokens read from cache")
        if cache_created > 0:
            logger.debug(f"Anthropic cache write: {cache_created} tokens written to cache")
        
        return CompletionResult(
            text=text,
            tokens_used=response.usage.input_tokens + response.usage.output_tokens,
            tokens_prompt=response.usage.input_tokens,
            model=self._model,
            latency_ms=latency,
            cost_usd=self._estimate_cost(response.usage),
            cached_tokens=cached_tokens,
        )
    
    @rate_limit_retry
    async def complete_with_prefill(
        self,
        prompt: str,
        prefill: str,
        max_tokens: int,
        temperature: float = 1.0,
        stop: Optional[list[str]] = None,
        system: Optional[str] = None,
        stable_prefix: Optional[str] = None,
    ) -> CompletionResult:
        """
        Generate completion with prefilled assistant response.
        
        Claude natively supports this via the messages API.
        
        Args:
            prompt: The prompt (or variable suffix if stable_prefix provided)
            prefill: Assistant message to continue from
            max_tokens: Max tokens to generate
            temperature: Sampling temperature
            stop: Stop sequences
            system: Optional system prompt
            stable_prefix: Optional stable prefix to cache separately
        """
        client = self._get_client()
        start_time = time.time()
        
        # Build message with optional prefix caching
        if stable_prefix:
            # stable_prefix is cached, prompt is the variable part
            user_content = self._build_cached_content(stable_prefix, variable_suffix=prompt)
        else:
            # Cache the whole prompt for within-batch reuse
            user_content = self._build_cached_content(prompt)
        
        messages = [
            {
                "role": "user",
                "content": user_content,
            },
            {
                "role": "assistant",
                "content": prefill,
            },
        ]
        
        # System prompt - cache if enabled
        kwargs = {}
        if system:
            if self._enable_caching:
                kwargs["system"] = [
                    {
                        "type": "text",
                        "text": system,
                        "cache_control": {"type": "ephemeral"},
                    }
                ]
            else:
                kwargs["system"] = system
        
        if self._enable_caching:
            response = await client.beta.messages.create(
                model=self._model,
                max_tokens=max_tokens,
                temperature=temperature,
                stop_sequences=stop or [],
                messages=messages,
                betas=[self.PROMPT_CACHING_BETA],
                **kwargs,
            )
        else:
            response = await client.messages.create(
                model=self._model,
                max_tokens=max_tokens,
                temperature=temperature,
                stop_sequences=stop or [],
                messages=messages,
                **kwargs,
            )
        
        text = response.content[0].text if response.content else ""
        latency = (time.time() - start_time) * 1000
        
        cached_tokens = 0
        if hasattr(response.usage, 'cache_read_input_tokens'):
            cached_tokens = response.usage.cache_read_input_tokens or 0
        
        return CompletionResult(
            text=text,
            tokens_used=response.usage.input_tokens + response.usage.output_tokens,
            tokens_prompt=response.usage.input_tokens,
            model=self._model,
            latency_ms=latency,
            cost_usd=self._estimate_cost(response.usage),
            cached_tokens=cached_tokens,
        )
    
    async def complete_batch(
        self,
        prompt: str,
        n: int,
        max_tokens: int,
        temperature: float = 1.0,
        stop: Optional[list[str]] = None,
        system: Optional[str] = None,
        stable_prefix: Optional[str] = None,
    ) -> BatchCompletionResult:
        """
        Generate multiple completions in parallel.
        
        With prompt caching enabled, the first request writes the cache,
        subsequent parallel requests read from cache (90% cost savings).
        
        If stable_prefix is provided, it's cached and prompt is the variable part.
        This enables cross-chunk cache reuse for the stable portion.
        """
        start_time = time.time()
        
        # Run all completions in parallel
        # First one writes cache, rest read from cache
        tasks = [
            self.complete(prompt, max_tokens, temperature, stop, system, stable_prefix)
            for _ in range(n)
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        texts = []
        total_tokens = 0
        prompt_tokens = 0
        total_cost = 0.0
        cached = 0
        
        for r in results:
            if isinstance(r, CompletionResult):
                texts.append(r.text)
                total_tokens += r.tokens_used
                prompt_tokens = r.tokens_prompt
                if r.cost_usd:
                    total_cost += r.cost_usd
                cached += r.cached_tokens
        
        latency = (time.time() - start_time) * 1000
        
        if cached > 0:
            logger.info(f"Anthropic batch: {cached} total tokens from cache across {n} requests")
        
        return BatchCompletionResult(
            texts=texts,
            tokens_used=total_tokens,
            tokens_prompt=prompt_tokens,
            model=self._model,
            latency_ms=latency,
            cost_usd=total_cost if total_cost > 0 else None,
            cached_tokens=cached,
        )
    
    async def complete_batch_with_prefill(
        self,
        prompt: str,
        prefill: str,
        n: int,
        max_tokens: int,
        temperature: float = 1.0,
        stop: Optional[list[str]] = None,
        system: Optional[str] = None,
        stable_prefix: Optional[str] = None,
    ) -> BatchCompletionResult:
        """
        Generate multiple completions with prefill, using caching.
        
        If stable_prefix is provided, it's cached and prompt is the variable part.
        """
        start_time = time.time()
        
        tasks = [
            self.complete_with_prefill(prompt, prefill, max_tokens, temperature, stop, system, stable_prefix)
            for _ in range(n)
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        texts = []
        total_tokens = 0
        prompt_tokens = 0
        total_cost = 0.0
        cached = 0
        
        for r in results:
            if isinstance(r, CompletionResult):
                texts.append(r.text)
                total_tokens += r.tokens_used
                prompt_tokens = r.tokens_prompt
                if r.cost_usd:
                    total_cost += r.cost_usd
                cached += r.cached_tokens
        
        latency = (time.time() - start_time) * 1000
        
        if cached > 0:
            logger.info(f"Anthropic batch: {cached} total tokens from cache")
        
        return BatchCompletionResult(
            texts=texts,
            tokens_used=total_tokens,
            tokens_prompt=prompt_tokens,
            model=self._model,
            latency_ms=latency,
            cost_usd=total_cost if total_cost > 0 else None,
            cached_tokens=cached,
        )
    
    def _estimate_cost(self, usage) -> float:
        """
        Estimate cost based on token usage, accounting for caching.
        
        Cache pricing:
        - Cache writes: 1.25x input cost
        - Cache reads: 0.1x input cost (90% off!)
        
        Source: https://www.anthropic.com/pricing
        """
        # Anthropic pricing per 1K tokens (as of 2025)
        # Format: (input_cost, output_cost) per 1K tokens
        COSTS_PER_1K = {
            # Claude 4 family (2025)
            "claude-opus-4-5-20251101": (0.005, 0.025),   # $5/$25 per MTok
            "claude-opus-4-20250514": (0.015, 0.075),     # Opus 4.0
            "claude-sonnet-4-20250514": (0.003, 0.015),   # Sonnet 4.0
            # Claude 3.5 family
            "claude-3-5-sonnet-20241022": (0.003, 0.015),
            "claude-3-5-sonnet-latest": (0.003, 0.015),
            "claude-3-5-haiku-20241022": (0.0008, 0.004), # $0.80/$4 per MTok
            "claude-3-5-haiku-latest": (0.0008, 0.004),
            # Claude 3 family (legacy)
            "claude-3-opus-20240229": (0.015, 0.075),
            "claude-3-opus-latest": (0.015, 0.075),
            "claude-3-sonnet-20240229": (0.003, 0.015),
            "claude-3-haiku-20240307": (0.00025, 0.00125),
        }
        
        # Try exact match first, then prefix match
        input_cost, output_cost = COSTS_PER_1K.get(self._model, (None, None))
        if input_cost is None:
            # Try prefix matching for versioned models
            for model_prefix, costs in COSTS_PER_1K.items():
                base_prefix = model_prefix.rsplit("-", 1)[0]  # Remove date suffix
                if self._model.startswith(base_prefix):
                    input_cost, output_cost = costs
                    break
            else:
                input_cost, output_cost = (0.003, 0.015)  # Default to Sonnet pricing
        
        # Extract cache stats
        cached_read = getattr(usage, 'cache_read_input_tokens', 0) or 0
        cached_write = getattr(usage, 'cache_creation_input_tokens', 0) or 0
        uncached_input = usage.input_tokens - cached_read - cached_write
        
        return (
            (uncached_input / 1000) * input_cost +
            (cached_write / 1000) * input_cost * 1.25 +  # 25% premium for writes
            (cached_read / 1000) * input_cost * 0.1 +    # 90% discount for reads
            (usage.output_tokens / 1000) * output_cost
        )
