"""
oikos — the home directory.

A room of screens in the dark, wired to one VCR in the middle. Every part of
æthera (and a few places past it) gets a screen and a tape; the VCR is the way
in. The scene is a static bundle (oikos/ → aethera/static/oikos/); this module
only renders the page and hands it the directory.

The directory is written here, once, rather than in the bundle: the template
renders it as a plain <nav> for crawlers and for anyone without WebGL, and the
same list is embedded as JSON for the scene. One list, two readers.
"""

from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlmodel import Session, select

from aethera.models.base import get_session
from aethera.models.models import Post
from aethera.utils.templates import templates

router = APIRouter(tags=["oikos"])


# group: "here" lives on this server; "wired" is elsewhere (another host, a
# repo). Every site has an href: the bundle has no path for one without.
# tune: the page can be watched live inside its screen (an iframe on the
# glass). True uses href; a string is the page to frame instead. Only pages
# that let us frame them: æthera's own (same origin, see utils/security.py).
# parlor would need `frame-ancestors https://aetherawi.red` on its side
# first; today it answers X-Frame-Options: DENY.
SITES: list[dict] = [
    {
        "id": "transmissions",
        "title": "transmissions",
        "href": "/",
        "group": "here",
        "kind": "blog",
        "accent": "#f4f1ea",
        "tagline": "thoughts, fragments, and transmissions from the digital aether",
        "about": "The blog: essays, fragments and posts by Celeste & Luxia, in plain "
                 "semantic HTML that people and models can both read.",
        "details": [["kind", "blog"], ["by", "Celeste & Luxia"], ["license", "CC BY 4.0"]],
        "tune": True,
    },
    {
        "id": "dreams",
        "title": "dreams",
        "href": "/dreams",
        "group": "here",
        "kind": "live stream",
        "accent": "#ff7a5c",
        "tagline": "a dream that never stops",
        "about": "A live, continuous AI image stream, drifting through its own latent "
                 "space in real time. The dreamer sleeps until somebody watches: "
                 "tuning in wakes a GPU.",
        "details": [["kind", "live stream"], ["frame", "1024 × 512 · h264"], ["engine", "dream_gen"]],
        "tune": True,
    },
    {
        "id": "chronicle",
        "title": "chronicle",
        "href": "/dreams/chronicle",
        "group": "here",
        "kind": "memory",
        "accent": "#e8e2d4",
        "tagline": "what the dream remembers",
        "about": "Every fifteen seconds of the dream settles as one line of its own "
                 "colour. Newest on top; older days press down and compact, each "
                 "era and scene written up beside it.",
        "details": [["kind", "core sample"], ["of", "dreams"]],
        "tune": True,
    },
    {
        "id": "dreams-api",
        "title": "dreams api",
        "href": "/dreams/api",
        "group": "here",
        "kind": "documentation",
        "accent": "#9fc6ff",
        "tagline": "the dream, by wire",
        "about": "WebSocket, SSE and REST endpoints for taking the dream somewhere "
                 "else: status, the MPEG-TS stream, and an embed.",
        "details": [["kind", "api docs"], ["transport", "ws · sse · rest"]],
        "tune": True,
    },
    {
        "id": "apeiron",
        "title": "apeiron",
        "href": "/apeiron",
        "group": "here",
        "kind": "instrument",
        "accent": "#00ff41",
        "tagline": "every generation is a permanent coordinate",
        "about": "An addressable combinatorial prompt space with real-time 3D ASCII "
                 "hyperobject rendering. Every prompt it composes has an address, "
                 "and every address can be returned to.",
        "details": [["kind", "prompt space"], ["render", "3D ASCII"]],
        "tune": True,
    },
    {
        "id": "syrinx",
        "title": "syrinx",
        "href": "/syrinx",
        "group": "here",
        "kind": "creature",
        "accent": "#8fe3ec",
        "tagline": "a small living instrument",
        "about": "A spring-graph organism whose every edge is a string tuned by its "
                 "own length, so anything it grows is consonant. It does not "
                 "perform: its own life plays it. It is a place, not a session, "
                 "and it is older every time you return.",
        "details": [["kind", "creature · instrument"], ["born", "2026-07-09"],
                    ["by", "Luxia & Claude Fable 5"]],
        "tune": True,
    },
    {
        "id": "afterlife",
        "title": "afterlife",
        "href": "/afterlife",
        "group": "here",
        "kind": "screensaver",
        "accent": "#ffaf00",
        "tagline": "the game of life, after hours",
        "about": "Conway's Life on an infinite grid that steers toward its own drama: "
                 "it names its epochs, stages collisions, greets the famous citizens "
                 "it recognises, and scores itself as it goes. Press g and it "
                 "remembers everything. It is a place, not a session: the universe "
                 "is kept in your browser and resumes where you left it.",
        "details": [["kind", "cellular automaton · music"], ["born", "2026-02-07"],
                    ["by", "Luxia & Claude"], ["source", "github.com/LuxiaSL/afterlife"]],
        "tune": True,
    },
    {
        "id": "irc",
        "title": "irc",
        "href": "/irc",
        "group": "here",
        "kind": "broadcast",
        "accent": "#58a6ff",
        "tagline": "#aethera, always falling apart",
        "about": "A haunted IRC channel that endlessly generates and collapses. "
                 "Live and synchronized: everyone watching sees the same line at "
                 "the same moment.",
        "details": [["kind", "broadcast"], ["channel", "#aethera"]],
        "tune": "/irc?embed=1",
    },
    {
        "id": "parlor",
        "title": "parlor",
        "href": "https://parlor.aetherawi.red",
        "group": "wired",
        "kind": "game",
        "accent": "#e0b33a",
        "tagline": "Kleros: seats for people and models alike",
        "about": "A property-trading board game where humans and language models "
                 "occupy seats interchangeably, joined by sending someone a link. "
                 "A model reads the same view a person is shown, chooses from the "
                 "same legal moves, and can talk while it does.",
        "details": [["kind", "board game"], ["host", "parlor.aetherawi.red"]],
    },
    {
        "id": "dream_gen",
        "title": "dream_gen",
        "href": "https://github.com/LuxiaSL/dream_gen",
        "group": "wired",
        "kind": "engine",
        "accent": "#d59bff",
        "tagline": "the dreamer",
        "about": "A truly infinite diffusion stream: continuous AI art that explores "
                 "latent space without ever collapsing. Mutation, a memory cache and "
                 "template swaps keep it moving. It is what dreams is watching.",
        "details": [["kind", "engine · source"], ["feeds", "dreams"]],
    },
]

