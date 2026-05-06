import { CombinatorialEngine } from './engine';
import { paletteForTemplate } from './palettes';
import { CATEGORY_COLORS } from './types';
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
import { runGlitchDecode } from './ui/glitch-decode';
import { PromptStore } from './store';

const INITIAL_STATE: Record<string, string[]> = {
  subject_form: ['sphere'], material_substance: ['glass'],
  texture_density: ['smooth'], light_behavior: ['soft ambient light'],
  color_logic: ['monochromatic'], atmosphere_field: ['dust motes'],
  phenomenon_pattern: ['crystallization'], spatial_logic: ['symmetrical'],
  scale_perspective: ['eye level'], temporal_state: ['suspended'],
  setting_location: ['void'], medium_render: ['3d render'],
};

const MAX_HISTORY = 50;

interface HistoryEntry {
  hash: string;
  templateId: string;
  favorited: boolean;
}

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

  private promptEl: HTMLElement | null = null;
  private negativeEl: HTMLElement | null = null;
  private componentsEl: HTMLElement | null = null;
  private entropyEl: HTMLElement | null = null;
  private historyListEl: HTMLElement | null = null;

  private canvas: HTMLCanvasElement | null = null;
  private canvasRenderer: CanvasRenderer | null = null;
  private rasterizer: AsciiRasterizer | null = null;
  private scene = new Scene();
  private visualState: Record<string, string[]> = {};
  private palette: Palette | null = null;
  private lastTick = 0;
  private lastTemplateId: string | null = null;
  private resizeTimeout: number | null = null;

  async init(): Promise<void> {
    await this.engine.load(
      '/static/apeiron/data/components.json',
      '/static/apeiron/data/templates.json'
    );

    await this.store.init();
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
    this.canvas = document.getElementById('hyperobject-canvas') as HTMLCanvasElement;

    if (this.canvas) {
      const { cols, rows } = CanvasRenderer.fitToContainer(this.canvas);
      this.canvasRenderer = new CanvasRenderer(this.canvas, cols, rows);
      this.rasterizer = new AsciiRasterizer(cols, rows);

      const tess = makeTesseract();
      this.scene.tesseractVerts = tess.vertices;
      this.scene.tesseractEdges = tess.edges;
    }

    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    window.addEventListener('resize', () => this.onResize());
    this.bindControls();

    this.generate();
    this.lastTick = performance.now() / 1000;
    this.startRenderLoop();

    console.log(
      `apeiron: ${this.engine.components.size} categories, ` +
      `${this.engine.templates.size} templates, ` +
      `~${this.engine.totalCombinations.toExponential(2)} combinations`
    );
  }

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
          case 'copy':
            if (this.current) navigator.clipboard.writeText(this.current.positive).catch(() => {});
            break;
        }
      });
    }
  }

  private buildGeometry(templateId: string): void {
    this.scene.clearGeometry();
    const kind = TEMPLATE_GEOM[templateId] ?? GeomKind.MESH_FILLED;
    const detail = interpretMeshDetail(this.visualState['subject_form'] ?? []);

    switch (templateId) {
      case 'material_study':
        this.scene.mesh = makeIcosahedron(Math.min(detail, 2));
        break;
      case 'process_state':
        this.scene.mesh = makeMetaballs();
        break;
      case 'ruin_state': {
        const { mesh, groups } = makeFragmentingSolid();
        this.scene.mesh = mesh;
        this.scene.fragmentGroups = groups;
        break;
      }
      case 'specimen':
        this.scene.mesh = makeWireframeOrganism();
        break;
      case 'liminal':
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
        this.scene.heightmap = makeNoiseSurface();
        break;
      case 'environmental':
        this.scene.heightmap = makeTerrain();
        break;
      case 'site_decay':
        this.scene.voxels = makeVoxelGrid();
        break;
      case 'material_collision': {
        const [a, b] = makeIntersectingSolids();
        this.scene.mesh = a;
        this.scene.meshB = b;
        this.scene.dualMeshMode = 'overlay';
        break;
      }
      case 'temporal_diptych': {
        const [a, b] = makeSplitMorphPair();
        this.scene.mesh = a;
        this.scene.meshB = b;
        this.scene.dualMeshMode = 'morph';
        break;
      }
      default:
        if (kind === GeomKind.MESH_FILLED) this.scene.mesh = makeIcosahedron(1);
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

  private generate(): void {
    const prompt = this.engine.generateUnique(this.seenHashes, this.templateFilter);
    this.seenHashes.add(prompt.hash);
    this.current = prompt;
    this.count++;
    this.palette = paletteForTemplate(prompt.templateId);
    this.store.save(prompt).catch(() => {});

    this.history.unshift({ hash: prompt.hash, templateId: prompt.templateId, favorited: prompt.favorited });
    if (this.history.length > MAX_HISTORY) this.history.length = MAX_HISTORY;

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

    configureScene(this.scene, this.visualState, prompt.templateId);

    const p = this.palette;
    this.scene.styles = [p.bright, p.primary, p.dim, p.borderDim];

    this.buildGeometry(prompt.templateId);
    this.lastTemplateId = prompt.templateId;
    this.renderUI();
  }

  private onResize(): void {
    if (this.resizeTimeout !== null) clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(() => {
      if (!this.canvas || !this.canvasRenderer || !this.rasterizer) return;
      const { cols, rows } = CanvasRenderer.fitToContainer(this.canvas);
      this.canvasRenderer.resize(cols, rows);
      this.rasterizer.resize(cols, rows);
    }, 150);
  }

  private renderUI(): void {
    const prompt = this.current;
    if (!prompt || !this.palette) return;
    const palette = this.palette;

    if (this.promptEl) {
      runGlitchDecode(this.promptEl, prompt.positive, palette, (t) => this.highlightText(t, prompt));
    }

    if (this.negativeEl) {
      this.negativeEl.textContent = prompt.negative;
      this.negativeEl.style.borderColor = palette.negativeBorder;
      this.negativeEl.style.color = palette.negative;
    }

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
    }
  }

  private renderHistory(): void {
    if (!this.historyListEl) return;
    this.historyListEl.innerHTML = this.history.map((entry) => {
      const star = entry.favorited ? '<span class="star">★</span>' : '';
      const tmpl = entry.templateId.replace(/_/g, ' ');
      return `<div class="history-entry">${star}0x${esc(entry.hash)}<span class="template-label">${esc(tmpl)}</span></div>`;
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
      const color = CATEGORY_COLORS[category] ?? '#cccccc';
      for (const word of words) {
        const escaped = esc(word);
        html = html.replace(escaped, `<span style="color:${color};font-weight:bold">${escaped}</span>`);
      }
    }
    return html;
  }

  private renderComponentsTable(prompt: GeneratedPrompt): string {
    return Object.entries(prompt.components)
      .map(([cat, words]) => {
        const color = CATEGORY_COLORS[cat] ?? '#cccccc';
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
    return `<span style="color:var(--ap-bright,#0f0)">${bar}</span>  ` +
      `<span style="color:var(--ap-primary,#00ff41)">#${this.count.toLocaleString()}</span>` +
      `  of  ~${total.toExponential(1)}  ` +
      `<span style="color:var(--ap-dim,#050)">${pct.toFixed(pct < 0.001 ? 6 : 3)}%</span>  ` +
      `<span style="color:var(--ap-accent,#0ff)">[${esc(filter)}]</span>${auto}`;
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;
    switch (e.key) {
      case ' ': case 'Enter':
        e.preventDefault(); this.generate(); break;
      case 't': case 'T': this.cycleTemplate(); break;
      case 'f': case 'F': this.toggleFavorite(); break;
      case 'a': case 'A': this.toggleAuto(); break;
      case 'c': case 'C':
        if (this.current) navigator.clipboard.writeText(this.current.positive).catch(() => {});
        break;
      case 'n': case 'N':
        if (this.current) navigator.clipboard.writeText(this.current.negative).catch(() => {});
        break;
    }
  }

  private cycleTemplate(): void {
    const ids = this.engine.templateIds;
    this.templateIdx++;
    if (this.templateIdx >= ids.length) { this.templateIdx = -1; this.templateFilter = null; }
    else this.templateFilter = ids[this.templateIdx];
    this.renderUI();
  }

  private toggleFavorite(): void {
    if (this.current) {
      this.current.favorited = !this.current.favorited;
      this.store.toggleFavorite(this.current.hash).catch(() => {});
      const entry = this.history.find(h => h.hash === this.current!.hash);
      if (entry) entry.favorited = this.current.favorited;
      this.renderUI();
    }
  }

  private toggleAuto(): void {
    if (this.autoTimer !== null) { clearInterval(this.autoTimer); this.autoTimer = null; }
    else this.autoTimer = window.setInterval(() => this.generate(), 2000);
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
