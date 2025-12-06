#!/usr/bin/env python3
"""
æthera Test Data Seeding Script

Creates a comprehensive test dataset with:
- Posts of varied lengths (short, medium, long, very long)
- Comments with different formatting (markdown, greentext, code)
- Same-post comment references (>>ID)
- Cross-post comment references
- Nested reply chains for backlink testing
- Tripcodes for some users

Usage:
    python seed_data.py          # Seed only if empty
    python seed_data.py --reset  # Clear and reseed
    python seed_data.py --clear  # Just clear, no seed
"""

import sys
import os
from datetime import datetime, timezone, timedelta
from sqlmodel import Session, select

from aethera.models.base import get_engine, init_db
from aethera.models.models import Post, Comment
from aethera.utils.markdown import render_markdown, render_comment_markdown


def clear_database():
    """Remove all posts and comments."""
    engine = get_engine()
    with Session(engine) as session:
        # Delete comments first (foreign key constraint)
        comments = session.exec(select(Comment)).all()
        for comment in comments:
            session.delete(comment)
        
        posts = session.exec(select(Post)).all()
        for post in posts:
            session.delete(post)
        
        session.commit()
        print(f"Cleared {len(comments)} comments and {len(posts)} posts.")


def create_post(session, title, slug, author, content, tags, days_ago=0):
    """Helper to create a post with proper markdown rendering."""
    content_html = render_markdown(content)
    excerpt = Post.create_excerpt(content.strip())
    
    created = datetime.now(timezone.utc) - timedelta(days=days_ago)
    
    post = Post(
        title=title,
        slug=slug,
        author=author,
        content=content.strip(),
        content_html=content_html,
        excerpt=excerpt,
        created_at=created,
        updated_at=created,
        published=True,
        tags=tags,
        license="CC BY 4.0"
    )
    session.add(post)
    session.commit()
    session.refresh(post)
    return post


def create_comment(session, post, content, author, password=None, hours_ago=0, references=None):
    """Helper to create a comment with proper processing."""
    content_html = render_comment_markdown(content)
    content_html = Comment.process_cross_references(content_html, session)
    
    tripcode = Comment.generate_tripcode(password) if password else None
    refs = Comment.extract_references(content)
    refs_str = ",".join(str(r) for r in refs) if refs else None
    
    created = datetime.now(timezone.utc) - timedelta(hours=hours_ago)
    
    comment = Comment(
        post_id=post.id,
        content=content.strip(),
        content_html=content_html,
        author=author,
        tripcode=tripcode,
        references=refs_str,
        created_at=created
    )
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment


