from fastapi import APIRouter, Depends, HTTPException, Query, Request, status, Form, File, UploadFile
from fastapi.responses import HTMLResponse
from sqlmodel import Session, select
from typing import List, Optional
import os
from pathlib import Path
from datetime import datetime
from slugify import slugify
from pydantic import BaseModel

from aethera.models.base import get_session
from aethera.models.models import Post, Comment
from aethera.utils.markdown import render_markdown
from aethera.utils.posts import save_post
from aethera.utils.templates import templates
from aethera.api.comments import compute_backlinks_with_cross_post

router = APIRouter(tags=["posts"])


class PostResponse(BaseModel):
    """Pydantic model for full post response."""
    id: int
    title: str
    slug: str
    author: str
    content: str
    content_html: str
    excerpt: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    tags: Optional[str] = None
    categories: Optional[str] = None
    canonical_url: Optional[str] = None
    license: str
    
    class Config:
        from_attributes = True


class PostListItem(BaseModel):
    """Pydantic model for post list item (lighter than full response)."""
    id: int
    title: str
    slug: str
    author: str
    excerpt: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    tags: Optional[str] = None
    categories: Optional[str] = None
    
    class Config:
        from_attributes = True


class PostListResponse(BaseModel):
    """Pydantic model for paginated post list."""
    posts: List[PostListItem]
    total: int
    page: int
    per_page: int
    has_next: bool


@router.get("/posts", response_class=HTMLResponse)
def get_posts(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    session: Session = Depends(get_session),
):
    """Get paginated list of published posts."""
    offset = (page - 1) * per_page

    # Query posts ordered by date
    query = select(Post).where(Post.published == True).order_by(Post.created_at.desc()).offset(offset).limit(per_page)
    posts = session.exec(query).all()
    
    # Get comment counts for each post
    from sqlalchemy import func
    comment_counts = {}
    if posts:
        post_ids = [p.id for p in posts]
        count_query = select(Comment.post_id, func.count(Comment.id)).where(
            Comment.post_id.in_(post_ids)
        ).group_by(Comment.post_id)
        counts = session.exec(count_query).all()
        comment_counts = {post_id: count for post_id, count in counts}

    # Check if there are more posts beyond this page
    has_next_page = False
    if len(posts) == per_page:  # If we got a full page, check if there's more
        next_query = select(Post).where(Post.published == True).order_by(Post.created_at.desc()).offset(offset + per_page).limit(1)
        has_next_page = len(session.exec(next_query).all()) > 0

    has_prev_page = page > 1

    # Return HTML fragments for pagination
    return templates.TemplateResponse(
        "fragments/post_list.html",
        {"request": request, "posts": posts, "page": page, "per_page": per_page, "has_next_page": has_next_page, "has_prev_page": has_prev_page, "comment_counts": comment_counts}
    )


@router.get("/posts/{slug}", response_class=HTMLResponse)
def get_post(request: Request, slug: str, session: Session = Depends(get_session)):
    """Get a single post by slug."""
    query = select(Post).where(Post.slug == slug, Post.published == True)
    post = session.exec(query).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Get comments for this post
    comment_query = select(Comment).where(Comment.post_id == post.id).order_by(Comment.created_at)
    comments = session.exec(comment_query).all()
    
    # Compute backlinks for display (including cross-post references)
    backlinks = compute_backlinks_with_cross_post(comments, session)
    
    # Return the full HTML page
    return templates.TemplateResponse(
        "post.html", 
        {
            "request": request, 
            "post": post, 
            "comments": comments,
            "backlinks": backlinks,
            "title": post.title
        }
    )


@router.get("/posts/{slug}/body", response_class=HTMLResponse)
def get_post_body(slug: str, session: Session = Depends(get_session)):
    """Get just the HTML body of a post."""
    query = select(Post).where(Post.slug == slug, Post.published == True)
    post = session.exec(query).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Return just the HTML content
    return post.content_html


# =============================================================================
# JSON API ENDPOINTS (Machine-Readable)
# =============================================================================

@router.get("/api/posts", response_model=PostListResponse)
def list_posts_json(
    request: Request,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session),
):
    """
    List all published posts as JSON.
    
    Machine-readable endpoint for AI agents, crawlers, and integrations.
    Returns post metadata without full content (use /api/posts/{slug} for full content).
    """
    from sqlalchemy import func
    
    offset = (page - 1) * per_page
    
    # Get total count
    total = session.exec(select(func.count(Post.id)).where(Post.published == True)).one()
    
    # Get posts for this page
    query = (
        select(Post)
        .where(Post.published == True)
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(per_page)
    )
    posts = session.exec(query).all()
    
    has_next = (offset + len(posts)) < total
    
    return PostListResponse(
        posts=[PostListItem.model_validate(p) for p in posts],
        total=total,
        page=page,
        per_page=per_page,
        has_next=has_next
    )


