# @andersseen/icon

Tree-shakeable SVG icon library: 86 icons as plain string constants, plus a tiny
global registry that `<and-icon>` (from `@andersseen/web-components`) and
`@andersseen/vanilla-components` read from. Framework-agnostic — usable without
any other Andersseen package.

> Part of the Andersseen **product core** — usable entirely on its own to
> register your own icon set under `and-icon`-compatible names, even outside
> this component ecosystem.

Two ways to consume it: a **CSS-only `and-icon="name"` attribute** (zero
JavaScript) and the **registry + `<and-icon>`** Web Component. Both read the
same `ALL_ICONS` source.

## Installation

```bash
pnpm add @andersseen/icon
```

## CSS-only usage (no JavaScript)

```css
@import '@andersseen/icon/icons.css';
```

```html
<span and-icon="home" aria-hidden="true"></span>
<i and-icon="search" aria-hidden="true"></i>
<div and-icon="close" aria-hidden="true"></div>
```

The API is the `and-icon` attribute, not a specific element — `<span>` is the
recommended host (no default semantics), but any element works. Sizing and color
are plain CSS (`font-size` controls the `1em` box, `color` controls the
`currentColor` fill via `mask-image`) — there's no `and-icon-size`/
`and-icon-color` attribute, standard CSS already covers it.

`icons.css` is generated from `ALL_ICONS` by `generateIconsCss()` — no
hand-maintained duplicate. Same function generates a smaller stylesheet for a
subset of icons:

```ts
import { generateIconsCss } from '@andersseen/icon/generate-css';
import { HOME, SEARCH } from '@andersseen/icon';
import { writeFileSync } from 'node:fs';

writeFileSync('subset.css', generateIconsCss({ home: HOME, search: SEARCH }));
```

**Limitations:** monochromatic, `currentColor`-inheriting icons only (this
catalog is Lucide-style stroke icons) — no multicolor/gradient artwork, no
runtime stroke-width, no per-path animation. Use `<and-icon>` for those.

**CDN** (jsDelivr / unpkg), zero JavaScript:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@andersseen/icon@<version>/dist/icons.css"
/>
<!-- or: https://unpkg.com/@andersseen/icon@<version>/dist/icons.css -->

<span and-icon="home" aria-hidden="true"></span>
```

**Accessibility:** icons are decorative by default — pair with
`aria-hidden="true"` and put the accessible name on the surrounding control
(e.g. `aria-label` on a button), never on the icon itself.

## Registry + `<and-icon>` usage

### Tree-shakeable (recommended)

Import and register only the icons you actually use:

```ts
import { registerIcons, CLOSE, CHEVRON_DOWN, HOME } from '@andersseen/icon';

registerIcons({ 'close': CLOSE, 'chevron-down': CHEVRON_DOWN, 'home': HOME });
```

Every icon is also exported as a bare string constant (`CLOSE`, `CHEVRON_DOWN`,
`ARROW_UP`, …) if you want to render it yourself without going through the
registry at all — the export name is the icon's `UPPER_SNAKE_CASE` form; the
registry key is the same name in `kebab-case`.

### Everything at once (demos only)

```ts
import { registerAllIcons } from '@andersseen/icon';

registerAllIcons();
```

`registerAllIcons()` bundles all 86 icons — fine for a demo/dev app, but it
defeats tree-shaking in a production bundle. Prefer `registerIcons()` with an
explicit map.

### The set `@andersseen/web-components` needs

If you're using `and-icon` from `@andersseen/web-components`, register at least
`COMPONENT_ICONS` — the curated subset its built-in components reference (close
buttons, chevrons, carousel arrows, etc.):

```ts
import { registerIcons, COMPONENT_ICONS } from '@andersseen/icon';

registerIcons(COMPONENT_ICONS);
```

### Consuming from `<and-icon>`

Once registered, reference an icon by its registry name:

```html
<and-icon name="close"></and-icon> <and-icon name="chevron-down"></and-icon>
```

## Registry API

| Function                   | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `registerIcons(icons)`     | Register a `Record<name, svgInnerMarkup>` map.           |
| `registerAllIcons()`       | Register all 86 bundled icons. Demo/dev use only.        |
| `getIcon(name)`            | Returns the registered SVG inner markup, or `undefined`. |
| `hasIcon(name)`            | `boolean` — is this name registered?                     |
| `getRegisteredIconNames()` | `string[]` of every currently registered name.           |
| `getRegisteredIconCount()` | Number of currently registered icons.                    |

The registry is a single `Map` on `globalThis` (or `window`, when present), so
it's shared across every consumer on the page regardless of which bundle
registered a given icon first.

**Trust contract:** `registerIcons()` content is inserted via `innerHTML` by
`<and-icon>` — only register SVG markup you trust, never unsanitized
user-generated or third-party content. In development, markup outside the
stroke-icon contract below (a disallowed element, an event-handler attribute, a
`javascript:` URI) triggers a one-time `console.warn` per name — a lint-level
signal, not a sanitizer; it never rejects or mutates what gets registered.

## Design

- Every icon is a plain string of inner SVG markup (`<path>`/`<g>` elements, no
  wrapping `<svg>`) using `currentColor`-free, theme-agnostic strokes — the
  consuming `<and-icon>`/`<svg>` wrapper controls sizing and color.
- `ALL_ICONS` (the full map) and `COMPONENT_ICONS` (the subset used by
  `@andersseen/web-components`) are both exported for cases where you need the
  whole set or just the built-in-component set, respectively.

## Icon conventions

Every icon in this package follows the same drawing contract. The wrapper that
renders it (`<and-icon>`, see
`packages/web-components/src/components/and-icon/and-icon.tsx`) supplies:

```html
<svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- the icon string goes here, verbatim -->
</svg>
```

So a contributed icon must:

1. **Be based on [Lucide](https://lucide.dev)** (ISC), or drawn to match its
   style. Copy the icon's inner markup, not the whole `<svg>`.
2. **Fit a 24×24 grid.** No coordinate may fall outside `0`–`24`; anything
   beyond it is clipped, and a shape that ends exactly on the edge loses half
   its stroke.
3. **Be stroke-only.** Never set `fill`, `stroke`, `stroke-width` or `style` on
   a shape — that overrides `currentColor` and breaks theming. Icons designed
   for solid fill render as the outline of their silhouette here, so they don't
   belong in this set.
4. **Use only** `path`, `circle`, `rect`, `line`, `polyline`, `polygon`,
   `ellipse` and `g`.
5. **Be the complete drawing.** This is the one the tests can't fully prove for
   you: `lock` shipped without its shackle and `user` without its head because
   each was a single `<path>` that parsed fine. When you copy an icon, copy
   _every_ shape in it, then look at it rendered.
6. **Be its own drawing.** No aliasing another constant
   (`export const IMAGE = LAYOUT` made `<and-icon name="image">` paint a layout
   for an entire release).

`src/__tests__/icon-content.test.ts` enforces 2–4 and 6 for every entry in
`ALL_ICONS`, and snapshots each icon's shape signature so a disappearing
`<path>` shows up as a diff in review.

## Development

```bash
pnpm -C packages/icon-library test    # Vitest
pnpm -C packages/icon-library lint
pnpm -C packages/icon-library build   # ESM + CJS
```

To eyeball the whole set, render every entry of `ALL_ICONS` into the `<svg>`
wrapper above and look at the grid. Tests confirm an icon is _valid markup_;
only your eyes confirm it's the _right drawing_.

## License

MIT
