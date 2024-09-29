import postcss from 'postcss';
import { defineConfig } from 'vite';
import path from 'node:path';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
  build: {
    outDir: 'release/app/dist', // Replace 'dist' with your desired output directory
    // rollupOptions: {
    //   input: {
    //     main_window: path.join(__dirname, 'src/client/index.html'),
    //   },
    // },
  },
});
