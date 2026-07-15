---
title: Behaviors — Splitter
description:
  Resizable panel container driven by the and-splitter attribute, plus its
  imperative createSplitter factory.
---

Two resizable panels separated by a draggable handle. Drag the divider, or focus
it and use the arrow keys (`Home`/`End` jump to the min/max):

<div class="and-live-example" style="display: block;">
  <div and-splitter="horizontal" and-splitter-min="15" and-splitter-max="85" style="height: 8rem; border: 1px solid hsl(var(--border)); border-radius: 0.5rem; overflow: hidden;">
    <div and-splitter-panel="primary" style="background: hsl(var(--muted)); color: hsl(var(--foreground)); display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">Primary</div>
    <div and-splitter-handle style="width: 6px; background: hsl(var(--border));"></div>
    <div and-splitter-panel="secondary" style="background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); display: flex; align-items: center; justify-content: center; font-size: 0.85rem;">Secondary</div>
  </div>
</div>

```html
<div
  and-splitter="horizontal"
  and-splitter-min="15"
  and-splitter-max="85"
  style="height: 8rem;"
>
  <div and-splitter-panel="primary">Primary</div>
  <div and-splitter-handle style="width: 6px;"></div>
  <div and-splitter-panel="secondary">Secondary</div>
</div>
```

The behavior applies its own flex sizing, cursor, and `role="separator"` — you
only style the surfaces (backgrounds, the handle's width/color). The container
needs a height for `horizontal`, since panels fill it. `and-splitter` requires
all three children (`[and-splitter-panel="primary"]`, `[and-splitter-handle]`,
`[and-splitter-panel="secondary"]`) to already be present — the behavior doesn't
generate them.

## Attributes

| Attribute                        | Where     | Values                       | Default        |
| -------------------------------- | --------- | ---------------------------- | -------------- |
| `and-splitter`                   | container | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `and-splitter-min`               | container | `number` (%)                 | `0`            |
| `and-splitter-max`               | container | `number` (%)                 | `100`          |
| `and-splitter-step`              | container | `number` (% per arrow key)   | `1`            |
| `and-splitter-default-position`  | container | `number` (%)                 | `50`           |
| `and-splitter-panel="primary"`   | child     | —                            | —              |
| `and-splitter-handle`            | child     | —                            | —              |
| `and-splitter-panel="secondary"` | child     | —                            | —              |

## Events

Dispatched on the container, all `bubbles: true`:

| Event                    | Detail                                                                           | Fires                                   |
| ------------------------ | -------------------------------------------------------------------------------- | --------------------------------------- |
| `and-splitter-change`    | `SplitterState` (`{ position, orientation, isDragging }`), also `composed: true` | Every position update, drag or keyboard |
| `and-splitter-dragstart` | —                                                                                | Pointer/touch drag begins               |
| `and-splitter-dragend`   | —                                                                                | Pointer/touch drag ends                 |

## Imperative API

```ts
import { createSplitter } from '@andersseen/behaviors/splitter';

const splitter = createSplitter(document.getElementById('panels'), {
  orientation: 'horizontal',
  minSize: 15,
  maxSize: 85,
  defaultPosition: 30,
});
```

`createSplitter(container, options?)` throws if `container` doesn't already
contain the three children above — it has nothing to size or attach listeners to
otherwise.

| Option            | Type                         | Default        |
| ----------------- | ---------------------------- | -------------- |
| `orientation`     | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `minSize`         | `number` (%)                 | `0`            |
| `maxSize`         | `number` (%)                 | `100`          |
| `step`            | `number` (% per arrow key)   | `1`            |
| `defaultPosition` | `number` (%)                 | `50`           |

`DEFAULT_SPLITTER_OPTIONS` is exported alongside the factory.

| Member                     | Signature                                     | Notes                                                                        |
| -------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------- |
| `container` / `controller` | —                                             | The container element and the underlying `SplitterController` state machine. |
| `setPosition(position)`    | `(percent: number) => void`                   | Moves the divider programmatically (clamped to `minSize`/`maxSize`).         |
| `updateOptions(options)`   | `(options: Partial<SplitterOptions>) => void` | Patch any option — e.g. swap `orientation` after a breakpoint change.        |
| `destroy()`                | `() => void`                                  | Removes listeners and every class/attribute the factory added.               |

## Accessibility

The handle gets `role="separator"`, `aria-orientation`, `aria-valuemin/max/now`
(kept in sync on every position change), and keyboard resize via the arrow keys
matching the current orientation plus `Home`/`End` for the min/max. If you don't
set `aria-label`/`aria-labelledby` on the handle yourself, the behavior adds a
default `aria-label="Resize panels"`.

## Next steps

[Recipes → Persisting a splitter's position](/behaviors/recipes/#persisting-a-splitters-position)