def seed_data():
    """Create comprehensive test dataset."""
    init_db()
    engine = get_engine()
    
    with Session(engine) as session:
        # Check if already seeded
        existing = session.exec(select(Post)).first()
        if existing:
            print("Database already has data. Use --reset to clear first.")
            return
        
        print("Seeding comprehensive test data...")
        
        # ============================================
        # POST 1: Short introductory post
        # ============================================
        post1 = create_post(
            session,
            title="Welcome to æthera",
            slug="welcome-to-aethera",
            author="æthera",
            tags="meta, intro",
            days_ago=30,
            content="""
# Welcome!

This is **æthera**, a space for thoughts, fragments, and transmissions from the digital aether.

Feel free to leave comments below using the 4chan-style reply system.
"""
        )
        print(f"  Created post: {post1.title} (ID: {post1.id})")
        
        # ============================================
        # POST 2: Medium-length technical post
        # ============================================
        post2 = create_post(
            session,
            title="Understanding the Comment System",
            slug="understanding-the-comment-system",
            author="æthera",
            tags="tutorial, comments, features",
            days_ago=14,
            content="""
# The Comment System

æthera uses a 4chan-inspired comment system with several unique features.

## Reference Syntax

To reply to another comment, use the `>>ID` syntax:

- `>>5` - References comment #5
- Multiple references work: `>>1 >>2 >>3`

## Quoting

Select text and click "Quote" to auto-quote with greentext formatting.

> This is what quoted text looks like.

## Tripcodes

Enter a password in the tripcode field to generate a unique identifier that proves your identity across comments.

## Cross-Post References

References to comments on other posts automatically link to the correct page!

```python
# Example: How references are processed
content = ">>123"
html = process_cross_references(content, session)
# Result: <a href="/posts/other-post#comment-123">...
```

Try it out below!
"""
        )
        print(f"  Created post: {post2.title} (ID: {post2.id})")
        
        # ============================================
        # POST 3: Long-form essay
        # ============================================
        post3 = create_post(
            session,
            title="On the Nature of Online Discourse",
            slug="on-the-nature-of-online-discourse",
            author="æthera",
            tags="essay, philosophy, internet",
            days_ago=7,
            content="""
# On the Nature of Online Discourse

The internet has fundamentally transformed how humans communicate. What began as a network for sharing academic research has evolved into the primary medium for global discourse.

## The Anonymity Question

Anonymous platforms like 4chan demonstrated both the best and worst of human nature. When identity is stripped away, people feel free to express thoughts they'd never voice publicly. This cuts both ways.

### Benefits of Anonymity

1. **Honest feedback** - Without social consequences, people speak their minds
2. **Idea meritocracy** - Arguments stand on their own merits
3. **Privacy protection** - Whisteblowers and dissidents can speak safely
4. **Reduced tribalism** - Harder to form in-groups based on identity

### Drawbacks of Anonymity

1. **Reduced accountability** - Bad actors face no consequences
2. **Trolling incentives** - Chaos becomes entertainment
3. **Trust erosion** - Hard to build relationships
4. **Quality degradation** - No reputation to maintain

## The Middle Path

Systems like tripcodes offer a compromise. Users can maintain pseudonymous identity without revealing personal information. The tripcode `!ABC123` proves "this is the same person who posted before" without revealing *who* that person is.

> "On the internet, nobody knows you're a dog."
> — Peter Steiner, 1993

## Threading and Replies

The `>>ID` syntax creates an implicit thread structure. Unlike traditional forums with explicit threading, imageboard-style replies create a *graph* of references that readers mentally reconstruct.

This has interesting cognitive implications:

- **Non-linear reading** - Conversations branch and merge
- **Context collapse** - Must hover to see referenced content
- **Emergent narratives** - Story forms from fragments

## Code Example: Reference Graph

```python
# Build a reply graph from comments
def build_graph(comments):
    graph = defaultdict(list)
    for comment in comments:
        for ref in comment.get_references_list():
            graph[ref].append(comment.id)
    return graph

# Result: {1: [2, 5], 2: [3, 4], ...}
```

## Conclusion

The best online discourse systems balance:

- **Identity** vs **Anonymity**
- **Structure** vs **Flexibility**  
- **Moderation** vs **Free expression**

There are no perfect solutions, only tradeoffs.

---

*What are your thoughts? Leave a comment below.*
"""
        )
        print(f"  Created post: {post3.title} (ID: {post3.id})")
        
        # ============================================
        # POST 4: Very long technical documentation
        # ============================================
        post4 = create_post(
            session,
            title="æthera Technical Architecture",
            slug="aethera-technical-architecture",
            author="æthera",
            tags="technical, architecture, documentation",
            days_ago=3,
            content="""
# æthera Technical Architecture

This document describes the complete technical architecture of æthera, a FastAPI-based blogging platform.

## Technology Stack

### Backend

| Component | Technology | Purpose |
|-----------|------------|---------|
| Framework | FastAPI | Async web framework |
| ORM | SQLModel | Type-safe database access |
| Database | SQLite | Simple, embedded storage |
| Templates | Jinja2 | Server-side rendering |
| Realtime | SSE | Live comment updates |

### Frontend

| Component | Technology | Purpose |
|-----------|------------|---------|
| Interactivity | HTMX | HTML-over-the-wire |
| Styling | Tailwind CSS | Utility-first CSS |
| Custom CSS | branding.css | Theme and components |

## Request Flow

```
┌─────────────────────────────────────────────────────────┐
│                      Client Request                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   SecurityMiddleware                     │
│              (adds security headers)                     │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                     FastAPI Router                       │
│                 (route matching)                         │
└─────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
         ┌────────┐   ┌──────────┐  ┌──────────┐
         │ posts  │   │ comments │  │   seo    │
         └────────┘   └──────────┘  └──────────┘
              │             │             │
              └─────────────┼─────────────┘
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Jinja2 Templates                      │
│              (HTML rendering)                            │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      HTML Response                       │
└─────────────────────────────────────────────────────────┘
```

## Database Schema

### Post Model

```python
class Post(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    title: str
    slug: str = Field(unique=True, index=True)
    author: str
    content: str      # Raw markdown
    content_html: str # Rendered HTML
    excerpt: Optional[str]
    published: bool = False
    created_at: datetime
    updated_at: datetime
    tags: Optional[str]        # Comma-separated
    categories: Optional[str]  # Comma-separated
    canonical_url: Optional[str]
    license: str = "CC BY 4.0"
```

### Comment Model

```python
class Comment(SQLModel, table=True):
    id: Optional[int] = Field(primary_key=True)
    content: str      # Raw content
    content_html: str # Rendered HTML with links
    author: str = "Anonymous"
    tripcode: Optional[str]    # Identity verification
    ip_address: Optional[str]  # For rate limiting
    references: Optional[str]  # Comma-separated IDs
    created_at: datetime
    post_id: int = Field(foreign_key="post.id")
```

## Comment Processing Pipeline

When a comment is submitted, it goes through several processing stages:

### Stage 1: Markdown Preprocessing

```python
def render_comment_markdown(content: str) -> str:
    # Replace >>123 with placeholders to prevent
    # markdown from treating > as blockquote
    content = re.sub(r'>>(\\d+)', placeholder, content)
    
    # Run markdown parser
    html = markdown.render(content)
    
    # Restore references
    html = restore_placeholders(html)
    return html
```

### Stage 2: Cross-Reference Resolution

```python
def process_cross_references(html: str, session) -> str:
    # Find all >>ID patterns
    refs = re.findall(r'>>(\\d+)', html)
    
    # Batch fetch referenced comments
    comments = fetch_comments(refs, session)
    
    # Build ID -> post_slug map
    ref_map = {c.id: c.post.slug for c in comments}
    
    # Replace with proper links
    for ref_id in refs:
        if ref_id in ref_map:
            href = f"/posts/{ref_map[ref_id]}#comment-{ref_id}"
        else:
            href = f"#comment-{ref_id}"
        html = html.replace(f">>{ref_id}", make_link(href, ref_id))
    
    return html
```

### Stage 3: Reference Extraction

```python
def extract_references(content: str) -> List[int]:
    # Used for backlink tracking
    return list(set(re.findall(r'>>(\\d+)', content)))
```

## Real-time Updates via SSE

```python
@router.get("/stream/comments/{post_id}")
async def stream_comments(post_id: int):
    queue = asyncio.Queue()
    subscribers[post_id].append(queue)
    
    async def generator():
        while True:
            comment = await queue.get()
            html = render_comment(comment)
            yield {"event": "new_comment", "data": html}
    
    return EventSourceResponse(generator())
```

## Frontend JavaScript

The comment system JavaScript handles:

1. **Hover Previews** - Fetch and display comment on hover
2. **Quote Selection** - Detect selection, show quote button
3. **Draggable Modal** - Reply modal with position memory
4. **Quick Reply** - Click No.X to start reply

See `/static/js/comments.js` for implementation.

## Performance Considerations

- **Backlinks computed at render time** - No separate table
- **Preview cache** - Per-session, cleared on refresh
- **Lazy relationship loading** - Only fetch post when needed
- **Connection pooling** - SQLite with check_same_thread=False

## Security

- **Rate limiting** - IP-based for comments
- **No raw HTML** - Markdown with html=False
- **Tripcode salt** - Environment variable
- **CSRF** - Via SameSite cookies (future)

---

*Questions? Leave a comment or check the source on GitHub.*
"""
        )
        print(f"  Created post: {post4.title} (ID: {post4.id})")
        
        # ============================================
        # POST 5: Short announcement
        # ============================================
        post5 = create_post(
            session,
            title="Comment System Update",
            slug="comment-system-update",
            author="æthera",
            tags="announcement, update",
            days_ago=1,
            content="""
# New Comment Features!

Just deployed several improvements to the comment system:

- **Hover previews** - See referenced comments without scrolling
- **Quote selection** - Highlight text and click Quote
- **Draggable reply modal** - Position it anywhere
- **Cross-post references** - Link to comments on other posts
- **Backlinks** - See who replied to your comment

Try them out!
"""
        )
        print(f"  Created post: {post5.title} (ID: {post5.id})")
        
        # ============================================
        # COMMENTS - Post 1 (Welcome)
        # ============================================
        print("\n  Creating comments for Post 1...")
        
        c1 = create_comment(
            session, post1,
            "First! Great to see the new site up and running.",
            "Anonymous",
            hours_ago=700
        )
        
        c2 = create_comment(
            session, post1,
            ">>%d\nNice, congrats on the launch!" % c1.id,
            "Anon",
            hours_ago=698
        )
        
        c3 = create_comment(
            session, post1,
            "The design is very clean. Reminds me of gwern.net",
            "DesignFan",
            password="design123",
            hours_ago=650
        )
        
        # ============================================
        # COMMENTS - Post 2 (Comment System Tutorial)
        # ============================================
        print("  Creating comments for Post 2...")
        
        c4 = create_comment(
            session, post2,
            "Testing the reference system: >>%d" % c1.id,
            "Tester",
            hours_ago=330
        )
        
        c5 = create_comment(
            session, post2,
            """>>%d
>Testing the reference system
It works! Cross-post references are neat.""" % c4.id,
            "Anonymous",
            hours_ago=328
        )
        
        c6 = create_comment(
            session, post2,
            """Let me try multiple refs:
>>%d >>%d >>%d

All three should be links.""" % (c1.id, c2.id, c3.id),
            "RefTester",
            hours_ago=320
        )
        
        c7 = create_comment(
            session, post2,
            """Testing markdown features:

**Bold text** and *italic text*

- List item 1
- List item 2

`inline code`

```python
def test():
    return "code block"
```""",
            "MarkdownUser",
            hours_ago=300
        )
        
        # ============================================
        # COMMENTS - Post 3 (Essay - lots of discussion)
        # ============================================
        print("  Creating comments for Post 3...")
        
        c8 = create_comment(
            session, post3,
            """Great essay. I especially agree with the point about tripcodes as a middle ground.

>Systems like tripcodes offer a compromise

This is exactly right. Full anonymity has too many downsides for serious discussion.""",
            "ThoughtfulReader",
            password="thinker",
            hours_ago=160
        )
        
        c9 = create_comment(
            session, post3,
            ">>%d\nI disagree. Full anonymity is important for whistleblowers and activists." % c8.id,
            "Anonymous",
            hours_ago=155
        )
        
        c10 = create_comment(
            session, post3,
            """>>%d
>>%d
You're both right in different contexts. It depends on the community's goals.""" % (c8.id, c9.id),
            "Mediator",
            hours_ago=150
        )
        
        c11 = create_comment(
            session, post3,
            ">>%d\n>You're both right\nClassic fence-sitter response lol" % c10.id,
            "Anonymous",
            hours_ago=148
        )
        
        c12 = create_comment(
            session, post3,
            """>>%d
Not fence-sitting, it's nuance. Different platforms need different approaches:

1. Whistleblower sites → full anonymity
2. Discussion forums → pseudonymity
3. Professional networks → real identity

One size doesn't fit all.""" % c11.id,
            "Mediator",
            hours_ago=145
        )
        
        c13 = create_comment(
            session, post3,
            "The code example in the post is helpful. Here's an extension:\n\n```python\n# Visualize the graph\nimport networkx as nx\n\nG = nx.DiGraph(graph)\nnx.draw(G, with_labels=True)\n```",
            "CodeNerd",
            password="code",
            hours_ago=100
        )
        
        # ============================================
        # COMMENTS - Post 4 (Technical - expert discussion)
        # ============================================
        print("  Creating comments for Post 4...")
        
        c14 = create_comment(
            session, post4,
            "Excellent documentation. One question: why SQLite instead of PostgreSQL?",
            "DevOps",
            hours_ago=70
        )
        
        c15 = create_comment(
            session, post4,
            """>>%d
SQLite is fine for single-server deployments with moderate traffic. Benefits:

- Zero configuration
- Embedded (no separate process)
- Easy backups (just copy the file)
- Surprisingly good read performance

For high-traffic, yes, PostgreSQL would be better.""" % c14.id,
            "æthera",
            password="admin",
            hours_ago=68
        )
        
        c16 = create_comment(
            session, post4,
            """>>%d
Thanks for the explanation! 

>Easy backups (just copy the file)

This is actually a big plus for hobby projects. No need to deal with pg_dump.""" % c15.id,
            "DevOps",
            hours_ago=65
        )
        
        c17 = create_comment(
            session, post4,
            "The SSE implementation is clean. Have you considered WebSockets for bidirectional communication?",
            "RealtimeEngineer",
            hours_ago=50
        )
        
        c18 = create_comment(
            session, post4,
            """>>%d
SSE is simpler and sufficient for this use case (server → client only). WebSockets would add complexity:

- Connection management
- Heartbeats
- Reconnection logic
- More testing surface

KISS principle in action.""" % c17.id,
            "æthera",
            password="admin",
            hours_ago=48
        )
        
        # ============================================
        # COMMENTS - Post 5 (Announcement - quick reactions)
        # ============================================
        print("  Creating comments for Post 5...")
        
        c19 = create_comment(
            session, post5,
            "The hover previews are so nice! No more scrolling up and down.",
            "HappyUser",
            hours_ago=20
        )
        
        c20 = create_comment(
            session, post5,
            """>>%d
Agreed! Testing cross-post reference to the essay: >>%d

Works perfectly.""" % (c19.id, c8.id),
            "Anonymous",
            hours_ago=18
        )
        
        c21 = create_comment(
            session, post5,
            """Testing the quote feature:
>Hover previews are so nice
They really are!

And greentext works too:
>implying greentext wasn't already the best feature""",
            "Quoter",
            hours_ago=15
        )
        
        c22 = create_comment(
            session, post5,
            """Let me create a reply chain for backlink testing:

>>%d
>>%d
>>%d

All three should show backlinks to this comment.""" % (c19.id, c20.id, c21.id),
            "BacklinkTester",
            hours_ago=10
        )
        
        c23 = create_comment(
            session, post5,
            ">>%d\n>All three should show backlinks\nConfirmed, I can see the backlinks on those comments!" % c22.id,
            "Verifier",
            hours_ago=8
        )
        
        # Cross-post reference chain
        c24 = create_comment(
            session, post5,
            """Cross-post reference chain test:

From welcome post: >>%d
From tutorial: >>%d  
From essay: >>%d >>%d
From technical: >>%d

All should be clickable and show previews on hover.""" % (c1.id, c7.id, c8.id, c12.id, c15.id),
            "CrossPoster",
            hours_ago=5
        )
        
        c25 = create_comment(
            session, post5,
            """>>%d
Tested all links - they work! The preview shows which post each comment is from.

This is genuinely useful for long discussions spanning multiple posts.""" % c24.id,
            "Anonymous",
            hours_ago=2
        )
        
        print(f"\n  Created {25} comments across {5} posts.")
        print("\nSeed complete!")
        print("\nComment ID Reference:")
        print(f"  Post 1 (Welcome): Comments {c1.id}-{c3.id}")
        print(f"  Post 2 (Tutorial): Comments {c4.id}-{c7.id}")
        print(f"  Post 3 (Essay): Comments {c8.id}-{c13.id}")
        print(f"  Post 4 (Technical): Comments {c14.id}-{c18.id}")
        print(f"  Post 5 (Announcement): Comments {c19.id}-{c25.id}")


def main():
    args = sys.argv[1:]
    
    if "--clear" in args:
        print("Clearing database...")
        clear_database()
        print("Done.")
    elif "--reset" in args:
        print("Resetting database...")
        clear_database()
        seed_data()
    else:
        seed_data()


if __name__ == "__main__":
    main()
