# @andersseen/icon

## 0.1.1

### Patch Changes

- cd75c61: Fix the `lock` and `user` icons, which were each missing half their
  artwork.

  `lock` was a bare rounded rectangle with no shackle, so it rendered as an
  unrecognisable box, and `user` was only the shoulders arc with no head. Both
  now carry the full two-shape outline the rest of the set uses.

- 435da1f: Fix ten icons that drew the wrong thing, and add content tests that
  would have caught them.

  `image` was `export const IMAGE = LAYOUT` — an alias, so
  `<and-icon name="image">` painted a layout. It is now the Lucide picture
  frame. Nine more icons shipped with shapes missing, each still valid markup
  and therefore invisible to the registration tests: `layout` and `layers` were
  a bare rectangle and a single layer, `settings` a gear with no centre, `home`
  a house with no door, `bell` had no clapper, `box` was a hollow hexagon,
  `file-text` a blank page, `toggle-left` a pill with no knob, and
  `accessibility` drew two bars clipped at the bottom edge of the viewBox
  instead of a figure. `gallery` (which was itself a copy of Lucide's `image`)
  is now Lucide's `gallery-thumbnails`, so it no longer collides with the fixed
  `image`.

  `src/__tests__/icon-content.test.ts` now checks every entry of `ALL_ICONS`:
  parses to at least one shape, uses only allowed shape elements, stays inside
  the 0–24 viewBox, hardcodes no `fill`/`stroke`/`stroke-width`, is not a
  duplicate of another icon, and matches a checked-in snapshot of its shape
  signature so a vanishing `<path>` shows up in review. The README documents the
  drawing convention (Lucide base, 24×24, stroke-only, complete drawing, no
  aliases).

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
