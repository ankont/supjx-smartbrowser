import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [vue({ template: { compilerOptions: { isCustomElement: (tag) => tag === 'joomla-field-fancy-select' } } }), {
    name: 'clean-visual-runtime', apply: 'build',
    buildStart() {
      const directory = new URL('./package/component/media/js/', import.meta.url);
      for (const name of readdirSync(directory)) {
        if (/^visual-runtime(?:-[\w-]+)?\.js$/.test(name)) unlinkSync(fileURLToPath(new URL(name, directory)));
      }
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
      entry: { smartbrowser: 'resources/js/main.js', 'visual-settings': 'resources/js/visual-settings.js', collection: 'resources/js/collection.js', 'picker-size': 'resources/js/picker-size.js', 'selection-field': 'resources/js/selection-field.js' },
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
