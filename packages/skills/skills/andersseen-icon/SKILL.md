---
name: andersseen-icon
description:
  'Register and render SVG icons with @andersseen/icon. Load when using
  registerIcons / registerAllIcons / getIcon / COMPONENT_ICONS, wiring the
  and-icon element, or resolving "icon not showing" issues. COMPONENT_ICONS must
  be registered whenever @andersseen/web-components is used. Trigger phrases:
  icon, svg, registerIcons, and-icon, icon registry, icon not rendering.'
---

# @andersseen/icon — SVG icon registry

Framework-agnostic SVG string registry: tree-shakable icon constants + runtime
registration functions. Used internally by `and-icon` in
`@andersseen/web-components`, and consumable standalone to render SVGs in any
framework.

## Install

```bash
npm i @andersseen/icon
```

## Core API

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

## Setup options

### Option A — register all icons (prototyping / small apps)

```ts
import { registerAllIcons } from '@andersseen/icon';
registerAllIcons();
```

### Option B — tree-shakable selective registration (production recommended)

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

### COMPONENT_ICONS

A pre-built record containing every icon that `@andersseen/web-components` uses
internally (chevron, close, check, spinner, …). Always include it when using the
web-components package.

## Using registered icons

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

## With and-icon (web component)

After registration, use the icon by name via the `name` prop:

```html
<and-icon name="home" size="20"></and-icon>
<and-icon name="sparkles" size="16" color="hsl(var(--primary))"></and-icon>
<and-icon name="arrow-right" size="24" stroke-width="1.5"></and-icon>
```

## Naming convention

Exported constants use `SCREAMING_SNAKE_CASE`; registration keys (and `name`
prop values) use `kebab-case`.

```ts
import { ARROW_RIGHT, CHECK_CIRCLE, LOADING_SPINNER } from '@andersseen/icon';
registerIcons({
  'arrow-right': ARROW_RIGHT,
  'check-circle': CHECK_CIRCLE,
  'loading-spinner': LOADING_SPINNER,
});
```

## Rules

- Always register icons before rendering `and-icon` or calling `getIcon`.
- In production prefer selective registration; avoid `registerAllIcons` outside
  demos/prototypes.
- Keep `and-icon name` exactly aligned with registry keys.
- Do not inline random SVG literals when the registry can be used.
- Register `COMPONENT_ICONS` whenever `@andersseen/web-components` is used.
