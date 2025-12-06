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
