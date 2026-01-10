"""
IRC Admin API Routes

Web-based control interface for the IRC generation pipeline.
Provides REST endpoints for session management and WebSocket for real-time updates.

This is a debugging/development tool, not for production use.
"""

import asyncio
import json
import logging
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Request
from fastapi.responses import JSONResponse, HTMLResponse
from pydantic import BaseModel

from aethera.irc.run_config import (
    GenerationRunConfig,
    SessionState,
    ProviderConfig,
    InferenceParams,
    PromptConfig,
    ControlMode,
    get_available_providers,
)
from aethera.irc.sessions import get_session_manager, Session
from aethera.irc.interactive import GenerationEvent, EventType
from aethera.irc.prompts.templates import (
    STYLE_DESCRIPTIONS,
    COLLAPSE_NAMES,
    EXAMPLES_DIR,
    build_system_prompt,
)
from aethera.irc.autoloom import (
    JUDGE_SYSTEM_PROMPT,
    JUDGE_USER_TEMPLATE_FIRST,
    JUDGE_USER_TEMPLATE_CONTINUATION,
)
from aethera.irc.models import CollapseType
from aethera.utils.templates import templates

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/irc/admin", tags=["irc-admin"])


# ==================== Pydantic Models ====================

class CreateSessionRequest(BaseModel):
    """Request to create a new session."""
    config: Optional[dict] = None


class UpdateConfigRequest(BaseModel):
    """Request to update session config."""
    changes: dict


class SelectCandidateRequest(BaseModel):
    """Request to select a candidate."""
    candidate_index: int


# ==================== HTML Page ====================

@router.get("", response_class=HTMLResponse)
async def admin_page(request: Request):
    """Serve the admin control panel page."""
    return templates.TemplateResponse(
        request=request,
        name="irc/admin.html",
        context={"title": "IRC Admin"}
    )


# ==================== REST Endpoints ====================

@router.post("/sessions")
async def create_session(request: CreateSessionRequest):
    """
    Create a new generation session.
    
    Returns the session ID and initial state.
    """
    manager = get_session_manager()
    
    # Parse config from request or use defaults
    if request.config:
        config = GenerationRunConfig.from_dict(request.config)
    else:
        config = GenerationRunConfig()
    
    try:
        session = await manager.create_session(config)
        return JSONResponse({
            "session_id": session.session_id,
            "state": session.get_state().to_dict(),
        })
    except RuntimeError as e:
        raise HTTPException(status_code=429, detail=str(e))


@router.get("/sessions")
async def list_sessions():
    """List all active sessions."""
    manager = get_session_manager()
    sessions = manager.list_sessions()
    return JSONResponse({
        "sessions": [s.to_dict() for s in sessions]
    })


