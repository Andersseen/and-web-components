# @andersseen/web-components

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
