# Agent Guide for and-web-components

This document helps AI agents understand how to work safely and effectively in
this monorepo.

## Architecture Overview

This is a **pnpm workspace** with a layered component architecture:

```
headless-core    →  Pure TypeScript state machines & a11y logic (no UI)
     ↓
web-components   →  StencilJS custom elements that consume headless-core
     ↓
angular-components → Auto-generated Angular wrappers (via Stencil output target)
```

Satellite packages (used by all layers):

- `icon-library` — SVG icon registry with tree-shaking
- `motion-core` — Attribute-driven animation system
- `layout-core` — CSS layout primitives compiled from SCSS

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
4. **Do not add runtime dependencies to `web-components` lightly.** It ships to
   browsers. Every KB matters.

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
3. `web-components` (depends on 1 and 2)
4. `motion-core`
5. `layout-core`
6. `angular-workspace` (depends on 3, 4, 5)

Use `pnpm build:all` from root to build everything.

## Testing

- **Headless tests**: `pnpm test:headless` (Vitest)
- **Stencil unit tests**: `pnpm -C packages/web-components test:spec` (Jest via
  Stencil)
- **Stencil e2e tests**: `pnpm -C packages/web-components test` (Puppeteer —
  deprecated in Stencil v5)

If you add a new headless component, you **must** add Vitest tests. If you add a
new Stencil component, add at least a `.spec.tsx` file.

## Publishing

This repo uses **Changesets**, not Lerna.

```bash
pnpm changeset   # select changed packages
pnpm version-packages
pnpm release
```

## Common Mistakes to Avoid

1. **Do not import `@andersseen/headless-components` into headless-core
   itself.** That's a circular dependency.
2. **Do not use `let state = {...}` in headless-core.** Use `createStore`.
3. **Do not add DOM queries inside headless-core.** The headless layer must be
   testable in Node.js without `jsdom`.
4. **Do not modify
   `apps/angular-workspace/projects/angular-components/src/lib/stencil-generated/`
   manually.** These files are auto-generated by Stencil.
5. **Do not commit without running `pnpm lint`.** Husky will block the commit if
   Prettier/ESLint fails.

## Package Boundaries

| Package             | Can depend on                                  |
| ------------------- | ---------------------------------------------- |
| `headless-core`     | Nothing in this repo (only dev deps)           |
| `icon-library`      | Nothing in this repo                           |
| `motion-core`       | Nothing in this repo                           |
| `layout-core`       | Nothing in this repo                           |
| `web-components`    | `headless-core`, `icon-library`, `motion-core` |
| `angular-workspace` | All `packages/*`                               |
| `astro-landing`     | All `packages/*`                               |
