# Check if uv is installed
if (-not (Get-Command "uv" -ErrorAction SilentlyContinue)) {
    Write-Host "Installing uv..."
    irm https://astral.sh/uv/install.ps1 | iex
    # Refresh env vars for current session
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")
} else {
    Write-Host "uv is already installed."
}

# Install dependencies
Write-Host "Installing dependencies..."
uv sync

# Initialize Database
Write-Host "Initializing database..."
uv run python -c "from luxiblog.models.base import init_db; init_db()"

Write-Host "Setup complete!"
Write-Host "To run the server: uv run uvicorn luxiblog.main:app --reload"
Write-Host "To seed data: uv run python seed_data.py"
