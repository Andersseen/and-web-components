---
'@andersseen/icon': minor
'@andersseen/web-components': patch
---

`@andersseen/icon`: add a CSS-only way to use the icon catalog with zero
JavaScript — the `and-icon="<name>"` HTML attribute, styled via
`background-color: currentColor` + `mask-image`/`-webkit-mask-image` data URIs.
Import `@andersseen/icon/icons.css` (npm) or load it from jsDelivr/unpkg (CDN),
then write `<span and-icon="home" aria-hidden="true"></span>` — no Custom
Element registration required. The stylesheet is generated from the same
`ALL_ICONS` source the existing registry/`<and-icon>` API reads, via the newly
exported `generateIconsCss()` (`@andersseen/icon/generate-css`), which also
accepts a custom icon map for generating a smaller subset stylesheet. A new
side-effectful `@andersseen/icon/browser` entrypoint (`registerAllIcons()` on
import, never pulled in by the main entry) makes `<and-icon>` usable from a CDN
`<script type="module">` tag with no bundler. `registerIcons()` now documents
its trusted-SVG contract and warns once per name in development for markup
outside the stroke-icon contract (disallowed elements, event-handler attributes,
`javascript:` URIs) — a lint-level signal, not a sanitizer; it never rejects or
mutates registered content. The existing `<and-icon>` / `registerIcons()` /
`registerAllIcons()` API is unchanged and fully compatible.

`@andersseen/web-components`: `<and-icon>` no longer sets a redundant
`role="img"` alongside `aria-hidden="true"` — since the icon is always
`aria-hidden`, it was removed from the accessibility tree regardless of role, so
the two attributes were contradictory. Icons remain purely decorative; the
accessible name still belongs to the surrounding control or text.
