---
title: Input
description:
  Single-line text input, rendered in light DOM so it works with native forms.
---

Single-line text input. Since it renders a plain `<input>` with no associated
`<label>`, always set `label` (used as `aria-label`) — and when `hasError` is
true, also set `describedBy` to point at the id of your visible error message,
otherwise screen readers announce the field as invalid without saying why.

Renders in light DOM (`scoped` styles, not Shadow DOM) on purpose: the `<input>`
this component renders is a real descendant of whatever `<form>` wraps it, so
`FormData`, native `required`/`pattern` validation, autofill, and password
managers all work without any extra wiring.

## Example

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <and-input label="Email address" type="email" placeholder="you@example.com" name="email" style="max-width: 24rem;"></and-input>
</div>

```html
<and-input
  label="Email address"
  type="email"
  placeholder="you@example.com"
  name="email"
></and-input>
```

## Properties

| Property      | Attribute      | Description                                                                              | Type                                                                        | Default  |
| ------------- | -------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------- |
| `customClass` | `class`        | Additional CSS classes from the consumer.                                                | `string`                                                                    | `''`     |
| `describedBy` | `described-by` | ID of the element that describes this input (e.g. error message).                        | `string`                                                                    | `''`     |
| `disabled`    | `disabled`     | Disables interaction when true.                                                          | `boolean`                                                                   | `false`  |
| `hasError`    | `has-error`    | Whether the input is in an error state.                                                  | `boolean`                                                                   | `false`  |
| `label`       | `label`        | Accessible label for the input (used when no visible label exists).                      | `string`                                                                    | `''`     |
| `name`        | `name`         | Name attribute forwarded to the native input — required for it to show up in `FormData`. | `string`                                                                    | `''`     |
| `placeholder` | `placeholder`  | Placeholder text for the input.                                                          | `string`                                                                    | `''`     |
| `required`    | `required`     | Marks the input as required.                                                             | `boolean`                                                                   | `false`  |
| `type`        | `type`         | HTML input type.                                                                         | `"email" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "url"` | `'text'` |
| `value`       | `value`        | Current value of the input.                                                              | `string`                                                                    | `''`     |

## Events

| Event            | Description                           | Type                  |
| ---------------- | ------------------------------------- | --------------------- |
| `andInputBlur`   | Emitted when the input loses focus.   | `CustomEvent<void>`   |
| `andInputChange` | Emitted when the input value changes. | `CustomEvent<string>` |
