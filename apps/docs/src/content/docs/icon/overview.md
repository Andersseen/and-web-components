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

## Install

```bash
pnpm add @andersseen/icon
```

## Tree-shakeable registration (recommended)

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

## Everything at once (demos only)

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

## Example

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

## Icon gallery

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

## Registry API

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

## Design

Every icon is a plain string of inner SVG markup (`<path>`/`<g>` elements, no
wrapping `<svg>`), theme-agnostic — the consuming `<and-icon>`/`<svg>` wrapper
controls sizing and color via `currentColor`. Because a name is just a registry
key, you're never limited to the bundled set: `registerIcons({ logo: MY_SVG })`
makes `<and-icon name="logo">` work with your own path data.
