import { defineConfig } from 'vite';
import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss'
import { resolve } from 'node:path';
import path from 'node:path';

export default defineConfig({
  // plugins: [
  //   postcss({
  //     include: '**/*.css',
  //   }),
  // ],
  build: {
    outDir: 'release/app/dist/renderer/',
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
});