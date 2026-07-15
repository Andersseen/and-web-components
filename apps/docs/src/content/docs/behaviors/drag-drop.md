---
title: Behaviors — Drag & Drop
description:
  HTML5 drag source and drop target driven by and-draggable/and-drop-zone, plus
  the imperative createDraggable/createDropZone factories.
---

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

Dragging between two different sortable zones works the same way, purely from
markup — see
[Recipes → Cross-list drag & drop](/behaviors/recipes/#cross-list-drag--drop).

## Attributes

| Attribute                | Where     | Values                   | Notes                                                           |
| ------------------------ | --------- | ------------------------ | --------------------------------------------------------------- |
| `and-draggable`          | draggable | —                        | Marks an element as a native HTML5 drag source.                 |
| `and-draggable-data`     | draggable | any string               | Carried through every event's `detail.data`.                    |
| `and-draggable-handle`   | draggable | CSS selector             | Only pointer-downs inside a matching descendant start the drag. |
| `and-draggable-disabled` | draggable | boolean attribute        |                                                                 |
| `and-draggable-type`     | draggable | any string (`'default'`) | Matched against a drop zone's `and-drop-zone-accept` list.      |
| `and-drop-zone`          | drop zone | —                        | Marks an element as a drop target.                              |
| `and-drop-zone-accept`   | drop zone | comma-separated types    | Omit to accept every `and-draggable-type`.                      |
| `and-drop-zone-sortable` | drop zone | boolean attribute        | Auto-reorders (or moves between zones) on drop.                 |
| `and-drop-zone-disabled` | drop zone | boolean attribute        |                                                                 |

## Events

`bubbles: true`, dispatched on the draggable or the zone:

| Event           | Detail (`AndDrag*Info`)                                                            | Dispatched on |
| --------------- | ---------------------------------------------------------------------------------- | ------------- |
| `and-dragstart` | `{ data, element, event }`                                                         | draggable     |
| `and-dragend`   | `{ data, element, event, dropped }`                                                | draggable     |
| `and-dragenter` | `{ data, element, event, position }` (`position`: `'before'\|'after'\|'inside'`)   | drop zone     |
| `and-dragover`  | same shape as `and-dragenter`                                                      | drop zone     |
| `and-dragleave` | — (no detail)                                                                      | drop zone     |
| `and-drop`      | `{ data, source, target, event, index? }` — `index` only set when `sortable: true` | drop zone     |

## Imperative API

```ts
import {
  createDraggable,
  createDropZone,
} from '@andersseen/behaviors/drag-drop';

const item = createDraggable(itemEl, {
  data: { id: 1 },
  handle: '.drag-handle',
});
const zone = createDropZone(zoneEl, { accept: ['task'], sortable: true });
```

| `DragDropConfig` (draggable) | Type      | Notes                                                                          |
| ---------------------------- | --------- | ------------------------------------------------------------------------------ |
| `data`                       | `unknown` | Carried through every event's `detail.data`.                                   |
| `disabled`                   | `boolean` | Sets `draggable="false"` and `cursor: not-allowed`.                            |
| `handle`                     | `string`  | CSS selector — only pointer-downs inside a matching descendant start the drag. |
| `animationDuration`          | `number`  | Accepted by the config type; not currently read by the drag logic.             |

| `DropZoneConfig` | Type       | Notes                                                                                               |
| ---------------- | ---------- | --------------------------------------------------------------------------------------------------- |
| `accept`         | `string[]` | Matched against the source's `and-draggable-type` (default `'default'`). Omit to accept everything. |
| `disabled`       | `boolean`  |                                                                                                     |
| `sortable`       | `boolean`  | Only meaningful through `defineBehaviors` — the note above applies here too.                        |

Both instances expose `element`, `updateConfig(config)`, and `destroy()`.

The drag preview shown while dragging is a rotated (`3deg`), 90%-opacity clone
of the source element, positioned off-screen and set as the native
`dataTransfer` drag image — there's no config option to customize it today.

Low-level shared state, for driving custom drag sources that don't start from a
native `dragstart` (e.g. a touch-based custom implementation):

| Export                                      | Signature                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------ |
| `startDrag(data, sourceElement, dragType?)` | `(data: unknown, sourceElement: HTMLElement, dragType?: string) => void` |
| `endDrag()`                                 | `() => void`                                                             |
| `getDragState()`                            | `() => Readonly<{ isDragging, data, sourceElement, dragType }>`          |

## Accessibility

The draggable element gets `aria-grabbed` (`'true'` while dragging), but native
HTML5 drag-and-drop as used here has **no built-in keyboard alternative** — a
keyboard-only or screen-reader user cannot reorder items through
`and-draggable`/`and-drop-zone` alone. If reordering needs to be fully
accessible, pair this with an explicit alternative (e.g. "Move up"/"Move down"
buttons, or the [Splitter](/behaviors/splitter/)'s pattern of real keyboard
handlers) rather than relying on drag-and-drop as the only path.

## Next steps

[Recipes → Cross-list drag & drop](/behaviors/recipes/#cross-list-drag--drop)
