import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
// import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config
export default defineConfig({
  // plugins: [
  //   postcss({
  //     include: '**/*.css',
  //   }),
  // ],
  // plugins: [
  //   react(),
  // ],
  build: {
    outDir: 'dist/renderer/',
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  }
});