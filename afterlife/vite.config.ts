import { resolve } from 'path';
import { build as esbuild } from 'esbuild';
import { defineConfig, type Plugin } from 'vite';

/**
 * afterlife builds straight into the blog's static tree, like syrinx, apeiron
 * and oikos. The Docker image never runs npm, so the bundle in git *is* what
 * deploys: rebuild and commit whenever src/ changes.
 *
 * `npm run dev` serves the standalone index.html (the universe persists in
 * that origin's localStorage, not the site's).
 */

/**
 * The music runs in an AudioWorklet, which has to be its own module. Rather
 * than ship a second file (and teach an iife build about import.meta.url),
 * the worklet is bundled here by esbuild — vite's own — and imported as a
 * string; audio.ts loads it from a blob: URL.
 */
function workletInline(): Plugin {
  const id = 'virtual:afterlife-worklet';
  return {
    name: 'afterlife-worklet',
    resolveId: (source) => (source === id ? `\0${id}` : null),
    async load(loaded) {
      if (loaded !== `\0${id}`) return null;
      const entry = resolve(__dirname, 'src/music/worklet.ts');
      const out = await esbuild({ entryPoints: [entry], bundle: true, write: false, format: 'iife', minify: true, target: 'es2022' });
      this.addWatchFile(entry);
      this.addWatchFile(resolve(__dirname, 'src/music/engine.ts'));
      return `export default ${JSON.stringify(out.outputFiles[0]?.text ?? '')};`;
    },
  };
}

export default defineConfig({
  plugins: [workletInline()],
  server: { port: 5198, strictPort: true },
  build: {
    outDir: resolve(__dirname, '../aethera/static/afterlife'),
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.ts'),
      output: {
        entryFileNames: 'afterlife.js',
        assetFileNames: 'afterlife.[ext]',
        format: 'iife',
      },
    },
    // a real afterlife.css to <link>, so the splash is styled before the JS parses
    cssCodeSplit: false,
    sourcemap: false,
  },
});
