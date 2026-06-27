# IRC Admin Web UI Specification

> Full debugging and control interface for the IRC generation pipeline.
> Personal use tool for parameter tuning, model comparison, and interactive generation.

**Created:** 2026-01-09  
**Status:** Specification Complete, Implementation Pending

---

## Table of Contents

1. [Overview](#overview)
2. [Current State Audit](#current-state-audit)
3. [Goals & Requirements](#goals--requirements)
4. [Architecture Design](#architecture-design)
5. [Configuration Schema](#configuration-schema)
6. [API Design](#api-design)
7. [WebSocket Protocol](#websocket-protocol)
8. [Frontend Components](#frontend-components)
9. [Implementation Phases](#implementation-phases)
10. [File Changes Summary](#file-changes-summary)

---

## Overview

### Purpose

Create a web-based interface for full control over the IRC fragment generation pipeline. This enables:

- **Parameter tuning**: Adjust temperatures, batch sizes, thresholds on the fly
- **Model comparison**: Test different providers/models side-by-side
- **Interactive generation**: Step through the process, make manual selections
- **Debugging**: Full visibility into prompts, candidates, judgments, and decisions

### Target Users

- Developers tuning the generation pipeline
- Artists curating output quality
- Anyone wanting to understand how the system works

### Non-Goals

- Not for production use (no auth, no rate limiting)
- Not meant to be pretty (functional over aesthetic)
- Not replacing the autonomous generation system

---

## Current State Audit

### What's Already Configurable

| Parameter | Location | Type | Default |
|-----------|----------|------|---------|
| `generation_provider` | `config.py` (env) | str | `"anthropic"` |
| `generation_model` | `config.py` (env) | str | `"claude-3-opus-20240229"` |
| `judge_provider` | `config.py` (env) | str | `"openai"` |
| `judge_model` | `config.py` (env) | str | `"o3"` |
| `candidates_per_batch` | `config.py` (env) | int | `10` |
| `tokens_per_candidate` | `config.py` (env) | int | `100` |
| `examples_per_prompt` | `config.py` (env) | int | `4` |
| `autoloom_threshold` | `config.py` (env) | float | `0.4` |
| `use_instruct_mode` | `config.py` (env) | bool | `True` |

### What's Hardcoded (Needs Exposure)

| Parameter | Current Value | Location | Notes |
|-----------|---------------|----------|-------|
| `temperature` (generation) | `0.9` | `generator.py:366` | In `_generate_batch_candidates` |
| `temperature` (judge) | `0.3` or `1.0` | `autoloom.py:163-167` | `1.0` for reasoning models |
| `top_p` | Not used | All providers | Supported but not passed |
| `stop_sequences` | `["\n---", "$ cat", "[LOG:"]` | `generator.py:344` | Hardcoded list |
| `max_tokens` (judge) | `800` or `16000` | `autoloom.py:163-167` | `16000` for reasoning models |
| `system_prompt` | Built by `build_system_prompt()` | `templates.py:306-313` | Not customizable |
| `scaffold_prompt` | Built by `build_scaffold_prompt()` | `templates.py:221-303` | Not customizable |
| Example selection | Random | `templates.py:140-163` | Can't pick specific files |
| `style` | Random or forced | `generator.py` | Not in runtime config |
| `collapse_type` | Random or forced | `generator.py` | Not in runtime config |
| `target_messages` | Random 25-40 | `generator.py:175` | Not in runtime config |
| `min_collapse_percentage` | `0.6` | `GenerationConfig` | Not runtime adjustable |
| `max_chunks` | `20` (implicit) | N/A | Not configurable |

### Providers Already Implemented

| Provider | File | Supports `n` | Supports Caching | Notes |
|----------|------|--------------|------------------|-------|
| Anthropic | `providers/anthropic.py` | No | Yes (beta API) | Claude models |
| OpenAI | `providers/openai.py` | Yes | Automatic | GPT-4, o1, o3 |
| OpenRouter | `providers/openrouter.py` | Model-dependent | Model-dependent | Unified API |
| Local/Compatible | `providers/openai_compatible.py` | No | No | vLLM, ollama, etc. |

### User Intervention Points (Currently None)

The generation loop runs autonomously with no pause points for user input.

---

## Goals & Requirements

### Functional Requirements

#### FR1: Provider & Model Selection
- [ ] Select generation provider from available options
- [ ] Select generation model (dynamic list based on provider)
- [ ] Select judge provider from available options
- [ ] Select judge model (dynamic list based on provider)
- [ ] Support for local/custom endpoints

#### FR2: Inference Parameter Control
- [ ] Generation temperature (0.0 - 2.0 slider)
- [ ] Generation top_p (0.0 - 1.0 slider)
- [ ] Generation max_tokens per candidate
- [ ] Generation stop sequences (editable list)
- [ ] Judge temperature
- [ ] Judge top_p
- [ ] Judge max_tokens

#### FR3: Generation Loop Control
- [ ] Candidates per batch (1-20)
- [ ] Max chunks/rounds limit
- [ ] Target message count
- [ ] Target user count
- [ ] Min collapse percentage threshold
- [ ] Autoloom quality threshold

#### FR4: Fragment Parameters
- [ ] Style selection (technical, philosophical, chaotic, random)
- [ ] Collapse type selection (netsplit, gline, etc., random)
- [ ] Channel name

#### FR5: Prompt Customization
- [ ] View current system prompt
- [ ] Edit/override system prompt
- [ ] View scaffold prompt template
- [ ] Select specific example files (vs random)
- [ ] Preview complete prompt before generation

#### FR6: User Control Modes
- [ ] **Autonomous**: Runs to completion, shows results
- [ ] **Confirm Step**: Pauses after each chunk, shows judge decision, waits for Continue
- [ ] **Manual Select**: Pauses after candidates generated, user picks winner

#### FR7: Real-time Visibility
- [ ] Live generation log stream
- [ ] Candidate comparison view (all candidates side-by-side)
- [ ] Judge scores and reasoning display
- [ ] Progress indicator (messages/target, chunks)
- [ ] Cost and token tracking
- [ ] Current accumulated transcript

#### FR8: Results & Export
- [ ] View final transcript
- [ ] Export as text file
- [ ] Optionally save to database
- [ ] View generation stats (cost, tokens, time)

### Non-Functional Requirements

- **Latency**: UI updates should feel real-time (<100ms perceived)
- **Recovery**: Should handle WebSocket disconnects gracefully
- **State**: Session state should persist across page reloads (within reason)
- **Simplicity**: Functional UI, not overly polished

---

## Architecture Design

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Control Panel  │  │   Live View     │  │  Results    │ │
│  │  - Providers    │  │  - Log stream   │  │  - Export   │ │
│  │  - Parameters   │  │  - Candidates   │  │  - Stats    │ │
│  │  - Mode select  │  │  - Selections   │  │  - Save     │ │
│  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘ │
│           │                    │                   │        │
│           └────────────┬───────┴───────────────────┘        │
│                        │ WebSocket                          │
└────────────────────────┼────────────────────────────────────┘
                         │
┌────────────────────────┼────────────────────────────────────┐
│                    FastAPI Server                            │
│  ┌─────────────────────┴──────────────────────────────────┐ │
│  │              /api/irc/admin/* endpoints                 │ │
│  │              /ws/irc/admin/{session_id}                 │ │
│  └─────────────────────┬──────────────────────────────────┘ │
│                        │                                     │
│  ┌─────────────────────┴──────────────────────────────────┐ │
│  │              Session Manager                            │ │
│  │  - Active sessions (in-memory)                          │ │
│  │  - State serialization                                  │ │
│  │  - WebSocket registry                                   │ │
│  └─────────────────────┬──────────────────────────────────┘ │
│                        │                                     │
│  ┌─────────────────────┴──────────────────────────────────┐ │
│  │              Interactive Generator                      │ │
│  │  - Step-by-step execution                               │ │
│  │  - Pause/resume capability                              │ │
│  │  - User selection injection                             │ │
│  └─────────────────────┬──────────────────────────────────┘ │
│                        │                                     │
│  ┌─────────────────────┴──────────────────────────────────┐ │
│  │         Existing IRC Module (generator, autoloom, etc.) │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Session Lifecycle

```
1. CREATE SESSION
   POST /api/irc/admin/sessions
   → Returns session_id
   → Client connects WebSocket

2. CONFIGURE
   WS: {type: "update_config", changes: {...}}
   → Server validates and applies

3. START GENERATION
   WS: {type: "start"}
   → Server begins generation loop

4. LOOP (per chunk):
   a. Server generates candidates
      → WS: {type: "candidates", data: [...]}
   
   b. If mode == "manual_select":
      → WS: {type: "waiting_for_input", mode: "select"}
      → Client: {type: "select", candidate_index: N}
   
   c. If mode == "confirm_step":
      → Server runs judge
      → WS: {type: "judgment", data: {...}}
      → WS: {type: "waiting_for_input", mode: "confirm"}
      → Client: {type: "continue"}
   
   d. If mode == "autonomous":
      → Server runs judge, applies selection, continues
   
   e. Server updates state
      → WS: {type: "progress", data: {...}}
   
   f. Check for completion/collapse

5. COMPLETE
   → WS: {type: "complete", data: {transcript, stats}}

6. CLEANUP
   DELETE /api/irc/admin/sessions/{id}
   → Or auto-cleanup after timeout
```

---

## Configuration Schema

### Runtime Configuration (`irc/run_config.py`)

```python
from dataclasses import dataclass, field
from typing import Optional, Literal
from enum import Enum


class ControlMode(str, Enum):
    """User control mode for generation."""
    AUTONOMOUS = "autonomous"      # Runs to completion
    CONFIRM_STEP = "confirm_step"  # Pause after each judgment
    MANUAL_SELECT = "manual_select"  # User picks winner


@dataclass
class InferenceParams:
    """Parameters for a single inference request."""
    temperature: float = 0.9
    top_p: float = 1.0
    max_tokens: int = 100
    stop_sequences: list[str] = field(default_factory=list)
    
    def validate(self):
        assert 0.0 <= self.temperature <= 2.0
        assert 0.0 <= self.top_p <= 1.0
        assert self.max_tokens > 0


@dataclass 
class ProviderConfig:
    """Configuration for a provider + model combination."""
    provider: str  # anthropic, openai, openrouter, local
    model: str
    params: InferenceParams = field(default_factory=InferenceParams)
    
    # For local provider
    base_url: Optional[str] = None
    api_key: Optional[str] = None


@dataclass
class PromptConfig:
    """Prompt customization options."""
    system_prompt: Optional[str] = None  # None = use default
    example_files: list[str] = field(default_factory=list)  # Empty = random
    custom_scaffold: Optional[str] = None  # Full override
    examples_count: int = 4  # If using random


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
```

### Provider Discovery Response

```python
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


# Example response for GET /api/irc/admin/providers
{
    "providers": [
        {
            "name": "anthropic",
            "display_name": "Anthropic (Claude)",
            "models": ["claude-3-5-sonnet-20241022", "claude-3-opus-20240229", ...],
            "supports_n": false,
            "supports_caching": true,
            "requires_api_key": true,
            "api_key_env_var": "ANTHROPIC_API_KEY",
            "has_api_key": true
        },
        ...
    ]
}
```

---

## API Design

### REST Endpoints

#### Session Management

```
POST /api/irc/admin/sessions
    Request: { config: GenerationRunConfig }
    Response: { session_id: str, state: SessionState }
    
GET /api/irc/admin/sessions
    Response: { sessions: [SessionState, ...] }
    
GET /api/irc/admin/sessions/{session_id}
    Response: SessionState
    
DELETE /api/irc/admin/sessions/{session_id}
    Response: { success: bool }
```

#### Discovery

```
GET /api/irc/admin/providers
    Response: { providers: [ProviderInfo, ...] }

GET /api/irc/admin/examples
    Response: { 
        styles: {
            "technical": ["cto_hostname.txt", "cs_rap_battle.txt", ...],
            "philosophical": [...],
            "chaotic": [...]
        }
    }

GET /api/irc/admin/templates
    Response: {
        system_prompt: str,
        scaffold_template: str,
        collapse_examples: { [type]: str }
    }
```

#### Preview (Optional)

```
POST /api/irc/admin/preview-prompt
    Request: { config: GenerationRunConfig }
    Response: { 
        full_prompt: str,
        stable_prefix: str,
        target_intro: str,
        prefill: str,
        estimated_tokens: int
    }
```

### WebSocket Endpoint

```
WS /ws/irc/admin/{session_id}
```

---

## WebSocket Protocol

### Server → Client Messages

```typescript
// Generation started
{ type: "started" }

// Candidates generated (before judgment)
{ 
    type: "candidates",
    chunk: number,
    candidates: [{
        index: number,
        content: string,
        has_collapse: boolean,
        line_count: number
    }, ...]
}

// Judgment complete (after autoloom)
{
    type: "judgment",
    selected_index: number | null,
    scores: number[],
    reasoning: string
}

// Progress update
{
    type: "progress",
    chunk: number,
    messages: number,
    target: number,
    tokens_used: number,
    cost_usd: number
}

// Waiting for user input
{
    type: "waiting",
    mode: "select" | "confirm",
    timeout_seconds: number | null
}

// Transcript updated
{
    type: "transcript",
    lines: string[],
    new_lines: string[]
}

// Generation complete
{
    type: "complete",
    transcript: string,
    stats: {
        chunks: number,
        messages: number,
        tokens: number,
        cost: number,
        duration_ms: number
    }
}

// Error occurred
{
    type: "error",
    message: string,
    recoverable: boolean
}

// Log message (for debug stream)
{
    type: "log",
    level: "debug" | "info" | "warning" | "error",
    message: string,
    timestamp: string
}
```

### Client → Server Messages

```typescript
// Start generation
{ type: "start" }

// Stop/pause generation
{ type: "stop" }

// Continue (confirm_step mode)
{ type: "continue" }

// Manual selection (manual_select mode)
{ 
    type: "select",
    candidate_index: number
}

// Update config mid-session (if paused)
{
    type: "update_config",
    changes: Partial<GenerationRunConfig>
}

// Request current state
{ type: "get_state" }
```

---

## Frontend Components

### Page Structure

```
/irc/admin  →  IRC Admin Control Panel

┌──────────────────────────────────────────────────────────────┐
│  IRC Generation Control Panel                          [?]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐  ┌────────────────────────────────┐│
│  │   CONFIGURATION     │  │        LIVE VIEW               ││
│  │                     │  │                                ││
│  │  Provider Settings  │  │  ┌────────────────────────┐   ││
│  │  ├─ Generation      │  │  │     Progress Bar       │   ││
│  │  │  └─ Model        │  │  │  12/25 messages        │   ││
│  │  │  └─ Temp: [====] │  │  └────────────────────────┘   ││
│  │  │  └─ Top-p        │  │                                ││
│  │  ├─ Judge           │  │  ┌────────────────────────┐   ││
│  │  │  └─ Model        │  │  │   Log Stream           │   ││
│  │  │  └─ Temp         │  │  │   [scrolling log]      │   ││
│  │  │                  │  │  │                        │   ││
│  │  Fragment Params    │  │  └────────────────────────┘   ││
│  │  ├─ Style: [▼]      │  │                                ││
│  │  ├─ Collapse: [▼]   │  │  ┌────────────────────────┐   ││
│  │  ├─ Target msgs     │  │  │   Candidates           │   ││
│  │  │                  │  │  │  ┌──────┐ ┌──────┐     │   ││
│  │  Loop Settings      │  │  │  │ C1   │ │ C2   │ ... │   ││
│  │  ├─ Batch size      │  │  │  │      │ │      │     │   ││
│  │  ├─ Max chunks      │  │  │  │[sel] │ │      │     │   ││
│  │  ├─ Threshold       │  │  │  └──────┘ └──────┘     │   ││
│  │  │                  │  │  └────────────────────────┘   ││
│  │  Control Mode       │  │                                ││
│  │  ○ Autonomous       │  │  ┌────────────────────────┐   ││
│  │  ○ Confirm Step     │  │  │   Transcript           │   ││
│  │  ● Manual Select    │  │  │   [accumulated IRC]    │   ││
│  │                     │  │  │                        │   ││
│  │  [START] [STOP]     │  │  └────────────────────────┘   ││
│  │                     │  │                                ││
│  └─────────────────────┘  └────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  Stats: Tokens: 12,345 | Cost: $0.0234 | Time: 45s      ││
│  │  [Export TXT] [Save to DB] [Copy]                        ││
│  └──────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. Configuration Panel (`irc-admin-config.js`)

- **Provider Selection**
  - Dropdown for provider
  - Dropdown for model (filtered by provider)
  - Temperature slider (0-2, step 0.1)
  - Top-p slider (0-1, step 0.05)
  - Max tokens input

- **Fragment Parameters**
  - Style dropdown (+ random option)
  - Collapse type dropdown (+ random option)
  - Target messages input
  - Target users input

- **Loop Settings**
  - Candidates per batch input
  - Max chunks input
  - Collapse percentage slider
  - Autoloom threshold slider

- **Control Mode**
  - Radio buttons: autonomous / confirm_step / manual_select
  - Dry run checkbox

- **Actions**
  - Start button
  - Stop button
  - Reset button

#### 2. Live View Panel (`irc-admin-live.js`)

- **Progress Bar**
  - Visual progress (messages / target)
  - Chunk counter
  - Phase indicator (opening / middle / ending)

- **Log Stream**
  - Auto-scrolling log output
  - Color-coded by level
  - Timestamps
  - Filter by level

- **Candidates View**
  - Grid or tabs for N candidates
  - Syntax highlighting for IRC format
  - Collapse marker indicators
  - Line count badges
  - Selection highlight (judge's pick or user's)
  - Click-to-select in manual mode

- **Transcript View**
  - Running transcript (IRC formatted)
  - New lines highlighted
  - Collapse detection indicator

#### 3. Results Panel (`irc-admin-results.js`)

- **Stats Display**
  - Total tokens
  - Estimated cost
  - Generation time
  - Chunk count
  - Message count

- **Export Options**
  - Download as .txt
  - Copy to clipboard
  - Save to database (with rating)

### CSS (`static/css/irc-admin.css`)

- Dark theme consistent with site
- Monospace font for IRC content
- Scrollable panels
- Responsive layout (collapsible on mobile)
- Candidate card styling
- Progress bar styling
- Log level colors

---

## Implementation Phases

### Phase 1: Configuration Foundation (~3 hours)

**Goal:** Make all parameters configurable at runtime.

**Tasks:**
1. Create `aethera/irc/run_config.py` with all dataclasses
2. Add `top_p` parameter to all provider `complete*` methods:
   - `providers/anthropic.py`
   - `providers/openai.py`
   - `providers/openrouter.py`
   - `providers/openai_compatible.py`
   - `providers/base.py` (update interface)
3. Update `generator.py` to accept `GenerationRunConfig`
4. Update `autoloom.py` to accept inference params per-call
5. Thread parameters through entire call chain

**Files Changed:**
- New: `aethera/irc/run_config.py`
- Modified: `aethera/irc/providers/*.py`
- Modified: `aethera/irc/generator.py`
- Modified: `aethera/irc/autoloom.py`
- Modified: `aethera/irc/__init__.py`

### Phase 2: Interactive Generator (~5 hours)

**Goal:** Refactor generator to support step-by-step execution with pause points.

**Tasks:**
1. Create `InteractiveGenerator` class that wraps `IRCGenerator`
2. Implement step-by-step execution:
   - `generate_candidates()` → returns candidates
   - `apply_judgment()` → applies autoloom
   - `apply_selection(index)` → applies user selection
   - `get_state()` → returns serializable state
3. Add pause/resume capability
4. Add event emission for real-time updates
5. Create mock provider for dry-run mode

**Files Changed:**
- New: `aethera/irc/interactive.py`
- Modified: `aethera/irc/generator.py` (extract shared logic)
- Modified: `aethera/irc/__init__.py`

### Phase 3: Session Management & API (~4 hours)

**Goal:** Build API layer for session management and WebSocket communication.

**Tasks:**
1. Create session manager (in-memory sessions with cleanup)
2. Implement REST endpoints:
   - Session CRUD
   - Provider discovery
   - Example listing
3. Implement WebSocket handler:
   - Connection management
   - Message routing
   - State synchronization
4. Add logging/debug output streaming

**Files Changed:**
- New: `aethera/irc/sessions.py`
- New: `aethera/api/irc_admin.py`
- Modified: `aethera/main.py` (add router)

### Phase 4: Frontend - Control Panel (~4 hours)

**Goal:** Build configuration UI.

**Tasks:**
1. Create template `templates/irc/admin.html`
2. Build control panel JavaScript:
   - Form generation from config schema
   - Provider/model dropdowns with dynamic options
   - Sliders and inputs with validation
   - Control mode selection
3. Basic styling

**Files Changed:**
- New: `aethera/templates/irc/admin.html`
- New: `aethera/static/js/irc-admin.js`
- New: `aethera/static/css/irc-admin.css`

### Phase 5: Frontend - Live View (~5 hours)

**Goal:** Build real-time generation view.

**Tasks:**
1. WebSocket connection management
2. Log stream component (auto-scroll, filtering)
3. Progress indicator
4. Candidate display grid
5. Transcript view
6. Manual selection UI

**Files Changed:**
- Modified: `aethera/static/js/irc-admin.js`
- Modified: `aethera/static/css/irc-admin.css`

### Phase 6: Polish & Testing (~3 hours)

**Goal:** Error handling, edge cases, UX improvements.

**Tasks:**
1. Handle WebSocket disconnects/reconnects
2. Handle generation errors gracefully
3. Add loading states
4. Add keyboard shortcuts
5. Test all control modes
6. Test with different providers

---

## File Changes Summary

### New Files

| File | Purpose |
|------|---------|
| `aethera/irc/run_config.py` | Runtime configuration dataclasses |
| `aethera/irc/interactive.py` | Interactive generator with pause/resume |
| `aethera/irc/sessions.py` | Session management |
| `aethera/api/irc_admin.py` | Admin API endpoints + WebSocket |
| `aethera/templates/irc/admin.html` | Admin UI template |
| `aethera/static/js/irc-admin.js` | Admin UI JavaScript |
| `aethera/static/css/irc-admin.css` | Admin UI styles |

### Modified Files

| File | Changes |
|------|---------|
| `aethera/irc/providers/base.py` | Add `top_p` to interface |
| `aethera/irc/providers/anthropic.py` | Add `top_p` parameter |
| `aethera/irc/providers/openai.py` | Add `top_p` parameter |
| `aethera/irc/providers/openrouter.py` | Add `top_p` parameter |
| `aethera/irc/providers/openai_compatible.py` | Add `top_p` parameter |
| `aethera/irc/generator.py` | Accept runtime config, extract shared logic |
| `aethera/irc/autoloom.py` | Accept inference params per-call |
| `aethera/irc/__init__.py` | Export new classes |
| `aethera/main.py` | Add irc_admin router |

---

## Open Questions / Future Enhancements

1. **Persistence**: Should session state survive server restarts? (Probably not for v1)
2. **Multi-user**: Need any access control? (Probably not for personal use)
3. **History**: Keep history of past sessions? (Nice to have)
4. **Presets**: Save/load configuration presets? (Nice to have)
5. **A/B Compare**: Run two configs side-by-side? (Future)
6. **Batch Mode**: Queue multiple generations? (Future)

---

## References

- Current IRC spec: `docs/IRC_DISCORD_BOT_SPEC.md`
- Test harness (reference implementation): `test_generation_inspect.py`
- Provider implementations: `aethera/irc/providers/`
- Prompt templates: `aethera/irc/prompts/templates.py`

