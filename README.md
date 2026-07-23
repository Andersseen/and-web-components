<div align="center">

# And Libs

**A UI stack you adopt one layer at a time.**

Headless state machines, DOM behaviors, layout primitives, motion, icons and 25
accessible components — each published on its own, none requiring the others.
Works in Angular, React, Vue, Astro, Svelte, or a plain HTML file.

[![npm](https://img.shields.io/npm/v/@andersseen/web-components?label=web-components&color=0b7285)](https://www.npmjs.com/package/@andersseen/web-components)
[![Release](https://img.shields.io/github/actions/workflow/status/Andersseen/and-web-components/release.yml?branch=main&label=release)](https://github.com/Andersseen/and-web-components/actions/workflows/release.yml)
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%E2%89%A520-5a9e4b)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-10-f69220)](https://pnpm.io)

[**Landing**](https://libs.andersseen.dev/) ·
[**Docs**](https://docs.andersseen.dev/) ·
[**Component demo**](https://and-web-components-demo.pages.dev) ·
[**Storybook**](https://and-web-components-storybook.pages.dev)

</div>

---

## Why this exists

Most component libraries are all-or-nothing: you want a grid helper, you install
a runtime, a theme, and 40 components you'll never render. And Libs splits that
into layers you can take individually.

An Angular app that only wants attribute-driven layout installs
`@andersseen/layout` — pure CSS, no JS runtime, no components. A team building
its own design system takes `@andersseen/headless-components` and skips every
styled package. Nothing pulls in a sibling unless the docs say so.

```
                      ┌───────────────────────────────────┐
  adapters            │  angular · react · vue · astro    │   generated wrappers
                      └────────────────┬──────────────────┘
                                       │
                      ┌────────────────▼──────────────────┐
  styled UI           │  web-components  (Stencil, Shadow │   25 components
                      │  DOM, Tailwind + CVA)             │
                      └────────────────┬──────────────────┘
                                       │
                      ┌────────────────▼──────────────────┐
  foundation          │  headless-components              │   pure TS, no DOM
                      └───────────────────────────────────┘

  standalone — nothing above required
  ┌──────────┬──────────┬───────────┬──────────┬─────────────────────┐
  │  layout  │  motion  │ behaviors │   icon   │ vanilla-components  │
  │ CSS only │ CSS + TS │ DOM only  │ 88 SVGs  │  zero-dependency CE │
  └──────────┴──────────┴───────────┴──────────┴─────────────────────┘
```

## Packages

| Package                                                           | Version                                                                                                                                                   | What it is                                             |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [`@andersseen/web-components`](./packages/web-components)         | [![npm](https://img.shields.io/npm/v/@andersseen/web-components?color=0b7285&label=)](https://www.npmjs.com/package/@andersseen/web-components)           | 25 Stencil components, Shadow DOM, themeable           |
| [`@andersseen/headless-components`](./packages/headless-core)     | [![npm](https://img.shields.io/npm/v/@andersseen/headless-components?color=0b7285&label=)](https://www.npmjs.com/package/@andersseen/headless-components) | State machines + a11y logic, zero styling, no DOM      |
| [`@andersseen/layout`](./packages/layout-core)                    | [![npm](https://img.shields.io/npm/v/@andersseen/layout?color=6741d9&label=)](https://www.npmjs.com/package/@andersseen/layout)                           | Flexbox/grid/typography from HTML attributes           |
| [`@andersseen/motion`](./packages/motion-core)                    | [![npm](https://img.shields.io/npm/v/@andersseen/motion?color=6741d9&label=)](https://www.npmjs.com/package/@andersseen/motion)                           | Declarative animations, reduced-motion aware           |
| [`@andersseen/behaviors`](./packages/behaviors)                   | [![npm](https://img.shields.io/npm/v/@andersseen/behaviors?color=6741d9&label=)](https://www.npmjs.com/package/@andersseen/behaviors)                     | Splitters, drag & drop, tooltips, dialogs on plain DOM |
| [`@andersseen/icon`](./packages/icon-library)                     | [![npm](https://img.shields.io/npm/v/@andersseen/icon?color=6741d9&label=)](https://www.npmjs.com/package/@andersseen/icon)                               | 88 tree-shakeable SVG icons                            |
| [`@andersseen/vanilla-components`](./packages/vanilla-components) | [![npm](https://img.shields.io/npm/v/@andersseen/vanilla-components?color=6741d9&label=)](https://www.npmjs.com/package/@andersseen/vanilla-components)   | Zero-dependency native Custom Elements                 |
| [`@andersseen/angular-components`](./packages/angular-components) | [![npm](https://img.shields.io/npm/v/@andersseen/angular-components?color=868e96&label=)](https://www.npmjs.com/package/@andersseen/angular-components)   | Angular standalone wrappers                            |
| [`@andersseen/react-components`](./packages/react-components)     | [![npm](https://img.shields.io/npm/v/@andersseen/react-components?color=868e96&label=)](https://www.npmjs.com/package/@andersseen/react-components)       | React wrappers                                         |
| [`@andersseen/vue-components`](./packages/vue-components)         | [![npm](https://img.shields.io/npm/v/@andersseen/vue-components?color=868e96&label=)](https://www.npmjs.com/package/@andersseen/vue-components)           | Vue 3 wrappers                                         |
| [`@andersseen/astro`](./packages/astro)                           | [![npm](https://img.shields.io/npm/v/@andersseen/astro?color=868e96&label=)](https://www.npmjs.com/package/@andersseen/astro)                             | Astro integration                                      |
| [`@andersseen/mcp`](./packages/mcp)                               | [![npm](https://img.shields.io/npm/v/@andersseen/mcp?color=e8590c&label=)](https://www.npmjs.com/package/@andersseen/mcp)                                 | MCP server — lets AI assistants query the catalog      |
| [`@andersseen/skills`](./packages/skills)                         | [![npm](https://img.shields.io/npm/v/@andersseen/skills?color=e8590c&label=)](https://www.npmjs.com/package/@andersseen/skills)                           | Installable agent skills, one per library              |

## Quick start

Install only what you need:

```bash
# The styled components
npm install @andersseen/web-components

# …or just the CSS layout layer, with no JS at all
npm install @andersseen/layout
```

Theme from a single attribute on `<html>`, register the elements once, then use
them anywhere:

```html
<html and-color="violet-cyan" and-theme="compact" and-mode="dark">
  <head>
    <script type="module">
      import { defineAllCustomElements } from '@andersseen/web-components';
      defineAllCustomElements();
    </script>
  </head>
  <body>
    <and-button variant="primary">Ship it</and-button>
  </body>
</html>
```

Framework users can skip the manual registration and install the matching
adapter — [Angular](./packages/angular-components),
[React](./packages/react-components), [Vue](./packages/vue-components) or
[Astro](./packages/astro).

## Components

25 components, registering 39 custom elements once sub-parts (`and-card-header`,
`and-tabs-trigger`, …) are counted.

Accordion · Alert · Badge · Breadcrumb · Button · Card · Carousel · Code ·
Context Menu · Control · Drawer · Dropdown · Icon · Input · Menu List · Modal ·
Navbar · Pagination · Select · Sidebar · Skeleton · Switch · Tabs · Toast ·
Tooltip

Every one is driven by a headless state machine from
`@andersseen/headless-components`, so keyboard navigation, focus management and
ARIA wiring are shared rather than reimplemented per component.

<details>
<summary><b>Theming</b> — palettes, density themes, light/dark</summary>

<br>

Components read HSL custom properties. Switch everything from one attribute on
`<html>`:

```html
<html and-color="violet-cyan" and-theme="compact" and-mode="dark"></html>
```

| Attribute   | Values                                                                                  |
| ----------- | --------------------------------------------------------------------------------------- |
| `and-color` | `indigo-rose`, `slate-amber`, `emerald-orange`, `violet-cyan`, `rose-teal`, `warm-gold` |
| `and-theme` | `default`, `compact`, `playful`, `retro`, `elegant`                                     |
| `and-mode`  | `light`, `dark` (`class="dark"` also works)                                             |

Attributes are namespaced to avoid colliding with application-owned `data-*`.
The former `data-color` / `data-theme` / `data-mode` selectors still work as
deprecated aliases.

To bake one palette in as the default, import it after the component stylesheet:

```css
@import '@andersseen/web-components/style.css';
@import '@andersseen/web-components/colors/violet-cyan.css';
```

Or override the variables yourself:

```css
:root {
  --primary: 243 75% 59%;
  --primary-foreground: 0 0% 100%;
  --background: 226 30% 98%;
  --foreground: 224 71% 4%;
  --radius: 0.5rem;
}
```

</details>

<details>
<summary><b>Layout</b> — flexbox and grid from attributes, no classes</summary>

<br>

```html
<div and-layout="horizontal gap:md align:center justify:between wrap:wrap">
  <div and-layout="vertical gap:sm">
    <h2 and-text="h2 weight:bold">Title</h2>
    <p and-text="p align:center">Description</p>
  </div>
</div>

<!-- Responsive modifiers -->
<div and-layout="grid cols:1 cols@md:2 cols@lg:3 gap:lg">…</div>
```

`@andersseen/layout` ships compiled CSS only — no JavaScript runtime, no
preflight, safe to drop into an existing app.

</details>

<details>
<summary><b>Motion</b> — enter, hover and tap animations</summary>

<br>

```html
<div and-motion="fade-in" and-motion-trigger="enter">Content</div>
<div and-motion="zoom-in" and-motion-trigger="hover">Hover me</div>

<div
  and-motion="slide-in-up"
  and-motion-trigger="enter"
  and-motion-duration="800ms"
  and-motion-delay="200ms"
>
  Delayed slide
</div>
```

`prefers-reduced-motion` is honoured automatically.

</details>

<details>
<summary><b>Behaviors</b> — enhance existing DOM without a framework</summary>

<br>

Where `headless-components` is pure state and never touches the DOM,
`@andersseen/behaviors` attaches interaction directly to elements you already
have.

```html
<div and-splitter="horizontal" and-splitter-default-position="30">
  <aside and-splitter-panel="primary">Navigation</aside>
  <div and-splitter-handle></div>
  <main and-splitter-panel="secondary">Content</main>
</div>

<button and-tooltip="Save changes" and-tooltip-placement="top">Save</button>

<script type="module">
  import { defineBehaviors } from '@andersseen/behaviors';
  const cleanup = defineBehaviors({ observe: true });
</script>
```

| Attribute            | Behavior                          | Imperative API                         |
| -------------------- | --------------------------------- | -------------------------------------- |
| `and-splitter`       | Resizable panel container         | `createSplitter(container, options)`   |
| `and-draggable`      | HTML5 drag source                 | `createDraggable(element, config)`     |
| `and-drop-zone`      | Drop target with optional sorting | `createDropZone(element, config)`      |
| `and-tooltip`        | Hover/focus tooltip               | `createTooltip(element, options)`      |
| `and-dialog-trigger` | Modal or drawer trigger           | `createDialog(targetElement, options)` |

Subpath imports (`@andersseen/behaviors/splitter`, `/tooltip`, `/dialog`,
`/drag-drop`) keep bundles tight. No production dependencies. Keyboard resizing,
`aria-describedby`, Escape dismissal and focus trapping are built in — see the
[package README](./packages/behaviors/README.md) for the full reference.

</details>

<details>
<summary><b>AI tooling</b> — MCP server and agent skills</summary>

<br>

`@andersseen/mcp` exposes the component catalog over the Model Context Protocol,
so Claude, Cursor, Copilot and VS Code can query real props and emit
framework-correct snippets instead of guessing.

`@andersseen/skills` ships installable agent skills — one focused skill per
library, plus an orchestrator.

</details>

## Repository

```
and-web-components/
├── packages/
│   ├── headless-core/         # @andersseen/headless-components
│   ├── web-components/        # @andersseen/web-components  (Stencil)
│   ├── vanilla-components/    # @andersseen/vanilla-components
│   ├── behaviors/             # @andersseen/behaviors
│   ├── layout-core/           # @andersseen/layout          (SCSS → CSS)
│   ├── motion-core/           # @andersseen/motion
│   ├── icon-library/          # @andersseen/icon
│   ├── angular-components/    # generated Angular wrappers
│   ├── react-components/      # generated React wrappers
│   ├── vue-components/        # generated Vue wrappers
│   ├── astro/                 # @andersseen/astro integration
│   ├── mcp/                   # @andersseen/mcp
│   └── skills/                # @andersseen/skills
├── apps/
│   ├── angular-workspace/     # Angular demo app
│   ├── astro-landing/         # Landing page  (Playwright e2e)
│   └── docs/                  # Documentation site
└── docs/                      # Architecture spec, codemap, roadmap
```

### Local development

Requires **Node 20+** (CI runs 22) and **pnpm 10**.

```bash
git clone https://github.com/Andersseen/and-web-components.git
cd and-web-components
pnpm install
pnpm build:all
```

| Command                | What it runs                                    |
| ---------------------- | ----------------------------------------------- |
| `pnpm build:all`       | Every publishable package, in dependency order  |
| `pnpm build:stencil`   | Core chain — required once before Stencil tests |
| `pnpm start:demo`      | Angular showcase app                            |
| `pnpm start:astro:dev` | Landing page                                    |
| `pnpm start:docs:dev`  | Documentation site                              |
| `pnpm storybook`       | Component workbench                             |
| `pnpm lint`            | Lint every package                              |

Contributor guide: [CONTRIBUTING.md](./CONTRIBUTING.md). Architecture, contracts
and ADRs live in [docs/SSD.md](./docs/SSD.md); the task → files map is in
[docs/CODEMAP.md](./docs/CODEMAP.md).

### Deployments

| Surface   | URL                                                                                      | Workflow                                                       |
| --------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Landing   | [libs.andersseen.dev](https://libs.andersseen.dev/)                                      | [`deploy-landing.yml`](./.github/workflows/deploy-landing.yml) |
| Docs      | [docs.andersseen.dev](https://docs.andersseen.dev/)                                      | [`deploy-docs.yml`](./.github/workflows/deploy-docs.yml)       |
| Demo      | [and-web-components-demo.pages.dev](https://and-web-components-demo.pages.dev)           | [`deploy-demo.yml`](./.github/workflows/deploy-demo.yml)       |
| Storybook | [and-web-components-storybook.pages.dev](https://and-web-components-storybook.pages.dev) | manual — `pnpm deploy:storybook`                               |

All four run on Cloudflare Pages. See
[.github/DEPLOYMENT.md](./.github/DEPLOYMENT.md).

### Releasing

Versioning is [Changesets](https://github.com/changesets/changesets)-driven and
publishing only happens in CI:

```bash
pnpm changeset      # describe your change
# commit, open a PR, merge to main
```

Merging to `main` runs [`release.yml`](./.github/workflows/release.yml), which
either opens a `chore: version packages` PR or — once that PR merges — publishes
the newly-versioned packages. Don't run `pnpm release` or `pnpm publish`
locally; it bypasses Changesets and causes version drift.

## License

[MIT](./LICENSE) © Andersseen