@router.get("/api/posts/{slug}", response_model=PostResponse)
def get_post_json(slug: str, session: Session = Depends(get_session)):
    """Get a post as JSON (machine-readable endpoint)."""
    query = select(Post).where(Post.slug == slug, Post.published == True)
    post = session.exec(query).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Return the post directly, FastAPI will convert it to the response model
    return post


# =============================================================================
# PLAIN TEXT ENDPOINTS (Raw Content Access)
# =============================================================================

from fastapi.responses import PlainTextResponse

@router.get("/posts/{slug}.txt", response_class=PlainTextResponse)
def get_post_plaintext(slug: str, session: Session = Depends(get_session)):
    """
    Get post as plain text (raw markdown source).
    
    Ideal for AI agents that prefer clean text over HTML parsing.
    Returns the original markdown content with metadata header.
    """
    query = select(Post).where(Post.slug == slug, Post.published == True)
    post = session.exec(query).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Build a clean plain text representation with metadata
    lines = [
        f"Title: {post.title}",
        f"Author: {post.author}",
        f"Date: {post.created_at.strftime('%Y-%m-%d')}",
    ]
    
    if post.tags:
        lines.append(f"Tags: {post.tags}")
    if post.categories:
        lines.append(f"Categories: {post.categories}")
    
    lines.append(f"License: {post.license}")
    lines.append("")
    lines.append("=" * 60)
    lines.append("")
    lines.append(post.content)  # Original markdown
    
    return "\n".join(lines)


@router.get("/posts/{slug}.md", response_class=PlainTextResponse)
def get_post_markdown(slug: str, session: Session = Depends(get_session)):
    """
    Get post as raw markdown with frontmatter.
    
    Returns the post in a format that could be directly saved as a .md file.
    """
    query = select(Post).where(Post.slug == slug, Post.published == True)
    post = session.exec(query).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Build markdown with YAML frontmatter
    frontmatter = [
        "---",
        f"title: {post.title}",
        f"author: {post.author}",
        f"date: {post.created_at.strftime('%Y-%m-%d')}",
    ]
    
    if post.tags:
        frontmatter.append(f"tags: {post.tags}")
    if post.categories:
        frontmatter.append(f"categories: {post.categories}")
    if post.excerpt:
        frontmatter.append(f"excerpt: {post.excerpt}")
    
    frontmatter.append(f"license: {post.license}")
    frontmatter.append("---")
    frontmatter.append("")
    frontmatter.append(post.content)
    
    return "\n".join(frontmatter)


@router.post("/api/posts", status_code=status.HTTP_201_CREATED)
def create_post(
    title: str = Form(...),
    content: str = Form(...),
    author: str = Form(...),
    tags: Optional[str] = Form(None),
    categories: Optional[str] = Form(None),
    canonical_url: Optional[str] = Form(None),
    license: str = Form("CC BY 4.0"),
    published: bool = Form(False),
    session: Session = Depends(get_session),
):
    """Create a new post from Markdown content."""
    # Use the shared save_post utility function
    post = save_post(
        session=session,
        title=title,
        content=content,
        author=author,
        tags=tags,
        categories=categories,
        canonical_url=canonical_url,
        license=license,
        published=published
    )
    
    return {"id": post.id, "slug": post.slug}


@router.put("/api/posts/{slug}", status_code=status.HTTP_200_OK)
def update_post(
    slug: str,
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    categories: Optional[str] = Form(None),
    canonical_url: Optional[str] = Form(None),
    license: Optional[str] = Form(None),
    published: Optional[bool] = Form(None),
    session: Session = Depends(get_session),
):
    """Update an existing post."""
    # Find the existing post
    post = session.exec(select(Post).where(Post.slug == slug)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Preserve existing values for fields that weren't provided
    current_title = post.title if title is None else title
    current_content = post.content if content is None else content
    current_author = post.author
    current_license = post.license if license is None else license
    current_published = post.published if published is None else published
    
    # Use the shared save_post utility function
    updated_post = save_post(
        session=session,
        title=current_title,
        content=current_content,
        author=current_author,
        tags=tags,
        categories=categories,
        canonical_url=canonical_url,
        license=current_license,
        published=current_published,
        existing_post=post
    )
    
    return {"id": updated_post.id, "slug": updated_post.slug}