# Agent Guide for and-web-components

This document helps AI agents understand how to work safely and effectively in
this monorepo.

**Companion documents:**

- [docs/SSD.md](./docs/SSD.md) — full architecture spec, package contracts,
  ADRs, and machine-checkable invariants (self-check your change against §13).
- [docs/CODEMAP.md](./docs/CODEMAP.md) — "task → files" lookup table.
- [docs/AGENT-PLAYBOOKS.md](./docs/AGENT-PLAYBOOKS.md) — step-by-step recipes
  with verification commands and Definition of Done per task type.

## Architecture Overview

This is a **pnpm workspace** with a layered component architecture:

```
headless-core    →  Pure TypeScript state machines & a11y logic (no UI)
     ↓
web-components   →  StencilJS custom elements that consume headless-core
     ↓
angular-components → Auto-generated Angular wrappers (via Stencil output target)

headless-core    →  Pure TypeScript state machines & a11y logic (no UI)
     ↓
vanilla-components → Zero-runtime-dependency native Custom Elements (optional @andersseen/motion)
```

Satellite packages (used by all layers):

- `icon-library` — SVG icon registry with tree-shaking
- `motion-core` — Attribute-driven animation system + imperative `MotionPlayer`
- `layout-core` — CSS layout primitives compiled from SCSS
- `behaviors` — Framework-agnostic DOM behaviors driven by `and-*` attributes
  (splitter, drag & drop, tooltip, dialog). Unlike `headless-core` (pure state
  machines, no DOM), these attach interaction directly onto existing elements
  via `defineBehaviors()` or imperative `create*` factories. Zero runtime deps.

Framework-specific integrations:

- `astro` — Official Astro integration that injects custom element and icon
  registration scripts automatically

## Golden Rules

1. **Headless-core must remain framework-agnostic.** Never import Stencil,
   React, Angular, or DOM APIs into `packages/headless-core`. It only uses pure
   TypeScript and can run in Node.js.
2. **All headless components must use `StateStore`.** Never use mutable
   `let state` in new headless components. Import `createStore` from
   `../utils/store` and use it consistently.
3. **Stencil components must subscribe to headless stores if external mutation
   is possible.** Use the `renderTick` pattern (see `and-button.tsx`) or
   callbacks (`onOpenChange`, `onValueChange`) to trigger re-renders.
4. **Do not add runtime dependencies to `web-components` or `vanilla-components`
   lightly.** They ship to browsers. Every KB matters. `vanilla-components` must
   keep zero production dependencies.

## Adding a New Headless Component

Location: `packages/headless-core/src/<component-name>/<component-name>.ts`

Required exports:

- `create<Component>(config?)` factory function
- `<Component>Config` interface
- `<Component>State` interface
- `<Component>Return` interface with:
  - `state: Readonly<...>`
  - `subscribe(callback): () => void`
  - `actions: { ... }`
  - `get*Props(): ...` helpers for ARIA and data attributes

Pattern to follow:

```ts
import { createStore } from '../utils/store';

export interface MyState {
  isOpen: boolean;
}

export function createMyComponent(config = {}) {
  const store = createStore<MyState>({
    isOpen: config.defaultOpen ?? false,
  });

  const open = () => store.setState({ isOpen: true });
  const close = () => store.setState({ isOpen: false });

  return {
    get state() {
      return store.state;
    },
    subscribe: cb => store.subscribe(s => cb(s)),
    actions: { open, close },
    getProps: () => ({ 'data-state': store.state.isOpen ? 'open' : 'closed' }),
  };
}
```

Write tests in
`packages/headless-core/src/<component>/__tests__/<component>.test.ts` using
Vitest.

## Adding a New Stencil Component

Location: `packages/web-components/src/components/and-<name>/and-<name>.tsx`

Rules:

- Use `@andersseen/headless-components` for state logic. Do not inline state
  machines.
- If the headless component has reactive state that changes internally (toggle,
  open/close), add a `renderTick` `@State()` and subscribe in
  `componentWillLoad()`.
- Use `cva` + `cn` for Tailwind classes (this is the established convention).
- Add a spec test in the same folder: `and-<name>.spec.tsx`.
- If the component is interactive (modal, dropdown, tabs), consider adding an
  e2e test.

## StateStore (Critical)

`packages/headless-core/src/utils/store.ts`

- Uses a lightweight pub/sub implementation. **Do not** use native `EventTarget`
  — it breaks in Stencil's mock-doc test environment.
- Always call `store.setState({ partial })` to mutate. Direct property
  assignment will not notify subscribers.
- `store.state` returns a frozen snapshot.

## Tailwind Version Policy

- `packages/web-components` uses **Tailwind v3** with PostCSS via
  `@stencil-community/postcss`.
