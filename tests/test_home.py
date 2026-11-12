"""/ and the room: the flag that lets the room be tried at / before the flip."""

import re

import pytest
from fastapi.testclient import TestClient

import aethera.main as main
from aethera.api.oikos import SITES
from aethera.models.models import Post

ROOM_MARK = 'id="oikos-data"'


def _canonical(html: str) -> str:
    m = re.search(r'<link rel="canonical" href="([^"]+)"', html)
    return m.group(1) if m else ""


def _nav(html: str) -> str:
    m = re.search(r'<nav id="oikos-directory".*?</nav>', html, re.S)
    assert m, "the room must carry its plain directory"
    return m.group(0)


def test_home_defaults_to_the_blog(client: TestClient):
    r = client.get("/")
    assert r.status_code == 200
    assert ROOM_MARK not in r.text
    assert "Cookie" in r.headers.get("vary", "")


@pytest.mark.parametrize("name", ["room", "oikos", "ROOM"])
def test_flag_serves_the_room_and_remembers_it(client: TestClient, name: str):
    r = client.get(f"/?home={name}")
    assert r.status_code == 200
    assert ROOM_MARK in r.text
    assert "aethera_home=room" in r.headers.get("set-cookie", "")
    # flagged, the room still credits /oikos: the two addresses never compete
    assert _canonical(r.text) == "https://aetherawi.red/oikos"
    # the cookie alone brings it back
    assert ROOM_MARK in client.get("/").text


def test_home_blog_forgets_the_room(client: TestClient):
    client.get("/?home=room")
    r = client.get("/?home=blog")
    assert ROOM_MARK not in r.text
    assert "aethera_home=" in r.headers.get("set-cookie", "")
    assert ROOM_MARK not in client.get("/").text


def test_default_can_flip_to_the_room(client: TestClient, monkeypatch):
    monkeypatch.setattr(main, "HOME_DEFAULT", "room")
    assert ROOM_MARK in client.get("/").text
    assert ROOM_MARK not in client.get("/?home=blog").text


def test_htmx_never_swaps_the_room_in_at_home(client: TestClient):
    r = client.get("/?home=room", headers={"HX-Request": "true"})
    assert r.status_code == 200
    assert r.headers.get("HX-Redirect", "").endswith("/?home=room")
    assert ROOM_MARK not in r.text


def test_the_room_never_frames_itself():
    """At /, a screen showing / (or /oikos, or /~) would be the room inside the room."""
    for site in SITES:
        tune = site.get("tune")
        src = tune if isinstance(tune, str) else site["href"]
        for target in {site["href"], src}:
            path = target.split("?")[0].split("#")[0]
            assert path not in {"/", "/oikos", "/~"}, f"{site['id']} points at the room"


def test_posts_are_in_the_directory(client: TestClient, session):
    session.add(Post(title="Seen", slug="seen", author="a", content="x", content_html="<p>x</p>", published=True))
    session.add(Post(title="Draft", slug="draft", author="a", content="x", content_html="<p>x</p>", published=False))
    session.commit()
    nav = _nav(client.get("/?home=room").text)
    assert 'href="/posts/seen"' in nav
    assert "/posts/draft" not in nav
    assert 'href="/blog"' in nav


def test_the_room_has_its_own_card(client: TestClient):
    html = client.get("/oikos").text
    m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    assert m and "/static/images/home-card.jpg?v=" in m.group(1)
    assert client.get(m.group(1).replace("https://aetherawi.red", "")).status_code == 200
    assert 'property="og:image:alt"' in html and 'name="twitter:image"' in html
