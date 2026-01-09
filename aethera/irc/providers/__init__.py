"""
Inference Providers for IRC Generation

Abstract base class and implementations for various LLM providers.
Supports both completion (base model) and chat (instruct) modes.
"""

from .base import InferenceProvider, CompletionMode, CompletionResult
from .openrouter import OpenRouterProvider
from .openai import OpenAIProvider
from .anthropic import AnthropicProvider
from .openai_compatible import (
    OpenAICompatibleProvider,
    create_vllm_provider,
    create_ollama_provider,
    create_together_provider,
    create_groq_provider,
)

__all__ = [
    # Base
    "InferenceProvider",
    "CompletionMode",
    "CompletionResult",
    # Providers
    "OpenRouterProvider",
    "OpenAIProvider",
    "AnthropicProvider",
    "OpenAICompatibleProvider",
    # Factory functions
    "create_vllm_provider",
    "create_ollama_provider",
    "create_together_provider",
    "create_groq_provider",
]

