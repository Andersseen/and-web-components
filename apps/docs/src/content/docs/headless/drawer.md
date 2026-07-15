---
title: Headless Core — Drawer
description:
  createDrawer — open/close state with a placement side, Escape/backdrop
  dismissal, and dialog ARIA props. Powers the styled Drawer component.
---

Powers [Drawer](/components/drawer/) internally. Same shape as
[Modal](/headless/modal/) with one addition: `placement`, exposed as `data-side`
on the content element for slide-in styling.

## Usage

```ts
import { createDrawer } from '@andersseen/headless-components/drawer';

const drawer = createDrawer({
  placement: 'left',
  closeOnEscape: true,
  closeOnOverlayClick: true,
  onOpenChange: isOpen => console.log('Drawer:', isOpen),
});

drawer.actions.open();
window.addEventListener('keydown', drawer.handleKeyDown);
```

## Config

| Option                | Type                                     | Default    | Notes |
| --------------------- | ---------------------------------------- | ---------- | ----- |
| `defaultOpen`         | `boolean`                                | `false`    |       |
| `placement`           | `'top' \| 'bottom' \| 'left' \| 'right'` | `'left'`   |       |
| `onOpenChange`        | `(isOpen: boolean) => void`              | —          |       |
| `closeOnEscape`       | `boolean`                                | `true`     |       |
| `closeOnOverlayClick` | `boolean`                                | `true`     |       |
| `disabled`            | `boolean`                                | `false`    |       |
| `label`               | `string`                                 | `'Drawer'` |       |

## State

`isOpen`, `placement`, `disabled`.

## Actions

`open()`, `close()`, `toggle()`, `setPlacement(v)`, `setDisabled(v)` — no
`queries` bucket; read `drawer.state.isOpen` directly.

## Prop-getters & handlers

| Getter                  | Returns                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `getOverlayProps()`     | `data-state`, `aria-hidden`                                                                                                  |
| `getContentProps()`     | `role: 'dialog'`, `aria-modal: true`, `aria-hidden`, `aria-label`, `data-state`, `data-side` (the placement), `tabindex: -1` |
| `getCloseButtonProps()` | `aria-label: 'Close'`, `type: 'button'`                                                                                      |

`handleKeyDown(event)` / `handleOverlayClick()` — identical contract to
[Modal](/headless/modal/#prop-getters--handlers).

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="drawer-demo-toggle">Toggle drawer</and-button>
    <and-button id="drawer-demo-side" variant="outline">Switch side</and-button>
  </div>
  <pre id="drawer-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runDrawerDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('drawer-demo-output');
    if (!H || !output) return;

    const sides = ['left', 'right', 'top', 'bottom'];
    const drawer = H.createDrawer({ placement: 'left' });

    const render = () => {
      output.textContent = 'drawer.getContentProps() →\n' + JSON.stringify(drawer.getContentProps(), null, 2);
    };
    drawer.subscribe(render);
    render();

    document.getElementById('drawer-demo-toggle')?.addEventListener('click', () => drawer.actions.toggle());
    document.getElementById('drawer-demo-side')?.addEventListener('click', () => {
      const next = sides[(sides.indexOf(drawer.state.placement) + 1) % sides.length];
      drawer.actions.setPlacement(next);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runDrawerDemo);
  } else {
    runDrawerDemo();
  }
</script>

## Next steps

[Modal](/headless/modal/) — the same factory shape without the `placement` side.
