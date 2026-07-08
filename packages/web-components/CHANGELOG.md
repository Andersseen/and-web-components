# @andersseen/web-components

## 0.1.0

### Minor Changes

- a28bb5a: Add lightweight `and-code` component for command snippets
  - Introduces `<and-code>`: a small, dependency-free code/command display
    block.
  - Supports `value`, `language` (bash/shell/npm/yarn/pnpm/text), `theme`
    (dark/light), `copyable`, `show-prompt`, and `height` props.
  - Includes one-click clipboard copy with `andCodeCopy` event.
  - Ships with Stencil spec tests and Storybook stories.

- Add `and-control` form-field wrapper and switch input/select to light DOM
  - Introduces `<and-control>`: a generic label + hint/error wrapper for any
    slotted form control, wiring `for`/`id` and `aria-describedby`
    automatically.
  - Switches `<and-input>` and `<and-select>` from Shadow DOM to scoped styles
    so their internal native inputs are real descendants of surrounding `<form>`
    elements.
  - Adds `name` prop to `<and-input>`; the existing hidden input in
    `<and-select>` now participates in native `FormData` submission.
  - Includes Stencil spec tests, Storybook stories, and demo pages.

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

### Patch Changes

- a28bb5a: Fix Angular wrapper runtime injection error (NG0203)
  - Set `preserveSymlinks: false` in `apps/angular-workspace/angular.json` so
    pnpm workspace symlinks resolve correctly and avoid duplicate
    `@angular/core` instances at runtime.
  - Mark `@andersseen/angular-components` as `sideEffects: true` to prevent
    bundlers from tree-shaking the custom-element registration side effects of
    the generated wrappers.
  - Update `@stencil/angular-output-target` to `^1.4.0`.

- 79c1d88: Mark custom element registration files as side-effectful so
  Vite/Astro production builds keep them in the client bundle. Fixes missing
  `<and-navbar>`, `<and-button>`, `<and-icon>` and other components on the
  deployed landing page.

## 0.0.9

### Patch Changes

- Updated dependencies
  - @andersseen/headless-components@0.1.3

## 0.0.8

### Patch Changes

- Fix critical accessibility violations and add Warm Gold palette:
  - **and-navbar**: apply `role="menu"` to mobile drawer container to satisfy
    `aria-required-parent` (axe-core critical)
  - **and-button**: forward host `role`/`tabindex` to inner button, add
    `delegatesFocus: true`, preventing nested interactive elements (axe-core
    serious)
  - **Color contrast**: darken `--muted-foreground` from ~46% to ~40% across all
    built-in palettes and fallback defaults to meet WCAG AA 4.5:1
  - **New palette**: add `warm-gold` — an OKLCH-derived warm amber/cream palette
    with full shade scales and verified WCAG AA contrast ratios

## 0.0.6

### Patch Changes

- updae sidebar

## 0.0.5

### Patch Changes

- a9cd5d8: fix(web-components): resolve Content Security Policy (CSP) eval
  errors by disabling Stencil's dynamic import injection shim

## 0.0.4

### Patch Changes

- Standardized dual module exports, unified ESLint flat config, configured
  testing pipelines, and fixed Stencil component hydration bugs for Angular
  integration.
- Updated dependencies
  - @andersseen/headless-components@0.1.1
  - @andersseen/icon@0.0.3
  - @andersseen/motion@0.1.1

## 0.0.3

### Patch Changes

- add icons and and-select
- Updated dependencies
  - @andersseen/icon@0.0.2

## 0.0.2

### Patch Changes

- 8a14186: test
