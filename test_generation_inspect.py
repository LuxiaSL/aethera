#!/usr/bin/env python3
"""
Inspectable Generation Test Harness

A detailed test harness that shows every step of the generation pipeline:
- Exact prompts being sent
- Each candidate's raw output
- Judge's ratings and reasoning
- Final selection

Run with cheap models first to understand the flow before expensive runs.

Usage:
    # Use cheap models (default: gpt-4o-mini for both)
    python test_generation_inspect.py
    
    # Dry run (mock responses, no API calls)
    python test_generation_inspect.py --dry-run
    
    # Custom models via env vars
    IRC_GENERATION_MODEL=gpt-4o-mini IRC_JUDGE_MODEL=gpt-4o-mini python test_generation_inspect.py
"""

import os
import sys
import asyncio
import json
import argparse
import logging
from datetime import datetime
from pathlib import Path
from typing import Optional
from textwrap import indent, dedent

# Load environment
from dotenv import load_dotenv
load_dotenv()

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent))

# Set up file logging
LOG_DIR = Path(__file__).parent / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / f"generation_test_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"

# Configure logging to both file and console
file_handler = logging.FileHandler(LOG_FILE, encoding='utf-8')
file_handler.setLevel(logging.DEBUG)
file_handler.setFormatter(logging.Formatter('%(asctime)s | %(levelname)s | %(message)s'))

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.WARNING)  # Only warnings+ to console

debug_logger = logging.getLogger("irc_test")
debug_logger.setLevel(logging.DEBUG)
debug_logger.addHandler(file_handler)
debug_logger.addHandler(console_handler)


class Colors:
    """ANSI color codes for terminal output."""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    END = '\033[0m'


def header(text: str) -> str:
    return f"{Colors.BOLD}{Colors.HEADER}{'=' * 60}\n{text}\n{'=' * 60}{Colors.END}"


def section(text: str) -> str:
    return f"\n{Colors.BOLD}{Colors.CYAN}── {text} ──{Colors.END}"


def success(text: str) -> str:
    return f"{Colors.GREEN}✓ {text}{Colors.END}"


def warn(text: str) -> str:
    return f"{Colors.YELLOW}⚠ {text}{Colors.END}"


def error(text: str) -> str:
    return f"{Colors.RED}✗ {text}{Colors.END}"


def dim(text: str) -> str:
    return f"{Colors.DIM}{text}{Colors.END}"


def box(title: str, content: str, color: str = Colors.BLUE) -> str:
    """Create a visual box around content."""
    lines = content.split('\n')
    max_len = max(len(line) for line in lines) if lines else 0
    max_len = max(max_len, len(title) + 4)
    
    top = f"{color}┌{'─' * (max_len + 2)}┐{Colors.END}"
    title_line = f"{color}│ {Colors.BOLD}{title}{Colors.END}{color}{' ' * (max_len - len(title))} │{Colors.END}"
    sep = f"{color}├{'─' * (max_len + 2)}┤{Colors.END}"
    bottom = f"{color}└{'─' * (max_len + 2)}┘{Colors.END}"
    
    body_lines = [f"{color}│{Colors.END} {line}{' ' * (max_len - len(line))} {color}│{Colors.END}" for line in lines]
    
    return '\n'.join([top, title_line, sep] + body_lines + [bottom])


