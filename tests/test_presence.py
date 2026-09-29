"""Lifecycle rules for the dreams presence tracker."""

import asyncio

from aethera.dreams.presence import ViewerPresenceTracker


class _FakeSocket:
    pass


def test_monitoring_access_does_not_cancel_pending_shutdown():
    async def run() -> None:
        stopped: list[bool] = []

        async def stop() -> None:
            stopped.append(True)

        tracker = ViewerPresenceTracker(shutdown_delay=0.05, api_timeout=300, on_should_stop=stop)
        tracker.set_gpu_running(True)
        ws = _FakeSocket()
        await tracker.on_viewer_connect(ws)  # type: ignore[arg-type]
        await tracker.on_viewer_disconnect(ws)  # type: ignore[arg-type]
        # a status poll lands inside the grace period
        tracker.on_api_access(trigger_gpu_start=False)
        assert not tracker.has_recent_api_activity
        await asyncio.sleep(0.2)
        assert stopped == [True]

    asyncio.run(run())


def test_real_api_access_still_cancels_pending_shutdown():
    async def run() -> None:
        stopped: list[bool] = []

        async def stop() -> None:
            stopped.append(True)

        tracker = ViewerPresenceTracker(shutdown_delay=0.05, api_timeout=300, on_should_stop=stop)
        tracker.set_gpu_running(True)
        ws = _FakeSocket()
        await tracker.on_viewer_connect(ws)  # type: ignore[arg-type]
        await tracker.on_viewer_disconnect(ws)  # type: ignore[arg-type]
        tracker.on_api_access()
        await asyncio.sleep(0.2)
        assert stopped == []

    asyncio.run(run())
