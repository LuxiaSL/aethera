from fastapi import APIRouter, Depends, HTTPException, Query, Request, status, Form, File, UploadFile
from fastapi.responses import HTMLResponse
from sqlmodel import Session, select
from typing import List, Optional
import os
from pathlib import Path
from datetime import datetime
from slugify import slugify
from pydantic import BaseModel

from luxiblog.models.base import get_session
from luxiblog.models.models import Post, Comment
from luxiblog.utils.markdown import render_markdown
from luxiblog.utils.posts import save_post
from luxiblog.utils.templates import templates

router = APIRouter(tags=["posts"])


class PostResponse(BaseModel):
    """Pydantic model for post response."""
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

    # Check if there are more posts beyond this page
    has_next_page = False
    if len(posts) == per_page:  # If we got a full page, check if there's more
        next_query = select(Post).where(Post.published == True).order_by(Post.created_at.desc()).offset(offset + per_page).limit(1)
        has_next_page = len(session.exec(next_query).all()) > 0

    # Return HTML fragments for infinite scroll
    return templates.TemplateResponse(
        "fragments/post_list.html",
        {"request": request, "posts": posts, "page": page, "has_next_page": has_next_page}
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
    
    # Return the full HTML page
    return templates.TemplateResponse(
        "post.html", 
        {
            "request": request, 
            "post": post, 
            "comments": comments,
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


@router.get("/api/posts/{slug}", response_model=PostResponse)
def get_post_json(slug: str, session: Session = Depends(get_session)):
    """Get a post as JSON (machine-readable endpoint)."""
    query = select(Post).where(Post.slug == slug, Post.published == True)
    post = session.exec(query).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Return the post directly, FastAPI will convert it to the response model
    return post


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