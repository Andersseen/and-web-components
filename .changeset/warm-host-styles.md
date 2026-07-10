---
'@andersseen/web-components': minor
---

Publish host utility styles in the global stylesheet and expose the stable
`@andersseen/web-components/style.css` import path, removing the need for
consumer Tailwind `@source` configuration. Add short `/colors` subpath imports
for selecting any bundled color theme. Add namespaced `and-color`, `and-theme`,
and `and-mode` document attributes while retaining the previous `data-*`
selectors as deprecated compatibility aliases. Fix the published lazy and
CommonJS loader entrypoints, remove stale source backup code, and add coverage
for navbar, select, and sidebar. Clean up obsolete type escapes in the Stencil
adapter layer.
