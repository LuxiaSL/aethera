# LUXIBLOG MAINTENANCE GUIDE

## Project Overview
LuxiBlog is a lightweight, AI-friendly blog platform with semantic HTML, markdown support, and simple commenting. The application is built with FastAPI, HTMX, SQLModel, and Jinja2, using SQLite as the database.

## Project Structure

- **`/luxiblog/`** - Main application package
  - `main.py` - Application entrypoint and FastAPI app configuration
  - **`/api/`** - API endpoints and routes
    - `admin.py` - Admin dashboard and content management endpoints
    - `posts.py` - Blog post endpoints
    - `comments.py` - Comment endpoints and SSE (Server-Sent Events)
    - `seo.py` - SEO-related endpoints (RSS, sitemap, robots.txt)
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
    - **`/css/`** - CSS files
    - **`/js/`** - JavaScript files
    - **`/uploads/`** - User-uploaded content
  - **`/utils/`** - Utility functions
    - `auth.py` - Authentication utilities
    - `csrf.py` - CSRF protection
    - `markdown.py` - Markdown rendering
    - `posts.py` - Post creation/update utilities
    - `rate_limit.py` - Rate limiting for comments
    - `security.py` - Security headers middleware

- **`/migrations/`** - Alembic database migrations
- **`/tests/`** - Test suite

## Package Management

This project uses [Rye](https://rye-up.com/) for Python package management. Rye helps maintain consistent dependencies across development environments and simplifies package management.

Key benefits:
- Automatic virtual environment creation and management
- Lockfile generation for reproducible builds
- Simple dependency addition with version resolution
- Dev vs. production dependency separation

**Important**: Always use Rye commands to add, remove, or update dependencies to keep `pyproject.toml` and lock files in sync.

## Common Development Tasks

### Setting Up the Environment

```bash
# Install dependencies
rye sync

# Apply database migrations
rye run alembic upgrade head

# Run the development server
rye run python -m luxiblog.main
```

### Creating a New Database Migration

```bash
# Create a new migration
rye run alembic revision --autogenerate -m "description_of_changes"

# Apply the migration
rye run alembic upgrade head
```

### Running Tests

```bash
# Run all tests
rye run pytest

# Run specific test modules
rye run pytest tests/api/test_posts.py

# Run with coverage report
rye run pytest --cov=luxiblog
```

### Adding New Dependencies

```bash
# Add a production dependency
rye add package_name

# Add a development dependency
rye add --dev package_name

# Sync dependencies
rye sync
```

## Architecture Overview

### Request Flow

1. Request comes in to FastAPI router
2. Authentication middleware checks for admin routes
3. CSRF middleware validates token for POST/PUT/DELETE requests
4. Security headers middleware adds security headers to responses
5. Router handlers process the request and return response

### HTMX Integration

- The site uses HTMX for dynamic updates without full page refreshes
- Server-Sent Events (SSE) are used for real-time comment updates
- Fragments in `/templates/fragments/` are returned for HTMX requests

### Database Schema

- **Posts**: Blog post content with metadata (tags, categories, etc.)
- **Comments**: User comments with tripcode authentication

## Configuration

### Environment Variables

- `DATABASE_URL`: SQLite or other database URL
- `LUXIBLOG_ADMIN_USERNAME`: Username for admin access
- `LUXIBLOG_ADMIN_PASSWORD_HASH`: SHA-256 hash of admin password
- `LUXIBLOG_TRIPCODE_SALT`: Salt for comment tripcodes

### Security Considerations

- Admin interface is protected with HTTP Basic Auth
- CSRF protection is implemented for all forms
- Rate limiting is applied to comment submissions
- File uploads are restricted to images and have strict validation
- Security headers are added to all responses

## Deployment

### Docker Deployment

```bash
# Build the Docker image
docker build -t luxiblog:latest .

# Run the container
docker run -p 8000:8000 \
  -e LUXIBLOG_ADMIN_USERNAME=admin \
  -e LUXIBLOG_ADMIN_PASSWORD_HASH=your_secure_hash \
  -e LUXIBLOG_TRIPCODE_SALT=your_secure_salt \
  -v ./data:/app/data \
  luxiblog:latest
```

### Production Considerations

- For multi-worker setups, consider a Redis-backed rate limiter
- SQLite is suitable for low-traffic sites but consider PostgreSQL for higher traffic
- Set secure, unique values for all environment variables
- Use a reverse proxy (Nginx, Caddy) for SSL termination and static file serving