class MockProvider:
    """Mock provider for dry runs."""
    
    def __init__(self, name: str):
        self._name = name
        self._model = f"mock-{name}"
    
    @property
    def name(self) -> str:
        return self._name
    
    @property
    def model(self) -> str:
        return self._model
    
    @property
    def supports_native_n(self) -> bool:
        return True
    
    async def complete_batch(self, prompt: str, n: int, max_tokens: int, 
                            temperature: float = 1.0, stop: Optional[list] = None):
        """Return mock completions."""
        from aethera.irc.providers.base import BatchCompletionResult
        
        mock_responses = [
            """[00:15] <synthwave_dreams> anyone here?
[00:16] <pixel_witch> always watching
[00:17] <synthwave_dreams> that's creepy
[00:18] <void_walker> we are all watching
[00:19] <pixel_witch> we are the channel
[00:20] * netsplit detected - servers diverging""",
            """[00:15] <ghost_in_shell> why do we keep coming back
[00:17] <null_pointer> habit
[00:18] <ghost_in_shell> no like really
[00:19] <null_pointer> because the void is comfortable
[00:22] <ghost_in_shell> that's the saddest thing i've ever heard
[00:23] <null_pointer> thanks i try""",
            """[00:15] <retro_future> remember when IRC was alive
[00:16] <static_noise> define alive
[00:17] <retro_future> people talking
[00:18] <static_noise> we're talking
[00:19] <retro_future> are we though
[00:20] <static_noise> ...""",
        ]
        
        texts = []
        for i in range(n):
            texts.append(mock_responses[i % len(mock_responses)])
        
        return BatchCompletionResult(
            texts=texts,
            tokens_used=len(prompt.split()) * 2 * n,
            tokens_prompt=len(prompt.split()),
            model=self._model,
            latency_ms=100 * n,
            cost_usd=0.0001 * n,
            cached_tokens=0,
        )
    
    async def complete_batch_with_prefill(self, prompt: str, prefill: str, n: int, max_tokens: int,
                                          temperature: float = 1.0, stop: Optional[list] = None,
                                          system: Optional[str] = None):
        """Return mock completions with prefill prepended."""
        from aethera.irc.providers.base import BatchCompletionResult
        
        # Mock responses that continue from the prefill
        mock_continuations = [
            """synthwave_dreams> anyone here?
[00:16] <pixel_witch> always watching
[00:17] <synthwave_dreams> that's creepy
[00:18] <void_walker> we are all watching
[00:19] <pixel_witch> we are the channel
[00:20] *** Netsplit hub.efnet.net <-> irc.efnet.org""",
            """ghost_in_shell> why do we keep coming back
[00:17] <null_pointer> habit
[00:18] <ghost_in_shell> no like really
[00:19] <null_pointer> because the void is comfortable
[00:22] <ghost_in_shell> that's the saddest thing i've ever heard
[00:23] <null_pointer> thanks i try""",
            """retro_future> remember when IRC was alive
[00:16] <static_noise> define alive
[00:17] <retro_future> people talking
[00:18] <static_noise> we're talking
[00:19] <retro_future> are we though
[00:20] <static_noise> ...""",
        ]
        
        texts = []
        for i in range(n):
            texts.append(mock_continuations[i % len(mock_continuations)])
        
        return BatchCompletionResult(
            texts=texts,
            tokens_used=len(prompt.split()) * 2 * n,
            tokens_prompt=len(prompt.split()),
            model=self._model,
            latency_ms=100 * n,
            cost_usd=0.0001 * n,
            cached_tokens=0,
        )
    
    async def complete(self, prompt: str, max_tokens: int,
                       temperature: float = 1.0, stop: Optional[list] = None):
        """Return mock completion for judge."""
        from aethera.irc.providers.base import CompletionResult
        
        # Mock judge response
        mock_judgment = """{"candidate_index": 0, "rating": 8, "reasoning": "Most authentic IRC banter, natural pacing"}"""
        
        return CompletionResult(
            text=mock_judgment,
            tokens_used=len(prompt.split()) + 50,
            tokens_prompt=len(prompt.split()),
            model=self._model,
            latency_ms=50,
            cost_usd=0.00005,
            cached_tokens=0,
        )


def log_to_file(title: str, content: str):
    """Log content to file with no truncation."""
    debug_logger.info(f"\n{'='*60}\n{title}\n{'='*60}\n{content}\n")


