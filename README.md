<div align="center">

# æthera

**thoughts, fragments, and transmissions from the digital aether**

The code behind [aetherawi.red](https://aetherawi.red): a blog, a dream that never<br>
stops, a room of old televisions, and a few small creatures.

[**Visit**](https://aetherawi.red) · [The dream](https://aetherawi.red/dreams) · [The room](https://aetherawi.red/oikos) · [dream_gen](https://github.com/LuxiaSL/dream_gen)

</div>

## What's here

| | |
|---|---|
| [`/`](https://aetherawi.red) | **transmissions**, the blog. There are no accounts: comments carry tripcodes and arrive live. |
| [`/dreams`](https://aetherawi.red/dreams) | the live stream from [dream_gen](https://github.com/LuxiaSL/dream_gen). The picture's edges fold out into a hand-made stage. Lift the bottom-left corner to look backstage. |
| [`/dreams/chronicle`](https://aetherawi.red/dreams/chronicle) | the dream's history: every era as a band in one long strip, with its scenes and prompts. |
| [`/oikos`](https://aetherawi.red/oikos) | the home directory, as a 3D room of CRT screens wired to a VCR. Each screen shows one part of the site, live wherever it can be. |
| [`/oikos#mirc`](https://aetherawi.red/oikos#mirc) | **#oikos**, a small live chat in an mIRC window. |
| [`/irc`](https://aetherawi.red/irc) | **#aethera**, a haunted IRC channel. Everyone watching sees the same fragments at the same time. |
| [`/apeiron`](https://aetherawi.red/apeiron) | the prompt space that feeds the dream, drawn as 3D ASCII geometry. |
| [`/syrinx`](https://aetherawi.red/syrinx) | a creature made of springs that you can hear. |
| [`/afterlife`](https://aetherawi.red/afterlife) | a universe that runs in your browser and makes music. |

For machines and feed readers there are [`/llms.txt`](https://aetherawi.red/llms.txt),
[`/feed.xml`](https://aetherawi.red/feed.xml) and a plain-text or Markdown copy of every post.

## Run it

You need Python 3.11 or newer and [uv](https://docs.astral.sh/uv/).

```bash
git clone https://github.com/LuxiaSL/aethera && cd aethera
uv sync
uv run alembic upgrade head
uv run python -m aethera.main      # http://localhost:2222
uv run pytest -q
```

The 3D pages are separate [Vite](https://vite.dev) projects in `oikos/`, `syrinx/`,
`afterlife/` and `apeiron/`. Each one builds into `aethera/static/<name>/`. The built
bundles are committed, so the server never needs Node. To rebuild one:

```bash
cd oikos && npm ci && npm run build
```

### Settings

| Variable | What it does |
|---|---|
| `DATABASE_URL` | where the blog database lives |
| `AETHERA_TRIPCODE_SALT` | the secret behind comment and chat tripcodes |
| `DREAM_GEN_AUTH_TOKEN` | the token a GPU must present to stream a dream. Always set it. |
| `CHRONICLE_RETENTION_DAYS` | how long the chronicle keeps its detail (default 14) |
| `BLOG_PREVIEW_TOKEN` | unlocks draft previews |

## How the dream gets here

A GPU running [dream_gen](https://github.com/LuxiaSL/dream_gen) connects to `/ws/gpu`
with its token and streams H.264. The server passes the stream straight through to every
viewer on `/ws/dreams`. It keeps the last full frame for anyone who joins late, and it
moves a viewer who falls behind on to the next full frame. The same connection carries
the dream's chronicle records. The server sorts them into eras and scenes, and adds
them to the history strip as they arrive. The public API is documented at
[`/dreams/api`](https://aetherawi.red/dreams/api).

## Deploy

Every push to `main` runs the tests and, at the same time, deploys: the server pulls the
new code and restarts it in Docker, behind [Caddy](https://caddyserver.com). The deploy
does not wait for the tests.

## Credits

By [luxia](https://x.com/slLuxia). The code is [MIT](LICENSE); posts, writing and art are
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
