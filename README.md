# Andersseen Web Components

A complete, framework-agnostic web component ecosystem: headless logic, design
tokens, layout primitives, animations, icons, and **23 accessible UI
components** — built with [StencilJS](https://stenciljs.com/), ready for any
framework or plain HTML.

| Package                           | npm                                                                                                                                   | Description                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `@andersseen/web-components`      | [![npm](https://img.shields.io/npm/v/@andersseen/web-components)](https://www.npmjs.com/package/@andersseen/web-components)           | Stencil UI components (buttons, modals, tabs …)  |
| `@andersseen/headless-components` | [![npm](https://img.shields.io/npm/v/@andersseen/headless-components)](https://www.npmjs.com/package/@andersseen/headless-components) | Framework-agnostic headless state machines       |
| `@andersseen/icon`                | [![npm](https://img.shields.io/npm/v/@andersseen/icon)](https://www.npmjs.com/package/@andersseen/icon)                               | 70+ SVG icon library with tree-shaking           |
| `@andersseen/motion`              | [![npm](https://img.shields.io/npm/v/@andersseen/motion)](https://www.npmjs.com/package/@andersseen/motion)                           | Attribute-driven CSS/JS animations               |
| `@andersseen/layout`              | [![npm](https://img.shields.io/npm/v/@andersseen/layout)](https://www.npmjs.com/package/@andersseen/layout)                           | Pure CSS layout & typography via HTML attributes |
| `@andersseen/vanilla-components`  | [![npm](https://img.shields.io/npm/v/@andersseen/vanilla-components)](https://www.npmjs.com/package/@andersseen/vanilla-components)   | Zero-dependency native Custom Elements           |
| `@andersseen/angular-components`  | [![npm](https://img.shields.io/npm/v/@andersseen/angular-components)](https://www.npmjs.com/package/@andersseen/angular-components)   | Angular standalone directive wrappers            |
| `@andersseen/react-components`    | [![npm](https://img.shields.io/npm/v/@andersseen/react-components)](https://www.npmjs.com/package/@andersseen/react-components)       | Generated React wrappers                         |
| `@andersseen/vue-components`      | [![npm](https://img.shields.io/npm/v/@andersseen/vue-components)](https://www.npmjs.com/package/@andersseen/vue-components)           | Generated Vue 3 wrappers                         |
| `@andersseen/astro`               | [![npm](https://img.shields.io/npm/v/@andersseen/astro)](https://www.npmjs.com/package/@andersseen/astro)                             | Official Astro integration                       |

## Features

- **Framework-agnostic** — Works with Angular, React, Vue, Svelte, Astro, or
  vanilla HTML.
- **Headless core** — State machines, accessibility, and keyboard navigation
  without any styling.
- **Design tokens** — HSL-based theming with light/dark modes and color
  palettes.
- **Attribute-driven layout** — Flexbox, grid, spacing, and typography from HTML
  attributes.
- **Animation system** — Enter, hover, and tap animations via `and-motion`
  attributes with reduced-motion support.
- **70+ icons** — Tree-shakeable SVG icons with a global registry.
- **Shadow DOM** — Encapsulated styles with no conflicts.
- **TailwindCSS** — Components styled with Tailwind + CSS variables.

## Project Structure

```
and-web-components/
├── packages/
│   ├── headless-core/         # @andersseen/headless-components
│   ├── icon-library/          # @andersseen/icon
│   ├── layout-core/           # @andersseen/layout  (SCSS → CSS)
│   ├── motion-core/           # @andersseen/motion  (TS + CSS)
│   ├── web-components/        # @andersseen/web-components (Stencil)
│   ├── vanilla-components/    # @andersseen/vanilla-components (zero-dep CE)
│   ├── angular-components/    # @andersseen/angular-components (generated Angular)
│   ├── react-components/      # @andersseen/react-components (generated React)
│   ├── vue-components/        # @andersseen/vue-components (generated Vue)
│   └── astro/                 # @andersseen/astro integration
├── apps/
│   ├── angular-workspace/     # Angular CLI workspace (demo app only)
│   │   └── projects/
│   │       └── demo-app/            # Component showcase app
│   └── astro-landing/         # Landing page built with Astro (Playwright e2e)
├── package.json               # Root scripts
├── pnpm-workspace.yaml        # Workspace config

```

## Getting Started

### Prerequisites

- **Node.js** v20+
- **pnpm** v10+ (`corepack enable && corepack prepare pnpm@latest --activate`)

### Install

```bash
git clone https://github.com/Andersseen/and-web-components.git
cd and-web-components
pnpm install
```

### Build all libraries

```bash
pnpm build:all
```

This builds: `headless-core` → `icon-library` → `motion-core` → `web-components`
→ `vanilla-components` → `layout-core` → `angular-components` →
`react-components` → `vue-components` → `demo-app`.

## Development

### Angular Demo App

```bash
# Full build + serve
pnpm start:demo

# Dev mode with Stencil watch + Angular serve
pnpm start:demo:dev
```

Opens at `http://localhost:4200` — showcases all components, headless patterns,
icons, motion, and layout utilities.

### Astro Landing Page

```bash
pnpm start:astro:dev
```

### Stencil dev server (components only)

```bash
pnpm -C packages/web-components start
```

## Build Scripts

| Script                 | Description                                 |
| ---------------------- | ------------------------------------------- |
| `pnpm build:headless`  | Build headless state machines               |
| `pnpm build:icons`     | Build icon library                          |
| `pnpm build:motion`    | Build animation library                     |
| `pnpm build:layout`    | Build SCSS → CSS layout library             |
| `pnpm build:stencil`   | Build headless + icons + Stencil components |
| `pnpm build:angular`   | Build Angular wrappers + demo app           |
| `pnpm build:react`     | Build React wrappers                        |
| `pnpm build:vue`       | Build Vue wrappers                          |
| `pnpm build:all`       | Build everything                            |
| `pnpm build:astro`     | Build Astro landing page                    |
| `pnpm start:demo`      | Build libs + serve Angular demo             |
| `pnpm start:demo:dev`  | Stencil watch + Angular serve (concurrent)  |
| `pnpm start:astro:dev` | Build libs + Astro dev server               |

## Using the Libraries

### In any HTML page

```html
<script
  type="module"
  src="https://unpkg.com/@andersseen/web-components/dist/web-components/web-components.esm.js"
></script>
<link
  rel="stylesheet"
  href="https://unpkg.com/@andersseen/web-components/dist/web-components/web-components.css"
/>

<and-button variant="default">Click me</and-button>
```

### In a bundled app (Vite, Webpack, etc.)

```bash
npm install @andersseen/web-components @andersseen/icon @andersseen/motion @andersseen/layout
```

```ts
// Register all custom elements
import '@andersseen/web-components/components/all';

// Register icons
import { registerAllIcons } from '@andersseen/icon';
registerAllIcons();

// Enable animations
import { enableAnimations } from '@andersseen/web-components';
enableAnimations();

// Attribute-driven animations
import { initMotion } from '@andersseen/motion';
initMotion();
```

```css
/* Import styles */
@import '@andersseen/web-components/dist/web-components/web-components.css';
@import '@andersseen/motion/style.css';
@import '@andersseen/layout/dist/layout.css';
```

### In Angular

```bash
npm install @andersseen/web-components @andersseen/angular-components @andersseen/icon
```

```ts
// app.component.ts
import { AndButton, AndModal, AndIcon } from '@andersseen/angular-components';

@Component({
  imports: [AndButton, AndModal, AndIcon],
  template: `<and-button variant="default">Click me</and-button>`,
})
export class AppComponent {}
```

### In React

```bash
npm install @andersseen/web-components @andersseen/react-components @andersseen/icon
```

```tsx
// App.tsx
import { AndButton } from '@andersseen/react-components';
import '@andersseen/web-components/dist/web-components/web-components.css';

export function App() {
  return <AndButton variant="default">Click me</AndButton>;
}
```

### In Vue

```bash
npm install @andersseen/web-components @andersseen/vue-components @andersseen/icon
```

```vue
<!-- App.vue -->
<script setup lang="ts">
import { AndButton } from '@andersseen/vue-components';
import '@andersseen/web-components/dist/web-components/web-components.css';
</script>

<template>
  <AndButton variant="default">Click me</AndButton>
</template>
```

### In Astro

```astro
---
import '@andersseen/web-components/dist/web-components/web-components.css';
import '@andersseen/motion/style.css';
---

<and-button variant="outline">Hello</and-button>

<script>
  import '@andersseen/web-components/components/all';
  import { registerAllIcons } from '@andersseen/icon';
  import { initMotion } from '@andersseen/motion';
  registerAllIcons();
  initMotion();
</script>
```

## Components

| Component    | Tag                | Features                                   |
| ------------ | ------------------ | ------------------------------------------ |
| Accordion    | `and-accordion`    | Expandable panels with keyboard navigation |
| Alert        | `and-alert`        | Dismissible status messages                |
| Badge        | `and-badge`        | Labels and status indicators               |
| Breadcrumb   | `and-breadcrumb`   | Navigation breadcrumbs                     |
| Button       | `and-button`       | 6 variants, loading state, link mode       |
| Card         | `and-card`         | Content container with slots               |
| Carousel     | `and-carousel`     | Image/content slider                       |
| Code         | `and-code`         | Code display / copy                        |
| Context Menu | `and-context-menu` | Right-click menus                          |
| Drawer       | `and-drawer`       | Slide-out panels                           |
| Dropdown     | `and-dropdown`     | Menu overlays                              |
| Icon         | `and-icon`         | 70+ SVG icons                              |
| Input        | `and-input`        | Form input with validation                 |
| Menu List    | `and-menu-list`    | Navigable menu items                       |
| Modal        | `and-modal`        | Dialog overlays with focus trap            |
| Navbar       | `and-navbar`       | Fixed/sticky navigation with scroll spy    |
| Pagination   | `and-pagination`   | Page navigation                            |
| Select       | `and-select`       | Dropdown selection                         |
| Sidebar      | `and-sidebar`      | Collapsible side navigation                |
| Skeleton     | `and-skeleton`     | Loading placeholders                       |
| Tabs         | `and-tabs`         | Tabbed content switching                   |
| Toast        | `and-toast`        | Notification messages                      |
| Tooltip      | `and-tooltip`      | Info popups on hover/focus                 |

## Theming

Components use CSS custom properties with HSL values. Set a `data-color`
attribute on `<html>` to switch palettes, or override variables directly:

```css
:root {
  --primary: 243 75% 59%;
  --primary-foreground: 0 0% 100%;
  --background: 226 30% 98%;
  --foreground: 224 71% 4%;
  --radius: 0.5rem;
}

.dark {
  --primary: 234 89% 74%;
  --background: 229 50% 6%;
  --foreground: 226 100% 97%;
}
```

## Layout System

Attribute-driven layout utilities — no classes needed:

```html
<div and-layout="horizontal gap:md align:center justify:between wrap:wrap">
  <div and-layout="vertical gap:sm">
    <h2 and-text="h2 weight:bold">Title</h2>
    <p and-text="p align:center">Description</p>
  </div>
</div>

<!-- Responsive modifiers -->
<div and-layout="grid cols:1 cols@md:2 cols@lg:3 gap:lg">...</div>
```

## Motion System

Declarative animations via HTML attributes:

```html
<!-- Animate on scroll into view -->
<div and-motion="fade-in" and-motion-trigger="enter">Content</div>

<!-- Animate on hover -->
<div and-motion="zoom-in" and-motion-trigger="hover">Hover me</div>

<!-- With custom timing -->
<div
  and-motion="slide-in-up"
  and-motion-trigger="enter"
  and-motion-duration="800ms"
  and-motion-delay="200ms"
>
  Delayed slide
</div>
```

Supports `prefers-reduced-motion` automatically.

## Deployment

Both apps deploy to **Cloudflare Pages**:

```bash
# Angular demo app
pnpm deploy:cloudflare

# Astro landing page
pnpm deploy:landing
```

## Publishing to npm

Libraries use [Changesets](https://github.com/changesets/changesets) with
independent versioning. The only sanctioned publish path is via CI:

```bash
# 1. Add a changeset for your changes
pnpm changeset

# 2. Commit and open a PR; merge to main
```

Merging to `main` triggers `.github/workflows/release.yml`, which uses
`changesets/action` to either open a "chore: version packages" PR (if there are
pending changesets) or publish the newly-versioned packages to npm (when that PR
is merged). Do not run `pnpm release` or `pnpm publish` locally except in
emergencies, because it bypasses Changesets and risks version drift.

Each package under `packages/` is scoped to `@andersseen/` and configured with
`"publishConfig": { "access": "public" }`.

## License

MIT
