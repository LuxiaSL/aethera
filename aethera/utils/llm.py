"""
LLM client utilities for membrane-api integration.

Provides async functions for interacting with the local membrane-api service,
which wraps @animalabs/membrane for consistent LLM behavior.

Supported providers (via BYOK or server fallback):
- anthropic: Direct Anthropic API
- openrouter: OpenRouter (routes to many providers)
- openai: Direct OpenAI API
- openai-compatible: Any OpenAI-compatible endpoint (Ollama, vLLM, etc.)
- openai-completions: OpenAI completions API (base models)
- bedrock: AWS Bedrock

Usage:
    from aethera.utils.llm import complete, stream, LLMClient

    # Simple completion (uses server fallback)
    response = await complete([
        {"participant": "User", "content": "Hello!"}
    ])
    print(response.text)

    # BYOK - bring your own key
    response = await complete(
        [{"participant": "User", "content": "Hello!"}],
        api_key="sk-ant-...",
        provider="anthropic"
    )

    # Use local LLM via openai-compatible
    response = await complete(
        [{"participant": "User", "content": "Hello!"}],
        provider="openai-compatible",
        model="llama3",
        provider_config={"baseUrl": "http://localhost:11434/v1"}
    )

    # Streaming with stream ID for abortion support
    async for event_type, data in stream([
        {"participant": "User", "content": "Tell me a story"}
    ]):
        if event_type == "stream_start":
            stream_id = data["streamId"]  # Save for potential abortion
        elif event_type == "chunk":
            print(data["text"], end="", flush=True)

    # Context-managed streaming for long conversations
    state = None
    async for event_type, data in context_stream(
        messages=[...],
        context_config=ContextConfig(
            rolling=RollingConfig(threshold=50, buffer=20),
        ),
        context_state=state
    ):
        if event_type == "done":
            state = data.get("context", {}).get("state")
"""

import os
import json
from typing import Any, AsyncIterator, Literal, Optional
from dataclasses import dataclass, field

import httpx


# Configuration from environment
MEMBRANE_API_URL = os.getenv("MEMBRANE_API_URL", "http://127.0.0.1:3001")
MEMBRANE_API_TOKEN = os.getenv("MEMBRANE_API_TOKEN", "")
MEMBRANE_DEFAULT_TIMEOUT = float(os.getenv("MEMBRANE_DEFAULT_TIMEOUT", "300.0"))


# =============================================================================
# Type Definitions
# =============================================================================

Provider = Literal[
    "anthropic",
    "openrouter", 
    "openai",
    "openai-compatible",
    "openai-completions",
    "bedrock",
]

ToolMode = Literal["auto", "xml", "native"]
Formatter = Literal["xml", "native", "completions"]
CacheTtl = Literal["5m", "1h"]
ThinkingOutputMode = Literal["parsed", "tagged", "hidden", "interleaved"]
StopReason = Literal["end_turn", "max_tokens", "stop_sequence", "tool_use", "refusal"]


# =============================================================================
# Data Classes
# =============================================================================

@dataclass
class Message:
    """A conversation message."""
    participant: str
    content: str | list[dict[str, Any]]

    def to_dict(self) -> dict[str, Any]:
        return {
            "participant": self.participant,
            "content": self.content,
        }


@dataclass
class ToolDefinition:
    """A tool/function definition for the LLM."""
    name: str
    description: str
    input_schema: dict[str, Any]

    def to_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "description": self.description,
            "inputSchema": self.input_schema,
        }


@dataclass
class ThinkingConfig:
    """Configuration for extended thinking/reasoning."""
    enabled: bool = True
    budget_tokens: Optional[int] = None
    output_mode: Optional[ThinkingOutputMode] = None

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {"enabled": self.enabled}
        if self.budget_tokens is not None:
            result["budgetTokens"] = self.budget_tokens
        if self.output_mode is not None:
            result["outputMode"] = self.output_mode
        return result


@dataclass
class RetryConfig:
    """Custom retry configuration for requests."""
    max_retries: Optional[int] = None  # Default: 3
    retry_delay_ms: Optional[int] = None  # Default: 1000
    backoff_multiplier: Optional[float] = None  # Default: 2
    max_retry_delay_ms: Optional[int] = None  # Default: 30000

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {}
        if self.max_retries is not None:
            result["maxRetries"] = self.max_retries
        if self.retry_delay_ms is not None:
            result["retryDelayMs"] = self.retry_delay_ms
        if self.backoff_multiplier is not None:
            result["backoffMultiplier"] = self.backoff_multiplier
        if self.max_retry_delay_ms is not None:
            result["maxRetryDelayMs"] = self.max_retry_delay_ms
        return result


