import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.js'),
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: [
        'css-to-style',
        'dom-parse',
        'prop-types',
        'react',
        'tiny-invariant',
      ],
    },
    sourcemap: true,
  },
  test: {
    setupFiles: ['./vitest.setup.js'],
  },
});
