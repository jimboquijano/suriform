// vite.config.rules.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { minify } from 'terser'

// Minify plugin
function minifyBundles() {
  return {
    name: 'minifyBundles',
    async generateBundle(_, bundle) {
      for (const key in bundle) {
        if (bundle[key].type === 'chunk' && key.endsWith('.js')) {
          const minified = await minify(bundle[key].code, {
            sourceMap: false,
            format: { comments: 'all' } // preserve JSDoc/comments
          })
          bundle[key].code = minified.code
        }
      }
    }
  }
}

export default defineConfig({
  plugins: [minifyBundles()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/rules/index.js'),
      name: 'suriformRules',
      formats: ['umd', 'es'],
      fileName: (format) => `suriform-rules.${format}.js`
    },
    rollupOptions: {
      // Mark core/rules.js as external so it is not bundled again
      external: ['../core/rules.js']
    },
    outDir: 'dist',
    emptyOutDir: false
  }
})