@dataclass
class ProviderConfigData:
    """Provider-specific configuration for BYOK."""
    api_key: Optional[str] = None
    base_url: Optional[str] = None  # For openai-compatible, openai-completions
    organization: Optional[str] = None  # For OpenAI
    http_referer: Optional[str] = None  # For OpenRouter
    x_title: Optional[str] = None  # For OpenRouter
    access_key_id: Optional[str] = None  # For Bedrock
    secret_access_key: Optional[str] = None  # For Bedrock
    session_token: Optional[str] = None  # For Bedrock
    region: Optional[str] = None  # For Bedrock
    eot_token: Optional[str] = None  # For openai-completions
    stop_sequences: Optional[list[str]] = None  # For openai-completions

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {}
        if self.api_key:
            result["apiKey"] = self.api_key
        if self.base_url:
            result["baseUrl"] = self.base_url
        if self.organization:
            result["organization"] = self.organization
        if self.http_referer:
            result["httpReferer"] = self.http_referer
        if self.x_title:
            result["xTitle"] = self.x_title
        if self.access_key_id:
            result["accessKeyId"] = self.access_key_id
        if self.secret_access_key:
            result["secretAccessKey"] = self.secret_access_key
        if self.session_token:
            result["sessionToken"] = self.session_token
        if self.region:
            result["region"] = self.region
        if self.eot_token:
            result["eotToken"] = self.eot_token
        if self.stop_sequences:
            result["stopSequences"] = self.stop_sequences
        return result


# =============================================================================
# Context Management Data Classes
# =============================================================================

@dataclass
class RollingConfig:
    """Configuration for context rolling/truncation."""
    threshold: int  # Messages/tokens before roll triggers
    buffer: int  # Buffer to leave uncached after roll
    grace: Optional[int] = None  # Grace period before forced roll
    unit: Literal["messages", "tokens"] = "messages"

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {
            "threshold": self.threshold,
            "buffer": self.buffer,
        }
        if self.grace is not None:
            result["grace"] = self.grace
        if self.unit:
            result["unit"] = self.unit
        return result


@dataclass
class ContextLimits:
    """Hard limits for context management."""
    max_characters: Optional[int] = None  # Default: 500000
    max_tokens: Optional[int] = None
    max_messages: Optional[int] = None

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {}
        if self.max_characters is not None:
            result["maxCharacters"] = self.max_characters
        if self.max_tokens is not None:
            result["maxTokens"] = self.max_tokens
        if self.max_messages is not None:
            result["maxMessages"] = self.max_messages
        return result


@dataclass
class CacheConfig:
    """Configuration for prompt caching."""
    enabled: bool = True
    points: Literal[1, 2, 3, 4] = 1  # Number of cache markers
    min_tokens: Optional[int] = None  # Minimum tokens before caching
    prefer_user_messages: bool = False  # OpenRouter workaround

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {"enabled": self.enabled}
        if self.points:
            result["points"] = self.points
        if self.min_tokens is not None:
            result["minTokens"] = self.min_tokens
        if self.prefer_user_messages:
            result["preferUserMessages"] = self.prefer_user_messages
        return result


@dataclass
class ContextConfig:
    """Full context management configuration."""
    rolling: RollingConfig
    limits: Optional[ContextLimits] = None
    cache: Optional[CacheConfig] = None

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {
            "rolling": self.rolling.to_dict(),
        }
        if self.limits:
            result["limits"] = self.limits.to_dict()
        if self.cache:
            result["cache"] = self.cache.to_dict()
        return result


@dataclass
class CacheMarker:
    """A cache marker location in the conversation."""
    message_id: str
    message_index: int
    token_estimate: int

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "CacheMarker":
        return cls(
            message_id=data.get("messageId", ""),
            message_index=data.get("messageIndex", 0),
            token_estimate=data.get("tokenEstimate", 0),
        )

    def to_dict(self) -> dict[str, Any]:
        return {
            "messageId": self.message_id,
            "messageIndex": self.message_index,
            "tokenEstimate": self.token_estimate,
        }


@dataclass
class ContextState:
    """State for context management (pass between calls)."""
    cache_markers: list[CacheMarker]
    window_message_ids: list[str]
    messages_since_roll: int
    tokens_since_roll: int
    in_grace_period: bool
    last_roll_time: Optional[str] = None
    cached_start_message_id: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ContextState":
        return cls(
            cache_markers=[CacheMarker.from_dict(m) for m in data.get("cacheMarkers", [])],
            window_message_ids=data.get("windowMessageIds", []),
            messages_since_roll=data.get("messagesSinceRoll", 0),
            tokens_since_roll=data.get("tokensSinceRoll", 0),
            in_grace_period=data.get("inGracePeriod", False),
            last_roll_time=data.get("lastRollTime"),
            cached_start_message_id=data.get("cachedStartMessageId"),
        )

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {
            "cacheMarkers": [m.to_dict() for m in self.cache_markers],
            "windowMessageIds": self.window_message_ids,
            "messagesSinceRoll": self.messages_since_roll,
            "tokensSinceRoll": self.tokens_since_roll,
            "inGracePeriod": self.in_grace_period,
        }
        if self.last_roll_time:
            result["lastRollTime"] = self.last_roll_time
        if self.cached_start_message_id:
            result["cachedStartMessageId"] = self.cached_start_message_id
        return result


