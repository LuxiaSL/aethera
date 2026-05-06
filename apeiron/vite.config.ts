import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../aethera/static/apeiron'),
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/main.ts'),
      output: {
        entryFileNames: 'apeiron.js',
        format: 'iife',
      },
    },
    sourcemap: true,
  },
});
