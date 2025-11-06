// Polyfill CSS.escape for JSDOM / Vitest
if (!global.CSS) global.CSS = {}

if (!global.CSS.escape) {
  global.CSS.escape = (str) => str.replace(/[^a-zA-Z0-9-_]/g, '\\$&')
}
