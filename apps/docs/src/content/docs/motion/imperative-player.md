---
title: Motion — Imperative Player
description:
  Promise-based animation player for component-driven lifecycles like modal
  open/close or toast enter/exit.
---

For component-driven lifecycles (open/close a modal, enter/exit a toast) where
you control timing in code rather than scroll/hover/tap, use
`createMotionPlayer` instead of the [`and-motion` attribute](/motion/overview/).

```ts
import { createMotionPlayer } from '@andersseen/motion';

const player = createMotionPlayer(element);

await player.play('fade-zoom-in');
// …later…
await player.play('fade-zoom-out');
player.destroy();
```

`play(name)` resolves on `animationend`. With `respectReducedMotion: true` (the
default), it resolves immediately without running the animation when the user
prefers reduced motion — callers don't need a separate branch for that case.
This is the mechanism [`@andersseen/web-components`](/components/modal/) and
`@andersseen/vanilla-components` use internally for the `animated` prop; use it
directly if you're building your own component layer.

## Options

```ts
createMotionPlayer(element, {
  respectReducedMotion: true, // default
  fillMode: 'both', // default
});
```

| Option                 | Type                                            | Default  | Notes                                                                                                                                |
| ---------------------- | ----------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `respectReducedMotion` | `boolean`                                       | `true`   | When the user prefers reduced motion, `play()` resolves immediately and skips the animation entirely — no separate code path needed. |
| `fillMode`             | `'none' \| 'forwards' \| 'backwards' \| 'both'` | `'both'` | Forwarded to `animation-fill-mode`. `'both'` keeps the end-state applied after `animationend` and the start-state during any delay.  |

## Methods

| Method       | Signature                         | Notes                                                                                                                                                                                            |
| ------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `play(name)` | `(name: string) => Promise<void>` | Starts `name`, resolving on `animationend`. Calling `play()` again before that cancels the pending promise's wait and starts fresh — safe to call repeatedly (e.g. on rapid open/close toggles). |
| `stop()`     | `() => void`                      | Cancels the current animation and clears all `and-motion*` attributes/inline styles, without destroying the player — you can call `play()` again afterward.                                      |
| `destroy()`  | `() => void`                      | Same cleanup as `stop()`; call this when the element itself is being removed and you won't call `play()` again.                                                                                  |

## Playing internal component tokens

`play(name)` isn't limited to the
[declarative catalog](/motion/overview/#animation-catalog) — it sets
`animation-name: and-${name}` directly, so it can trigger **any**
`@keyframes and-*` defined in `core.css`, including a smaller set of
component-oriented tokens that have **no** `[and-motion="..."]` selector and
therefore can't be triggered by the attribute at all:

| Name                                           | Used by (internally)                                       |
| ---------------------------------------------- | ---------------------------------------------------------- |
| `fade-zoom-in` / `fade-zoom-out`               | [Modal](/components/modal/) open/close                     |
| `slide-in-from-right` / `slide-out-to-right`   | [Drawer](/components/drawer/), [Toast](/components/toast/) |
| `slide-in-from-left` / `slide-out-to-left`     | available, unused by a built-in component                  |
| `slide-in-from-top` / `slide-out-to-top`       | available, unused by a built-in component                  |
| `slide-in-from-bottom` / `slide-out-to-bottom` | available, unused by a built-in component                  |
| `accordion-open` / `accordion-close`           | [Accordion](/components/accordion/) content panel          |
| `spin`                                         | Button loading spinner                                     |
| `rotate-180` / `rotate-180-reverse`            | Accordion trigger chevron                                  |

`fade-in`/`fade-out` (from the main catalog) are also the entrance/exit used by
[Dropdown](/components/dropdown/), [Tooltip](/components/tooltip/), and
[Alert](/components/alert/) — the full entrance/exit map
`@andersseen/web-components` wires per component:

| Component | Entrance              | Exit                 |
| --------- | --------------------- | -------------------- |
| Modal     | `fade-zoom-in`        | `fade-zoom-out`      |
| Drawer    | `slide-in-from-right` | `slide-out-to-right` |
| Toast     | `slide-in-from-right` | `slide-out-to-right` |
| Dropdown  | `fade-in`             | `fade-out`           |
| Tooltip   | `fade-in`             | `fade-out`           |
| Accordion | `fade-in`             | `fade-out`           |
| Alert     | `fade-in`             | `fade-out`           |

This map lives in `@andersseen/web-components`'s internal `utils/animation.ts`
(not part of the public API — the table above is the useful part). If you're
building a custom component that should feel consistent with the rest of the
library, reuse the same names via your own `createMotionPlayer` call rather than
inventing new keyframes:

```ts
import { createMotionPlayer } from '@andersseen/motion';

const player = createMotionPlayer(myPanelElement);

async function open() {
  await player.play('slide-in-from-bottom');
}
async function close() {
  await player.play('slide-out-to-bottom');
}
```

## Example

<div class="and-live-example" style="flex-direction: column; align-items: flex-start;">
  <and-button id="player-trigger" variant="outline">Play "bounce-in"</and-button>
  <div id="player-target" style="padding: 1rem 1.5rem; border-radius: 0.5rem; background: hsl(var(--accent)); color: hsl(var(--accent-foreground));">Target element</div>
</div>

<script>
  // `window.andMotion` is exposed by this site's `motionInit` integration
  // (astro.config.mjs) — a plain <script> here can't `import` a bare
  // specifier like '@andersseen/motion' directly, since that only resolves
  // through Vite's module graph. That integration's script is a module
  // script, which the HTML spec defers until after parsing — this classic
  // script runs during parsing, before it, so wait for DOMContentLoaded
  // (guaranteed to fire only once all deferred/module scripts have run).
  function run() {
    const target = document.getElementById('player-target');
    const player = window.andMotion.createMotionPlayer(target);
    document.getElementById('player-trigger').addEventListener('click', () => {
      player.play('bounce-in');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
</script>

```html
<button id="trigger">Play "bounce-in"</button>
<div id="target">Target element</div>

<script type="module">
  import { createMotionPlayer } from '@andersseen/motion';

  const player = createMotionPlayer(document.getElementById('target'));
  document.getElementById('trigger').addEventListener('click', () => {
    player.play('bounce-in');
  });
</script>
```
