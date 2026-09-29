from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from aethera.utils.templates import templates

router = APIRouter(tags=["afterlife"])


@router.get("/afterlife", response_class=HTMLResponse)
async def afterlife_viewer(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="afterlife/viewer.html",
        context={"title": "afterlife | æthera"},
    )