@dataclass
class ContextInfo:
    """Information about context processing in the response."""
    did_roll: bool
    messages_dropped: int
    messages_kept: int
    cache_markers: list[CacheMarker]
    cached_tokens: int
    uncached_tokens: int
    total_tokens: int
    hard_limit_hit: bool
    cached_start_message_id: Optional[str] = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ContextInfo":
        return cls(
            did_roll=data.get("didRoll", False),
            messages_dropped=data.get("messagesDropped", 0),
            messages_kept=data.get("messagesKept", 0),
            cache_markers=[CacheMarker.from_dict(m) for m in data.get("cacheMarkers", [])],
            cached_tokens=data.get("cachedTokens", 0),
            uncached_tokens=data.get("uncachedTokens", 0),
            total_tokens=data.get("totalTokens", 0),
            hard_limit_hit=data.get("hardLimitHit", False),
            cached_start_message_id=data.get("cachedStartMessageId"),
        )


# =============================================================================
# Request Data Class
# =============================================================================

@dataclass
class CompletionRequest:
    """Request configuration for LLM completion."""
    messages: list[Message | dict[str, Any]]
    model: Optional[str] = None
    provider: Optional[Provider] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    system: Optional[str] = None
    tools: Optional[list[ToolDefinition | dict[str, Any]]] = None
    tool_mode: Optional[ToolMode] = None  # auto, xml, native
    thinking: Optional[ThinkingConfig | dict[str, Any]] = None
    stop_sequences: Optional[list[str]] = None
    prompt_caching: Optional[bool] = None
    cache_ttl: Optional[CacheTtl] = None  # 5m, 1h
    max_participants_for_stop: Optional[int] = None
    provider_params: Optional[dict[str, Any]] = None  # Provider-specific passthrough
    formatter: Optional[Formatter] = None  # xml, native, completions
    retry: Optional[RetryConfig | dict[str, Any]] = None
    api_key: Optional[str] = None  # BYOK: Simple API key
    provider_config: Optional[ProviderConfigData | dict[str, Any]] = None  # BYOK: Full provider config

    def to_dict(self) -> dict[str, Any]:
        result: dict[str, Any] = {
            "messages": [
                m.to_dict() if isinstance(m, Message) else m
                for m in self.messages
            ],
        }

        if self.model:
            result["model"] = self.model
        if self.provider:
            result["provider"] = self.provider
        if self.max_tokens:
            result["maxTokens"] = self.max_tokens
        if self.temperature is not None:
            result["temperature"] = self.temperature
        if self.system:
            result["system"] = self.system
        if self.tools:
            result["tools"] = [
                t.to_dict() if isinstance(t, ToolDefinition) else t
                for t in self.tools
            ]
        if self.tool_mode:
            result["toolMode"] = self.tool_mode
        if self.thinking:
            if isinstance(self.thinking, ThinkingConfig):
                result["thinking"] = self.thinking.to_dict()
            else:
                result["thinking"] = self.thinking
        if self.stop_sequences:
            result["stopSequences"] = self.stop_sequences
        if self.prompt_caching is not None:
            result["promptCaching"] = self.prompt_caching
        if self.cache_ttl:
            result["cacheTtl"] = self.cache_ttl
        if self.max_participants_for_stop is not None:
            result["maxParticipantsForStop"] = self.max_participants_for_stop
        if self.provider_params:
            result["providerParams"] = self.provider_params
        if self.formatter:
            result["formatter"] = self.formatter
        if self.retry:
            if isinstance(self.retry, RetryConfig):
                result["retry"] = self.retry.to_dict()
            else:
                result["retry"] = self.retry
        if self.api_key:
            result["apiKey"] = self.api_key
        if self.provider_config:
            if isinstance(self.provider_config, ProviderConfigData):
                result["providerConfig"] = self.provider_config.to_dict()
            else:
                result["providerConfig"] = self.provider_config

        return result


# =============================================================================
# Response Data Classes
# =============================================================================

@dataclass
class UsageInfo:
    """Token usage information."""
    input_tokens: int = 0
    output_tokens: int = 0
    cache_creation_tokens: int = 0
    cache_read_tokens: int = 0

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "UsageInfo":
        return cls(
            input_tokens=data.get("inputTokens", 0),
            output_tokens=data.get("outputTokens", 0),
            cache_creation_tokens=data.get("cacheCreationTokens", 0),
            cache_read_tokens=data.get("cacheReadTokens", 0),
        )

    def to_dict(self) -> dict[str, int]:
        return {
            "inputTokens": self.input_tokens,
            "outputTokens": self.output_tokens,
            "cacheCreationTokens": self.cache_creation_tokens,
            "cacheReadTokens": self.cache_read_tokens,
        }


