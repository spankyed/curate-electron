/* eslint-disable @typescript-eslint/no-unused-vars */
import { resolve } from 'node:path'
import { defineConfig, externalizeDepsPlugin, loadEnv } from 'electron-vite'
import react from '@vitejs/plugin-react'
// import postcss from 'rollup-plugin-postcss';
import tailwindcss from 'tailwindcss'

export default defineConfig(({ command, mode }) => {
  loadEnv(mode, process.cwd(), '') // This loads all env variables, not just prefixed ones

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      resolve: {
        alias: {
          // '~': resolve(__dirname, './src/renderer/src'),
          // '~': resolve('src/renderer/src'),
          '@config': resolve('./config.ts'),
          // '~': resolve('src/renderer/src')
          '@services': resolve('src/services/src')
        }
      },
      build: {
        rollupOptions: {
          input: resolve(__dirname, 'src/electron/main/index.ts')
        }
      },
      publicDir: resolve(__dirname, 'resources')
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      build: {
        rollupOptions: {
          input: resolve(__dirname, 'src/electron/preload/index.ts')
        }
      }
    },
    renderer: {
      resolve: {
        alias: {
          '@config': resolve('./config.ts'),
          '@renderer': resolve('src/renderer')
        }
      },
      plugins: [react()],
      build: {
        assetsInlineLimit: 1
      },
      css: {
        postcss: {
          plugins: [tailwindcss()]
        }
      }
    }
  }
})
