from fastapi import FastAPI, Depends, Request
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import HTMLResponse
from starlette.middleware.sessions import SessionMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
import uvicorn
from pathlib import Path
from sqlmodel import Session
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from luxiblog.models.base import init_db, get_session
from luxiblog.api import posts, comments, seo
from luxiblog.utils.security import SecurityHeadersMiddleware
from luxiblog.utils.templates import templates


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the database on startup
    init_db()
    yield
    # Clean up resources on shutdown
    pass


app = FastAPI(lifespan=lifespan)

# Add middleware
app.add_middleware(SecurityHeadersMiddleware)  # Security headers should be first
app.add_middleware(GZipMiddleware, minimum_size=1000)
# Add SessionMiddleware for session support
# In production, use a secure secret key from env
secret_key = os.environ.get("LUXIBLOG_SECRET_KEY", "dev-secret-key-change-me")
app.add_middleware(SessionMiddleware, secret_key=secret_key)

# Mount static files
static_path = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")

# Include API routers
app.include_router(posts.router)
app.include_router(comments.router)
app.include_router(seo.router)


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
        context={"title": "LuxiBlog"}
    )


@app.get("/healthz")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("luxiblog.main:app", host="0.0.0.0", port=8000, reload=True)