- Apps (`angular-workspace`, `astro-landing`) use **Tailwind v4**.
- **Do not attempt to migrate Stencil to Tailwind v4.** Tailwind v4's CSS-first
  architecture is incompatible with Stencil's per-component Shadow DOM build
  pipeline.
- If you need new design tokens, add them to
  `packages/web-components/tailwind.config.js` and
  `packages/web-components/src/global/themes.css`.

## Build Order

Dependencies must build in this order:

1. `headless-core`
2. `icon-library`
3. `motion-core`
4. `web-components` (depends on 1, 2 and 3)
5. `vanilla-components` (depends on 1 and 3)
6. `layout-core`
7. `angular-workspace` (depends on 3, 4, 5, 6)

Use `pnpm build:all` from root to build everything.

## Testing

- **Headless tests**: `pnpm test:headless` (Vitest)
- **Stencil unit tests**: `pnpm -C packages/web-components test:spec`
- **Vanilla component tests**: `pnpm -C packages/vanilla-components test`
  (Vitest)
- **Motion tests**: `pnpm -C packages/motion-core test` (Vitest)
- **Layout tests**: `pnpm -C packages/layout-core test` (Vitest, build-output
  smoke test — needs `pnpm build:layout` first)
- **Icon tests**: `pnpm -C packages/icon-library test` (Vitest)
- **Behaviors tests**: `pnpm test:behaviors` (Vitest, jsdom)
- **Framework adapter smoke tests**: `pnpm -C packages/angular-components test`,
  `pnpm -C packages/react-components test`,
  `pnpm -C packages/vue-components test` (Vitest — need `pnpm build:stencil`
  first)
- **Stencil e2e tests**: `pnpm -C packages/web-components test` (Puppeteer —
  deprecated in Stencil v5)

If you add a new headless component, you **must** add Vitest tests. If you add a
new Stencil component, add at least a `.spec.tsx` file. If you add a new vanilla
component, add a Vitest test in `packages/vanilla-components/src/components/`.

## Publishing

This repo uses **Changesets**, not Lerna.

```bash
pnpm changeset   # select changed packages
pnpm version-packages
pnpm release
```

## Animation

`packages/motion-core` provides two APIs:

- `MotionController` — attribute-driven animations triggered by scroll, hover or
  tap (`and-motion`, `and-motion-trigger`).
- `createMotionPlayer(element)` — imperative player for component-level
  open/close animations (modal, drawer, toast, accordion, etc.). Use it from
  `web-components` or `vanilla-components` when you need to play an animation
  programmatically.

When adding an `animated` prop to a Stencil component, wire it through
`packages/web-components/src/utils/animation.ts` and keep the DOM present while
exit animations run (use an `isClosing` flag).

## Adding a Vanilla Component

Location: `packages/vanilla-components/src/components/vanilla-<name>.ts`

- Consume `@andersseen/headless-components` for state and a11y props.
- **Do not add runtime dependencies.** `vanilla-components` ships with zero
  production dependencies; `@andersseen/motion` must be loaded dynamically only
  when the `animated` attribute is present (see `src/utils/motion-loader.ts`).
- Keep the public API surface small: expose attributes/props/events that match
  the equivalent Stencil component when one exists.
- Add a Vitest test next to the component file.

## Common Mistakes to Avoid

1. **Do not import `@andersseen/headless-components` into headless-core
   itself.** That's a circular dependency.
2. **Do not use `let state = {...}` in headless-core.** Use `createStore`.
3. **Do not add DOM queries inside headless-core.** The headless layer must be
   testable in Node.js without `jsdom`.
4. **Do not modify `packages/angular-components/src/lib/stencil-generated/`
   manually.** These files are auto-generated by Stencil.
5. **Run `pnpm lint` before pushing.** Husky only runs Prettier via lint-staged;
   ESLint is gated in CI, so verify locally to avoid a failing CI run.

## Package Boundaries

| Package              | Can depend on                                                          |
| -------------------- | ---------------------------------------------------------------------- |
| `headless-core`      | Nothing in this repo (only dev deps)                                   |
| `icon-library`       | Nothing in this repo                                                   |
| `motion-core`        | Nothing in this repo                                                   |
| `layout-core`        | Nothing in this repo                                                   |
| `web-components`     | `headless-core`, `icon-library`, `motion-core`                         |
| `vanilla-components` | None in this repo (peer deps: `headless-core`, optional `motion-core`) |
| `behaviors`          | Nothing in this repo (only dev deps; zero runtime deps)                |
| `angular-workspace`  | All `packages/*`                                                       |
| `astro-landing`      | All `packages/*`                                                       |
| `astro`              | `web-components`, `icon-library` (peer/dev only)                       |
