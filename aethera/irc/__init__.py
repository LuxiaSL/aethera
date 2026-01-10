"""
IRC Simulation Module - Haunted Broadcast

A simulated IRC channel that generates fragments via LLM with progressive
chunked generation and autoloom quality gating. All connected clients see
the same stream in sync—a cursed channel that collapses over and over.

Components:
- models: Pydantic types for messages, fragments, configs
- database: Separate IRC database (irc.sqlite)
- providers: Abstract inference provider with implementations
- generator: Progressive chunked generation with autoloom
- normalizer: Collapse detection, timing assignment
- broadcaster: WebSocket hub and playback loop
- storage: Fragment persistence and selection
- autoloom: LLM-as-judge quality gating
"""

from .models import (
    IRCMessage,
    IRCFragment,
    CollapseType,
    MessageType,
    PacingStyle,
)
from .database import (
    IRCFragmentDB,
    init_irc_db,
    get_irc_session,
    get_irc_session_factory,
)
from .broadcaster import IRCBroadcaster
from .normalizer import IRCNormalizer, RawFragment, NormalizationError, normalize_lines
from .storage import FragmentStorage
from .autoloom import Autoloom, ChunkCandidate, JudgmentResult, detect_collapse_in_text, is_reasoning_model
from .generator import IRCGenerator, GenerationConfig, GenerationState, generate_batch
from .run_config import (
    GenerationRunConfig,
    ControlMode,
    InferenceParams,
    ProviderConfig,
    PromptConfig,
    SessionState,
    ProviderInfo,
    get_available_providers,
)
from .interactive import InteractiveGenerator, EventType, GenerationEvent, MockProvider
from .sessions import Session, SessionManager, get_session_manager

__all__ = [
    # Models
    "IRCMessage",
    "IRCFragment",
    "CollapseType",
    "MessageType",
    "PacingStyle",
    # Database
    "IRCFragmentDB",
    "init_irc_db",
    "get_irc_session",
    "get_irc_session_factory",
    # Core components
    "IRCBroadcaster",
    "IRCNormalizer",
    "IRCGenerator",
    "FragmentStorage",
    "Autoloom",
    # Supporting types
    "RawFragment",
    "NormalizationError",
    "ChunkCandidate",
    "JudgmentResult",
    "GenerationConfig",
    "GenerationState",
    # Functions
    "generate_batch",
    "normalize_lines",
    "detect_collapse_in_text",
    "is_reasoning_model",
    "get_available_providers",
    "get_session_manager",
    # Runtime config
    "GenerationRunConfig",
    "ControlMode",
    "InferenceParams",
    "ProviderConfig",
    "PromptConfig",
    "SessionState",
    "ProviderInfo",
    # Interactive generation
    "InteractiveGenerator",
    "EventType",
    "GenerationEvent",
    "MockProvider",
    "Session",
    "SessionManager",
]

