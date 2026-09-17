# @andersseen/icon

Tree-shakeable SVG icon library: 86 icons as plain string constants, plus a tiny
global registry that `<and-icon>` (from `@andersseen/web-components`) and
`@andersseen/vanilla-components` read from. Framework-agnostic — usable without
any other Andersseen package.

> Part of the Andersseen **product core** — usable entirely on its own to
> register your own icon set under `and-icon`-compatible names, even outside
> this component ecosystem.

One package, one icon source (`ALL_ICONS`), four ways to load the CSS-only
`and-icon="name"` attribute's mask CSS — plus the **registry + `<and-icon>`**
Web Component, which is unaffected by any of them.

## Choose your loading strategy

| Strategy                                      | Runtime JS | Payload             | Best for                              |
| --------------------------------------------- | ---------- | ------------------- | ------------------------------------- |
| [Full CSS](#css-only-usage-no-javascript)     | 0          | all icons           | prototypes, docs, simple CDN usage    |
| [Selective CSS](#selective-per-icon-css)      | 0          | manually selected   | you know exactly which few icons      |
| [Build-time scanner](#build-time-scanner)     | 0          | icons actually used | production apps with a build step     |
| [Runtime lazy loading](#runtime-lazy-loading) | small      | icons on demand     | dynamic/CMS content, unknown at build |

None of these is universally better — pick per app, and it's fine to mix them
(e.g. selective CSS for a marketing page, the scanner for the main app). All
four render the exact same `and-icon="name"` markup and read the same
`ALL_ICONS` source — nothing is hand-duplicated between them.

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

## Selective per-icon CSS

For when you know exactly which few icons you need and don't want the full
catalog. `dist/base.css` has only the shared `[and-icon] { ... }` rule (sizing,
`currentColor`, mask geometry); `dist/icons/<name>.css` has only that one icon's
`mask-image` rule. Both are generated from the same `ALL_ICONS` map and the same
generator as `icons.css` — `base.css` + every `icons/<name>.css` you import,
concatenated, is byte-identical to the matching subset of `icons.css`.

```css
@import '@andersseen/icon/base.css';
@import '@andersseen/icon/icons/home.css';
@import '@andersseen/icon/icons/search.css';
```

```html
<span and-icon="home" aria-hidden="true"></span>
<span and-icon="search" aria-hidden="true"></span>
```

Only those two icons' CSS ships — no `and-icon="star"` markup would render
anything, since `star.css` was never imported.

**CDN**, zero JavaScript:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@andersseen/icon@<version>/dist/base.css"
/>
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@andersseen/icon@<version>/dist/icons/home.css"
/>
<!-- or the equivalent unpkg.com/@andersseen/icon@<version>/dist/... paths -->
```

## Build-time scanner

Recommended for **production apps with a build step** — zero runtime JS, and you
don't have to hand-pick icon names. The `and-icons` CLI (ships with this
package, no separate install) scans your source for static `and-icon="<name>"`
literals and generates one CSS file containing exactly the base rule plus the
icons actually used — via the same `generateIconsCss()` selective-CSS generator
above, not a separate implementation.

```bash
pnpm exec and-icons scan --out ./src/and-icons.generated.css
# or: npx and-icons scan --out ./src/and-icons.generated.css
```

```css
@import './and-icons.generated.css';
```

**What it detects:** static string literals across `.html`, `.htm`, `.astro`,
`.ts`, `.tsx`, `.jsx`, `.vue`, and `.svelte` files —
`and-icon="home"`/`and-icon='home'`. It's deliberately a simple, robust textual
scanner, not a framework parser (no Babel/TS-compiler-API/Vue/Astro AST).
Ignores `node_modules`, `dist`, `build`, `coverage`, `.git`, `.angular`,
`.next`, `.nuxt` by default.

**What it can't detect — dynamic values:**

```html
<span [attr.and-icon]="icon"></span>
<!-- Angular binding -->
<span and-icon="{icon}" />
<!-- JSX expression -->
<span :and-icon="icon"></span>
<!-- Vue binding -->
```

For those, list the possible names in a config file:

```js
// and-icons.config.mjs
export default {
  safelist: ['home', 'search', 'user', 'settings'],
  // include: ['src'],      // root-relative dirs to scan (default: the whole cwd)
  // exclude: ['fixtures'], // extra dirs to ignore, merged with the defaults above
  // outFile: './src/and-icons.generated.css',
};
```

```bash
and-icons scan   # reads ./and-icons.config.mjs automatically, --out/--config override it
```

**Unknown icons fail the build**, on purpose — a static `and-icon="homme"`
(typo) or a safelisted name that isn't real is reported with its file and the
CLI exits non-zero, rather than silently generating an empty mask:

```text
Unknown icon "homme"
  src/components/header.html
```

Scanning and generation are also available as a programmatic, Node-only API
(never imported by the main entry):

```ts
import { scanIcons, buildIconsCss } from '@andersseen/icon/build';

const result = buildIconsCss({ safelist: ['home'], outFile: './out.css' });
console.log(result.icons); // every icon name that ended up in out.css
```

## Runtime lazy loading

For **dynamic runtime content** where the icon names aren't knowable at build
time — CMS-driven markup, HTML injected by a third party, a highly dynamic CDN
page. Opt-in only; importing the module does nothing by itself.

```ts
import { initLazyIcons } from '@andersseen/icon/lazy';

const cleanup = initLazyIcons();
// later, if needed: cleanup();
```

```html
<span and-icon="home" aria-hidden="true"></span>
```

`initLazyIcons()` scans the DOM for existing `[and-icon]` elements, then watches
for new ones and for the attribute changing (via `MutationObserver`), loading
each icon's `icons/<name>.css` over the network exactly once — deduplicated, no
re-fetch for an icon already loaded. The shared base rule is injected once as an
inline `<style>`, never fetched as `icons.css`/`base.css` over the network.
`dist/lazy.js` itself never contains any SVG data — it only ever loads the
small, already-generated `icons/<name>.css` files.

**CDN**, no bundler, URLs resolve automatically relative to the script itself:

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@andersseen/icon@<version>/dist/lazy.js"
></script>
<script type="module">
  import { initLazyIcons } from 'https://cdn.jsdelivr.net/npm/@andersseen/icon@<version>/dist/lazy.js';
  initLazyIcons();
</script>
```

**Bundled apps:** after bundling, `import.meta.url` is not guaranteed to still
point at this package's own `dist/` inside `node_modules` — pass an explicit
`baseUrl` (a path your build copies `dist/icons/` to) or a full
`resolveIconUrl(name)` resolver:

```ts
initLazyIcons({ baseUrl: '/assets/and-icons/' });
// or:
initLazyIcons({ resolveIconUrl: name => `/icons/${name}.css` });
```

For a bundled app, prefer the [build-time scanner](#build-time-scanner) over
lazy loading when the icon set is knowable at build time — zero runtime JS and
no URL-resolution configuration needed.

`initLazyIcons()` validates every `and-icon` value against the same
lowercase-kebab-case contract every bundled icon name follows before ever
building a URL from it, so a value like `and-icon="../../etc/passwd"` is
rejected outright rather than used to construct a request. A failed stylesheet
load doesn't crash the app or retry — it logs one development warning per icon
name (override with `onError`).

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
