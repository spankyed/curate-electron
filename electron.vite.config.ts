import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
// import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        // '~': resolve(__dirname, './src/renderer/src'),
        // '~': resolve('src/renderer/src'),
        '@config': resolve('./config.ts'),
        // '~': resolve('src/renderer/src')
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react()],
    build: {
      assetsInlineLimit: 1,
    },
    css: {
      postcss: {
        plugins: [tailwindcss()]
      }
    }
  }
})
