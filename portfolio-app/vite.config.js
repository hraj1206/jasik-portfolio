import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite plugin: silences the Three.js "Multiple instances" dev-mode warning.
// Three.js checks window.__THREE__ and warns if it's already set. This happens
// in development because Vite's module pre-bundler evaluates the module during
// dep-scan AND again when the page loads. The plugin injects a tiny script that
// defines window.__THREE__ as a non-writable property before Three.js runs,
// so Three.js skips its own warning branch entirely.
function suppressThreeWarning() {
  return {
    name: 'suppress-three-warning',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'module' },
          children: `
            // Prevent Three.js "Multiple instances" dev warning
            try {
              if (typeof window !== 'undefined' && !window.__THREE__) {
                Object.defineProperty(window, '__THREE__', {
                  get() { return '128'; },
                  set() {},          // swallow writes silently
                  configurable: false,
                });
              }
            } catch(_) {}
          `,
          injectTo: 'head-prepend',
        },
      ]
    },
  }
}

export default defineConfig({
  plugins: [react(), suppressThreeWarning()],
  resolve: {
    // Guarantee a single Three.js module instance across all imports & HMR
    dedupe: ['three'],
  },
  optimizeDeps: {
    include: ['three'],
  },
})
