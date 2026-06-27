"""
IRC Fragment Generation CLI

Generate IRC "haunted broadcast" fragments and bank them to the IRC database
(irc.sqlite) for later curation (admin UI ratings) and playback.

Usage:
    python -m aethera.irc.generate --count 5
    python -m aethera.irc.generate -n 10 --max-attempts 40 -v

Configuration comes from environment variables (see aethera.irc.config):
    Generation (base model via Featherless / HF router):
        HF_TOKEN  or  FEATHERLESS_API_KEY  or  IRC_FEATHERLESS_API_KEY
        IRC_GENERATION_MODEL     (default: meta-llama/Llama-3.1-405B)
    Judge (instruct model via OpenRouter):
        OPENROUTER_API_KEY
        IRC_JUDGE_MODEL          (default: moonshotai/kimi-k2.5)

Generation is intentionally slow and run a few at a time — fragments accrue in
the DB over time, growing the pool to curate and broadcast from.
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import sys
from typing import Optional

from dotenv import load_dotenv

from .config import IRCConfig, get_config
from .database import init_irc_db, get_irc_session_factory
from .normalizer import IRCNormalizer
from .autoloom import Autoloom
from .generator import IRCGenerator, GenerationConfig, generate_batch
from .storage import FragmentStorage

logger = logging.getLogger("aethera.irc.generate")


def _build_generator(config: IRCConfig) -> IRCGenerator:
    """Construct an IRCGenerator from environment configuration.

    Raises ValueError (with a helpful message) if a required API key is missing.
    """
    generation_provider = config.get_generation_provider()
    judge_provider = config.get_judge_provider()

    autoloom = Autoloom(
        judge_provider=judge_provider,
        threshold=config.autoloom_threshold,
        stateful=config.judge_stateful,
    )
    gen_config = GenerationConfig(
        candidates_per_batch=config.candidates_per_batch,
        tokens_per_candidate=config.tokens_per_candidate,
        candidate_temperature=config.candidate_temperature,
        candidate_top_p=config.candidate_top_p,
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


async def _run(
    count: int,
    max_attempts: int,
    stateful: Optional[bool] = None,
    min_quality: float = 0.0,
    style: Optional[str] = None,
    max_similarity: float = 1.0,
    max_semantic_similarity: float = 1.0,
) -> int:
    config = get_config()

    # CLI flag overrides the env/config default for the judge mode (so A/B runs
    # are a single flag, no env juggling).
    if stateful is not None:
        config.judge_stateful = stateful

    # Ensure the (separate) IRC database exists before we try to save.
    init_irc_db()
    storage = FragmentStorage(
        session_factory=get_irc_session_factory(),
        cooldown_days=config.cooldown_days,
    )

    try:
        generator = _build_generator(config)
    except ValueError as e:
        logger.error("Provider setup failed: %s", e)
        logger.error(
            "Set the generation key (HF_TOKEN / FEATHERLESS_API_KEY) and "
            "OPENROUTER_API_KEY (judge), or override providers via "
            "IRC_GENERATION_PROVIDER / IRC_JUDGE_PROVIDER."
        )
        return 1

    # Log the providers that were actually constructed (name includes the real
    # model id, e.g. local/deepseek-v3-base) rather than the configured default.
    logger.info(
        "Generation: %s  (instruct_mode=%s)",
        generator.provider.name, config.use_instruct_mode,
    )
    logger.info(
        "Judge:      %s  (stateful=%s)",
        generator.autoloom.provider.name, config.judge_stateful,
    )

    # Build the lexical novelty index from the existing pool (near-dup gate).
    dedup_index = None
    if max_similarity < 1.0:
        from .dedup import NearDupIndex, load_pool
        from .database import IRC_DATABASE_URL
        db_path = IRC_DATABASE_URL.replace("sqlite:///", "")
        pool = load_pool(db_path)
        dedup_index = NearDupIndex()
        for fid, d in pool.items():
            dedup_index.add(fid, d["tokens"])
        logger.info(
            "Novelty gate: reject fragments >= %.2f lexical similarity "
            "(indexed %d existing fragments)",
            max_similarity, len(pool),
        )

    # Build the SEMANTIC novelty index (embeddings via the GPU node). Catches thematic
    # dups the lexical gate can't. Resilient: if the embed endpoint is down,
    # banking proceeds WITHOUT the semantic gate rather than failing.
    semantic_index = None
    embedder = None
    if max_semantic_similarity < 1.0:
        import os
        from .database import IRC_DATABASE_URL
        db_path = IRC_DATABASE_URL.replace("sqlite:///", "")
        try:
            from .semantic_dedup import (
                Embedder, SemanticIndex, load_pool_texts,
                DEFAULT_BASE_URL, DEFAULT_MODEL,
            )
            base_url = os.environ.get("IRC_EMBED_BASE_URL", DEFAULT_BASE_URL)
            model = os.environ.get("IRC_EMBED_MODEL", DEFAULT_MODEL)
            embedder = Embedder(base_url, model)
            texts = load_pool_texts(db_path)
            ids = list(texts)
            vecs = embedder.embed([texts[i] for i in ids]) if ids else []
            semantic_index = SemanticIndex()
            for fid, vec in zip(ids, vecs):
                semantic_index.add(fid, vec)
            logger.info(
                "Semantic gate: reject fragments >= %.2f cosine "
                "(embedded %d existing via %s @ %s)",
                max_semantic_similarity, len(ids), model, base_url,
            )
        except Exception as e:
            logger.warning(
                "Semantic gate DISABLED — embed endpoint unreachable (%s). "
                "Banking continues with the lexical gate only.", e,
            )
            semantic_index = None
            embedder = None

    logger.info(
        "Banking %d fragment(s) (up to %d attempts, quality floor %.2f)...",
        count, max_attempts, min_quality,
    )
    fragments = await generate_batch(
        generator=generator,
        storage=storage,
        target_count=count,
        max_attempts=max_attempts,
        min_quality=min_quality,
        style=style,
        dedup_index=dedup_index,
        max_similarity=max_similarity,
        semantic_index=semantic_index,
        embedder=embedder,
        max_semantic_similarity=max_semantic_similarity,
    )

    stats = await storage.get_stats()
    print()
    print(f"  Banked this run : {len(fragments)}/{count}")
    print(f"  Total in DB     : {stats['total_fragments']}")
    print(f"  Available now   : {stats['available_fragments']}")
    print(f"  Avg quality     : {stats['avg_quality_score']:.2f}")
    if stats.get("by_style"):
        print(f"  By style        : {stats['by_style']}")
    if stats.get("by_collapse_type"):
        print(f"  By collapse     : {stats['by_collapse_type']}")
    # Judge (Kimi K2.5) cost for this run — real OpenRouter usage.cost where given.
    al = generator.autoloom
    print(f"  Judge cost      : ${al.cost_usd:.4f} over {al.judge_calls} calls"
          + (f" (${al.cost_usd/len(fragments):.4f}/fragment)" if fragments else ""))

    if not fragments:
        logger.warning(
            "No fragments banked — verify API keys, the exact model ids, and that "
            "the generation endpoint is reachable."
        )
        return 2
    return 0


def main(argv: Optional[list[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m aethera.irc.generate",
        description="Generate and bank IRC haunted-broadcast fragments to irc.sqlite.",
    )
    parser.add_argument(
        "-n", "--count", type=int, default=5,
        help="Number of fragments to bank (default: 5)",
    )
    parser.add_argument(
        "--max-attempts", type=int, default=None,
        help="Max generation attempts (default: count * 10)",
    )
    parser.add_argument(
        "-v", "--verbose", action="store_true",
        help="Enable debug logging",
    )
    judge_mode = parser.add_mutually_exclusive_group()
    judge_mode.add_argument(
        "--stateful", dest="stateful", action="store_true", default=None,
        help="Judge keeps one conversation across each fragment's rounds "
             "(overrides IRC_JUDGE_STATEFUL)",
    )
    judge_mode.add_argument(
        "--stateless", dest="stateful", action="store_false", default=None,
        help="Judge re-evaluates one-shot each round (the baseline)",
    )
    parser.add_argument(
        "--min-quality", type=float, default=0.0,
        help="Quality floor: discard (don't bank) fragments scoring below this "
             "and keep generating until --count good ones land (default: 0.0 = bank all)",
    )
    parser.add_argument(
        "--style", default=None,
        help="Force a single style (default: random). One of: "
             "technical, anomaly, incident, support, chaotic",
    )
    parser.add_argument(
        "--max-similarity", type=float, default=0.5,
        help="Novelty gate: reject a fragment this lexically similar (0-1) to the "
             "existing pool (default 0.5; set 1.0 to disable). Pool ceiling is "
             "currently ~0.03, so this only catches genuine near-dups as we scale.",
    )
    parser.add_argument(
        "--max-semantic-similarity", type=float, default=0.85,
        help="Semantic novelty gate: reject a fragment this THEMATICALLY close "
             "(cosine 0-1) to the pool — catches same-premise dups the lexical gate "
             "misses (default 0.85; 1.0 disables). Needs the GPU node embed server up "
             "(IRC_EMBED_BASE_URL); if it's down, banking proceeds without it.",
    )
    args = parser.parse_args(argv)

    # Load a local .env (cwd and parents) so keys/model config don't have to be
    # exported each session. Real environment variables still take precedence.
    load_dotenv()

    if args.count < 1:
        parser.error("--count must be >= 1")

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
        datefmt="%H:%M:%S",
    )
    # Silence HTTP client chatter ("HTTP Request: POST ... 200 OK") even under
    # -v, so the output stays focused on the generation loop. These libraries
    # log requests at INFO, so they'd show at the default level otherwise.
    for noisy in ("httpx", "httpcore", "openai", "anthropic", "urllib3"):
        logging.getLogger(noisy).setLevel(logging.WARNING)

    max_attempts = args.max_attempts if args.max_attempts is not None else args.count * 10

    try:
        return asyncio.run(_run(
            args.count, max_attempts,
            stateful=args.stateful, min_quality=args.min_quality, style=args.style,
            max_similarity=args.max_similarity,
            max_semantic_similarity=args.max_semantic_similarity,
        ))
    except KeyboardInterrupt:
        logger.warning("Interrupted.")
        return 130


if __name__ == "__main__":
    sys.exit(main())
