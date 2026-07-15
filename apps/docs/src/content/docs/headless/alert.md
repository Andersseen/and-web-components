---
title: Headless Core — Alert
description:
  createAlert — variant and dismissible-visibility state with
  urgency-appropriate ARIA live semantics. Powers the styled Alert component.
---

Powers [Alert](/components/alert/) internally. A single inline status message —
compare with [Toast](/headless/toast/), its floating, auto-dismissing, queued
relative.

## Usage

```ts
import { createAlert } from '@andersseen/headless-components/alert';

const alert = createAlert({
  variant: 'destructive',
  dismissible: true,
  onDismiss: () => console.log('Alert dismissed'),
});

alert.actions.setVariant('success');
alert.actions.dismiss();
```

## Config

| Option               | Type                                                             | Default     |
| -------------------- | ---------------------------------------------------------------- | ----------- |
| `variant`            | `'default' \| 'destructive' \| 'success' \| 'warning' \| 'info'` | `'default'` |
| `dismissible`        | `boolean`                                                        | `false`     |
| `defaultVisible`     | `boolean`                                                        | `true`      |
| `onDismiss`          | `() => void`                                                     | —           |
| `onVisibilityChange` | `(visible: boolean) => void`                                     | —           |

## State

`variant`, `visible`, `dismissible`.

## Actions

`dismiss()` (no-ops unless both `dismissible` and currently `visible`),
`show()`, `setVariant(v)`, `setDismissible(v)` — no `queries` bucket; read
`alert.state.visible` directly.

## Prop-getters

`getAlertProps()` returns `role`, `aria-live`, `aria-atomic: true`,
`data-state`, `data-variant`. `destructive` and `warning` variants get
`role="alert"` + `aria-live="assertive"` (interrupts screen readers
immediately); every other variant gets `role="status"` + `aria-live="polite"`
(announced without interrupting) — the factory picks this for you based on
`variant`, you don't set it directly.

`getDismissButtonProps()` returns `aria-label: 'Dismiss alert'`,
`type: 'button'`.

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="alert-demo-variant">Cycle variant</and-button>
    <and-button id="alert-demo-dismiss" variant="outline">Dismiss</and-button>
    <and-button id="alert-demo-show" variant="outline">Show again</and-button>
  </div>
  <pre id="alert-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runAlertDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('alert-demo-output');
    if (!H || !output) return;

    const variants = ['default', 'destructive', 'success', 'warning', 'info'];
    const alert = H.createAlert({ dismissible: true });

    const render = () => {
      output.textContent = 'alert.getAlertProps() →\n' + JSON.stringify(alert.getAlertProps(), null, 2);
    };
    alert.subscribe(render);
    render();

    document.getElementById('alert-demo-variant')?.addEventListener('click', () => {
      const next = variants[(variants.indexOf(alert.state.variant) + 1) % variants.length];
      alert.actions.setVariant(next);
    });
    document.getElementById('alert-demo-dismiss')?.addEventListener('click', () => alert.actions.dismiss());
    document.getElementById('alert-demo-show')?.addEventListener('click', () => alert.actions.show());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAlertDemo);
  } else {
    runAlertDemo();
  }
</script>

## Next steps

[Toast](/headless/toast/) — the floating, queued, auto-dismissing relative of
this same "status message" idea.
