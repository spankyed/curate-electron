/* eslint-disable @typescript-eslint/no-unused-vars */
import { resolve } from 'node:path';
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite';
import react from '@vitejs/plugin-react';
// import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss';

export default defineConfig(({ command, mode }) => {
  if (mode === 'development') {
    loadEnv(mode, process.cwd(), ''); // This loads all env variables, not just prefixed ones
  }

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      resolve: {
        alias: {
          '@main': resolve('src/electron/main'),
          '@services': resolve('src/services'),
        },
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, 'src/electron/main/index.ts'),
            'ranking-process': resolve(__dirname, 'src/services/worker/scrape/ranking-process.ts'),
            'query-process': resolve(__dirname, 'src/services/worker/scrape/query-process.ts'),
          },
        },
      },
      publicDir: resolve(__dirname, 'src/electron/resources'),
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      build: {
        rollupOptions: {
          input: resolve(__dirname, 'src/electron/preload/index.ts'),
        },
      },
    },
    renderer: {
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer'),
        },
      },
      plugins: [react()],
      build: {
        assetsInlineLimit: 1,
      },
      css: {
        postcss: {
          plugins: [tailwindcss()],
        },
      },
    },
    // clearScreen: false,
  };
});
