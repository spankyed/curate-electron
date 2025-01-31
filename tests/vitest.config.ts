import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@main': resolve(__dirname, '../src/electron/main'),
      '@services': resolve(__dirname, '../src/services'),
      '@renderer': resolve(__dirname, '../src/renderer'),
    },
  },
});
