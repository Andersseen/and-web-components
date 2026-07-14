---
title: Select
description: Custom role=combobox select, styleable unlike a native select.
---

Custom `role="combobox"` select, styleable unlike a native `<select>`.
Implements the ARIA combobox pattern: `aria-expanded`, `aria-controls`,
`aria-activedescendant` tracks the highlighted option while focus stays on the
trigger, and the listbox options get `aria-selected`. A hidden native `<input>`
mirrors `value` when `name` is set.

Renders in light DOM (`scoped` styles, not Shadow DOM) on purpose: that hidden
input is a real descendant of whatever `<form>` wraps this component, so it
actually shows up in `FormData` on submit — inside a Shadow DOM it would be
invisible to the enclosing form.

`options` accepts either a real array or a JSON string — each option is
`{ value: string; text: string; disabled?: boolean }` — so it works directly as
a plain HTML attribute.

## Example

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <and-select
    label="Framework"
    name="framework"
    placeholder="Choose a framework"
    options='[{"value":"angular","text":"Angular"},{"value":"react","text":"React"},{"value":"vue","text":"Vue"},{"value":"vanilla","text":"Vanilla"}]'
    style="max-width: 20rem;"
  ></and-select>
</div>

```html
<and-select
  label="Framework"
  name="framework"
  placeholder="Choose a framework"
  options='[{"value":"angular","text":"Angular"},{"value":"react","text":"React"},{"value":"vue","text":"Vue"}]'
></and-select>
```

## Properties

| Property        | Attribute        | Description                                                            | Type                          | Default              |
| --------------- | ---------------- | ---------------------------------------------------------------------- | ----------------------------- | -------------------- |
| `customClass`   | `class`          | Additional CSS classes from the consumer.                              | `string`                      | `''`                 |
| `describedBy`   | `described-by`   | ID of element describing this field.                                   | `string`                      | `''`                 |
| `disabled`      | `disabled`       | Disables interaction when true.                                        | `boolean`                     | `false`              |
| `hasError`      | `has-error`      | Whether the select is in an error state.                               | `boolean`                     | `false`              |
| `label`         | `label`          | Accessible label for the select.                                       | `string`                      | `''`                 |
| `menuPlacement` | `menu-placement` | Menu placement strategy.                                               | `"auto" \| "bottom" \| "top"` | `'auto'`             |
| `name`          | `name`           | Name attribute forwarded to native select.                             | `string`                      | `''`                 |
| `options`       | `options`        | Options rendered in the select menu. Can be an array or a JSON string. | `SelectOption[] \| string`    | `[]`                 |
| `placeholder`   | `placeholder`    | Placeholder shown when no value is selected.                           | `string`                      | `'Select an option'` |
| `required`      | `required`       | Marks the field as required.                                           | `boolean`                     | `false`              |
| `value`         | `value`          | Current selected value.                                                | `string`                      | `''`                 |

## Events

| Event             | Description                               | Type                  |
| ----------------- | ----------------------------------------- | --------------------- |
| `andSelectBlur`   | Emitted when select loses focus / closes. | `CustomEvent<void>`   |
| `andSelectChange` | Emitted when selected value changes.      | `CustomEvent<string>` |
