# @andersseen/icon

Tree-shakeable SVG icon library: 87 icons as plain string constants, plus a tiny
global registry that `<and-icon>` (from `@andersseen/web-components`) and
`@andersseen/vanilla-components` read from. Framework-agnostic — usable without
any other Andersseen package.

> Part of the Andersseen **product core** — usable entirely on its own to
> register your own icon set under `and-icon`-compatible names, even outside
> this component ecosystem.

## Installation

```bash
pnpm add @andersseen/icon
```

## Usage

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

`registerAllIcons()` bundles all 87 icons — fine for a demo/dev app, but it
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
| `registerAllIcons()`       | Register all 87 bundled icons. Demo/dev use only.        |
| `getIcon(name)`            | Returns the registered SVG inner markup, or `undefined`. |
| `hasIcon(name)`            | `boolean` — is this name registered?                     |
| `getRegisteredIconNames()` | `string[]` of every currently registered name.           |
| `getRegisteredIconCount()` | Number of currently registered icons.                    |

The registry is a single `Map` on `globalThis` (or `window`, when present), so
it's shared across every consumer on the page regardless of which bundle
registered a given icon first.

## Design

- Every icon is a plain string of inner SVG markup (`<path>`/`<g>` elements, no
  wrapping `<svg>`) using `currentColor`-free, theme-agnostic strokes — the
  consuming `<and-icon>`/`<svg>` wrapper controls sizing and color.
- `ALL_ICONS` (the full map) and `COMPONENT_ICONS` (the subset used by
  `@andersseen/web-components`) are both exported for cases where you need the
  whole set or just the built-in-component set, respectively.

## Development

```bash
pnpm -C packages/icon-library test    # Vitest
pnpm -C packages/icon-library lint
pnpm -C packages/icon-library build   # ESM + CJS
```

## License

MIT
