"""
Abstract Inference Provider

Base class for all LLM providers. Supports both completion (base model)
and chat completion (instruct model) modes, with batch generation support.

All providers support batch generation via complete_batch(), but implementation
varies:
- OpenAI: Native `n` parameter (single API call, very efficient)
- Anthropic: Parallel requests with prompt caching (multiple calls, cached)
- OpenRouter: Depends on underlying model, falls back to parallel
"""

from abc import ABC, abstractmethod
import asyncio
from dataclasses import dataclass
from enum import Enum
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class CompletionMode(Enum):
    """Whether the provider uses completion or chat API."""
    COMPLETION = "completion"  # Base model: text in → text out
    CHAT = "chat"              # Instruct model: messages array


@dataclass
class CompletionResult:
    """Result from an inference call."""
    text: str
    tokens_used: int
    tokens_prompt: int
    model: str
    latency_ms: float
    cost_usd: Optional[float] = None
    cached_tokens: int = 0  # For tracking prompt caching benefits
    
    @property
    def tokens_completion(self) -> int:
        """Tokens used for completion."""
        return self.tokens_used - self.tokens_prompt


@dataclass
class BatchCompletionResult:
    """Result from a batch inference call (n > 1)."""
    texts: list[str]  # Multiple completions
    tokens_used: int
    tokens_prompt: int
    model: str
    latency_ms: float
    cost_usd: Optional[float] = None
    cached_tokens: int = 0
    
    def __len__(self) -> int:
        return len(self.texts)


class InferenceProvider(ABC):
    """
    Abstract base for all LLM providers.
    
    Implementations must handle both completion and chat modes internally,
    translating the unified interface to provider-specific APIs.
    
    All providers support:
    - Single completions via complete()
    - Batch completions via complete_batch() (implementation varies)
    - Prefill continuations via complete_with_prefill()
    """
    
    @property
    @abstractmethod
    def name(self) -> str:
        """Provider identifier for logging/metrics."""
        ...
    
    @property
    @abstractmethod
    def mode(self) -> CompletionMode:
        """Whether this provider uses completion or chat API."""
        ...
    
    @property
    @abstractmethod
    def model(self) -> str:
        """The model identifier being used."""
        ...
    
    @property
    def supports_native_n(self) -> bool:
        """
        Whether this provider supports native `n` parameter.
        
        If True, complete_batch uses single API call with n parameter.
        If False, complete_batch uses parallel API calls.
        """
        return False
    
    @property
    def supports_prompt_caching(self) -> bool:
        """Whether this provider supports explicit prompt caching."""
        return False
    
    @abstractmethod
    async def complete(
        self,
        prompt: str,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> CompletionResult:
        """
        Generate a single completion.
        
        Args:
            prompt: The prompt text
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature (default 1.0)
            top_p: Nucleus sampling threshold (default 1.0)
            stop: Optional stop sequences
            
        Returns:
            CompletionResult with generated text and metadata
        """
        ...
    
    @abstractmethod
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
        Generate completion continuing from prefill.
        
        Args:
            prompt: The prompt text
            prefill: Text to prefill the response with
            max_tokens: Maximum tokens to generate
            temperature: Sampling temperature
            top_p: Nucleus sampling threshold (default 1.0)
            stop: Optional stop sequences
            
        Returns:
            CompletionResult with generated text (NOT including prefill)
        """
        ...
    
    async def complete_batch(
        self,
        prompt: str,
        n: int,
        max_tokens: int,
        temperature: float = 1.0,
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
    ) -> BatchCompletionResult:
        """
        Generate multiple completions for the same prompt.
        
        Default implementation uses parallel API calls.
        Providers that support native `n` parameter override this.
        
        Args:
            prompt: The prompt text
            n: Number of completions to generate
            max_tokens: Maximum tokens per completion
            temperature: Sampling temperature
            top_p: Nucleus sampling threshold (default 1.0)
            stop: Optional stop sequences
            
        Returns:
            BatchCompletionResult with multiple texts
        """
        import time
        start_time = time.time()
        
        # Default: parallel API calls
        tasks = [
            self.complete(prompt, max_tokens, temperature, top_p, stop)
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
                prompt_tokens = r.tokens_prompt  # Same for all
                if r.cost_usd:
                    total_cost += r.cost_usd
                cached += r.cached_tokens
        
        latency_ms = (time.time() - start_time) * 1000
        
        return BatchCompletionResult(
            texts=texts,
            tokens_used=total_tokens,
            tokens_prompt=prompt_tokens,
            model=self.model,
            latency_ms=latency_ms,
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
        top_p: float = 1.0,
        stop: Optional[list[str]] = None,
        system: Optional[str] = None,
        stable_prefix: Optional[str] = None,
    ) -> BatchCompletionResult:
        """
        Generate multiple completions with prefill.
        
        Default implementation uses parallel API calls.
        
        Args:
            prompt: The prompt text
            prefill: Text to prefill the response with
            n: Number of completions to generate
            max_tokens: Maximum tokens per completion
            temperature: Sampling temperature
            top_p: Nucleus sampling threshold (default 1.0)
            stop: Optional stop sequences
            
        Returns:
            BatchCompletionResult with multiple texts
        """
        import time
        start_time = time.time()
        
        tasks = [
            self.complete_with_prefill(prompt, prefill, max_tokens, temperature, top_p, stop)
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
        
        latency_ms = (time.time() - start_time) * 1000
        
        return BatchCompletionResult(
            texts=texts,
            tokens_used=total_tokens,
            tokens_prompt=prompt_tokens,
            model=self.model,
            latency_ms=latency_ms,
            cost_usd=total_cost if total_cost > 0 else None,
            cached_tokens=cached,
        )
    
    async def close(self) -> None:
        """Clean up resources. Override if provider needs cleanup."""
        pass
