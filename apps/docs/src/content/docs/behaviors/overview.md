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

`defineBehaviors(options)` takes two options and returns a cleanup function:

| Option    | Type          | Default         | Notes                                                                                              |
| --------- | ------------- | --------------- | -------------------------------------------------------------------------------------------------- |
| `root`    | `HTMLElement` | `document.body` | Only elements inside this root are scanned.                                                        |
| `observe` | `boolean`     | `false`         | Watch for later-added `[and-*]` elements with a `MutationObserver` and wire them up automatically. |

This docs site calls `defineBehaviors({ observe: true })` once, globally, so
every `and-*` attribute in the live examples below just works.

## Tooltip

<div class="and-live-example">
  <button and-tooltip="Saves your changes" and-tooltip-placement="top" style="padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); color: hsl(var(--foreground)); cursor: pointer;">Hover me</button>
</div>

```html
<button and-tooltip="Saves your changes" and-tooltip-placement="top">
  Hover me
</button>
```

## Splitter

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
needs a height for `horizontal`, since panels fill it.

## Drag & drop (sortable)

A `[and-drop-zone-sortable]` zone auto-reorders its `[and-draggable]` children
on drop. Drag an item to a new position:

<div class="and-live-example" style="display: block;">
  <div and-drop-zone and-drop-zone-sortable style="display: flex; flex-direction: column; gap: 0.5rem;">
    <div and-draggable style="padding: 0.6rem 0.9rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground)); border: 1px solid hsl(var(--border));">🍎 Apple</div>
    <div and-draggable style="padding: 0.6rem 0.9rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground)); border: 1px solid hsl(var(--border));">🍌 Banana</div>
    <div and-draggable style="padding: 0.6rem 0.9rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground)); border: 1px solid hsl(var(--border));">🍒 Cherry</div>
    <div and-draggable style="padding: 0.6rem 0.9rem; border-radius: 0.5rem; background: hsl(var(--muted)); color: hsl(var(--foreground)); border: 1px solid hsl(var(--border));">🍇 Grape</div>
  </div>
</div>

```html
<div and-drop-zone and-drop-zone-sortable>
  <div and-draggable>🍎 Apple</div>
  <div and-draggable>🍌 Banana</div>
  <div and-draggable>🍒 Cherry</div>
</div>
```

:::note[Auto-reorder is a declarative-only convenience] The automatic DOM
reordering is wired up by `defineBehaviors` when it sees
`and-drop-zone-sortable`, **not** by `createDropZone` itself. Imperative
`createDropZone(el, { sortable: true })` emits the `and-drop` event (with a
`detail.index`) but leaves the actual re-insertion to you. :::

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

## Imperative API reference

Every behavior has a factory you can call directly — for when you build the DOM
in code, or want a handle to control it. Each returns an instance with a
`destroy()` (and usually `updateOptions`/`updateConfig`). Import from the root
or a per-behavior subpath for tighter tree-shaking.

### `createSplitter(container, options?)` → `SplitterInstance`

| Option            | Type                         | Default        |
| ----------------- | ---------------------------- | -------------- |
| `orientation`     | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `minSize`         | `number` (%)                 | `0`            |
| `maxSize`         | `number` (%)                 | `100`          |
| `step`            | `number` (% per arrow key)   | `1`            |
| `defaultPosition` | `number` (%)                 | `50`           |

Instance: `container`, `controller`, `setPosition(percent)`,
`updateOptions(partial)`, `destroy()`. `DEFAULT_SPLITTER_OPTIONS` is exported.

### `createTooltip(element, config?)` → `TooltipInstance`

| Option        | Type               | Default | Notes                                                       |
| ------------- | ------------------ | ------- | ----------------------------------------------------------- |
| `content`     | `string`           | `''`    | Also settable via the `and-tooltip` attribute.              |
| `placement`   | `TooltipPlacement` | `'top'` | 12 values: `top`/`bottom`/`left`/`right` + `-start`/`-end`. |
| `showDelay`   | `number` (ms)      | `200`   |                                                             |
| `hideDelay`   | `number` (ms)      | `0`     |                                                             |
| `offset`      | `number` (px)      | `8`     | Gap between anchor and tooltip.                             |
| `disabled`    | `boolean`          | `false` |                                                             |
| `interactive` | `boolean`          | `false` | Allow hovering onto the tooltip content.                    |

Instance: `element`, `show()`, `hide()`, `updateOptions(partial)`, `destroy()`.
`DEFAULT_TOOLTIP_CONFIG` is exported.

### `createDialog(target, config?)` → `DialogRef`

Opens `target` as a modal immediately. `DialogRef` is `{ close(), closed }`
where `closed` is a `Promise<void>` that resolves when the dialog is dismissed.

| Option                 | Type                                         | Default    |
| ---------------------- | -------------------------------------------- | ---------- |
| `position`             | `'center'\|'top'\|'bottom'\|'left'\|'right'` | `'center'` |
| `backdrop`             | `boolean`                                    | `true`     |
| `closeOnBackdropClick` | `boolean`                                    | `true`     |
| `closeOnEscape`        | `boolean`                                    | `true`     |
| `width` / `height`     | `string` (any CSS length)                    | —          |
| `panelClass`           | `string \| string[]`                         | —          |
| `backdropClass`        | `string \| string[]`                         | —          |

```ts
import { createDialog } from '@andersseen/behaviors/dialog';

const dialog = createDialog(document.getElementById('panel'), {
  position: 'right',
});
dialog.closed.then(() => console.log('dialog dismissed'));
// dialog.close();
```

### `createDraggable(el, config?)` / `createDropZone(el, config?)`

`createDraggable` config: `data?` (any value transferred on drag), `disabled?`,
`handle?` (selector for a drag handle), `animationDuration?`. It sets
`draggable="true"` and `cursor: grab`.

`createDropZone` config: `accept?` (`string[]` of draggable types), `disabled?`,
`sortable?`. Both instances expose `element`, `updateConfig(config)`, and
`destroy()`. Also exported: `startDrag` / `endDrag` / `getDragState` for reading
or driving the shared drag state directly.

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
