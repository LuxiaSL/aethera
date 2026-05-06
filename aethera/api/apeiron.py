from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from aethera.utils.templates import templates

router = APIRouter(tags=["apeiron"])


@router.get("/apeiron", response_class=HTMLResponse)
async def apeiron_viewer(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="apeiron/viewer.html",
        context={"title": "apeiron | æthera"},
    )