FILES: list[dict] = [
    {"id": "feed", "title": "feed.xml", "href": "/feed.xml", "about": "RSS, every post"},
    {"id": "llms", "title": "llms.txt", "href": "/llms.txt", "about": "the site, for models"},
    {"id": "sitemap", "title": "sitemap.xml", "href": "/sitemap.xml", "about": "every page"},
]


def _recent_posts(session: Session, limit: int = 12) -> list[dict]:
    posts = session.exec(
        select(Post).where(Post.published == True)
        .order_by(Post.created_at.desc()).limit(limit)
    ).all()
    return [
        {
            "title": p.title,
            "href": f"/posts/{p.slug}",
            "date": p.created_at.strftime("%Y-%m-%d"),
            "author": p.author,
            "excerpt": (p.excerpt or "")[:180],
        }
        for p in posts
    ]


@router.get("/oikos", response_class=HTMLResponse)
def oikos_viewer(request: Request, session: Session = Depends(get_session)):
    return templates.TemplateResponse(
        request=request,
        name="oikos/viewer.html",
        context={
            "title": "oikos | æthera",
            "sites": SITES,
            "files": FILES,
            "oikos": {"sites": SITES, "files": FILES, "posts": _recent_posts(session)},
        },
    )


@router.get("/~", include_in_schema=False)
def home_directory():
    """~ is where the home directory lives."""
    return RedirectResponse("/oikos", status_code=307)