class InspectableTestHarness:
    """
    Test harness with full visibility into the generation pipeline.
    """
    
    def __init__(self, dry_run: bool = False, verbose: bool = True):
        self.dry_run = dry_run
        self.verbose = verbose
        self.log_entries = []
        self.total_cost = 0.0
        self.total_tokens = 0
    
    def log(self, message: str):
        """Log with timestamp."""
        timestamp = datetime.now().strftime("%H:%M:%S")
        entry = f"[{timestamp}] {message}"
        self.log_entries.append(entry)
        if self.verbose:
            print(entry)
    
    async def run_single_chunk_generation(self):
        """
        Test a single chunk generation cycle with full inspection.
        """
        from aethera.irc.config import get_config
        from aethera.irc.prompts.templates import build_scaffold_prompt
        
        print(header("IRC Generation Pipeline Inspector"))
        print(f"\n{dim('Mode:')} {'DRY RUN (mock responses)' if self.dry_run else 'LIVE (real API calls)'}")
        print(f"{dim(f'Log file: {LOG_FILE}')}")
        
        # Get configuration
        config = get_config()
        
        print(section("Configuration"))
        print(f"  Generation: {config.generation_provider}/{config.generation_model}")
        print(f"  Judge:      {config.judge_provider}/{config.judge_model}")
        print(f"  Candidates: {config.candidates_per_batch}")
        print(f"  Tokens:     {config.tokens_per_candidate}")
        
        # Get providers
        if self.dry_run:
            gen_provider = MockProvider("generation")
            judge_provider = MockProvider("judge")
            print(f"\n{warn('Using mock providers for dry run')}")
        else:
            gen_provider = config.get_generation_provider()
            judge_provider = config.get_judge_provider()
        
        # Build prompt
        print(section("Building Prompt"))
        
        from aethera.irc.prompts.templates import load_random_examples, build_system_prompt
        from aethera.irc.models import CollapseType
        import random
        
        # Choose random style and collapse
        style = random.choice(["technical", "philosophical", "chaotic"])
        collapse = random.choice(list(CollapseType))
        
        # Load examples from ALL styles for variety
        example_count = config.examples_per_prompt
        examples = load_random_examples(count=example_count)
        print(f"{dim(f'Loaded {len(examples)} examples from various styles')}")
        
        prompt = build_scaffold_prompt(
            examples=examples,
            target_style=style,
            target_collapse=collapse,
            target_users=random.randint(3, 6),
            target_messages=random.randint(20, 35),
            channel="#aethera",
        )
        
        # The scaffold prompt ends with "[00:00] <" - we use this as prefill
        # Split off the prefill to force the model to continue from there
        prefill = "[00:00] <"
        if prompt.endswith(prefill):
            prompt = prompt[:-len(prefill)]
        
        # Show the prompt (start and end for visibility)
        def smart_truncate(text: str, max_lines: int = 60) -> str:
            """Show start and end of long text."""
            lines = text.split('\n')
            if len(lines) <= max_lines:
                return text
            
            # Show first 30 and last 15 lines
            head = lines[:35]
            tail = lines[-20:]
            omitted = len(lines) - 55
            
            return '\n'.join(head) + f"\n\n... [{omitted} lines omitted] ...\n\n" + '\n'.join(tail)
        
        print(box("GENERATION PROMPT", smart_truncate(prompt)))
        print(f"\n{dim('Prompt length:')} {len(prompt)} chars, ~{len(prompt.split())} tokens")
        print(f"{dim(f'Prefill: \"{prefill}\"')}")
        
        # Log FULL prompt to file (no truncation)
        log_to_file("GENERATION PROMPT (FULL)", prompt)
        log_to_file("PREFILL", prefill)
        print(f"{dim(f'Full prompt logged to: {LOG_FILE}')}")
        
        # Generate candidates
        print(section(f"Generating {config.candidates_per_batch} Candidates"))
        
        n_candidates = config.candidates_per_batch
        max_tokens = config.tokens_per_candidate
        
        self.log(f"Sending batch request to {gen_provider.name}...")
        
        # Instruct mode: use system prompt if configured
        system_prompt = None
        if config.use_instruct_mode:
            system_prompt = build_system_prompt()
            print(f"{dim('Instruct mode: using system prompt')}")
        else:
            print(f"{dim('Base mode: no system prompt')}")
        
        # Use prefill to force continuation format
        gen_kwargs = {
            "prompt": prompt,
            "prefill": prefill,
            "n": n_candidates,
            "max_tokens": max_tokens,
            "temperature": 0.9,
            "stop": ["\n---", "$ cat", "[LOG:"],
        }
        
        # Add system prompt for Anthropic if in instruct mode
        if config.use_instruct_mode and "anthropic" in gen_provider.name.lower():
            gen_kwargs["system"] = system_prompt
        
        batch_result = await gen_provider.complete_batch_with_prefill(**gen_kwargs)
        
        self.total_tokens += batch_result.tokens_used
        if batch_result.cost_usd:
            self.total_cost += batch_result.cost_usd
        
        self.log(f"Received {len(batch_result.texts)} candidates in {batch_result.latency_ms:.0f}ms")
        
        if batch_result.cached_tokens > 0:
            print(success(f"Cache hit: {batch_result.cached_tokens} tokens from cache"))
        
        # Display each candidate
        print(section("Raw Candidates"))
        
        # Log all raw candidates to file (full content)
        all_candidates_log = []
        candidates_for_judge = []
        for i, text in enumerate(batch_result.texts):
            color = [Colors.CYAN, Colors.GREEN, Colors.YELLOW][i % 3]
            print(f"\n{color}{Colors.BOLD}─── CANDIDATE {i + 1} ───{Colors.END}")
            print(text.strip() if text.strip() else dim("(empty response)"))
            
            # Log full candidate to file
            all_candidates_log.append(f"=== CANDIDATE {i + 1} ===\n{text}")
            
            # Track non-empty candidates
            if text.strip():
                candidates_for_judge.append({
                    "index": i,
                    "text": text.strip(),
                    "line_count": len([l for l in text.strip().split('\n') if l.strip()]),
                })
        
        log_to_file("ALL RAW CANDIDATES", "\n\n".join(all_candidates_log))
        print(f"\n{dim('Valid candidates:')} {len(candidates_for_judge)}/{len(batch_result.texts)}")
        
        if not candidates_for_judge:
            print(error("No valid candidates to judge!"))
            return
        
        # Build judge prompt
        print(section("Judging Candidates"))
        
        judge_prompt = self._build_judge_prompt(candidates_for_judge)
        print(box("JUDGE PROMPT", judge_prompt[:3000] + "..." if len(judge_prompt) > 3000 else judge_prompt, Colors.YELLOW))
        
        # Log FULL judge prompt to file
        log_to_file("JUDGE PROMPT (FULL)", judge_prompt)
        
        self.log(f"Sending judgment request to {judge_provider.name}...")
        
        # o3 and some reasoning models only support temperature=1.0
        # They also need WAY more tokens because reasoning tokens count against the limit
        is_reasoning_model = "o3" in judge_provider.model or "o1" in judge_provider.model
        judge_temp = 1.0 if is_reasoning_model else 0.3
        judge_max_tokens = 16000 if is_reasoning_model else 500  # Reasoning models need headroom
        
        judge_result = await judge_provider.complete(
            prompt=judge_prompt,
            max_tokens=judge_max_tokens,
            temperature=judge_temp,
        )
        
        self.total_tokens += judge_result.tokens_used
        if judge_result.cost_usd:
            self.total_cost += judge_result.cost_usd
        
        self.log(f"Judgment received in {judge_result.latency_ms:.0f}ms")
        
        # Log FULL judge response to file
        log_to_file("JUDGE RAW RESPONSE (FULL)", judge_result.text)
        log_to_file("JUDGE METADATA", f"""
Model: {judge_result.model}
Tokens used: {judge_result.tokens_used}
Tokens prompt: {judge_result.tokens_prompt}
Latency: {judge_result.latency_ms}ms
Cost: ${judge_result.cost_usd}
Cached tokens: {judge_result.cached_tokens}
""")
        
        # Parse and display judgment
        print(section("Judgment Result"))
        
        print(f"\n{Colors.BOLD}Raw response:{Colors.END}")
        print(judge_result.text)
        
        try:
            # Try to extract JSON from response (models sometimes add preamble/reasoning)
            import re
            raw_text = judge_result.text.strip()
            json_text = None
            extraction_method = "direct"
            
            # Strategy 1: Direct parse if it looks like JSON
            if raw_text.startswith("{"):
                json_text = raw_text
                extraction_method = "direct"
            
            # Strategy 2: Extract from markdown code block ```json ... ```
            if json_text is None:
                code_block_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', raw_text, re.DOTALL)
                if code_block_match:
                    json_text = code_block_match.group(1)
                    extraction_method = "markdown code block"
            
            # Strategy 3: Find JSON object with balanced braces
            if json_text is None:
                for i, char in enumerate(raw_text):
                    if char == '{':
                        depth = 0
                        for j, c in enumerate(raw_text[i:], start=i):
                            if c == '{':
                                depth += 1
                            elif c == '}':
                                depth -= 1
                                if depth == 0:
                                    candidate = raw_text[i:j+1]
                                    try:
                                        test_parse = json.loads(candidate)
                                        if "candidate_index" in test_parse or "rating" in test_parse:
                                            json_text = candidate
                                            extraction_method = "brace matching"
                                            break
                                    except json.JSONDecodeError:
                                        continue
                    if json_text:
                        break
            
            # Strategy 4: Last resort - look for key fields with regex
            if json_text is None:
                simple_match = re.search(
                    r'\{\s*"candidate_index"\s*:\s*\d+\s*,\s*"rating"\s*:\s*\d+\s*,\s*"reasoning"\s*:\s*"[^"]*"\s*\}',
                    raw_text
                )
                if simple_match:
                    json_text = simple_match.group(0)
                    extraction_method = "regex pattern"
            
            if json_text and json_text != raw_text:
                print(f"{dim(f'Extracted JSON via {extraction_method}')}")
                log_to_file("EXTRACTED JSON", f"Method: {extraction_method}\n\n{json_text}")
            
            if json_text is None:
                raise json.JSONDecodeError("No JSON object found in response", raw_text, 0)
            
            judgment = json.loads(json_text)
            winner_idx = judgment.get("candidate_index", 0)
            rating = judgment.get("rating", "N/A")
            reasoning = judgment.get("reasoning", "No reasoning provided")
            
            log_to_file("PARSED JUDGMENT", json.dumps(judgment, indent=2))
            
            print(f"\n{Colors.GREEN}{Colors.BOLD}━━━ WINNER: Candidate {winner_idx + 1} ━━━{Colors.END}")
            print(f"  Rating:    {rating}/10")
            print(f"  Reasoning: {reasoning}")
            
            # Show winning candidate
            winner_text = candidates_for_judge[winner_idx]["text"] if winner_idx < len(candidates_for_judge) else "N/A"
            print(box(f"WINNING OUTPUT (Candidate {winner_idx + 1})", winner_text, Colors.GREEN))
            log_to_file("WINNING CANDIDATE", winner_text)
            
        except json.JSONDecodeError as e:
            print(warn(f"Could not parse judgment as JSON: {e}"))
            print(f"\n{Colors.RED}Full raw response for debugging:{Colors.END}")
            print(f"---START---\n{judge_result.text}\n---END---")
            print(f"\n{dim(f'Response length: {len(judge_result.text)} chars')}")
            print(f"{dim(f'Full output logged to: {LOG_FILE}')}")
            log_to_file("JSON PARSE ERROR", f"Error: {e}\n\nRaw text:\n{judge_result.text}")
        
        # Summary
        print(section("Run Summary"))
        print(f"  Total tokens:  {self.total_tokens:,}")
        print(f"  Total cost:    ${self.total_cost:.4f}")
        print(f"  Candidates:    {len(batch_result.texts)}")
        print(f"  Valid:         {len(candidates_for_judge)}")
        print(f"  Log file:      {LOG_FILE}")
        
        log_to_file("RUN SUMMARY", f"""
Total tokens: {self.total_tokens}
Total cost: ${self.total_cost:.4f}
Candidates generated: {len(batch_result.texts)}
Valid candidates: {len(candidates_for_judge)}
Dry run: {self.dry_run}
""")
        
        if not self.dry_run:
            print(f"\n{success('Live run completed successfully!')}")
        else:
            print(f"\n{dim('Dry run completed - no real API calls made')}")
    
    async def run_full_fragment_generation(
        self, 
        target_messages: int = 25, 
        max_chunks: int = 20,
        force_style: str = None,
        force_collapse: str = None,
    ):
        """
        Run the complete fragment generation loop until we have a full fragment.
        
        The target_messages is what we tell the LLM in the prompt header - it should
        produce a story that naturally concludes within that many messages. The judge
        steers toward a narrative arc that completes around that target.
        
        Args:
            target_messages: Target message count (what we tell the LLM in the header)
            max_chunks: Safety limit on generation rounds
            force_style: Optional style to force (technical, philosophical, chaotic)
            force_collapse: Optional collapse type to force
        """
        import re
        import random
        from aethera.irc.config import get_config
        from aethera.irc.prompts.templates import (
            build_scaffold_prompt, build_system_prompt, load_random_examples,
            STYLE_DESCRIPTIONS
        )
        STYLES = list(STYLE_DESCRIPTIONS.keys())
        from aethera.irc.models import CollapseType
        
        print(header("IRC Full Fragment Generation"))
        print(f"\n{dim('Mode:')} {'DRY RUN (mock responses)' if self.dry_run else 'LIVE (real API calls)'}")
        print(f"{dim(f'Log file: {LOG_FILE}')}")
        
        config = get_config()
        
        print(section("Configuration"))
        print(f"  Generation: {config.generation_provider}/{config.generation_model}")
        print(f"  Judge:      {config.judge_provider}/{config.judge_model}")
        print(f"  Candidates per chunk: {config.candidates_per_batch}")
        print(f"  Max chunks: {max_chunks}")
        
        # Log configuration to file for review_generations.py
        log_to_file("RUN CONFIGURATION", f"""Generation Provider: {config.generation_provider}
Generation Model: {config.generation_model}
Judge Provider: {config.judge_provider}
Judge Model: {config.judge_model}
Candidates Per Chunk: {config.candidates_per_batch}
Max Chunks: {max_chunks}
Mode: {'DRY RUN' if self.dry_run else 'LIVE'}""")
        
        # Get providers
        if self.dry_run:
            print(f"\n{warn('Using mock providers for dry run')}")
            gen_provider = MockProvider("mock-generator")
            judge_provider = MockProvider("mock-judge")
        else:
            gen_provider = config.get_generation_provider()
            judge_provider = config.get_judge_provider()
        
        # Choose style and collapse for this fragment
        style = force_style if force_style else random.choice(STYLES)
        if force_collapse:
            collapse = CollapseType(force_collapse)
        else:
            collapse = random.choice(list(CollapseType))
        target_users = random.randint(3, 6)
        # target_messages is the CONTRACT - what we tell the LLM in the prompt header
        # The story should naturally conclude within this many messages
        
        print(section("Fragment Parameters"))
        print(f"  Style:    {style}" + (" (forced)" if force_style else ""))
        print(f"  Collapse: {collapse.value}" + (" (forced)" if force_collapse else ""))
        print(f"  Users:    {target_users}")
        print(f"  Target:   {target_messages} messages (from prompt header)")
        
        # Log fragment parameters
        log_to_file("FRAGMENT PARAMETERS", f"""Style: {style}
Collapse Type: {collapse.value}
Target Users: {target_users}
Target Messages: {target_messages}""")
        
        # Load examples and build prompt with cache-friendly split
        example_count = int(os.getenv("IRC_EXAMPLES_PER_PROMPT", "4"))
        examples = load_random_examples(count=example_count)
        
        # Split for caching: stable_prefix (examples) vs variable (target + accumulated)
        stable_prefix, target_intro, prefill = build_scaffold_prompt(
            examples=examples,
            target_style=style,
            target_collapse=collapse,
            target_users=target_users,
            target_messages=target_messages,
            channel="#aethera",
            split_for_caching=True,
        )
        
        # Check if we're using an Anthropic model (directly or via OpenRouter)
        # This determines whether we can use stable_prefix caching optimization
        is_anthropic_model = (
            "anthropic" in config.generation_provider.lower() or
            "anthropic" in config.generation_model.lower() or
            "claude" in config.generation_model.lower()
        )
        
        log_to_file("STABLE PREFIX (CACHED)", stable_prefix)
        log_to_file("TARGET INTRO (VARIABLE)", target_intro)
        log_to_file("PREFILL", prefill)
        
        if is_anthropic_model:
            print(f"{dim(f'Anthropic model detected: using stable_prefix caching ({len(stable_prefix)} chars cached)')}")
        
        # Accumulated transcript
        transcript_lines = []
        chunk_count = 0
        collapse_detected = False
        
        system_prompt = None
        if config.use_instruct_mode:
            system_prompt = build_system_prompt()
        
        print(section("Generation Loop"))
        
        def count_irc_messages(lines: list) -> int:
            """Count actual IRC messages (lines with <username> format)."""
            return len([l for l in lines if l.strip() and "<" in l and not l.startswith("***")])
        
        def normalize_lines(lines: list) -> list:
            """
            Fix line wrapping issues from token cutoffs.
            
            Simple rule: A valid line starts with [MM:SS] or ***.
            Everything else is a continuation of the previous line.
            
            This handles:
            - ", restoring..." (continuation text)
            - ":18] <user>..." (split timestamp)
            - "something random" (any other partial)
            """
            import re
            valid_start = re.compile(r'^\[\d{2}:\d{2}\]|^\*\*\*')
            
            if not lines:
                return lines
            
            normalized = []
            for line in lines:
                stripped = line.strip()
                if not stripped:
                    continue
                
                if valid_start.match(stripped):
                    # Valid new line - add it
                    normalized.append(stripped)
                elif normalized:
                    # Continuation - merge with previous (no extra space if joining partial timestamp)
                    prev = normalized[-1]
                    # If prev ends with [ and stripped starts with digits, join directly (timestamp)
                    if prev.endswith('[') or re.search(r'\[\d{1,2}$', prev):
                        normalized[-1] = prev + stripped
                    else:
                        # Normal continuation - add space
                        normalized[-1] = prev.rstrip() + " " + stripped
                else:
                    # First line but not valid - add anyway (edge case)
                    normalized.append(stripped)
            
            return normalized
        
        while chunk_count < max_chunks:
            chunk_count += 1
            current_message_count = count_irc_messages(transcript_lines)
            
            print(f"\n{Colors.CYAN}{Colors.BOLD}━━━ CHUNK {chunk_count} ━━━{Colors.END}")
            print(f"{dim(f'Messages so far: {current_message_count}/{target_messages}')}")
            
            # Build prompt for this chunk
            # IMPORTANT: Generator always sees FULL context (scaffold + examples + accumulated)
            # For Anthropic, we split into stable_prefix (cached) and variable (prompt)
            if transcript_lines:
                # Continuation: target_intro + accumulated
                accumulated = "\n".join(transcript_lines)
                variable_prompt = target_intro + accumulated + "\n"
                current_prefill = ""  # Continue from last line
            else:
                # First chunk: just target intro
                variable_prompt = target_intro
                current_prefill = prefill
            
            # Full prompt for logging (and non-Anthropic providers)
            full_prompt = stable_prefix + variable_prompt
            
            # Log what generator receives
            log_to_file(f"CHUNK {chunk_count} GENERATOR PROMPT", 
                f"Stable prefix (cached): {len(stable_prefix)} chars\n"
                f"Variable prompt: {len(variable_prompt)} chars\n"
                f"Total: {len(full_prompt)} chars\n"
                f"Prefill: '{current_prefill}'\n\n"
                f"--- STABLE PREFIX ---\n{stable_prefix[:500]}...\n\n"
                f"--- VARIABLE PROMPT ---\n{variable_prompt}")
            
            # Generate candidates
            self.log(f"Generating {config.candidates_per_batch} candidates...")
            
            gen_kwargs = {
                "prompt": full_prompt if not is_anthropic_model else variable_prompt,
                "prefill": current_prefill if current_prefill else transcript_lines[-1] if transcript_lines else "",
                "n": config.candidates_per_batch,
                "max_tokens": config.tokens_per_candidate,
                "temperature": 0.9,
                "stop": ["\n---", "$ cat", "[LOG:"],
            }
            
            # Anthropic-specific: pass stable_prefix for cache optimization
            if is_anthropic_model:
                gen_kwargs["stable_prefix"] = stable_prefix
            
            # System prompt for instruct mode (when using Anthropic models directly or via OpenRouter)
            if config.use_instruct_mode and is_anthropic_model:
                gen_kwargs["system"] = system_prompt
            
            batch_result = await gen_provider.complete_batch_with_prefill(**gen_kwargs)
            
            self.total_tokens += batch_result.tokens_used
            if batch_result.cost_usd:
                self.total_cost += batch_result.cost_usd
            
            # Collect valid candidates
            candidates_for_judge = []
            for i, text in enumerate(batch_result.texts):
                if text.strip():
                    # Check if this candidate contains a collapse
                    has_collapse = any(marker in text for marker in [
                        "*** Netsplit", "*** GLINE", "was kicked", 
                        "has quit", "Ping timeout", "SendQ exceeded",
                        "ERROR:", "Connection reset"
                    ])
                    
                    candidates_for_judge.append({
                        "index": i,
                        "text": text.strip(),
                        "line_count": len([l for l in text.strip().split('\n') if l.strip()]),
                        "has_collapse": has_collapse,
                    })
            
            if not candidates_for_judge:
                print(error("No valid candidates! Retrying..."))
                continue
            
            # Show candidates briefly
            for c in candidates_for_judge:
                collapse_marker = " 🔚" if c["has_collapse"] else ""
                print(f"  Candidate {c['index'] + 1}: {c['line_count']} lines{collapse_marker}")
            
            # Judge candidates (with accumulated transcript and progress info)
            accumulated_for_judge = "\n".join(transcript_lines) if transcript_lines else ""
            judge_prompt = self._build_judge_prompt(
                candidates_for_judge, 
                accumulated_for_judge,
                current_messages=current_message_count,
                target_messages=target_messages,
            )
            
            log_to_file(f"CHUNK {chunk_count} JUDGE PROMPT", judge_prompt)
            
            is_reasoning_model = "o3" in judge_provider.model or "o1" in judge_provider.model
            judge_temp = 1.0 if is_reasoning_model else 0.3
            judge_max_tokens = 16000 if is_reasoning_model else 500
            
            self.log(f"Judging candidates...")
            judge_result = await judge_provider.complete(
                prompt=judge_prompt,
                max_tokens=judge_max_tokens,
                temperature=judge_temp,
            )
            
            self.total_tokens += judge_result.tokens_used
            if judge_result.cost_usd:
                self.total_cost += judge_result.cost_usd
            
            log_to_file(f"CHUNK {chunk_count} JUDGE RESPONSE", judge_result.text)
            
            # Parse judgment
            try:
                judgment = self._parse_judgment(judge_result.text)
                winner_idx = judgment.get("candidate_index", 0)
                rating = judgment.get("rating", "N/A")
                reasoning = judgment.get("reasoning", "")
                
                if winner_idx >= len(candidates_for_judge):
                    winner_idx = 0
                
                winner = candidates_for_judge[winner_idx]
                
                print(f"  {Colors.GREEN}Winner: Candidate {winner_idx + 1} (rating: {rating}/10){Colors.END}")
                print(f"  {dim(reasoning[:80] + '...' if len(reasoning) > 80 else reasoning)}")
                
                # Add winning text to transcript
                new_lines = winner["text"].strip().split("\n")
                
                # For first chunk, prepend the prefill
                if not transcript_lines and current_prefill:
                    new_lines[0] = current_prefill + new_lines[0]
                
                # Normalize lines to fix wrapping issues (also handles cross-chunk continuation)
                # Combine with existing transcript, normalize, then split back
                combined = transcript_lines + new_lines
                transcript_lines = normalize_lines(combined)
                
                # Check for collapse
                if winner["has_collapse"]:
                    collapse_detected = True
                    print(f"  {Colors.YELLOW}⚡ Collapse detected!{Colors.END}")
                
                log_to_file(f"CHUNK {chunk_count} WINNER", winner["text"])
                
            except Exception as e:
                print(error(f"Failed to parse judgment: {e}"))
                log_to_file(f"CHUNK {chunk_count} JUDGMENT ERROR", str(e))
                continue
            
            # Check if we're done (use consistent counting)
            message_count = count_irc_messages(transcript_lines)
            
            # Accept collapse if we're at 60%+ of target
            # The LLM naturally paces toward the ending - fighting it degrades quality
            min_acceptable = int(target_messages * 0.6)
            
            if collapse_detected and message_count >= min_acceptable:
                print(f"\n{success(f'Fragment complete! {message_count}/{target_messages} messages with collapse.')}")
                break
            elif collapse_detected and message_count < min_acceptable:
                # Very early collapse (< 60%) - try to continue
                print(f"  {warn(f'Collapse too early! Only {message_count}/{target_messages} messages (need {min_acceptable}+). Stripping collapse...')}")
                
                # More comprehensive collapse markers
                collapse_markers = [
                    "*** Netsplit", "*** GLINE", "was kicked", "has quit", 
                    "Ping timeout", "SendQ exceeded", "ERROR:", "Connection reset",
                    "*** Only", "users remain", "got disconnected", "everyone left"
                ]
                
                # Remove collapse lines
                transcript_lines = [l for l in transcript_lines if not any(
                    marker.lower() in l.lower() for marker in collapse_markers
                )]
                collapse_detected = False
                
                # If we've stripped multiple times, just accept what we have
                if chunk_count >= max_chunks // 2:
                    print(f"  {warn('Too many strip attempts. Accepting current fragment.')}")
                    break
        
        # Final output
        print(section("Final Fragment"))
        
        # Final normalization pass to clean up any remaining issues
        transcript_lines = normalize_lines(transcript_lines)
        
        final_transcript = "\n".join(transcript_lines)
        print(box("COMPLETE IRC LOG", final_transcript, Colors.GREEN))
        
        log_to_file("FINAL FRAGMENT", final_transcript)
        
        # Summary
        print(section("Generation Summary"))
        print(f"  Chunks:        {chunk_count}")
        print(f"  Messages:      {len([l for l in transcript_lines if '<' in l])}")
        print(f"  Lines:         {len(transcript_lines)}")
        print(f"  Collapse:      {'Yes' if collapse_detected else 'No'}")
        print(f"  Total tokens:  {self.total_tokens:,}")
        print(f"  Total cost:    ${self.total_cost:.4f}")
        print(f"  Log file:      {LOG_FILE}")
        
        log_to_file("GENERATION SUMMARY", f"""
Chunks: {chunk_count}
Messages: {len([l for l in transcript_lines if '<' in l])}
Lines: {len(transcript_lines)}
Collapse detected: {collapse_detected}
Total tokens: {self.total_tokens}
Total cost: ${self.total_cost:.4f}
""")
        
        return final_transcript
    
    def _parse_judgment(self, text: str) -> dict:
        """Parse judgment JSON from response, handling various formats."""
        import re
        raw_text = text.strip()
        json_text = None
        
        # Strategy 1: Direct parse
        if raw_text.startswith("{"):
            json_text = raw_text
        
        # Strategy 2: Markdown code block
        if json_text is None:
            match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', raw_text, re.DOTALL)
            if match:
                json_text = match.group(1)
        
        # Strategy 3: Balanced brace matching
        if json_text is None:
            for i, char in enumerate(raw_text):
                if char == '{':
                    depth = 0
                    for j, c in enumerate(raw_text[i:], start=i):
                        if c == '{':
                            depth += 1
                        elif c == '}':
                            depth -= 1
                            if depth == 0:
                                candidate = raw_text[i:j+1]
                                try:
                                    test = json.loads(candidate)
                                    if "candidate_index" in test or "rating" in test:
                                        json_text = candidate
                                        break
                                except:
                                    continue
                if json_text:
                    break
        
        if json_text is None:
            raise ValueError(f"No JSON found in: {raw_text[:200]}...")
        
        return json.loads(json_text)
    
    def _build_judge_prompt(
        self, 
        candidates: list, 
        accumulated_transcript: str = "",
        current_messages: int = 0,
        target_messages: int = 25,
    ) -> str:
        """
        Build the judge prompt for rating candidates.
        
        Args:
            candidates: List of candidate continuations to judge
            accumulated_transcript: The story so far (for continuation rounds)
            current_messages: How many messages we have so far
            target_messages: Target message count from the prompt header
        """
        candidates_text = ""
        for c in candidates:
            collapse_note = " [CONTAINS COLLAPSE]" if c.get("has_collapse") else ""
            candidates_text += f"\n--- CANDIDATE {c['index'] + 1} ({c['line_count']} lines){collapse_note} ---\n{c['text']}\n"
        
        # Calculate progress
        progress_pct = (current_messages / target_messages * 100) if target_messages > 0 else 0
        remaining = target_messages - current_messages
        
        # Pacing guidance based on progress
        if progress_pct < 30:
            pacing_guidance = "We're in the OPENING phase. Favor candidates that establish interesting dynamics and characters."
        elif progress_pct < 70:
            pacing_guidance = "We're in the MIDDLE phase. Favor candidates that develop the conversation naturally."
        elif progress_pct < 90:
            pacing_guidance = f"We're APPROACHING THE END ({remaining} messages left). Favor candidates that start steering toward a natural conclusion."
        else:
            pacing_guidance = f"We're at the END ({remaining} messages left). Favor candidates that bring the conversation to a satisfying collapse/ending."
        
        # First chunk vs continuation
        if accumulated_transcript:
            context_section = f"""
            === PROGRESS: {current_messages}/{target_messages} messages ({progress_pct:.0f}%) ===
            
            {pacing_guidance}
            
            === TRANSCRIPT SO FAR ===
            {accumulated_transcript}
            === END TRANSCRIPT ===
            
            The candidates below are CONTINUATIONS of this transcript.
            Select the one that best continues the narrative while:
            - Maintaining consistent tone and character voices
            - Keeping natural conversation flow
            - Pacing appropriately toward the target length
            """
        else:
            context_section = f"""
            === TARGET: {target_messages} messages ===
            
            This is the OPENING of a new IRC fragment.
            Select the candidate that establishes the best foundation for a ~{target_messages} message conversation.
            """
        
        return dedent(f"""
            You are judging IRC chat log continuations for an art project called Aethera. Think bash.org mixed with discord.
            
            IMPORTANT: These candidates are RAW COMPLETIONS from a base language model operating
            in continuation mode. Some responses may be partially cut off; this is normal for a short max token count.
            The generator sees the full scaffold prompt (with examples showing
            the target message count and collapse type) plus all previously generated content.
            
            The generator should naturally pace toward the target - your job is to select the 
            highest quality continuation that feels most authentic and narratively coherent.
            
            The chat should feel:
            - Natural and organic, like real IRC conversations
            - Slightly unsettling, with undertones of digital decay
            - Varied in pacing - not every line needs a response
            - Authentic to IRC culture (lurkers, netsplits, casual banter)
            {context_section}
            
            Candidates to judge:
            {candidates_text}
            
            Respond with ONLY valid JSON:
            {{"candidate_index": <0-based index>, "rating": <1-10>, "reasoning": "<brief explanation>"}}
        """).strip()


