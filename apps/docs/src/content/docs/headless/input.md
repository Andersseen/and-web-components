---
title: Headless Core — Input
description:
  createInput — value/focus/touched state and validity for a text input. Powers
  the styled Input component.
---

Powers [Input](/components/input/) internally. The smallest state shape in the
package — no keyboard handler, since text entry is native browser behavior the
factory doesn't need to intercept.

## Usage

```ts
import { createInput } from '@andersseen/headless-components/input';

const input = createInput({
  defaultValue: '',
  required: true,
  onValueChange: value => console.log('Value:', value),
});

input.actions.setValue('hello');
input.queries.isValid(); // true — non-empty and required is satisfied
```

## Config

| Option          | Type                      | Default | Notes                     |
| --------------- | ------------------------- | ------- | ------------------------- |
| `defaultValue`  | `string`                  | `''`    |                           |
| `disabled`      | `boolean`                 | `false` |                           |
| `required`      | `boolean`                 | `false` |                           |
| `maxLength`     | `number`                  | —       | Forwarded as `maxlength`. |
| `onValueChange` | `(value: string) => void` | —       | Not called if `disabled`. |

## State

`value`, `disabled`, `required`, `touched` (set on `blur()`), `focused`.

## Actions & queries

| Member                   | Signature                     | Notes                                          |
| ------------------------ | ----------------------------- | ---------------------------------------------- |
| `actions.setValue(v)`    | `(value: string) => void`     | No-ops if `disabled`.                          |
| `actions.setDisabled(v)` | `(disabled: boolean) => void` |                                                |
| `actions.setRequired(v)` | `(required: boolean) => void` |                                                |
| `actions.focus()`        | `() => void`                  | No-ops if `disabled`; sets `focused: true`.    |
| `actions.blur()`         | `() => void`                  | Sets `focused: false` **and** `touched: true`. |
| `queries.isEmpty()`      | `() => boolean`               |                                                |
| `queries.isValid()`      | `() => boolean`               | Always `true` unless `required` **and** empty. |

## Prop-getter

`getInputProps()` returns `type: 'text'`, `value`, `disabled`, `required`,
`maxlength`, `aria-disabled`, `aria-required`, `aria-invalid` (only `true` once
the field has been `touched` **and** is empty **and** `required` — so it doesn't
flag invalid before the user has had a chance to type anything), `data-state`.

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <input id="input-demo-el" type="text" placeholder="Type here…" style="padding: 0.5rem 0.75rem; border: 1px solid hsl(var(--border)); border-radius: 0.375rem; background: hsl(var(--background)); color: hsl(var(--foreground)); max-width: 16rem;" />
  <pre id="input-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runInputDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('input-demo-output');
    const el = document.getElementById('input-demo-el');
    if (!H || !output || !el) return;

    const input = H.createInput({ required: true });

    const render = () => {
      output.textContent = 'input.getInputProps() →\n' + JSON.stringify(input.getInputProps(), null, 2);
    };
    input.subscribe(render);
    render();

    el.addEventListener('input', e => input.actions.setValue(e.target.value));
    el.addEventListener('focus', () => input.actions.focus());
    el.addEventListener('blur', () => input.actions.blur());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runInputDemo);
  } else {
    runInputDemo();
  }
</script>

Type something, then clear it and click away — `aria-invalid` flips to `true`
only after the field has been touched.

## Next steps

[Select](/headless/select/) — a richer relative with an options list, open
state, and typeahead.
