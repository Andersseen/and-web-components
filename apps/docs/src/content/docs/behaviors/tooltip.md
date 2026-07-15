---
title: Behaviors — Tooltip
description:
  Hover/focus tooltip driven by the and-tooltip attribute, plus its imperative
  createTooltip factory.
---

<div class="and-live-example">
  <button and-tooltip="Saves your changes" and-tooltip-placement="top" style="padding: 0.5rem 1rem; border-radius: 0.375rem; border: 1px solid hsl(var(--border)); background: hsl(var(--background)); color: hsl(var(--foreground)); cursor: pointer;">Hover me</button>
</div>

```html
<button and-tooltip="Saves your changes" and-tooltip-placement="top">
  Hover me
</button>
```

## Attributes

| Attribute                                      | Values             | Default | Notes                                                       |
| ---------------------------------------------- | ------------------ | ------- | ----------------------------------------------------------- |
| `and-tooltip`                                  | text               | —       | Required — content shown in the tooltip.                    |
| `and-tooltip-placement`                        | `TooltipPlacement` | `'top'` | 12 values: `top`/`bottom`/`left`/`right` + `-start`/`-end`. |
| `and-tooltip-delay` / `and-tooltip-show-delay` | `number` (ms)      | `200`   | Either attribute sets the show delay.                       |
| `and-tooltip-hide-delay`                       | `number` (ms)      | `0`     |                                                             |
| `and-tooltip-offset`                           | `number` (px)      | `8`     | Gap between anchor and tooltip.                             |
| `and-tooltip-disabled`                         | boolean attribute  | `false` |                                                             |
| `and-tooltip-interactive`                      | boolean attribute  | `false` | Allow hovering onto the tooltip content without it closing. |

Dismissible with `Escape` without moving the pointer, per
[WCAG 1.4.13](https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html).

## Imperative API

```ts
import { createTooltip } from '@andersseen/behaviors/tooltip';

const tooltip = createTooltip(document.getElementById('save-btn'), {
  content: 'Saves your changes',
  placement: 'top',
});
```

| Option        | Type               | Default | Notes                                                       |
| ------------- | ------------------ | ------- | ----------------------------------------------------------- |
| `content`     | `string`           | `''`    | No-ops if empty — nothing renders.                          |
| `placement`   | `TooltipPlacement` | `'top'` | 12 values: `top`/`bottom`/`left`/`right` + `-start`/`-end`. |
| `showDelay`   | `number` (ms)      | `200`   |                                                             |
| `hideDelay`   | `number` (ms)      | `0`     |                                                             |
| `offset`      | `number` (px)      | `8`     | Gap between anchor and tooltip.                             |
| `disabled`    | `boolean`          | `false` |                                                             |
| `interactive` | `boolean`          | `false` | Allow hovering onto the tooltip content without it closing. |

`DEFAULT_TOOLTIP_CONFIG` is exported alongside the factory.

| Member                   | Signature                                   | Notes                                                                                                                                            |
| ------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `element`                | —                                           | The anchor passed in.                                                                                                                            |
| `show()` / `hide()`      | `() => void`                                | The same triggers `and-tooltip` wires (`mouseenter`/`focus`, `mouseleave`/`blur`) call these — invoke directly to show/hide from your own logic. |
| `updateOptions(options)` | `(options: Partial<TooltipConfig>) => void` | Setting `disabled: true` force-closes an open tooltip immediately.                                                                               |
| `destroy()`              | `() => void`                                | Removes the anchor's listeners and any open tooltip node.                                                                                        |

Behavior worth knowing that isn't visible from the attribute API: the tooltip
element is appended to `document.body` (`position: fixed`, positioned via
`requestAnimationFrame` after the anchor's layout settles) and **auto-dismisses
if any scrollable ancestor of the anchor scrolls** — it doesn't reposition on
scroll, it closes, so a stale tooltip never drifts away from its anchor.

## Accessibility

Wires `aria-describedby` from the anchor to the tooltip's `role="tooltip"`
element while it's open, and dismisses on `Escape` without requiring the pointer
to move — both anchor `focus`/`blur` and `mouseenter`/`mouseleave` trigger
show/hide, so keyboard-only users get the same content as mouse users.

## Next steps

[Recipes → Tooltip on a disabled control](/behaviors/recipes/#tooltip-on-a-disabled-control)
