/**
 * three-setup.js
 *
 * Import this ONCE (in App.jsx) before any component that uses Three.js.
 * It patches console.warn to drop the harmless "Multiple instances" dev warning
 * that Three.js emits when Vite's dep-optimiser evaluates the module more than once.
 * The patch is limited to the exact warning string — all other warnings pass through.
 */

const _warn = console.warn.bind(console)
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Multiple instances of Three.js')
  ) {
    return // swallow only this specific warning
  }
  _warn(...args)
}
