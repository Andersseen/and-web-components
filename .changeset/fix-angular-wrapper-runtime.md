---
'@andersseen/angular-components': patch
'@andersseen/web-components': patch
---

Fix Angular wrapper runtime injection error (NG0203)

- Set `preserveSymlinks: false` in `apps/angular-workspace/angular.json` so pnpm
  workspace symlinks resolve correctly and avoid duplicate `@angular/core`
  instances at runtime.
- Mark `@andersseen/angular-components` as `sideEffects: true` to prevent
  bundlers from tree-shaking the custom-element registration side effects of the
  generated wrappers.
- Update `@stencil/angular-output-target` to `^1.4.0`.
