"""
IRC Prompt Templates

Templates and configuration for IRC generation prompts.
Uses timestamped examples with metadata headers for better model steering.
"""

import os
import random
from pathlib import Path
from typing import Optional

from ..models import CollapseType, PacingStyle


# Path to example files
EXAMPLES_DIR = Path(__file__).parent / "examples"


# Style descriptions and associated topics
STYLE_DESCRIPTIONS = {
    "technical": {
        "description": "Technical discussion, programming, system administration",
        "topics": [
            "programming", "debugging", "linux", "networking", "security",
            "hardware", "databases", "devops", "algorithms", "compilers",
            "kernel", "embedded", "reverse_engineering", "crypto",
        ],
        "nicks": [
            "zero", "root_", "xen0", "null_ptr", "kernel_panic",
            "segfault", "chmod777", "sudo_", "localhost", "0xdeadbeef",
        ],
        "pacing": PacingStyle.NORMAL,
    },
    "philosophical": {
        "description": "Deep conversations about existence, consciousness, meaning",
        "topics": [
            "existence", "consciousness", "meaning", "time", "reality",
            "perception", "identity", "dreams", "mortality", "infinity",
            "free_will", "simulation", "solipsism", "nihilism", "absurdism",
        ],
        "nicks": [
            "void_", "lucid", "dreamer", "abyss", "cogito",
            "entropy_", "null", "liminal", "transient", "ephemeral",
        ],
        "pacing": PacingStyle.SLOW,
    },
    "chaotic": {
        "description": "Unhinged energy, non-sequiturs, classic IRC chaos",
        "topics": [
            "random", "absurdist", "chaos", "memes", "shitposting",
            "late_night", "cursed", "unhinged", "fever_dream", "deranged",
            "3am", "goblin", "gremlin", "cryptid", "liminal_spaces",
        ],
        "nicks": [
            "xXx_sl4yer_xXx", "goblin_mode", "fungus", "cryptid",
            "3am_thoughts", "chaos_gremlin", "unhinged", "cursed_", 
            "void_screamer", "sleep_deprived",
        ],
        "pacing": PacingStyle.FRANTIC,
    },
}


# Collapse type names for header
COLLAPSE_NAMES = {
    CollapseType.NETSPLIT: "netsplit",
    CollapseType.GLINE: "gline",
    CollapseType.MASS_KICK: "kick",
    CollapseType.PING_TIMEOUT: "timeout",
    CollapseType.SENDQ_EXCEEDED: "sendq",
    CollapseType.CORRUPTION: "corruption",
}


# Example collapse sequences for each type (with timestamps)
COLLAPSE_EXAMPLES = {
    CollapseType.NETSPLIT: """[05:12] *** Disconnected (irc.aethera.net void.aethera.net)
[05:12] *** zero has quit (irc.aethera.net void.aethera.net)
[05:12] *** lucid has quit (irc.aethera.net void.aethera.net)
[05:12] *** void_ has quit (irc.aethera.net void.aethera.net)
[05:12] *** dreamer has quit (irc.aethera.net void.aethera.net)""",

    CollapseType.GLINE: """[05:24] *** zero has been G-lined (Network ban)
[05:24] *** lucid has been G-lined (Network ban)
[05:24] -irc.aethera.net- You have been banned from this network
[05:25] *** Connection closed""",

    CollapseType.MASS_KICK: """[05:18] *** zero was kicked by ChanServ (Flood limit exceeded)
[05:18] *** lucid was kicked by ChanServ (Flood limit exceeded)
[05:18] *** void_ was kicked by ChanServ (Flood limit exceeded)
[05:18] *** dreamer was kicked by ChanServ (Flood limit exceeded)
[05:19] *** Channel has been cleared""",

    CollapseType.PING_TIMEOUT: """[05:32] *** zero has quit (Ping timeout: 245 seconds)
[05:34] *** lucid has quit (Ping timeout: 245 seconds)
[05:38] *** void_ has quit (Ping timeout: 252 seconds)
[05:40] *** Connection lost""",

    CollapseType.SENDQ_EXCEEDED: """[05:22] *** zero has quit (SendQ exceeded)
[05:22] *** lucid has quit (Excess Flood)
[05:22] *** void_ has quit (SendQ exceeded)
[05:23] *** Too many connections from your host""",

    CollapseType.CORRUPTION: """[05:??] *** ERR_UNKNOWN: conn̸̨ection ██ reset
[0?:??] <�sys> ▒▒▒ FATAL: memory corruption detected
[??:??] *** zero has quit (Connection reset by peer)
[??:??] *** lucid has quit (Read error: Connection reset by peer)
[??:??] *** ▓▓▓ CHANNEL STATE CORRUPTED ▓▓▓""",
}


