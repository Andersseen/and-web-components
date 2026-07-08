---
'@andersseen/web-components': major
'@andersseen/vanilla-components': major
'@andersseen/angular-components': major
'@andersseen/react-components': minor
'@andersseen/vue-components': minor
---

Move Angular wrappers into the monorepo and add React/Vue wrapper packages

- Relocated `@andersseen/angular-components` from
  `apps/angular-workspace/projects/angular-components` to
  `packages/angular-components` so it is a first-class pnpm workspace package
  published via Changesets.
- Added auto-generated `@andersseen/react-components` and
  `@andersseen/vue-components` packages produced by Stencil output targets.
- Updated `stencil.config.ts`, root `package.json` build scripts
  (`build:angular`, `build:react`, `build:vue`, `build:all`), CI workflows, and
  `.gitignore` for the new wrapper locations.
- Renamed all library custom events to the single `and<Component><Action>`
  convention (e.g. `andInputChange`, `andInputBlur`, `andSelectBlur`,
  `andModalClose`, `andNavItemClick`, `andNavLinkClick`, `andMobileMenuChange`,
  `andResponsiveStageChange`, `andTabTriggerClick`) and updated every test,
  story, demo, and README reference.
