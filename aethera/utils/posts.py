"""
Post utilities for shared functionality.
"""
from typing import Optional
from datetime import datetime
from sqlmodel import Session
from slugify import slugify

from aethera.models.models import Post, SlugRedirect
from aethera.utils.markdown import render_markdown


def save_post(
    session: Session,
    title: str,
    content: str,
    author: str,
    tags: Optional[str] = None,
    categories: Optional[str] = None,
    canonical_url: Optional[str] = None,
    license: str = "CC BY 4.0",
    published: bool = False,
    slug: Optional[str] = None,
    existing_post: Optional[Post] = None,
) -> Post:
    """
    Create or update a blog post.

    When updating, if the title changes, the slug is regenerated and the old
    slug is stored as a redirect so that existing links continue to work.

    Args:
        session: SQLModel session
        title: Post title
        content: Markdown content
        author: Post author
        tags: Comma-separated tags
        categories: Comma-separated categories
        canonical_url: Canonical URL if any
        license: Content license
        published: Whether the post is published
        slug: Optional slug override
        existing_post: Existing post to update (None for new posts)

    Returns:
        The created or updated Post instance
    """
    # Render Markdown to HTML
    content_html = render_markdown(content)

    # Generate excerpt
    excerpt = Post.create_excerpt(content)

    if existing_post:
        # If title changed, regenerate slug and save redirect
        if title != existing_post.title:
            new_slug = Post.generate_slug(title, session, exclude_id=existing_post.id)
            if new_slug != existing_post.slug:
                old_slug = existing_post.slug

                # Save old slug as redirect (if not already tracked)
                existing_redirect = session.exec(
                    select(SlugRedirect).where(SlugRedirect.old_slug == old_slug)
                ).first()
                if not existing_redirect:
                    session.add(SlugRedirect(old_slug=old_slug, post_id=existing_post.id))

                # If new slug was itself a redirect, remove it (renaming back)
                stale_redirect = session.exec(
                    select(SlugRedirect).where(SlugRedirect.old_slug == new_slug)
                ).first()
                if stale_redirect:
                    session.delete(stale_redirect)

                existing_post.slug = new_slug

        # Update remaining fields
        existing_post.title = title
        existing_post.author = author
        existing_post.content = content
        existing_post.content_html = content_html
        existing_post.excerpt = excerpt
        existing_post.tags = tags
        existing_post.categories = categories
        existing_post.canonical_url = canonical_url
        existing_post.license = license
        existing_post.published = published
        existing_post.updated_at = datetime.now()

        post = existing_post
    else:
        # Generate slug if not provided
        if not slug:
            slug = Post.generate_slug(title, session)

        # Clean up any stale redirect that matches our new slug
        stale_redirect = session.exec(
            select(SlugRedirect).where(SlugRedirect.old_slug == slug)
        ).first()
        if stale_redirect:
            session.delete(stale_redirect)

        # Create a new post
        post = Post(
            title=title,
            slug=slug,
            author=author,
            content=content,
            content_html=content_html,
            excerpt=excerpt,
            tags=tags,
            categories=categories,
            canonical_url=canonical_url,
            license=license,
            published=published,
            created_at=datetime.now(),
            updated_at=datetime.now()
        )

    # Save to DB
    session.add(post)
    session.commit()
    session.refresh(post)

    return post