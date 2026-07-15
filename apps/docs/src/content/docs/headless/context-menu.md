---
title: Headless Core — Context Menu
description:
  createContextMenu — pointer-position-anchored open state, right-click
  handling, and Escape dismissal. Powers the styled Context Menu component.
---

Powers [Context Menu](/components/context-menu/) internally. Like
[Dropdown](/headless/dropdown/), it's built on
[`createMenuSelection`](/headless/primitives/#createmenuselection) for its
`selectItem` action — the difference is _where_ the panel opens: at the pointer
position from a right-click, not anchored to a trigger element.

## Usage

```ts
import { createContextMenu } from '@andersseen/headless-components/context-menu';

const ctx = createContextMenu({
  closeOnSelect: true,
  onOpenChange: open => console.log('Open:', open),
  onPosition: pos => console.log('Position:', pos),
});

el.addEventListener('contextmenu', e => ctx.handleContextMenu(e));
document.addEventListener('keydown', e => ctx.handleKeyDown(e));
```

## Config

| Option          | Type                                           | Default | Notes                                                        |
| --------------- | ---------------------------------------------- | ------- | ------------------------------------------------------------ |
| `onOpenChange`  | `(isOpen: boolean) => void`                    | —       |                                                              |
| `onPosition`    | `(position: { x: number; y: number }) => void` | —       | Fires every time `open()` runs (initial open or reposition). |
| `closeOnSelect` | `boolean`                                      | `true`  | Forwarded to `createMenuSelection`.                          |
| `onSelect`      | `(e: { itemId?: string }) => void`             | —       | Forwarded to `createMenuSelection`.                          |

## State

`isOpen`, `position: { x, y }`.

## Actions

`open(position?)` (re-uses the last position if you omit one), `close()`,
`selectItem(itemId?)` — no `queries` bucket; read `ctx.state.isOpen` directly.

## Prop-getters & handlers

| Getter                  | Returns                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------- |
| `getTriggerProps()`     | `data-state`                                                                        |
| `getPanelProps(label?)` | `role: 'menu'`, `aria-label` (defaults to `'Context menu'`), `data-state`, `hidden` |

`handleContextMenu(event, triggerRect?)` — call this from your element's native
`contextmenu` listener. It always calls `event.preventDefault()` (so the
browser's own right-click menu never shows), then computes the open position:
`event.clientX/clientY` directly, or relative to `triggerRect` if you pass the
trigger's `getBoundingClientRect()` (useful for a panel positioned with
`position: absolute` inside the trigger rather than `position: fixed` at the
viewport level). `handleKeyDown(event)` closes on `Escape` — attach it at the
`document` level, since a right-click doesn't necessarily move focus onto the
panel.

## Live example

Right-click anywhere in the box below:

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div id="context-menu-demo-zone" style="height: 6rem; display: flex; align-items: center; justify-content: center; border: 1px dashed hsl(var(--border)); border-radius: 0.5rem; color: hsl(var(--muted-foreground)); user-select: none;">Right-click here</div>
  <pre id="context-menu-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runContextMenuDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('context-menu-demo-output');
    const zone = document.getElementById('context-menu-demo-zone');
    if (!H || !output || !zone) return;

    const ctx = H.createContextMenu({ closeOnSelect: false });

    const render = () => {
      output.textContent = 'ctx.state →\n' + JSON.stringify(ctx.state, null, 2);
    };
    ctx.subscribe(render);
    render();

    zone.addEventListener('contextmenu', e => ctx.handleContextMenu(e, zone.getBoundingClientRect()));
    document.addEventListener('keydown', e => ctx.handleKeyDown(e));
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runContextMenuDemo);
  } else {
    runContextMenuDemo();
  }
</script>

## Next steps

[Dropdown](/headless/dropdown/) — the trigger-anchored counterpart to this
pointer-anchored menu.
