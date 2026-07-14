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
