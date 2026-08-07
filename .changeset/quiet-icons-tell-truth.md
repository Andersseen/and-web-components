---
'@andersseen/icon': patch
---

Fix ten icons that drew the wrong thing, and add content tests that would have
caught them.

`image` was `export const IMAGE = LAYOUT` — an alias, so
`<and-icon name="image">` painted a layout. It is now the Lucide picture frame.
Nine more icons shipped with shapes missing, each still valid markup and
therefore invisible to the registration tests: `layout` and `layers` were a bare
rectangle and a single layer, `settings` a gear with no centre, `home` a house
with no door, `bell` had no clapper, `box` was a hollow hexagon, `file-text` a
blank page, `toggle-left` a pill with no knob, and `accessibility` drew two bars
clipped at the bottom edge of the viewBox instead of a figure. `gallery` (which
was itself a copy of Lucide's `image`) is now Lucide's `gallery-thumbnails`, so
it no longer collides with the fixed `image`.

`src/__tests__/icon-content.test.ts` now checks every entry of `ALL_ICONS`:
parses to at least one shape, uses only allowed shape elements, stays inside the
0–24 viewBox, hardcodes no `fill`/`stroke`/`stroke-width`, is not a duplicate of
another icon, and matches a checked-in snapshot of its shape signature so a
vanishing `<path>` shows up in review. The README documents the drawing
convention (Lucide base, 24×24, stroke-only, complete drawing, no aliases).
