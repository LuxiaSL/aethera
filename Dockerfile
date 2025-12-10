FROM python:3.11-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files and README (required by pyproject.toml)
COPY pyproject.toml uv.lock README.md ./

# Install dependencies
RUN uv sync --frozen --no-dev --no-editable

# Copy application code (includes dreams/ module)
COPY aethera/ ./aethera/
COPY migrations/ ./migrations/
COPY alembic.ini ./

# Create data directory for SQLite and state persistence
RUN mkdir -p /app/data /app/data/dreams

# Set environment variables
ENV DATABASE_URL=sqlite:///./data/blog.sqlite

# Dreams module expects these from .env file:
# - DREAM_GEN_AUTH_TOKEN (required for GPU auth)
# - RUNPOD_API_KEY (required for GPU management)
# - RUNPOD_ENDPOINT_ID (required for GPU management)

EXPOSE 8000

# Run migrations and start the server
CMD ["sh", "-c", "uv run alembic upgrade head && uv run python -m aethera.main"]
