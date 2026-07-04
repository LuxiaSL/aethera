import { CombinatorialEngine } from './engine';
import { derivePalette, categoryTints } from './palette-derive';
import type { GeneratedPrompt, Palette } from './types';
import { AsciiRasterizer } from './render/rasterizer';
import { CanvasRenderer } from './render/canvas-renderer';
import { Scene, GeomKind } from './scene/scene';
import { DISSOLVE_STYLES, FORM_STYLES, TransitionStyle } from './scene/transition';
import { configureScene, TEMPLATE_GEOM, interpretMeshDetail } from './interpreter';
import {
  makeIcosahedron, makeTesseract, makeNoiseSurface, makeTerrain,
  makeParticleNebula, makeLorenzAttractor, makeVoxelGrid,
  makeWireframeOrganism, makeCorridor, makeFragmentingSolid,
  makeIntersectingSolids, makeSplitMorphPair, makeMetaballs,
} from './scene/primitives';
import { TorusSampler, MobiusSampler } from './render/surface-samplers';
import { textureForWord, displaceMesh, DEFAULT_TEXTURE, type TextureSpec } from './scene/displace';
import { runGlitchDecode } from './ui/glitch-decode';
import { PromptStore } from './store';
import { encodePermalinkV1, encodePermalinkV2, decodePermalink, type Permalink } from './permalink';

const INITIAL_STATE: Record<string, string[]> = {
  subject_form: ['sphere'], material_substance: ['glass'],
  texture_density: ['smooth'], light_behavior: ['soft ambient light'],
  color_logic: ['monochromatic'], atmosphere_field: ['dust motes'],
  phenomenon_pattern: ['crystallization'], spatial_logic: ['symmetrical'],
  scale_perspective: ['eye level'], temporal_state: ['suspended'],
  setting_location: ['void'], medium_render: ['3d render'],
};

const MAX_HISTORY = 50;
const AUTO_INTERVAL_MS = 8000;

interface HistoryEntry {
  hash: string;
  templateId: string;
  favorited: boolean;
  seed?: number;
  positive: string;
}

type HistoryTab = 'recent' | 'favorites';

class ApeironApp {
  private engine = new CombinatorialEngine();
  private store = new PromptStore();
  private seenHashes = new Set<string>();
  private current: GeneratedPrompt | null = null;
  private templateFilter: string | null = null;
  private templateIdx = -1;
  private count = 0;
  private autoTimer: number | null = null;
  private history: HistoryEntry[] = [];
  private favorites: HistoryEntry[] = [];
  private historyTab: HistoryTab = 'recent';
  private railIndex = 0;
  /** category → words held constant across generations */
  private pins = new Map<string, Set<string>>();

  private promptEl: HTMLElement | null = null;
  private negativeEl: HTMLElement | null = null;
  private componentsEl: HTMLElement | null = null;
  private entropyEl: HTMLElement | null = null;
  private historyListEl: HTMLElement | null = null;
  private templateNameEl: HTMLElement | null = null;
  private paletteNameEl: HTMLElement | null = null;

  private canvas: HTMLCanvasElement | null = null;
  private canvasRenderer: CanvasRenderer | null = null;
  private rasterizer: AsciiRasterizer | null = null;
  private scene = new Scene();
  private visualState: Record<string, string[]> = {};
  private palette: Palette | null = null;
  private tints: Record<string, string> = {};
  private lastTick = 0;
  private lastTemplateId: string | null = null;
  private resizeTimeout: number | null = null;

