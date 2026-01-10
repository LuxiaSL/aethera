"""
IRC Runtime Configuration

Dataclasses for runtime configuration of generation sessions.
These allow dynamic parameter tuning via the admin web UI,
as opposed to the static environment-based config.py.
"""

from dataclasses import dataclass, field
from typing import Optional, Literal
from enum import Enum


class ControlMode(str, Enum):
    """User control mode for generation."""
    AUTONOMOUS = "autonomous"        # Runs to completion
    CONFIRM_STEP = "confirm_step"    # Pause after each judgment
    MANUAL_SELECT = "manual_select"  # User picks winner


@dataclass
class InferenceParams:
    """Parameters for a single inference request."""
    temperature: float = 0.9
    top_p: float = 1.0
    max_tokens: int = 100
    stop_sequences: list[str] = field(default_factory=list)
    
    def validate(self) -> None:
        """Validate parameter ranges."""
        if not (0.0 <= self.temperature <= 2.0):
            raise ValueError(f"temperature must be 0.0-2.0, got {self.temperature}")
        if not (0.0 <= self.top_p <= 1.0):
            raise ValueError(f"top_p must be 0.0-1.0, got {self.top_p}")
        if self.max_tokens <= 0:
            raise ValueError(f"max_tokens must be positive, got {self.max_tokens}")
    
    def to_dict(self) -> dict:
        """Convert to dict for serialization."""
        return {
            "temperature": self.temperature,
            "top_p": self.top_p,
            "max_tokens": self.max_tokens,
            "stop_sequences": self.stop_sequences,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "InferenceParams":
        """Create from dict."""
        return cls(
            temperature=data.get("temperature", 0.9),
            top_p=data.get("top_p", 1.0),
            max_tokens=data.get("max_tokens", 100),
            stop_sequences=data.get("stop_sequences", []),
        )


@dataclass 
class ProviderConfig:
    """Configuration for a provider + model combination."""
    provider: str  # anthropic, openai, openrouter, local
    model: str
    params: InferenceParams = field(default_factory=InferenceParams)
    
    # For local provider
    base_url: Optional[str] = None
    api_key: Optional[str] = None
    
    def to_dict(self) -> dict:
        """Convert to dict for serialization."""
        return {
            "provider": self.provider,
            "model": self.model,
            "params": self.params.to_dict(),
            "base_url": self.base_url,
            "api_key": "***" if self.api_key else None,  # Don't expose keys
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "ProviderConfig":
        """Create from dict."""
        params = InferenceParams.from_dict(data.get("params", {}))
        return cls(
            provider=data.get("provider", "anthropic"),
            model=data.get("model", "claude-3-5-sonnet-20241022"),
            params=params,
            base_url=data.get("base_url"),
            api_key=data.get("api_key"),
        )


@dataclass
class PromptConfig:
    """
    Prompt customization options.
    
    All prompts support template variables that get filled in at runtime:
    
    Generation System Prompt:
        No special variables - plain text instruction.
    
    Judge System Prompt:
        No special variables - plain text instruction for evaluation criteria.
    
    Judge User Template (for continuation chunks):
        {current_messages} - Current message count
        {target_messages} - Target message count  
        {progress_pct} - Progress as percentage (e.g., 45.0)
        {pacing_guidance} - Auto-generated pacing advice based on progress
        {context} - The conversation so far (IRC-formatted)
        {num_candidates} - Number of candidates
        {candidates} - Formatted candidate text blocks
    """
    # Generation prompts
    generation_system_prompt: Optional[str] = None  # None = use default
    example_files: list[str] = field(default_factory=list)  # Empty = random
    custom_scaffold: Optional[str] = None  # Full override (advanced)
    examples_count: int = 4  # If using random
    
    # Judge prompts
    judge_system_prompt: Optional[str] = None  # None = use default
    judge_user_template: Optional[str] = None  # None = use default (for continuation)
    judge_user_template_first: Optional[str] = None  # None = use default (for first chunk)
    
    # Legacy alias for backward compatibility
    @property
    def system_prompt(self) -> Optional[str]:
        return self.generation_system_prompt
    
    @system_prompt.setter
    def system_prompt(self, value: Optional[str]):
        self.generation_system_prompt = value
    
    def to_dict(self) -> dict:
        """Convert to dict for serialization."""
        return {
            "generation_system_prompt": self.generation_system_prompt,
            "example_files": self.example_files,
            "custom_scaffold": self.custom_scaffold,
            "examples_count": self.examples_count,
            "judge_system_prompt": self.judge_system_prompt,
            "judge_user_template": self.judge_user_template,
            "judge_user_template_first": self.judge_user_template_first,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "PromptConfig":
        """Create from dict."""
        # Handle legacy 'system_prompt' field
        gen_system = data.get("generation_system_prompt") or data.get("system_prompt")
        
        return cls(
            generation_system_prompt=gen_system,
            example_files=data.get("example_files", []),
            custom_scaffold=data.get("custom_scaffold"),
            examples_count=data.get("examples_count", 4),
            judge_system_prompt=data.get("judge_system_prompt"),
            judge_user_template=data.get("judge_user_template"),
            judge_user_template_first=data.get("judge_user_template_first"),
        )


@dataclass
class GenerationRunConfig:
    """Complete configuration for a generation session."""
    
    # Provider configs
    generation: ProviderConfig = field(default_factory=lambda: ProviderConfig(
        provider="anthropic",
        model="claude-3-5-sonnet-20241022",
        params=InferenceParams(temperature=0.9, max_tokens=100)
    ))
    judge: ProviderConfig = field(default_factory=lambda: ProviderConfig(
        provider="openai",
        model="gpt-4o",
        params=InferenceParams(temperature=0.3, max_tokens=800)
    ))
    
    # Fragment parameters
    style: Optional[str] = None  # None = random
    collapse_type: Optional[str] = None  # None = random
    target_messages: int = 25
    target_users: int = 4
    channel: str = "#aethera"
    
    # Core loop parameters
    candidates_per_batch: int = 10
    max_chunks: int = 20
    min_collapse_percentage: float = 0.6
    autoloom_threshold: float = 0.4
    max_chunk_failures: int = 5
    
    # Prompt customization
    prompts: PromptConfig = field(default_factory=PromptConfig)
    
    # User control mode
    control_mode: ControlMode = ControlMode.AUTONOMOUS
    
    # Generation mode flags
    use_instruct_mode: bool = True
    dry_run: bool = False  # Use mock providers
    
    def to_dict(self) -> dict:
        """Convert to dict for serialization."""
        return {
            "generation": self.generation.to_dict(),
            "judge": self.judge.to_dict(),
            "style": self.style,
            "collapse_type": self.collapse_type,
            "target_messages": self.target_messages,
            "target_users": self.target_users,
            "channel": self.channel,
            "candidates_per_batch": self.candidates_per_batch,
            "max_chunks": self.max_chunks,
            "min_collapse_percentage": self.min_collapse_percentage,
            "autoloom_threshold": self.autoloom_threshold,
            "max_chunk_failures": self.max_chunk_failures,
            "prompts": self.prompts.to_dict(),
            "control_mode": self.control_mode.value,
            "use_instruct_mode": self.use_instruct_mode,
            "dry_run": self.dry_run,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "GenerationRunConfig":
        """Create from dict."""
        generation = ProviderConfig.from_dict(data.get("generation", {}))
        judge = ProviderConfig.from_dict(data.get("judge", {}))
        prompts = PromptConfig.from_dict(data.get("prompts", {}))
        
        control_mode_str = data.get("control_mode", "autonomous")
        control_mode = ControlMode(control_mode_str)
        
        return cls(
            generation=generation,
            judge=judge,
            style=data.get("style"),
            collapse_type=data.get("collapse_type"),
            target_messages=data.get("target_messages", 25),
            target_users=data.get("target_users", 4),
            channel=data.get("channel", "#aethera"),
            candidates_per_batch=data.get("candidates_per_batch", 10),
            max_chunks=data.get("max_chunks", 20),
            min_collapse_percentage=data.get("min_collapse_percentage", 0.6),
            autoloom_threshold=data.get("autoloom_threshold", 0.4),
            max_chunk_failures=data.get("max_chunk_failures", 5),
            prompts=prompts,
            control_mode=control_mode,
            use_instruct_mode=data.get("use_instruct_mode", True),
            dry_run=data.get("dry_run", False),
        )


@dataclass
class SessionState:
    """Serializable state of a generation session."""
    session_id: str
    config: GenerationRunConfig
    status: str  # idle, running, paused, complete, error
    
    # Progress tracking
    current_chunk: int = 0
    message_count: int = 0
    transcript_lines: list[str] = field(default_factory=list)
    
    # Pending user input
    waiting_for: Optional[str] = None  # None, "select", "confirm"
    pending_candidates: list[dict] = field(default_factory=list)
    pending_judgment: Optional[dict] = None
    
    # Stats
    total_tokens: int = 0
    total_cost: float = 0.0
    start_time: Optional[str] = None
    
    # Results
    final_transcript: Optional[str] = None
    error_message: Optional[str] = None
    
    def to_dict(self) -> dict:
        """Convert to dict for serialization."""
        return {
            "session_id": self.session_id,
            "config": self.config.to_dict(),
            "status": self.status,
            "current_chunk": self.current_chunk,
            "message_count": self.message_count,
            "transcript_lines": self.transcript_lines,
            "waiting_for": self.waiting_for,
            "pending_candidates": self.pending_candidates,
            "pending_judgment": self.pending_judgment,
            "total_tokens": self.total_tokens,
            "total_cost": self.total_cost,
            "start_time": self.start_time,
            "final_transcript": self.final_transcript,
            "error_message": self.error_message,
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> "SessionState":
        """Create from dict."""
        config = GenerationRunConfig.from_dict(data.get("config", {}))
        return cls(
            session_id=data["session_id"],
            config=config,
            status=data.get("status", "idle"),
            current_chunk=data.get("current_chunk", 0),
            message_count=data.get("message_count", 0),
            transcript_lines=data.get("transcript_lines", []),
            waiting_for=data.get("waiting_for"),
            pending_candidates=data.get("pending_candidates", []),
            pending_judgment=data.get("pending_judgment"),
            total_tokens=data.get("total_tokens", 0),
            total_cost=data.get("total_cost", 0.0),
            start_time=data.get("start_time"),
            final_transcript=data.get("final_transcript"),
            error_message=data.get("error_message"),
        )


@dataclass
class ProviderInfo:
    """Information about an available provider."""
    name: str
    display_name: str
    models: list[str]
    supports_n: bool
    supports_caching: bool
    requires_api_key: bool
    api_key_env_var: Optional[str]
    has_api_key: bool  # Whether key is configured
    
    def to_dict(self) -> dict:
        """Convert to dict for serialization."""
        return {
            "name": self.name,
            "display_name": self.display_name,
            "models": self.models,
            "supports_n": self.supports_n,
            "supports_caching": self.supports_caching,
            "requires_api_key": self.requires_api_key,
            "api_key_env_var": self.api_key_env_var,
            "has_api_key": self.has_api_key,
        }


def get_available_providers() -> list[ProviderInfo]:
    """
    Get information about all available providers.
    
    Checks environment for API keys.
    """
    import os
    
    providers = [
        ProviderInfo(
            name="anthropic",
            display_name="Anthropic (Claude)",
            models=[
                "claude-3-5-sonnet-20241022",
                "claude-3-opus-20240229",
                "claude-3-sonnet-20240229",
                "claude-3-haiku-20240307",
            ],
            supports_n=False,
            supports_caching=True,
            requires_api_key=True,
            api_key_env_var="ANTHROPIC_API_KEY",
            has_api_key=bool(os.environ.get("ANTHROPIC_API_KEY") or os.environ.get("IRC_ANTHROPIC_API_KEY")),
        ),
        ProviderInfo(
            name="openai",
            display_name="OpenAI",
            models=[
                "gpt-4o",
                "gpt-4o-mini",
                "gpt-4-turbo",
                "o3",
                "o3-mini",
                "o1",
                "o1-mini",
            ],
            supports_n=True,
            supports_caching=True,  # Automatic
            requires_api_key=True,
            api_key_env_var="OPENAI_API_KEY",
            has_api_key=bool(os.environ.get("OPENAI_API_KEY") or os.environ.get("IRC_OPENAI_API_KEY")),
        ),
        ProviderInfo(
            name="openrouter",
            display_name="OpenRouter",
            models=[
                "anthropic/claude-3.5-sonnet",
                "anthropic/claude-3-opus",
                "openai/gpt-4o",
                "google/gemini-pro-1.5",
                "meta-llama/llama-3.1-405b-instruct",
            ],
            supports_n=False,  # Depends on underlying model
            supports_caching=False,  # Depends on underlying model
            requires_api_key=True,
            api_key_env_var="OPENROUTER_API_KEY",
            has_api_key=bool(os.environ.get("OPENROUTER_API_KEY") or os.environ.get("IRC_OPENROUTER_API_KEY")),
        ),
        ProviderInfo(
            name="local",
            display_name="Local / Custom",
            models=["default"],  # User specifies
            supports_n=False,
            supports_caching=False,
            requires_api_key=False,
            api_key_env_var=None,
            has_api_key=True,  # Not required
        ),
    ]
    
    return providers

