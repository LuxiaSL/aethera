"""
Phase 2 background work: every PASS_INTERVAL_S, derive eras/scenes and
render strata for whatever the dream recorded since the last pass. Runs in
a worker thread; failures log and wait for the next pass.
"""

import asyncio
import logging
from typing import Optional

from . import strata
from .segmenter import get_segmenter

logger = logging.getLogger(__name__)

PASS_INTERVAL_S = 5 * 60
FIRST_PASS_DELAY_S = 20

_task: Optional[asyncio.Task] = None


def run_once() -> dict:
    seg = get_segmenter().run_pass()
    tiles = strata.run_pass()
    return {"segmenter": seg, "strata": tiles}


async def _loop() -> None:
    await asyncio.sleep(FIRST_PASS_DELAY_S)
    while True:
        try:
            result = await asyncio.to_thread(run_once)
            if result["segmenter"]["closed"] or result["strata"]["rendered"]:
                logger.info(f"Chronicle pass: {result}")
        except asyncio.CancelledError:
            raise
        except Exception:
            logger.warning("Chronicle phase-2 pass failed", exc_info=True)
        await asyncio.sleep(PASS_INTERVAL_S)


def start() -> None:
    global _task
    if _task is None or _task.done():
        _task = asyncio.get_running_loop().create_task(_loop())


def stop() -> None:
    if _task and not _task.done():
        _task.cancel()
