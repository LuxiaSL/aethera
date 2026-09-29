import json
import re
from pathlib import Path

from fastapi.testclient import TestClient

from aethera.api.oikos import FILES, SITES
from aethera.models.models import Post

STATIC = Path(__file__).resolve().parents[1] / "aethera" / "static" / "oikos"


def _embedded(html: str) -> dict:
    m = re.search(r'<script type="application/json" id="oikos-data">(.*?)</script>', html, re.S)
    assert m, "the page must carry the directory as JSON for the room"
    return json.loads(m.group(1))


def test_oikos_renders_the_directory(client: TestClient):
    r = client.get("/oikos")
    assert r.status_code == 200
    # the plain <nav> is what crawlers (and no-WebGL visitors) get: every site is in it
    for site in SITES:
        assert site["title"] in r.text
    for f in FILES:
        assert f'href="{f["href"]}"' in r.text
    assert "/static/oikos/oikos.js" in r.text
    data = _embedded(r.text)
    assert [s["id"] for s in data["sites"]] == [s["id"] for s in SITES]


def test_oikos_embeds_published_posts_only(client: TestClient, session):
    session.add(Post(title="Seen", slug="seen", author="a", content="x", content_html="<p>x</p>", published=True))
    session.add(Post(title="Draft", slug="draft", author="a", content="x", content_html="<p>x</p>", published=False))
    session.commit()
    posts = _embedded(client.get("/oikos").text)["posts"]
    assert [p["title"] for p in posts] == ["Seen"]
    assert posts[0]["href"] == "/posts/seen"


def test_tilde_is_home(client: TestClient):
    r = client.get("/~", follow_redirects=False)
    assert r.status_code == 307
    assert r.headers["location"] == "/oikos"


def test_every_tape_plays(client: TestClient):
    """A tape in the directory that points at a missing page would dive the
    visitor into a 404: every internal href must be a real route."""
    for site in SITES:
        href = site["href"]
        if href and href.startswith("/"):
            assert client.get(href).status_code == 200, href
    for f in FILES:
        assert client.get(f["href"]).status_code == 200, f["href"]


def test_sites_are_well_formed():
    ids = [s["id"] for s in SITES]
    assert len(ids) == len(set(ids))
    for s in SITES:
        assert s["group"] in {"here", "wired"}
        assert re.fullmatch(r"#[0-9a-f]{6}", s["accent"]), s["id"]
        assert s["tagline"] and s["about"]
        # nothing internal leaks into a public page
        assert ".ath" not in json.dumps(s) and "10.132" not in json.dumps(s)


def test_bundle_is_committed():
    """The Docker image never runs npm; the built room must be in the tree."""
    for name in ("oikos.js", "oikos.css", "stage.jpg", "mark.png"):
        assert (STATIC / name).is_file(), name


def test_pages_frame_only_for_themselves(client: TestClient):
    """oikos lays the real pages on its screens, so æthera may frame æthera;
    nobody else may (clickjacking stays shut)."""
    r = client.get("/syrinx")
    assert r.headers["content-security-policy"] == "frame-ancestors 'self'"
    assert r.headers["x-frame-options"] == "SAMEORIGIN"


def test_every_tunable_page_exists(client: TestClient):
    for site in SITES:
        tune = site.get("tune")
        if not tune:
            continue
        src = tune if isinstance(tune, str) else site["href"]
        assert src.startswith("/"), f"{site['id']}: only same-origin pages can be tuned in"
        assert client.get(src).status_code == 200, src
