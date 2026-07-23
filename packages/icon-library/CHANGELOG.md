# @andersseen/icon

## 0.1.0

### Minor Changes

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

## 0.0.3

### Patch Changes

- Standardized dual module exports, unified ESLint flat config, configured
  testing pipelines, and fixed Stencil component hydration bugs for Angular
  integration.

## 0.0.2

### Patch Changes

- add icons and and-select
