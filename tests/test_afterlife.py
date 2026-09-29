from pathlib import Path

from fastapi.testclient import TestClient

from aethera.api.oikos import SITES

STATIC = Path(__file__).resolve().parents[1] / "aethera" / "static" / "afterlife"


def test_afterlife_page_renders(client: TestClient):
    r = client.get("/afterlife")
    assert r.status_code == 200
    assert "/static/afterlife/afterlife.js" in r.text
    assert "/static/afterlife/afterlife.css" in r.text
    # the terminal and the splash are markup, so they paint before the bundle parses
    for el in ('id="afterlife-root"', 'id="term"', 'id="splash"', 'id="keys"'):
        assert el in r.text, el
    # leaving must be a real navigation (pagehide saves the universe)
    assert 'id="afterlife-home" href="/" hx-boost="false"' in r.text


def test_bundle_is_committed():
    """The Docker image never runs npm; the built page must be in the tree."""
    for name in ("afterlife.js", "afterlife.css"):
        assert (STATIC / name).is_file(), name
    # the music worklet is inlined into the bundle, not a second file
    assert "afterlife-music" in (STATIC / "afterlife.js").read_text()


def test_afterlife_is_on_the_map(client: TestClient):
    assert "/afterlife" in client.get("/sitemap.xml").text
    assert "/afterlife" in client.get("/urls.txt").text
    site = next(s for s in SITES if s["id"] == "afterlife")
    assert site["href"] == "/afterlife" and site["tune"] is True


def test_afterlife_frames_only_for_aethera(client: TestClient):
    """oikos tunes the page in on its screen; nobody else may frame it."""
    r = client.get("/afterlife")
    assert r.headers["content-security-policy"] == "frame-ancestors 'self'"
    assert r.headers["x-frame-options"] == "SAMEORIGIN"
