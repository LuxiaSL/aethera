"""
OpenAI-Compatible Provider

For any service that implements the OpenAI API format:
- Local inference (vLLM, llama.cpp, text-generation-webui)
- Ollama
- Together AI
- Groq
- Custom deployments
"""

import time
import logging
from typing import Optional

from .base import InferenceProvider, CompletionResult, CompletionMode

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
    ):
        """
        Initialize OpenAI-compatible provider.
        
        Args:
            base_url: Base URL for the API (e.g., "http://localhost:8000/v1")
            model: Model identifier
            api_key: Optional API key (some local servers don't require it)
            mode: CHAT for chat completions, BASE for completions API
            provider_name: Name for logging/identification
        """
        self._base_url = base_url.rstrip("/")
        self._model = model
        self._api_key = api_key or "not-needed"
        self._mode = mode
        self._provider_name = provider_name
        self._client = None
    
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
    
    async def complete(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> CompletionResult:
        """Generate completion using OpenAI-compatible API."""
        client = self._get_client()
        start_time = time.time()
        
        try:
            if self._mode == CompletionMode.CHAT:
                response = await client.chat.completions.create(
                    model=self._model,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    stop=stop,
                )
                
                text = response.choices[0].message.content or ""
                usage = response.usage
                
            else:
                # Base completion mode
                response = await client.completions.create(
                    model=self._model,
                    prompt=prompt,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    stop=stop,
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
        client = self._get_client()
        start_time = time.time()
        
        try:
            if self._mode == CompletionMode.CHAT:
                # Try assistant prefill
                messages = [
                    {"role": "user", "content": prompt},
                    {"role": "assistant", "content": prefill},
                ]
                
                try:
                    response = await client.chat.completions.create(
                        model=self._model,
                        messages=messages,
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        stop=stop,
                    )
                    text = response.choices[0].message.content or ""
                    usage = response.usage
                except Exception:
                    # Fallback: append prefill to user message
                    logger.debug("Assistant prefill not supported, using fallback")
                    response = await client.chat.completions.create(
                        model=self._model,
                        messages=[{
                            "role": "user", 
                            "content": f"{prompt}\n\nContinue from:\n{prefill}"
                        }],
                        max_tokens=max_tokens,
                        temperature=temperature,
                        top_p=top_p,
                        stop=stop,
                    )
                    text = response.choices[0].message.content or ""
                    usage = response.usage
                    
            else:
                # Base mode: append prefill to prompt
                full_prompt = prompt + prefill
                
                response = await client.completions.create(
                    model=self._model,
                    prompt=full_prompt,
                    max_tokens=max_tokens,
                    temperature=temperature,
                    top_p=top_p,
                    stop=stop,
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

