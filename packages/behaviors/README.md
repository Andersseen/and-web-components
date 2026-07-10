# @andersseen/behaviors

Framework-agnostic **DOM behaviors** driven by `and-*` attributes. Progressive
enhancement for the browser — no framework runtime required. Attach interaction
patterns (splitter, drag & drop, tooltip, dialog) to existing HTML using either
declarative attributes or low-level imperative APIs.

> Sibling packages: [`@andersseen/headless-components`](../headless-core) are
> pure state machines with **no** DOM; `@andersseen/behaviors` is the layer that
> wires interaction directly onto elements already in the page.

## Installation

```bash
pnpm add @andersseen/behaviors
```

## Usage

### Declarative attributes

Call `defineBehaviors()` once after your DOM is ready. It scans for `[and-*]`
attributes and wires up the corresponding behaviors.

```html
<!doctype html>
<html>
  <body>
    <div and-splitter="horizontal" and-splitter-default-position="30">
      <div and-splitter-panel="primary">Left</div>
      <div and-splitter-handle></div>
      <div and-splitter-panel="secondary">Right</div>
    </div>

    <button and-tooltip="Save changes" and-tooltip-placement="top">Save</button>

    <button and-dialog-trigger="my-dialog">Open dialog</button>
    <div id="my-dialog" and-dialog-position="center">
      <h2>Hello</h2>
      <button and-dialog-close>Close</button>
    </div>

    <script type="module">
      import { defineBehaviors } from '@andersseen/behaviors';
      const cleanup = defineBehaviors({ observe: true });
      // cleanup() destroys every behavior and stops observing.
    </script>
  </body>
</html>
```

`defineBehaviors({ observe: true })` uses a `MutationObserver` so elements added
after the initial scan are wired up automatically.

### Imperative APIs

For advanced use cases you can create and destroy behaviors manually. Import the
whole surface or a per-behavior subpath for tighter tree-shaking:

```ts
import { createSplitter } from '@andersseen/behaviors';
import { createTooltip } from '@andersseen/behaviors/tooltip';

const splitter = createSplitter(document.getElementById('splitter')!, {
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
  `aria-valuemin/max/now`, keyboard resize (arrows / `Home` / `End`), and a
  default `aria-label` when the author supplies none.
- **Tooltip** wires `aria-describedby` and can be dismissed with `Escape`
  without moving the pointer.
- **Dialog** sets `role="dialog"`, `aria-modal`, traps focus (skipping
  `[disabled]` / `[aria-hidden="true"]`), locks body scroll, and restores focus
  to the trigger on close.

## Browser support

All behaviors touch the DOM and are browser-only. Call `defineBehaviors()` only
after `document.body` is available (e.g. inside a `DOMContentLoaded` handler or
at the end of `<body>`).

## Development

```bash
pnpm -C packages/behaviors test        # Vitest (jsdom)
pnpm -C packages/behaviors lint
pnpm -C packages/behaviors build       # ESM + CJS
```

## License

MIT
