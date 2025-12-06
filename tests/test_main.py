from fastapi.testclient import TestClient

def test_read_main(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200
    assert "æthera" in response.text

def test_llms_txt(client: TestClient):
    response = client.get("/llms.txt")
    assert response.status_code == 200
    assert "æthera" in response.text

def test_feed_xml(client: TestClient):
    response = client.get("/feed.xml")
    assert response.status_code == 200
    assert "rss" in response.text

def test_read_post(client: TestClient, session):
    from aethera.models.models import Post
    post = Post(
        title="Test Post",
        slug="test-post",
        content="This is a test post content.",
        content_html="<p>This is a test post content.</p>",
        published=True,
        author="admin"
    )
    session.add(post)
    session.commit()
    
    response = client.get("/posts/test-post")
    assert response.status_code == 200
    assert "Test Post" in response.text
    assert "og:title" in response.text
