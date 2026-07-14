---
title: Badge
description: Small label for status, category, or count.
---

Small label for status, category, or count. Purely presentational — it has no
default ARIA role, since forcing `role="status"` on every badge would mislabel
static labels (e.g. "Beta") as live regions and cause screen readers to announce
them as if they update. If a specific badge _does_ represent a live status (e.g.
an unread count), add `role="status"` on the instance yourself.

## Example

<div class="and-live-example">
  <and-badge variant="default">Default</and-badge>
  <and-badge variant="secondary">Secondary</and-badge>
  <and-badge variant="destructive">Destructive</and-badge>
  <and-badge variant="outline">Outline</and-badge>
</div>

```html
<and-badge variant="default">Default</and-badge>
<and-badge variant="secondary">Secondary</and-badge>
<and-badge variant="destructive">Destructive</and-badge>
<and-badge variant="outline">Outline</and-badge>
```

## Properties

| Property      | Attribute | Description                               | Type                                                     | Default     |
| ------------- | --------- | ----------------------------------------- | -------------------------------------------------------- | ----------- |
| `customClass` | `class`   | Additional CSS classes from the consumer. | `string`                                                 | `''`        |
| `variant`     | `variant` | Visual variant of the badge.              | `"default" \| "destructive" \| "outline" \| "secondary"` | `'default'` |

<small>
  Generated from `packages/web-components/src/components/and-badge/readme.md` — keep this table in sync with the
  Stencil source, don't hand-edit the numbers.
</small>
