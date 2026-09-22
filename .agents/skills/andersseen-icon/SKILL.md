---
name: andersseen-icon
description:
  Register and render SVG icons with @andersseen/icon, including CSS, scanner,
  lazy-loading, and component registry strategies.
---

# @andersseen/icon — SVG icon library

Framework-agnostic SVG icon set: tree-shakable icon constants + a runtime
registry, plus generated CSS for zero-JS usage. Two consumption paths, both
reading the same `ALL_ICONS` source:

1. **CSS-only** — `and-icon="name"` attribute + `mask-image`, no JavaScript.
   Four loading strategies, see below.
2. **Registry + `<and-icon>`** — `registerIcons()`/`registerAllIcons()` feed the
   `<and-icon>` Web Component from `@andersseen/web-components`. Unaffected by
   which CSS-only loading strategy (if any) is also in use.

## Install

```bash
npm i @andersseen/icon
```

## CSS-only (no JavaScript) — four loading strategies

`and-icon="name"` + `mask-image`, all four reading the same `ALL_ICONS` source.
Pick per app; it's fine to mix them.

### 1. Full CSS — prototypes, docs, simple CDN

```css
@import '@andersseen/icon/icons.css';
```

```html
<span and-icon="home" aria-hidden="true"></span>
<i and-icon="search" aria-hidden="true"></i>
```

CDN, zero JavaScript:

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@andersseen/icon@<version>/dist/icons.css"
/>
<span and-icon="home" aria-hidden="true"></span>
```

The API is the `and-icon` attribute, not a specific element — any host element
works; `<span>` is the recommended default. Size via `font-size` (the icon is
`1em` square), color via `color` (`currentColor`-driven `mask-image`) — no
`and-icon-size`/`and-icon-color` attributes, plain CSS already covers both.
Monochrome/`currentColor` icons only — no multicolor, no runtime stroke-width;
use `<and-icon>` for that.

### 2. Selective per-icon CSS — you know exactly which few icons

```css
@import '@andersseen/icon/base.css';
@import '@andersseen/icon/icons/home.css';
@import '@andersseen/icon/icons/search.css';
```

`base.css` = only the shared `[and-icon]` rule; `icons/<name>.css` = only that
icon's `mask-image` rule — both generated from `ALL_ICONS` by the same generator
as `icons.css`. Also available via `generateIconsCss()` for a custom subset:

```ts
import { generateIconsCss } from '@andersseen/icon/generate-css';
import { HOME, SEARCH } from '@andersseen/icon';
import { writeFileSync } from 'node:fs';

writeFileSync('subset.css', generateIconsCss({ home: HOME, search: SEARCH }));
```

### 3. Build-time scanner — production apps with a build (recommended there)

```bash
pnpm exec and-icons scan --out ./src/and-icons.generated.css
```

```css
@import './and-icons.generated.css';
```

The `and-icons` CLI (ships with this package — no separate install/package)
scans `.html`/`.htm`/`.astro`/`.ts`/`.tsx`/`.jsx`/`.vue`/`.svelte` for static
`and-icon="<name>"` literals and generates exactly the base rule + the icons
used, via `generateIconsCss()`. It cannot resolve dynamic values
(`and-icon={icon}`, `[attr.and-icon]="icon"`, `:and-icon="icon"`) — list those
names in `and-icons.config.mjs`'s `safelist`. An unknown static/safelisted name
fails the scan (non-zero exit, no silent empty mask) instead of succeeding
quietly. Zero runtime JS.

### 4. Runtime lazy loading — dynamic/CMS content, icon set unknown at build

```ts
import { initLazyIcons } from '@andersseen/icon/lazy';

