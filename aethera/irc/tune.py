"""
IRC Generation — sampling tuning harness.

Fast iteration on generation sampling (repetition/frequency penalties,
temperature) WITHOUT the slow judge loop. Builds the same scaffold the real
generator uses, fires N candidate continuations against the generation model,
and renders them so you can eyeball repetition/looping and texture.

Usage:
    python -m aethera.irc.tune                       # defaults from .env
    python -m aethera.irc.tune --rep-pen 1.2 --freq-pen 0.4 -n 6
    python -m aethera.irc.tune --temp 1.0 --rep-pen 1.1 --style chaotic

Reads provider/model from the same env as the generator (IRC_LOCAL_* / .env),
but sampling flags here OVERRIDE the configured penalties so you can sweep them.
No judge, no DB writes — pure generation preview.
"""

from __future__ import annotations

import argparse
import asyncio
import random
import sys
from typing import Optional

from dotenv import load_dotenv

from .config import get_config
from .providers.base import CompletionMode
from .providers.openai_compatible import OpenAICompatibleProvider
from .prompts.templates import build_scaffold_prompt, load_random_examples
from .models import CollapseType
from .generator import STYLES

# Same stop sequences the generator uses for candidate chunks.
STOP = ["\n---", "$ cat", "[LOG:"]


def _build_provider(args) -> OpenAICompatibleProvider:
    """Construct the generation provider directly, with CLI penalties applied."""
    config = get_config()
    base_url = args.base_url or config.local_base_url or config.featherless_base_url
    model = args.model or config.local_model
    api_key = config.local_api_key or config.featherless_api_key
    return OpenAICompatibleProvider(
        base_url=base_url,
        model=model,
        api_key=api_key,
        mode=CompletionMode.COMPLETION,
        provider_name="tune",
        frequency_penalty=args.freq_pen,
        presence_penalty=args.pres_pen,
        repetition_penalty=args.rep_pen,
    )


async def _run(args) -> int:
    provider = _build_provider(args)

    style = args.style or random.choice(list(STYLES.keys()))
    collapse = random.choice(list(CollapseType))
    examples = load_random_examples(count=args.examples)

    stable_prefix, target_intro, prefill = build_scaffold_prompt(
        examples=examples,
        target_style=style,
        target_collapse=collapse,
        target_users=random.randint(3, 6),
        target_messages=args.target_messages,
        channel="#aethera",
        split_for_caching=True,
    )
    prompt = stable_prefix + target_intro  # base path combines prefix + intro

    print(
        f"model={provider.name}  style={style}\n"
        f"temp={args.temp} top_p={args.top_p} "
        f"rep_pen={args.rep_pen} freq_pen={args.freq_pen} pres_pen={args.pres_pen} "
        f"max_tokens={args.max_tokens}  n={args.num}\n"
        + "=" * 72
    )

    batch = await provider.complete_batch_with_prefill(
        prompt=prompt,
        prefill=prefill,
        n=args.num,
        max_tokens=args.max_tokens,
        temperature=args.temp,
        top_p=args.top_p,
        stop=STOP,
    )

    for i, text in enumerate(batch.texts, 1):
        print(f"\n----- candidate {i} -----")
        print((prefill + text).strip())
    print("\n" + "=" * 72)
    print(f"{len([t for t in batch.texts if t.strip()])}/{args.num} non-empty candidates")
    return 0


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m aethera.irc.tune",
        description="Preview IRC generation candidates while tuning sampling params.",
    )
    parser.add_argument("--rep-pen", type=float, default=None,
                        help="repetition_penalty (vLLM); 1.0=off, ~1.1-1.2 curbs loops")
    parser.add_argument("--freq-pen", type=float, default=None, help="frequency_penalty; 0.0=off")
    parser.add_argument("--pres-pen", type=float, default=None, help="presence_penalty; 0.0=off")
    parser.add_argument("--temp", type=float, default=0.95, help="temperature (default 0.95)")
    parser.add_argument("--top-p", type=float, default=1.0, help="top_p (default 1.0)")
    parser.add_argument("--max-tokens", type=int, default=120, help="tokens per candidate")
    parser.add_argument("-n", "--num", type=int, default=5, help="candidates to generate")
    parser.add_argument("--style", type=str, default=None,
                        help="technical|philosophical|chaotic (default: random)")
    parser.add_argument("--target-messages", type=int, default=30)
    parser.add_argument("--examples", type=int, default=4, help="few-shot examples in scaffold")
    parser.add_argument("--model", type=str, default=None, help="override model id")
    parser.add_argument("--base-url", type=str, default=None, help="override base URL")
    args = parser.parse_args(argv)

    load_dotenv()

    # Fall back to configured penalty defaults when a flag isn't given.
    config = get_config()
    if args.rep_pen is None:
        args.rep_pen = config.repetition_penalty
    if args.freq_pen is None:
        args.freq_pen = config.frequency_penalty
    if args.pres_pen is None:
        args.pres_pen = config.presence_penalty

    try:
        return asyncio.run(_run(args))
    except KeyboardInterrupt:
        return 130


if __name__ == "__main__":
    sys.exit(main())