  async init(): Promise<void> {
    await this.engine.load(
      '/static/apeiron/data/components.json',
      '/static/apeiron/data/templates.json'
    );

    await this.store.init().catch(err => console.warn('apeiron: store unavailable', err));
    this.seenHashes = this.store.seenHashes;
    this.count = this.store.count;

    this.visualState = Object.fromEntries(
      Object.entries(INITIAL_STATE).map(([k, v]) => [k, [...v]])
    );

    this.promptEl = document.getElementById('prompt-display');
    this.negativeEl = document.getElementById('negative-prompt');
    this.componentsEl = document.getElementById('components-table');
    this.entropyEl = document.getElementById('entropy-meter');
    this.historyListEl = document.getElementById('history-list');
    this.templateNameEl = document.getElementById('template-name');
    this.paletteNameEl = document.getElementById('palette-name');
    this.canvas = document.getElementById('hyperobject-canvas') as HTMLCanvasElement;

    if (this.canvas) {
      this.canvasRenderer = new CanvasRenderer(this.canvas);
      const { cols, rows } = this.canvasRenderer.fit();
      this.rasterizer = new AsciiRasterizer(cols, rows);

      const tess = makeTesseract();
      this.scene.tesseractVerts = tess.vertices;
      this.scene.tesseractEdges = tess.edges;

      // once the real mono font arrives, re-measure so glyphs stay crisp
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => this.refit()).catch(() => {});
      }
    }

    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('resize', () => this.onResize());
    this.bindControls();
    this.bindHistoryRail();

    // click a word in the inscription to hold it across generations
    this.promptEl?.addEventListener('click', (e) => {
      const tok = (e.target as HTMLElement).closest<HTMLElement>('.tok');
      if (tok?.dataset.cat && tok.dataset.word) {
        this.togglePin(tok.dataset.cat, tok.dataset.word);
      }
    });

    // rail persists across visits
    await this.loadHistoryFromStore();

    // a fragment is an address: reconstruct that exact point in the space
    const link = decodePermalink(window.location.hash);
    if (link) {
      await this.generateFromPermalink(link);
    } else {
      this.generate();
    }

    this.lastTick = performance.now() / 1000;
    this.startRenderLoop();

    console.log(
      `%capeiron%c :: ${this.engine.components.size} categories · ` +
      `${this.engine.templates.size} templates · ` +
      `~${this.engine.totalCombinations.toExponential(2)} addresses`,
      'color:#0f0;font-weight:bold', 'color:inherit'
    );
  }

  // -------------------------------------------------------------------------
  // generation & restoration
  // -------------------------------------------------------------------------

  private generate(): void {
    const prompt = this.engine.generateUnique(this.seenHashes, this.templateFilter, this.pinnedWords());
    this.present(prompt, true);
  }

  private pinnedWords(): Record<string, string[]> | undefined {
    if (this.pins.size === 0) return undefined;
    const out: Record<string, string[]> = {};
    for (const [cat, words] of this.pins) {
      if (words.size > 0) out[cat] = [...words];
    }
    return Object.keys(out).length > 0 ? out : undefined;
  }

  private async generateFromPermalink(link: Permalink): Promise<void> {
    try {
      const templateId = this.engine.templateIdAt(link.templateIndex);
      if (!templateId) { this.generate(); return; }

      let prompt: GeneratedPrompt | null = null;
      if (link.kind === 'indices') {
        const words = this.engine.componentsFromIndices(templateId, link.indices);
        if (words) prompt = this.engine.materialize(templateId, words);
      } else {
        prompt = this.engine.generate(templateId, link.seed);
      }
      if (!prompt) { this.generate(); return; }

      // if this address was visited before, keep its recorded state
      const stored = await this.store.get(prompt.hash).catch(() => null);
      this.present(stored ?? prompt, stored === null);
    } catch (err) {
      console.warn('apeiron: bad permalink, generating fresh', err);
      this.generate();
    }
  }

  private restoreEntry(entry: HistoryEntry): void {
    this.store.get(entry.hash)
      .then((stored) => {
        if (stored) this.present(stored, false);
        else if (entry.seed !== undefined) {
          this.present(this.engine.generate(entry.templateId, entry.seed), false);
        }
      })
      .catch(() => {});
  }

  /** Single entry point: put a prompt on stage. */
  private present(prompt: GeneratedPrompt, isNew: boolean): void {
    this.current = prompt;
    this.palette = derivePalette(prompt.components['color_logic'] ?? [], prompt.templateId);
    this.tints = categoryTints(this.palette, Object.keys(prompt.components));

    if (isNew) {
      this.seenHashes.add(prompt.hash);
      this.count = this.seenHashes.size;
      this.store.save(prompt).catch(() => {});
      this.history.unshift(this.toEntry(prompt));
      if (this.history.length > MAX_HISTORY) this.history.length = MAX_HISTORY;
      this.railIndex = 0;
    } else {
      const pos = this.railEntries().findIndex(e => e.hash === prompt.hash);
      if (pos >= 0) this.railIndex = pos;
    }

    for (const [cat, words] of Object.entries(prompt.components)) {
      this.visualState[cat] = [...words];
    }

    const templateChanged = this.lastTemplateId !== null && this.lastTemplateId !== prompt.templateId;
    if (templateChanged) {
      this.scene.captureTransitionSource();
      const ds = DISSOLVE_STYLES[this.lastTemplateId!] ?? TransitionStyle.SCATTER;
      const fs = FORM_STYLES[prompt.templateId] ?? TransitionStyle.SCATTER;
      this.scene.startTransition(ds, fs);
    }

    configureScene(this.scene, this.visualState, prompt.templateId, prompt.hash);
    const p = this.palette;
    this.scene.styles = [p.bright, p.primary, p.dim, p.borderDim];

    this.buildGeometry(prompt.templateId);
    this.lastTemplateId = prompt.templateId;
    this.updateUrl(prompt);
    this.renderUI();
  }

  private toEntry(prompt: GeneratedPrompt): HistoryEntry {
    return {
      hash: prompt.hash,
      templateId: prompt.templateId,
      favorited: prompt.favorited,
      seed: prompt.seed,
      positive: prompt.positive,
    };
  }

  private async loadHistoryFromStore(): Promise<void> {
    try {
      const recent = await this.store.getRecent(MAX_HISTORY);
      this.history = recent.map(p => this.toEntry(p));
      this.favorites = (await this.store.getFavorites()).map(p => this.toEntry(p));
    } catch { /* rail simply starts empty */ }
  }

  private updateUrl(prompt: GeneratedPrompt): void {
    try {
      const idx = this.engine.templateIndex(prompt.templateId);
      if (idx < 0) return;
      const indices = this.engine.componentIndices(prompt);
      if (indices) {
        window.history.replaceState(null, '', `#${encodePermalinkV2(idx, indices)}`);
      } else if (prompt.seed !== undefined) {
        window.history.replaceState(null, '', `#${encodePermalinkV1(idx, prompt.seed)}`);
      }
    } catch { /* address bar is a nicety, not a dependency */ }
  }

  // -------------------------------------------------------------------------
  // scene geometry
  // -------------------------------------------------------------------------

  private buildGeometry(templateId: string): void {
    this.scene.clearGeometry();
    const kind = TEMPLATE_GEOM[templateId] ?? GeomKind.MESH_FILLED;
    const detail = interpretMeshDetail(this.visualState['subject_form'] ?? []);
    const texWords = this.visualState['texture_density'] ?? [];
    const tex: TextureSpec = texWords.length > 0 ? textureForWord(texWords[0]) : DEFAULT_TEXTURE;

    switch (templateId) {
      case 'material_study':
        // displacement needs vertices to push: keep at least one subdivision
        this.scene.mesh = makeIcosahedron(Math.max(Math.min(detail, 2), tex.amp > 0.02 ? 2 : 1));
        displaceMesh(this.scene.mesh, tex);
        break;
      case 'process_state':
        this.scene.mesh = makeMetaballs();
        displaceMesh(this.scene.mesh, tex);
        break;
      case 'ruin_state': {
        const { mesh, groups } = makeFragmentingSolid();
        displaceMesh(mesh, tex);
        this.scene.mesh = mesh;
        this.scene.fragmentGroups = groups;
        break;
      }
      case 'specimen':
        this.scene.mesh = makeWireframeOrganism();
        displaceMesh(this.scene.mesh, tex);
        this.scene.mesh.computeEdgesFromFaces();
        break;
      case 'liminal':
        // architecture stays clean; texture lives in the shader chars
        this.scene.mesh = makeCorridor();
        break;
      case 'minimal_object':
        this.scene.surfaceSampler = new TorusSampler();
        break;
      case 'essence':
        this.scene.surfaceSampler = new MobiusSampler();
        break;
      case 'atmospheric_depth':
        this.scene.cloud = makeParticleNebula();
        break;
      case 'abstract_field':
        this.scene.cloud = makeLorenzAttractor();
        break;
      case 'textural_macro':
        this.scene.heightmap = makeNoiseSurface(24, 24, 0.3 * (tex.freq / 4), 0.4 * tex.heightScale);
        break;
      case 'environmental':
        this.scene.heightmap = makeTerrain(32, 32, 0.15, 0.8 * tex.heightScale);
        break;
      case 'site_decay':
        this.scene.voxels = makeVoxelGrid();
        break;
      case 'material_collision': {
        const [a, b] = makeIntersectingSolids();
        displaceMesh(a, tex);
        displaceMesh(b, tex);
        this.scene.mesh = a;
        this.scene.meshB = b;
        this.scene.dualMeshMode = 'overlay';
        break;
      }
      case 'temporal_diptych': {
        const [a, b] = makeSplitMorphPair();
        displaceMesh(a, tex);
        displaceMesh(b, tex);
        this.scene.mesh = a;
        this.scene.meshB = b;
        this.scene.dualMeshMode = 'morph';
        break;
      }
      default:
        if (kind === GeomKind.MESH_FILLED) {
          this.scene.mesh = makeIcosahedron(1);
          displaceMesh(this.scene.mesh, tex);
        }
        break;
    }
  }

  private startRenderLoop(): void {
    const tick = (): void => {
      const now = performance.now() / 1000;
      const dt = Math.min(now - this.lastTick, 0.1);
      this.lastTick = now;

      this.scene.tick(dt);

      if (this.rasterizer && this.canvasRenderer) {
        this.scene.render(this.rasterizer);
        this.canvasRenderer.render(this.rasterizer.grid);
      }

      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  private refit(): void {
    if (!this.canvasRenderer || !this.rasterizer) return;
    const { cols, rows } = this.canvasRenderer.fit();
    this.rasterizer.resize(cols, rows);
  }

  private onResize(): void {
    if (this.resizeTimeout !== null) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(() => this.refit(), 150);
  }

  // -------------------------------------------------------------------------
  // UI
  // -------------------------------------------------------------------------

  private bindControls(): void {
    for (const btn of document.querySelectorAll<HTMLButtonElement>('.control-btn')) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.action;
        switch (action) {
          case 'generate': this.generate(); break;
          case 'template': this.cycleTemplate(); break;
          case 'favorite': this.toggleFavorite(); break;
          case 'auto': this.toggleAuto(); break;
          case 'anatomy': this.toggleAnatomy(); break;
          case 'history': this.toggleHistoryPanel(); break;
          case 'copy':
            if (this.current) navigator.clipboard.writeText(this.current.positive).catch(() => {});
            break;
        }
      });
    }
  }

  private bindHistoryRail(): void {
    for (const tab of document.querySelectorAll<HTMLButtonElement>('.history-tab')) {
      tab.addEventListener('click', () => {
        const t = tab.dataset.tab as HistoryTab | undefined;
        if (t) this.setHistoryTab(t);
      });
    }
    this.historyListEl?.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>('.history-entry');
      const hash = target?.dataset.hash;
      if (!hash) return;
      const entry = this.railEntries().find(x => x.hash === hash);
      if (entry) this.restoreEntry(entry);
    });
  }

  private setHistoryTab(tab: HistoryTab): void {
    this.historyTab = tab;
    this.railIndex = 0;
    if (tab === 'favorites') {
      this.store.getFavorites()
        .then((favs) => { this.favorites = favs.map(p => this.toEntry(p)); this.renderHistory(); })
        .catch(() => this.renderHistory());
    } else {
      this.renderHistory();
    }
  }

  private railEntries(): HistoryEntry[] {
    return this.historyTab === 'favorites' ? this.favorites : this.history;
  }

  private renderUI(): void {
    const prompt = this.current;
    if (!prompt || !this.palette) return;
    const palette = this.palette;

    if (this.promptEl) {
      runGlitchDecode(this.promptEl, prompt.positive, palette, (t) => this.highlightText(t, prompt));
    }

    if (this.negativeEl) {
      this.negativeEl.textContent = `− ${prompt.negative}`;
    }

    if (this.templateNameEl) this.templateNameEl.textContent = prompt.templateId.replace(/_/g, ' ');
    if (this.paletteNameEl) this.paletteNameEl.textContent = palette.name;

    if (this.componentsEl) this.componentsEl.innerHTML = this.renderComponentsTable(prompt);
    if (this.entropyEl) this.entropyEl.innerHTML = this.renderEntropy();
    this.renderHistory();
    this.updateAutoButton();

    const app = document.getElementById('apeiron-app');
    if (app) {
      app.style.setProperty('--ap-primary', palette.primary);
      app.style.setProperty('--ap-bright', palette.bright);
      app.style.setProperty('--ap-dim', palette.dim);
      app.style.setProperty('--ap-accent', palette.accent);
      app.style.setProperty('--ap-border', palette.border);
      app.style.setProperty('--ap-border-dim', palette.borderDim);
      app.style.setProperty('--ap-negative', palette.negative);
      app.style.setProperty('--ap-negative-border', palette.negativeBorder);
    }
  }

  private renderHistory(): void {
    if (!this.historyListEl) return;
    const entries = this.railEntries();
    const activeHash = this.current?.hash;

    for (const tab of document.querySelectorAll<HTMLButtonElement>('.history-tab')) {
      tab.classList.toggle('active', tab.dataset.tab === this.historyTab);
    }

    if (entries.length === 0) {
      this.historyListEl.innerHTML = `<div class="history-empty">${this.historyTab === 'favorites' ? 'nothing kept yet' : 'no transmissions yet'}</div>`;
      return;
    }

    this.historyListEl.innerHTML = entries.map((entry) => {
      const star = entry.favorited ? '<span class="star">★</span>' : '';
      const tmpl = entry.templateId.replace(/_/g, ' ');
      const active = entry.hash === activeHash ? ' active' : '';
      return `<div class="history-entry${active}" data-hash="${esc(entry.hash)}" title="${esc(entry.positive)}">` +
        `${star}<span class="hash">0x${esc(entry.hash)}</span>` +
        `<span class="template-label">${esc(tmpl)}</span></div>`;
    }).join('');
  }

  private updateAutoButton(): void {
    const btn = document.querySelector<HTMLButtonElement>('.control-btn[data-action="auto"]');
    if (btn) {
      btn.classList.toggle('active', this.autoTimer !== null);
    }
  }

  private highlightText(text: string, prompt: GeneratedPrompt): string {
    let html = esc(text);
    for (const [category, words] of Object.entries(prompt.components)) {
      const color = this.tints[category] ?? this.palette?.primary ?? '#cccccc';
      for (const word of words) {
        const escaped = esc(word);
        const pinned = this.pins.get(category)?.has(word) ? ' pinned' : '';
        html = html.replace(
          escaped,
          `<span class="tok${pinned}" data-cat="${esc(category)}" data-word="${escaped}"` +
          ` style="color:${color};font-weight:bold" title="${esc(category.replace(/_/g, ' '))} — click to pin">${escaped}</span>`,
        );
      }
    }
    return html;
  }

  /** Redraw the inscription instantly (no glitch decode) — used after pin toggles. */
  private redrawPrompt(): void {
    if (this.promptEl && this.current) {
      this.promptEl.innerHTML = this.highlightText(this.current.positive, this.current);
    }
    if (this.entropyEl) this.entropyEl.innerHTML = this.renderEntropy();
  }

  private togglePin(category: string, word: string): void {
    let set = this.pins.get(category);
    if (!set) { set = new Set(); this.pins.set(category, set); }
    if (set.has(word)) {
      set.delete(word);
      if (set.size === 0) this.pins.delete(category);
    } else {
      set.add(word);
    }
    this.redrawPrompt();
  }

  private clearPins(): void {
    if (this.pins.size === 0) return;
    this.pins.clear();
    this.redrawPrompt();
  }

  private renderComponentsTable(prompt: GeneratedPrompt): string {
    return Object.entries(prompt.components)
      .map(([cat, words]) => {
        const color = this.tints[cat] ?? this.palette?.primary ?? '#cccccc';
        return `<div style="color:${color}"><strong>${esc(cat.replace(/_/g, ' '))}</strong>: ${words.map(esc).join(', ')}</div>`;
      }).join('');
  }

  private renderEntropy(): string {
    const total = this.engine.totalCombinations;
    const pct = total > 0 ? (this.count / total) * 100 : 0;
    const logP = total > 1 ? Math.log10(this.count + 1) / Math.log10(total) : 0;
    const filled = Math.floor(32 * Math.min(logP, 1));
    const bar = '▓'.repeat(filled) + '░'.repeat(32 - filled);
    const filter = this.templateFilter ?? 'all';
    const auto = this.autoTimer !== null ? '  [AUTO]' : '';
    let pinCount = 0;
    for (const s of this.pins.values()) pinCount += s.size;
    const pinNote = pinCount > 0 ? `  <span class="e-pins">[${pinCount} pinned · esc]</span>` : '';
    return `<span class="e-bar">${bar}</span>  ` +
      `<span class="e-count">#${this.count.toLocaleString()}</span>` +
      `  of  ~${total.toExponential(1)}  ` +
      `<span class="e-pct">${pct.toFixed(pct < 0.001 ? 6 : 3)}%</span>  ` +
      `<span class="e-filter">[${esc(filter)}]</span>${pinNote}${auto}`;
  }

  /** 'user-toggled' inverts the default: shows on mobile, hides on desktop. */
  private toggleHistoryPanel(): void {
    document.getElementById('history-panel')?.classList.toggle('user-toggled');
  }

  private toggleAnatomy(): void {
    const el = document.getElementById('anatomy');
    el?.classList.toggle('open');
    const btn = document.querySelector<HTMLButtonElement>('.control-btn[data-action="anatomy"]');
    btn?.classList.toggle('active', el?.classList.contains('open') ?? false);
  }

  // -------------------------------------------------------------------------
  // input
  // -------------------------------------------------------------------------

  private onKeyDown(e: KeyboardEvent): void {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case ' ': case 'Enter':
        e.preventDefault(); this.generate(); break;
      case 't': case 'T': this.cycleTemplate(); break;
      case 'f': case 'F': this.toggleFavorite(); break;
      case 'a': case 'A': this.toggleAuto(); break;
      case 'x': case 'X': this.toggleAnatomy(); break;
      case 'h': case 'H': this.toggleHistoryPanel(); break;
      case 'c': case 'C':
        if (this.current) navigator.clipboard.writeText(this.current.positive).catch(() => {});
        break;
      case 'n': case 'N':
        if (this.current) navigator.clipboard.writeText(this.current.negative).catch(() => {});
        break;
      case 'ArrowLeft':
        e.preventDefault(); this.stepHistory(1); break;
      case 'ArrowRight':
        e.preventDefault(); this.stepHistory(-1); break;
      case 'Escape':
        this.clearPins(); break;
    }
  }

  /** Walk the visible rail: +1 = older, -1 = newer. */
  private stepHistory(delta: number): void {
    const entries = this.railEntries();
    if (entries.length === 0) return;
    const next = Math.min(Math.max(this.railIndex + delta, 0), entries.length - 1);
    if (next === this.railIndex && entries[next]?.hash === this.current?.hash) return;
    this.railIndex = next;
    this.restoreEntry(entries[next]);
  }

  private cycleTemplate(): void {
    const ids = this.engine.templateIds;
    this.templateIdx++;
    if (this.templateIdx >= ids.length) { this.templateIdx = -1; this.templateFilter = null; }
    else this.templateFilter = ids[this.templateIdx];
    this.renderUI();
  }

  private toggleFavorite(): void {
    if (!this.current) return;
    this.current.favorited = !this.current.favorited;
    this.store.toggleFavorite(this.current.hash).catch(() => {});
    const hash = this.current.hash;
    const flag = this.current.favorited;
    const entry = this.history.find(h => h.hash === hash);
    if (entry) entry.favorited = flag;
    if (flag) {
      if (!this.favorites.some(f => f.hash === hash)) {
        this.favorites.unshift(this.toEntry(this.current));
      }
    } else {
      this.favorites = this.favorites.filter(f => f.hash !== hash);
    }
    this.renderUI();
  }

  private toggleAuto(): void {
    if (this.autoTimer !== null) { clearInterval(this.autoTimer); this.autoTimer = null; }
    else this.autoTimer = window.setInterval(() => this.generate(), AUTO_INTERVAL_MS);
    this.renderUI();
  }
}

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new ApeironApp();
  app.init().catch(err => console.error('apeiron init failed:', err));
});