@dataclass
class CompletionResponse:
    """Response from LLM completion."""
    content: list[dict[str, Any]]
    raw_assistant_text: str
    tool_calls: list[dict[str, Any]]
    tool_results: list[dict[str, Any]]
    stop_reason: StopReason
    usage: UsageInfo
    model: str
    provider: str
    duration_ms: int
    session_id: Optional[str] = None
    requires_tool_results: bool = False
    context_state: Optional[ContextState] = None
    context_info: Optional[ContextInfo] = None

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "CompletionResponse":
        # Parse context if present
        context_state = None
        context_info = None
        if "context" in data:
            context_data = data["context"]
            if "state" in context_data:
                context_state = ContextState.from_dict(context_data["state"])
            if "info" in context_data:
                context_info = ContextInfo.from_dict(context_data["info"])

        return cls(
            content=data.get("content", []),
            raw_assistant_text=data.get("rawAssistantText", ""),
            tool_calls=data.get("toolCalls", []),
            tool_results=data.get("toolResults", []),
            stop_reason=data.get("stopReason", "end_turn"),
            usage=UsageInfo.from_dict(data.get("usage", {})),
            model=data.get("model", ""),
            provider=data.get("provider", ""),
            duration_ms=data.get("durationMs", 0),
            session_id=data.get("sessionId"),
            requires_tool_results=data.get("requiresToolResults", False),
            context_state=context_state,
            context_info=context_info,
        )

    @property
    def text(self) -> str:
        """Get the text content from the response."""
        return self.raw_assistant_text

    @property
    def input_tokens(self) -> int:
        return self.usage.input_tokens

    @property
    def output_tokens(self) -> int:
        return self.usage.output_tokens

    @property
    def total_tokens(self) -> int:
        return self.usage.input_tokens + self.usage.output_tokens


@dataclass
class HealthResponse:
    """Response from health endpoint."""
    status: Literal["ok", "degraded", "unhealthy"]
    version: str
    uptime: int
    providers: dict[str, dict[str, bool]]

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "HealthResponse":
        return cls(
            status=data.get("status", "unhealthy"),
            version=data.get("version", ""),
            uptime=data.get("uptime", 0),
            providers=data.get("providers", {}),
        )

    def is_healthy(self) -> bool:
        return self.status == "ok"

    def get_configured_providers(self) -> list[str]:
        return [name for name, status in self.providers.items() if status.get("configured")]

    def get_healthy_providers(self) -> list[str]:
        return [name for name, status in self.providers.items() 
                if status.get("configured") and status.get("healthy")]


@dataclass
class StatsResponse:
    """Response from stats endpoint."""
    uptime: int
    active_sessions: int
    active_streams: int
    providers: list[str]

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "StatsResponse":
        return cls(
            uptime=data.get("uptime", 0),
            active_sessions=data.get("activeSessions", 0),
            active_streams=data.get("activeStreams", 0),
            providers=data.get("providers", []),
        )


@dataclass
class ModelInfo:
    """Information about an available model."""
    id: str
    name: str
    provider: str
    context_window: int
    max_output: int
    supports_tools: bool
    supports_thinking: bool
    supports_images: bool

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ModelInfo":
        return cls(
            id=data.get("id", ""),
            name=data.get("name", ""),
            provider=data.get("provider", ""),
            context_window=data.get("contextWindow", 0),
            max_output=data.get("maxOutput", 0),
            supports_tools=data.get("supportsTools", False),
            supports_thinking=data.get("supportsThinking", False),
            supports_images=data.get("supportsImages", False),
        )


# =============================================================================
# Exceptions
# =============================================================================

class LLMError(Exception):
    """Error from membrane-api."""
    def __init__(self, code: str, message: str, retryable: bool = False, details: Any = None):
        super().__init__(message)
        self.code = code
        self.retryable = retryable
        self.details = details


# =============================================================================
# Client Class
# =============================================================================

