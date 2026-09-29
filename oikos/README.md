# oikos

> *οἶκος — a household, a home.* æthera's home directory, as a room in the Wired.

A room of CRT screens in the dark, one per site, every cable running into a
VCR on a plinth in the middle. Over it all, a Windows XP desktop for the parts
you click. Served at **`/oikos`** (and **`/~`**, which redirects there).

There are two ways in, on purpose. Click the **VCR** (or the start button) to
open `~`, the home directory, where every site is a tape. Or click a **screen**
in the room. Either way a tape goes into the VCR, the display says PLAY and the
channel, and that screen's cable surges. Then the site's pane opens, showing
the very canvas its screen is painted on. **Open** it and the camera dives
through the glass to the site.

## What's on the screens

Every screen is a small painter (`src/screens/`) drawing a 512×384 canvas. The
room samples it through a CRT shader, and the pane shows the same canvas. As
many of them as possible are live, and all from endpoints that cost the site
nothing to watch:

| screen | source |
|---|---|
| transmissions | the latest post titles, rendered into the page by `oikos.py` |
| dreams | the chronicle's latest keyframe thumbnail + `/api/dreams/status` |
| chronicle | the real hourly strata tiles and era titles |
| dreams api | re-types the real `/api/dreams/status` JSON each poll |
| apeiron | real prompts composed from apeiron's own `templates.json` / `components.json` |
| syrinx | **your** creature, read from this origin's localStorage (name, age, topology) |
| irc | the live `/ws/irc` broadcast, formatted as `irc.js` formats it |
| parlor | Kleros' real board, districts and prices; a toy game on it |
| dream_gen | the core-loop diagram from its README, with the real keyframe and prompt |

**The room never opens `/ws/dreams`.** A viewer socket is what wakes the
dreamer's GPU, and a hub left open in a tab would keep it awake all night. The
room only uses the monitoring endpoint and the chronicle. Every poll and
socket stops while the tab is hidden.

Adding a site means adding an entry to `SITES` in `aethera/api/oikos.py`. It
gets a screen straight away (colour bars and its name) and a spot on the outer
arc. Give it a painter in `src/screens/index.ts` and a placement in
`src/world/layout.ts` when it deserves one.

## Tuning in

A site's pane can **Watch it here**. The camera squares up to its screen and
holds still, and the real page is laid over the glass: an iframe under a CRT
layer (scanlines, the tube's vignette, a reflection, a slow roll bar, the
power-on line). It is fully alive — links, keys, sound, syrinx waking — while
the room keeps rendering around it. **⏏ Eject** (or `Esc`) steps back out.

It is a plain 2D rectangle, not CSS3D, and that is deliberate. An iframe
inside a `preserve-3d` context paints on the glass, but Chrome won't
hit-test into it, so clicks fell through to the canvas. Square on and held
still, the glass projects to a rectangle anyway (`Room.glassRect`).

Which sites can be tuned in is set by `tune` in `oikos.py`. It works for
same-origin pages only. `utils/security.py` lets æthera frame æthera
(`frame-ancestors 'self'`, `X-Frame-Options: SAMEORIGIN`) and nobody else.
Two things live outside this repo:

- **The proxy in front of æthera** also answers `X-Frame-Options: DENY`.
  Modern browsers let the app's `frame-ancestors` override it, but the proxy
  line should go (or become `SAMEORIGIN`) so nothing leans on that rule.
- **parlor** answers `X-Frame-Options: DENY`. It would need
  `Content-Security-Policy: frame-ancestors https://aetherawi.red` before it
  can be tuned in.

**The next step is shaders on the page itself.** CSS can only lay effects
*over* the page. Real GLSL on it (curvature, convergence, bloom) needs the
page as a texture. For the canvas-built sites (apeiron, syrinx, dreams, the
irc tube) that is reachable today: same-origin frames can hand their canvas
over, as an `ImageBitmap` per frame by `postMessage`, and the room forwards
pointer events back by raycasting to UV. DOM pages need the WICG
HTML-in-Canvas work (`drawElementImage`) to land in browsers.

## Layout of the code

```
src/main.ts          the house: boot, shell, keys, visibility, no-WebGL fallback
src/data.ts          the directory + live feeds (dreams, chronicle, irc, syrinx, apeiron)
src/screens/         one painter per site
src/world/room.ts    renderer, camera, picking, focus/play/dive, the loop
src/world/{monitor,crt,vcr,wires,field,post,layout}.ts
src/xp/              Luna: windows, explorer (~), panes, taskbar/start menu, icons
```

## Build

Like syrinx and apeiron, the built bundle is committed. The Docker image
never runs npm, so rebuild and commit whenever `src/` changes:

```bash
npm install
npm run build        # → ../aethera/static/oikos/oikos.{js,css}
npm run watch        # rebuild on save, beside: uv run python -m aethera.main
```

There is no standalone dev page, because the room is made of the site's own
endpoints. Develop against the real server and open `/oikos`.

- `/oikos?contact` shows every screen side by side with no 3D, for working on painters.
- `/oikos#dreams` deep-links a tape. The hash follows whichever pane is open.
- `npm run shot` photographs the room, the home directory, a pane, the start
  menu and a phone layout in headless Chromium. Software WebGL is slow; pass
  `--speed 5` (the `?speed=` debug param runs the room's clock faster).
- `npm run drive` walks through every interaction a visitor has: hover, orbit,
  the VCR, a tape going in, tuning in, eject, the start menu, arrow keys, a
  typed channel, and the dive. It uses `?drive`, which stops the room's own
  loop and steps it at a true 30 fps from the harness, so the animations can
  be watched frame by frame on a machine with no GPU. It writes a still for
  each moment plus `tour.webm`, and prints how long each frame spends painting
  screens versus rendering. `--phone` does the touch version;
  `--browser firefox|webkit` runs another engine (after `npx playwright install
  firefox webkit`; WebKit also needs `install-deps`).

Keys: `~` or `Home` opens the home directory. `←` `→` walk the screens and
`Enter` plays one. Type a channel number like a remote. `Esc` closes.
