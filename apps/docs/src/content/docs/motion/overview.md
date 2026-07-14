---
title: Motion — Overview
description:
  Framework-agnostic, attribute-driven CSS animation library. Usable standalone,
  without @andersseen/web-components.
---

`@andersseen/motion` is a separate package from `web-components` — a
framework-agnostic animation library: attribute-driven CSS animations for
declarative use, plus an
[imperative promise-based player](/motion/imperative-player/) for
component-level transitions (modal open/close, toast enter/exit, etc.). Zero
in-repo dependencies.

Part of the Andersseen **product core** — usable entirely on its own, in plain
HTML or any framework, without `@andersseen/web-components`. It's also what
`@andersseen/web-components` and `@andersseen/vanilla-components` use internally
for the `animated` prop on components like [Modal](/components/modal/) and
[Toast](/components/toast/).

## Install

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

## Example

<div class="and-live-example" style="gap: 1.5rem;">
  <div and-motion="pulse" and-motion-trigger="hover" style="padding: 1rem 1.5rem; border-radius: 0.5rem; background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); cursor: pointer;">Hover me (pulse)</div>
  <div and-motion="tada" and-motion-trigger="tap" style="padding: 1rem 1.5rem; border-radius: 0.5rem; background: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); cursor: pointer;">Press me (tada)</div>
</div>

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

## Attributes

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
configurable via `initMotion({ threshold, rootMargin, once })`). `hover` listens
for `mouseenter`/`mouseleave`. `tap` listens for
`pointerdown`/`pointerup`/`pointercancel`/`pointerleave`.

`prefers-reduced-motion: reduce` is respected at both the CSS layer (via
`@media`) and the JS layer (enter-triggered elements skip the initial
`opacity: 0` so nothing is ever stuck invisible).

## CSS custom properties

Every timing value is a custom property, overridable at any scope (`:root` for a
site-wide default, a component wrapper for a scoped default, or per-element via
`and-motion-duration`/`and-motion-delay`/`and-motion-easing` as shown above).

| Property                     | Default                                   | Used by                                                             |
| ---------------------------- | ----------------------------------------- | ------------------------------------------------------------------- |
| `--and-motion-duration`      | `500ms`                                   | every animation's `animation-duration`                              |
| `--and-motion-delay`         | `0ms`                                     | every animation's `animation-delay`                                 |
| `--and-motion-easing`        | `cubic-bezier(0.16, 1, 0.3, 1)`           | every animation's `animation-timing-function`                       |
| `--and-motion-easing-enter`  | `cubic-bezier(0.16, 1, 0.3, 1)`           | not wired to a selector — reference token for your own entrance CSS |
| `--and-motion-easing-exit`   | `cubic-bezier(0.7, 0, 0.84, 0)`           | reference token for your own exit CSS                               |
| `--and-motion-easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)`       | reference token, playful overshoot                                  |
| `--and-motion-easing-smooth` | `cubic-bezier(0.25, 0.1, 0.25, 1)`        | reference token, general smooth                                     |
| `--and-motion-easing-bounce` | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | reference token                                                     |
| `--and-motion-distance`      | `20px`                                    | small directional offset (`fade-up`, `slide-left`, …)               |
| `--and-motion-distance-big`  | `150px`                                   | `-big` fading variants (`fade-down-big`, …)                         |
| `--and-motion-scale-from`    | `0.95`                                    | reference token (not currently wired to a keyframe)                 |
| `--and-motion-scale-to`      | `1`                                       | reference token                                                     |

Only `--and-motion-duration`, `--and-motion-delay`, and `--and-motion-easing`
are actually forwarded by the `and-motion-*` attributes — the `-enter`/`-exit`/
`-spring`/`-smooth`/`-bounce` easing variants and the scale tokens exist so your
own custom keyframes (or a `createMotionPlayer` call — see below) can reference
the same design-token vocabulary instead of hardcoding `cubic-bezier(...)`
values inline.

```css
/* Site-wide: snappier, no delay */
:root {
  --and-motion-duration: 250ms;
}

/* Scoped: this card's entrances use the spring easing token */
.pricing-card [and-motion] {
  --and-motion-easing: var(--and-motion-easing-spring);
}
```

## The `MotionController` class

`initMotion()` is a thin wrapper around `new MotionController(options)` — reach
for the class directly when you need to re-scan after injecting new
`[and-motion]` elements into the DOM (e.g. after an `innerHTML` update or a
non-reactive template render that `initMotion`'s one-shot scan won't see):