class LLMClient:
    """
    Async client for membrane-api.

    Example:
        async with LLMClient() as client:
            response = await client.complete([
                {"participant": "User", "content": "Hello!"}
            ])
        
        # With BYOK (Bring Your Own Key):
        async with LLMClient(provider_api_key="sk-ant-...") as client:
            response = await client.complete([...], provider="anthropic")
        
        # With streaming and abortion:
        async with LLMClient() as client:
            stream_id = None
            async for event_type, data in client.stream([...]):
                if event_type == "stream_start":
                    stream_id = data["streamId"]
                elif event_type == "chunk":
                    print(data["text"], end="")
            
            # To abort mid-stream (in another coroutine):
            if stream_id:
                await client.abort_stream(stream_id)
    """

    def __init__(
        self,
        base_url: str = MEMBRANE_API_URL,
        api_token: Optional[str] = MEMBRANE_API_TOKEN or None,
        timeout: float = MEMBRANE_DEFAULT_TIMEOUT,
        provider_api_key: Optional[str] = None,  # BYOK: Default API key for requests
    ):
        self.base_url = base_url.rstrip("/")
        self.api_token = api_token
        self.timeout = timeout
        self.provider_api_key = provider_api_key  # Passed to requests by default
        self._client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self) -> "LLMClient":
        self._client = httpx.AsyncClient(
            base_url=self.base_url,
            timeout=self.timeout,
            headers=self._build_headers(),
        )
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        if self._client:
            await self._client.aclose()
            self._client = None

    def _build_headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.api_token:
            headers["Authorization"] = f"Bearer {self.api_token}"
        return headers

    def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            raise RuntimeError(
                "LLMClient must be used as async context manager, "
                "or use the module-level functions instead"
            )
        return self._client

    # =========================================================================
    # Core Completion Methods
    # =========================================================================

    async def complete(
        self,
        messages: list[Message | dict[str, Any]],
        api_key: Optional[str] = None,
        provider_config: Optional[dict[str, Any]] = None,
        **kwargs: Any,
    ) -> CompletionResponse:
        """
        Non-streaming completion.

        Args:
            messages: List of conversation messages
            api_key: Provider API key (BYOK). Falls back to client default, then server config.
            provider_config: Full provider configuration (for complex providers like Bedrock, openai-compatible)
            **kwargs: Additional request options (model, max_tokens, system, tools, tool_mode,
                      thinking, stop_sequences, prompt_caching, cache_ttl, formatter, retry, etc.)

        Returns:
            CompletionResponse with the LLM's response

        Raises:
            LLMError: If the API returns an error
        """
        # Use provided key, or fall back to client's default key
        effective_key = api_key or self.provider_api_key
        request = CompletionRequest(
            messages=messages, 
            api_key=effective_key, 
            provider_config=provider_config,
            **kwargs
        )
        client = self._get_client()

        response = await client.post("/v1/complete", json=request.to_dict())

        if response.status_code != 200:
            self._handle_error_response(response)

        return CompletionResponse.from_dict(response.json())

    async def stream(
        self,
        messages: list[Message | dict[str, Any]],
        api_key: Optional[str] = None,
        provider_config: Optional[dict[str, Any]] = None,
        **kwargs: Any,
    ) -> AsyncIterator[tuple[str, dict[str, Any]]]:
        """
        Streaming completion via SSE.

        Args:
            messages: List of conversation messages
            api_key: Provider API key (BYOK). Falls back to client default, then server config.
            provider_config: Full provider configuration (for complex providers)
            **kwargs: Additional request options

        Yields:
            Tuples of (event_type, data) where event_type is one of:
            - "stream_start": Stream started, data contains streamId for abortion
            - "chunk": Text chunk with metadata
            - "block_start": Content block started
            - "block_complete": Content block finished
            - "pre_tool_content": Text before tool calls (for UI preview)
            - "tool_calls": Tool calls requested (includes sessionId)
            - "usage": Token usage update
            - "done": Final response (parse with CompletionResponse.from_dict)
            - "error": Error occurred

        Raises:
            LLMError: If the API returns an error before streaming starts
        """
        effective_key = api_key or self.provider_api_key
        request = CompletionRequest(
            messages=messages, 
            api_key=effective_key, 
            provider_config=provider_config,
            **kwargs
        )
        client = self._get_client()

        async with client.stream(
            "POST",
            "/v1/stream",
            json=request.to_dict(),
        ) as response:
            if response.status_code != 200:
                # Read body for error details
                await response.aread()
                self._handle_error_response(response)

            event_type = "unknown"
            async for line in response.aiter_lines():
                line = line.strip()
                if not line:
                    continue

                if line.startswith("event: "):
                    event_type = line[7:]
                elif line.startswith("data: "):
                    data = json.loads(line[6:])
                    yield event_type, data

    async def continue_with_tools(
        self,
        session_id: str,
        tool_results: list[dict[str, Any]],
    ) -> AsyncIterator[tuple[str, dict[str, Any]]]:
        """
        Continue a conversation after executing tool calls.

        Args:
            session_id: Session ID from the tool_calls event
            tool_results: List of tool results, each with:
                - toolUseId: ID from the tool call
                - content: Result of tool execution (string or array)
                - isError: Optional, true if tool execution failed

        Yields:
            Same event tuples as stream()
        """
        client = self._get_client()

        async with client.stream(
            "POST",
            "/v1/continue",
            json={
                "sessionId": session_id,
                "toolResults": tool_results,
            },
        ) as response:
            if response.status_code != 200:
                await response.aread()
                self._handle_error_response(response)

            event_type = "unknown"
            async for line in response.aiter_lines():
                line = line.strip()
                if not line:
                    continue

                if line.startswith("event: "):
                    event_type = line[7:]
                elif line.startswith("data: "):
                    data = json.loads(line[6:])
                    yield event_type, data

    async def context_stream(
        self,
        messages: list[Message | dict[str, Any]],
        context_config: ContextConfig | dict[str, Any],
        context_state: Optional[ContextState | dict[str, Any]] = None,
        api_key: Optional[str] = None,
        provider_config: Optional[dict[str, Any]] = None,
        **kwargs: Any,
    ) -> AsyncIterator[tuple[str, dict[str, Any]]]:
        """
        Streaming completion with automatic context management.

        Handles rolling/truncation of long conversations, cache marker placement,
        and state management automatically.

        Args:
            messages: List of conversation messages
            context_config: Context management configuration (rolling, limits, cache)
            context_state: State from previous call (None for first call)
            api_key: Provider API key (BYOK)
            provider_config: Full provider configuration
            **kwargs: Additional request options

        Yields:
            Same event tuples as stream(), with "done" event containing
            context.state and context.info for the next call

        Example:
            state = None
            async for event_type, data in client.context_stream(
                messages=[...],
                context_config=ContextConfig(
                    rolling=RollingConfig(threshold=50, buffer=20)
                ),
                context_state=state
            ):
                if event_type == "done":
                    # Save state for next call
                    state = data.get("context", {}).get("state")
        """
        effective_key = api_key or self.provider_api_key

        # Build request body
        body: dict[str, Any] = {
            "messages": [
                m.to_dict() if isinstance(m, Message) else m
                for m in messages
            ],
        }

        # Add context config
        if isinstance(context_config, ContextConfig):
            body["contextConfig"] = context_config.to_dict()
        else:
            body["contextConfig"] = context_config

        # Add context state if provided
        if context_state:
            if isinstance(context_state, ContextState):
                body["contextState"] = context_state.to_dict()
            else:
                body["contextState"] = context_state

        # Add BYOK if provided
        if effective_key:
            body["apiKey"] = effective_key
        if provider_config:
            body["providerConfig"] = provider_config

        # Add additional kwargs (convert dataclasses to dicts)
        for key, value in kwargs.items():
            # Convert snake_case to camelCase
            camel_key = ''.join(
                word.capitalize() if i > 0 else word
                for i, word in enumerate(key.split('_'))
            )
            # Convert dataclass instances to dicts
            if hasattr(value, 'to_dict'):
                body[camel_key] = value.to_dict()
            else:
                body[camel_key] = value

        client = self._get_client()

        async with client.stream(
            "POST",
            "/v1/context/stream",
            json=body,
        ) as response:
            if response.status_code != 200:
                await response.aread()
                self._handle_error_response(response)

            event_type = "unknown"
            async for line in response.aiter_lines():
                line = line.strip()
                if not line:
                    continue

                if line.startswith("event: "):
                    event_type = line[7:]
                elif line.startswith("data: "):
                    data = json.loads(line[6:])
                    yield event_type, data

    # =========================================================================
    # Stream Management
    # =========================================================================

    async def abort_stream(self, stream_id: str) -> bool:
        """
        Abort an active streaming request.

        Args:
            stream_id: Stream ID from the stream_start event

        Returns:
            True if stream was aborted, False if not found

        Raises:
            LLMError: If the API returns an error
        """
        client = self._get_client()
        response = await client.post(f"/v1/abort/{stream_id}")

        if response.status_code == 404:
            return False
        elif response.status_code != 200:
            self._handle_error_response(response)

        return response.json().get("aborted", False)

    # =========================================================================
    # Session Management
    # =========================================================================

    async def delete_session(self, session_id: str) -> None:
        """
        Explicitly clean up a session before expiration.

        Sessions auto-expire after 5 minutes, but explicit cleanup is polite.

        Args:
            session_id: Session ID from tool_calls event
        """
        client = self._get_client()
        response = await client.delete(f"/v1/sessions/{session_id}")
        # 204 No Content is success, ignore other responses

    # =========================================================================
    # Information Endpoints
    # =========================================================================

    async def health(self) -> HealthResponse:
        """Check membrane-api health status."""
        client = self._get_client()
        response = await client.get("/health")
        return HealthResponse.from_dict(response.json())

    async def stats(self) -> StatsResponse:
        """Get server statistics (sessions, streams, providers)."""
        client = self._get_client()
        response = await client.get("/v1/stats")
        return StatsResponse.from_dict(response.json())

    async def models(self) -> tuple[list[ModelInfo], str]:
        """
        List available models.

        Returns:
            Tuple of (models list, default model ID)
        """
        client = self._get_client()
        response = await client.get("/v1/models")
        data = response.json()
        models = [ModelInfo.from_dict(m) for m in data.get("models", [])]
        default_model = data.get("defaultModel", "")
        return models, default_model

    # =========================================================================
    # Error Handling
    # =========================================================================

    def _handle_error_response(self, response: httpx.Response) -> None:
        """Parse error response and raise LLMError."""
        try:
            data = response.json()
            error = data.get("error", {})
            raise LLMError(
                code=error.get("code", "unknown_error"),
                message=error.get("message", response.text),
                retryable=error.get("retryable", False),
                details=error.get("details"),
            )
        except json.JSONDecodeError:
            raise LLMError(
                code="http_error",
                message=f"HTTP {response.status_code}: {response.text}",
                retryable=response.status_code >= 500,
            )