const cleanup = initLazyIcons(); // opt-in — importing the module alone does nothing
```

```html
<span and-icon="home" aria-hidden="true"></span>
```

Scans existing `[and-icon]` elements, then watches for new ones/attribute
changes via `MutationObserver`, loading each icon's `icons/<name>.css` over the
network exactly once (deduplicated). Never loads `icons.css`; the base rule is
injected once inline. After bundling, pass `baseUrl`/`resolveIconUrl` —
`import.meta.url` isn't guaranteed to survive a bundler. For a bundled app,
prefer strategy 3 (the scanner) instead.

## Registry + `<and-icon>` API

```ts
import {
  registerIcons,
  registerAllIcons,
  getIcon,
  hasIcon,
  getRegisteredIconNames,
  getRegisteredIconCount,
} from '@andersseen/icon';
```

Verified behavior:

- The registry is global (`window`/`globalThis`) under `__AND_ICONS_REGISTRY__`.
- `registerIcons` merges entries into that global Map.
- `getIcon(name)` returns an SVG string or `undefined` if not registered.

### Setup options

#### Option A — register all icons (prototyping / small apps)

```ts
import { registerAllIcons } from '@andersseen/icon';
registerAllIcons();
```

#### Option B — tree-shakable selective registration (production recommended)

```ts
import {
  registerIcons,
  HOME,
  CLOSE,
  SEARCH,
  COMPONENT_ICONS,
} from '@andersseen/icon';

// Icons required by and-* components — ALWAYS register when using web-components
registerIcons(COMPONENT_ICONS);

// Additional icons your app needs
registerIcons({ home: HOME, close: CLOSE, search: SEARCH });
```

#### COMPONENT_ICONS

A pre-built record of the six icons `@andersseen/web-components` uses
internally: `close`, `chevron-down`, `chevron-up`, `chevron-left`,
`chevron-right`, `menu`. Always include it when using the web-components
package.

### Using registered icons

```ts
const svg = getIcon('home'); // SVG string or undefined

if (!hasIcon('home')) {
  console.warn('Icon "home" is not registered');
}

console.log(getRegisteredIconNames());
console.log(getRegisteredIconCount());

// Render inline in a framework
// Angular:   <span [innerHTML]="getIcon('home')"></span>
// Pure HTML: element.innerHTML = getIcon('home') ?? '';
```

### With and-icon (web component)

After registration, use the icon by name via the `name` prop:

```html
<and-icon name="home" size="20"></and-icon>
<and-icon name="star" size="16" color="hsl(var(--primary))"></and-icon>
<and-icon name="arrow-right" size="24" stroke-width="1.5"></and-icon>
```

## Naming convention

Exported constants use `SCREAMING_SNAKE_CASE`; registration keys (and `name`
prop values) use `kebab-case`.

```ts
import { ARROW_RIGHT, CHECK, LOADER } from '@andersseen/icon';
registerIcons({
  'arrow-right': ARROW_RIGHT,
  'check': CHECK,
  'loader': LOADER,
});
```

Same convention for the CSS-only path — the `and-icon="name"` attribute value is
always the `kebab-case` registry key (`and-icon="arrow-right"`, never
`and-icon="ARROW_RIGHT"`).

## Rules

- CSS-only path: no registration needed — `@import '@andersseen/icon/icons.css'`
  then `and-icon="name"` works immediately.
- Registry path: always register icons before rendering `and-icon` or calling
  `getIcon`.
- In production prefer selective registration; avoid `registerAllIcons` outside
  demos/prototypes.
- Keep `and-icon name`/attribute value exactly aligned with registry keys.
- Do not inline random SVG literals when the registry or catalog can be used.
- Register `COMPONENT_ICONS` whenever `@andersseen/web-components`'s
  `<and-icon>` is used.
- `registerIcons()` content is inserted via `innerHTML` — only register SVG you
  trust, never unsanitized user/third-party content.
- For a production app with a build step, prefer the `and-icons` scanner
  (strategy 3) over runtime lazy loading (strategy 4) — zero runtime JS and no
  URL-resolution config needed when the icon set is knowable at build time.
- Never write a second CSS generator or duplicate SVG data by hand for a new
  loading strategy — `generateIconsCss()`/`generateIconsBaseCss()`/
  `generateIconCss()` (`@andersseen/icon/generate-css`) are the one source every
  CSS output (full, selective, scanner, lazy) is built from.
