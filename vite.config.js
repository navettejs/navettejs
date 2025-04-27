import path from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import cp from 'vite-plugin-cp';

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'navette',
      fileName: (format) => `navette.${format}.js`,
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
