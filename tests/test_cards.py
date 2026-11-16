"""Posts' link cards: a picture per post, drawn from its title and author."""

import io
import re
from urllib.parse import urlsplit

from fastapi.testclient import TestClient
from PIL import Image

from aethera.models.models import Post
from aethera.utils import cards


def _post(session, slug="love", title="love", author="luxia", published=True):
    p = Post(title=title, slug=slug, author=author, content="x", content_html="<p>x</p>", published=published)
    session.add(p)
    session.commit()
    return p


def _card_url(html: str) -> str:
    m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    assert m, "a post page must name its card"
    return m.group(1)


def test_a_post_unfurls_into_its_own_card(client: TestClient, session):
    _post(session)
    html = client.get("/posts/love").text
    url = _card_url(html)
    assert re.search(r"/posts/love/card\.jpg\?v=[0-9a-f]{10}$", url), url
    assert f'name="twitter:image" content="{url}"' in html
    parts = urlsplit(url)
    r = client.get(f"{parts.path}?{parts.query}")
    assert r.status_code == 200
    assert r.headers["content-type"] == "image/jpeg"
    assert "max-age" in r.headers["cache-control"]
    img = Image.open(io.BytesIO(r.content))
    assert img.size == (1200, 630)


def test_drafts_have_no_card(client: TestClient, session):
    _post(session, slug="draft", published=False)
    assert client.get("/posts/draft/card.jpg").status_code == 404


def test_the_card_url_changes_with_what_is_drawn():
    a = cards.card_version("love", "love", "luxia", "2026-11-16")
    assert a == cards.card_version("love", "love", "luxia", "2026-11-16")
    assert a != cards.card_version("love", "love, again", "luxia", "2026-11-16")
    assert a != cards.card_version("love", "love", "someone", "2026-11-16")


def test_long_titles_still_fit():
    data = cards.render_card("x", "word " * 80, "luxia", "2026-11-16")
    assert Image.open(io.BytesIO(data)).size == (1200, 630)
    # one unbreakable word wider than the card
    data = cards.render_card("y", "a" * 300, "luxia", "2026-11-16")
    assert Image.open(io.BytesIO(data)).size == (1200, 630)


def test_oembed_carries_the_card(client: TestClient, session):
    _post(session)
    data = client.get("/oembed?url=http://testserver/posts/love&format=json").json()
    assert "/posts/love/card.jpg?v=" in data["thumbnail_url"]
