---
title: Icon — Overview
description:
  Tree-shakeable SVG icon library with a tiny global registry. Usable
  standalone, without any other Andersseen package.
---

`@andersseen/icon` is a tree-shakeable SVG icon library — 86 icons as plain
string constants, plus a tiny global registry that
[`<and-icon>`](/components/icon/) (from `@andersseen/web-components`) and
`@andersseen/vanilla-components` read from. Framework-agnostic — usable without
any other Andersseen package, even to register your own icon set under
`and-icon`-compatible names.

There are two ways to use the catalog: a **CSS-only attribute API** (no
JavaScript at all) and the **registry + `<and-icon>`** Web Component. Both read
the exact same `ALL_ICONS` source — nothing is hand-duplicated between them.

## Choose your loading strategy

The CSS-only `and-icon="name"` attribute supports four loading strategies, all
in the same package, reading the same `ALL_ICONS` source. None is universally
better — pick per app, and it's fine to mix them.

| Strategy                                      | Runtime JS | Payload             | Best for                              |
| --------------------------------------------- | ---------- | ------------------- | ------------------------------------- |
| [Full CSS](#css-only-usage-no-javascript)     | 0          | all icons           | prototypes, docs, simple CDN usage    |
| [Selective CSS](#selective-per-icon-css)      | 0          | manually selected   | you know exactly which few icons      |
| [Build-time scanner](#build-time-scanner)     | 0          | icons actually used | production apps with a build step     |
| [Runtime lazy loading](#runtime-lazy-loading) | small      | icons on demand     | dynamic/CMS content, unknown at build |

The registry + `<and-icon>` Web Component (further down this page) is unaffected
by any of the four — it always reads from `ALL_ICONS` via `registerIcons()`.

## Install

```bash
pnpm add @andersseen/icon
```

## CSS-only usage (no JavaScript)

```html
<link rel="stylesheet" href="node_modules/@andersseen/icon/dist/icons.css" />

<span and-icon="home" aria-hidden="true"></span>
```

or, with a bundler:

```css
@import '@andersseen/icon/icons.css';
```

```html
<span and-icon="home" aria-hidden="true"></span>
<i and-icon="search" aria-hidden="true"></i>
<div and-icon="close" aria-hidden="true"></div>
```

<div class="and-live-example">
  <span and-icon="home" aria-hidden="true" style="font-size: 20px"></span>
  <span and-icon="chevron-down" aria-hidden="true" style="font-size: 20px"></span>
  <span and-icon="star" aria-hidden="true" style="font-size: 20px"></span>
  <span and-icon="terminal" aria-hidden="true" style="font-size: 20px"></span>
</div>

The API is the **`and-icon` attribute**, not any particular element — `<span>`
is the recommended host since it carries no default semantics, but `<i>` and
`<div>` work identically. Under the hood it's plain CSS `mask-image`:

```css
[and-icon] {
  display: inline-block;
  width: 1em;
  height: 1em;
  background-color: currentColor; /* size and color are standard CSS — font-size and color */
}
```

`icons.css` is **generated** from the same `ALL_ICONS` map the registry reads —
see [`generateIconsCss()`](#generating-a-subset) below for how, and for
generating a smaller stylesheet with only the icons you use.

**Limitations:** this path is for monochromatic icons that inherit
`currentColor` — exactly what this catalog is (Lucide-style stroke icons). It
does not support multicolor/gradient artwork, a runtime-configurable stroke
width, or animating individual paths; use `<and-icon>` (below) for those.

**Accessibility:** icons are decorative by default — always pair the attribute
with `aria-hidden="true"` and put the accessible name on the surrounding
control, exactly like `<and-icon>`:

```html
<button aria-label="Close">
  <span and-icon="close" aria-hidden="true"></span>
</button>
```

### Generating a subset

`generateIconsCss()` is a small Node-only utility (it's what builds the full
`icons.css` you just imported) that also accepts a custom icon map, so you can
ship only the icons your app actually uses:

```ts
import { generateIconsCss } from '@andersseen/icon/generate-css';
import { HOME, SEARCH, CLOSE } from '@andersseen/icon';
import { writeFileSync } from 'node:fs';

writeFileSync(
  'subset-icons.css',
  generateIconsCss({ home: HOME, search: SEARCH, close: CLOSE }),
);
```

### CDN (jsDelivr / unpkg)

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@andersseen/icon@<version>/dist/icons.css"
/>
<!-- or: https://unpkg.com/@andersseen/icon@<version>/dist/icons.css -->

<span and-icon="home" aria-hidden="true"></span>
```

Zero JavaScript — the stylesheet alone is enough.

## Selective per-icon CSS

For when you know exactly which few icons an app needs and don't want the full
catalog. `dist/base.css` has only the shared `[and-icon] { ... }` rule (sizing,
`currentColor`, mask geometry); `dist/icons/<name>.css` has only that one icon's
`mask-image` rule — both generated from the same `ALL_ICONS` map and the same
generator as `icons.css`.

```css
@import '@andersseen/icon/base.css';
@import '@andersseen/icon/icons/home.css';
@import '@andersseen/icon/icons/search.css';
```

```html
<span and-icon="home" aria-hidden="true"></span>
<span and-icon="search" aria-hidden="true"></span>
```

Only those two icons' CSS ships. CDN, zero JavaScript:

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

Recommended for **production apps with a build step** — zero runtime JS, and no
hand-picking icon names. The `and-icons` CLI ships with this package (no
separate install) and scans source files for static `and-icon="<name>"`
literals, generating one CSS file with exactly the base rule plus the icons
actually used — built from the same `generateIconsCss()` generator as the
selective-CSS path above.

```bash
pnpm exec and-icons scan --out ./src/and-icons.generated.css
```

```css
@import './and-icons.generated.css';
```

It scans `.html`, `.htm`, `.astro`, `.ts`, `.tsx`, `.jsx`, `.vue`, and `.svelte`
files, deliberately with a simple textual match rather than a framework parser,
and ignores `node_modules`/`dist`/`build`/`coverage`/`.git`/
`.angular`/`.next`/`.nuxt` by default. It **cannot** resolve a dynamic value —
`[attr.and-icon]="icon"` (Angular), `and-icon={icon}` (JSX), `:and-icon="icon"`
(Vue) are all skipped, since the name can't be known without running the app.
For those, list the possible names in a small config file:

```js
// and-icons.config.mjs
export default {
  safelist: ['home', 'search', 'user', 'settings'],
  // include: ['src'],      // root-relative dirs to scan (default: the whole cwd)
  // exclude: ['fixtures'], // extra dirs to ignore, merged with the built-in defaults
  // outFile: './src/and-icons.generated.css',
};
```

A static usage or safelist entry naming an icon outside `ALL_ICONS` fails the
scan on purpose — reported with its file, non-zero exit — rather than silently
generating an empty mask:

```text
Unknown icon "homme"
  src/components/header.html
```

A Node-only programmatic API is also available, never imported by the main
entry: `import { scanIcons, buildIconsCss } from '@andersseen/icon/build';`.

## Runtime lazy loading

For **dynamic runtime content** where icon names aren't knowable at build time —
CMS-driven markup, third-party-injected HTML, a highly dynamic CDN page. Opt-in
only: importing the module does nothing by itself.

```ts
import { initLazyIcons } from '@andersseen/icon/lazy';

const cleanup = initLazyIcons();
```

```html
<span and-icon="home" aria-hidden="true"></span>
```

`initLazyIcons()` scans existing `[and-icon]` elements, then watches for new
ones and for the attribute changing (`MutationObserver`), loading each icon's
`icons/<name>.css` over the network exactly once — deduplicated, no re-fetch for
an icon already loaded. The base rule is injected once as an inline `<style>`,
never fetched as `icons.css`/`base.css`; `dist/lazy.js` itself never contains
SVG data, only the machinery to load the already-generated `icons/<name>.css`
files.

CDN usage resolves URLs automatically, relative to the script itself:

```html
<script type="module">
  import { initLazyIcons } from 'https://cdn.jsdelivr.net/npm/@andersseen/icon@<version>/dist/lazy.js';
  initLazyIcons();
</script>
```

After bundling, `import.meta.url` is not guaranteed to still point at this
package's `dist/` inside `node_modules` — pass `baseUrl` (a path your build
copies `dist/icons/` to) or a full `resolveIconUrl(name)` resolver:

```ts
initLazyIcons({ baseUrl: '/assets/and-icons/' });
```

For a bundled app where the icon set is knowable at build time, prefer the
[build-time scanner](#build-time-scanner) instead — zero runtime JS, no URL
configuration. Every `and-icon` value is validated against the same
lowercase-kebab-case contract the bundled icon names follow before it's ever
used to build a URL, so `and-icon="../../etc/passwd"` is rejected outright. A
failed stylesheet load doesn't crash the app or retry; it logs one development
warning per icon name (override with `onError`).

## Registry + `<and-icon>` (Web Component)

If you're already using `@andersseen/web-components`, `<and-icon>` renders a
real `<svg>` from the registry instead of a CSS mask — useful when you need
runtime stroke-width, per-instance color props, or plan to layer the icon into a
larger component. It reads the same `ALL_ICONS` catalog as the CSS path above;
register icons first, then reference them by name.

### Tree-shakeable registration (recommended)

Import and register only the icons you actually use:

```ts
import { registerIcons, CLOSE, CHEVRON_DOWN, HOME } from '@andersseen/icon';

registerIcons({ 'close': CLOSE, 'chevron-down': CHEVRON_DOWN, 'home': HOME });
```

Every icon is also exported as a bare string constant, so you can render it
yourself without going through the registry. The two names are mechanically
related: the **export** is `UPPER_SNAKE_CASE` (`CHEVRON_DOWN`), the **registry
key** is the same word in `kebab-case` (`chevron-down`). The
[gallery below](#icon-gallery) lists every registry key.

```ts
import { STAR } from '@andersseen/icon';
// STAR is a plain string of inner SVG markup — drop it into your own <svg>:
myElement.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24"
  fill="none" stroke="currentColor" stroke-width="2">${STAR}</svg>`;
```

### Everything at once (demos only)

```ts
import { registerAllIcons } from '@andersseen/icon';

registerAllIcons();
```

Bundles all 86 icons — fine for a demo/dev app (this docs site uses it), but it
defeats tree-shaking in a production bundle. Prefer `registerIcons()` with an
explicit map, or `COMPONENT_ICONS` (the curated subset
`@andersseen/web-components`'s built-in components reference internally):

```ts
import { registerIcons, COMPONENT_ICONS } from '@andersseen/icon';

registerIcons(COMPONENT_ICONS);
```

`COMPONENT_ICONS` is exactly six entries — the icons the built-in components
need to render their own chrome: `close`, `chevron-down`, `chevron-up`,
`chevron-left`, `chevron-right`, `menu`. Register at least these if you use
`@andersseen/web-components` without registering everything.

### Example

Once registered, reference an icon by its registry name from `<and-icon>`:

<div class="and-live-example">
  <and-icon name="home" size="20"></and-icon>
  <and-icon name="chevron-down" size="20"></and-icon>
  <and-icon name="star" size="20"></and-icon>
  <and-icon name="terminal" size="20"></and-icon>
</div>

```html
<and-icon name="home"></and-icon> <and-icon name="chevron-down"></and-icon>
```

See the [`<and-icon>` component page](/components/icon/) for its full prop
reference (`name`, `size`, `color`, `stroke-width`).

### Icon gallery

Every icon currently registered on this page (all <span id="icon-count">…</span>
of them). Filter by name:

<div class="and-live-example icon-gallery-example">
  <input id="icon-search" class="icon-gallery-search" type="search" placeholder="Filter icons…" autocomplete="off" spellcheck="false" />
  <div id="icon-grid" class="icon-gallery-grid"></div>
  <p id="icon-empty" class="icon-gallery-empty">No icons match that filter.</p>
</div>

<script>
  function buildIconGallery() {
    const registry = window.__AND_ICONS_REGISTRY__;
    const grid = document.getElementById('icon-grid');
    if (!registry || !grid) return;

    const names = [...registry.keys()].sort();
    const countEl = document.getElementById('icon-count');
    if (countEl) countEl.textContent = String(names.length);

    grid.innerHTML = names
      .map(
        n =>
          '<div class="icon-cell" data-name="' + n + '">' +
          '<and-icon name="' + n + '" size="22"></and-icon>' +
          '<span>' + n + '</span></div>',
      )
      .join('');

    const search = document.getElementById('icon-search');
    const empty = document.getElementById('icon-empty');
    const cells = [...grid.querySelectorAll('.icon-cell')];
    search?.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      let shown = 0;
      for (const c of cells) {
        const match = c.dataset.name.includes(q);
        c.style.display = match ? '' : 'none';
        if (match) shown++;
      }
      if (empty) empty.style.display = shown === 0 ? '' : 'none';
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildIconGallery);
  } else {
    buildIconGallery();
  }
</script>

### Registry API

| Function                   | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `registerIcons(icons)`     | Register a `Record<name, svgInnerMarkup>` map.           |
| `registerAllIcons()`       | Register all 86 bundled icons. Demo/dev use only.        |
| `getIcon(name)`            | Returns the registered SVG inner markup, or `undefined`. |
| `hasIcon(name)`            | `boolean` — is this name registered?                     |
| `getRegisteredIconNames()` | `string[]` of every currently registered name.           |
| `getRegisteredIconCount()` | Number of currently registered icons.                    |

Also exported: `ALL_ICONS` (the full `Record<name, svg>` map), `COMPONENT_ICONS`
(the six-icon subset above), and an `IconName` type
(`keyof typeof ALL_ICONS | (string & {})`) — the loose `(string & {})` half lets
you pass a custom registered name while still getting autocomplete for the
built-ins.

The registry is a single `Map` on `globalThis` (or `window`, under
`__AND_ICONS_REGISTRY__`), so it's shared across every consumer on the page
regardless of which bundle registered a given icon first. Registering the same
name again overwrites it — which is how you swap in your own artwork under a
built-in name.

**Trust contract:** `registerIcons()` content is inserted via `innerHTML` by
`<and-icon>` — only register SVG markup you trust, never unsanitized
user-generated or third-party content. In development, markup outside the
stroke-icon contract (a disallowed element, an event-handler attribute, a
`javascript:` URI) triggers a one-time console warning per name — this is a
lint-level signal, not a sanitizer; it never rejects or alters what gets
registered. The CSS-only `and-icon="name"` attribute (above) has a narrower
attack surface for the same reason a `background-image` does: a browser never
executes script/event-handler content inside a `mask-image`.

### Using `<and-icon>` from a CDN (no npm)

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@andersseen/icon@<version>/dist/browser.js"
></script>
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/@andersseen/web-components@<version>/dist/web-components/web-components.esm.js"
></script>

<and-icon name="home"></and-icon>
```

The first script registers the full icon catalog (`@andersseen/icon/browser` — a
side-effectful entrypoint that exists specifically for this, isolated from the
tree-shakeable npm entry). The second is `@andersseen/web-components`'s Stencil
lazy-loading bundle (the same file its `unpkg`/`./lazy` package fields point
at); loading it via `<script type="module">` self-registers every `and-*` tag,
no explicit `defineAllCustomElements()` call needed.

## Design

Every icon is a plain string of inner SVG markup (`<path>`/`<g>` elements, no
wrapping `<svg>`), theme-agnostic — the consuming `<and-icon>`/`<svg>` wrapper
controls sizing and color via `currentColor`. Because a name is just a registry
key, you're never limited to the bundled set: `registerIcons({ logo: MY_SVG })`
makes `<and-icon name="logo">` work with your own path data.

`dist/icons.css` (the CSS-only path above) is generated from this exact same
`ALL_ICONS` map by `generateIconsCss()` — there is no second, hand-maintained
copy of the icon set to keep in sync.