# =============================================================================
# Module-level convenience functions (create client per-request)
# =============================================================================

async def complete(
    messages: list[dict[str, Any]],
    api_key: Optional[str] = None,
    provider_config: Optional[dict[str, Any]] = None,
    **kwargs: Any,
) -> CompletionResponse:
    """
    Non-streaming completion (convenience function).

    Example:
        response = await complete([
            {"participant": "User", "content": "What is 2+2?"}
        ])
        print(response.text)
        
        # With BYOK (Anthropic):
        response = await complete([...], api_key="sk-ant-...", provider="anthropic")
        
        # With local LLM:
        response = await complete(
            [...],
            provider="openai-compatible",
            model="llama3",
            provider_config={"baseUrl": "http://localhost:11434/v1"}
        )
        
        # With extended thinking:
        response = await complete(
            [...],
            thinking={"enabled": True, "budgetTokens": 10000}
        )
        
        # With prompt caching:
        response = await complete(
            [...],
            prompt_caching=True,
            cache_ttl="1h"
        )
    """
    async with LLMClient() as client:
        return await client.complete(messages, api_key=api_key, provider_config=provider_config, **kwargs)


async def stream(
    messages: list[dict[str, Any]],
    api_key: Optional[str] = None,
    provider_config: Optional[dict[str, Any]] = None,
    **kwargs: Any,
) -> AsyncIterator[tuple[str, dict[str, Any]]]:
    """
    Streaming completion (convenience function).

    Example:
        stream_id = None
        async for event_type, data in stream([
            {"participant": "User", "content": "Tell me a joke"}
        ]):
            if event_type == "stream_start":
                stream_id = data["streamId"]
            elif event_type == "chunk":
                print(data["text"], end="", flush=True)
            elif event_type == "tool_calls":
                session_id = data["sessionId"]
                # Execute tools...
            elif event_type == "done":
                response = CompletionResponse.from_dict(data)
    """
    async with LLMClient() as client:
        async for event in client.stream(messages, api_key=api_key, provider_config=provider_config, **kwargs):
            yield event


