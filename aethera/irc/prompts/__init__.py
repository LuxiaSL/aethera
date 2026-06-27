"""
IRC Prompt Templates and Examples

Contains:
- Few-shot examples organized by style
- System prompts and topic prefixes
- Collapse-specific example fragments
"""

from .templates import (
    COLLAPSE_EXAMPLES,
    STYLE_DESCRIPTIONS,
    get_collapse_suffix,
    get_style_topics,
)

__all__ = [
    "COLLAPSE_EXAMPLES",
    "STYLE_DESCRIPTIONS", 
    "get_collapse_suffix",
    "get_style_topics",
]

