"""
OpenRouter Inference Provider

Supports many models via unified API. Works with both base and instruct models.

Prompt Caching Support (https://openrouter.ai/docs/guides/best-practices/prompt-caching):
- OpenAI models: Automatic (1024 token minimum)
- Anthropic/Claude models: Requires cache_control breakpoints
- DeepSeek: Automatic
- Google Gemini: Requires cache_control breakpoints
- Grok, Moonshot, Groq: Automatic

Note: `n` parameter support is model-dependent.
"""

import time
import logging
from typing import Optional
import httpx

from .base import (
    InferenceProvider, 
    CompletionMode, 
    CompletionResult,
    BatchCompletionResult,
)
from ..utils.retry import rate_limit_retry

logger = logging.getLogger(__name__)


class OpenRouterProvider(InferenceProvider):
    """
    OpenRouter API provider.
    
    OpenRouter provides access to many models through a unified API.
    Supports both completion and chat endpoints.
    
    Prompt Caching:
    - Automatic for: OpenAI, DeepSeek, Grok, Moonshot, Groq models
    - Manual (cache_control) for: Anthropic, Gemini models
    
    OpenRouter will route to the same provider when possible to utilize
    warm cache.
    """
    
    BASE_URL = "https://openrouter.ai/api/v1"
    
    # Models that need explicit cache_control for caching
    MANUAL_CACHE_MODELS = ["anthropic", "claude", "gemini", "google"]
    
    # Models that have automatic caching
    AUTO_CACHE_MODELS = ["openai", "gpt", "deepseek", "grok", "moonshot", "groq"]
    
    def __init__(
        self,
        api_key: str,
        model: str,
        mode: CompletionMode = CompletionMode.CHAT,
        site_url: Optional[str] = None,
        site_name: Optional[str] = None,
        enable_caching: bool = True,
    ):
        """
        Initialize OpenRouter provider.
        
        Args:
            api_key: OpenRouter API key
            model: Model identifier (e.g., "meta-llama/llama-3-70b")
            mode: Whether to use completion or chat API
            site_url: Optional site URL for rankings
            site_name: Optional site name for rankings
            enable_caching: Whether to enable prompt caching where supported
        """
        self._api_key = api_key
        self._model = model
        self._mode = mode
        self._site_url = site_url
        self._site_name = site_name
        self._enable_caching = enable_caching
        self._client: Optional[httpx.AsyncClient] = None
        self._n_supported: Optional[bool] = None
    
    @property
    def name(self) -> str:
        return f"openrouter/{self._model}"
    
    @property
    def mode(self) -> CompletionMode:
        return self._mode
    
    @property
    def model(self) -> str:
        return self._model
    
    @property
    def supports_native_n(self) -> bool:
        """n support is model-dependent."""
        if self._n_supported is not None:
            return self._n_supported
        model_lower = self._model.lower()
        # OpenAI models typically support n
        if any(x in model_lower for x in ["openai", "gpt", "o1", "o3"]):
            return True
        # These don't support n on OpenRouter
        if any(x in model_lower for x in ["anthropic", "claude", "llama", "meta-llama", "mistral", "gemini"]):
            return False
        return False  # Default to parallel calls (safer)
    
    @property
    def supports_prompt_caching(self) -> bool:
        """OpenRouter supports caching for many models."""
        return self._enable_caching
    
    def _needs_manual_cache_control(self) -> bool:
        """Check if this model needs explicit cache_control."""
        model_lower = self._model.lower()
        return any(x in model_lower for x in self.MANUAL_CACHE_MODELS)
    
    def _build_cached_content(self, text: str) -> list[dict]:
        """
        Build content array with cache_control for models that need it.
        
        Uses ephemeral caching with default 5-minute TTL.
        """
        if self._enable_caching and self._needs_manual_cache_control():
            return [
                {
                    "type": "text",
                    "text": text,
                    "cache_control": {"type": "ephemeral"},
                }
            ]
        return text  # Simple string for auto-cache models
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create HTTP client."""
        if self._client is None:
            headers = {
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json",
            }
            if self._site_url:
                headers["HTTP-Referer"] = self._site_url
            if self._site_name:
                headers["X-Title"] = self._site_name
            
            self._client = httpx.AsyncClient(
                base_url=self.BASE_URL,
                headers=headers,
                timeout=120.0,
            )
        return self._client
    
    async def complete(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> CompletionResult:
        """Generate completion."""
        return await self._do_completion(
            prompt=prompt,
            prefill=None,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p,
            stop=stop,
        )
    
    async def complete_with_prefill(
        self,
        prompt: str,
        prefill: str,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> CompletionResult:
        """Generate completion with prefill."""
        return await self._do_completion(
            prompt=prompt,
            prefill=prefill,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p,
            stop=stop,
        )
    
    async def complete_batch(
        self,
        prompt: str,
        n: int,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> BatchCompletionResult:
        """Generate multiple completions."""
        if self.supports_native_n:
            try:
                return await self._do_batch_completion_native(
                    prompt=prompt,
                    prefill=None,
                    n=n,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    stop=stop,
                )
            except Exception as e:
                logger.warning(f"Native n failed for {self._model}, falling back: {e}")
                self._n_supported = False
        
        return await super().complete_batch(prompt, n, max_tokens, temperature, top_p, stop)
    
    def _is_anthropic_model(self) -> bool:
        """Check if current model is an Anthropic model (supports stable_prefix caching)."""
        model_lower = self._model.lower()
        return "anthropic" in model_lower or "claude" in model_lower
    
    async def complete_batch_with_prefill(
        self,
        prompt: str,
        prefill: str,
        n: int,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
        system: Optional[str] = None,
        stable_prefix: Optional[str] = None,
    ) -> BatchCompletionResult:
        """Generate multiple completions with prefill."""
        # For Anthropic models, combine stable_prefix with prompt for caching
        effective_prompt = prompt
        if stable_prefix and self._is_anthropic_model():
            effective_prompt = stable_prefix + prompt
            logger.debug(f"OpenRouter Anthropic: using stable_prefix ({len(stable_prefix)} chars) + prompt ({len(prompt)} chars)")
        
        if self.supports_native_n:
            try:
                return await self._do_batch_completion_native(
                    prompt=effective_prompt,
                    prefill=prefill,
                    n=n,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    stop=stop,
                    system=system,
                    stable_prefix=stable_prefix,  # Pass for cache_control marking
                )
            except Exception as e:
                logger.warning(f"Native n failed for {self._model}, falling back: {e}")
                self._n_supported = False
        
        return await super().complete_batch_with_prefill(
            effective_prompt, prefill, n, max_tokens, temperature, top_p, stop
        )
    
    @rate_limit_retry
    async def _do_completion(
        self,
        prompt: str,
        prefill: Optional[str],
        max_tokens: int,
        temperature: float,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
        system: Optional[str] = None,
        stable_prefix: Optional[str] = None,
    ) -> CompletionResult:
        """Internal completion implementation with caching support."""
        client = await self._get_client()
        start_time = time.perf_counter()
        
        if self._mode == CompletionMode.COMPLETION:
            full_prompt = prompt
            if prefill:
                full_prompt = prompt + prefill
            
            payload = {
                "model": self._model,
                "prompt": full_prompt,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": top_p,
            }
            if stop:
                payload["stop"] = stop
            
            response = await client.post("/completions", json=payload)
            response.raise_for_status()
            data = response.json()
            
            text = data["choices"][0]["text"]
            usage = data.get("usage", {})
            
        else:
            # Build messages with optional system prompt
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            
            # For Anthropic models with stable_prefix: use cache_control
            if stable_prefix and self._is_anthropic_model() and self._needs_manual_cache_control():
                user_content = [
                    {
                        "type": "text",
                        "text": stable_prefix,
                        "cache_control": {"type": "ephemeral"}
                    },
                    {
                        "type": "text",
                        "text": prompt[len(stable_prefix):] if prompt.startswith(stable_prefix) else prompt
                    }
                ]
            else:
                user_content = self._build_cached_content(prompt)
            
            messages.append({"role": "user", "content": user_content})
            
            if prefill:
                messages.append({"role": "assistant", "content": prefill})
            
            payload = {
                "model": self._model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": top_p,
            }
            if stop:
                payload["stop"] = stop
            
            # Request usage info to see cache stats
            payload["usage"] = {"include": True}
            
            response = await client.post("/chat/completions", json=payload)
            response.raise_for_status()
            data = response.json()
            
            text = data["choices"][0]["message"]["content"]
            usage = data.get("usage", {})
            
            if prefill and text.startswith(prefill):
                text = text[len(prefill):]
        
        latency_ms = (time.perf_counter() - start_time) * 1000
        
        # Extract cache info if available
        cached_tokens = usage.get("cache_read_input_tokens", 0) or 0
        cache_discount = data.get("cache_discount", 0)
        
        if cached_tokens > 0:
            logger.debug(f"OpenRouter cache hit: {cached_tokens} tokens, discount: {cache_discount}")
        
        return CompletionResult(
            text=text,
            tokens_used=usage.get("total_tokens", 0),
            tokens_prompt=usage.get("prompt_tokens", 0),
            model=self._model,
            latency_ms=latency_ms,
            cost_usd=self._estimate_cost(usage),
            cached_tokens=cached_tokens,
        )
    
    @rate_limit_retry
    async def _do_batch_completion_native(
        self,
        prompt: str,
        prefill: Optional[str],
        n: int,
        max_tokens: int,
        temperature: float,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
        system: Optional[str] = None,
        stable_prefix: Optional[str] = None,
    ) -> BatchCompletionResult:
        """Batch completion with native n parameter."""
        client = await self._get_client()
        start_time = time.perf_counter()
        
        if self._mode == CompletionMode.COMPLETION:
            full_prompt = prompt
            if prefill:
                full_prompt = prompt + prefill
            
            payload = {
                "model": self._model,
                "prompt": full_prompt,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": top_p,
                "n": n,
            }
            if stop:
                payload["stop"] = stop
            
            response = await client.post("/completions", json=payload)
            response.raise_for_status()
            data = response.json()
            
            texts = [choice["text"] for choice in data["choices"]]
            usage = data.get("usage", {})
            
        else:
            # Build messages with optional system prompt
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            
            # For Anthropic models with stable_prefix: use cache_control to mark cacheable portion
            if stable_prefix and self._is_anthropic_model() and self._needs_manual_cache_control():
                # Build user content with cache_control on the stable portion
                user_content = [
                    {
                        "type": "text",
                        "text": stable_prefix,
                        "cache_control": {"type": "ephemeral"}
                    },
                    {
                        "type": "text",
                        "text": prompt[len(stable_prefix):] if prompt.startswith(stable_prefix) else prompt
                    }
                ]
                logger.debug(f"OpenRouter Anthropic: cache_control on {len(stable_prefix)} chars")
            else:
                user_content = self._build_cached_content(prompt)
            
            messages.append({"role": "user", "content": user_content})
            
            if prefill:
                messages.append({"role": "assistant", "content": prefill})
            
            payload = {
                "model": self._model,
                "messages": messages,
                "max_tokens": max_tokens,
                "temperature": temperature,
                "top_p": top_p,
                "n": n,
                "usage": {"include": True},
            }
            if stop:
                payload["stop"] = stop
            
            response = await client.post("/chat/completions", json=payload)
            response.raise_for_status()
            data = response.json()
            
            texts = []
            for choice in data["choices"]:
                text = choice["message"]["content"]
                if prefill and text.startswith(prefill):
                    text = text[len(prefill):]
                texts.append(text)
            
            usage = data.get("usage", {})
        
        latency_ms = (time.perf_counter() - start_time) * 1000
        
        # Verify we got the expected number of results
        # Some models silently ignore n and return only 1 result
        if len(texts) < n:
            logger.warning(
                f"OpenRouter: requested {n} completions but got {len(texts)} - "
                f"model {self._model} may not support n parameter"
            )
            raise ValueError(f"Expected {n} completions, got {len(texts)}")
        
        self._n_supported = True
        
        cached_tokens = usage.get("cache_read_input_tokens", 0) or 0
        
        logger.info(
            f"OpenRouter batch: {n} completions via native n, "
            f"{usage.get('prompt_tokens', 0)} prompt tokens"
            f"{f', {cached_tokens} cached' if cached_tokens else ''}"
        )
        
        return BatchCompletionResult(
            texts=texts,
            tokens_used=usage.get("total_tokens", 0),
            tokens_prompt=usage.get("prompt_tokens", 0),
            model=self._model,
            latency_ms=latency_ms,
            cost_usd=self._estimate_cost(usage),
            cached_tokens=cached_tokens,
        )
    
    async def close(self) -> None:
        """Close HTTP client."""
        if self._client:
            await self._client.aclose()
            self._client = None
    
    def _estimate_cost(self, usage: dict) -> float:
        """
        Estimate cost based on token usage.
        
        OpenRouter pricing varies by model - these are common models.
        For most accurate costs, check your OpenRouter dashboard.
        Source: https://openrouter.ai/models
        """
        # Pricing per 1K tokens (input, output) - common OpenRouter models
        COSTS_PER_1K = {
            # Anthropic via OpenRouter
            "anthropic/claude-3-opus": (0.015, 0.075),
            "anthropic/claude-3-opus:beta": (0.015, 0.075),
            "anthropic/claude-3-sonnet": (0.003, 0.015),
            "anthropic/claude-3.5-sonnet": (0.003, 0.015),
            "anthropic/claude-3.5-sonnet:beta": (0.003, 0.015),
            "anthropic/claude-3-haiku": (0.00025, 0.00125),
            "anthropic/claude-3.5-haiku": (0.0008, 0.004),
            # OpenAI via OpenRouter
            "openai/gpt-4o": (0.0025, 0.01),
            "openai/gpt-4o-mini": (0.00015, 0.0006),
            "openai/gpt-4-turbo": (0.01, 0.03),
            "openai/o1": (0.015, 0.06),
            "openai/o1-mini": (0.003, 0.012),
            "openai/o3": (0.01, 0.04),
            "openai/o3-mini": (0.0011, 0.0044),
            # Meta Llama (often free/cheap on OpenRouter)
            "meta-llama/llama-3.1-405b-instruct": (0.003, 0.003),
            "meta-llama/llama-3.1-70b-instruct": (0.0008, 0.0008),
            "meta-llama/llama-3.1-8b-instruct": (0.0001, 0.0001),
            "meta-llama/llama-3.3-70b-instruct": (0.0008, 0.0008),
            # Mistral
            "mistralai/mistral-large": (0.003, 0.009),
            "mistralai/mistral-medium": (0.0027, 0.0081),
            "mistralai/mistral-small": (0.001, 0.003),
            "mistralai/mixtral-8x7b-instruct": (0.00024, 0.00024),
            # Google
            "google/gemini-pro-1.5": (0.00125, 0.005),
            "google/gemini-flash-1.5": (0.000075, 0.0003),
            # DeepSeek
            "deepseek/deepseek-chat": (0.00014, 0.00028),
            "deepseek/deepseek-coder": (0.00014, 0.00028),
        }
        
        prompt_tokens = usage.get("prompt_tokens", 0)
        completion_tokens = usage.get("completion_tokens", 0)
        cached_tokens = usage.get("cache_read_input_tokens", 0) or 0
        
        # Try exact match first
        input_cost, output_cost = COSTS_PER_1K.get(self._model, (None, None))
        
        # Try prefix matching
        if input_cost is None:
            for model_key, costs in COSTS_PER_1K.items():
                if self._model.startswith(model_key):
                    input_cost, output_cost = costs
                    break
            else:
                # Default fallback - assume mid-range pricing
                input_cost, output_cost = (0.001, 0.002)
        
        # Calculate cost with cache discount (90% off for cached tokens)
        uncached_input = prompt_tokens - cached_tokens
        
        return (
            (uncached_input / 1000) * input_cost +
            (cached_tokens / 1000) * input_cost * 0.1 +  # 90% cache discount
            (completion_tokens / 1000) * output_cost
        )