async def context_stream(
    messages: list[dict[str, Any]],
    context_config: ContextConfig | dict[str, Any],
    context_state: Optional[ContextState | dict[str, Any]] = None,
    api_key: Optional[str] = None,
    provider_config: Optional[dict[str, Any]] = None,
    **kwargs: Any,
) -> AsyncIterator[tuple[str, dict[str, Any]]]:
    """
    Context-managed streaming completion (convenience function).

    Example:
        state = None
        for user_message in conversation:
            messages.append({"participant": "User", "content": user_message})
            
            async for event_type, data in context_stream(
                messages=messages,
                context_config={"rolling": {"threshold": 50, "buffer": 20}},
                context_state=state
            ):
                if event_type == "chunk":
                    print(data["text"], end="")
                elif event_type == "done":
                    state = data.get("context", {}).get("state")
                    messages.append({
                        "participant": "Claude",
                        "content": data["rawAssistantText"]
                    })
    """
    async with LLMClient() as client:
        async for event in client.context_stream(
            messages, 
            context_config, 
            context_state,
            api_key=api_key, 
            provider_config=provider_config, 
            **kwargs
        ):
            yield event


async def health() -> HealthResponse:
    """Check membrane-api health (convenience function)."""
    async with LLMClient() as client:
        return await client.health()


async def stats() -> StatsResponse:
    """Get server statistics (convenience function)."""
    async with LLMClient() as client:
        return await client.stats()


async def models() -> tuple[list[ModelInfo], str]:
    """List available models (convenience function)."""
    async with LLMClient() as client:
        return await client.models()


async def abort_stream(stream_id: str) -> bool:
    """Abort an active stream (convenience function)."""
    async with LLMClient() as client:
        return await client.abort_stream(stream_id)