@router.get("/sessions/{session_id}")
async def get_session(session_id: str):
    """Get a specific session's state."""
    manager = get_session_manager()
    session = manager.get_session(session_id)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return JSONResponse(session.get_state().to_dict())


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a session."""
    manager = get_session_manager()
    success = await manager.delete_session(session_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return JSONResponse({"success": True})


@router.get("/providers")
async def get_providers():
    """Get available providers and their models."""
    providers = get_available_providers()
    return JSONResponse({
        "providers": [p.to_dict() for p in providers]
    })


@router.get("/examples")
async def get_examples():
    """Get available example files organized by style."""
    examples = {}
    
    for style in STYLE_DESCRIPTIONS:
        style_dir = EXAMPLES_DIR / style
        if style_dir.exists():
            files = [f.name for f in style_dir.glob("*.txt")]
            examples[style] = sorted(files)
    
    return JSONResponse({
        "styles": examples
    })


@router.get("/templates")
async def get_templates():
    """Get prompt templates."""
    collapse_examples = {}
    for ctype in CollapseType:
        from aethera.irc.prompts.templates import COLLAPSE_EXAMPLES
        collapse_examples[ctype.value] = COLLAPSE_EXAMPLES.get(ctype, "")
    
    return JSONResponse({
        "system_prompt": build_system_prompt(),
        "collapse_examples": collapse_examples,
        "styles": list(STYLE_DESCRIPTIONS.keys()),
        "collapse_types": [ct.value for ct in CollapseType],
    })


@router.get("/config-schema")
async def get_config_schema():
    """Get the configuration schema for the UI."""
    return JSONResponse({
        "control_modes": [m.value for m in ControlMode],
        "styles": list(STYLE_DESCRIPTIONS.keys()),
        "collapse_types": [ct.value for ct in CollapseType],
        "defaults": GenerationRunConfig().to_dict(),
    })


@router.get("/prompts/defaults")
async def get_default_prompts():
    """
    Get the default prompts for generation and judging.
    
    Returns all default prompts that can be customized via PromptConfig.
    Includes documentation about available template variables.
    """
    return JSONResponse({
        "generation": {
            "system_prompt": {
                "content": build_system_prompt(),
                "description": "System prompt for the generation model. Sets the CLI simulation mode.",
                "variables": [],
            },
        },
        "judge": {
            "system_prompt": {
                "content": JUDGE_SYSTEM_PROMPT,
                "description": "System prompt for the judge model. Defines evaluation criteria.",
                "variables": [],
            },
            "user_template_first": {
                "content": JUDGE_USER_TEMPLATE_FIRST,
                "description": "User prompt template for the first chunk (no prior context).",
                "variables": [
                    {"name": "target_messages", "description": "Target message count for the fragment"},
                    {"name": "num_candidates", "description": "Number of candidates to evaluate"},
                    {"name": "candidates", "description": "Formatted candidate blocks with content"},
                ],
            },
            "user_template": {
                "content": JUDGE_USER_TEMPLATE_CONTINUATION,
                "description": "User prompt template for continuation chunks (with prior context).",
                "variables": [
                    {"name": "current_messages", "description": "Current message count so far"},
                    {"name": "target_messages", "description": "Target message count for the fragment"},
                    {"name": "progress_pct", "description": "Progress percentage (e.g., 45.0)"},
                    {"name": "pacing_guidance", "description": "Auto-generated pacing advice based on progress"},
                    {"name": "context", "description": "The conversation so far (IRC-formatted)"},
                    {"name": "num_candidates", "description": "Number of candidates to evaluate"},
                    {"name": "candidates", "description": "Formatted candidate blocks with content"},
                ],
            },
        },
    })


# ==================== WebSocket Endpoint ====================

@router.websocket("/ws/{session_id}")
async def session_websocket(websocket: WebSocket, session_id: str):
    """
    WebSocket endpoint for real-time session updates.
    
    Server → Client messages:
    - { type: "started" }
    - { type: "candidates", chunk: N, candidates: [...] }
    - { type: "judgment", selected_index: N, scores: [...], reasoning: "..." }
    - { type: "progress", chunk: N, messages: N, target: N, ... }
    - { type: "waiting", mode: "select"|"confirm" }
    - { type: "transcript", lines: [...], new_lines: [...] }
    - { type: "complete", transcript: "...", stats: {...} }
    - { type: "error", message: "...", recoverable: bool }
    - { type: "log", level: "...", message: "..." }
    
    Client → Server messages:
    - { type: "start" }
    - { type: "stop" }
    - { type: "continue" }
    - { type: "select", candidate_index: N }
    - { type: "update_config", changes: {...} }
    - { type: "get_state" }
    """
    manager = get_session_manager()
    session = manager.get_session(session_id)
    
    if not session:
        await websocket.close(code=4004, reason="Session not found")
        return
    
    await websocket.accept()
    logger.info(f"WebSocket connected for session {session_id}")
    
    # Event callback to send events to this WebSocket
    async def send_event(event: GenerationEvent):
        try:
            await websocket.send_json({
                "type": event.type.value,
                "timestamp": event.timestamp,
                **event.data,
            })
        except Exception as e:
            logger.warning(f"Failed to send event: {e}")
    
    session.add_event_callback(send_event)
    
    try:
        # Send initial state
        await websocket.send_json({
            "type": "state",
            **session.get_state().to_dict(),
        })
        
        while True:
            try:
                data = await websocket.receive_json()
                msg_type = data.get("type")
                
                if msg_type == "start":
                    await session.start()
                
                elif msg_type == "stop":
                    session.stop()
                
                elif msg_type == "continue":
                    session.provide_confirmation()
                
                elif msg_type == "select":
                    candidate_index = data.get("candidate_index")
                    if candidate_index is not None:
                        session.provide_selection(candidate_index)
                
                elif msg_type == "update_config":
                    changes = data.get("changes", {})
                    session.update_config(changes)
                    await websocket.send_json({
                        "type": "config_updated",
                        "config": session.config.to_dict(),
                    })
                
                elif msg_type == "get_state":
                    await websocket.send_json({
                        "type": "state",
                        **session.get_state().to_dict(),
                    })
                
                else:
                    logger.warning(f"Unknown message type: {msg_type}")
                    
            except WebSocketDisconnect:
                break
            except json.JSONDecodeError:
                logger.warning("Invalid JSON received")
            except Exception as e:
                logger.error(f"WebSocket error: {e}")
                await websocket.send_json({
                    "type": "error",
                    "message": str(e),
                    "recoverable": True,
                })
    
    finally:
        session.remove_event_callback(send_event)
        logger.info(f"WebSocket disconnected for session {session_id}")

