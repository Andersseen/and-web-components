# Andersseen Web Components

A complete, framework-agnostic web component ecosystem: headless logic, design tokens, layout primitives, animations, icons, and **24+ accessible UI components** — built with [StencilJS](https://stenciljs.com/), ready for any framework or plain HTML.

| Package | npm | Description |
|---|---|---|
| `@andersseen/web-components` | [![npm](https://img.shields.io/npm/v/@andersseen/web-components)](https://www.npmjs.com/package/@andersseen/web-components) | Stencil UI components (buttons, modals, tabs …) |
| `@andersseen/headless-components` | [![npm](https://img.shields.io/npm/v/@andersseen/headless-components)](https://www.npmjs.com/package/@andersseen/headless-components) | Framework-agnostic headless state machines |
| `@andersseen/icon` | [![npm](https://img.shields.io/npm/v/@andersseen/icon)](https://www.npmjs.com/package/@andersseen/icon) | 70+ SVG icon library with tree-shaking |
| `@andersseen/motion` | [![npm](https://img.shields.io/npm/v/@andersseen/motion)](https://www.npmjs.com/package/@andersseen/motion) | Attribute-driven CSS/JS animations |
| `@andersseen/layout` | [![npm](https://img.shields.io/npm/v/@andersseen/layout)](https://www.npmjs.com/package/@andersseen/layout) | Pure CSS layout & typography via HTML attributes |
| `@andersseen/angular-components` | [![npm](https://img.shields.io/npm/v/@andersseen/angular-components)](https://www.npmjs.com/package/@andersseen/angular-components) | Angular standalone directive wrappers |

## Features

- **Framework-agnostic** — Works with Angular, React, Vue, Svelte, Astro, or vanilla HTML.
- **Headless core** — State machines, accessibility, and keyboard navigation without any styling.
- **Design tokens** — HSL-based theming with light/dark modes and color palettes.
- **Attribute-driven layout** — Flexbox, grid, spacing, and typography from HTML attributes.
- **Animation system** — Enter, hover, and tap animations via `and-motion` attributes with reduced-motion support.
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
│   └── stencil-library/       # @andersseen/web-components (Stencil)
├── apps/
│   ├── angular-workspace/     # Angular demo app + @andersseen/angular-components
│   │   └── projects/
│   │       ├── angular-components/  # Auto-generated Angular wrappers
│   │       └── demo-app/            # Component showcase app
│   └── astro-landing/         # Landing page built with Astro
├── package.json               # Root scripts
├── pnpm-workspace.yaml        # Workspace config
└── lerna.json                 # Independent versioning
```

## Getting Started

### Prerequisites

- **Node.js** v18+
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

This builds: `headless-core` → `icon-library` → `stencil-library` → `motion-core` → `layout-core` → `angular-components` → `demo-app`.

## Development

### Angular Demo App

```bash
# Full build + serve
pnpm start:demo

# Dev mode with Stencil watch + Angular serve
pnpm start:demo:dev
```

Opens at `http://localhost:4200` — showcases all components, headless patterns, icons, motion, and layout utilities.

### Astro Landing Page

```bash
pnpm start:astro:dev
```

### Stencil dev server (components only)

```bash
pnpm -C packages/stencil-library start
```

## Build Scripts

| Script | Description |
|---|---|
| `pnpm build:headless` | Build headless state machines |
| `pnpm build:icons` | Build icon library |
| `pnpm build:motion` | Build animation library |
| `pnpm build:layout` | Build SCSS → CSS layout library |
| `pnpm build:stencil` | Build headless + icons + Stencil components |
| `pnpm build:angular` | Build Angular wrappers + demo app |
| `pnpm build:all` | Build everything |
| `pnpm build:astro` | Build Astro landing page |
| `pnpm start:demo` | Build libs + serve Angular demo |
| `pnpm start:demo:dev` | Stencil watch + Angular serve (concurrent) |
| `pnpm start:astro:dev` | Build libs + Astro dev server |

## Using the Libraries

### In any HTML page

```html
<script type="module" src="https://unpkg.com/@andersseen/web-components/dist/web-components/web-components.esm.js"></script>
<link rel="stylesheet" href="https://unpkg.com/@andersseen/web-components/dist/web-components/web-components.css" />

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

| Component | Tag | Features |
|---|---|---|
| Accordion | `and-accordion` | Expandable panels with keyboard navigation |
| Alert | `and-alert` | Dismissible status messages |
| Badge | `and-badge` | Labels and status indicators |
| Breadcrumb | `and-breadcrumb` | Navigation breadcrumbs |
| Button | `and-button` | 6 variants, loading state, link mode |
| Card | `and-card` | Content container with slots |
| Carousel | `and-carousel` | Image/content slider |
| Context Menu | `and-context-menu` | Right-click menus |
| Drawer | `and-drawer` | Slide-out panels |
| Dropdown | `and-dropdown` | Menu overlays |
| Icon | `and-icon` | 70+ SVG icons |
| Input | `and-input` | Form input with validation |
| Menu List | `and-menu-list` | Navigable menu items |
| Modal | `and-modal` | Dialog overlays with focus trap |
| Navbar | `and-navbar` | Fixed/sticky navigation with scroll spy |
| Pagination | `and-pagination` | Page navigation |
| Sidebar | `and-sidebar` | Collapsible side navigation |
| Tabs | `and-tabs` | Tabbed content switching |
| Toast | `and-toast` | Notification messages |
| Tooltip | `and-tooltip` | Info popups on hover/focus |

## Theming

Components use CSS custom properties with HSL values. Set a `data-color` attribute on `<html>` to switch palettes, or override variables directly:

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
<div and-layout="grid cols:1 cols@md:2 cols@lg:3 gap:lg">
  ...
</div>
```

## Motion System

Declarative animations via HTML attributes:

```html
<!-- Animate on scroll into view -->
<div and-motion="fade-in" and-motion-trigger="enter">Content</div>

<!-- Animate on hover -->
<div and-motion="zoom-in" and-motion-trigger="hover">Hover me</div>

<!-- With custom timing -->
<div and-motion="slide-in-up" and-motion-trigger="enter"
     and-motion-duration="800ms" and-motion-delay="200ms">
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

Libraries use [Lerna](https://lerna.js.org/) with independent versioning:

```bash
# Build all libraries first
pnpm build:stencil && pnpm build:motion && pnpm build:layout

# Publish changed packages
pnpm publish:libs
```

Each package under `packages/` is scoped to `@andersseen/` and configured with `"publishConfig": { "access": "public" }`.

## License

MIT