async def delete_session(session_id: str) -> None:
    """Delete a session (convenience function)."""
    async with LLMClient() as client:
        await client.delete_session(session_id)


# =============================================================================
# Helper functions for common patterns
# =============================================================================

async def simple_chat(
    user_message: str,
    system: Optional[str] = None,
    model: Optional[str] = None,
    api_key: Optional[str] = None,
    **kwargs: Any,
) -> str:
    """
    Simple single-turn chat.

    Example:
        response = await simple_chat("What's the weather like?")
        
        # With BYOK:
        response = await simple_chat("Hello", api_key="sk-ant-...", provider="anthropic")
    """
    messages = [{"participant": "User", "content": user_message}]
    response = await complete(messages, system=system, model=model, api_key=api_key, **kwargs)
    return response.text


async def stream_chat(
    user_message: str,
    system: Optional[str] = None,
    model: Optional[str] = None,
    api_key: Optional[str] = None,
    **kwargs: Any,
) -> AsyncIterator[str]:
    """
    Simple streaming single-turn chat, yields text chunks only.

    Example:
        async for chunk in stream_chat("Tell me a story"):
            print(chunk, end="", flush=True)
    """
    messages = [{"participant": "User", "content": user_message}]
    async for event_type, data in stream(messages, system=system, model=model, api_key=api_key, **kwargs):
        if event_type == "chunk" and data.get("visible", True):
            yield data["text"]


async def run_with_tools(
    messages: list[dict[str, Any]],
    tools: list[dict[str, Any]],
    tool_executor: dict[str, Any],  # Maps tool name -> async callable
    max_iterations: int = 10,
    **kwargs: Any,
) -> CompletionResponse:
    """
    Run a conversation with automatic tool execution.

    Args:
        messages: Conversation messages
        tools: Tool definitions
        tool_executor: Dict mapping tool names to async functions
        max_iterations: Maximum tool execution rounds
        **kwargs: Additional completion options

    Returns:
        Final completion response after all tools executed

    Example:
        async def get_weather(location: str) -> str:
            return f"Weather in {location}: Sunny, 72°F"

        response = await run_with_tools(
            messages=[{"participant": "User", "content": "What's the weather in NYC?"}],
            tools=[{
                "name": "get_weather",
                "description": "Get current weather",
                "inputSchema": {
                    "type": "object",
                    "properties": {"location": {"type": "string"}},
                    "required": ["location"]
                }
            }],
            tool_executor={"get_weather": get_weather}
        )
    """
    session_id: Optional[str] = None
    iteration = 0
    final_response: Optional[CompletionResponse] = None

    async with LLMClient() as client:
        # Initial stream
        async for event_type, data in client.stream(messages, tools=tools, **kwargs):
            if event_type == "error":
                raise LLMError(
                    code=data.get("code", "unknown_error"),
                    message=data.get("message", "Unknown streaming error"),
                    retryable=data.get("retryable", False),
                )
            elif event_type == "tool_calls":
                session_id = data["sessionId"]
            elif event_type == "done":
                final_response = CompletionResponse.from_dict(data)

        if final_response is None:
            raise LLMError(
                code="incomplete_stream",
                message="Stream ended without a done event",
                retryable=False,
            )

        # Tool execution loop
        while (
            final_response.requires_tool_results 
            and session_id 
            and iteration < max_iterations
        ):
            iteration += 1

            # Execute tools
            results = []
            for call in final_response.tool_calls:
                tool_name = call["name"]
                tool_input = call["input"]
                tool_id = call["id"]

                try:
                    executor = tool_executor.get(tool_name)
                    if executor:
                        result = await executor(**tool_input)
                        results.append({
                            "toolUseId": tool_id,
                            "content": str(result),
                            "isError": False,
                        })
                    else:
                        results.append({
                            "toolUseId": tool_id,
                            "content": f"Tool '{tool_name}' not found",
                            "isError": True,
                        })
                except Exception as e:
                    results.append({
                        "toolUseId": tool_id,
                        "content": str(e),
                        "isError": True,
                    })

            # Continue with tool results
            continuation_response: Optional[CompletionResponse] = None
            async for event_type, data in client.continue_with_tools(session_id, results):
                if event_type == "error":
                    raise LLMError(
                        code=data.get("code", "unknown_error"),
                        message=data.get("message", "Unknown streaming error"),
                        retryable=data.get("retryable", False),
                    )
                elif event_type == "tool_calls":
                    session_id = data["sessionId"]
                elif event_type == "done":
                    continuation_response = CompletionResponse.from_dict(data)

            if continuation_response is None:
                raise LLMError(
                    code="incomplete_stream",
                    message="Continuation stream ended without a done event",
                    retryable=False,
                )
            final_response = continuation_response

        # Clean up session if still active
        if session_id and not final_response.requires_tool_results:
            await client.delete_session(session_id)

    return final_response
