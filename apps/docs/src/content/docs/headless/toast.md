---
title: Headless Core — Toast
description:
  createToastManager — a toast queue with auto-dismiss timers and a max-visible
  limit, no rendering. Powers the styled Toast component.
---

Powers [Toast](/components/toast/) internally. Unlike the other factories, this
one manages a **list** of items (the toast queue) rather than a single
open/closed boolean.

## Usage

```ts
import { createToastManager } from '@andersseen/headless-components/toast';

const toasts = createToastManager({
  defaultDuration: 3000,
  position: 'bottom-right',
  onToastsChange: list => console.log('Toasts:', list),
});

const id = toasts.actions.present('Hello!', 'success');
toasts.actions.dismiss(id);
toasts.destroy(); // clears every pending auto-dismiss timer
```

## Config

| Option            | Type                                                                                              | Default          |
| ----------------- | ------------------------------------------------------------------------------------------------- | ---------------- |
| `defaultDuration` | `number` (ms)                                                                                     | `3000`           |
| `maxToasts`       | `number`                                                                                          | `5`              |
| `position`        | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left' \| 'top-center' \| 'bottom-center'` | `'bottom-right'` |
| `onToastsChange`  | `(toasts: ToastItem[]) => void`                                                                   | —                |

`ToastItem` is
`{ id: number, message: string, type: ToastType, duration: number }`, where
`ToastType` is `'default' \| 'success' \| 'error' \| 'info' \| 'warning'`.

## State

`toasts: ReadonlyArray<ToastItem>`, `position`.

## Actions

| Member                               | Signature                                 | Notes                                                                                                                      |
| ------------------------------------ | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `present(message, type?, duration?)` | `(string, ToastType?, number?) => number` | Returns the new toast's `id`. Over `maxToasts`, the **oldest** toasts are dropped (and their timers cleared) to make room. |
| `dismiss(id)`                        | `(id: number) => void`                    |                                                                                                                            |
| `dismissAll()`                       | `() => void`                              | Clears every pending timer too.                                                                                            |

No `queries` bucket; read `toasts.state.toasts` directly.

## Prop-getters & cleanup

| Getter                 | Returns                                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| `getContainerProps()`  | `role: 'region'`, `aria-label: 'Notifications'`, `aria-live: 'polite'`, `aria-atomic: false`, `data-position` |
| `getToastProps(toast)` | `role: 'alert'`, `aria-live: 'assertive'`, `aria-atomic: true`, `data-type`                                   |
| `getDismissProps()`    | `aria-label: 'Dismiss notification'`, `type: 'button'`                                                        |

The container uses `aria-live="polite"` (announcements queue politely) while
each individual toast is `role="alert"` with `aria-live="assertive"` — that
combination is deliberate: the _region_ doesn't interrupt, but each toast inside
it does, matching how screen readers actually handle nested live regions.
`destroy()` clears every pending auto-dismiss timer; call it when the manager
itself is torn down (not per-toast — `dismiss(id)` already clears that one
timer).

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="toast-demo-present">Show toast</and-button>
    <and-button id="toast-demo-dismiss-all" variant="outline">Dismiss all</and-button>
  </div>
  <pre id="toast-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runToastDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('toast-demo-output');
    if (!H || !output) return;

    const toasts = H.createToastManager({ defaultDuration: 4000, position: 'bottom-right' });

    const render = () => {
      output.textContent = 'toasts.state.toasts →\n' + JSON.stringify(toasts.state.toasts, null, 2);
    };
    toasts.subscribe(render);
    render();

    let n = 0;
    document.getElementById('toast-demo-present')?.addEventListener('click', () => {
      n += 1;
      toasts.actions.present(`Notification #${n}`, 'info');
    });
    document.getElementById('toast-demo-dismiss-all')?.addEventListener('click', () => toasts.actions.dismissAll());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runToastDemo);
  } else {
    runToastDemo();
  }
</script>

## Next steps

[Alert](/headless/alert/) — a single-item, non-queued relative for inline (not
floating) status messages.
