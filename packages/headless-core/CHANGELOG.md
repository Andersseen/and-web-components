# @andersseen/headless-components

## 0.2.0

### Minor Changes

- b7e1634: Adds `and-switch`, a boolean on/off toggle. Renders in light DOM
  around a real `<input type="checkbox" role="switch">`, so `FormData`, native
  `required` validation, `<fieldset disabled>`, keyboard (Space), and
  label-click-to-toggle all work natively with no extra wiring — the visible
  track/thumb are styled purely off the checkbox's own `:checked`/`:disabled`
  state via Tailwind `peer-*` variants. Also resyncs on native `form.reset()`,
  the same fix already shipped for `and-input` and `and-select`. Adds the new
  `createSwitch` headless factory (`@andersseen/headless-components/switch`),
  spec tests, a Storybook "In a form" story, and a docs page.
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

## 0.1.3

### Patch Changes

- Clamp `defaultIndex` to the valid slide range when `createCarousel` is
  initialized.

## 0.1.1

### Patch Changes

- Standardized dual module exports, unified ESLint flat config, configured
  testing pipelines, and fixed Stencil component hydration bugs for Angular
  integration.
