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
- [uv](https://docs.astral.sh/uv/) for dependency management

### Installation

1. Clone the repository
2. Setup the development environment:

```bash
# Install dependencies
uv sync
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
- `LUXIBLOG_TRIPCODE_SALT`: Salt for comment tripcodes

### Database Setup

The application uses SQLite with SQLModel and Alembic for migrations:

```bash
# Apply migrations to create the database
uv run alembic upgrade head
```

### Running the Development Server

```bash
# Start the development server
uv run python -m luxiblog.main
```

The blog will be available at [http://localhost:8000](http://localhost:8000).

### Docker Deployment

```bash
# Build the Docker image
docker build -t luxiblog:latest .

# Run the container
docker run -p 8000:8000 \
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


## Production Considerations

### Rate Limiting

LuxiBlog includes a simple in-memory rate limiter to prevent comment spam. Important limitations:

- The rate limiter is in-memory and will reset when the server restarts
- In a multi-worker/process deployment, each worker maintains its own rate limit state
- For production with multiple workers or load balancing, consider implementing a Redis-backed rate limiter

### Admin Security

Ensure you set the following environment variables for production:
- `LUXIBLOG_TRIPCODE_SALT`: Custom salt for comment tripcodes

## License

Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
