import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const version = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')).version;

export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === 'joomla-field-fancy-select' } } }), {
    name: 'clean-visual-runtime', apply: 'build',
    buildStart() {
      const directory = new URL('./package/component/media/js/', import.meta.url);
      for (const name of readdirSync(directory)) {
        if (/^visual-runtime(?:-[\w-]+)?\.js$/.test(name)) unlinkSync(fileURLToPath(new URL(name, directory)));
      }
    },
  }, {
    name: 'version-browser-assets', apply: 'build',
    buildStart() {
      const path = new URL('./package/component/media/joomla.asset.json', import.meta.url);
      const registry = JSON.parse(readFileSync(path, 'utf8'));
      registry.version = version;
      registry.assets.forEach(asset => { asset.version = version; });
      writeFileSync(path, JSON.stringify(registry, null, 2) + '\n');
    },
    renderChunk(code) {
      const imports = this.parse(code).body.filter(node => node.source && /^\.\.?\//.test(node.source.value) && node.source.value.endsWith('.js'));
      let result = code;
      for (const node of imports.sort((a, b) => b.source.start - a.source.start)) {
        result = result.slice(0, node.source.start) + JSON.stringify(`${node.source.value}?v=${version}`) + result.slice(node.source.end);
      }
      return result === code ? null : { code: result, map: null };
    },
  }],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
  },
  build: {
    outDir: 'package/component/media/js',
    emptyOutDir: false,
    lib: {
      entry: { smartbrowser: 'resources/js/main.js', 'visual-settings': 'resources/js/visual-settings.js', collection: 'resources/js/collection.js', 'picker-size': 'resources/js/picker-size.js', 'selection-field': 'resources/js/selection-field.js', 'article-edit-links': 'resources/js/article-edit-links.js', 'article-media': 'resources/js/article-media.js', 'image-selectors': 'resources/js/image-selectors.js' },
      formats: ['es'],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: '[name].[ext]',
        chunkFileNames: 'visual-runtime-[hash].js',
      },
    },
  },
});
