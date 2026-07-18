"""
Chronicle - the dream's own memory (VPS side)

Ingests per-keyframe records pushed by the GPU (websocket message 0x05),
stores them in chronicle.sqlite + a thumbnail directory, and enforces
retention. Era segmentation, consolidation, and the biographer build on
this in later phases. See dream_gen's SPEC-chronicle.md.
"""

from .models import ChronicleKeyframe, get_chronicle_engine, init_chronicle_db
from .store import ChronicleStore, get_chronicle_store

__all__ = [
    "ChronicleKeyframe",
    "ChronicleStore",
    "get_chronicle_store",
    "get_chronicle_engine",
    "init_chronicle_db",
]