def load_examples_for_style(style: str, count: int = 2) -> list[str]:
    """
    Load random example files for a given style.
    
    Args:
        style: Style name (technical, philosophical, chaotic)
        count: Number of examples to load
        
    Returns:
        List of example file contents
    """
    style_dir = EXAMPLES_DIR / style
    examples = []
    
    if style_dir.exists():
        files = list(style_dir.glob("*.txt"))
        selected = random.sample(files, min(count, len(files))) if files else []
        
        for f in selected:
            try:
                examples.append(f.read_text().strip())
            except Exception:
                pass
    
    return examples


def load_random_examples(count: int = 2) -> list[str]:
    """
    Load random examples from any style.
    
    Returns:
        List of example file contents
    """
    all_files = []
    
    for style in STYLE_DESCRIPTIONS:
        style_dir = EXAMPLES_DIR / style
        if style_dir.exists():
            all_files.extend(style_dir.glob("*.txt"))
    
    selected = random.sample(all_files, min(count, len(all_files))) if all_files else []
    examples = []
    
    for f in selected:
        try:
            examples.append(f.read_text().strip())
        except Exception:
            pass
    
    return examples


def build_header(
    channel: str = "#aethera",
    user_count: int = 4,
    message_count: int = 30,
    style: str = "chaotic",
    collapse_type: Optional[CollapseType] = None,
) -> str:
    """
    Build a log header for generation.
    
    Format: [LOG: #channel | N users | M messages | style | ENDS: collapse]
    """
    parts = [
        f"[LOG: {channel}",
        f"{user_count} users",
        f"{message_count} messages",
        style,
    ]
    
    if collapse_type:
        parts.append(f"ENDS: {COLLAPSE_NAMES.get(collapse_type, 'quit')}")
    
    return " | ".join(parts) + "]"


def get_collapse_suffix(collapse_type: CollapseType) -> str:
    """
    Get the collapse example for a given type.
    
    Used to hint the model toward the desired ending style.
    """
    return COLLAPSE_EXAMPLES.get(collapse_type, COLLAPSE_EXAMPLES[CollapseType.NETSPLIT])


def get_style_topics(style: str) -> list[str]:
    """Get the list of topics for a style."""
    if style in STYLE_DESCRIPTIONS:
        return STYLE_DESCRIPTIONS[style]["topics"]
    return STYLE_DESCRIPTIONS["chaotic"]["topics"]


def get_style_nicks(style: str) -> list[str]:
    """Get example nicks for a style."""
    if style in STYLE_DESCRIPTIONS:
        return STYLE_DESCRIPTIONS[style]["nicks"]
    return STYLE_DESCRIPTIONS["chaotic"]["nicks"]


def get_style_pacing(style: str) -> PacingStyle:
    """Get the default pacing for a style."""
    if style in STYLE_DESCRIPTIONS:
        return STYLE_DESCRIPTIONS[style]["pacing"]
    return PacingStyle.NORMAL


