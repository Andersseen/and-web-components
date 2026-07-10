---
name: andersseen-behaviors
description:
  'Attach framework-agnostic DOM behaviors onto existing HTML via `and-*`
  attributes with @andersseen/behaviors. Load when you need progressive
  enhancement / imperative interaction wired onto elements already in the page —
  resizable splitters, HTML5 drag & drop, hover/focus tooltips, or modal dialogs
  — WITHOUT a framework and WITHOUT a pre-styled custom element:
  defineBehaviors, createSplitter, createDraggable, createDropZone,
  createTooltip, createDialog. Trigger phrases: and-splitter, and-tooltip,
  and-draggable, and-drop-zone, and-dialog, defineBehaviors, attribute
  behaviors, progressive enhancement, resizable panels, sortable drag and drop.'
---

# @andersseen/behaviors — attribute-driven DOM behaviors

Framework-agnostic behaviors that wire interaction **directly onto existing
DOM** via `and-*` attributes. **Zero runtime dependencies, browser-only.** Reach
for this when you want to enhance plain HTML in place — not build a new custom
element (`@andersseen/vanilla-components`) and not consume a pure state machine
(`@andersseen/headless-components`, which renders nothing and touches no DOM).

Pick the right sibling:

- Need pure state/ARIA/keyboard logic with your own rendering, in any framework?
  → `@andersseen/headless-components`.
- Need a self-contained custom element tag? → `@andersseen/vanilla-components`.
- Need to enhance markup that already exists with attributes? → **this
  package.**

## Install

```bash
npm i @andersseen/behaviors
```

## Verified module exports

```
@andersseen/behaviors            # everything below
@andersseen/behaviors/splitter
@andersseen/behaviors/drag-drop
@andersseen/behaviors/tooltip
@andersseen/behaviors/dialog
```

Exported values: `defineBehaviors`, `createSplitter`, `SplitterController`,
`createDraggable`, `createDropZone`, `startDrag`, `endDrag`, `getDragState`,
`createTooltip`, `createDialog`, and the `DEFAULT_SPLITTER_OPTIONS` /
`DEFAULT_TOOLTIP_CONFIG` / `DEFAULT_DIALOG_CONFIG` presets.

## Declarative API — `defineBehaviors`

Call once after the DOM is ready. It scans a root for `[and-*]` attributes and
wires up every behavior. Returns a cleanup function.

```ts
import { defineBehaviors } from '@andersseen/behaviors';

// Scans document.body by default. Pass a root to scope it (e.g. an SPA view).
const cleanup = defineBehaviors({ root: document.body, observe: true });

// On unmount / route change:
cleanup(); // destroys every instance and disconnects the observer
```

`observe: true` adds a `MutationObserver` so elements inserted after the initial
scan are wired up automatically.

## Attribute reference

### Splitter — `and-splitter`

```html
<div
  and-splitter="horizontal"
  and-splitter-default-position="40"
  and-splitter-min="20"
  and-splitter-max="80"
  and-splitter-step="1"
>
  <div and-splitter-panel="primary">Left</div>
  <div and-splitter-handle></div>
  <div and-splitter-panel="secondary">Right</div>
</div>
```

- `and-splitter="horizontal" | "vertical"` (required on the container).
- Children required: `[and-splitter-panel="primary"]`, `[and-splitter-handle]`,
  `[and-splitter-panel="secondary"]`.
- Handle gets `role="separator"`, `aria-orientation`, `aria-valuemin/max/now`,
  keyboard resize (arrows / `Home` / `End`), and a default `aria-label` if none.
- Emits `and-splitter-change`, `and-splitter-dragstart`, `and-splitter-dragend`.
- Give the container an explicit height/width in your CSS.

### Drag & drop — `and-draggable` / `and-drop-zone`

```html
<div and-drop-zone and-drop-zone-sortable>
  <div and-draggable>Item 1</div>
  <div and-draggable>Item 2</div>
</div>
```

