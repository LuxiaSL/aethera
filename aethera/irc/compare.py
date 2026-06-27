"""
IRC Judge A/B Comparison — stateful vs stateless (ephemeral; banks nothing)

Runs N fragments per arm over the SAME mix of (style, collapse, target) params,
scores every fragment with the SAME stateless whole-fragment evaluator
(Autoloom.evaluate_fragment) as a consistent yardstick, and writes a report:

  1. A summary table (mean/median/min/max per arm, head-to-head per param).
  2. A BLIND READ section: every fragment shuffled, anonymized (A, B, C, ...),
     with NO arm label and NO score — read these and form your own opinion.
  3. An ANSWER KEY at the very bottom mapping each anon id back to its arm/score.

Why no seed-matched pairs: generation candidates come from vLLM sampling, and
the moment the two judges pick different winners the transcripts diverge and all
later candidates diverge too. So this is a BALANCED design (same param mix per
arm, aggregate comparison), not a paired one.

Nothing is written to irc.sqlite — this is a throwaway experiment, so the
curated pool stays clean.

Usage:
    python -m aethera.irc.compare --n 5
    python -m aethera.irc.compare --n 8 --target 31 --out ab_report.txt

Configuration comes from the same environment as generate.py (see
aethera.irc.config). The judge mode flag (IRC_JUDGE_STATEFUL / --stateful) is
IGNORED here — both arms are always run.
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import random
import statistics
import sys
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

from .config import IRCConfig, get_config
from .normalizer import IRCNormalizer
from .autoloom import Autoloom
from .generator import IRCGenerator, GenerationConfig, STYLES
from .models import CollapseType, IRCFragment

logger = logging.getLogger("aethera.irc.compare")


# ==================== Construction ====================

def _make_generator(
    config: IRCConfig,
    generation_provider,
    judge_provider,
    stateful: bool,
) -> IRCGenerator:
    """Build a generator whose judge runs in the given mode.

    The generation_provider and judge_provider are SHARED across both arms (and
    the scorer) so we open one client each, not three.
    """
    autoloom = Autoloom(
        judge_provider=judge_provider,
        threshold=config.autoloom_threshold,
        stateful=stateful,
    )
    gen_config = GenerationConfig(
        candidates_per_batch=config.candidates_per_batch,
        tokens_per_candidate=config.tokens_per_candidate,
        candidate_temperature=config.candidate_temperature,
        min_collapse_percentage=config.min_collapse_percentage,
        examples_per_prompt=config.examples_per_prompt,
        use_instruct_mode=config.use_instruct_mode,
    )
    return IRCGenerator(
        generation_provider=generation_provider,
        autoloom=autoloom,
        normalizer=IRCNormalizer(),
        config=gen_config,
        examples_dir=config.examples_dir,
    )


def _build_param_grid(n: int, target_messages: Optional[int]) -> list[dict]:
    """Pick n (style, collapse, target, users) tuples — reused by BOTH arms."""
    styles = list(STYLES.keys())
    collapses = list(CollapseType)
    grid = []
    for _ in range(n):
        grid.append({
            "style": random.choice(styles),
            "collapse_type": random.choice(collapses),
            "target_messages": target_messages or random.randint(25, 40),
            "target_users": random.randint(3, 6),
        })
    return grid


# ==================== Run one fragment ====================

async def _gen_and_score(
    generator: IRCGenerator,
    scorer: Autoloom,
    params: dict,
) -> Optional[dict]:
    """Generate one fragment with `generator`, score it with the shared `scorer`."""
    fragment = await generator.generate_fragment(
        style=params["style"],
        collapse_type=params["collapse_type"],
        target_messages=params["target_messages"],
    )
    if not fragment:
        return None

    content = "\n".join(m.content for m in fragment.messages if m.content)
    try:
        score, reasoning = await scorer.evaluate_fragment(content, style=fragment.style)
    except Exception as e:  # scoring failure shouldn't drop the fragment
        logger.warning("Scoring failed (%s); recording score=None", e)
        score, reasoning = None, f"scoring error: {e}"
    fragment.quality_score = score
    return {
        "fragment": fragment,
        "score": score,
        "reasoning": reasoning,
        "params": params,
    }


# ==================== Reporting ====================

def _render_transcript(fragment: IRCFragment) -> str:
    """Render a fragment as a readable IRC transcript."""
    lines = []
    collapse_idx = fragment.collapse_start_index or 0
    for i, m in enumerate(fragment.messages):
        ts = m.timestamp or ""
        marker = "  «collapse begins»" if i == collapse_idx and collapse_idx else ""
        mtype = getattr(m.type, "value", m.type)
        if mtype == "message":
            lines.append(f"[{ts}] <{m.nick}> {m.content}{marker}")
        else:
            lines.append(f"[{ts}] * {m.nick} {m.content} ({mtype}){marker}")
    return "\n".join(lines)


def _summarize(label: str, results: list[dict]) -> dict:
    scored = [r["score"] for r in results if r.get("score") is not None]
    return {
        "label": label,
        "count": len(results),
        "scored": len(scored),
        "mean": statistics.mean(scored) if scored else None,
        "median": statistics.median(scored) if scored else None,
        "min": min(scored) if scored else None,
        "max": max(scored) if scored else None,
    }


def _fmt(v: Optional[float]) -> str:
    return f"{v:.3f}" if isinstance(v, (int, float)) else "  n/a"


def _build_report(
    grid: list[dict],
    stateless: list[Optional[dict]],
    stateful: list[Optional[dict]],
) -> str:
    """Assemble the full text report (summary + blind read + answer key)."""
    sl = [r for r in stateless if r]
    sf = [r for r in stateful if r]
    s_sl = _summarize("stateless", sl)
    s_sf = _summarize("stateful", sf)

    out: list[str] = []
    out.append("=" * 72)
    out.append("IRC JUDGE A/B — stateful vs stateless (ephemeral; nothing banked)")
    out.append("=" * 72)
    out.append("")
    out.append(f"{'arm':<12}{'n':>4}{'scored':>8}{'mean':>9}{'median':>9}{'min':>8}{'max':>8}")
    for s in (s_sl, s_sf):
        out.append(
            f"{s['label']:<12}{s['count']:>4}{s['scored']:>8}"
            f"{_fmt(s['mean']):>9}{_fmt(s['median']):>9}{_fmt(s['min']):>8}{_fmt(s['max']):>8}"
        )
    out.append("")
    if s_sl["mean"] is not None and s_sf["mean"] is not None:
        delta = s_sf["mean"] - s_sl["mean"]
        verdict = "stateful higher" if delta > 0 else ("stateless higher" if delta < 0 else "tied")
        out.append(f"mean delta (stateful - stateless): {delta:+.3f}  →  {verdict}")
        out.append("(small n — read the transcripts; the auto-score is one signal, not the verdict)")
    out.append("")

    # Head-to-head per param (both arms used the SAME param at each index).
    out.append("-" * 72)
    out.append("PER-PARAM HEAD-TO-HEAD (same style/collapse/target each row)")
    out.append("-" * 72)
    out.append(f"{'#':>2}  {'style':<14}{'collapse':<16}{'tgt':>4}{'stateless':>11}{'stateful':>10}")
    for i, p in enumerate(grid):
        a = stateless[i]["score"] if (i < len(stateless) and stateless[i]) else None
        b = stateful[i]["score"] if (i < len(stateful) and stateful[i]) else None
        out.append(
            f"{i:>2}  {p['style']:<14}{p['collapse_type'].value:<16}"
            f"{p['target_messages']:>4}{_fmt(a):>11}{_fmt(b):>10}"
        )
    out.append("")

    # Blind read: shuffle all fragments, anonymize, hide arm + score.
    pool = []
    for r in sl:
        pool.append({"arm": "stateless", **r})
    for r in sf:
        pool.append({"arm": "stateful", **r})
    random.shuffle(pool)
    key = []  # (anon_label, arm, score)

    out.append("=" * 72)
    out.append("BLIND READ — no labels, no scores. Read these, form your opinion,")
    out.append("then check the ANSWER KEY at the very bottom.")
    out.append("=" * 72)
    for idx, item in enumerate(pool):
        anon = chr(ord("A") + idx) if idx < 26 else f"#{idx}"
        frag = item["fragment"]
        key.append((anon, item["arm"], item["score"]))
        out.append("")
        out.append(f"----- Fragment {anon}  ({frag.style} / {frag.collapse_type.value}) -----")
        out.append(_render_transcript(frag))
    out.append("")

    out.append("=" * 72)
    out.append("ANSWER KEY")
    out.append("=" * 72)
    out.append(f"{'frag':<6}{'arm':<12}{'score':>8}")
    for anon, arm, score in key:
        out.append(f"{anon:<6}{arm:<12}{_fmt(score):>8}")
    out.append("")
    return "\n".join(out)


# ==================== Orchestration ====================

async def _run(n: int, target: Optional[int], out_path: Path) -> int:
    config = get_config()

    # One generation provider, one judge provider — shared across both arms and
    # the scorer (the scorer is a stateless Autoloom: a consistent yardstick).
    try:
        generation_provider = config.get_generation_provider()
        judge_provider = config.get_judge_provider()
    except ValueError as e:
        logger.error("Provider setup failed: %s", e)
        return 1

    gen_stateless = _make_generator(config, generation_provider, judge_provider, stateful=False)
    gen_stateful = _make_generator(config, generation_provider, judge_provider, stateful=True)
    scorer = Autoloom(judge_provider=judge_provider, threshold=config.autoloom_threshold, stateful=False)

    logger.info("Generation: %s", generation_provider.name)
    logger.info("Judge:      %s  (both arms; scorer is stateless)", judge_provider.name)

    grid = _build_param_grid(n, target)
    logger.info("Param grid (%d, reused by both arms):", n)
    for i, p in enumerate(grid):
        logger.info("  [%d] %s / %s / target=%d", i, p["style"], p["collapse_type"].value, p["target_messages"])

    stateless_results: list[Optional[dict]] = []
    stateful_results: list[Optional[dict]] = []

    # Run both arms back-to-back per param so backend conditions stay comparable.
    for i, params in enumerate(grid):
        logger.info("=== Param %d/%d (%s/%s) ===", i + 1, n, params["style"], params["collapse_type"].value)

        logger.info("  [stateless] generating...")
        sl = await _gen_and_score(gen_stateless, scorer, params)
        logger.info("  [stateless] score=%s", _fmt(sl["score"]) if sl else "FAILED")
        stateless_results.append(sl)

        logger.info("  [stateful]  generating...")
        sf = await _gen_and_score(gen_stateful, scorer, params)
        logger.info("  [stateful]  score=%s", _fmt(sf["score"]) if sf else "FAILED")
        stateful_results.append(sf)

    report = _build_report(grid, stateless_results, stateful_results)
    out_path.write_text(report)

    # Echo the summary (everything above the blind read) to stdout.
    print()
    print(report.split("BLIND READ")[0].rstrip())
    print()
    print(f"Full report (with blind read + answer key) written to: {out_path}")

    # Clean up shared clients.
    for prov in (generation_provider, judge_provider):
        try:
            await prov.close()
        except Exception:
            pass
    return 0


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m aethera.irc.compare",
        description="A/B the stateful vs stateless judge (ephemeral; banks nothing).",
    )
    parser.add_argument("-n", "--n", type=int, default=5, help="Fragments per arm (default: 5)")
    parser.add_argument("--target", type=int, default=None, help="Fix target message count (default: random 25-40 per param)")
    parser.add_argument("--out", type=str, default="ab_judge_report.txt", help="Report output path (default: ab_judge_report.txt)")
    parser.add_argument("-v", "--verbose", action="store_true", help="Debug logging")
    args = parser.parse_args(argv)

    load_dotenv()

    if args.n < 1:
        parser.error("--n must be >= 1")

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )
    for noisy in ("httpx", "httpcore", "openai", "anthropic", "urllib3"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    out_path = Path(args.out)
    try:
        return asyncio.run(_run(args.n, args.target, out_path))
    except KeyboardInterrupt:
        logger.warning("Interrupted.")
        return 130


if __name__ == "__main__":
    sys.exit(main())
