from fastapi import FastAPI, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import HTMLResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
import logging
from pathlib import Path
from sqlmodel import Session
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from aethera.models.base import init_db, get_session
from aethera.api import posts, comments, seo, dreams, apeiron, syrinx, irc, irc_admin
from aethera.irc.database import init_irc_db
from aethera.utils.security import SecurityHeadersMiddleware
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
    except Exception:
        logging.getLogger(__name__).warning(
            "Chronicle init failed (continuing without)", exc_info=True
        )

    yield
    # Clean up resources on shutdown
    try:
        from aethera.dreams.chronicle import get_chronicle_store
        get_chronicle_store().stop_retention_task()
    except Exception:
        pass


app = FastAPI(lifespan=lifespan)

# Add middleware
app.add_middleware(SecurityHeadersMiddleware)  # Security headers should be first
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Mount static files
static_path = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# Include API routers
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(seo.router)
app.include_router(dreams.router)
app.include_router(apeiron.router)
app.include_router(syrinx.router)
app.include_router(irc.router)
app.include_router(irc_admin.router)


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


@app.get("/")
def home(request: Request, session: Session = Depends(get_session)):
    """Render the homepage with latest posts."""
    return templates.TemplateResponse(
        request=request,
        name="index.html", 
        context={"title": "æthera"}
    )


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
