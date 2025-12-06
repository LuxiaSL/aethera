FROM python:3.11-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-dev

# Copy application code
COPY luxiblog/ ./luxiblog/
COPY migrations/ ./migrations/
COPY alembic.ini ./

# Create data directory for SQLite
RUN mkdir -p /app/data

# Set environment variables
ENV DATABASE_URL=sqlite:///./data/blog.sqlite

EXPOSE 8000

# Run migrations and start the server
CMD uv run alembic upgrade head && uv run python -m luxiblog.main

