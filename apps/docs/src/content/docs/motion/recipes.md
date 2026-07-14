---
title: Motion — Recipes
description:
  Composable, real-world motion patterns — a live animation playground,
  staggered list reveals, interaction feedback, and SPA-safe wiring.
---

Practical patterns built from the two lower-level APIs — the
[`and-motion` attribute](/motion/overview/) and the
[imperative player](/motion/imperative-player/). Everything below is grounded in
the real engine (no extra helpers); the live demos on this page drive
`createMotionPlayer` directly, exactly as your own code would.

## Live playground

Pick any name from the [animation catalog](/motion/overview/#animation-catalog)
and replay it on demand. This is just a `createMotionPlayer` bound to one target
element, with the [Select](/components/select/)'s value passed straight to
`play()`:

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 1.25rem;">
  <div style="display: flex; gap: 0.5rem; align-items: flex-end; flex-wrap: wrap;">
    <and-select
      id="pg-anim"
      label="Animation"
      value="bounce-in"
      options='[{"value":"bounce-in","text":"bounce-in"},{"value":"fade-up","text":"fade-up"},{"value":"fade-down","text":"fade-down"},{"value":"zoom-in","text":"zoom-in"},{"value":"slide-in-left","text":"slide-in-left"},{"value":"slide-in-right","text":"slide-in-right"},{"value":"flip-in-x","text":"flip-in-x"},{"value":"flip-in-y","text":"flip-in-y"},{"value":"rotate-in","text":"rotate-in"},{"value":"back-in-up","text":"back-in-up"},{"value":"light-speed-in-right","text":"light-speed-in-right"},{"value":"roll-in","text":"roll-in"},{"value":"jack-in-the-box","text":"jack-in-the-box"},{"value":"pulse","text":"pulse"},{"value":"tada","text":"tada"},{"value":"heart-beat","text":"heart-beat"},{"value":"shake-x","text":"shake-x"},{"value":"wobble","text":"wobble"},{"value":"jello","text":"jello"},{"value":"rubber-band","text":"rubber-band"},{"value":"swing","text":"swing"},{"value":"bounce","text":"bounce"}]'
      style="min-width: 15rem;"
    ></and-select>
    <and-button id="pg-play">Play</and-button>
  </div>
  <div style="display: flex; justify-content: center; padding: 2.5rem 1rem;">
    <div id="pg-target" style="padding: 1.5rem 2rem; border-radius: 0.75rem; background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); font-weight: 600;">Play me</div>
  </div>
</div>

<script>
  function runPlayground() {
    const M = window.andMotion;
    if (!M) return;

    const target = document.getElementById('pg-target');
    const select = document.getElementById('pg-anim');
    const play = document.getElementById('pg-play');
    if (!target || !play) return;

    const player = M.createMotionPlayer(target);
    play.addEventListener('click', () => {
      player.play((select && select.value) || 'bounce-in');
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPlayground);
  } else {
    runPlayground();
  }
</script>

```ts
import { createMotionPlayer } from '@andersseen/motion';

const player = createMotionPlayer(document.getElementById('target'));

selectEl.addEventListener('andSelectChange', () => {
  player.play(selectEl.value); // any catalog name
});
```

## Staggered list reveal

Give each item its own `--and-motion-delay` (as an inline custom property) and
play the **same** animation on all of them at once — the per-element delay does
the staggering. `play()` reads `--and-motion-delay` off the element's computed
style, and it survives replays because the player only clears the `animation-*`
shorthand properties, never your custom property:

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 1rem;">
  <and-button id="stagger-play" variant="outline" style="align-self: flex-start;">Replay stagger</and-button>
  <div style="display: grid; gap: 0.5rem;">
    <div class="stagger-item" style="--and-motion-delay: 0ms; padding: 0.75rem 1rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground));">Item 1 — 0ms</div>
    <div class="stagger-item" style="--and-motion-delay: 80ms; padding: 0.75rem 1rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground));">Item 2 — 80ms</div>
    <div class="stagger-item" style="--and-motion-delay: 160ms; padding: 0.75rem 1rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground));">Item 3 — 160ms</div>
    <div class="stagger-item" style="--and-motion-delay: 240ms; padding: 0.75rem 1rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground));">Item 4 — 240ms</div>
  </div>
</div>

<script>
  function runStagger() {
    const M = window.andMotion;
    if (!M) return;

    const button = document.getElementById('stagger-play');
    const items = Array.from(document.querySelectorAll('.stagger-item'));
    if (!button || !items.length) return;

    const players = items.map(el => M.createMotionPlayer(el));
    button.addEventListener('click', () => {
      players.forEach(p => p.play('fade-up'));
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runStagger);
  } else {
    runStagger();
  }
</script>

```ts
import { createMotionPlayer } from '@andersseen/motion';

const items = [...document.querySelectorAll('.item')];

// Delay is a plain inline custom property — assign it once…
items.forEach((el, i) => {
  el.style.setProperty('--and-motion-delay', `${i * 80}ms`);
});

// …then play the same animation on all of them.
const players = items.map(createMotionPlayer);
function reveal() {
  players.forEach(p => p.play('fade-up'));
}
```

Prefer the **declarative** route if the list is static and should reveal on
scroll rather than on demand — set the delays as attributes and let the `enter`
trigger fire each one as it scrolls into view:

```html
<div and-motion="fade-up" and-motion-trigger="enter" and-motion-delay="0ms">
  Item 1
</div>
<div and-motion="fade-up" and-motion-trigger="enter" and-motion-delay="80ms">
  Item 2
</div>
<div and-motion="fade-up" and-motion-trigger="enter" and-motion-delay="160ms">
  Item 3
</div>
```

## Attention on interaction

[Attention seekers](/motion/overview/#attention-seekers--specials) —
`heart-beat`, `shake-x`, `tada`, `pulse`, … — play in place on an
already-visible element, so they're a natural fit for feedback: a "liked" tap, a
failed-validation nudge, a "copied!" confirmation. Here a tap replays
`heart-beat` imperatively:

<div class="and-live-example">
  <and-button id="like-btn" variant="outline">
    <span id="like-heart" style="display: inline-block; color: hsl(var(--destructive));">♥</span>
    &nbsp;Like
  </and-button>
</div>

<script>
  function runLike() {
    const M = window.andMotion;
    if (!M) return;

    const button = document.getElementById('like-btn');
    const heart = document.getElementById('like-heart');
    if (!button || !heart) return;

    const player = M.createMotionPlayer(heart);
    button.addEventListener('click', () => player.play('heart-beat'));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLike);
  } else {
    runLike();
  }
</script>

For a purely declarative version — no script at all — reach for the `tap`
trigger, which fires the animation on `pointerdown` and resets on release:

```html
<button>
  <span and-motion="heart-beat" and-motion-trigger="tap">♥</span> Like
</button>
```

A validation nudge is the same idea with `shake-x`, played from your submit
handler when the field is invalid:

```ts
const player = createMotionPlayer(emailField);

form.addEventListener('submit', e => {
  if (!emailField.checkValidity()) {
    e.preventDefault();
    player.play('shake-x');
  }
});
```

## Scroll-triggered reveal

The `enter` trigger uses an `IntersectionObserver`, so content animates the
first time it scrolls into view. By default each element animates **once**
(`once: true`); override per element with `and-motion-once="false"` to
re-animate every time it re-enters the viewport:

```html
<!-- Reveals once, the first time it's seen -->
<section and-motion="fade-up" and-motion-trigger="enter">…</section>

<!-- Re-animates every time it scrolls back into view -->
<div and-motion="zoom-in" and-motion-trigger="enter" and-motion-once="false">
  …
</div>
```

Tune the observer globally through
[`initMotion`](/motion/overview/#the-motioncontroller-class) — a larger
`threshold` waits until more of the element is visible before firing, and a
negative `rootMargin` delays the trigger until the element is further up the
viewport:

```ts
import { initMotion } from '@andersseen/motion';

initMotion({
  threshold: 0.25, // fire when 25% visible
  rootMargin: '0px 0px -10% 0px', // …and 10% above the bottom edge
});
```

## Coordinating with SPA navigation

`initMotion()` scans **once** when called. In a single-page app that swaps
content on route changes, run the cleanup returned by `initMotion()` on the way
out and call it again on the way in — or hold a
[`MotionController`](/motion/overview/#the-motioncontroller-class) and call
`scan()` after each navigation to wire up newly-rendered `[and-motion]`
elements:

```ts
import { MotionController } from '@andersseen/motion';

const motion = new MotionController();

router.afterEach(() => {
  motion.scan(); // idempotent — already-wired nodes are skipped
});

// On full teardown:
motion.destroy();
```

Imperative `createMotionPlayer` instances aren't tied to the scan at all — they
animate whatever element you hand them, whenever you call `play()`. If that
element is unmounted, call `player.destroy()` to drop its listener.
