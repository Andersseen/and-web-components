---
name: andersseen-motion
description:
  'Add attribute-driven animations with @andersseen/motion — scroll/enter,
  hover, and tap triggers via and-motion HTML attributes plus
  initMotion/MotionController. Load when animating element entrances, hover/tap
  feedback, staggered lists, or configuring duration/delay/easing. Respects
  prefers-reduced-motion. Trigger phrases: animation, motion, and-motion,
  fade-up, scroll animation, initMotion, entrance animation.'
---

# @andersseen/motion — attribute-driven animation engine

Animate the web with HTML attributes + CSS keyframes and a lightweight JS
controller. Triggers: `enter` (IntersectionObserver), `hover`, `tap`. Respects
`prefers-reduced-motion` in both CSS and JS.

## Install

```bash
npm i @andersseen/motion
```

## Setup

```ts
import { initMotion } from '@andersseen/motion';
import '@andersseen/motion/style.css';

// Creates a MotionController + scans the root. Returns a cleanup function.
const cleanup = initMotion();

// Optional options:
const cleanupWithOpts = initMotion({
  root: document.getElementById('page'),
  threshold: 0.15,
  rootMargin: '0px',
  once: true,
});

// On SPA route change / component destroy:
cleanup();
```

## Advanced: MotionController class

```ts
import { MotionController } from '@andersseen/motion';

const mc = new MotionController({
  root: document.body,
  threshold: 0.1,
  once: true,
});
mc.scan(); // re-scan root (call after dynamic content is added)
mc.destroy(); // remove all observers and event listeners
```

Verified options: `root?` (default `document.body`), `threshold?` (default
`0.1`), `rootMargin?` (default `'0px'`), `once?` (default `true`).

## Attribute reference

| Attribute             | Values                     | Notes                                                |
| --------------------- | -------------------------- | ---------------------------------------------------- |
| `and-motion`          | animation name (required)  | Marks the element and sets which animation runs      |
| `and-motion-trigger`  | `enter` · `hover` · `tap`  | Default `enter`; names ending `-in` also infer enter |
| `and-motion-duration` | CSS time (`500ms`, `1.2s`) | Sets `--and-motion-duration` on the element          |
| `and-motion-delay`    | CSS time (`200ms`)         | Sets `--and-motion-delay` on the element             |
| `and-motion-easing`   | CSS easing string          | Sets `--and-motion-easing` on the element            |
| `and-motion-once`     | `true` · `false`           | Per-element override of the controller-level `once`  |

Controller runtime attribute: `and-motion-state=active` is toggled internally
while an animation is active.

## CSS custom properties (global, overridable)

```
--and-motion-duration:        500ms
--and-motion-delay:           0ms
--and-motion-easing:          cubic-bezier(0.16, 1, 0.3, 1)   /* expo-out */
--and-motion-easing-enter:    cubic-bezier(0.16, 1, 0.3, 1)
--and-motion-easing-exit:     cubic-bezier(0.7, 0, 0.84, 0)
--and-motion-easing-spring:   cubic-bezier(0.34, 1.56, 0.64, 1)
--and-motion-easing-smooth:   cubic-bezier(0.25, 0.1, 0.25, 1)
--and-motion-easing-bounce:   cubic-bezier(0.175, 0.885, 0.32, 1.275)
--and-motion-distance:        20px
--and-motion-distance-big:    150px
```

## Animation names

- **Fading** (enter by default): `fade`, `fade-up`, `fade-down`, `fade-left`,
  `fade-right` (+ `-big` and corner variants). Explicit: `fade-in`,
  `fade-in-up`, …; exit: `fade-out`, `fade-out-up`, …
- **Sliding**: `slide-up/down/left/right` (+ `slide-in-*` / `slide-out-*`).
- **Zooming**: `zoom`, `zoom-up/down/left/right` (+ `zoom-in-*` / `zoom-out-*`).
- **Bouncing**: `bounce-up/down/left/right` (+ `bounce-in-*` / `bounce-out-*`);
  `bounce-in`, `bounce-out` (750ms).
- **Flipping**: `flip`, `flip-x`, `flip-y` (+ `flip-in-x/y`, `flip-out-x/y`).
- **Rotating**: `rotate`, `rotate-down-left/right`, `rotate-up-left/right` (+
  `rotate-in-*` / `rotate-out-*`).
- **Light speed**: `light-speed-right/left` (+ `light-speed-in/out-*`).
- **Back** (overshoot from off-screen): `back-down/left/right/up` (+ `back-in-*`
  / `back-out-*`).
- **Attention seekers** (use `trigger="hover"` or `trigger="tap"`): `pulse`,
  `rubber-band`, `shake-x`, `shake-y`, `head-shake`, `swing`, `tada`, `wobble`,
  `jello`, `heart-beat`, `flash`, `bounce`, `scale-up`, `scale-down`.
- **Specials**: `hinge` (2s, origin top-left), `jack-in-the-box`, `roll`,
  `roll-in`, `roll-out`.

## Usage examples

```html
<!-- Scroll-triggered fade-up (once) -->
<section
  and-motion="fade-up"
  and-motion-duration="700ms"
  and-motion-delay="100ms"
>
  <h2>Section title</h2>
</section>

<!-- Hover rubber-band attention seeker -->
<button and-motion="rubber-band" and-motion-trigger="hover">Click me</button>

<!-- Tap scale with spring easing -->
<div
  and-motion="scale-up"
  and-motion-trigger="tap"
  and-motion-easing="cubic-bezier(0.34, 1.56, 0.64, 1)"
>
  Card
</div>

<!-- Staggered list via delay -->
<ul>
  <li and-motion="fade-in-up" and-motion-delay="0ms">Item 1</li>
  <li and-motion="fade-in-up" and-motion-delay="100ms">Item 2</li>
  <li and-motion="fade-in-up" and-motion-delay="200ms">Item 3</li>
</ul>
```

## Angular usage

```ts
// app.config.ts or main.ts
import { initMotion } from '@andersseen/motion';
import '@andersseen/motion/style.css';

initMotion();
```

For OnPush components with dynamic content, call `mc.scan()` after content
renders.

## Rules

- Use `and-motion` attributes directly in HTML — no JS required for basic
  animations.
- Use motion for meaningful feedback (entrance, hover affordance, tap
  confirmation); avoid constant looping animations that distract from content.
- The experience must be usable without animation (reduced motion is handled
  automatically).
- Call `cleanup()` / `destroy()` when unmounting SPA views to avoid listener
  leaks.
