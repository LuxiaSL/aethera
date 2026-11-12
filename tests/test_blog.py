"""/blog: the posts' own index, first page in the HTML."""

from fastapi.testclient import TestClient

from aethera.models.models import Post


def _post(session, slug: str, published: bool = True) -> None:
    session.add(Post(title=slug.title(), slug=slug, author="a", content="x", content_html="<p>x</p>", published=published))


def test_blog_has_its_posts_in_the_html(client: TestClient, session):
    _post(session, "first")
    _post(session, "hidden", published=False)
    session.commit()
    r = client.get("/blog")
    assert r.status_code == 200
    # no JS needed to find the posts (crawlers, agents, readers without JS)
    assert 'href="/posts/first"' in r.text
    assert "/posts/hidden" not in r.text


def test_blog_names_itself(client: TestClient):
    html = client.get("/blog").text
    assert '<link rel="canonical" href="http://testserver/blog">' in html
    assert '<meta property="og:url" content="http://testserver/blog">' in html


def test_post_fragments_are_not_pages(client: TestClient):
    r = client.get("/posts?page=1&per_page=5")
    assert r.status_code == 200
    assert r.headers.get("X-Robots-Tag") == "noindex"
    assert "<html" not in r.text


def test_home_can_still_show_the_blog(client: TestClient, session):
    """/ is the room now; ?home=blog is the way back while the move settles."""
    _post(session, "first")
    session.commit()
    assert 'href="/posts/first"' in client.get("/?home=blog").text
