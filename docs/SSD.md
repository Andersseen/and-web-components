# Software Specification & Design Document (SSD)

**Project:** Andersseen Web Components (`and-web-components`) **Status:** Living
document — update when architecture, contracts, or tooling change. **Audience:**
Human contributors and AI agents (including small/less-capable models).
Everything here is written to be actionable without prior context.

> **If you are an AI agent, read this first:** this document is the source of
> truth for _what the system is_ and _why it is built this way_. For _where
> files live_, see [CODEMAP.md](./CODEMAP.md). For _step-by-step task recipes_,
> see [AGENT-PLAYBOOKS.md](./AGENT-PLAYBOOKS.md). For hard rules, see
> [AGENTS.md](../AGENTS.md).

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Goals and Non-Goals](#2-goals-and-non-goals)
3. [System Context and Repository Topology](#3-system-context-and-repository-topology)
4. [Architecture](#4-architecture)
5. [Package Specifications](#5-package-specifications)
6. [Design System Specification](#6-design-system-specification)
7. [Component Contract Specification](#7-component-contract-specification)
8. [Reactive State Model](#8-reactive-state-model)
9. [Build System and Toolchain](#9-build-system-and-toolchain)
10. [Testing Strategy](#10-testing-strategy)
11. [CI/CD and Release Engineering](#11-cicd-and-release-engineering)
12. [Quality Attributes](#12-quality-attributes)
13. [Invariants — Machine-Checkable Rules](#13-invariants--machine-checkable-rules)
14. [Architecture Decision Records (ADRs)](#14-architecture-decision-records-adrs)
15. [Known Gaps and Technical Debt Register](#15-known-gaps-and-technical-debt-register)
16. [Glossary](#16-glossary)

---

## 1. Product Overview

Andersseen Web Components is a **framework-agnostic UI component ecosystem**
published as independent npm packages under the `@andersseen/` scope. It
provides:

- **~24 accessible UI components** (`and-button`, `and-modal`, `and-tabs`, …)
  built with **StencilJS** and Shadow DOM.
- A **headless core**: pure-TypeScript state machines with ARIA/keyboard logic
  and zero UI, consumable from any framework or vanilla JS.
- A **design token system** (HSL-based CSS custom properties) with light/dark
  modes and ~10 prebuilt themes.
- Satellite libraries: **icons** (87 tree-shakeable SVG icons), **motion**
  (attribute-driven animations + imperative player), **layout**
  (attribute-driven CSS utilities).
- Framework adapters: auto-generated **Angular** standalone directives and an
  official **Astro integration**.
- A parallel **vanilla-components** package: zero-runtime-dependency native
  Custom Elements built on the same headless core.

Consumers range from plain `<script type="module">` HTML pages (via unpkg CDN)
to bundled Angular/Astro/Vite applications.

### 1.1 Positioning: product core, foundation, and adapters

Andersseen is a stack of independently-publishable packages, not a single
library. Three tiers, in order of what most consumers touch first:

1. **Product core** — packages a typical consumer installs directly:
   `@andersseen/web-components`, `@andersseen/icon`, `@andersseen/motion`,
   `@andersseen/layout`, `@andersseen/behaviors`. Each ships its own design
   decisions and can be adopted alone (e.g. `@andersseen/layout` is pure CSS
   with zero JS and zero in-repo dependencies — see §4.2).
2. **Foundation** — `@andersseen/headless-components`
   (`packages/headless-core`). The single source of behavioral truth (state,
   a11y, keyboard) that `web-components` and `vanilla-components` are built on.
   It is strong and reusable on its own for advanced consumers building a custom
   rendering layer, but it is not the primary integration point for a typical
   website — most consumers should reach for `web-components` or
   `vanilla-components` instead.
3. **Framework adapters** — `@andersseen/angular-components`,
   `@andersseen/react-components`, `@andersseen/vue-components`,
   `@andersseen/astro`. Thin, mostly-generated wrappers around `web-components`
   (see ADR-7). They exist for framework ergonomics, follow `web-components`'
   release cadence, and should not carry independent roadmap weight.

This tiering does not change the dependency rules in §4.2 — it is a
consumer-facing framing of the same graph, useful when deciding where a new
feature or doc belongs.

### Deployed surfaces

| Surface                    | Source                    | URL                                              |
| -------------------------- | ------------------------- | ------------------------------------------------ |
| Storybook (component docs) | `packages/web-components` | `https://and-web-components-storybook.pages.dev` |
| Landing page               | `apps/astro-landing`      | `https://and-web-components-landing.pages.dev`   |
| Demo app (full showcase)   | `apps/angular-workspace`  | `https://and-web-components-demo.pages.dev`      |

All three deploy to **Cloudflare Pages**.

---

## 2. Goals and Non-Goals

### Goals

- **G1 — Framework agnosticism.** Every piece of UI logic must be usable from
  Angular, React, Vue, Svelte, Astro, or plain HTML without adapters (headless
  layer) or with thin generated wrappers (Stencil layer).
- **G2 — Accessibility as a baseline, not a feature.** Correct ARIA
  roles/attributes, keyboard navigation, focus management, and
  `prefers-reduced-motion` support are mandatory in every interactive component.
- **G3 — Small runtime footprint.** Browser-shipped packages minimize
  dependencies. `vanilla-components` has a hard zero-production-dependency
  requirement.
- **G4 — Consistent theming.** All visual styling flows through semantic HSL
  design tokens (`--and-*` / shadcn-style tokens like `--primary`), never
  hardcoded colors.
- **G5 — Independent versioning.** Each package releases on its own cadence via
  Changesets.
- **G6 — Agent-friendly codebase.** Conventions are uniform enough that a new
  component can be added by following an existing one as a template.

### Non-Goals

- **NG1** — Supporting Tailwind v4 inside the Stencil package (incompatible with
  per-component Shadow DOM build; see ADR-4).
- **NG2** — Hand-written framework wrappers beyond Stencil's generated output
  targets. React and Vue consumers are served by auto-generated thin wrappers,
  not maintained by hand.
- **NG3** — SSR/hydration guarantees for the Stencil components (no
  `dist-hydrate-script` output target is configured).
- **NG4** — Supporting ES5 / legacy browsers (`buildEs5: false`).

---

## 3. System Context and Repository Topology

This is a **pnpm workspace monorepo**. Workspace globs: `packages/*` and
`apps/*` (defined in `pnpm-workspace.yaml`).

```
and-web-components/
├── packages/                     # Publishable libraries
│   ├── headless-core/            # @andersseen/headless-components — state machines, a11y logic
│   ├── web-components/           # @andersseen/web-components — Stencil UI components
│   ├── vanilla-components/       # @andersseen/vanilla-components — zero-dep Custom Elements
│   ├── angular-components/       # @andersseen/angular-components — generated Angular standalone directives
│   ├── react-components/         # @andersseen/react-components — generated React wrappers
│   ├── vue-components/           # @andersseen/vue-components — generated Vue wrappers
│   ├── icon-library/             # @andersseen/icon — 87 SVG icons + registry
│   ├── motion-core/              # @andersseen/motion — animation system
│   ├── layout-core/              # @andersseen/layout — SCSS→CSS attribute-driven layout
│   └── astro/                    # @andersseen/astro — Astro integration
├── apps/                         # Non-published applications
│   ├── angular-workspace/        # Angular CLI workspace
│   │   └── projects/
│   │       └── demo-app/             # Component showcase
│   └── astro-landing/            # Marketing/landing site (Astro + Playwright e2e)
├── docs/                         # ← You are here (SSD, CODEMAP, PLAYBOOKS)
├── .github/
│   ├── workflows/                # ci-cd.yml, release.yml, deploy-demo.yml, deploy-landing.yml
│   ├── scripts/                  # deploy.sh, analyze-bundle.js
│   ├── skills/and-component/     # Component-authoring skill for AI agents
│   └── DEPLOYMENT.md             # Deploy runbook
├── scripts/fix-esm-extensions.cjs  # Adds .js extensions to ESM output of tsc
├── AGENTS.md                     # Hard rules for AI agents
├── package.json                  # Root orchestration scripts (build:*, deploy:*, release)
└── pnpm-workspace.yaml
```

**Important subtlety:** `@andersseen/angular-components` lives under
`packages/angular-components` and is a first-class pnpm workspace package. The
old location (`apps/angular-workspace/projects/angular-components`) is no longer
used. All three framework wrapper packages (Angular, React, Vue) contain
auto-generated code under `stencil-generated/` directories that must never be
hand-edited.

---

## 4. Architecture

### 4.1 Layered architecture

```
┌───────────────────────────────────────────────────────────────────┐
│  Consumers: HTML pages · Angular apps · Astro sites · any bundler │
└───────────────┬───────────────────────────────┬───────────────────┘
                │                               │
   ┌────────────▼─────────────┐   ┌─────────────▼──────────────┐
   │ @andersseen/             │   │ @andersseen/               │
   │ angular-components       │   │ astro (integration)        │
   │ (generated wrappers)     │   │ (injects registration)     │
   └────────────┬─────────────┘   └─────────────┬──────────────┘
                │                               │
   ┌────────────▼─────────────┐   ┌─────────────▼──────────────┐
   │ @andersseen/             │   │ @andersseen/               │
   │ react-components         │   │ vue-components             │
   │ (generated wrappers)     │   │ (generated wrappers)       │
   └────────────┬─────────────┘   └─────────────┬──────────────┘
                │                               │
   ┌────────────▼───────────────────────────────▼──────────────┐
   │ @andersseen/web-components (StencilJS, Shadow DOM,        │
   │ Tailwind v3 + CVA, ~25 components)                        │
   └──────┬───────────────┬───────────────┬────────────────────┘
          │               │               │
┌─────────▼─────┐ ┌───────▼──────┐ ┌──────▼────────┐
│ @andersseen/  │ │ @andersseen/ │ │ @andersseen/  │
│ headless-     │ │ icon         │ │ motion        │
│ components    │ │ (registry)   │ │ (animations)  │
└─────────┬─────┘ └──────────────┘ └──────┬────────┘
          │                               │
   ┌──────▼───────────────────────────────▼───────────┐
   │ @andersseen/vanilla-components                    │
   │ (native Custom Elements, zero runtime deps;      │
   │  motion loaded dynamically only when `animated`) │
   └───────────────────────────────────────────────────┘

Standalone (no repo dependencies): @andersseen/layout (pure CSS)
```

### 4.2 Dependency rules (enforced by convention — violating them is a rejected change)

| Package                   | May depend on (in-repo)                                               |
| ------------------------- | --------------------------------------------------------------------- |
| `headless-core`           | **nothing** (pure TypeScript, no DOM, runs in Node)                   |
| `icon-library`            | nothing                                                               |
| `motion-core`             | nothing                                                               |
| `layout-core`             | nothing                                                               |
| `web-components`          | `headless-core`, `icon-library`, `motion-core`                        |
| `vanilla-components`      | `headless-core` (peer), `motion-core` (optional, dynamic import only) |
| `astro`                   | `web-components`, `icon-library` (peer/dev only)                      |
| `angular-components`      | `web-components` (peer)                                               |
| `react-components`        | `web-components` (peer), `@stencil/react-output-target`               |
| `vue-components`          | `web-components` (peer), `@stencil/vue-output-target`                 |
| `angular-workspace` (app) | everything in `packages/*`                                            |
| `astro-landing` (app)     | everything in `packages/*`                                            |

### 4.3 Data flow within a component

1. **Headless layer** (`headless-core`): a `create<Component>()` factory owns
   state in a `StateStore` (pub/sub). It exposes `state` (frozen snapshot),
   `actions`, `subscribe()`, and `get*Props()` helpers that return ARIA/data
   attributes.
2. **Rendering layer** (`web-components` or `vanilla-components`): instantiates
   the headless factory in `componentWillLoad()` (Stencil) or
   `connectedCallback()` (vanilla), subscribes to the store, and re-renders on
   change. Stencil components use the **`renderTick` pattern**: a numeric
   `@State()` incremented inside the subscription callback to force re-render.
3. **Events out**: Stencil components emit `and*` custom events (`andOpen`,
   `andChange`, …) _after_ state updates, with `bubbles: true, composed: true`
   so they cross Shadow DOM boundaries.
4. **Styling**: Tailwind utility classes composed via **CVA**
   (`class-variance-authority`) + `cn()` (clsx + tailwind-merge). All colors
   resolve through CSS custom properties.
5. **Animation**: components with an `animated` prop wire through
   `packages/web-components/src/utils/animation.ts`, which uses
   `createMotionPlayer` from `motion-core`. Exit animations keep the DOM mounted
   using an `isClosing` flag until the animation finishes.

---

## 5. Package Specifications

### 5.1 `@andersseen/headless-components` (`packages/headless-core`)

- **Purpose:** framework-agnostic state machines + accessibility logic. The
  single source of behavioral truth.
- **Hard constraints:** no DOM APIs, no framework imports, no
  `document`/`window`. Must be testable in plain Node (Vitest,
  `environment: node`). No in-repo dependencies (circular-dependency ban).
- **Modules (19):** accordion, alert, breadcrumb, button, carousel,
  context-menu, drawer, dropdown, input, machine (generic state-machine util),
  menu, menu-list, modal, navbar, select, sidebar, tabs, toast, tooltip. Shared:
  `types/common.ts`, `utils/store.ts` (StateStore), `utils/id.ts`.
- **Required exports per module:** `create<X>(config?)`, `<X>Config`,
  `<X>State`, `<X>Return` (with `state`, `subscribe`, `actions`, `queries` where
  useful, and `get*Props()` helpers). See `src/template.ts.example`.
- **Build:** `tsc` (ESM) → `scripts/fix-esm-extensions.cjs` (appends `.js` to
  relative imports) → `tsc -p tsconfig.cjs.json` (CJS into `dist-cjs`). Dual
  ESM/CJS via `exports` map; each component also has a subpath export
  (`@andersseen/headless-components/button`).
- **Testing:** Vitest, tests in `src/<component>/__tests__/`. Coverage is
  mandatory for new modules.

### 5.2 `@andersseen/web-components` (`packages/web-components`)

- **Purpose:** the styled, shippable UI layer. StencilJS custom elements use
  Shadow DOM by default. Form controls that rely on native light-DOM form
  participation (`and-input`, `and-select`) are documented exceptions using
  scoped styles.
- **Runtime dependencies (keep minimal):** `@andersseen/headless-components`,
  `@andersseen/icon`, `@andersseen/motion` (workspace), plus
  `class-variance-authority`, `clsx`, `tailwind-merge`.
- **Components (25 folders):** accordion, alert, badge, breadcrumb, button,
  card, carousel, code, context-menu, control, drawer, dropdown, icon, input,
  menu-list, modal, navbar, pagination, select, sidebar, skeleton, switch, tabs,
  toast, tooltip. Compound components (e.g. `and-accordion-item`) live in the
  parent's folder.
- **Per-component files:** `and-<name>.tsx` (logic), `and-<name>.css` (`:host`
  custom properties only), `and-<name>.stories.ts` (Storybook),
  `and-<name>.spec.tsx` (Vitest spec), and optionally `and-<name>.types.ts`.
  Puppeteer-based `*.e2e.ts` tests were removed (deprecated in Stencil v5).
  `readme.md` files are auto-generated by Stencil (`docs-readme` target) — never
  edit by hand.
- **Stencil output targets** (see `stencil.config.ts`):
  - `dist` (lazy-loading distribution + `loader/`)
  - `dist-custom-elements` with `auto-define-custom-elements` (tree-shakeable
    per-component imports; a post-build script `scripts/generate-all-barrel.cjs`
    produces `components/all`)
  - `docs-readme`, `docs-custom-elements-manifest` (`custom-elements.json`)
  - `angularOutputTarget` → writes generated wrappers into
    `packages/angular-components/src/lib/stencil-generated/` (**never edit those
    files manually**)
- **Styling pipeline:** Tailwind **v3** via `@stencil-community/postcss` per
  component; global styles in `src/global/` (`document.css` is the Stencil
  `globalStyle`; also `themes.css`, `palettes.css`, `animations.css`,
  `component-base.css`). Prebuilt theme CSS files live in `themes/` and are
  exported as package subpaths (`@andersseen/web-components/retro`, …).
- **Bundling:** explicit `bundles` in `stencil.config.ts` group related
  components (e.g. modal+drawer). When adding a component, add it to an
  appropriate bundle.
- **Testing:** Vitest with `@stencil/vitest` (`environment: 'stencil'`), two
  projects: `spec` (component specs) and `integration` (`src/__tests__/`). Note
  the vitest alias maps `@andersseen/icon` to `../icon-library/dist/index.js` —
  **the icon library must be built before running these tests**
  (`scripts/ensure-built.cjs` guards this for `pnpm test`).

### 5.3 `@andersseen/vanilla-components` (`packages/vanilla-components`)

- **Purpose:** proof that headless-core works without any framework, and a
  minimal-footprint alternative for consumers who want zero runtime
  dependencies.
- **Hard constraints:** **zero production dependencies.** `@andersseen/motion`
  may only be loaded via dynamic `import()` when the element has the `animated`
  attribute (see `src/utils/motion-loader.ts`). Public API (attributes/events)
  should mirror the equivalent Stencil component.
- **Current components:** `vanilla-button`, `vanilla-accordion`, `vanilla-modal`
  — each with a colocated Vitest test.

### 5.4 `@andersseen/icon` (`packages/icon-library`)

- **Purpose:** 87 SVG icons as string constants + a global registry consumed by
  `and-icon`.
- **API:** `registerIcon(name, svg)`, `registerAllIcons()`, per-icon named
  exports for tree-shaking.
- **Build:** same tsc dual ESM/CJS pattern as headless-core.

### 5.5 `@andersseen/motion` (`packages/motion-core`)

- **Purpose:** two animation APIs sharing one CSS keyframe base
  (`src/core.css`):
  1. `MotionController` / `initMotion()` — declarative, attribute-driven
     (`and-motion="fade-in"`, `and-motion-trigger="enter|hover|tap"`,
     `and-motion-duration`, `and-motion-delay`), IntersectionObserver-based
     scroll triggers.
  2. `createMotionPlayer(element)` — imperative open/close player used by
     modal/drawer/toast/accordion in the rendering layers.
- **Constraints:** must respect `prefers-reduced-motion`; no in-repo
  dependencies.

### 5.6 `@andersseen/layout` (`packages/layout-core`)

- **Purpose:** pure-CSS, attribute-driven layout/typography utilities
  (`and-layout="horizontal gap:md"`, `and-text="h2 weight:bold"`, responsive
  modifiers `cols@md:2`).
- **Build:** SCSS (`src/*.scss`) compiled to a single distributable CSS file. No
  JavaScript runtime.

### 5.7 `@andersseen/astro` (`packages/astro`)

- **Purpose:** Astro integration that injects component/icon registration
  scripts. Options: `components: 'all' | string[]` (list preserves
  tree-shaking), `icons: boolean`.

### 5.8 `@andersseen/angular-components` (`packages/angular-components`)

- **Purpose:** standalone Angular directives generated by Stencil's
  `angularOutputTarget`. Human-authored code is limited to packaging; everything
  in `src/lib/stencil-generated/` is regenerated on every Stencil build.
- **Build:** `ng-packagr` via `pnpm build:angular`.
- **Integration:** first-class pnpm workspace package; published through
  Changesets alongside the other `packages/*` libraries.

### 5.9 `@andersseen/react-components` (`packages/react-components`)

- **Purpose:** thin React wrappers generated by Stencil's `reactOutputTarget`,
  re-exporting every custom element as a typed React component.
- **Build:** `tsc` via `pnpm build:react`.
- **Integration:** first-class pnpm workspace package; published through
  Changesets.

### 5.10 `@andersseen/vue-components` (`packages/vue-components`)

- **Purpose:** thin Vue 3 wrappers generated by Stencil's `vueOutputTarget`,
  re-exporting every custom element as a typed Vue component.
- **Build:** `tsc` via `pnpm build:vue`.
- **Integration:** first-class pnpm workspace package; published through
  Changesets.

---

## 6. Design System Specification

### 6.1 Token layers

1. **Palette tokens** (`src/global/palettes.css`): raw HSL triplets per named
   palette, switched via the namespaced `and-color` attribute on `<html>`.
2. **Semantic tokens** (`src/global/themes.css` + `themes/*.css`): `--primary`,
   `--primary-foreground`, `--background`, `--foreground`, `--accent`,
   `--destructive`, `--ring`, `--radius`, etc. Values are **bare HSL component
   triplets** (`243 75% 59%`) consumed as `hsl(var(--primary))` — this enables
   opacity modifiers like `bg-primary/90` in Tailwind.
3. **Component tokens**: each component exposes overridable `--<component>-*`
   custom properties with defaults in its `and-<name>.css` `:host` block.

### 6.2 Theming rules

- Public document API: `and-color` selects a palette, `and-theme` selects
  shape/density, and `and-mode` selects light/dark mode. `.dark` remains a
  supported dark-mode shorthand; legacy `data-*` names are compatibility-only.
- Prebuilt themes: `packages/web-components/themes/*.css` (default, compact,
  elegant, playful, retro, emerald-orange, indigo-rose, rose-teal, slate-amber,
  violet-cyan), each importable via a package subpath export.
- New design tokens go in **two places**:
  `packages/web-components/tailwind.config.js` (so Tailwind classes exist) and
  `packages/web-components/src/global/themes.css` (so the variable has a value).

### 6.3 Styling constraints

- **Never** hardcoded colors or raw Tailwind palette classes (`bg-blue-500`)
  inside components — only semantic token classes (`bg-primary`,
  `text-muted-foreground`).
- **Never** magic z-index values — use the `--and-z-*` scale.
- **CVA is mandatory** for any component with visual variants; merge classes
  with `cn()` (`src/utils/cn.ts`).
- External styling escape hatches: CSS `::part()` attributes and `:host`-level
  custom properties — never a `className` prop.

---

## 7. Component Contract Specification

Every Stencil component must define its contract in this order (see
`.github/skills/and-component/SKILL.md` for the authoring workflow):

1. **Props** — typed, defaulted, `@Prop({ reflect: true })` when CSS attribute
   selectors need them; `mutable: true` only when internal mutation is required.
   No `any`.
2. **Events** — named `and<Component><Action>` in camelCase (`andButtonClick`,
   `andModalClose`, `andInputChange`), payload typed, emitted **after** state
   changes, `bubbles + composed`. See SKILL.md for the full rule and rationale.
3. **Slots** — standard names: default, `trigger`, `prefix`/`start`,
   `suffix`/`end`, `header`, `footer`, `empty`. Documented with JSDoc.
4. **Parts** — `part="..."` on internal elements that consumers may style.
5. **CSS custom properties** — `--<component>-*` with defaults on `:host`.
6. **Methods** — public `@Method()`s like `show()`/`hide()`/`toggle()` where
   imperative control makes sense.
7. **ARIA & keyboard** — role/aria attributes come from the headless
   `get*Props()` helpers; keyboard map documented per component (↑↓ navigate,
   Enter/Space select, Esc close, Home/End jump, Tab per WAI-ARIA authoring
   practices).

**Accessibility baseline (non-negotiable):**

- Focus returns to the trigger when an overlay closes.
- Modals/drawers trap focus (`src/utils/focus-trap.ts`).
- `aria-expanded`/`aria-haspopup`/`aria-controls` wired on triggers.
- Disabled state uses `aria-disabled` (host) in addition to native `disabled`.
- All animations honor `prefers-reduced-motion`.
- Avoid nested interactive elements — `and-button` demonstrates the pattern of
  hoisting `role`/`tabindex` off the host onto the inner element.

**Lifecycle hygiene:**

- Instantiate headless logic in `componentWillLoad()`; store the unsubscribe
  function; call it in `disconnectedCallback()`.
- Every `document`/`window` listener added must be removed in
  `disconnectedCallback()`.
- Props that mirror headless state need `@Watch()` handlers forwarding changes
  to headless `actions`.

---

## 8. Reactive State Model

`packages/headless-core/src/utils/store.ts` defines `StateStore<T>`:

- **Pub/sub via a plain `Set` of listeners** — deliberately _not_ `EventTarget`,
  which breaks in Stencil's mock-doc test environment (see ADR-3).
- `store.state` returns a **frozen shallow copy** — mutation attempts are silent
  no-ops; always go through `setState`.
- `setState(partial)` performs **shallow reference equality** per key and skips
  notification when nothing changed. Consequence: mutating a nested object and
  calling `setState` with the same reference will **not** notify — replace
  nested objects instead.
- Subscribers receive `(state, prev)` both frozen.

Rendering-layer integration patterns (in order of preference):

1. **Callbacks in config** (`onOpenChange`, `onValueChange`) when the wrapper
   only needs specific transitions.
2. **`renderTick` pattern** when external mutation is possible:
   `@State() renderTick = 0;` +
   `this.unsubscribe = logic.subscribe(() => this.renderTick++);`.

---

## 9. Build System and Toolchain

### 9.1 Toolchain versions

- **Node.js** 22 in CI (README says 20+ for local; `engines.node` is `>=20`).
- **pnpm** 10 (pinned via `packageManager` field; use `corepack enable`).
- **TypeScript** ~5.9, **Stencil** ~4.x, **Tailwind v3** (Stencil package) /
  **v4** (apps), **Vitest** 4, **Storybook** 10 (manager/theming APIs come from
  the `storybook` core package), **ESLint** 10 flat config, **Prettier** 3.
- `packages/web-components` keeps `lit` as a devDependency because all Storybook
  stories use `html` / `ifDefined` from it.

### 9.2 Build order (dependency-driven, do not reorder)

```
1. headless-core     →  2. icon-library  →  3. motion-core
        └────────────────────┬──────────────────┘
                             ▼
                    4. web-components        5. vanilla-components (needs 1,3)
                             ▼
        6. angular-components / react-components / vue-components (need 4)
                             ▼
7. layout-core (independent)  →  8. angular demo-app (needs 3,4,5,6,7)
```

Root scripts encode this: `build:stencil` = headless + icons + motion +
web-components; `build:all` = build:stencil + layout + vanilla + angular +
react + vue.

### 9.3 Root script inventory (source of truth: root `package.json`)

| Script                                                                                                                                    | What it does                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `pnpm build:all`                                                                                                                          | Full dependency-ordered build                           |
| `pnpm build:stencil`                                                                                                                      | headless → icons → motion → Stencil                     |
| `pnpm build:headless` / `build:icons` / `build:motion` / `build:layout` / `build:vanilla` / `build:angular` / `build:react` / `build:vue` | Individual packages                                     |
| `pnpm start:demo` / `start:demo:dev`                                                                                                      | Angular demo (full build / watch mode)                  |
| `pnpm start:astro:dev` / `build:astro`                                                                                                    | Landing page dev/build                                  |
| `pnpm test:headless`                                                                                                                      | Headless Vitest suite                                   |
| `pnpm lint` / `lint:fix` / `format` / `format:check`                                                                                      | Quality gates (recursive)                               |
| `pnpm storybook` / `build-storybook`                                                                                                      | Storybook dev/build                                     |
| `pnpm changeset` / `version-packages` / `release`                                                                                         | Changesets flow                                         |
| `pnpm deploy:storybook` / `deploy:landing` / `deploy:cloudflare` / `deploy:all`                                                           | Cloudflare Pages deploys (local, need `wrangler login`) |

### 9.4 Special build machinery

- `scripts/fix-esm-extensions.cjs` — post-processes tsc ESM output to append
  `.js` to relative import specifiers (Node ESM requirement). Used by
  headless-core, icon-library, motion-core, vanilla-components.
- `packages/web-components/scripts/generate-all-barrel.cjs` — generates the
  `components/all` barrel after Stencil build.
- `packages/web-components/scripts/ensure-built.cjs` — guards test runs against
  missing sibling `dist/` outputs.
- Husky pre-commit runs `lint-staged` → Prettier on staged files.

---

## 10. Testing Strategy

| Layer               | Runner                                                | Location                                                  | Command                                        |
| ------------------- | ----------------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| Headless logic      | Vitest (node env)                                     | `packages/headless-core/src/*/__tests__/`                 | `pnpm test:headless`                           |
| Stencil specs       | Vitest + `@stencil/vitest` (`environment: 'stencil'`) | `packages/web-components/src/components/*/and-*.spec.tsx` | `pnpm -C packages/web-components test:spec`    |
| Stencil integration | Vitest (node env)                                     | `packages/web-components/src/__tests__/`                  | part of `pnpm -C packages/web-components test` |
| Vanilla components  | Vitest                                                | colocated `*.test.ts`                                     | `pnpm -C packages/vanilla-components test`     |
| Motion              | Vitest                                                | colocated `*.test.ts`                                     | `pnpm -C packages/motion-core test`            |
| Landing e2e         | Playwright                                            | `apps/astro-landing`                                      | `pnpm test:e2e:landing`                        |
| Stencil e2e         | Puppeteer (**deprecated in Stencil**, do not extend)  | `*.e2e.ts`                                                | avoid                                          |

**Rules for contributors (including agents):**

- New headless module ⇒ Vitest tests are **mandatory**.
- New Stencil component ⇒ at least one `.spec.tsx` **and** one `.stories.ts`.
- New vanilla component ⇒ colocated Vitest test.
- Stencil spec tests require `icon-library` (and siblings) to be built first —
  run `pnpm build:stencil` once before testing.

**Current coverage gaps (as of 2026-07-16):** headless coverage is complete. All
25 Stencil components have specs and stories. All three framework adapter
packages now have a minimal Vitest smoke test asserting their public API surface
is non-empty and every exported wrapper is defined:
`pnpm -C packages/angular-components test`,
`pnpm -C packages/react-components test`,
`pnpm -C packages/vue-components test`. These are smoke tests, not behavioral
coverage — they still rely on TypeScript compilation (`pnpm build:angular`,
`pnpm build:react`, `pnpm build:vue`) to catch type-level regressions.

---

## 11. CI/CD and Release Engineering

### 11.1 Workflows (`.github/workflows/`)

| Workflow             | Trigger                          | Does                                                                                                                                                                      |
| -------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ci-cd.yml`          | push to main/develop, PR to main | lint → `build:all` → headless tests → Stencil spec tests → vanilla tests → motion tests → upload artifacts; then deploy Storybook to Cloudflare Pages (main/develop only) |
| `release.yml`        | push to main                     | `pnpm build:all`, then `changesets/action` opens a "version packages" PR or publishes to npm (`NPM_TOKEN`)                                                                |
| `deploy-demo.yml`    | push to main                     | `pnpm deploy:cloudflare:actions` (Angular demo)                                                                                                                           |
| `deploy-landing.yml` | push to main                     | `pnpm deploy:landing:actions` (Astro landing)                                                                                                                             |

### 11.2 Release flow (Changesets — the only sanctioned path)

1. Make changes; run `pnpm changeset` and select affected packages + bump type.
2. Merge to main. `release.yml` opens/updates a "chore: version packages" PR.
3. Merging that PR triggers actual npm publish.

Changesets ignores `@andersseen/astro-landing` and `angular-workspace` (apps).
Everything else in `packages/*` — including the new
`@andersseen/angular-components`, `@andersseen/react-components`, and
`@andersseen/vue-components` — is publishable with `access: public`.

The legacy `publish:headless` / `publish:web-components` root scripts (direct
`pnpm publish --no-git-checks` with a hardcoded `/private/tmp` npm cache) were
removed. They bypassed Changesets and could cause version drift. Use the
Changesets flow above for every release.

### 11.3 Required repository secrets

`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `NPM_TOKEN`.

---

## 12. Quality Attributes

- **Accessibility:** WAI-ARIA authoring-practice compliance per component;
  Storybook has `@storybook/addon-a11y` enabled — check the a11y panel when
  developing stories.
- **Bundle size:** browser packages treat every KB as a cost. New runtime
  dependencies to `web-components`/`vanilla-components` require explicit
  justification. Icons and custom elements must remain tree-shakeable (per-icon
  exports; `dist-custom-elements` per-component files).
- **Performance:** animations are CSS-driven with JS orchestration only; scroll
  triggers use `IntersectionObserver`; component bundles grouped to reduce
  duplicate chunks.
- **Browser support:** evergreen browsers only; no ES5.
- **Documentation:** component `readme.md` and `custom-elements.json` are
  generated — documentation lives in JSDoc on props/events/slots/parts, which
  must be written for every public API member.

---

## 13. Invariants — Machine-Checkable Rules

An agent can validate its own change against this list before finishing. Each
rule is phrased so a simple grep/check can verify it.

1. `packages/headless-core/src/**` contains no `import` from `@stencil/core`,
   `@angular/*`, `react`, `vue`, and no references to `document.` or `window.`
   (id/util helpers must stay DOM-free).
2. `packages/headless-core/src/**` never imports
   `@andersseen/headless-components` (self-import = circular).
3. New headless state uses `createStore` from `../utils/store` — no
   `let state = {...}` module-level mutable state, no `new EventTarget()`.
4. `packages/vanilla-components/package.json` has **no** `dependencies` key (or
   an empty one). `@andersseen/motion` appears only under
   `peerDependencies`/`optionalDependencies` and is loaded via dynamic
   `import()`.
5. Every `@Component` decorator in `packages/web-components` has `shadow: true`
   (or `shadow: { delegatesFocus: true }`) — never `scoped: true`.
6. No `@Prop() ... : any` anywhere. No `className` prop. No `innerHTML`
   assignment.
7. Every `addEventListener` on `document`/`window` in a component has a matching
   removal in `disconnectedCallback()`.
8. No raw Tailwind color classes (`bg-blue-500`, `text-red-*`) and no hex/rgb
   literals in component classes/styles — only semantic tokens.
9. Custom events are named `and[A-Z]...` and typed via `EventEmitter<T>`.
10. Files under `packages/angular-components/src/lib/stencil-generated/`,
    `packages/react-components/src/components/stencil-generated/`,
    `packages/vue-components/src/components/stencil-generated/`,
    `packages/web-components/src/components/*/readme.md`, and
    `packages/web-components/src/components.d.ts` are never hand-edited.
11. New Stencil components appear in a `bundles` entry in `stencil.config.ts`
    and follow the `and-<name>` tag convention.
12. Tailwind v4 syntax (`@theme`, `@import "tailwindcss"`) never appears inside
    `packages/web-components`.
13. Each new headless module ships tests; each new Stencil component ships
    `.spec.tssx`-style spec + story.
14. Commits pass `pnpm lint` and `pnpm format:check`.

---

## 14. Architecture Decision Records (ADRs)

### ADR-1: StencilJS for the UI layer

**Decision:** build components with Stencil rather than Lit or hand-written
Custom Elements. **Rationale:** compiler-driven output (lazy `dist`,
tree-shakeable `dist-custom-elements`), built-in TypeScript/JSX DX, and
first-class output targets for framework wrappers (Angular today, extensible
later). Docs generation (`docs-readme`, custom-elements manifest) comes free.

### ADR-2: Headless core as a separate package

**Decision:** all behavior/state/a11y logic lives in `headless-core`; rendering
layers are thin. **Rationale:** one implementation of tricky logic (focus,
keyboard, state transitions) reused by Stencil and vanilla layers; testable in
Node without DOM; usable directly by any framework. This is the project's core
differentiator — protect it.

### ADR-3: `StateStore` pub/sub instead of `EventTarget`

**Decision:** custom Set-based listener store. **Rationale:** `EventTarget`
breaks under Stencil's mock-doc test environment; a plain Set is smaller,
synchronous, and dependency-free. Frozen snapshots prevent accidental external
mutation.

### ADR-4: Tailwind v3 pinned in the Stencil package; v4 allowed in apps

**Decision:** do not migrate `packages/web-components` to Tailwind v4.
**Rationale:** Tailwind v4's CSS-first architecture is incompatible with
Stencil's per-component Shadow DOM PostCSS pipeline
(`@stencil-community/postcss`). Apps (Angular, Astro) build normal global CSS
and can use v4.

### ADR-5: Changesets with independent versioning

**Decision:** Changesets over Lerna/fixed versioning. **Rationale:** packages
evolve at different speeds (icons vs. components);
`updateInternalDependencies: patch` keeps workspace links consistent; the
bot-driven "version packages" PR gives a review gate before publish.

### ADR-6: Dual ESM/CJS via two tsc passes + extension fixer

**Decision:** for the plain-TS packages, emit ESM with `tsc`, patch extensions
with `fix-esm-extensions.cjs`, then emit CJS into `dist-cjs/`. **Rationale:**
avoids a bundler dependency for simple libraries while satisfying both Node ESM
resolution and legacy `require()` consumers.

### ADR-7: Generated Angular, React, and Vue wrapper packages

**Decision:** move `@andersseen/angular-components` into `packages/` as a
first-class workspace package and add `@stencil/react-output-target` and
`@stencil/vue-output-target` to generate `packages/react-components` and
`packages/vue-components`. **Rationale:**

1. **One release flow.** All wrapper packages now participate in Changesets and
   are built by the same `pnpm build:all` orchestration, eliminating the
   undocumented/manual Angular publish path.
2. **Framework parity.** Consumers can install thin, typed wrappers for Angular,
   React, and Vue without writing their own custom-element bindings.
3. **Generated, not maintained.** The wrapper source is regenerated on every
   Stencil build; hand-edits are forbidden (see invariant §13.10), keeping
   maintenance cost near zero as the component set grows.
4. **Workspace simplicity.** Keeping the Angular library under `packages/`
   removes the special-case `apps/angular-workspace/projects/*` layout and lets
   `ng-packagr` build against workspace-resolved `@andersseen/web-components`.

---

## 15. Known Gaps and Technical Debt Register

Tracked here so agents don't "fix" them accidentally in unrelated PRs — pick
them up as explicit tasks.

| ID    | Area               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Severity |
| ----- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| TD-1  | Docs drift         | ~~README component table lists 20 components; source has 23 (`and-code`, `and-select`, `and-skeleton` missing from table). Structure diagram omits `vanilla-components` and `astro` packages.~~ Resolved (2026-07-13): README table now lists all 24 components (added `and-control`); component counts corrected to 24 across README/SSD; stale `apps/angular-workspace/projects/angular-components` path references corrected to `packages/angular-components` in AGENTS.md, CODEMAP.md, SSD.md.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Medium   |
| TD-2  | Docs drift         | ~~`.github/DEPLOYMENT.md` describes a 5-job `ci-cd.yml`; the real pipeline is split across 4 workflow files and releases via Changesets, not "version bump commits".~~ Resolved: `DEPLOYMENT.md` already documents the real 4-workflow pipeline (`ci-cd.yml` with `build-and-test`/`deploy-storybook` jobs, `release.yml`, `deploy-demo.yml`, `deploy-landing.yml`) and the Changesets release flow; verified against `.github/workflows/*.yml` on 2026-07-13.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Low      |
| TD-3  | Tests              | ~~Headless `carousel`, `input`, `menu` now tested; only `and-code` lacks a spec and story because `and-code.tsx` source does not exist yet.~~ Resolved (2026-07-13): `and-code.tsx`, `and-code.spec.tsx`, and `and-code.stories.ts` all exist; all 24 Stencil components have specs and stories (see §10).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Low      |
| TD-4  | Release            | ~~Legacy `publish:*` root scripts bypass Changesets (`--no-git-checks`, hardcoded `/private/tmp` npm cache).~~ Resolved (verified 2026-07-14): root `package.json` contains no `publish:*` scripts; the only publish paths are `release` (emergency-only per README) and CI via `release.yml` + Changesets.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | High     |
| TD-5  | Packaging          | ~~`@andersseen/angular-components` sits outside the pnpm workspace and the Changesets flow; its versioning/publishing path is undocumented.~~ Resolved: moved to `packages/angular-components`; React/Vue wrappers added; all three built by `build:all` and published via Changesets (ADR-7).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | High     |
| TD-6  | Repo hygiene       | ~~Committed `.DS_Store` files; one-off codemods `migrate-store.mjs`, `refactor-stories.mjs` at repo root; `debug-storybook.log`, `storybook-static/`, `playwright-report/` present locally (ignored but clutter). `.DS_Store` not in `.gitignore`.~~ Resolved (2026-07-13): no `.DS_Store` tracked (`git ls-files` clean), no codemods at repo root; local clutter files remain gitignored only.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Low      |
| TD-7  | Dependencies       | ~~`packages/web-components` mixes Storybook 10 core with `@storybook/manager-api`/`@storybook/theming` v8; leftover `jest`, `jest-cli`, `@types/jest`, `puppeteer` devDeps~~ cleaned up in Phase 4. Root `wrangler` still pinned to v3 (optional bump).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Medium   |
| TD-8  | Governance         | ~~No root `LICENSE` file (README claims MIT; only `packages/web-components` has one). No `CONTRIBUTING.md`. No `engines` field in root `package.json`.~~ Resolved (2026-07-13): root `LICENSE` and `CONTRIBUTING.md` exist; root `package.json` declares `"engines": { "node": ">=20" }`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Medium   |
| TD-9  | CI                 | ~~Pre-commit hook only runs Prettier (AGENTS.md claims ESLint too). CI does not run vanilla/motion tests. CI does not run `behaviors`, `icon-library`, `layout-core`, or the Angular/React/Vue wrapper smoke tests.~~ Resolved (2026-07-14): `build-and-test` in `.github/workflows/ci-cd.yml` now runs all nine test suites (headless, Stencil spec, vanilla, motion, behaviors, icon-library, layout-core, Angular, React, Vue) after `pnpm build:all`; all six newly-added commands verified green locally.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Medium   |
| TD-10 | A11y/docs mismatch | ~~AGENTS.md event convention (`andOpen`) vs SKILL.md examples are consistent, but some components (e.g. `and-button` emits `andButtonClick`) embed the component name — convention should be stated once, authoritatively.~~ Resolved: all events now follow the single `and<Component><Action>` convention; ambiguous names (`andInput`, `andBlur`, `andClose`, `navItemClick`, etc.) were renamed and all references updated. See SKILL.md §Event Naming Convention and SSD §7.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Low      |
| TD-11 | Bundle size        | `@stencil/angular-output-target@1.4.0` (latest, verified 2026-07-13) writes all ~37 wrappers to one `directivesProxyFile` (`packages/angular-components/src/lib/stencil-generated/components.ts`), and each is decorated with `@ProxyCmp(...)`. Read `angular-component-lib/utils.ts` in the installed package: `ProxyCmp`'s decorator function calls `defineCustomElementFn()` **eagerly at class-decoration time** (confirmed in the compiled FESM output — `AndButton = __decorate([ProxyCmp({ defineCustomElementFn: ... })], AndButton)` with no `/*@__PURE__*/`). That's a genuine side effect (registers the custom element immediately), unlike React/Vue's `createComponent`/`defineContainer`, which only store the define function and defer invocation to render time — which is why those factories can legitimately carry a `/*@__PURE__*/` annotation. No bundler can safely drop an unused wrapper as a result, and no config option (`outputType: 'scam'\|'standalone'`) changes this — both still emit to the single `directivesProxyFile`; only `dist-custom-elements`-vs-loader import source changes. Fixing this needs an upstream change to `@stencil/angular-output-target` (defer `defineCustomElementFn()` to instantiation, plus per-component file output). `apps/angular-workspace` demo-app initial bundle is 1.63 MB (budget raised to 1.7 MB warning / 3 MB error in `angular.json` as a temporary cosmetic mitigation — does not address the root cause). See AGENT-PLAYBOOKS.md or session notes for the option-b alternative (use raw `@andersseen/web-components` custom elements in `main-layout.component.ts` and the two navbar-actions components) — not applied, needs product sign-off since it touches the live demo UI. | Medium   |
| TD-12 | Forms              | ~~No native form participation.~~ Resolved (2026-07-16): both `and-input` (R1.2) and `and-select` (R1.3) use `scoped: true` (light DOM) with a real native form control (a plain `<input>` for `and-input`; a hidden mirror `<input type="hidden">` for `and-select`) as a genuine light-DOM descendant of the wrapping `<form>` — so `FormData` and `<fieldset disabled>` already worked with **zero** `ElementInternals` code, verified live in a browser both times. `shadow: true` + `ElementInternals` was never needed for either and would have broken the working mechanism. The real (and, for `and-select`, non-obvious) gap in both cases was `form.reset()`: fixed via a `reset` listener on `this.el.closest('form')` restoring the captured default (see `and-input.tsx` / `and-select.tsx`, playbook **P9** step 0). For `and-select` specifically, Stencil re-stamps the hidden input's `value` _attribute_ on every selection change, which drags the native reset-default along with it — `form.reset()` was a complete no-op before the fix, confirmed live. Every future form control (TD-13) must check P9 step 0 first — two out of two components so far turned out to need the light-DOM fix, not `ElementInternals`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | High     |
| TD-13 | Component gaps     | **Missing basic form controls:** no checkbox, radio/radio-group, textarea, or slider — in any layer (no headless module, no Stencil component, no vanilla component). `and-switch` shipped 2026-07-16 (R2.1, PLAN F3) — headless `createSwitch` + light-DOM `and-switch` wrapping a real `<input type="checkbox" role="switch">`, no `ElementInternals` needed (see P9 step 0). Each remaining control needs the full P1→P2 flow (headless module first, then Stencil), built form-associated from day one (TD-12/P9) — check P9 step 0 first, since 3/3 controls so far turned out to be the light-DOM shape, not `ElementInternals`. Suggested order by effort/value: checkbox → textarea → radio-group → slider.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | High     |
| TD-14 | Docs               | ~~No per-component user documentation site.~~ Resolved (2026-07-16, closed via PLAN.md F0): `apps/docs` (Astro Starlight, ~70 pages, dogfoods `@andersseen/astro`) already existed covering all 24+ components plus headless/motion/icon/layout/behaviors/vanilla/skills/framework-adapters, and deploys via `deploy-docs.yml`. Remaining gap was "runs in CI" — fixed by pointing `apps/docs/src/__tests__/sidebar.test.ts` at `sidebar.config.mjs` (where the sidebar actually lives; the test previously regex-scanned `astro.config.mjs` and saw zero slugs) and adding `pnpm test:docs` + `pnpm -C apps/docs build` to the `build-and-test` job in `ci-cd.yml`. See ROADMAP R2.6.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Medium   |
| TD-15 | Tests              | **No browser-level e2e and no visual regression for `web-components`.** Puppeteer e2e was removed in Phase 4 (deprecated); only mock-doc `.spec.tsx` remain, which cannot verify real focus traps, keyboard nav across shadow roots, or rendering. Playwright is already a dependency of `apps/astro-landing` — cheapest path is a small Playwright suite running against the built Storybook (`build-storybook` output) for the interactive components (modal, select, dropdown, tabs, drawer), optionally with screenshot assertions for the 6 palettes × 2 modes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Medium   |
| TD-16 | Docs               | ~~Docs API tables are hand-copied, not generated.~~ Resolved (2026-07-16, PLAN.md F1): added `apps/docs/src/components/ApiTables.astro`, a build-time component that reads `packages/web-components/src/components/<tag>/readme.md` and parses the generated Properties/Events/Methods/Slots/Shadow Parts/CSS Custom Properties sections directly (a small hand-rolled table/method parser, not a full markdown renderer, since Stencil's `docs-readme` output format is narrow and predictable). All 24 component pages converted from `.md` to `.mdx` and now render `<ApiTables tag="and-x" />` instead of a pasted table. The 6 compound components that share a directory across multiple `@Component` tags (and-accordion, and-breadcrumb, and-card, and-carousel, and-menu-list, and-tabs) — whose generated `readme.md` only documents the last-processed tag — use `<ApiTables tag="and-x" fallback>` and keep hand-written tables in the slot, with a footer explaining why. `grep -r "keep this table in sync" apps/docs/src/content` now returns nothing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Medium   |
| TD-17 | A11y / API         | **No CSS `part`s on most components.** Every shadow-DOM component styles itself from tokens only; with the shadow boundary and no `::part()` surface a consumer cannot adjust anything the token set didn't anticipate. The `class` prop exists on only some components and merges into the _root_ element, not internals. `and-modal`, `and-button` and `and-input` gained parts in the P0 hardening pass (2026-07-23); the remaining 22 components have none. Naming must be settled once and then frozen, because parts are public API. Blocker for 1.0.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | High     |
| TD-18 | Layout / API       | **Popovers are clipped by any `overflow: hidden` ancestor.** Verified live in a browser: an `and-tooltip` and an `and-select` menu inside a 240x60 clipping container are both cut off. Nothing uses a portal, the Popover API, or the top layer, so a select inside a card, table cell, or scrolling sidebar is unusable. `and-select` does its own bottom/top flip math (`updateMenuPlacement`) but stays inside the wrapper's clipping context. Affects `and-select`, `and-dropdown`, `and-tooltip`, `and-context-menu`, `and-menu-list`. Cheapest modern fix: `popover` attribute + CSS anchor positioning, keeping the current math as fallback. Blocker for 1.0.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | High     |
| TD-19 | SSR                | **No `dist-hydrate-script` output target.** `stencil.config.ts` emits `dist`, `dist-custom-elements`, docs and the three framework targets, but nothing for server rendering. Consumers of the first-party `@andersseen/astro` integration and of Angular SSR get unstyled/unhydrated markup on first paint. ROADMAP R3.4 files this as "investigate"; for a release positioned around Astro it should be decided before 1.0, not after.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Medium   |
| TD-20 | i18n               | **No RTL support.** 39 hard-coded directional Tailwind utilities (`ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`/`text-left`) across component variant maps, and zero logical equivalents (`ms-`/`me-`/`ps-`/`pe-`/`start-`/`end-`). Drawer placement, breadcrumb separators, select chevron and carousel controls all assume LTR. Migrating after 1.0 is a visual breaking change for anyone who overrode those classes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Medium   |
| TD-21 | API design         | **`options` is passed as a JSON string.** `and-select` and `and-dropdown` take `options='[{"value":...}]'` (array or JSON string). It works, but it does not compose: no icons, no option groups, no rich content, no per-option markup. The idiomatic web-component shape is slotted children (`<and-option>`), which the framework wrappers would also map onto naturally. Changing it after 1.0 is breaking, so the decision belongs before the freeze even if the migration lands later.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Medium   |
| TD-22 | Scope              | **`and-navbar` (920 lines, 14 props) and `and-sidebar` (421 lines, 10 props) are product components, not primitives.** They carry opinionated responsive staging, link models and mobile-menu behaviour inside a library positioned as a framework-agnostic base layer. They will be the first components consumers outgrow and the most expensive to keep compatible under a 1.0 stability promise. Decide before 1.0 whether they are frozen API, explicitly excluded from the freeze, or moved out of the core package.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Low      |
| TD-23 | Scope / versioning | **`@andersseen/vanilla-components` is a proof of concept published as `1.0.0`.** Corrected 2026-07-23: repo version dropped to `0.0.1`, package added to the Changesets `ignore` list (no minors, no ride-along releases), and the README now opens with an experimental warning pointing consumers at `@andersseen/web-components`. **Remaining action, outside the repo:** the mistaken `1.0.0` is still on npm and still resolves for anyone with `^1.0.0` in a lockfile — run `npm deprecate '@andersseen/vanilla-components@1.0.0' 'Published in error; this package is experimental and tracks 0.0.x. Use @andersseen/web-components.'`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Medium   |
| TD-24 | Reuse              | **`@andersseen/behaviors` solves problems `web-components` re-implements worse.** Its dialog has a focus trap, Escape, focus restoration, body scroll lock **and stacking**; its tooltip renders `position: fixed` into `<body>` with flip-on-collision, which is exactly the TD-18 clipping fix. The reusable half is now published as `@andersseen/behaviors/overlay` (`calculatePosition`, accepting a plain size so it works with no DOM). **Still open:** `web-components` does not consume it yet — doing so requires adding `@andersseen/behaviors` to the package-boundary table in AGENTS.md and migrating `and-select`/`and-dropdown`/`and-tooltip`/`and-context-menu`/`and-menu-list` (that migration is TD-18).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | High     |
| TD-25 | Purity             | **`headless-core/src/navbar/navbar.ts` touches `document.querySelector` and `window.location`.** Both are `typeof`-guarded and injectable, so it is SSR-safe in practice (verified: `createModal()` and the package import run clean in Node), but AGENTS.md golden rule #1 says "never DOM APIs in headless-core" with no exception. Either narrow the rule to "no unguarded, non-injectable DOM access" or move the resolvers into a consumer layer. Documentation/consistency issue, not a defect.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Low      |
| TD-26 | Types              | **`@andersseen/layout` ships no TypeScript types** and is still at `0.0.1`. It is pure CSS so there is no runtime API to type, but there is also no typed surface for its `and-*` layout attributes — consumers get no autocomplete or validation for the one thing the package exposes.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Low      |
| TD-27 | Tests              | **`@andersseen/mcp` has zero tests.** It ships a generated catalog (`src/catalog-generated.ts`, regenerated by the Stencil build) and an MCP server with no coverage of either.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Low      |

---

## 16. Glossary

| Term                       | Meaning                                                                                        |
| -------------------------- | ---------------------------------------------------------------------------------------------- |
| **Headless component**     | A factory (`createTabs()`) returning state + actions + ARIA prop getters, with zero rendering. |
| **StateStore**             | The repo's minimal pub/sub store (`headless-core/src/utils/store.ts`).                         |
| **renderTick pattern**     | Numeric Stencil `@State()` incremented on store notifications to force re-render.              |
| **CVA**                    | `class-variance-authority` — declarative Tailwind variant maps.                                |
| **`cn()`**                 | `clsx` + `tailwind-merge` helper for class composition.                                        |
| **Semantic token**         | Named HSL CSS variable (`--primary`) referenced as `hsl(var(--primary))`.                      |
| **Lazy dist**              | Stencil `dist` output: components load on demand via the loader.                               |
| **`dist-custom-elements`** | Stencil output of individually importable, tree-shakeable component modules.                   |
| **Changesets**             | Release tool: markdown intent files → version PR → npm publish.                                |
| **Motion trigger**         | `enter` (scroll into view), `hover`, or `tap` — values of `and-motion-trigger`.                |
