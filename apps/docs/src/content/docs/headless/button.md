---
title: Headless Core — Button
description:
  createButton — disabled/loading state and ARIA props for a button, with zero
  rendering. Powers the styled Button component.
---

Powers [Button](/components/button/) (`@andersseen/web-components`) and
`and-vanilla-button` (`@andersseen/vanilla-components`) internally. The simplest
factory in the package — a good first read if you're new to the
`state`/`actions`/`queries`/prop-getter shape every other factory follows.

## Usage

```ts
import { createButton } from '@andersseen/headless-components/button';

const button = createButton({
  onClick: e => console.log('clicked'),
  disabled: false,
});

button.actions.setLoading(true);
const props = button.getButtonProps();
```

## Config

| Option      | Type                              | Default    | Notes                                         |
| ----------- | --------------------------------- | ---------- | --------------------------------------------- |
| `disabled`  | `boolean`                         | `false`    |                                               |
| `loading`   | `boolean`                         | `false`    |                                               |
| `type`      | `'button' \| 'submit' \| 'reset'` | `'button'` |                                               |
| `onClick`   | `(event: MouseEvent) => void`     | —          | Only fires when not disabled and not loading. |
| `ariaLabel` | `string`                          | —          |                                               |

## State

| Field      | Type                              | Notes |
| ---------- | --------------------------------- | ----- |
| `disabled` | `boolean`                         |       |
| `loading`  | `boolean`                         |       |
| `type`     | `'button' \| 'submit' \| 'reset'` |       |

## Actions & queries

| Member                   | Signature                     | Notes                                  |
| ------------------------ | ----------------------------- | -------------------------------------- |
| `actions.setDisabled(v)` | `(disabled: boolean) => void` |                                        |
| `actions.setLoading(v)`  | `(loading: boolean) => void`  |                                        |
| `queries.isDisabled()`   | `() => boolean`               | `true` if `disabled` **or** `loading`. |
| `queries.isLoading()`    | `() => boolean`               |                                        |

## Prop-getter & handler

`getButtonProps()` returns `type`, `disabled`, `tabindex` (`-1` when disabled),
`aria-disabled`, `aria-busy` (mirrors `loading`), `aria-label`, `data-state`
(`'active' | 'inactive'`), `data-disabled`.

`handleClick(event)` guards `disabled`/`loading` (calls `event.preventDefault()`
and returns early) before invoking your `onClick`.

## Live example

The actual, unmodified return value of `createButton()`, live on this page —
click to run `handleClick`, or toggle loading to see `aria-busy` flip:

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="button-demo-click">Click me</and-button>
    <and-button id="button-demo-loading" variant="outline">Toggle loading</and-button>
  </div>
  <pre id="button-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runButtonDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('button-demo-output');
    if (!H || !output) return;

    let clicks = 0;
    const button = H.createButton({ onClick: () => (clicks += 1) });

    const render = () => {
      output.textContent =
        'button.getButtonProps() →\n' +
        JSON.stringify(button.getButtonProps(), null, 2) +
        '\n\nclicks handled: ' + clicks;
    };
    button.subscribe(render);
    render();

    document.getElementById('button-demo-click')?.addEventListener('click', e => {
      button.handleClick(e);
      render();
    });
    document.getElementById('button-demo-loading')?.addEventListener('click', () => {
      button.actions.setLoading(!button.state.loading);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runButtonDemo);
  } else {
    runButtonDemo();
  }
</script>

## Next steps

[Primitives](/headless/primitives/) — the `StateStore` every factory's
`state`/`subscribe` is built on.
