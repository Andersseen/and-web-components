---
title: Tooltip
description:
  Wraps its slotted trigger and shows a tooltip popup on hover or keyboard
  focus.
---

Wraps its slotted trigger and shows a `role="tooltip"` popup on hover _or_
keyboard focus (via `focusin`/`focusout`, not just mouse), per
[WCAG 1.4.13](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html).

Known limitation: `aria-describedby` is applied to the `<and-tooltip>` host
element, not to the slotted trigger itself (a custom element can't reach into
and mutate arbitrary slotted content). If your trigger is a focusable element
like a `<button>`, consider also adding `aria-describedby` on it directly,
pointing at this tooltip, for the most reliable screen-reader announcement.

## Example

<div class="and-live-example">
  <and-tooltip content="Saves your changes" placement="top">
    <and-button variant="outline">Hover me</and-button>
  </and-tooltip>
</div>

```html
<and-tooltip content="Saves your changes" placement="top">
  <and-button variant="outline">Hover me</and-button>
</and-tooltip>
```

## Properties

| Property     | Attribute     | Description                                                        | Type                                     | Default     |
| ------------ | ------------- | ------------------------------------------------------------------ | ---------------------------------------- | ----------- |
| `closeDelay` | `close-delay` | Delay in ms before hiding the tooltip.                             | `number`                                 | `0`         |
| `content`    | `content`     | Text content of the tooltip (alternative: use the `content` slot). | `string`                                 | `undefined` |
| `openDelay`  | `open-delay`  | Delay in ms before showing the tooltip.                            | `number`                                 | `0`         |
| `placement`  | `placement`   | Preferred placement of the tooltip relative to its trigger.        | `"bottom" \| "left" \| "right" \| "top"` | `'top'`     |
