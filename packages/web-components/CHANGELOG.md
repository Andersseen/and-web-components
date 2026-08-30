# @andersseen/web-components

## 0.5.0

### Minor Changes

- e83f2c7: Fixed real, browser-verified defects found while adding R2.7b's
  Playwright coverage for and-dropdown, and-tabs, and-accordion, and-tooltip,
  and-carousel, and-menu-list, and-context-menu, and and-drawer:
  - **Breaking:** renamed `and-menu-list`'s `ariaMenuLabel` prop /
    `aria-menu-label` attribute to `menuLabel` / `menu-label`. The old name was
    an invalid ARIA attribute (`aria-*` is reserved for the standard vocabulary)
    and was flagged as a critical `aria-valid-attr` violation by axe; the new
    name matches `and-context-menu`'s existing `menuLabel` convention.
  - Fixed a systemic bug where several headless modules (`dropdown`,
    `accordion`, `tooltip`, `menu-list`, `drawer`) passed raw JS booleans for
    `aria-*` props. Stencil serializes a boolean passed to a non-native
    attribute as an HTML boolean attribute (`true` → empty-string attribute,
    `false` → attribute removed) instead of the literal `"true"`/`"false"`
    strings ARIA requires — so `aria-expanded`, `aria-disabled`, `aria-hidden`,
    and `aria-modal` were rendering as invalid or missing in real browsers
    despite looking correct in mock-doc specs. All five modules now emit
    `'true' | 'false'` string literals, matching the already-correct pattern in
    `select.ts`/`tabs.ts`.
  - `and-tabs`: a per-tab `disabled` trigger blocked clicks but not
    ArrowKey/Home/End navigation (which auto-activates it in the default
    `automatic` mode) and never reflected `aria-disabled`. Disabled triggers are
    now excluded from keyboard navigation and correctly expose `aria-disabled`.
  - `and-tabs`: `<and-tabs orientation="vertical">` never propagated to the
    child `<and-tabs-list>`, which kept its own default and reported
    `aria-orientation="horizontal"` even though arrow-key navigation correctly
    used the vertical direction.
  - `and-drawer`: removed the invented `"Drawer"` fallback name so an unlabeled
    drawer gets no accessible name at all (matching `and-modal`'s existing
    behavior) instead of a meaningless empty `aria-label`.
  - `and-drawer`: fixed a race where a bare `requestAnimationFrame` could focus
    nothing on open because Stencil hadn't yet committed the "open" render
    (slotted content was still `aria-hidden`) — deferred to
    `componentDidRender`, the same fix already applied to `and-modal`.
  - `and-drawer`: focus was never restored to the trigger when closing via
    Escape, the overlay, or the close button (only closing by setting the `open`
    prop externally worked) — a re-entrancy ordering bug in the `open`-prop
    watcher. Fixed by restoring focus directly from the close callback, after
    releasing the background's `inert` state (an inert element cannot be
    focused).
  - `and-menu-list`: with `items` provided (its documented "focus managed for
    you" mode), no item ever got `tabindex="0"`, making the whole menu
    unreachable by sequential Tab navigation — this also silently affected the
    standalone `and-menu-item`, which shares the same engine. Roving focus now
    defaults to the first enabled item.
  - `and-menu-list`: arrow-key navigation updated the visual/ARIA "active" state
    but never moved real DOM focus, because the `ref` callback that used to call
    `.focus()` only fires when a list node is first created, not on state-driven
    re-renders of an existing node. Focus now follows the roving tabindex
    explicitly on every keydown.
  - `and-dropdown`: disabled menu items had no `aria-disabled`, so axe correctly
    flagged their dimmed, low-contrast text as a real violation (nothing marked
    them as an inactive, contrast-exempt component). Added, matching
    `and-context-menu`'s existing pattern.
  - `and-accordion`: removed `aria-controls` from the trigger — it referenced an
    `id` on `and-accordion-content`, a sibling Stencil component in a
    _different_ shadow tree, so the ID reference could never resolve (same root
    cause as the `and-modal` `aria-labelledby` fix from R2.11/TD-15; verified
    live via axe's critical `aria-valid-attr-value` violation). `aria-expanded`
    and DOM adjacency still convey the relationship.
  - Fixed misleading JSDoc `@example`s on `and-dropdown`, `and-context-menu`,
    and `and-menu-list` that showed `items='[...]'` as an HTML attribute string
    — that crashes at runtime (`this.items.map is not a function`); `items` has
    always been property-only (the generated docs table already said
    `Attribute: --`).

### Patch Changes

- Updated dependencies [e83f2c7]
  - @andersseen/headless-components@0.4.0

## 0.4.2

### Patch Changes

- f9213b5: Fix three real correctness bugs in `and-select` and `and-modal`,
  found by driving the built `dist/` output in real browsers (Chromium, Firefox,
  WebKit) rather than by reading specs:
  - `and-select`: a disabled select (via the `disabled` prop, not just
    `<fieldset disabled>`) could still contribute a stale value to `FormData`,
    and `required` had no real effect at all — the previous hidden
    `<input type="hidden">` form mirror is unconditionally barred from
    constraint validation per the HTML spec, so nothing ever blocked submission
    or showed native validation UI. The mirror is now a visually hidden,
    focusable native `<select>` (`sr-only`, `tabindex="-1"`), which correctly
    participates in `disabled`/`required` constraint validation while staying
    out of the normal tab order. Also fixed: clicking an option with the mouse
    left the menu open (only keyboard `Enter` closed it) — selecting a value now
    closes the menu the same way regardless of input method.
  - `and-modal`: an unnamed dialog (no `label` prop, no slotted heading)
    rendered `aria-label="Dialog"`, a generic invented name that let real
    authoring mistakes silently pass accessibility checks. That fallback is
    removed — an unnamed modal now has no accessible name at all, with a
    one-time console warning as a development-time diagnostic. Separately, the
    existing "adopt a slotted heading" mechanism used `aria-labelledby` pointing
    at the heading's `id`, which cannot resolve across the shadow/light DOM
    boundary in real browsers (verified live: the computed accessible name was
    empty despite a "resolved" attribute) — it now reads the heading's text
    directly into `aria-label` instead, which works reliably in every engine and
    no longer mutates the slotted heading's `id`.

  A new permanent Playwright suite (`packages/web-components/e2e/`, Chromium +
  Firefox + WebKit) plus `@axe-core/playwright` accessibility checks now covers
  these fixes and the existing form-participation behavior of `and-input`,
  `and-switch`, and `and-button type="submit"/"reset"` in real browsers,
  runnable via `pnpm -C packages/web-components test:e2e`.

- Updated dependencies [f9213b5]
- Updated dependencies [f9213b5]
  - @andersseen/headless-components@0.3.1

## 0.4.1

### Patch Changes

- 54ec775: Stop `component-base.css` from silently overriding each component's
  own `:host` display.

  Stencil concatenates `styleUrls` in array order, and nine components listed
  `../../global/component-base.css` _after_ their own stylesheet — so the base
  sheet's closing `:host { display: block }` won the cascade against whatever
  the component had just declared. `and-button`, `and-context-menu`,
  `and-dropdown` and `and-switch` asked for `inline-block` and rendered as
  full-width blocks; `and-modal` and `and-drawer` asked for `display: contents`
  and rendered as block boxes, adding a phantom item inside flex/grid parents.
  (`and-badge`, `and-card-header` and `and-card-footer` were saved by a utility
  class on the host, so they change nothing visually, but their declarations
  were just as dead.)

  The base stylesheet now comes first in all nine, so a component's own `:host`
  rule wins. `src/__tests__/host-display.test.ts` enforces the ordering for any
  component declaring a non-`block` host display.

  Note for consumers: buttons, dropdowns, context menus and switches are now
  inline-level again, so adjacent ones flow on the same line instead of
  stacking. `and-button` also documents how to get a full-width button
  (`class="w-full"`, or `::part(button)`), since there is no `full` prop.

- Updated dependencies [cd75c61]
- Updated dependencies [435da1f]
  - @andersseen/icon@0.1.1

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
