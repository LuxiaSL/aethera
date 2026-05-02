# æthera

A lightweight, AI-friendly blog platform with semantic HTML, markdown support, and simple commenting.

## Features

- Semantic HTML structure optimized for AI crawling
- Markdown post authoring with preview
- Real-time comments with tripcodes
- Infinite scroll via HTMX
- SEO-optimized with sitemap, RSS feed, and JSON-LD
- Minimal, responsive design with Tailwind CSS
- SQLite database for simplicity
- **Dream Window Integration** - Live AI art streaming at `/dreams`

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

Create a `.env` file with your configuration:

```bash
# Copy example configuration (if exists)
cp .env.example .env

# Edit with your settings
nano .env
```

Key environment variables:
- `DATABASE_URL`: SQLite or other database URL
- `AETHERA_TRIPCODE_SALT`: Salt for comment tripcodes
- `DREAM_GEN_AUTH_TOKEN`: Shared secret for GPU worker authentication (Dreams module)

### Database Setup

The application uses SQLite with SQLModel and Alembic for migrations:

```bash
# Apply migrations to create the database
uv run alembic upgrade head
```

### Running the Development Server

```bash
# Start the development server
uv run python -m aethera.main
```

The blog will be available at [http://localhost:8000](http://localhost:8000).

### Docker Deployment

```bash
# Build the Docker image
docker build -t aethera:latest .

# Run the container
docker run -p 8000:8000 \
  -e AETHERA_TRIPCODE_SALT=your_secure_salt \
  -v ./data:/app/data \
  aethera:latest
```

## Project Structure

- `aethera/` - Main package
  - `api/` - API routers for posts, comments, SEO, and dreams
  - `models/` - SQLModel database models
  - `templates/` - Jinja2 templates
  - `static/` - Static files (CSS, JS, uploads)
  - `utils/` - Utility functions
  - `dreams/` - Dream Window streaming module

## 🌙 Dream Window Integration

æthera hosts the web viewer for [Dream Window](https://github.com/LuxiaSL/dream_gen), a continuously morphing AI art generator. Visit `/dreams` to watch live AI-generated art that never repeats.

### Routes

| Route | Description |
|-------|-------------|
| `/dreams` | Live viewer page with WebSocket streaming |
| `/api/dreams/status` | System status (GPU state, frame count, viewers) |
| `/api/dreams/current` | Current frame as WebP image |
| `/api/dreams/embed` | Embeddable snippet for third-party sites |
| `/ws/dreams` | WebSocket endpoint for live frame streaming |

### Architecture

The Dreams module acts as a relay between browsers and a GPU cloud worker:

```
Browsers ←→ æthera (VPS) ←→ GPU Worker (Heimdall/B200)
         WebSocket        WebSocket
```

- **ViewerPresenceTracker**: Tracks viewer count and GPU connection state
- **FrameCache**: Stores recent frames for instant display on connect
- **DreamWebSocketHub**: Broadcasts frames to all connected viewers

### Configuration

Set these environment variables for Dreams functionality:

```bash
# Required for GPU worker authentication
DREAM_GEN_AUTH_TOKEN=your_secure_shared_secret
```


## Production Considerations

### Rate Limiting

æthera includes a simple in-memory rate limiter to prevent comment spam. Important limitations:

- The rate limiter is in-memory and will reset when the server restarts
- In a multi-worker/process deployment, each worker maintains its own rate limit state
- For production with multiple workers or load balancing, consider implementing a Redis-backed rate limiter

## License

Licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
