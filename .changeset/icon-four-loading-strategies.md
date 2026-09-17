---
'@andersseen/icon': minor
---

Add three more opt-in CSS-only `and-icon="<name>"` loading strategies, alongside
the existing full `icons.css` — all reading the same `ALL_ICONS` source, all
built on the same refactored `generate-css.ts` primitives
(`generateIconsBaseCss()`, `generateIconCss(name, svg)`, with the public
`generateIconsCss()` now composed from them and unchanged in output):

- **Selective per-icon CSS** — `@andersseen/icon/base.css` (the shared
  `[and-icon] { ... }` rule alone) and `@andersseen/icon/icons/<name>.css` (one
  file per catalog entry, each with just that icon's `mask-image` rule). Import
  only the icons you need:
  `@import '@andersseen/icon/base.css'; @import '@andersseen/icon/icons/home.css';`.
- **Build-time scanner** — a new `and-icons` CLI (`bin`, ships with this
  package) that scans `.html`/`.htm`/`.astro`/`.ts`/`.tsx`/`.jsx`/`.vue`/
  `.svelte` source for static `and-icon="<name>"` literals and writes one CSS
  file containing exactly the base rule plus the icons actually used —
  `pnpm exec and-icons scan --out ./and-icons.generated.css`. Supports an
  `and-icons.config.mjs` (`safelist`/`include`/`exclude`/`outFile`) for names
  that can't be resolved statically, and fails with a non-zero exit + a per-file
  report when a static/safelisted name isn't a real icon, instead of emitting a
  silent empty mask. Also exported as a Node-only programmatic API,
  `@andersseen/icon/build` (`scanIcons`, `buildIconsCss`).
- **Runtime lazy loading** — `@andersseen/icon/lazy`'s `initLazyIcons()`. Opt-in
  only (importing the module does nothing): it scans the DOM for `[and-icon]`
  elements, then watches for new ones and attribute changes via
  `MutationObserver`, loading each icon's `icons/<name>.css` over the network
  exactly once (deduplicated). The shared base rule is injected inline once;
  `icons.css`/the full catalog is never fetched, and `dist/lazy.js` never
  contains any SVG data. Returns a `cleanup()` function.

`<and-icon>`, `registerIcons()`/`registerAllIcons()`/`getIcon()`, the CSS-only
`icons.css` full stylesheet, and `@andersseen/icon/browser` are all unchanged.
