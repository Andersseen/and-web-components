---
title: Alert
description: Contextual message banner for feedback, warnings, or errors.
---

Contextual message banner for feedback, warnings, or errors.

Renders with `role="alert"` so assistive tech announces it as soon as it mounts
— don't use it for content that appears well before it's relevant, since that
triggers an announcement immediately on page load too.

## Example

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <and-alert variant="default">Heads up — this is a default alert.</and-alert>
  <and-alert variant="info">Here's some useful information.</and-alert>
  <and-alert variant="success">Your changes were saved.</and-alert>
  <and-alert variant="warning">Double-check this before continuing.</and-alert>
  <and-alert variant="destructive" dismissible>Something went wrong.</and-alert>
</div>

```html
<and-alert variant="default">Heads up — this is a default alert.</and-alert>
<and-alert variant="info">Here's some useful information.</and-alert>
<and-alert variant="success">Your changes were saved.</and-alert>
<and-alert variant="warning">Double-check this before continuing.</and-alert>
<and-alert variant="destructive" dismissible>Something went wrong.</and-alert>
```

## Properties

| Property      | Attribute     | Description                         | Type                                                             | Default     |
| ------------- | ------------- | ----------------------------------- | ---------------------------------------------------------------- | ----------- |
| `dismissible` | `dismissible` | Whether the alert can be dismissed. | `boolean`                                                        | `false`     |
| `variant`     | `variant`     | Visual variant of the alert.        | `"default" \| "destructive" \| "info" \| "success" \| "warning"` | `'default'` |

## Events

| Event        | Description                          | Type                |
| ------------ | ------------------------------------ | ------------------- |
| `andDismiss` | Emitted when the alert is dismissed. | `CustomEvent<void>` |

## Dependencies

Depends on [`and-icon`](/components/) internally for the dismiss control.

<small>
  Generated from `packages/web-components/src/components/and-alert/readme.md` — keep this table in sync with the
  Stencil source, don't hand-edit the numbers.
</small>
