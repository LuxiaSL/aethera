/* chronicle — what the dream remembers
 *
 * Renders the dream's core sample: hourly strata tiles stacked newest-first
 * (each tile is 120 rows, one per 30 s of the dream), compacted with age,
 * with the eras written up beside it. Reading the core with the cursor
 * (the loupe) shows the frame and words at that moment; an era opens a
 * drawer with its scenes, the words it tried and the memories it recalled.
 */
(function () {
    'use strict';

    const root = document.getElementById('chronicle');
    if (!root || root.dataset.ready) return;
    root.dataset.ready = '1';

    const API = '/api/dreams/chronicle';
    const HOUR = 3600;
    const ROWS_PER_TILE = 240; // strata.py: one row per 15 s
    const off = new AbortController();
    const on = (target, ev, fn, opts) => target.addEventListener(ev, fn, { signal: off.signal, ...(opts || {}) });
    const $ = (id) => document.getElementById(id);
    const el = {
        status: $('chr-status'), statusText: $('chr-status-text'),
        deposit: $('chr-deposit'), depositImg: $('chr-deposit-img'), depositLink: $('chr-deposit-link'),
        caption: $('chr-caption'),
        log: $('chr-log'), depth: $('chr-depth'), core: $('chr-core'), tiles: $('chr-tiles'),
        band: $('chr-band'), hair: $('chr-hair'), hairT: $('chr-hair-t'), eras: $('chr-eras'),
        loupe: $('chr-loupe'), loupeImg: $('chr-loupe-img'), loupeWhen: $('chr-loupe-when'),
        loupeTitle: $('chr-loupe-title'), loupePrompt: $('chr-loupe-prompt'),
        drawer: $('chr-drawer'), drawerBody: $('chr-drawer-body'), scrim: $('chr-scrim'),
        more: $('chr-more'),
    };

    const state = {
        now0: Date.now() / 1000,     // ages are measured from page load: live growth never reflows the past
        tiles: new Map(),            // hour start (unix) -> {t, url}
        eras: new Map(),             // id -> era
        notes: new Map(),            // t -> text
        live: null,
        older: undefined,            // unix of the next older tile; null = the beginning of the record
        blocks: [],                  // layout, top to bottom
        height: 0,
        details: new Map(),          // era id -> Promise<detail>
        loadingOlder: false,
        openEra: null,
    };

    /* ------------------------------------------------------------ utils */

    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const narrow = () => window.matchMedia('(max-width: 760px)').matches;
    const clock = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    const clockS = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const dayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    const hhmm = (t) => clock.format(new Date(t * 1000));
    const hhmmss = (t) => clockS.format(new Date(t * 1000));
    const dayShort = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric' });
    function dayName(t, short) {
        const d = new Date(t * 1000);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const that = new Date(d); that.setHours(0, 0, 0, 0);
        const diff = Math.round((today - that) / 86400000);
        if (diff === 0) return 'today';
        if (diff === 1) return short ? 'yday' : 'yesterday';
        return (short ? dayShort : dayFmt).format(d).toLowerCase();
    }
    const when = (t) => `${dayName(t)} · ${hhmm(t)}`;
    const SLOTS = {
        color_logic: 'colour', atmosphere_field: 'atmosphere', light_behavior: 'light', temporal_state: 'time',
        texture_density: 'texture', medium_render: 'medium', spatial_logic: 'space', material_substance: 'material',
        phenomenon_pattern: 'phenomenon', scale_perspective: 'scale', setting_location: 'setting', subject_form: 'subject',
    };
    const nf = new Intl.NumberFormat();

    // px of core per minute of dream, by age: vivid near now, compacted with depth
    function ppm(ageH) {
        const base = narrow() ? 5 : 6.5;
        return Math.max(0.9, base / (1 + Math.max(0, ageH) / 10));
    }

    // the most saturated usable colour of a palette (dominant colours are often the dark ground)
    function vivid(palette) {
        let best = null, score = -1;
        for (const hex of palette || []) {
            const n = parseInt(hex.slice(1), 16);
            const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
            const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
            const s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1));
            const sc = s * (l > 0.18 && l < 0.88 ? 1 : 0.35) + l * 0.15;
            if (sc > score) { score = sc; best = hex; }
        }
        return best || '#5d5850';
    }

    /* ------------------------------------------------------------ data */

    async function getJSON(url) {
        const r = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!r.ok) throw new Error(`${r.status} ${url}`);
        return r.json();
    }

    function merge(data) {
        for (const tile of data.tiles || []) state.tiles.set(tile.t, tile);
        for (const era of data.eras || []) state.eras.set(era.id, era);
        for (const n of data.annotations || []) state.notes.set(n.t, n.text);
        if (data.live) state.live = data.live;
        if (data.since) state.since = data.since;
        if (data.era_count != null) state.eraCount = data.era_count;
    }

    function edge() {
        // the top of the core: the newest layer actually deposited
        const newestTile = Math.max(...state.tiles.keys());
        let top = newestTile + HOUR;
        if (state.live) top = Math.min(top, Math.max(state.live.t, newestTile + 60));
        return top;
    }

    /* ---------------------------------------------------------- layout */

    function layout() {
        const hours = [...state.tiles.keys()].sort((a, b) => b - a);
        const blocks = [];
        let y = 0;
        const top = edge();
        hours.forEach((t, i) => {
            const tTop = i === 0 ? top : t + HOUR;
            const prev = blocks[blocks.length - 1];
            if (prev) {
                const silence = prev.tBot - tTop;
                if (silence > 0) {
                    const scaled = (silence / 60) * ppm((state.now0 - tTop) / HOUR);
                    const broken = silence > 3 * HOUR;
                    const h = broken ? 64 : Math.min(scaled, 120);
                    blocks.push({ kind: 'gap', tTop: prev.tBot, tBot: tTop, y, h, broken, silence });
                    y += h;
                }
            }
            const ageH = (state.now0 - (t + HOUR / 2)) / HOUR;
            const rate = ppm(ageH);
            const h = Math.max(2, ((tTop - t) / 60) * rate);
            blocks.push({ kind: 'tile', t, tTop, tBot: t, y, h, full: HOUR / 60 * rate, tile: state.tiles.get(t) });
            y += h;
        });
        state.blocks = blocks;
        state.height = y;
    }

    function timeToY(t) {
        const b = state.blocks;
        if (!b.length) return 0;
        if (t >= b[0].tTop) return 0;
        for (const blk of b) {
            if (t >= blk.tBot) return blk.y + ((blk.tTop - t) / (blk.tTop - blk.tBot || 1)) * blk.h;
        }
        return state.height;
    }

    function yToTime(y) {
        for (const blk of state.blocks) {
            if (y <= blk.y + blk.h) {
                const f = Math.min(1, Math.max(0, (y - blk.y) / (blk.h || 1)));
                return { t: blk.tTop - f * (blk.tTop - blk.tBot), gap: blk.kind === 'gap' };
            }
        }
        const last = state.blocks[state.blocks.length - 1];
        return { t: last ? last.tBot : 0, gap: true };
    }

    /* ---------------------------------------------------------- render */

    function render() {
        layout();
        const H = state.height;
        el.core.style.height = `${H}px`;
        el.depth.style.height = `${H}px`;
        el.eras.style.height = `${H}px`;

        // tiles + gaps
        const tileHtml = [];
        for (const b of state.blocks) {
            if (b.kind === 'tile') {
                // enlarged tiles stay crisp (sediment, not smear); compacted ones average down smoothly
                const crisp = b.full / ROWS_PER_TILE > 1.2 ? ' crisp' : '';
                tileHtml.push(`<div class="chr-tile${crisp}" style="top:${b.y}px;height:${b.h}px"><img src="${esc(b.tile.url)}" alt="" loading="lazy" decoding="async" style="height:${b.full}px"></div>`);
            } else if (b.broken) {
                tileHtml.push(`<div class="chr-gap" style="top:${b.y}px;height:${b.h}px"></div>`);
            }
        }
        el.tiles.innerHTML = tileHtml.join('');

        // depth: local hour ticks, day labels, notes, gap labels
        const depth = [];
        const eraLayer = [];
        let lastTickY = -99;
        for (const b of state.blocks) {
            if (b.kind === 'gap') {
                if (b.broken) {
                    const d = b.silence / 86400;
                    const label = d >= 1.5 ? `${Math.round(d)} days unrecorded` : `${Math.round(b.silence / HOUR)} hours unrecorded`;
                    eraLayer.push(`<div class="chr-gaplabel" style="top:${b.y + b.h / 2}px">${label}</div>`);
                }
                continue;
            }
            const start = new Date(b.tBot * 1000);
            start.setMinutes(0, 0, 0);
            for (let m = start.getTime() / 1000 + HOUR; m <= b.tTop; m += HOUR) {
                if (m <= b.tBot) continue;
                const y = timeToY(m);
                const d = new Date(m * 1000);
                if (d.getHours() === 0) {
                    depth.push(`<div class="chr-day" style="top:${y + 26}px">${esc(dayName(m - 1, narrow()))}</div>`);
                    eraLayer.push(`<div class="chr-midnight" style="top:${y}px"></div>`);
                }
                if (y - lastTickY < 22 && lastTickY >= 0) continue;
                depth.push(`<div class="chr-tick${d.getHours() % 6 === 0 ? ' major' : ''}" style="top:${y}px">${hhmm(m)}</div>`);
                lastTickY = y;
            }
        }
        if (state.blocks.length) {
            // the newest day's name sits just above the core, clear of the first hour tick
            depth.push(`<div class="chr-day" style="top:-4px">${esc(dayName(state.blocks[0].tTop, narrow()))}</div>`);
        }
        for (const [t, text] of state.notes) {
            depth.push(`<div class="chr-note" style="top:${timeToY(t)}px">${esc(text)}</div>`);
        }
        el.depth.innerHTML = depth.join('');

        // eras
        const eras = [...state.eras.values()].sort((a, b) => b.t0 - a.t0);
        for (const era of eras) {
            const yTop = timeToY(era.t1), yBot = timeToY(era.t0);
            const h = Math.max(2, yBot - yTop);
            const scenes = era.scenes || [];
            // detail follows the room the era has: tick, title, title+meta, +reel
            const cls = h < 20 ? 'thin' : h < 40 ? 'line' : h < 76 ? 'compact' : '';
            const stops = scenes.length
                ? [...scenes].reverse().map((s, i, a) => `${vivid(s.palette)} ${Math.round((i / Math.max(1, a.length - 1)) * 100)}%`).join(', ')
                : 'var(--ink-faint), var(--ink-faint)';
            const mins = Math.max(1, Math.round((era.t1 - era.t0) / 60));
            const meta = [
                `<span>${hhmm(era.t0)}–${era.open ? 'now' : hhmm(era.t1)}</span>`,
                `<span>${scenes.length} scene${scenes.length === 1 ? '' : 's'}</span>`,
                `<span class="x">${era.mutations} words tried</span>`,
                era.recalls ? `<span class="x">${era.recalls} recalled</span>` : null,
                era.open ? '<span class="open">depositing</span>' : null,
            ].filter(Boolean).join('<i> · </i>');
            const reel = scenes.map((s) => `<span data-t0="${s.t0}" data-t1="${s.t1}" style="--w:${Math.max(1, s.kf)};background-image:url('${esc(s.rep || '')}')"></span>`).join('');
            eraLayer.push(
                `<div class="chr-era ${cls}" data-era="${era.id}" style="top:${yTop}px;height:${h}px;--era-grad:linear-gradient(to bottom, ${stops})" title="${esc(era.title)} · ${mins} min">` +
                `<div class="chr-era-rule"></div><div class="chr-era-body">` +
                `<div class="chr-era-title">${esc(era.title)}</div><div class="chr-era-meta">${meta}</div>` +
                (reel ? `<div class="chr-reel">${reel}</div>` : '') +
                `</div></div>`
            );
        }
        el.eras.innerHTML = eraLayer.join('');
        renderLive();
    }

    function renderLive() {
        const live = state.live;
        if (!live) return;
        const fresh = Date.now() / 1000 - live.t < 6 * 60;
        el.status.classList.toggle('live', fresh);
        el.statusText.textContent = fresh
            ? `depositing now · last layer ${hhmm(live.t)}`
            : `resting · last layer ${when(live.t)}`;
        if (live.thumb) {
            el.depositImg.src = live.thumb;
            el.deposit.hidden = false;
        }
        el.deposit.classList.toggle('live', fresh);
        const newest = [...state.eras.values()].sort((a, b) => b.t1 - a.t1)[0];
        const lastScene = newest?.scenes?.[newest.scenes.length - 1];
        if (lastScene) el.deposit.style.setProperty('--mote', vivid(lastScene.palette));
        const since = state.since ? ` · ${nf.format(state.eraCount || 0)} eras on record since ${dayFmt.format(new Date(state.since * 1000)).toLowerCase()}` : '';
        el.caption.innerHTML =
            `<div class="chr-cap-when"><b>${fresh ? 'now' : 'last'}</b> · ${esc(when(live.t))}${esc(since)}</div>` +
            `<p class="chr-cap-prompt">${esc(live.prompt || '')}</p>` +
            `<a class="chr-cap-link" href="/dreams">watch it live →</a>`;
    }

    /* ----------------------------------------------------------- loupe */

    function eraAt(t) {
        for (const era of state.eras.values()) if (t >= era.t0 - 15 && t <= era.t1 + 15) return era;
        return null;
    }
    const sceneAt = (era, t) => (era?.scenes || []).find((s) => t >= s.t0 - 15 && t <= s.t1 + 15) || null;

    function detail(id) {
        if (!state.details.has(id)) {
            state.details.set(id, getJSON(`${API}/era/${id}`).catch((e) => { state.details.delete(id); throw e; }));
        }
        return state.details.get(id);
    }

    let loupeSeq = 0, loupeTimer = 0;
    function readCore(clientY, pin) {
        const rect = el.core.getBoundingClientRect();
        const y = Math.min(Math.max(0, clientY - rect.top), state.height);
        const { t, gap } = yToTime(y);
        el.hair.style.top = `${y}px`;
        el.hair.classList.add('on');
        el.hairT.textContent = hhmmss(t);
        const era = gap ? null : eraAt(t);
        const scene = sceneAt(era, t);
        const logRect = el.log.getBoundingClientRect();
        const coreRight = rect.right - logRect.left;
        const top = Math.max(0, Math.min(y - 100, state.height - 230));
        el.loupe.style.left = `${coreRight + (narrow() ? 8 : 22)}px`;
        el.loupe.style.top = `${top}px`;
        if (!era) {
            el.loupeImg.style.backgroundImage = 'none';
            el.loupeWhen.textContent = when(t);
            el.loupeTitle.textContent = 'no record';
            el.loupePrompt.textContent = 'the dream was resting';
            el.loupe.classList.add('on');
            return;
        }
        el.loupeWhen.textContent = when(t);
        el.loupeTitle.textContent = era.title;
        if (scene) {
            el.loupeImg.style.backgroundImage = scene.rep ? `url("${scene.rep}")` : 'none';
            el.loupePrompt.textContent = scene.prompt || '';
        }
        el.loupe.classList.add('on');
        const seq = ++loupeSeq;
        clearTimeout(loupeTimer);
        loupeTimer = setTimeout(() => {
            detail(era.id).then((d) => {
                if (seq !== loupeSeq || !d.moments?.length) return;
                let best = d.moments[0];
                for (const m of d.moments) if (Math.abs(m[0] - t) < Math.abs(best[0] - t)) best = m;
                if (Math.abs(best[0] - t) > 120) return;
                el.loupeImg.style.backgroundImage = `url("${best[1]}")`;
                el.loupePrompt.textContent = d.prompts[best[2]] || '';
                el.loupeWhen.textContent = `${dayName(best[0])} · ${hhmmss(best[0])}`;
            }).catch(() => {});
        }, 110);
        if (pin) openEra(era.id, t);
    }

    function hideLoupe() {
        el.hair.classList.remove('on');
        el.loupe.classList.remove('on');
        loupeSeq++;
    }

    /* ---------------------------------------------------------- drawer */

    async function openEra(id, focusT) {
        state.openEra = id;
        const era = state.eras.get(id);
        el.drawer.hidden = false;
        el.scrim.hidden = false;
        requestAnimationFrame(() => { el.drawer.classList.add('open'); el.scrim.classList.add('open'); });
        el.drawerBody.innerHTML = `<p class="chr-faded">reading the era…</p>`;
        const url = new URL(location.href);
        url.searchParams.set('era', id);
        history.replaceState(history.state, '', url);
        try {
            const d = await detail(id);
            if (state.openEra !== id) return;
            el.drawerBody.innerHTML = drawerHtml(d || era);
            if (focusT) {
                const s = sceneAt(d, focusT);
                const node = s && el.drawerBody.querySelector(`[data-scene="${s.i}"]`);
                if (node) node.scrollIntoView({ block: 'center' });
            }
        } catch {
            el.drawerBody.innerHTML = `<p class="chr-faded">this era could not be read just now.</p>`;
        }
    }

    function closeEra() {
        state.openEra = null;
        el.drawer.classList.remove('open');
        el.scrim.classList.remove('open');
        setTimeout(() => { if (!state.openEra) { el.drawer.hidden = true; el.scrim.hidden = true; } }, 340);
        const url = new URL(location.href);
        url.searchParams.delete('era');
        history.replaceState(history.state, '', url);
    }

    function drawerHtml(d) {
        const mins = Math.max(1, Math.round((d.t1 - d.t0) / 60));
        const scenes = (d.scenes || []).map((s) =>
            `<div class="chr-scene" data-scene="${s.i}">` +
            (s.rep ? `<img src="${esc(s.rep)}" alt="" loading="lazy">` : '') +
            `<div class="chr-scene-line"><span>scene ${s.i + 1} · ${hhmm(s.t0)}–${hhmm(s.t1)}</span>` +
            `<span class="chr-swatches">${(s.palette || []).map((c) => `<i style="background:${esc(c)}"></i>`).join('')}</span></div>` +
            `<p>${esc(s.prompt)}</p></div>`).join('');
        const words = (d.words || []).map(([t, slot, from, to]) =>
            `<li><span class="t">${hhmm(t)}</span><span class="slot">${esc(SLOTS[slot] || slot)}</span>` +
            `<span><span class="from">${esc(from)}</span> → <span class="to">${esc(to)}</span></span></li>`).join('');
        const recalls = (d.recall_list || []).map(([t, detail]) => {
            const m = /d=([\d.]+): (.*)$/.exec(detail || '');
            const text = m ? `${esc(m[2])} <span class="t">· distance ${m[1]}</span>` : 'an earlier moment of this era';
            return `<li><span class="t">${hhmm(t)}</span><span class="slot">recalled</span><span>${text}</span></li>`;
        }).join('');
        const moments = (d.moments || []);
        const keptDays = +(d.raw_note_days || 14).toFixed(1);
        const frames = moments.length
            ? (d.partly_faded ? `<p class="chr-faded">its first frames have already faded (raw frames are kept ${keptDays} days); these are the ones left.</p>` : '') +
              `<div class="chr-moments">${moments.map(([t, url, p]) => `<img src="${esc(url)}" alt="" loading="lazy" title="${esc(hhmmss(t) + ' — ' + (d.prompts[p] || ''))}">`).join('')}</div>`
            : `<p class="chr-faded">the raw frames of this era have faded (they are kept ${keptDays} days). what remains: its strata, and one image per scene.</p>`;
        return (
            `<div class="chr-d-when">${esc(dayName(d.t0))} · ${hhmm(d.t0)} – ${d.open ? 'now' : hhmm(d.t1)}</div>` +
            `<h2 class="chr-d-title">${esc(d.title)}</h2>` +
            `<div class="chr-d-stats"><span><b>${mins}</b> min</span><span><b>${nf.format(d.kf)}</b> keyframes</span>` +
            `<span><b>${(d.scenes || []).length}</b> scenes</span><span><b>${d.mutations}</b> words tried</span>` +
            `<span><b>${d.recalls}</b> memories recalled</span>` +
            (d.magenta != null ? `<span><b>${Math.round(d.magenta * 100)}%</b> magenta</span>` : '') + `</div>` +
            `<h3 class="chr-d-h">scenes</h3>${scenes || '<p class="chr-faded">no scenes kept.</p>'}` +
            (words ? `<h3 class="chr-d-h">words it tried</h3><ul class="chr-words">${words}</ul>` : '') +
            (recalls ? `<h3 class="chr-d-h">memories it recalled</h3><ul class="chr-words">${recalls}</ul>` : '') +
            `<h3 class="chr-d-h">every kept frame</h3>${frames}`
        );
    }

    /* -------------------------------------------------------- loading */

    async function loadNewest() {
        const data = await getJSON(`${API}/timeline?hours=24`);
        merge(data);
        if (state.older === undefined) state.older = data.older;
        return data;
    }

    async function loadOlder() {
        if (state.loadingOlder || state.older == null) return;
        state.loadingOlder = true;
        el.more.textContent = 'reading deeper…';
        try {
            const oldest = Math.min(...state.tiles.keys());
            const data = await getJSON(`${API}/timeline?before=${oldest}&hours=24`);
            merge(data);
            state.older = data.older;
            render();
        } catch {
            /* try again on the next scroll */
        } finally {
            state.loadingOlder = false;
            el.more.textContent = state.older == null ? 'the beginning of the record' : '';
        }
    }

    async function refresh() {
        if (document.hidden) return;
        try {
            const before = state.height;
            const anchorY = window.scrollY;
            const data = await getJSON(`${API}/timeline?hours=2`);
            merge(data);
            for (const e of data.eras || []) state.details.delete(e.id); // open eras keep growing
            render();
            const grew = state.height - before;
            const sheetTop = el.log.getBoundingClientRect().top + window.scrollY;
            if (grew > 0 && anchorY > sheetTop) window.scrollTo(0, anchorY + grew);
        } catch { /* the next tick will try again */ }
    }

    /* ---------------------------------------------------------- events */

    on(el.core, 'pointermove', (e) => { if (e.pointerType === 'mouse') readCore(e.clientY, false); });
    on(el.core, 'pointerleave', (e) => { if (e.pointerType === 'mouse') hideLoupe(); });
    on(el.core, 'click', (e) => readCore(e.clientY, true));
    on(el.eras, 'click', (e) => {
        const node = e.target.closest('.chr-era');
        if (!node) return;
        const span = e.target.closest('.chr-reel span');
        openEra(Number(node.dataset.era), span ? Number(span.dataset.t0) + 1 : null);
    });
    on(el.eras, 'pointerover', (e) => {
        const span = e.target.closest('.chr-reel span');
        if (!span) { el.band.style.opacity = 0; return; }
        const yTop = timeToY(Number(span.dataset.t1)), yBot = timeToY(Number(span.dataset.t0));
        el.band.style.top = `${yTop}px`;
        el.band.style.height = `${Math.max(2, yBot - yTop)}px`;
        el.band.style.opacity = 1;
    });
    on(el.eras, 'pointerleave', () => { el.band.style.opacity = 0; });
    on(el.scrim, 'click', closeEra);
    on(el.drawer, 'click', (e) => { if (e.target.closest('.chr-x')) closeEra(); });
    on(document, 'keydown', (e) => { if (e.key === 'Escape' && state.openEra) closeEra(); });
    let resizeT = 0;
    on(window, 'resize', () => { clearTimeout(resizeT); resizeT = setTimeout(render, 150); });

    const io = new IntersectionObserver((entries) => {
        if (entries.some((x) => x.isIntersecting)) loadOlder();
    }, { rootMargin: '900px 0px' });
    io.observe(el.more);

    const tick = setInterval(refresh, 60000);
    on(document.body, 'htmx:beforeSwap', () => { clearInterval(tick); io.disconnect(); off.abort(); }, { once: true });

    /* ------------------------------------------------------------ start */

    loadNewest().then(() => {
        if (!state.tiles.size) {
            el.statusText.textContent = 'the core is empty — nothing recorded yet';
            el.more.textContent = '';
            return;
        }
        render();
        if (state.older == null) el.more.textContent = 'the beginning of the record';
        const eraParam = Number(new URL(location.href).searchParams.get('era'));
        if (eraParam) openEra(eraParam);
    }).catch(() => {
        el.statusText.textContent = 'the chronicle could not be read just now';
    });
})();
