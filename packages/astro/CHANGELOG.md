# @andersseen/astro

## 0.0.2

### Patch Changes

- Declared `"sideEffects": false`. Without it, bundlers must assume every module
  in the package has side effects and cannot drop unused ones from a consumer's
  build. The integration is pure — it registers nothing at import time — so this
  is safe and restores tree-shaking.

## 0.0.1

Initial release. Astro integration that injects the custom element and icon
registration scripts automatically. Options: `components: 'all' | string[]`,
`icons: boolean`.