```ts
import { MotionController } from '@andersseen/motion';

const controller = new MotionController({ threshold: 0.2, once: true });

// … later, after adding new [and-motion] nodes to the page:
controller.scan(); // idempotent — already-wired elements are skipped

// … on unmount:
controller.destroy();
```

| Option       | Type          | Default         | Notes                                                                                                   |
| ------------ | ------------- | --------------- | ------------------------------------------------------------------------------------------------------- |
| `root`       | `HTMLElement` | `document.body` | Only elements inside this root are scanned.                                                             |
| `threshold`  | `number`      | `0.1`           | `IntersectionObserver` threshold for `enter` triggers.                                                  |
| `rootMargin` | `string`      | `'0px'`         | `IntersectionObserver` root margin for `enter` triggers.                                                |
| `once`       | `boolean`     | `true`          | Controller-level default for "animate only the first time". Per-element `and-motion-once` overrides it. |

`scan()` and `destroy()` are the only two public methods beyond the constructor
— `initMotion()` just calls `new MotionController(options)` and returns
`() => controller.destroy()`, so the two are interchangeable; use the class when
you need `scan()`.

## Using in a framework

Motion has no framework runtime dependency — call `initMotion()` on mount and
its returned cleanup function on unmount:

```tsx
// React
import { useEffect } from 'react';
import { initMotion } from '@andersseen/motion';

useEffect(() => {
  const cleanup = initMotion();
  return cleanup;
}, []);
```

```vue
<!-- Vue -->
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { initMotion } from '@andersseen/motion';

let cleanup: () => void;
onMounted(() => {
  cleanup = initMotion();
});
onUnmounted(() => cleanup?.());
</script>
```

```ts
// Angular
import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { initMotion } from '@andersseen/motion';

@Component({ selector: 'app-root', template: `...` })
export class AppComponent implements AfterViewInit, OnDestroy {
  private cleanup?: () => void;

  ngAfterViewInit() {
    this.cleanup = initMotion();
  }
  ngOnDestroy() {
    this.cleanup?.();
  }
}
```

In Astro, React, or Vue apps rendered server-side, call `initMotion()` only in a
client-side context (a plain `<script>` in Astro, a `useEffect`/`onMounted` hook
elsewhere) — it touches `document` and `IntersectionObserver`, both unavailable
during SSR.

## Disabling animations globally

[`@andersseen/web-components`](/components/button/) reads a single global flag
to decide whether components like [Modal](/components/modal/),
[Toast](/components/toast/), [Dropdown](/components/dropdown/), and
[Tooltip](/components/tooltip/) animate their open/close transitions by default
— instead of setting `animated` on every instance individually, call this once
at app bootstrap:

```ts
import { enableAnimations } from '@andersseen/web-components';

enableAnimations(); // every component below now defaults to animated="true"
```

| Function                | Description                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| `enableAnimations()`    | Sets the global flag; components read it in `componentWillLoad()`.  |
| `disableAnimations()`   | Clears it (the library default — nothing animates unless opted in). |
| `isAnimationsEnabled()` | `boolean` — current state of the flag.                              |

This is orthogonal to `prefers-reduced-motion`, which always wins regardless of
this flag — it's a product decision ("do we want motion in this app at all"),
not an accessibility override.

## Animation catalog

Complete, verified-against-source list of every `and-motion="<name>"` value —
135 in total. Each family's "clean" base name (no `-in-`/`-out-` infix) is an
alias for its entrance form; use the explicit `-in-`/`-out-` name when you want
the direction unambiguous in markup, or the exit name to trigger the reverse.
All of these also work with [`createMotionPlayer`](/motion/imperative-player/).

### Fading

| Direction    | Entrance                                     | Exit                 |
| ------------ | -------------------------------------------- | -------------------- |
| none         | `fade` / `fade-in`                           | `fade-out`           |
| down         | `fade-down` / `fade-in-down`                 | `fade-out-down`      |
| down (big)   | `fade-down-big` / `fade-in-down-big`         | `fade-out-down-big`  |
| left         | `fade-left` / `fade-in-left`                 | `fade-out-left`      |
| left (big)   | `fade-left-big` / `fade-in-left-big`         | `fade-out-left-big`  |
| right        | `fade-right` / `fade-in-right`               | `fade-out-right`     |
| right (big)  | `fade-right-big` / `fade-in-right-big`       | `fade-out-right-big` |
| up           | `fade-up` / `fade-in-up`                     | `fade-out-up`        |
| up (big)     | `fade-up-big` / `fade-in-up-big`             | `fade-out-up-big`    |
| top-left     | `fade-top-left` / `fade-in-top-left`         | — (no exit variant)  |
| top-right    | `fade-top-right` / `fade-in-top-right`       | — (no exit variant)  |
| bottom-left  | `fade-bottom-left` / `fade-in-bottom-left`   | — (no exit variant)  |
| bottom-right | `fade-bottom-right` / `fade-in-bottom-right` | — (no exit variant)  |

