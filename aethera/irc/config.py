"""
IRC Module Configuration

Reads configuration from environment variables with sensible defaults.
"""

import os
from pathlib import Path
from dataclasses import dataclass
from typing import Optional


@dataclass
class IRCConfig:
    """Configuration for IRC generation system."""
    
    # API Keys
    openrouter_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    
    # Model selection - can use different providers for gen vs judge
    generation_model: str = "claude-3-opus-20240229"
    generation_provider: str = "anthropic"  # anthropic, openai, openrouter, local
    
    judge_model: str = "o3"  # OpenAI o3 for judging
    judge_provider: str = "openai"  # anthropic, openai, openrouter
    
    # Fallback provider (for OpenRouter routing)
    default_provider: str = "openrouter"
    
    # Local/custom provider settings (for OpenAI-compatible APIs)
    local_base_url: Optional[str] = None  # e.g., "http://localhost:8000/v1"
    local_api_key: Optional[str] = None   # Some servers require a key
    local_model: str = "default"          # Model name for the local server
    
    # Generation settings
    autoloom_threshold: float = 0.4  # Lower since we pick best from batch
    candidates_per_batch: int = 10
    tokens_per_candidate: int = 100
    min_fragments_buffer: int = 20
    cooldown_days: int = 7
    examples_per_prompt: int = 4  # How many examples to show in prompt
    
    # Mode flags
    use_instruct_mode: bool = True  # Use system prompt for instruct models
    
    # Paths
    examples_dir: Path = Path(__file__).parent / "prompts" / "examples"
    
    @classmethod
    def from_env(cls) -> "IRCConfig":
        """Load configuration from environment variables."""
        return cls(
            # API Keys (check multiple possible names)
            openrouter_api_key=(
                os.environ.get("IRC_OPENROUTER_API_KEY") or
                os.environ.get("OPENROUTER_API_KEY")
            ),
            openai_api_key=(
                os.environ.get("IRC_OPENAI_API_KEY") or
                os.environ.get("OPENAI_API_KEY")
            ),
            anthropic_api_key=(
                os.environ.get("IRC_ANTHROPIC_API_KEY") or
                os.environ.get("ANTHROPIC_API_KEY")
            ),
            
            # Generation model/provider
            generation_model=os.environ.get(
                "IRC_GENERATION_MODEL",
                "claude-3-opus-20240229"
            ),
            generation_provider=os.environ.get(
                "IRC_GENERATION_PROVIDER",
                "anthropic"
            ),
            
            # Judge model/provider
            judge_model=os.environ.get(
                "IRC_JUDGE_MODEL",
                "o3"
            ),
            judge_provider=os.environ.get(
                "IRC_JUDGE_PROVIDER",
                "openai"
            ),
            
            # Fallback
            default_provider=os.environ.get("IRC_DEFAULT_PROVIDER", "openrouter"),
            
            # Local/OpenAI-compatible provider settings
            local_base_url=os.environ.get("IRC_LOCAL_BASE_URL"),  # e.g., http://localhost:8000/v1
            local_api_key=os.environ.get("IRC_LOCAL_API_KEY"),    # Optional API key
            local_model=os.environ.get("IRC_LOCAL_MODEL", "default"),  # Model name
            
            # Generation settings
            autoloom_threshold=float(os.environ.get("IRC_AUTOLOOM_THRESHOLD", "0.4")),
            candidates_per_batch=int(os.environ.get("IRC_CANDIDATES_PER_BATCH", "10")),
            tokens_per_candidate=int(os.environ.get("IRC_TOKENS_PER_CANDIDATE", "100")),
            min_fragments_buffer=int(os.environ.get("IRC_MIN_FRAGMENTS_BUFFER", "20")),
            cooldown_days=int(os.environ.get("IRC_COOLDOWN_DAYS", "7")),
            examples_per_prompt=int(os.environ.get("IRC_EXAMPLES_PER_PROMPT", "4")),
            
            # Mode flags - use instruct mode for models that support it
            use_instruct_mode=os.environ.get("IRC_USE_INSTRUCT_MODE", "true").lower() in ("true", "1", "yes"),
        )
    
    def _create_provider(self, provider_name: str, model: str, enable_caching: bool = True):
        """
        Create a provider instance.
        
        Args:
            provider_name: Which provider to use
            model: Model identifier
            enable_caching: Whether to enable prompt caching (for batch reuse)
        """
        from .providers import (
            OpenRouterProvider,
            OpenAIProvider,
            AnthropicProvider,
            OpenAICompatibleProvider,
            CompletionMode,
        )
        
        if provider_name == "openrouter":
            if not self.openrouter_api_key:
                raise ValueError("OPENROUTER_API_KEY not set")
            return OpenRouterProvider(
                api_key=self.openrouter_api_key,
                model=model,
                mode=CompletionMode.CHAT,
                enable_caching=enable_caching,
            )
        
        elif provider_name == "openai":
            if not self.openai_api_key:
                raise ValueError("OPENAI_API_KEY not set")
            # OpenAI caching is automatic, no way to disable
            return OpenAIProvider(
                api_key=self.openai_api_key,
                model=model,
                mode=CompletionMode.CHAT,
            )
        
        elif provider_name == "anthropic":
            if not self.anthropic_api_key:
                raise ValueError("ANTHROPIC_API_KEY not set")
            return AnthropicProvider(
                api_key=self.anthropic_api_key,
                model=model,
                enable_caching=enable_caching,
            )
        
        elif provider_name == "local":
            if not self.local_base_url:
                raise ValueError("IRC_LOCAL_BASE_URL not set")
            # Use the local_model config if model wasn't explicitly specified
            actual_model = model if model != self.generation_model else self.local_model
            return OpenAICompatibleProvider(
                base_url=self.local_base_url,
                model=actual_model,
                api_key=self.local_api_key,  # May be None, that's OK
                mode=CompletionMode.COMPLETION,  # Base models for generation
                provider_name="local",
            )
        
        else:
            raise ValueError(f"Unknown provider: {provider_name}")
    
    def get_generation_provider(self):
        """
        Create the generation provider with caching ENABLED.
        
        Generation uses batch calls with same prompt → caching pays off.
        """
        return self._create_provider(
            self.generation_provider, 
            self.generation_model, 
            enable_caching=True,
        )
    
    def get_judge_provider(self):
        """
        Create the judge provider with caching DISABLED.
        
        Judge sees different candidates each time → cache overhead wasted.
        """
        return self._create_provider(
            self.judge_provider, 
            self.judge_model, 
            enable_caching=False,
        )


# Singleton config instance
_config: Optional[IRCConfig] = None


def get_config() -> IRCConfig:
    """Get the global IRC config, loading from env if needed."""
    global _config
    if _config is None:
        _config = IRCConfig.from_env()
    return _config


def reload_config() -> IRCConfig:
    """Force reload config from environment."""
    global _config
    _config = IRCConfig.from_env()
    return _config


