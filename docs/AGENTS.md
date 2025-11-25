# LUXIBLOG MAINTENANCE GUIDE

## Project Overview
LuxiBlog is a lightweight, AI-friendly blog platform with semantic HTML, markdown support, and simple commenting. The application is built with FastAPI, HTMX, SQLModel, and Jinja2, using SQLite as the database.

Recent updates have focused on "memetic" optimization for AI agents (semantic HTML, `llms.txt`, structured data) and a "Gwern-lite" aesthetic overhaul.

## Project Structure

- **`/luxiblog/`** - Main application package
  - `main.py` - Application entrypoint and FastAPI app configuration
  - **`/api/`** - API endpoints and routes
    - `admin.py` - Admin dashboard and content management endpoints
    - `posts.py` - Blog post endpoints
    - `comments.py` - Comment endpoints and SSE (Server-Sent Events)
    - `seo.py` - SEO-related endpoints (RSS, sitemap, robots.txt, llms.txt)
  - **`/models/`** - Database models
    - `base.py` - Database connection setup
    - `models.py` - SQLModel ORM models (Post, Comment)
  - **`/templates/`** - Jinja2 templates
    - `base.html` - Base template with common layout
    - `index.html` - Homepage template
    - `post.html` - Individual post template
    - **`/admin/`** - Admin interface templates
    - **`/fragments/`** - Partial templates for HTMX
  - **`/static/`** - Static assets
    - **`/css/`** - CSS files (branding.css)
    - **`/js/`** - JavaScript files
    - **`/vendor/`** - Local copies of external libraries (HTMX, Tailwind)
    - **`/uploads/`** - User-uploaded content
  - **`/utils/`** - Utility functions
    - `auth.py` - Authentication utilities (Session-based admin, Tripcodes)
    - `csrf.py` - CSRF protection
    - `markdown.py` - Markdown rendering
    - `posts.py` - Post creation/update utilities
    - `rate_limit.py` - Rate limiting for comments
    - `security.py` - Security headers middleware

- **`/migrations/`** - Alembic database migrations
- **`/tests/`** - Test suite

## Package Management

This project uses [uv](https://github.com/astral-sh/uv) for fast Python package management.

### Common Commands

```bash
# Install dependencies
uv pip install -r requirements.lock

# Add a dependency
uv pip install package_name
# Then update requirements.lock manually or via uv pip compile

# Run the development server
uv run python -m luxiblog.main
```

## Architecture Overview

### Key Design Decisions
1.  **Timezone Awareness**: All datetimes are stored and processed in UTC.
2.  **Local Assets**: External dependencies (HTMX, Tailwind) are served locally from `/static/vendor/` to ensure offline capability and privacy.
3.  **AI Optimization**:
    *   `/llms.txt` provides a condensed site map for AI agents.
    *   Semantic HTML and JSON-LD structured data are prioritized.
    *   Open Graph and Twitter Card tags are included for social sharing.
4.  **Admin Authentication**: Simple session-based authentication using `SessionMiddleware` and a secure password hash.

### Request Flow
1.  Request comes in to FastAPI router.
2.  `SessionMiddleware` handles admin session state.
3.  `SecurityHeadersMiddleware` adds security headers.
4.  Router handlers process the request.
5.  Jinja2 templates render the response, often using HTMX for partial updates.

### Database Schema
- **Posts**: Blog post content with metadata. Slugs are counter-based (e.g., `post-title-2`) for cleaner URLs.
- **Comments**: User comments with tripcode authentication.

## Configuration

### Environment Variables
- `DATABASE_URL`: SQLite database URL (default: `sqlite:///./blog.sqlite`)
- `LUXIBLOG_ADMIN_PASSWORD_HASH`: Bcrypt hash of the admin password.
- `LUXIBLOG_SECRET_KEY`: Secret key for session signing.
- `LUXIBLOG_TRIPCODE_SALT`: Salt for comment tripcodes.

## Deployment

### Docker Deployment
```bash
# Build the Docker image
docker build -t luxiblog:latest .

# Run the container
docker run -p 8000:8000 \
  -e LUXIBLOG_ADMIN_PASSWORD_HASH=your_secure_hash \
  -e LUXIBLOG_SECRET_KEY=your_secret_key \
  -v ./data:/app/data \
  luxiblog:latest
```