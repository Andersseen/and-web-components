---
title: Control
description:
  Generic form-field wrapper -- label + your own native/custom control + hint or
  error message.
---

Generic form-field wrapper: label + your own native/custom control + hint or
error message, wired together with real `for`/`id` and `aria-describedby` — for
the cases [Input](/components/input/) / [Select](/components/select/) don't
cover. Unlike those two, `and-control` never renders the control itself; you
slot in whatever you need (`<textarea>`, a native `<select>`, a third-party
widget, `and-input`, anything), and it only owns the label/message layout around
it.

The slotted control keeps its own encapsulation — `and-control` reads the first
slotted element, gives it an `id` if it doesn't have one, and points the label's
`for` and the message's `aria-describedby` at it. It re-runs whenever the slot's
content changes, so this works with content rendered asynchronously by a
framework.

## Example

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <and-control label="Bio" hint="Max 200 characters." style="max-width: 24rem;">
    <textarea rows="3" style="width: 100%; box-sizing: border-box; font: inherit; padding: 0.5rem; border-radius: 0.375rem; border: 1px solid hsl(var(--border));"></textarea>
  </and-control>
</div>

```html
<and-control label="Bio" hint="Max 200 characters.">
  <textarea rows="3"></textarea>
</and-control>
```

## Properties

| Property   | Attribute  | Description                                                                                           | Type      | Default |
| ---------- | ---------- | ----------------------------------------------------------------------------------------------------- | --------- | ------- |
| `error`    | `error`    | Error message shown below the control instead of `hint`. Also sets `aria-invalid` on the control.     | `string`  | `''`    |
| `hint`     | `hint`     | Helper text shown below the control. Hidden while `error` is set.                                     | `string`  | `''`    |
| `label`    | `label`    | Label text for the slotted control.                                                                   | `string`  | `''`    |
| `required` | `required` | Shows a required indicator next to the label. Purely visual — set `required` on your own control too. | `boolean` | `false` |
