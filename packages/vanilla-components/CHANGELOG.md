# @andersseen/vanilla-components

## 1.0.0

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
