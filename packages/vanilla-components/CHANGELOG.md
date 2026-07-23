# @andersseen/vanilla-components

> **This changelog is maintained by hand.** The package is excluded from
> Changesets (see `ignore` in `.changeset/config.json`), so `pnpm changeset` and
> `pnpm version-packages` will not touch this file or bump the version — that is
> deliberate, because this is an experimental proof of concept that must not
> ride along with the rest of the stack's release cadence. When you change this
> package, add an entry here yourself and bump `version` in `package.json`
> manually. See `docs/AGENT-PLAYBOOKS.md` P7.

## 0.0.2

Versioning correction plus the accessibility and lifecycle fixes that the audit
turned up. **Breaking relative to the mistaken `1.0.0`** — see below.

### Versioning

- **Dropped from `1.0.0` to `0.0.2`.** The `1.0.0` was published in error and
  implied a maturity this package does not have: it ships 3 components against
  the 25 in `@andersseen/web-components` and exists only to prove that
  `@andersseen/headless-components` can drive plain Custom Elements with no
  runtime dependencies. `0.0.1` and `0.1.0` are already taken on npm, so `0.0.2`
  is the next free number in the `0.0.x` line.
- Excluded from the Changesets release flow, so it no longer gets minor bumps or
  ride-along releases when the rest of the stack ships.
- README now opens with an experimental warning pointing at
  `@andersseen/web-components`.

### Fixed

- **`and-vanilla-modal` destroyed its own content when moved in the DOM.**
  `connectedCallback` fires again on every re-insertion, and it re-read
  `childNodes` into the content backup — which is empty while the modal is
  closed. Relocating the element (something Angular structural directives, React
  reconciliation and Astro islands all do) permanently wiped the author's
  markup. The content is now held in a `DocumentFragment` captured exactly once,
  and moved in and out of the rendered body rather than re-derived.
- **Escape did not close the modal.** `modalLogic.handleKeyDown` was never
  called from anywhere — the headless `closeOnEscape` policy existed but had no
  listener behind it. There is now a `keydown` listener, removed on disconnect.
- **No focus management.** Opening left focus on `<body>`; Tab wandered out of
  the dialog and never came back. Focus now moves to the first focusable element
  (preferring `[autofocus]`), Tab and Shift+Tab cycle inside the dialog, and
  focus is restored to whatever opened it.
- **No body scroll lock.** The page behind the modal scrolled freely. Now
  reference-counted and scrollbar-width compensated, so nested overlays don't
  clobber each other's cleanup and the page doesn't shift.
- **No accessible name.** The dialog announced nothing. Set `label`, or slot a
  heading (`<h1>`–`<h6>`) and it is adopted as `aria-labelledby` automatically.

### Added

- `label` attribute on `and-vanilla-modal`.
- Server-safe import. `class X extends HTMLElement` is evaluated at module load,
  so merely importing this package threw `HTMLElement is not defined` in any SSR
  build (Astro, Next, a Node script). The classes now extend a server-safe base
  and `defineAndComponents()` is a no-op without a DOM.

### Requires

- `@andersseen/headless-components` `>=0.3.0`. `createModal` no longer invents a
  generic `aria-label: 'Dialog'`; it omits the attribute unless a label is
  configured, which is why this package now supplies its own name.

## 1.0.0

> Published in error and superseded by `0.0.2`. This version number does not
> reflect maturity — it was produced by a Changesets peer-dependency bump, not
> by a deliberate stability decision.

### Patch Changes

- Updated dependencies [b7e1634]
- Updated dependencies [6972daf]
  - @andersseen/headless-components@0.2.0

## 0.1.0

### Minor Changes

- bc6b1e7: Move Angular wrappers into the monorepo and add React/Vue wrapper
  packages
  - Relocated `@andersseen/angular-components` from
    `apps/angular-workspace/projects/angular-components` to
    `packages/angular-components` so it is a first-class pnpm workspace package
    published via Changesets.
  - Added auto-generated `@andersseen/react-components` and
    `@andersseen/vue-components` packages produced by Stencil output targets.
  - Updated `stencil.config.ts`, root `package.json` build scripts
    (`build:angular`, `build:react`, `build:vue`, `build:all`), CI workflows,
    and `.gitignore` for the new wrapper locations.
  - Renamed all library custom events to the single `and<Component><Action>`
    convention (e.g. `andInputChange`, `andInputBlur`, `andSelectBlur`,
    `andModalClose`, `andNavItemClick`, `andNavLinkClick`,
    `andMobileMenuChange`, `andResponsiveStageChange`, `andTabTriggerClick`) and
    updated every test, story, demo, and README reference.
