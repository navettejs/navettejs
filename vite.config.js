import path from 'node:path'
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts'
import cp from 'vite-plugin-cp';

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.js'),
      name: 'navette',
      fileName: (format) => `navette.${format}.js`
    }
  },
  plugins: [
    dts({
      rollupTypes: true
    }),
    cp({
      targets: [
        {
          // Copy and clean package.json
          src: './package.json',
          dest: './dist',
          transform(buf) {
            const pkg = JSON.parse(buf.toString());

            delete pkg['scripts'];
            delete pkg['devDependencies'];
            delete pkg['packageManager'];

            return JSON.stringify({
              ...pkg,
              private: false
            }, null, 2)
              // Replace all relative path to ./dist with ./
              .replace(/"\.\/dist\//g, '"./');
          }
        }
      ]
    })
  ]
});