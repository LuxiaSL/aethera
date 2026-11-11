"""The site has no logins, so it has no write routes either.

Posts are written by the admin panel straight into the database. Over HTTP the
blog is read-only, apart from comments (which anyone may post and nobody can
edit). The IRC generation admin was a local tool and is not served at all.
"""
from fastapi.testclient import TestClient
from sqlmodel import select

from aethera.models.models import Post


def test_posts_cannot_be_created_over_http(client: TestClient, session):
    form = {"title": "hello", "content": "body", "author": "someone", "published": "true"}
    assert client.post("/api/posts", data=form).status_code == 405
    assert session.exec(select(Post)).all() == []


def test_posts_cannot_be_edited_over_http(client: TestClient, session):
    session.add(Post(title="orig", slug="orig", author="a", content="x", content_html="<p>x</p>", published=True))
    session.commit()
    assert client.put("/api/posts/orig", data={"content": "defaced"}).status_code == 405
    session.expire_all()
    assert session.exec(select(Post).where(Post.slug == "orig")).one().content == "x"
    assert client.get("/api/posts/orig").status_code == 200  # still readable


def test_no_write_methods_anywhere_under_api_posts():
    from aethera.main import app
    for route in app.routes:
        path = getattr(route, "path", "")
        if path.startswith("/api/posts") and "comments" not in path:
            assert getattr(route, "methods", set()) <= {"GET", "HEAD"}, (path, route.methods)


def test_irc_admin_is_gone(client: TestClient):
    for path in ("/irc/admin", "/irc/admin/sessions", "/irc/admin/providers"):
        assert client.get(path).status_code == 404, path
    assert client.post("/irc/admin/sessions", json={}).status_code in (404, 405)
