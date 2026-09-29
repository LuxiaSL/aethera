import { resolve } from 'path';
import { defineConfig } from 'vite';

/**
 * oikos builds straight into the blog's static tree, like syrinx and apeiron.
 * The Docker image never runs npm, so the bundle in git *is* what deploys:
 * rebuild and commit whenever src/ changes.
 *
 * There is no standalone dev page. The room is made of the site's own live
 * endpoints (chronicle, dream status, the irc broadcast, a syrinx save), so it
 * is developed against the real server: `npm run watch` beside
 * `uv run python -m aethera.main`, then open /oikos.
 */
export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../aethera/static/oikos'),
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.ts'),
      output: {
        entryFileNames: 'oikos.js',
        assetFileNames: 'oikos.[ext]',
        format: 'iife',
      },
    },
    // a real oikos.css to <link>, so the boot screen is styled before the JS parses
    cssCodeSplit: false,
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
});
