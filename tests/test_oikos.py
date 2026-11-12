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
    r = client.get("/")
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
    posts = _embedded(client.get("/").text)["posts"]
    assert [p["title"] for p in posts] == ["Seen"]
    assert posts[0]["href"] == "/posts/seen"


def test_tilde_is_home(client: TestClient):
    r = client.get("/~", follow_redirects=False)
    assert r.status_code == 307
    assert r.headers["location"] == "/"


def test_oikos_moved_home(client: TestClient):
    """/oikos is the room's old address: it sends you to /, keeping the query
    (the browser keeps #mirc and #<place> by itself)."""
    r = client.get("/oikos", follow_redirects=False)
    assert r.status_code == 302
    assert r.headers["location"] == "/"
    r = client.get("/oikos?look=irc&contact", follow_redirects=False)
    assert r.headers["location"] == "/?look=irc&contact"
    assert 'id="oikos-data"' in client.get("/oikos").text


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
        # the bundle has no path for a site with nowhere to go
        assert isinstance(s.get("href"), str) and s["href"], s["id"]
        # nothing internal leaks into a public page
        assert ".ath" not in json.dumps(s) and "10.132" not in json.dumps(s)


def test_bundle_is_committed():
    """The Docker image never runs npm; the built room must be in the tree."""
    for name in ("oikos.js", "oikos.css", "stage.jpg", "mark.png"):
        assert (STATIC / name).is_file(), name


def test_pages_frame_only_for_themselves(client: TestClient):
    """oikos lays the real pages on its screens, so æthera may frame æthera;
    nobody else may (clickjacking stays shut)."""
    for path in ("/syrinx", "/"):
        r = client.get(path)
        assert r.headers["content-security-policy"] == "frame-ancestors 'self'", path
        assert r.headers["x-frame-options"] == "SAMEORIGIN", path
    # the admin panel's draft preview keeps its own, wider policy (any status:
    # the middleware stamps headers even on a refused token)
    r = client.get("/preview/anything")
    assert "https://admin.aetherawi.red" in r.headers["content-security-policy"]
    assert "x-frame-options" not in r.headers


def test_post_titles_cannot_break_out_of_the_data_script(client: TestClient, session):
    evil = "</script><script>alert(1)</script>'\"&"
    session.add(Post(title=evil, slug="evil", author="a", content="x", content_html="<p>x</p>", published=True))
    session.commit()
    html = client.get("/").text
    assert "</script><script>alert(1)" not in html
    assert _embedded(html)["posts"][0]["title"] == evil


def test_every_tunable_page_exists(client: TestClient):
    for site in SITES:
        tune = site.get("tune")
        if not tune:
            continue
        src = tune if isinstance(tune, str) else site["href"]
        assert src.startswith("/"), f"{site['id']}: only same-origin pages can be tuned in"
        assert client.get(src).status_code == 200, src


def test_oikos_is_a_lean_page(client: TestClient):
    """The room is its own page: none of the blog's chrome (Tailwind, htmx,
    highlight.js, the background video, caustics' second WebGL loop) rides
    along, and what it does load is versioned so it can cache for a year."""
    html = client.get("/").text
    for heavy in ("tailwind", "htmx", "highlight.js", "background_web.mp4", "caustics.js", "aethera_trimmed.png"):
        assert heavy not in html, heavy
    for asset in ("oikos/oikos.js", "oikos/oikos.css", "oikos/boot-logo.webp", "fonts/LoveLetterTypewriter.woff2"):
        assert re.search(rf"/static/{re.escape(asset)}\?v=[0-9a-f]{{12}}", html), asset
    # every versioned URL the page names must actually be served
    for url in set(re.findall(r'/static/[^"\')\s]+\?v=[0-9a-f]{12}', html)):
        assert client.get(url).status_code == 200, url


def test_htmx_never_swaps_the_room_in(client: TestClient):
    """hx-boost swaps only <body>, so a boosted link would boot the room without
    its <head> (no stylesheet, no fonts). htmx asking for it gets a real load."""
    r = client.get("/", headers={"HX-Request": "true"})
    assert r.status_code == 200
    assert r.headers["HX-Redirect"].endswith("/")
    assert r.text == ""


def test_links_home_are_never_boosted():
    """Every href="/" in a template opts out of hx-boost: home is about to be the
    room, which must arrive as a whole page."""
    root = Path(__file__).resolve().parents[1] / "aethera" / "templates"
    for path in root.rglob("*.html"):
        for m in re.finditer(r'<a\b[^>]*href="/"[^>]*>', path.read_text()):
            assert 'hx-boost="false"' in m.group(0), f"{path.relative_to(root)}: {m.group(0)}"


def test_each_place_has_one_kind():
    """A tile and its details panel must not call the same place two things."""
    for site in SITES:
        listed = dict(site["details"]).get("kind")
        assert listed in (None, site["kind"]), f"{site['id']}: {site['kind']!r} vs {listed!r}"


def test_room_structured_data_parses(client: TestClient):
    """The room's JSON-LD is hand-templated: it must stay valid JSON, name the
    site at /, and list the blog as a Blog at /blog."""
    html = client.get("/").text
    m = re.search(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
    assert m
    data = json.loads(m.group(1))
    site, page = data["@graph"]
    assert site["@type"] == "WebSite" and site["url"] == "https://aetherawi.red/"
    assert page["url"] == "https://aetherawi.red/"
    assert {"@type": "Blog", "url": "https://aetherawi.red/blog"}.items() <= next(p for p in page["hasPart"] if p["@type"] == "Blog").items()
