# @andersseen/motion

Framework-agnostic animation library: attribute-driven CSS animations for
declarative use, plus an imperative promise-based player for component-level
transitions (modal open/close, toast enter/exit, etc.). Zero in-repo
dependencies.

> Part of the Andersseen **product core** — usable entirely on its own, in plain
> HTML or any framework, without `@andersseen/web-components`.

## Installation

```bash
pnpm add @andersseen/motion
```

```css
@import '@andersseen/motion/style.css';
```

## Attribute-driven animations

Scan the DOM once (or after an SPA route change) and every `[and-motion]`
element gets wired up automatically:

```ts
import { initMotion } from '@andersseen/motion';

const cleanup = initMotion();
// …later, on unmount / route change:
cleanup();
```

```html
<!-- Animate once when scrolled into view -->
<div and-motion="fade-in" and-motion-trigger="enter">Content</div>

<!-- Animate on hover -->
<div and-motion="zoom-in" and-motion-trigger="hover">Hover me</div>

<!-- Custom timing -->
<div
  and-motion="slide-in-up"
  and-motion-trigger="enter"
  and-motion-duration="800ms"
  and-motion-delay="200ms"
>
  Delayed slide
</div>
```

### Attributes

| Attribute             | Values                      | Default                     | Notes                                                                |
| --------------------- | --------------------------- | --------------------------- | -------------------------------------------------------------------- |
| `and-motion`          | animation name (below)      | —                           | required                                                             |
| `and-motion-trigger`  | `enter` \| `hover` \| `tap` | inferred                    | names containing `-in` default to `enter` if omitted                 |
| `and-motion-duration` | any CSS `<time>`            | stylesheet default          | forwarded to `--and-motion-duration`                                 |
| `and-motion-delay`    | any CSS `<time>`            | `0s`                        | forwarded to `--and-motion-delay`                                    |
| `and-motion-easing`   | any CSS easing              | stylesheet default          | forwarded to `--and-motion-easing`                                   |
| `and-motion-once`     | `true` \| `false`           | controller default (`true`) | per-element override of "animate only the first time"                |
| `and-motion-state`    | —                           | —                           | set to `active` internally while the animation is running; read-only |

`enter` uses `IntersectionObserver` (`threshold`/`rootMargin`/`once` are
configurable via `initMotion({ threshold, rootMargin, once })` or the
`MotionController` constructor). `hover` listens for `mouseenter`/`mouseleave`.
`tap` listens for `pointerdown`/`pointerup`/`pointercancel`/`pointerleave`.

`prefers-reduced-motion: reduce` is respected at both the CSS layer (via
`@media`) and the JS layer (enter-triggered elements skip the initial
`opacity: 0` so nothing is ever stuck invisible).

### Animation catalog

Names follow the `and-motion="<name>"` value. Every family below ships `-in-*` /
`-out-*` variants plus a directional base name; see
`packages/motion-core/src/animations/` for the exhaustive list and exact
keyframes.

| Family            | Examples                                                       |
| ----------------- | -------------------------------------------------------------- |
| Fading            | `fade-in`, `fade-out`, `fade-in-up`, `fade-in-down-big`, …     |
| Sliding           | `slide-in-up`, `slide-in-left`, `slide-out-down`, …            |
| Zooming           | `zoom-in`, `zoom-out`, `zoom-in-up`, `zoom-out-left`, …        |
| Bouncing          | `bounce-in`, `bounce-out`, `bounce-in-down`, …                 |
| Flippers          | `flip-in-x`, `flip-in-y`, `flip-out-x`, `flip-out-y`           |
| Rotating          | `rotate-in`, `rotate-out`, `rotate-in-down-left`, …            |
| Back              | `back-in-up`, `back-out-down`, …                               |
| Light speed       | `light-speed-in-left`, `light-speed-out-right`                 |
| Attention seekers | `pulse`, `shake-x`, `swing`, `tada`, `wobble`, `heart-beat`, … |
| Specials          | `hinge`, `roll-in`, `roll-out`, `jack-in-the-box`              |

## Imperative player

For component-driven lifecycles (open/close a modal, enter/exit a toast) where
you control timing in code rather than scroll/hover/tap:

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
This is the mechanism `@andersseen/web-components` and
`@andersseen/vanilla-components` use internally for the `animated` prop; use it
directly if you're building your own component layer.

## Development

```bash
pnpm -C packages/motion-core test    # Vitest
pnpm -C packages/motion-core lint
pnpm -C packages/motion-core build   # ESM + CJS + CSS
```

## License

MIT
