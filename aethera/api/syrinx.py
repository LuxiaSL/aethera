from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse

from aethera.utils.templates import templates

router = APIRouter(tags=["syrinx"])


@router.get("/syrinx", response_class=HTMLResponse)
async def syrinx_viewer(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="syrinx/viewer.html",
        context={"title": "syrinx | æthera"},
    )
