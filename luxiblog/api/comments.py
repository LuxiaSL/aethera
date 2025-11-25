from fastapi import APIRouter, Depends, HTTPException, Request, Form, Response, status
from fastapi.responses import HTMLResponse
from sqlmodel import Session, select
from typing import List, Optional, Dict
from datetime import datetime
from pathlib import Path
from sse_starlette.sse import EventSourceResponse
import asyncio
import weakref
import time

from luxiblog.models.base import get_session
from luxiblog.models.models import Post, Comment
from luxiblog.utils.markdown import render_comment_markdown
from luxiblog.utils.rate_limit import rate_limit_comments
from luxiblog.utils.templates import templates

router = APIRouter(tags=["comments"])

# Store for active comment streams per post using weakrefs to prevent memory leaks
# We need a dict because we can't use weakref.WeakSet for asyncio.Queue objects directly
# Instead, use a dict of post_id -> dict of queue_id -> queue
comment_subscribers: Dict[int, Dict[int, asyncio.Queue]] = {}

# Periodic cleanup of empty subscriber dictionaries
last_cleanup_time = time.time()


@router.get("/posts/{slug}/comments", response_class=HTMLResponse)
def get_comments(
    request: Request,
    slug: str,
    session: Session = Depends(get_session),
):
    """Get all comments for a post."""
    # Find the post
    post = session.exec(select(Post).where(Post.slug == slug)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Get comments for this post
    query = select(Comment).where(Comment.post_id == post.id).order_by(Comment.created_at)
    comments = session.exec(query).all()
    
    # Return comments as HTML
    return templates.TemplateResponse(
        "fragments/comments.html", 
        {"request": request, "comments": comments, "post": post}
    )


@router.get("/api/posts/{slug}/comments")
def get_comments_json(
    slug: str,
    session: Session = Depends(get_session),
):
    """Get all comments for a post as JSON (machine-readable endpoint)."""
    # Find the post
    post = session.exec(select(Post).where(Post.slug == slug)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Get comments for this post
    query = select(Comment).where(Comment.post_id == post.id).order_by(Comment.created_at)
    comments = session.exec(query).all()
    
    # Convert to list of dicts and return
    return [
        {
            "id": comment.id,
            "content": comment.content,
            "content_html": comment.content_html,
            "author": comment.author,
            "tripcode": comment.tripcode,
            "created_at": comment.created_at.isoformat(),
        }
        for comment in comments
    ]


@router.post("/posts/{slug}/comments", response_class=HTMLResponse)
async def create_comment(
    request: Request,
    slug: str,
    content: str = Form(...),
    author: str = Form("Anonymous"),
    password: Optional[str] = Form(None),
    session: Session = Depends(get_session),
    _: None = Depends(rate_limit_comments),  # Apply rate limiting
):
    """Create a new comment on a post."""
    # Find the post
    post = session.exec(select(Post).where(Post.slug == slug)).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Process cross-references in content
    content_html = render_comment_markdown(content)
    content_html = Comment.process_cross_references(content_html)
    
    # Generate tripcode if password provided
    tripcode = Comment.generate_tripcode(password) if password else None
    
    # Get client IP for rate limiting
    client_ip = request.client.host if request.client else None
    
    # Create comment
    comment = Comment(
        content=content,
        content_html=content_html,
        author=author,
        tripcode=tripcode,
        ip_address=client_ip,
        created_at=datetime.now(),
        post_id=post.id
    )
    
    # Save to DB
    session.add(comment)
    session.commit()
    session.refresh(comment)
    
    # Notify subscribers about the new comment
    if post.id in comment_subscribers and comment_subscribers[post.id]:
        for queue_id, queue in list(comment_subscribers[post.id].items()):
            try:
                await queue.put(comment)
            except Exception:
                # If there's an error putting to the queue, remove it
                comment_subscribers[post.id].pop(queue_id, None)

    # Return the comment fragment HTML
    return templates.TemplateResponse(
        "fragments/comment.html", 
        {"request": request, "comment": comment}
    )


@router.get("/stream/comments/{post_id}")
async def stream_comments(request: Request, post_id: int):
    """Server-Sent Events endpoint for live comment updates."""
    global last_cleanup_time

    # Periodically clean up empty dictionaries to prevent memory leaks
    current_time = time.time()
    if current_time - last_cleanup_time > 300:  # Clean up every 5 minutes
        # Remove empty dictionaries
        empty_posts = [post_id for post_id, subs in comment_subscribers.items() if not subs]
        for empty_post_id in empty_posts:
            comment_subscribers.pop(empty_post_id, None)
        last_cleanup_time = current_time

    # Initialize subscriber dict for this post if it doesn't exist
    if post_id not in comment_subscribers:
        comment_subscribers[post_id] = {}

    # Create queue for this client with a unique ID
    queue = asyncio.Queue()
    queue_id = id(queue)  # Use object id as unique identifier
    comment_subscribers[post_id][queue_id] = queue

    # Create a request context dictionary that includes a request object
    context = {"request": request}

    async def event_generator():
        try:
            while True:
                # Wait for new comments
                comment = await queue.get()

                # Render comment HTML with request context
                comment_html = templates.get_template("fragments/comment.html").render(
                    request=request, comment=comment
                )

                # Send the comment HTML as an SSE event
                yield {
                    "event": "new_comment",
                    "id": str(comment.id),
                    "data": comment_html
                }
        except asyncio.CancelledError:
            # Clean up when client disconnects
            comment_subscribers[post_id].pop(queue_id, None)
            # If this was the last subscriber, remove the post entry
            if not comment_subscribers[post_id]:
                comment_subscribers.pop(post_id, None)
            raise

    return EventSourceResponse(event_generator())