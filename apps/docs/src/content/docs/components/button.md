---
title: Button
description: Interactive button, or an anchor styled as one when href is set.
---

Interactive button, or an anchor styled as one when `href` is set.

For `size="icon"` (no visible text), pass `aria-label` on the element — it's
forwarded to the inner control since the host itself is never left
focusable/labelled (an explicit `role`/`tabindex` on the host is moved to the
inner button/anchor on load, so there's only one interactive surface for
assistive tech to land on).

## Example

<div class="and-live-example">
  <and-button variant="default">Default</and-button>
  <and-button variant="destructive">Destructive</and-button>
  <and-button variant="outline">Outline</and-button>
  <and-button variant="secondary">Secondary</and-button>
  <and-button variant="ghost">Ghost</and-button>
  <and-button variant="link">Link</and-button>
</div>

```html
<and-button variant="default">Default</and-button>
<and-button variant="destructive">Destructive</and-button>
<and-button variant="outline">Outline</and-button>
<and-button variant="secondary">Secondary</and-button>
<and-button variant="ghost">Ghost</and-button>
<and-button variant="link">Link</and-button>
```

## Properties

| Property      | Attribute  | Description                                                                              | Type                                                                          | Default     |
| ------------- | ---------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| `customClass` | `class`    | Additional CSS classes to merge with the internal styles.                                | `string`                                                                      | `''`        |
| `disabled`    | `disabled` | Disables the button when true.                                                           | `boolean`                                                                     | `false`     |
| `href`        | `href`     | When set, renders as an anchor (`<a>`) instead of `<button>`.                            | `string`                                                                      | `''`        |
| `loading`     | `loading`  | Shows a loading spinner and disables interaction.                                        | `boolean`                                                                     | `false`     |
| `rel`         | `rel`      | Rel attribute for the anchor. Defaults to `noopener noreferrer` when target is `_blank`. | `string`                                                                      | `''`        |
| `size`        | `size`     | Size of the button.                                                                      | `"default" \| "icon" \| "lg" \| "sm"`                                         | `'default'` |
| `target`      | `target`   | Target for the anchor (e.g. `_blank`). Only used when `href` is set.                     | `string`                                                                      | `''`        |
| `type`        | `type`     | HTML button type attribute.                                                              | `"button" \| "reset" \| "submit"`                                             | `'button'`  |
| `variant`     | `variant`  | Visual variant of the button.                                                            | `"default" \| "destructive" \| "ghost" \| "link" \| "outline" \| "secondary"` | `'default'` |

## Events

| Event            | Description              | Type                      |
| ---------------- | ------------------------ | ------------------------- |
| `andButtonClick` | Emitted on button click. | `CustomEvent<MouseEvent>` |

<small>
  Generated from `packages/web-components/src/components/and-button/readme.md` — keep this table in sync with the
  Stencil source, don't hand-edit the numbers.
</small>
