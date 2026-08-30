# @andersseen/headless-components

## 0.4.0

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

## 0.3.1

### Patch Changes

- f9213b5: Fix `machine.snapshot.event` on the generic `createMachine()`
  state-machine util: direct access via `machine.snapshot` always returned
  `event: null`, even after transitions, while a `subscribe()` callback's
  snapshot correctly carried the triggering event — two different, coexisting
  behaviors for the same documented field ("the event that caused the current
  state"). Both access paths now agree: `event` is `null` only for the initial
  snapshot and otherwise always the last event that actually caused a transition
  (a guard-blocked or unhandled `send()` never overwrites it). No type changes;
  this only fixes the previously-broken direct-access value to match the
  contract the JSDoc already described.
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
