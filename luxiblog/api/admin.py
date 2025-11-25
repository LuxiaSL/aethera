from fastapi import APIRouter, Depends, Request, Form, status, HTTPException, UploadFile, File
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from sqlmodel import Session, select
from typing import Optional, List
from pathlib import Path
import shutil
import os

from luxiblog.models.base import get_session
from luxiblog.models.models import Post
from luxiblog.utils.auth import verify_password, get_password_hash

from luxiblog.utils.templates import templates

router = APIRouter(prefix="/admin", tags=["admin"])

# Simple in-memory session for this lightweight example
# In production, use starlette SessionMiddleware
from starlette.middleware.sessions import SessionMiddleware

@router.get("/login", response_class=HTMLResponse)
def login_page(request: Request):
    return templates.TemplateResponse(request=request, name="admin/login.html")

@router.post("/login")
def login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...)
):
    admin_user = os.environ.get("LUXIBLOG_ADMIN_USERNAME", "admin")
    # In a real app, store hash in DB or env. 
    # Here we compare against the env var hash or a default for dev
    admin_pass_hash = os.environ.get("LUXIBLOG_ADMIN_PASSWORD_HASH")
    
    # If no hash set, use a default "password" hash for dev convenience (ONLY FOR DEV)
    if not admin_pass_hash:
        # Hash for "password"
        admin_pass_hash = "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWrn3IlaVJRwanbCdJdSfndIwa/bbC" 

    if username == admin_user and verify_password(password, admin_pass_hash):
        request.session["user"] = "admin"
        return RedirectResponse(url="/admin", status_code=status.HTTP_303_SEE_OTHER)
    
    return templates.TemplateResponse(
        request=request,
        name="admin/login.html", 
        context={"error": "Invalid credentials"}
    )

@router.get("/logout")
def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/", status_code=status.HTTP_303_SEE_OTHER)

@router.get("", response_class=HTMLResponse)
def dashboard(
    request: Request, 
    session: Session = Depends(get_session)
):
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/admin/login")
        
    posts = session.exec(select(Post).order_by(Post.created_at.desc())).all()
    return templates.TemplateResponse(
        request=request,
        name="admin/dashboard.html", 
        context={"posts": posts, "user": user}
    )

@router.get("/posts/new", response_class=HTMLResponse)
def new_post_page(request: Request):
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/admin/login")
    return templates.TemplateResponse(request=request, name="admin/edit_post.html", context={"post": None})

@router.post("/posts")
def create_post(
    request: Request,
    title: str = Form(...),
    content: str = Form(...),
    slug: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    published: bool = Form(False),
    session: Session = Depends(get_session)
):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401)

    # Generate slug if not provided
    if not slug:
        slug = Post.generate_slug(title, session)
        
    # Render markdown to HTML
    import markdown
    content_html = markdown.markdown(content, extensions=['fenced_code', 'tables'])
    
    post = Post(
        title=title,
        slug=slug,
        content=content,
        content_html=content_html,
        tags=tags,
        published=published,
        author=user, # Default to admin user
        excerpt=Post.create_excerpt(content)
    )
    
    session.add(post)
    session.commit()
    session.refresh(post)
    
    return RedirectResponse(url="/admin", status_code=status.HTTP_303_SEE_OTHER)

@router.get("/posts/{post_id}/edit", response_class=HTMLResponse)
def edit_post_page(
    request: Request, 
    post_id: int,
    session: Session = Depends(get_session)
):
    user = request.session.get("user")
    if not user:
        return RedirectResponse(url="/admin/login")
        
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404)
        
    return templates.TemplateResponse(request=request, name="admin/edit_post.html", context={"post": post})

@router.post("/posts/{post_id}")
def update_post(
    request: Request,
    post_id: int,
    title: str = Form(...),
    content: str = Form(...),
    slug: str = Form(...),
    tags: Optional[str] = Form(None),
    published: bool = Form(False),
    session: Session = Depends(get_session)
):
    user = request.session.get("user")
    if not user:
        raise HTTPException(status_code=401)
        
    post = session.get(Post, post_id)
    if not post:
        raise HTTPException(status_code=404)
        
    post.title = title
    post.content = content
    post.slug = slug
    post.tags = tags
    post.published = published
    
    # Re-render HTML
    import markdown
    post.content_html = markdown.markdown(content, extensions=['fenced_code', 'tables'])
    post.excerpt = Post.create_excerpt(content)
    
    session.add(post)
    session.commit()
    
    return RedirectResponse(url="/admin", status_code=status.HTTP_303_SEE_OTHER)
