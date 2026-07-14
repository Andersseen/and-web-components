---
title: Icon — Overview
description:
  Tree-shakeable SVG icon library with a tiny global registry. Usable
  standalone, without any other Andersseen package.
---

`@andersseen/icon` is a tree-shakeable SVG icon library — 87 icons as plain
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

Every icon is also exported as a bare string constant if you want to render it
yourself without going through the registry — the export name is the icon's
`UPPER_SNAKE_CASE` form; the registry key is the same name in `kebab-case`.

## Everything at once (demos only)

```ts
import { registerAllIcons } from '@andersseen/icon';

registerAllIcons();
```

Bundles all 87 icons — fine for a demo/dev app (this docs site uses it), but it
defeats tree-shaking in a production bundle. Prefer `registerIcons()` with an
explicit map, or `COMPONENT_ICONS` (the curated subset
`@andersseen/web-components`'s built-in components reference):

```ts
import { registerIcons, COMPONENT_ICONS } from '@andersseen/icon';

registerIcons(COMPONENT_ICONS);
```

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

## Registry API

| Function                   | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `registerIcons(icons)`     | Register a `Record<name, svgInnerMarkup>` map.           |
| `registerAllIcons()`       | Register all 87 bundled icons. Demo/dev use only.        |
| `getIcon(name)`            | Returns the registered SVG inner markup, or `undefined`. |
| `hasIcon(name)`            | `boolean` — is this name registered?                     |
| `getRegisteredIconNames()` | `string[]` of every currently registered name.           |
| `getRegisteredIconCount()` | Number of currently registered icons.                    |

The registry is a single `Map` on `globalThis` (or `window`), so it's shared
across every consumer on the page regardless of which bundle registered a given
icon first.

## Design

Every icon is a plain string of inner SVG markup (`<path>`/`<g>` elements, no
wrapping `<svg>`), theme-agnostic — the consuming `<and-icon>`/`<svg>` wrapper
controls sizing and color via `currentColor`.
