---
title: Headless Core — Modal
description:
  createModal — open/close state, Escape/backdrop dismissal, and dialog ARIA
  props, with no focus-trap or scroll-lock DOM logic. Powers Modal.
---

Powers [Modal](/components/modal/) and `and-vanilla-modal` internally. Note what
this factory **doesn't** do: focus trapping and body-scroll locking are real DOM
operations, so they live in the consuming layer (`@andersseen/web-components`'s
`utils/focus-trap.ts`) — this factory only tracks `isOpen` and hands back the
ARIA props and event-handler logic.

## Usage

```ts
import { createModal } from '@andersseen/headless-components/modal';

const modal = createModal({
  closeOnEscape: true,
  closeOnOverlayClick: true,
  onOpenChange: isOpen => console.log('Modal:', isOpen),
});

modal.subscribe(state => {
  if (state.isOpen) console.log('Modal opened');
});

modal.actions.open();
window.addEventListener('keydown', modal.handleKeyDown);
```

## Config

| Option                | Type                        | Default    | Notes                                                 |
| --------------------- | --------------------------- | ---------- | ----------------------------------------------------- |
| `defaultOpen`         | `boolean`                   | `false`    |                                                       |
| `onOpenChange`        | `(isOpen: boolean) => void` | —          |                                                       |
| `closeOnEscape`       | `boolean`                   | `true`     |                                                       |
| `closeOnOverlayClick` | `boolean`                   | `true`     |                                                       |
| `disabled`            | `boolean`                   | `false`    | Blocks `open()`; setting `true` while open closes it. |
| `label`               | `string`                    | `'Dialog'` | Used as `aria-label` on the content element.          |

## State

`isOpen`, `disabled`.

## Actions

`open()`, `close()`, `toggle()`, `setDisabled(v)` — no `queries` bucket on this
factory (unlike most others); read `modal.state.isOpen` directly.

## Prop-getters & handlers

| Getter                  | Returns                                                                                         |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| `getOverlayProps()`     | `data-state`, `aria-hidden`                                                                     |
| `getContentProps()`     | `role: 'dialog'`, `aria-modal: true`, `aria-hidden`, `aria-label`, `data-state`, `tabindex: -1` |
| `getCloseButtonProps()` | `aria-label: 'Close'`, `type: 'button'`                                                         |

`handleKeyDown(event)` closes on `Escape` when `closeOnEscape` and the modal is
open — wire it to `window`, not the content element, since a modal's content is
often not focused. `handleOverlayClick()` closes when `closeOnOverlayClick`;
call it from the overlay's `click` handler.

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <and-button id="modal-demo-toggle">Toggle modal</and-button>
  <pre id="modal-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runModalDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('modal-demo-output');
    if (!H || !output) return;

    const modal = H.createModal({ label: 'Example dialog' });

    const render = () => {
      output.textContent = 'modal.getContentProps() →\n' + JSON.stringify(modal.getContentProps(), null, 2);
    };
    modal.subscribe(render);
    render();

    document.getElementById('modal-demo-toggle')?.addEventListener('click', () => modal.actions.toggle());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runModalDemo);
  } else {
    runModalDemo();
  }
</script>

## Next steps

[Drawer](/headless/drawer/) is the same open/close/Escape/overlay shape with an
added `placement` side.