### Sliding

Cardinal directions only, opacity + transform (no scale, unlike fading).

| Direction | Entrance                         | Exit              |
| --------- | -------------------------------- | ----------------- |
| up        | `slide-up` / `slide-in-up`       | `slide-out-up`    |
| down      | `slide-down` / `slide-in-down`   | `slide-out-down`  |
| left      | `slide-left` / `slide-in-left`   | `slide-out-left`  |
| right     | `slide-right` / `slide-in-right` | `slide-out-right` |

### Zooming

| Direction | Entrance                       | Exit             |
| --------- | ------------------------------ | ---------------- |
| none      | `zoom` / `zoom-in`             | `zoom-out`       |
| down      | `zoom-down` / `zoom-in-down`   | `zoom-out-down`  |
| left      | `zoom-left` / `zoom-in-left`   | `zoom-out-left`  |
| right     | `zoom-right` / `zoom-in-right` | `zoom-out-right` |
| up        | `zoom-up` / `zoom-in-up`       | `zoom-out-up`    |

### Bouncing

Bare `bounce` is an [attention seeker](#attention-seekers--specials) (a one-shot
wiggle in place), not an entrance — directional names only here.

| Direction | Entrance                           | Exit               |
| --------- | ---------------------------------- | ------------------ |
| none      | `bounce-in`                        | `bounce-out`       |
| down      | `bounce-down` / `bounce-in-down`   | `bounce-out-down`  |
| left      | `bounce-left` / `bounce-in-left`   | `bounce-out-left`  |
| right     | `bounce-right` / `bounce-in-right` | `bounce-out-right` |
| up        | `bounce-up` / `bounce-in-up`       | `bounce-out-up`    |

### Flippers

3D-perspective rotation. `backface-visibility: visible` is applied automatically
so the flipping face doesn't disappear mid-rotation.

| Axis           | Entrance               | Exit         |
| -------------- | ---------------------- | ------------ |
| none (Y, 360°) | `flip`                 | —            |
| X              | `flip-x` / `flip-in-x` | `flip-out-x` |
| Y              | `flip-y` / `flip-in-y` | `flip-out-y` |

### Rotating

| Direction  | Entrance                                     | Exit                    |
| ---------- | -------------------------------------------- | ----------------------- |
| none       | `rotate` / `rotate-in`                       | `rotate-out`            |
| down-left  | `rotate-down-left` / `rotate-in-down-left`   | `rotate-out-down-left`  |
| down-right | `rotate-down-right` / `rotate-in-down-right` | `rotate-out-down-right` |
| up-left    | `rotate-up-left` / `rotate-in-up-left`       | `rotate-out-up-left`    |
| up-right   | `rotate-up-right` / `rotate-in-up-right`     | `rotate-out-up-right`   |

### Back

Overshoots past `scale(1)` then settles — a "pulled back and released" feel.

| Direction | Entrance                       | Exit             |
| --------- | ------------------------------ | ---------------- |
| down      | `back-down` / `back-in-down`   | `back-out-down`  |
| left      | `back-left` / `back-in-left`   | `back-out-left`  |
| right     | `back-right` / `back-in-right` | `back-out-right` |
| up        | `back-up` / `back-in-up`       | `back-out-up`    |

### Light speed

Skewed slide with an overshoot settle — no `-big` or diagonal variants.

| Direction | Entrance                                     | Exit                    |
| --------- | -------------------------------------------- | ----------------------- |
| left      | `light-speed-left` / `light-speed-in-left`   | `light-speed-out-left`  |
| right     | `light-speed-right` / `light-speed-in-right` | `light-speed-out-right` |

### Attention seekers & specials

One-shot effects with no entrance/exit split — play them on an already-visible
element (e.g. `and-motion-trigger="hover"` or via
[`createMotionPlayer`](/motion/imperative-player/)) rather than on scroll-in.

**Attention seekers:** `pulse`, `rubber-band`, `shake-x`, `shake-y`,
`head-shake`, `swing`, `tada`, `wobble`, `jello`, `heart-beat`, `flash`,
`bounce`, `scale-up`, `scale-down`.

**Specials:** `hinge` (2s, swings and drops off — a "detach and fall" effect),
`jack-in-the-box`, `roll` / `roll-in`, `roll-out`.