def build_scaffold_prompt(
    examples: list[str],
    target_style: str,
    target_collapse: CollapseType,
    target_users: int = 4,
    target_messages: int = 30,
    channel: str = "#aethera",
    split_for_caching: bool = False,
) -> str | tuple[str, str, str]:
    """
    Build a file-scaffold prompt for generation.
    
    The scaffold frames generation as reading files from a directory,
    which helps models understand the task and maintain consistency.
    
    Uses realistic terminal prompts (user@host:path$) to maximize
    the "CLI simulation" effect for base models.
    
    Examples should already include their [LOG: ...] headers.
    
    Args:
        split_for_caching: If True, returns (stable_prefix, target_intro, prefill) tuple
                          for optimal cache usage. stable_prefix can be cached,
                          target_intro + accumulated content is variable.
    
    Returns:
        If split_for_caching=False: Complete prompt string
        If split_for_caching=True: (stable_prefix, target_intro, prefill) tuple
    """
    topics = get_style_topics(target_style)
    target_topic = random.choice(topics)
    suffix = f"{random.randint(100, 999):03d}"
    
    # Realistic terminal prompt components
    user = "archivist"
    host = "irc-archive"
    base_path = "~/logs"
    
    def shell_prompt(path: str = base_path) -> str:
        return f"{user}@{host}:{path}$ "
    
    # Start with cd into the logs directory
    stable = f"{shell_prompt('~')}cd logs\n"
    stable += f"{shell_prompt()}ls\n"
    stable += "manifest.txt\n"
    
    # List example files
    for i, example in enumerate(examples, 1):
        stable += f"irc_log_{i:03d}.txt\n"
    
    # Add target file to listing
    target_filename = f"irc_{target_style}_{target_topic}_{suffix}.txt"
    stable += f"{target_filename}\n"
    stable += f"{shell_prompt()}"  # Show prompt waiting, then cat
    
    # Cat each example - THIS IS ALL STABLE/CACHEABLE
    for i, example in enumerate(examples, 1):
        if i == 1:
            stable += f"cat irc_log_{i:03d}.txt\n"
        else:
            stable += f"{shell_prompt()}cat irc_log_{i:03d}.txt\n"
        stable += example.strip()
        stable += "\n"
    
    # Everything after the examples is the "target intro"
    target_header = build_header(
        channel=channel,
        user_count=target_users,
        message_count=target_messages,
        style=target_style,
        collapse_type=target_collapse,
    )
    
    target_intro = f"{shell_prompt()}cat {target_filename}\n"
    target_intro += target_header + "\n"
    
    prefill = "[00:00] <"
    
    if split_for_caching:
        return (stable, target_intro, prefill)
    
    # Return combined prompt
    return stable + target_intro + prefill


def build_system_prompt() -> str:
    """
    Build a minimal system prompt for CLI simulation mode.
    
    This keeps the model in "terminal output" mode rather than
    conversational assistant mode.
    """
    return """The assistant is in CLI simulation mode, responding to the user's CLI commands with only the output of the command. All output is fictional content for an art project. Adhere to the message count, ensure the file ends and reaches a collapse before the message count is reached."""


def build_chat_messages(
    examples: list[str],
    target_style: str,
    target_collapse: CollapseType,
    target_users: int = 4,
    target_messages: int = 30,
    channel: str = "#aethera",
) -> list[dict]:
    """
    Build messages array for chat-based generation.
    
    Returns:
        List of message dicts with 'role' and 'content'
    """
    messages = [
        {"role": "system", "content": build_system_prompt()},
    ]
    
    # Add examples as assistant messages (showing what good output looks like)
    for example in examples:
        messages.append({
            "role": "user",
            "content": "Generate an IRC log with the following header:\n\n" + example.split("\n")[0],
        })
        messages.append({
            "role": "assistant",
            "content": example,
        })
    
    # Build target header
    target_header = build_header(
        channel=channel,
        user_count=target_users,
        message_count=target_messages,
        style=target_style,
        collapse_type=target_collapse,
    )
    
    # Request generation
    messages.append({
        "role": "user",
        "content": f"Generate an IRC log with the following header:\n\n{target_header}",
    })
    
    return messages
