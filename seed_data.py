from sqlmodel import Session, select
from datetime import datetime, timezone
from sqlmodel import Session, select
from datetime import datetime, timezone
from sqlmodel import Session, select
from datetime import datetime, timezone
from luxiblog.models.base import get_engine, init_db
from luxiblog.models.models import Post, Comment
from slugify import slugify

def seed_data():
    # Ensure tables exist
    init_db()
    
    engine = get_engine()
    with Session(engine) as session:
        # Check if we already have posts
        existing_posts = session.exec(select(Post)).all()
        if existing_posts:
            print("Database already has posts. Skipping seed.")
            return

        print("Seeding data...")

        # Post 1: Intro
        post1 = Post(
            title="Hello, World: A New Beginning",
            slug="hello-world-new-beginning",
            author="Luxia",
            content="""
# Welcome to LuxiBlog

This is the first post on the newly refactored **LuxiBlog**. The goal of this project was to create a *minimalist*, *high-performance*, and *AI-friendly* blogging platform.

## Key Features

*   **FastAPI Backend**: High performance, easy to extend.
*   **HTMX Frontend**: Dynamic interactions without the SPAs bloat.
*   **Markdown Support**: Write in your favorite format.
*   **Gwern-lite Aesthetic**: Focused on typography and readability.

> "Simplicity is the ultimate sophistication." - Leonardo da Vinci

### Code Example

```python
def hello():
    print("Hello, World!")
```
            """,
            content_html="""<h1>Welcome to LuxiBlog</h1><p>This is the first post on the newly refactored <strong>LuxiBlog</strong>. The goal of this project was to create a <em>minimalist</em>, <em>high-performance</em>, and <em>AI-friendly</em> blogging platform.</p><h2>Key Features</h2><ul><li><strong>FastAPI Backend</strong>: High performance, easy to extend.</li><li><strong>HTMX Frontend</strong>: Dynamic interactions without the SPAs bloat.</li><li><strong>Markdown Support</strong>: Write in your favorite format.</li><li><strong>Gwern-lite Aesthetic</strong>: Focused on typography and readability.</li></ul><blockquote><p>"Simplicity is the ultimate sophistication." - Leonardo da Vinci</p></blockquote><h3>Code Example</h3><pre><code class="language-python">def hello():\n    print("Hello, World!")</code></pre>""",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            published=True,
            tags="intro, meta, python",
            license="CC BY 4.0"
        )
        session.add(post1)

        # Post 2: Long form text
        post2 = Post(
            title="On the Nature of Artificial Intelligence",
            slug="on-the-nature-of-artificial-intelligence",
            author="Luxia",
            content="""
# The AI Revolution

Artificial Intelligence is transforming the way we interact with technology. From **LLMs** to **generative art**, the landscape is shifting rapidly.

## The Impact on Coding

As we've seen with tools like *Copilot* and *Ghostwriter*, AI is becoming an integral part of the development workflow. It allows for:

1.  Faster prototyping.
2.  Automated testing.
3.  Complex refactoring assistance.

---

*This is a sample post to test long-form content rendering and typography.*
            """,
            content_html="""<h1>The AI Revolution</h1><p>Artificial Intelligence is transforming the way we interact with technology. From <strong>LLMs</strong> to <strong>generative art</strong>, the landscape is shifting rapidly.</p><h2>The Impact on Coding</h2><p>As we've seen with tools like <em>Copilot</em> and <em>Ghostwriter</em>, AI is becoming an integral part of the development workflow. It allows for:</p><ol><li>Faster prototyping.</li><li>Automated testing.</li><li>Complex refactoring assistance.</li></ol><hr /><p><em>This is a sample post to test long-form content rendering and typography.</em></p>""",
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
            published=True,
            tags="ai, future, tech",
            license="CC BY 4.0"
        )
        session.add(post2)
        
        session.commit()
        session.refresh(post1)
        session.refresh(post2)

        # Comments
        comment1 = Comment(
            post_id=post1.id,
            content="Great first post! Loving the design.",
            content_html="<p>Great first post! Loving the design.</p>",
            author="Reader One",
            created_at=datetime.now(timezone.utc)
        )
        session.add(comment1)

        comment2 = Comment(
            post_id=post1.id,
            content="Can't wait to see more.",
            content_html="<p>Can't wait to see more.</p>",
            author="Reader Two",
            created_at=datetime.now(timezone.utc)
        )
        session.add(comment2)

        session.commit()
        print("Data seeded successfully!")

if __name__ == "__main__":
    seed_data()
