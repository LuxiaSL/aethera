"""Static files cache properly, and compression skips what can't shrink."""

import re

from fastapi.testclient import TestClient

from aethera.utils.static_assets import asset_url

GZIP = {"Accept-Encoding": "gzip"}


def test_asset_url_is_versioned_by_content():
    url = asset_url("oikos/oikos.js")
    assert re.fullmatch(r"/static/oikos/oikos\.js\?v=[0-9a-f]{12}", url)
    assert asset_url("/oikos/oikos.js") == url  # a leading slash changes nothing


def test_asset_url_never_raises():
    # a missing file, or one outside /static, falls back to the bare URL
    assert asset_url("no/such/file.js") == "/static/no/such/file.js"
    assert "?v=" not in asset_url("../main.py")


def test_versioned_assets_are_immutable(client: TestClient):
    r = client.get(asset_url("oikos/oikos.js"))
    assert r.status_code == 200
    assert r.headers["cache-control"] == "public, max-age=31536000, immutable"


def test_unversioned_assets_revalidate_soon(client: TestClient):
    r = client.get("/static/oikos/oikos.js")
    assert r.status_code == 200
    assert r.headers["cache-control"] == "public, max-age=300"
    assert r.headers.get("etag")


def test_text_is_gzipped_media_is_not(client: TestClient):
    assert client.get("/static/oikos/oikos.js", headers=GZIP).headers.get("content-encoding") == "gzip"
    for path in ("/static/oikos/boot-logo.webp", "/static/fonts/LoveLetterTypewriter.woff2"):
        r = client.get(path, headers=GZIP)
        assert r.status_code == 200, path
        assert "content-encoding" not in r.headers, path


def test_fonts_have_font_types(client: TestClient):
    # under nosniff, a font served as text/plain is refused
    assert client.get("/static/fonts/LoveLetterTypewriter.woff2").headers["content-type"] == "font/woff2"
    assert client.get("/static/fonts/LibertinusMono-Regular.ttf").headers["content-type"] == "font/ttf"


def test_hand_written_versions_are_not_pinned(client: TestClient):
    """?v=2 by hand can be forgotten when the file changes: only a URL whose v
    is the file's own content hash may be cached for a year."""
    r = client.get("/static/oikos/oikos.js?v=2")
    assert r.status_code == 200
    assert r.headers["cache-control"] == "public, max-age=300"
    # a stale hash (the file changed since the URL was written) is not pinned either
    assert client.get("/static/oikos/oikos.js?v=000000000000").headers["cache-control"] == "public, max-age=300"