- Draggable: `and-draggable-data`, `and-draggable-handle` (selector),
  `and-draggable-disabled`, `and-draggable-type`.
- Drop zone: `and-drop-zone-accept="a,b"`, `and-drop-zone-sortable`,
  `and-drop-zone-disabled`.
- A `and-drop-zone-sortable` zone auto-reorders its children on drop.
- Restrict targets by pairing `and-draggable-type` with `and-drop-zone-accept`.
- Events: `and-dragstart`, `and-dragend`, `and-dragenter`, `and-dragover`,
  `and-dragleave`, `and-drop` (detail includes `data`, `source`, `target`,
  `index`).

### Tooltip — `and-tooltip`

```html
<button
  and-tooltip="Save changes"
  and-tooltip-placement="top"
  and-tooltip-delay="200"
>
  Save
</button>
```

- `and-tooltip-placement` (top/bottom/left/right + -start/-end), `-delay` /
  `-show-delay`, `-hide-delay`, `-offset`, `-interactive`, `-disabled`.
- Wires `aria-describedby`, flips to stay in the viewport, and is dismissable
  with `Escape` without moving the pointer (WCAG 1.4.13).

### Dialog — `and-dialog-trigger`

```html
<button and-dialog-trigger="my-dialog">Open</button>

<div id="my-dialog" class="hidden" and-dialog-position="center">
  <h3>Hello</h3>
  <button and-dialog-close>Close</button>
</div>
```

- Target id is referenced by `and-dialog-trigger`. The target is reparented into
  a focus-trapped modal on open and restored on close (keep it `hidden` /
  `display:none` in the page).
- Trigger or target may set `and-dialog-position`
  (center/top/bottom/left/right), `and-dialog-backdrop`,
  `and-dialog-close-on-backdrop`, `and-dialog-close-on-escape`,
  `and-dialog-width`, `and-dialog-height`, `and-dialog-panel-class`,
  `and-dialog-backdrop-class`.
- Any `[and-dialog-close]` inside closes it. Sets `role="dialog"`, `aria-modal`,
  traps focus (skipping `[disabled]` / `[aria-hidden]`), locks body scroll, and
  restores focus to the trigger.

## Imperative API

Every behavior has a factory that returns an instance with a `destroy()` method
(dialog returns a `DialogRef` with `close()` and a `closed` promise).

```ts
import { createSplitter } from '@andersseen/behaviors/splitter';
import { createTooltip } from '@andersseen/behaviors/tooltip';
import { createDialog } from '@andersseen/behaviors/dialog';
import {
  createDraggable,
  createDropZone,
} from '@andersseen/behaviors/drag-drop';

const splitter = createSplitter(containerEl, {
  orientation: 'vertical',
  defaultPosition: 30,
});
splitter.setPosition(50);
splitter.destroy();

const tooltip = createTooltip(buttonEl, {
  content: 'Hi',
  placement: 'top',
  showDelay: 200,
});
tooltip.destroy();

const ref = createDialog(panelEl, { position: 'center', closeOnEscape: true });
await ref.closed; // resolves when the dialog closes
ref.close();

createDraggable(itemEl, { data: { id: 1 }, handle: '.grip' });
createDropZone(listEl, { sortable: true, accept: ['card'] });
```

## Rules

- Use the real package name: `@andersseen/behaviors`.
- Browser-only. Call `defineBehaviors()` / `create*` after `document.body`
  exists (e.g. `DOMContentLoaded`, end of `<body>`, or `ngAfterViewInit`).
- **Always clean up**: keep the `defineBehaviors()` return value or each
  instance's `destroy()` and call it on unmount / route change.
- Do **not** re-implement a headless state machine here — for framework-owned
  rendering with pure logic use `@andersseen/headless-components` instead.
- `and-*` are plain attributes on existing elements; don't wrap them in a custom
  element or bind them as framework properties.

```

```
