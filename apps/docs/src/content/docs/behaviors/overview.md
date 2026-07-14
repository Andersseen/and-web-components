---
title: Behaviors — Overview
description:
  Framework-agnostic DOM behaviors driven by and-* attributes -- splitter, drag
  & drop, tooltip, dialog.
---

`@andersseen/behaviors` provides framework-agnostic **DOM behaviors** driven by
`and-*` attributes. Progressive enhancement for the browser — no framework
runtime required. Attach interaction patterns (splitter, drag & drop, tooltip,
dialog) to existing HTML using either declarative attributes or low-level
imperative APIs.

Sibling package: [Headless Core](/headless/overview/) is pure state machines
with **no** DOM; `@andersseen/behaviors` is the layer that wires interaction
directly onto elements already in the page.

## Install

```bash
pnpm add @andersseen/behaviors
```

## Declarative attributes

Call `defineBehaviors()` once after your DOM is ready. It scans for `[and-*]`
attributes and wires up the corresponding behaviors.

```html
<button and-tooltip="Save changes" and-tooltip-placement="top">Save</button>

<script type="module">
  import { defineBehaviors } from '@andersseen/behaviors';
  const cleanup = defineBehaviors({ observe: true });
  // cleanup() destroys every behavior and stops observing.
</script>
```

`defineBehaviors({ observe: true })` uses a `MutationObserver` so elements added
after the initial scan are wired up automatically — this docs site calls it
once, globally, so any `and-*` attribute in a live example below just works.

## Example

<div class="and-live-example">
  <button and-tooltip="Saves your changes" and-tooltip-placement="top" style="padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); color: hsl(var(--foreground)); cursor: pointer;">Hover me</button>
</div>

```html
<button and-tooltip="Saves your changes" and-tooltip-placement="top">
  Hover me
</button>
```

## Imperative APIs

For advanced use cases, create and destroy behaviors manually. Import the whole
surface or a per-behavior subpath for tighter tree-shaking:

```ts
import { createSplitter } from '@andersseen/behaviors';
import { createTooltip } from '@andersseen/behaviors/tooltip';

const splitter = createSplitter(document.getElementById('splitter'), {
  orientation: 'vertical',
});
// ...later
splitter.destroy();
```

## Behaviors

| Attribute            | Behavior                          | Imperative API                         | Subpath                           |
| -------------------- | --------------------------------- | -------------------------------------- | --------------------------------- |
| `and-splitter`       | Resizable panel container         | `createSplitter(container, options)`   | `@andersseen/behaviors/splitter`  |
| `and-draggable`      | HTML5 drag source                 | `createDraggable(element, config)`     | `@andersseen/behaviors/drag-drop` |
| `and-drop-zone`      | Drop target with optional sorting | `createDropZone(element, config)`      | `@andersseen/behaviors/drag-drop` |
| `and-tooltip`        | Hover/focus tooltip               | `createTooltip(element, options)`      | `@andersseen/behaviors/tooltip`   |
| `and-dialog-trigger` | Modal/drawer trigger              | `createDialog(targetElement, options)` | `@andersseen/behaviors/dialog`    |

### Attribute reference

**Splitter** — on the container: `and-splitter="horizontal|vertical"`,
`and-splitter-min`, `and-splitter-max`, `and-splitter-step`,
`and-splitter-default-position`. Children need `and-splitter-panel="primary"`,
`and-splitter-handle`, `and-splitter-panel="secondary"`. Emits
`and-splitter-change`, `and-splitter-dragstart`, `and-splitter-dragend`.

**Drag & drop** — `and-draggable` (+ `and-draggable-data`,
`and-draggable-handle`, `and-draggable-disabled`, `and-draggable-type`),
`and-drop-zone` (+ `and-drop-zone-accept`, `and-drop-zone-sortable`,
`and-drop-zone-disabled`). Emits `and-dragstart`, `and-dragend`,
`and-dragenter`, `and-dragover`, `and-dragleave`, `and-drop`. Sortable zones
auto-reorder on drop.

**Tooltip** — `and-tooltip="text"` (+ `and-tooltip-placement`,
`and-tooltip-delay` / `and-tooltip-show-delay`, `and-tooltip-hide-delay`,
`and-tooltip-offset`, `and-tooltip-disabled`, `and-tooltip-interactive`).
Dismissable with `Escape` (WCAG 1.4.13).

**Dialog** — trigger with `and-dialog-trigger="target-id"`; the target and/or
trigger accept `and-dialog-position`, `and-dialog-backdrop`,
`and-dialog-close-on-backdrop`, `and-dialog-close-on-escape`,
`and-dialog-width`, `and-dialog-height`, `and-dialog-panel-class`,
`and-dialog-backdrop-class`. Any `[and-dialog-close]` inside closes it. Focus is
trapped (disabled/hidden controls skipped) and restored on close.

## Accessibility

- **Splitter** handle gets `role="separator"`, `aria-orientation`,
  `aria-valuemin/max/now`, keyboard resize (arrows / `Home` / `End`).
- **Tooltip** wires `aria-describedby` and can be dismissed with `Escape`
  without moving the pointer.
- **Dialog** sets `role="dialog"`, `aria-modal`, traps focus, locks body scroll,
  and restores focus to the trigger on close.

## Browser support

All behaviors touch the DOM and are browser-only. Call `defineBehaviors()` only
after `document.body` is available.
