"""
OpenAI Provider

Direct OpenAI API access for both GPT models (chat) and
potential future base model access.

Supports:
- Native `n` parameter for batch completions (very efficient)
- Automatic prompt caching (OpenAI caches automatically for long prompts)
"""

import time
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


class OpenAIProvider(InferenceProvider):
    """
    OpenAI API provider.
    
    Supports:
    - Chat completions (GPT-4, GPT-3.5-turbo, o1, o3, etc.)
    - Native `n` parameter for generating multiple completions efficiently
    - Automatic prompt caching for prompts > 1024 tokens
    """
    
    def __init__(
        self,
        api_key: str,
        model: str = "gpt-4o-mini",
        mode: CompletionMode = CompletionMode.CHAT,
        base_url: Optional[str] = None,
    ):
        """
        Initialize OpenAI provider.
        
        Args:
            api_key: OpenAI API key
            model: Model identifier
            mode: CHAT for chat completions, COMPLETION for completions API
            base_url: Optional custom base URL (for Azure, etc.)
        """
        self._api_key = api_key
        self._model = model
        self._mode = mode
        self._base_url = base_url or "https://api.openai.com/v1"
        self._client = None
    
    @property
    def name(self) -> str:
        return f"openai/{self._model}"
    
    @property
    def mode(self) -> CompletionMode:
        return self._mode
    
    @property
    def model(self) -> str:
        return self._model
    
    @property
    def supports_native_n(self) -> bool:
        """OpenAI supports native n parameter for batch generation."""
        return True
    
    @property
    def supports_prompt_caching(self) -> bool:
        """OpenAI automatically caches prompts > 1024 tokens."""
        return True
    
    def _get_client(self):
        """Lazy-load the OpenAI client."""
        if self._client is None:
            try:
                from openai import AsyncOpenAI
                self._client = AsyncOpenAI(
                    api_key=self._api_key,
                    base_url=self._base_url,
                )
            except ImportError:
                raise ImportError(
                    "openai package required. Install with: pip install openai"
                )
        return self._client
    
    @rate_limit_retry
    async def complete(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> CompletionResult:
        """Generate completion using OpenAI API."""
        client = self._get_client()
        start_time = time.time()
        
        if self._mode == CompletionMode.CHAT:
            # Build kwargs, handling o3/o1 model restrictions
            kwargs = {
                "model": self._model,
                "messages": [{"role": "user", "content": prompt}],
                "max_completion_tokens": max_tokens,
            }
            
            # o3/o1 models only support temperature=1.0 and don't support stop
            is_reasoning_model = any(x in self._model for x in ["o3", "o1"])
            if not is_reasoning_model:
                kwargs["temperature"] = temperature
                if stop:
                    kwargs["stop"] = stop
            
            response = await client.chat.completions.create(**kwargs)
            
            text = response.choices[0].message.content or ""
            usage = response.usage
            
        else:
            # Base completion mode (legacy API)
            response = await client.completions.create(
                model=self._model,
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                stop=stop,
            )
            
            text = response.choices[0].text
            usage = response.usage
        
        latency = (time.time() - start_time) * 1000
        
        # Track cached tokens if available
        cached_tokens = 0
        if usage and hasattr(usage, 'prompt_tokens_details'):
            details = usage.prompt_tokens_details
            if details and hasattr(details, 'cached_tokens'):
                cached_tokens = details.cached_tokens or 0
        
        return CompletionResult(
            text=text,
            tokens_used=usage.total_tokens if usage else 0,
            tokens_prompt=usage.prompt_tokens if usage else 0,
            model=self._model,
            latency_ms=latency,
            cost_usd=self._estimate_cost(usage) if usage else None,
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
    ) -> CompletionResult:
        """
        Generate completion with prefilled assistant response.
        
        For chat mode, uses assistant message prefix.
        For base mode, appends prefill to prompt.
        """
        client = self._get_client()
        start_time = time.time()
        
        if self._mode == CompletionMode.CHAT:
            # Use assistant prefill technique
            messages = [
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": prefill},
            ]
            
            response = await client.chat.completions.create(
                model=self._model,
                messages=messages,
                max_completion_tokens=max_tokens,
                temperature=temperature,
                stop=stop,
            )
            
            # The response continues from the prefill
            continuation = response.choices[0].message.content or ""
            text = continuation  # Just the new content
            usage = response.usage
            
        else:
            # Base mode: append prefill to prompt
            full_prompt = prompt + prefill
            
            response = await client.completions.create(
                model=self._model,
                prompt=full_prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                stop=stop,
            )
            
            text = response.choices[0].text
            usage = response.usage
        
        latency = (time.time() - start_time) * 1000
        
        cached_tokens = 0
        if usage and hasattr(usage, 'prompt_tokens_details'):
            details = usage.prompt_tokens_details
            if details and hasattr(details, 'cached_tokens'):
                cached_tokens = details.cached_tokens or 0
        
        return CompletionResult(
            text=text,
            tokens_used=usage.total_tokens if usage else 0,
            tokens_prompt=usage.prompt_tokens if usage else 0,
            model=self._model,
            latency_ms=latency,
            cost_usd=self._estimate_cost(usage) if usage else None,
            cached_tokens=cached_tokens,
        )
    
    @rate_limit_retry
    async def complete_batch(
        self,
        prompt: str,
        n: int,
        max_tokens: int,
        temperature: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> BatchCompletionResult:
        """
        Generate multiple completions using native `n` parameter.
        
        This is much more efficient than making N separate API calls:
        - Single API call
        - Prompt tokens only charged once
        - Lower latency
        """
        client = self._get_client()
        start_time = time.time()
        
        if self._mode == CompletionMode.CHAT:
            response = await client.chat.completions.create(
                model=self._model,
                messages=[{"role": "user", "content": prompt}],
                max_completion_tokens=max_tokens,
                temperature=temperature,
                stop=stop,
                n=n,  # Native batch parameter!
            )
            
            texts = [
                choice.message.content or ""
                for choice in response.choices
            ]
            usage = response.usage
            
        else:
            response = await client.completions.create(
                model=self._model,
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                stop=stop,
                n=n,
            )
            
            texts = [choice.text for choice in response.choices]
            usage = response.usage
        
        latency = (time.time() - start_time) * 1000
        
        cached_tokens = 0
        if usage and hasattr(usage, 'prompt_tokens_details'):
            details = usage.prompt_tokens_details
            if details and hasattr(details, 'cached_tokens'):
                cached_tokens = details.cached_tokens or 0
        
        logger.info(
            f"OpenAI batch: {n} completions in single call, "
            f"{usage.prompt_tokens if usage else 0} prompt tokens "
            f"(cached: {cached_tokens})"
        )
        
        return BatchCompletionResult(
            texts=texts,
            tokens_used=usage.total_tokens if usage else 0,
            tokens_prompt=usage.prompt_tokens if usage else 0,
            model=self._model,
            latency_ms=latency,
            cost_usd=self._estimate_cost(usage) if usage else None,
            cached_tokens=cached_tokens,
        )
    
    @rate_limit_retry
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
        Generate multiple completions with prefill using native `n` parameter.
        """
        # Note: stable_prefix is accepted for API compatibility but not used here
        client = self._get_client()
        start_time = time.time()
        
        if self._mode == CompletionMode.CHAT:
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.extend([
                {"role": "user", "content": prompt},
                {"role": "assistant", "content": prefill},
            ])
            
            response = await client.chat.completions.create(
                model=self._model,
                messages=messages,
                max_completion_tokens=max_tokens,
                temperature=temperature,
                stop=stop,
                n=n,
            )
            
            texts = [
                choice.message.content or ""
                for choice in response.choices
            ]
            usage = response.usage
            
        else:
            full_prompt = prompt + prefill
            
            response = await client.completions.create(
                model=self._model,
                prompt=full_prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                stop=stop,
                n=n,
            )
            
            texts = [choice.text for choice in response.choices]
            usage = response.usage
        
        latency = (time.time() - start_time) * 1000
        
        cached_tokens = 0
        if usage and hasattr(usage, 'prompt_tokens_details'):
            details = usage.prompt_tokens_details
            if details and hasattr(details, 'cached_tokens'):
                cached_tokens = details.cached_tokens or 0
        
        return BatchCompletionResult(
            texts=texts,
            tokens_used=usage.total_tokens if usage else 0,
            tokens_prompt=usage.prompt_tokens if usage else 0,
            model=self._model,
            latency_ms=latency,
            cost_usd=self._estimate_cost(usage) if usage else None,
            cached_tokens=cached_tokens,
        )
    
    def _estimate_cost(self, usage) -> float:
        """Estimate cost based on token usage."""
        # OpenAI pricing per 1K tokens (as of 2025)
        # Format: (input_cost, output_cost) per 1K tokens
        # Source: https://openai.com/api/pricing/
        COSTS_PER_1K = {
            # GPT-4o family
            "gpt-4o": (0.0025, 0.01),
            "gpt-4o-2024-11-20": (0.0025, 0.01),
            "gpt-4o-2024-08-06": (0.0025, 0.01),
            "gpt-4o-mini": (0.00015, 0.0006),
            "gpt-4o-mini-2024-07-18": (0.00015, 0.0006),
            # GPT-4 Turbo
            "gpt-4-turbo": (0.01, 0.03),
            "gpt-4-turbo-2024-04-09": (0.01, 0.03),
            # GPT-4
            "gpt-4": (0.03, 0.06),
            "gpt-4-0613": (0.03, 0.06),
            # GPT-3.5
            "gpt-3.5-turbo": (0.0005, 0.0015),
            "gpt-3.5-turbo-0125": (0.0005, 0.0015),
            # o1 reasoning models
            "o1": (0.015, 0.06),
            "o1-2024-12-17": (0.015, 0.06),
            "o1-preview": (0.015, 0.06),
            "o1-mini": (0.003, 0.012),
            "o1-mini-2024-09-12": (0.003, 0.012),
            # o3 reasoning models (2025 pricing)
            "o3": (0.01, 0.04),
            "o3-2025-04-16": (0.01, 0.04),
            "o3-mini": (0.0011, 0.0044),
            "o3-mini-2025-01-31": (0.0011, 0.0044),
        }
        
        # Try exact match first, then prefix match
        input_cost, output_cost = COSTS_PER_1K.get(self._model, (None, None))
        if input_cost is None:
            # Try prefix matching for versioned models
            for model_prefix, costs in COSTS_PER_1K.items():
                if self._model.startswith(model_prefix.split("-")[0]):
                    input_cost, output_cost = costs
                    break
            else:
                input_cost, output_cost = (0.001, 0.002)  # Conservative fallback
        
        prompt_tokens = usage.prompt_tokens if usage else 0
        completion_tokens = usage.completion_tokens if usage else 0
        
        # Account for cached token discount
        cached_tokens = 0
        if hasattr(usage, 'prompt_tokens_details'):
            details = usage.prompt_tokens_details
            if details and hasattr(details, 'cached_tokens'):
                cached_tokens = details.cached_tokens or 0
        
        uncached_input = prompt_tokens - cached_tokens
        
        return (
            (uncached_input / 1000) * input_cost +
            (cached_tokens / 1000) * input_cost * 0.5 +  # 50% discount
            (completion_tokens / 1000) * output_cost
        )
