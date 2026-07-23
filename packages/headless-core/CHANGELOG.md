# @andersseen/headless-components

## 0.3.0

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

- 4034c3c: Follow-ups from a cross-package audit. Every item below was verified
  in a real runtime (Node or a browser), and the new tests fail against the
  previous code.

  **`StateStore` now returns a stable snapshot.** `state` rebuilt
  `Object.freeze({ ...this._state })` on every read, so two consecutive reads
  were never `Object.is`-equal. That breaks React's `useSyncExternalStore`
  contract outright ("The result of getSnapshot should be cached to avoid an
  infinite loop") and silently defeats `===` memoisation in Vue, Svelte and
  Angular OnPush — i.e. every framework this package claims to support without
  an adapter. The snapshot is now cached and invalidated only when `setState`
  actually changes something.

  **Packages no longer throw when imported or called on the server.**
  `initMotion()` and `defineBehaviors()` threw `document is not defined` in
  Node. `MotionController` now constructs inert without a DOM, and
  `defineBehaviors()` returns a no-op teardown, so shared setup code doesn't
  have to branch on the environment.

  **`@andersseen/behaviors` exposes its overlay primitives.** New
  `@andersseen/behaviors/overlay` subpath (also re-exported from the root)
  publishes `calculatePosition` — viewport-aware placement with
  flip-on-collision, the piece that lets a popover escape an `overflow: hidden`
  ancestor — plus `clamp`/`listen`/`setStyles`. `calculatePosition` now accepts
  a plain `{ width, height }` as well as an element, so it is usable before the
  popover mounts and testable with no DOM at all.

  **`prefers-reduced-motion` is tracked live.** `MotionController` read the
  media query once in its constructor and never again, so the JS layer and the
  CSS `@media` layer could disagree after the user changed the OS setting
  mid-session. It now subscribes to `change` and unsubscribes in `destroy()`.

  **Unregistered icons warn instead of failing silently.** `getIcon()` used to
  return `undefined` for a misspelled or unregistered name and render an empty
  box with no diagnostic. It now logs a one-time, non-production warning naming
  the icon and the exact `registerIcons` call to add. Tree-shaking is unaffected
  (verified with a real bundler: 306 B for one icon, 11.4 KB for all).

  **Declared `sideEffects`** on `headless-components`, `behaviors`, `motion` and
  `astro`. Without it bundlers must assume every module has side effects and
  cannot drop unused ones.

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
