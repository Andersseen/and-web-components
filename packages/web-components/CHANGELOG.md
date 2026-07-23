# @andersseen/web-components

## 0.4.0

### Minor Changes

- af4ceee: Fix five accessibility and form-participation defects found by
  driving the built components in a real browser. All are verified by new
  regression tests (the focus-trap suite fails 5/5 against the previous
  implementation).

  **`and-button` now participates in forms.** The real `<button>` lives in the
  component's shadow root, so it has no form owner and implicit submission never
  reached the enclosing `<form>` — `type="submit"` was silently inert. The click
  handler now resolves the associated form and calls `requestSubmit()` /
  `reset()`, preserving native constraint validation and the cancellable
  `submit` event. Adds a `form` prop mirroring the native `form` attribute.

  **The modal/drawer focus trap now spans slotted content.** It was a flat
  `shadowRoot.querySelectorAll()`, which sees neither slotted light-DOM content
  nor focusables nested inside another component's shadow root — in practice the
  trap collapsed to "the close button" and Shift+Tab from the first field
  escaped the dialog into the page behind it. The trap now walks the composed
  tree (slots and nested shadow roots), tracks the deep active element so
  `delegatesFocus` components compare correctly, pulls stray focus back in, and
  prefers `[autofocus]`. Hidden-ness is no longer decided by `offsetParent`,
  which is always null for the `position: fixed` content of an overlay.

  **`andModalClose` now fires exactly once per close.** The close sequence wrote
  `open`, which re-entered the `@Watch` and started a second close — emitting
  the event twice and replaying the exit animation when `animated` was set.
  Focus restoration, which never ran on the animated path, now runs on every
  path.

  **Modal now locks body scroll and makes the background `inert`.** Both are
  reference-counted / self-restoring so nested overlays don't clobber each
  other's cleanup; the drawer's previous `body.style.overflow = ''` reset leaked
  a scrollable body as soon as a second overlay was involved. Scrollbar width is
  compensated so the page doesn't shift.

  **Modals are no longer all announced as "Dialog".** `and-modal` gains `label`,
  and when it is unset a slotted heading is adopted as `aria-labelledby`
  automatically. `createModal` no longer invents a generic `aria-label` — it now
  omits the attribute unless a label is configured, so an unnamed dialog fails
  an audit instead of passing one while announcing nothing useful.

  Also in this release:
  - `and-modal` exposes `closeOnEscape`, `closeOnOverlayClick` and `hideClose`
    props (the headless logic already supported the first two, but nothing
    surfaced them), plus `show()` / `hide()` methods.
  - `and-modal`, `and-button` and `and-input` expose CSS `part`s (`overlay`,
    `container`, `content`, `close-button`, `button`, `link`, `input`) so
    consumers can restyle internals through the shadow boundary.
  - `createInput` emits ARIA state attributes as the strings `'true'`/`'false'`
    instead of booleans. A boolean `true` serialised to `aria-required=""`,
    which is not a valid ARIA boolean and was read as the default (false).
    `and-input` no longer renders empty `aria-label` / `aria-describedby`
    attributes.

### Patch Changes

- Updated dependencies [af4ceee]
- Updated dependencies [4034c3c]
  - @andersseen/headless-components@0.3.0
  - @andersseen/motion@0.2.0
  - @andersseen/icon@0.1.0

## 0.3.0

### Minor Changes

- 5dd2d20: `and-input` now resyncs its value with a wrapping `<form>` after a
  native `form.reset()`. Its inner `<input>` already renders in light DOM as a
  real descendant of the form, so `FormData`, `required` validation, and
  Enter-to-submit worked natively already — the only gap was that a native reset
  changed the visible input's value without notifying the component, leaving its
  internal state stale. Also adds an "In a form" Storybook story demonstrating
  submit and reset.
- b7e1634: Adds `and-switch`, a boolean on/off toggle. Renders in light DOM
  around a real `<input type="checkbox" role="switch">`, so `FormData`, native
  `required` validation, `<fieldset disabled>`, keyboard (Space), and
  label-click-to-toggle all work natively with no extra wiring — the visible
  track/thumb are styled purely off the checkbox's own `:checked`/`:disabled`
  state via Tailwind `peer-*` variants. Also resyncs on native `form.reset()`,
  the same fix already shipped for `and-input` and `and-select`. Adds the new
  `createSwitch` headless factory (`@andersseen/headless-components/switch`),
  spec tests, a Storybook "In a form" story, and a docs page.
- bfcecb9: Makes Tailwind optional at the consumer end: adds `./tokens.css`
  (pure design tokens, no `@tailwind`, no Preflight reset), `./elements.css`
  (the same host utility classes `style.css` ships, without Preflight), and a
  shareable `./tailwind-preset` so apps that already use Tailwind can map
  `bg-primary` / `rounded-lg` / `t-gap-*` to the library's tokens without
  copying config. `style.css` is unchanged and still supported.

  Also fixes a theming gap: switching style themes at runtime via the documented
  `and-theme` attribute (e.g. `<html and-theme="playful">`) only set 6
  structural tokens, while the static `themes/styles/*.css` imports set ~36
  (including `--theme-navbar-*`, `--theme-sidebar-*`, `--theme-carousel-*`,
  motion timings). The two are now kept in sync, so runtime theme switching
  produces the full effect. `borderRadius` (`rounded-md`/`rounded-sm`) now
  scales proportionally from `--radius` instead of fixed pixel offsets, so
  themes with a larger base radius (e.g. `playful`) differentiate their radius
  steps more clearly.

- 6972daf: `and-select` now resyncs its value with a wrapping `<form>` after a
  native `form.reset()`. It already renders in light DOM with a hidden
  `<input type="hidden">` mirroring `value` as a real descendant of the form, so
  `FormData` and `<fieldset disabled>` worked natively already — the gap was
  that Stencil re-stamps the hidden input's `value` attribute on every
  selection, dragging its native reset-default along with it, so a form reset
  previously restored the _last selected_ value instead of the true default.
  Fixed with the same `reset`-listener pattern as `and-input`, plus a new
  `setSelectedValue` headless action for restoring "no selection". Also adds an
  "In a form" Storybook story demonstrating submit, reset, and
  `fieldset[disabled]`.

### Patch Changes

- Updated dependencies [b7e1634]
- Updated dependencies [6972daf]
  - @andersseen/headless-components@0.2.0

## 0.2.0

### Minor Changes

- 907cf76: Publish host utility styles in the global stylesheet and expose the
  stable `@andersseen/web-components/style.css` import path, removing the need
  for consumer Tailwind `@source` configuration. Add short `/colors` subpath
  imports for selecting any bundled color theme. Add namespaced `and-color`,
  `and-theme`, and `and-mode` document attributes while retaining the previous
  `data-*` selectors as deprecated compatibility aliases. Fix the published lazy
  and CommonJS loader entrypoints, remove stale source backup code, and add
  coverage for navbar, select, and sidebar. Clean up obsolete type escapes in
  the Stencil adapter layer.

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