async def main():
    parser = argparse.ArgumentParser(description="Inspectable IRC generation test")
    parser.add_argument("--dry-run", action="store_true", help="Use mock responses")
    parser.add_argument("--quiet", action="store_true", help="Reduce output")
    parser.add_argument("--full", action="store_true", help="Run full fragment generation loop")
    parser.add_argument("--target-messages", type=int, default=25, help="Target message count for the fragment (default: 25)")
    parser.add_argument("--max-chunks", type=int, default=20, help="Maximum chunks to generate (default: 20)")
    parser.add_argument("--style", type=str, choices=["technical", "philosophical", "chaotic"], 
                        help="Force a specific style (default: random)")
    parser.add_argument("--collapse", type=str, 
                        choices=["netsplit", "gline", "mass_kick", "ping_timeout", "sendq_exceeded", "corruption"],
                        help="Force a specific collapse type (default: random)")
    args = parser.parse_args()
    
    harness = InspectableTestHarness(
        dry_run=args.dry_run,
        verbose=not args.quiet,
    )
    
    try:
        if args.full:
            await harness.run_full_fragment_generation(
                target_messages=args.target_messages,
                max_chunks=args.max_chunks,
                force_style=args.style,
                force_collapse=args.collapse,
            )
        else:
            await harness.run_single_chunk_generation()
    except KeyboardInterrupt:
        print(f"\n{error('Interrupted')}")
    except Exception as e:
        print(f"\n{error(f'Error: {e}')}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(main())

