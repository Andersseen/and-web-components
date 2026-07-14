---
title: Skeleton
description: Pulsing placeholder shown while content is loading.
---

Pulsing placeholder shown while content is loading. Announces itself via
`aria-busy="true"` and `aria-label="Loading"` — no props needed for
accessibility, just size it to roughly match the content it stands in for.

## Example

<div class="and-live-example" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
  <and-skeleton variant="circle" width="48px" height="48px"></and-skeleton>
  <and-skeleton variant="text" width="220px"></and-skeleton>
  <and-skeleton variant="text" width="160px"></and-skeleton>
</div>

```html
<and-skeleton variant="circle" width="48px" height="48px"></and-skeleton>
<and-skeleton variant="text" width="220px"></and-skeleton>
<and-skeleton variant="text" width="160px"></and-skeleton>
```

## Properties

| Property      | Attribute | Description                               | Type                              | Default     |
| ------------- | --------- | ----------------------------------------- | --------------------------------- | ----------- |
| `customClass` | `class`   | Additional CSS classes from the consumer. | `string`                          | `''`        |
| `height`      | `height`  | CSS height (e.g. `16px`, `1rem`).         | `string`                          | `'16px'`    |
| `variant`     | `variant` | Visual shape of the skeleton.             | `"circle" \| "default" \| "text"` | `'default'` |
| `width`       | `width`   | CSS width (e.g. `100px`, `100%`).         | `string`                          | `'100%'`    |
