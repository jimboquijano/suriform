// vite.config.core.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { minify } from 'terser'
import fs from 'fs'
import path from 'path'
import CleanCSS from 'clean-css'

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

// Copy & minify CSS plugin
function minifyCss() {
  return {
    name: 'minifyCss',
    writeBundle() {
      const src = path.resolve(__dirname, 'src/styles/suriform.css')
      const dest = path.resolve(__dirname, 'dist/suriform.css')
      const css = fs.readFileSync(src, 'utf8')
      const output = new CleanCSS().minify(css)
      if (output.errors && output.errors.length) {
        throw new Error(`CSS minify errors: ${output.errors.join(', ')}`)
      }
      fs.writeFileSync(dest, output.styles, 'utf8')
    }
  }
}

export default defineConfig({
  plugins: [minifyBundles(), minifyCss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/suriform.js'),
      name: 'suriform',
      formats: ['umd', 'es'],
      fileName: (format) => `suriform.${format}.js`
    },
    outDir: 'dist',
    emptyOutDir: true
  }
})
