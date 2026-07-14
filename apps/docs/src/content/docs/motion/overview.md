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

## Animation catalog

Names follow the `and-motion="<name>"` value. Every family below ships `-in-*` /
`-out-*` variants plus a directional base name.

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
