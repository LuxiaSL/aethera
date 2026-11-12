from fastapi import FastAPI, Depends, Request
from fastapi.responses import HTMLResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
import logging
import os
from pathlib import Path
from sqlmodel import Session
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from aethera.models.base import init_db, get_session
from aethera.api import posts, comments, seo, dreams, chronicle, apeiron, syrinx, afterlife, irc, oikos, chat
from aethera.irc.database import init_irc_db
from aethera.utils.security import SecurityHeadersMiddleware
from aethera.utils.static_assets import CachedStaticFiles, SelectiveGZipMiddleware
from aethera.utils.templates import templates


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize databases on startup
    init_db()      # Blog database (blog.sqlite)
    init_irc_db()  # IRC database (irc.sqlite) - separate for clean isolation

    # Chronicle (dream memory) - separate DB + retention sweep.
    # Failure here must never block the blog from starting.
    try:
        from aethera.dreams.chronicle import init_chronicle_db, get_chronicle_store
        init_chronicle_db()
        get_chronicle_store().start_retention_task()
        from aethera.dreams.chronicle import tasks as chronicle_tasks
        chronicle_tasks.start()  # eras, scenes, strata (Phase 2)
    except Exception:
        logging.getLogger(__name__).warning(
            "Chronicle init failed (continuing without)", exc_info=True
        )

    yield
    # Clean up resources on shutdown
    try:
        from aethera.dreams.chronicle import get_chronicle_store
        get_chronicle_store().stop_retention_task()
        from aethera.dreams.chronicle import tasks as chronicle_tasks
        chronicle_tasks.stop()
    except Exception:
        pass


app = FastAPI(lifespan=lifespan)

# Add middleware
app.add_middleware(SecurityHeadersMiddleware)  # Security headers should be first
app.add_middleware(SelectiveGZipMiddleware, minimum_size=1000)  # not media/fonts; level 6

# Mount static files
static_path = Path(__file__).parent / "static"
app.mount("/static", CachedStaticFiles(directory=str(static_path)), name="static")

# Include API routers
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(seo.router)
app.include_router(dreams.router)
app.include_router(chronicle.router)
app.include_router(apeiron.router)
app.include_router(syrinx.router)
app.include_router(afterlife.router)
app.include_router(irc.router)
app.include_router(oikos.router)
app.include_router(chat.router)


# Custom 404 error handler
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    if exc.status_code == 404:
        return templates.TemplateResponse(
            request=request,
            name="404.html",
            status_code=404
        )
    # For other HTTP exceptions, return JSON as before
    return HTMLResponse(
        content=f'{{"detail": "{exc.detail}"}}',
        status_code=exc.status_code,
        media_type="application/json"
    )


#: posts on the blog's first page as served (the page refits to the screen after)
BLOG_FIRST_PAGE = 5


def _blog(request: Request, session: Session, canonical: str | None):
    """The blog's index, its first page of posts in the HTML."""
    return templates.TemplateResponse(
        request=request,
        name="blog.html",
        context={
            "title": "æthera",
            "canonical_url": canonical,
            **posts.post_page(session, 1, BLOG_FIRST_PAGE),
        },
    )


@app.get("/blog")
def blog(request: Request, session: Session = Depends(get_session)):
    """The blog: every post, newest first."""
    return _blog(request, session, canonical=f"{request.base_url}blog")


#: what / shows when nothing asks otherwise: the room (it was the blog until
#: November 2026; the blog is at /blog). The code default is the source of
#: truth (a `docker restart` doesn't re-read the env file); AETHERA_HOME=blog
#: is the emergency switch back, for local runs and rollbacks.
HOME_DEFAULT: str = os.environ.get("AETHERA_HOME", "room").strip().lower()
HOME_COOKIE = "aethera_home"
#: ?home= values that mean the room; "blog" means the blog and clears the cookie
ROOM_NAMES = frozenset({"room", "oikos"})


def _home_choice(request: Request) -> tuple[str, str | None]:
    """
    Which page / serves for this request, and what to do with the cookie.

    Returns (page, cookie): page is "room" or "blog"; cookie is "set" to
    remember the room, "clear" to forget it, or None to leave it alone.
    """
    asked = (request.query_params.get("home") or "").strip().lower()
    if asked in ROOM_NAMES:
        return "room", "set"
    if asked == "blog":
        return "blog", "clear"
    if request.cookies.get(HOME_COOKIE) == "room":
        return "room", None
    return ("room" if HOME_DEFAULT in ROOM_NAMES else "blog"), None


@app.get("/")
def home(request: Request, session: Session = Depends(get_session)):
    """
    The homepage: the room (oikos). The blog is at /blog.

    `/?home=blog` shows the blog here once and forgets a remembered room;
    `/?home=room` remembers the room for 30 days in a cookie (which matters
    only while HOME_DEFAULT is set back to the blog). Kept until the move has
    settled, as the way back.
    """
    page, cookie = _home_choice(request)
    if page == "room":
        response = oikos.render_room(request, session, canonical="/")
    else:
        response = _blog(request, session, canonical=None)
    if cookie == "set":
        response.set_cookie(
            HOME_COOKIE, "room", max_age=30 * 24 * 3600,
            httponly=True, secure=request.url.scheme == "https", samesite="lax",
        )
    elif cookie == "clear":
        response.delete_cookie(HOME_COOKIE)
    response.headers["Vary"] = "Cookie"
    return response


@app.get("/healthz")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


if __name__ == "__main__":
    import os
    # Only enable reload in development (when AETHERA_DEV is set)
    reload = os.environ.get("AETHERA_DEV", "").lower() in ("1", "true", "yes")
    # Behind Caddy every connection arrives from the docker bridge, so without
    # proxy headers request.client.host is the same for all visitors (one
    # shared rate-limit bucket) and request.base_url says http://. The port is
    # published on 127.0.0.1 only, so trusting forwarded headers is safe.
    uvicorn.run(
        "aethera.main:app", host="0.0.0.0", port=2222, reload=reload,
        proxy_headers=True,
        forwarded_allow_ips=os.environ.get("FORWARDED_ALLOW_IPS", "*"),
    )
