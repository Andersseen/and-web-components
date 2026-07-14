---
title: Getting Started
description: Install and register And Web Components in any framework.
---

And Web Components ships as framework-agnostic Custom Elements (built with
[Stencil](https://stenciljs.com/)), plus generated wrappers for Angular, React,
and Vue.

## Install

```bash
pnpm add @andersseen/web-components @andersseen/icon
```

## Register the components

### Astro

Use the
[`@andersseen/astro`](https://github.com/Andersseen/and-web-components/tree/main/packages/astro)
integration — it registers every component and icon automatically:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import andersseen from '@andersseen/astro';

export default defineConfig({
  integrations: [andersseen()],
});
```

### Plain HTML / any other framework

```ts
import { defineAllCustomElements } from '@andersseen/web-components';
import { registerAllIcons } from '@andersseen/icon';

defineAllCustomElements();
registerAllIcons();
```

Then load the design tokens so components render styled:

```ts
import '@andersseen/web-components/style.css';
```

### Angular / React / Vue

Install the generated wrapper package instead and import components directly —
no manual `defineCustomElement` calls needed:

```bash
pnpm add @andersseen/angular-components   # or @andersseen/react-components / @andersseen/vue-components
```

## Theming

Themes and color palettes are plain CSS custom properties, switched with an
attribute on `<html>`:

```html
<html and-theme="compact" and-color="slate-amber"></html>
```

See each component's page in the sidebar for its full API (properties, events,
CSS parts) and a live usage example.
