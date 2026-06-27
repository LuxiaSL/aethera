"""
OpenAI-Compatible Provider

For any service that implements the OpenAI API format:
- Local inference (vLLM, llama.cpp, text-generation-webui)
- Ollama
- Together AI
- Groq
- Custom deployments
"""

import asyncio
import time
import logging
from typing import Optional

from .base import InferenceProvider, CompletionResult, BatchCompletionResult, CompletionMode

logger = logging.getLogger(__name__)


class OpenAICompatibleProvider(InferenceProvider):
    """
    OpenAI-compatible API provider.
    
    Works with any service that implements the OpenAI API format,
    including local inference servers and cloud providers.
    """
    
    def __init__(
        self,
        base_url: str,
        model: str,
        api_key: Optional[str] = None,
        mode: CompletionMode = CompletionMode.CHAT,
        provider_name: str = "openai-compatible",
        frequency_penalty: float = 0.0,
        presence_penalty: float = 0.0,
        repetition_penalty: float = 1.0,
        min_p: float = 0.0,
        warmup_retry_seconds: float = 60.0,
        warmup_max_retries: int = 40,
    ):
        """
        Initialize OpenAI-compatible provider.

        Args:
            base_url: Base URL for the API (e.g., "http://localhost:8000/v1")
            model: Model identifier
            api_key: Optional API key (some local servers don't require it)
            mode: CHAT for chat completions, BASE for completions API
            provider_name: Name for logging/identification
            frequency_penalty: OpenAI frequency penalty (0.0 = off)
            presence_penalty: OpenAI presence penalty (0.0 = off)
            repetition_penalty: vLLM repetition penalty (1.0 = off; ~1.1-1.2
                strongly curbs base-model looping). Sent via extra_body.
            min_p: vLLM min-p nucleus floor (0.0 = off; ~0.02-0.05 truncates the
                low-probability tail, which keeps higher temperatures coherent).
                Sent via extra_body.
            warmup_retry_seconds: when the server reports the model is still
                warming/loading (autoscaled cold-start), wait this long and retry
                (stable/constant backoff) instead of failing the round.
            warmup_max_retries: give up after this many warmup retries (caps the
                wait at ~warmup_retry_seconds * warmup_max_retries).
        """
        self._base_url = base_url.rstrip("/")
        self._model = model
        self._api_key = api_key or "not-needed"
        self._mode = mode
        self._provider_name = provider_name
        self._frequency_penalty = frequency_penalty
        self._presence_penalty = presence_penalty
        self._repetition_penalty = repetition_penalty
        self._min_p = min_p
        self._warmup_retry_seconds = warmup_retry_seconds
        self._warmup_max_retries = warmup_max_retries
        self._client = None

    def _sampling_kwargs(self) -> dict:
        """Penalty kwargs to apply to every completion call.

        frequency/presence are OpenAI-native; repetition_penalty and min_p are
        vLLM extensions passed through a shared extra_body. Each is only included
        when it deviates from its no-op default, so non-vLLM backends aren't sent
        parameters they don't understand.
        """
        kwargs: dict = {}
        if self._frequency_penalty:
            kwargs["frequency_penalty"] = self._frequency_penalty
        if self._presence_penalty:
            kwargs["presence_penalty"] = self._presence_penalty
        extra: dict = {}
        if self._repetition_penalty and self._repetition_penalty != 1.0:
            extra["repetition_penalty"] = self._repetition_penalty
        if self._min_p and self._min_p > 0.0:
            extra["min_p"] = self._min_p
        if extra:
            kwargs["extra_body"] = extra
        return kwargs
    
    @property
    def name(self) -> str:
        return f"{self._provider_name}/{self._model}"
    
    @property
    def mode(self) -> CompletionMode:
        return self._mode
    
    @property
    def model(self) -> str:
        return self._model
    
    def _get_client(self):
        """Lazy-load the OpenAI client with custom base URL."""
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
    
    @staticmethod
    def _is_warming(error: Exception) -> bool:
        """True if the error looks like the model is still loading/warming up.

        Large autoscaled deployments cold-start with an HTTP 503 whose body says
        the model "is warming". Matched by message text so it's backend-agnostic.
        """
        msg = str(error).lower()
        return any(s in msg for s in (
            "warming", "is loading", "still loading", "not ready", "starting up",
        ))

    async def _await_with_warmup_retry(self, make_call):
        """Await an API call, polling on a 'model warming' error with stable backoff.

        On a warmup error, wait `warmup_retry_seconds` (constant interval) and try
        again, up to `warmup_max_retries` times, so a cold-started model recovers
        the round instead of failing it. Any other error propagates immediately.
        `make_call` must be a zero-arg callable returning a FRESH awaitable.
        """
        attempt = 0
        while True:
            try:
                return await make_call()
            except Exception as e:
                if self._is_warming(e) and attempt < self._warmup_max_retries:
                    attempt += 1
                    logger.warning(
                        "%s: model warming — waiting %.0fs then retrying (%d/%d)",
                        self._provider_name, self._warmup_retry_seconds,
                        attempt, self._warmup_max_retries,
                    )
                    await asyncio.sleep(self._warmup_retry_seconds)
                    continue
                raise

    async def _completions_create(self, **kwargs):
        """client.completions.create with warmup-retry."""
        client = self._get_client()
        return await self._await_with_warmup_retry(lambda: client.completions.create(**kwargs))

    async def _chat_create(self, **kwargs):
        """client.chat.completions.create with warmup-retry."""
        client = self._get_client()
        return await self._await_with_warmup_retry(lambda: client.chat.completions.create(**kwargs))

    async def complete(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> CompletionResult:
        """Generate completion using OpenAI-compatible API."""
        start_time = time.time()
        
        try:
            if self._mode == CompletionMode.CHAT:
                response = await self._chat_create(
                    model=self._model,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    stop=stop,
                    **self._sampling_kwargs(),
                )
                
                text = response.choices[0].message.content or ""
                usage = response.usage
                
            else:
                # Base completion mode
                response = await self._completions_create(
                    model=self._model,
                    prompt=prompt,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    stop=stop,
                    **self._sampling_kwargs(),
                )
                
                text = response.choices[0].text
                usage = response.usage
            
            latency = (time.time() - start_time) * 1000
            
            return CompletionResult(
                text=text,
                tokens_used=usage.total_tokens if usage else 0,
                tokens_prompt=usage.prompt_tokens if usage else 0,
                model=self._model,
                latency_ms=latency,
                cost_usd=None,  # Can't estimate for arbitrary providers
            )
            
        except Exception as e:
            logger.error(f"OpenAI-compatible API error: {e}")
            raise
    
    async def complete_with_prefill(
        self,
        prompt: str,
        prefill: str,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> CompletionResult:
        """
        Generate completion with prefilled response.
        
        For base mode: appends prefill to prompt.
        For chat mode: uses assistant message prefix (if supported).
        """
        start_time = time.time()
        
        try:
            if self._mode == CompletionMode.CHAT:
                # Try assistant prefill
                messages = [
                    {"role": "user", "content": prompt},
                    {"role": "assistant", "content": prefill},
                ]
                
                try:
                    response = await self._chat_create(
                        model=self._model,
                        messages=messages,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        stop=stop,
                        **self._sampling_kwargs(),
                    )
                    text = response.choices[0].message.content or ""
                    usage = response.usage
                except Exception:
                    # Fallback: append prefill to user message
                    logger.debug("Assistant prefill not supported, using fallback")
                    response = await self._chat_create(
                        model=self._model,
                        messages=[{
                            "role": "user", 
                            "content": f"{prompt}\n\nContinue from:\n{prefill}"
                        }],
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        stop=stop,
                        **self._sampling_kwargs(),
                    )
                    text = response.choices[0].message.content or ""
                    usage = response.usage
                    
            else:
                # Base mode: append prefill to prompt
                full_prompt = prompt + prefill
                
                response = await self._completions_create(
                    model=self._model,
                    prompt=full_prompt,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    stop=stop,
                    **self._sampling_kwargs(),
                )
                
                text = response.choices[0].text
                usage = response.usage
            
            latency = (time.time() - start_time) * 1000
            
            return CompletionResult(
                text=text,
                tokens_used=usage.total_tokens if usage else 0,
                tokens_prompt=usage.prompt_tokens if usage else 0,
                model=self._model,
                latency_ms=latency,
                cost_usd=None,
            )
            
        except Exception as e:
            logger.error(f"OpenAI-compatible API error: {e}")
            raise

    @property
    def supports_native_n(self) -> bool:
        """vLLM / OpenAI-compatible servers accept n>1 in a single request."""
        return True

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
        """Generate n completions in ONE request via the native `n` parameter.

        vLLM batches the n sequences together with a shared-prefix KV cache —
        far more efficient (and higher GPU utilization) than n separate requests
        (the base-class default). Falls back to parallel calls if the server
        rejects native n.
        """
        start_time = time.time()
        try:
            if self._mode == CompletionMode.CHAT:
                messages = [
                    {"role": "user", "content": prompt},
                    {"role": "assistant", "content": prefill},
                ]
                response = await self._chat_create(
                    model=self._model, messages=messages, n=n,
                    max_tokens=max_tokens, temperature=temperature, top_p=top_p,
                    stop=stop, **self._sampling_kwargs(),
                )
                texts = [(c.message.content or "") for c in response.choices]
            else:
                response = await self._completions_create(
                    model=self._model, prompt=prompt + prefill, n=n,
                    max_tokens=max_tokens, temperature=temperature, top_p=top_p,
                    stop=stop, **self._sampling_kwargs(),
                )
                texts = [c.text for c in response.choices]
            usage = response.usage
            return BatchCompletionResult(
                texts=texts,
                tokens_used=usage.total_tokens if usage else 0,
                tokens_prompt=usage.prompt_tokens if usage else 0,
                model=self._model,
                latency_ms=(time.time() - start_time) * 1000,
                cost_usd=None,
                finish_reasons=[c.finish_reason for c in response.choices],
            )
        except Exception as e:
            logger.warning(f"Native-n batch failed ({e}); falling back to parallel calls")
            return await super().complete_batch_with_prefill(
                prompt, prefill, n, max_tokens, temperature, top_p, stop
            )

    async def complete_batch(
        self,
        prompt: str,
        n: int,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
        system: Optional[str] = None,
        stable_prefix: Optional[str] = None,
    ) -> BatchCompletionResult:
        """Generate n completions in one request via native `n` (vLLM batching)."""
        start_time = time.time()
        try:
            if self._mode == CompletionMode.CHAT:
                response = await self._chat_create(
                    model=self._model,
                    messages=[{"role": "user", "content": prompt}], n=n,
                    max_tokens=max_tokens, temperature=temperature, top_p=top_p,
                    stop=stop, **self._sampling_kwargs(),
                )
                texts = [(c.message.content or "") for c in response.choices]
            else:
                response = await self._completions_create(
                    model=self._model, prompt=prompt, n=n,
                    max_tokens=max_tokens, temperature=temperature, top_p=top_p,
                    stop=stop, **self._sampling_kwargs(),
                )
                texts = [c.text for c in response.choices]
            usage = response.usage
            return BatchCompletionResult(
                texts=texts,
                tokens_used=usage.total_tokens if usage else 0,
                tokens_prompt=usage.prompt_tokens if usage else 0,
                model=self._model,
                latency_ms=(time.time() - start_time) * 1000,
                cost_usd=None,
                finish_reasons=[c.finish_reason for c in response.choices],
            )
        except Exception as e:
            logger.warning(f"Native-n batch failed ({e}); falling back to parallel calls")
            return await super().complete_batch(prompt, n, max_tokens, temperature, top_p, stop)


# Convenience factory functions for common providers

def create_vllm_provider(
    base_url: str = "http://localhost:8000/v1",
    model: str = "default",
    mode: CompletionMode = CompletionMode.COMPLETION,
) -> OpenAICompatibleProvider:
    """Create a provider for vLLM server."""
    return OpenAICompatibleProvider(
        base_url=base_url,
        model=model,
        mode=mode,
        provider_name="vllm",
    )


def create_ollama_provider(
    model: str = "llama3.2",
    base_url: str = "http://localhost:11434/v1",
) -> OpenAICompatibleProvider:
    """Create a provider for Ollama."""
    return OpenAICompatibleProvider(
        base_url=base_url,
        model=model,
        mode=CompletionMode.CHAT,  # Ollama uses chat format
        provider_name="ollama",
    )


def create_together_provider(
    api_key: str,
    model: str = "meta-llama/Llama-3.2-3B-Instruct",
) -> OpenAICompatibleProvider:
    """Create a provider for Together AI."""
    return OpenAICompatibleProvider(
        base_url="https://api.together.xyz/v1",
        model=model,
        api_key=api_key,
        mode=CompletionMode.CHAT,
        provider_name="together",
    )


def create_groq_provider(
    api_key: str,
    model: str = "llama-3.2-3b-preview",
) -> OpenAICompatibleProvider:
    """Create a provider for Groq."""
    return OpenAICompatibleProvider(
        base_url="https://api.groq.com/openai/v1",
        model=model,
        api_key=api_key,
        mode=CompletionMode.CHAT,
        provider_name="groq",
    )


# Default Featherless access goes through the Hugging Face Inference Providers
# router, so the credential is an HF access token rather than a native
# Featherless subscription key. Point base_url at api.featherless.ai/v1 directly
# if using a native Featherless key instead.
FEATHERLESS_HF_ROUTER_BASE_URL = "https://router.huggingface.co/featherless-ai/v1"


def create_featherless_provider(
    api_key: str,
    model: str = "meta-llama/Llama-3.1-405B",
    base_url: str = FEATHERLESS_HF_ROUTER_BASE_URL,
    mode: CompletionMode = CompletionMode.COMPLETION,
    frequency_penalty: float = 0.0,
    presence_penalty: float = 0.0,
    repetition_penalty: float = 1.0,
    min_p: float = 0.0,
) -> OpenAICompatibleProvider:
    """Create a provider for Featherless (via the Hugging Face router by default).

    Defaults to a base model in COMPLETION mode — the intended generation path
    for raw, un-aligned IRC text. Pass mode=CompletionMode.CHAT for instruct
    models served through the same router.
    """
    return OpenAICompatibleProvider(
        base_url=base_url,
        model=model,
        api_key=api_key,
        mode=mode,
        provider_name="featherless",
        frequency_penalty=frequency_penalty,
        presence_penalty=presence_penalty,
        repetition_penalty=repetition_penalty,
        min_p=min_p,
    )

