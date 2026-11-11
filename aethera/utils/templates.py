from fastapi.templating import Jinja2Templates
from pathlib import Path
from datetime import datetime, timezone

# Define the path to templates directory
# Assuming this file is in aethera/utils/templates.py
# templates dir is at aethera/templates
templates_path = Path(__file__).parent.parent / "templates"

templates = Jinja2Templates(directory=str(templates_path))

# Add custom Jinja2 filters/globals
def utc_now():
    return datetime.now(timezone.utc)

templates.env.globals["now"] = utc_now

# "/static/<path>?v=<content hash>": served immutable, so it must change when the file does
from aethera.utils.static_assets import asset_url  # noqa: E402

templates.env.globals["asset_url"] = asset_url
