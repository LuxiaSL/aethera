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
    # Featherless access defaults to the Hugging Face Inference Providers router,
    # so this is typically an HF access token (HF_TOKEN).
    featherless_api_key: Optional[str] = None

    # Model selection - can use different providers for gen vs judge.
    #
    # Default split: a BASE model in completion mode for generation (raw,
    # un-aligned IRC texture) and an instruct model for judging. Generation
    # runs through Featherless (via the HF router); judging through OpenRouter.
    generation_model: str = "meta-llama/Llama-3.1-405B"
    generation_provider: str = "featherless"  # featherless, anthropic, openai, openrouter, local

    judge_model: str = "moonshotai/kimi-k2.5"
    judge_provider: str = "openrouter"  # openrouter, anthropic, openai, featherless, local

    # Stateful judge: maintain ONE judge conversation across a fragment's rounds
    # (carrying its reasoning forward) instead of a fresh one-shot per round.
    # Default off so it's A/B-testable against the stateless baseline.
    judge_stateful: bool = False

    # Fallback provider (for OpenRouter routing)
    default_provider: str = "openrouter"

    # OpenRouter backend routing for the judge. OpenRouter load-balances a model
    # across backends of very different throughput; default to the fastest, or
    # pin specific providers (comma-separated) once you've checked their TPS.
    openrouter_provider_sort: str = "throughput"   # throughput|latency|price|""
    openrouter_providers: Optional[str] = None      # e.g. "moonshotai,fireworks"
    openrouter_allow_fallbacks: bool = True

    # Featherless settings (OpenAI-compatible; HF router by default)
    featherless_base_url: str = "https://router.huggingface.co/featherless-ai/v1"

    # Local/custom provider settings (for OpenAI-compatible APIs)
    local_base_url: Optional[str] = None  # e.g., "http://localhost:8000/v1"
    local_api_key: Optional[str] = None   # Some servers require a key
    local_model: str = "default"          # Model name for the local server

    # Generation settings
    autoloom_threshold: float = 0.4  # Lower since we pick best from batch
    candidates_per_batch: int = 10
    tokens_per_candidate: int = 100
    candidate_temperature: float = 0.7  # >0.85 degenerates on base models
    min_collapse_percentage: float = 0.8  # collapse only past this % of target
    min_fragments_buffer: int = 20
    cooldown_days: int = 7
    examples_per_prompt: int = 1  # ONE bash.org example as a pure format anchor.
    # The base model already knows IRC/bash.org from pretraining, so examples don't
    # teach content — they only anchor format. 4 over-anchored to the short
    # call-response shape of those quotes (repetition loops); 1 keeps format tight
    # without biasing length/structure. See the zero-shot A/B (session 4).

    # Generation sampling penalties (applied to the base/generation provider).
    # Base models loop without these; repetition_penalty ~1.1-1.2 is the main
    # antidote, frequency_penalty a secondary nudge. 0.0 / 1.0 = off.
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    repetition_penalty: float = 1.05
    # Nucleus + min-p truncation (applied to the generation provider). top_p 1.0
    # and min_p 0.0 are no-ops; min_p is a vLLM extension (sent via extra_body).
    # Some models (e.g. K3) want top_p<1 + a small min_p to stay coherent at
    # temperatures >1.0.
    candidate_top_p: float = 1.0
    min_p: float = 0.0

    # Mode flags
    # Default False: the generation model is a base/completion model, which
    # should NOT receive an instruct system prompt. Set True only when pointing
    # generation at an instruct/chat model.
    use_instruct_mode: bool = False
    
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
            featherless_api_key=(
                os.environ.get("IRC_FEATHERLESS_API_KEY") or
                os.environ.get("FEATHERLESS_API_KEY") or
                os.environ.get("HF_TOKEN")
            ),

            # Generation model/provider
            generation_model=os.environ.get(
                "IRC_GENERATION_MODEL",
                "meta-llama/Llama-3.1-405B"
            ),
            generation_provider=os.environ.get(
                "IRC_GENERATION_PROVIDER",
                "featherless"
            ),

            # Judge model/provider
            judge_model=os.environ.get(
                "IRC_JUDGE_MODEL",
                "moonshotai/kimi-k2.5"
            ),
            judge_provider=os.environ.get(
                "IRC_JUDGE_PROVIDER",
                "openrouter"
            ),
            judge_stateful=os.environ.get(
                "IRC_JUDGE_STATEFUL", "false"
            ).lower() in ("true", "1", "yes"),

            # Fallback
            default_provider=os.environ.get("IRC_DEFAULT_PROVIDER", "openrouter"),

            # OpenRouter judge backend routing
            openrouter_provider_sort=os.environ.get("IRC_OPENROUTER_PROVIDER_SORT", "throughput"),
            openrouter_providers=os.environ.get("IRC_OPENROUTER_PROVIDERS"),
            openrouter_allow_fallbacks=os.environ.get(
                "IRC_OPENROUTER_ALLOW_FALLBACKS", "true"
            ).lower() in ("true", "1", "yes"),

            # Featherless (OpenAI-compatible; HF router by default)
            featherless_base_url=os.environ.get(
                "IRC_FEATHERLESS_BASE_URL",
                "https://router.huggingface.co/featherless-ai/v1",
            ),

            # Local/OpenAI-compatible provider settings
            local_base_url=os.environ.get("IRC_LOCAL_BASE_URL"),  # e.g., http://localhost:8000/v1
            local_api_key=os.environ.get("IRC_LOCAL_API_KEY"),    # Optional API key
            local_model=os.environ.get("IRC_LOCAL_MODEL", "default"),  # Model name
            
            # Generation settings
            autoloom_threshold=float(os.environ.get("IRC_AUTOLOOM_THRESHOLD", "0.4")),
            candidates_per_batch=int(os.environ.get("IRC_CANDIDATES_PER_BATCH", "10")),
            tokens_per_candidate=int(os.environ.get("IRC_TOKENS_PER_CANDIDATE", "100")),
            candidate_temperature=float(os.environ.get("IRC_CANDIDATE_TEMPERATURE", "0.7")),
            min_collapse_percentage=float(os.environ.get("IRC_MIN_COLLAPSE_PERCENTAGE", "0.8")),
            min_fragments_buffer=int(os.environ.get("IRC_MIN_FRAGMENTS_BUFFER", "20")),
            cooldown_days=int(os.environ.get("IRC_COOLDOWN_DAYS", "7")),

            # Generation sampling penalties
            frequency_penalty=float(os.environ.get("IRC_FREQUENCY_PENALTY", "0.0")),
            presence_penalty=float(os.environ.get("IRC_PRESENCE_PENALTY", "0.0")),
            repetition_penalty=float(os.environ.get("IRC_REPETITION_PENALTY", "1.05")),
            candidate_top_p=float(os.environ.get("IRC_TOP_P", "1.0")),
            min_p=float(os.environ.get("IRC_MIN_P", "0.0")),
            examples_per_prompt=int(os.environ.get("IRC_EXAMPLES_PER_PROMPT", "1")),
            
            # Mode flags - default off for base-model generation; set to true
            # only when generation points at an instruct/chat model.
            use_instruct_mode=os.environ.get("IRC_USE_INSTRUCT_MODE", "false").lower() in ("true", "1", "yes"),
        )
    
    def openrouter_routing(self) -> Optional[dict]:
        """Build the OpenRouter `provider` routing object from config.

        Pinned providers take priority; otherwise sort by the chosen metric
        (default throughput). Returns None to let OpenRouter load-balance.
        """
        if self.openrouter_providers:
            order = [p.strip() for p in self.openrouter_providers.split(",") if p.strip()]
            if order:
                return {"order": order, "allow_fallbacks": self.openrouter_allow_fallbacks}
        if self.openrouter_provider_sort:
            return {"sort": self.openrouter_provider_sort}
        return None

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
            create_featherless_provider,
        )

        if provider_name == "featherless":
            if not self.featherless_api_key:
                raise ValueError(
                    "Featherless key not set (IRC_FEATHERLESS_API_KEY / "
                    "FEATHERLESS_API_KEY / HF_TOKEN)"
                )
            # Base model in completion mode is the intended generation path; an
            # instruct model served through the same router would use CHAT, but
            # the judge path runs through OpenRouter so default to COMPLETION.
            return create_featherless_provider(
                api_key=self.featherless_api_key,
                model=model,
                base_url=self.featherless_base_url,
                mode=CompletionMode.COMPLETION,
                frequency_penalty=self.frequency_penalty,
                presence_penalty=self.presence_penalty,
                repetition_penalty=self.repetition_penalty,
                min_p=self.min_p,
            )

        elif provider_name == "openrouter":
            if not self.openrouter_api_key:
                raise ValueError("OPENROUTER_API_KEY not set")
            return OpenRouterProvider(
                api_key=self.openrouter_api_key,
                model=model,
                mode=CompletionMode.CHAT,
                enable_caching=enable_caching,
                provider_routing=self.openrouter_routing(),
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
                frequency_penalty=self.frequency_penalty,
                presence_penalty=self.presence_penalty,
                repetition_penalty=self.repetition_penalty,
                min_p=self.min_p,
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
        Create the judge provider with caching ENABLED.

        Only the candidates vary between calls — the judge system prompt and
        scoring instructions are a stable prefix, so caching them pays off
        (and is automatic for Moonshot/DeepSeek/OpenAI models on OpenRouter).
        """
        return self._create_provider(
            self.judge_provider,
            self.judge_model,
            enable_caching=True,
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


