# LuxiBlog

A lightweight, AI-friendly blog platform with semantic HTML, markdown support, and simple commenting.

## Features

- Semantic HTML structure optimized for AI crawling
- Markdown post authoring with preview
- Real-time comments with tripcodes
- Infinite scroll via HTMX
- SEO-optimized with sitemap, RSS feed, and JSON-LD
- Minimal, responsive design with Tailwind CSS
- SQLite database for simplicity

## Quick Start

### Prerequisites

- Python 3.10+
- [Rye](https://rye-up.com/) for dependency management

### Installation

1. Clone the repository
2. Setup the development environment:

```bash
# Install dependencies
rye sync

# Activate the virtual environment
source .venv/bin/activate
```

### Configuration

Create a `.env` file with your configuration (see `.env.example` for reference):

```bash
# Copy example configuration
cp .env.example .env

# Edit with your settings
nano .env
```

Key environment variables:
- `DATABASE_URL`: SQLite or other database URL
- `LUXIBLOG_ADMIN_USERNAME`: Username for admin access
- `LUXIBLOG_ADMIN_PASSWORD_HASH`: SHA-256 hash of admin password
- `LUXIBLOG_TRIPCODE_SALT`: Salt for comment tripcodes

### Database Setup

The application uses SQLite with SQLModel and Alembic for migrations:

```bash
# Apply migrations to create the database
rye run alembic upgrade head
```

### Running the Development Server

```bash
# Start the development server
rye run python -m luxiblog.main
```

The blog will be available at [http://localhost:8000](http://localhost:8000).

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

## Project Structure

- `luxiblog/` - Main package
  - `api/` - API routers for posts, comments, admin, and SEO
  - `models/` - SQLModel database models
  - `templates/` - Jinja2 templates
  - `static/` - Static files (CSS, JS, uploads)
  - `utils/` - Utility functions

## Creating Content

### Admin Interface

Access the admin interface at [http://localhost:8000/admin](http://localhost:8000/admin).

> **IMPORTANT:** The default admin credentials are `admin`/`password`. For production use, you MUST set the `LUXIBLOG_ADMIN_USERNAME` and `LUXIBLOG_ADMIN_PASSWORD_HASH` environment variables to secure your admin interface.

The admin interface supports:
- Creating and editing posts
- Markdown editor with live preview
- Setting tags, categories, and metadata
- Publishing/unpublishing posts

### Importing from Obsidian

You can create content in Obsidian and then import it via the admin interface. Simply copy the markdown content into the editor.

## Production Considerations

### Rate Limiting

LuxiBlog includes a simple in-memory rate limiter to prevent comment spam. Important limitations:

- The rate limiter is in-memory and will reset when the server restarts
- In a multi-worker/process deployment, each worker maintains its own rate limit state
- For production with multiple workers or load balancing, consider implementing a Redis-backed rate limiter

### Admin Security

Ensure you set the following environment variables for production:
- `LUXIBLOG_ADMIN_USERNAME`: Custom admin username
- `LUXIBLOG_ADMIN_PASSWORD_HASH`: SHA-256 hash of your admin password
- `LUXIBLOG_TRIPCODE_SALT`: Custom salt for comment tripcodes

## License

Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
