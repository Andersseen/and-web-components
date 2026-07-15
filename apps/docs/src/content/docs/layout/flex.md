---
title: Layout — Flex
description:
  and-layout="horizontal"/"vertical" — flexbox alignment, wrapping, and the gap
  tokens shared with Grid.
---

`horizontal` sets `display: flex; flex-direction: row`; `vertical` sets
`flex-direction: column`. Both are plain switches — see
[Responsive](#responsive) below for why they have no `@breakpoint` form.

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="horizontal gap:sm align:center justify:between" style="border: 1px dashed var(--sl-color-hairline); padding: 0.75rem; border-radius: 0.5rem;">
    <span and-layout="p-x:sm p-y:xs" style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-radius: 0.375rem;">start</span>
    <span and-layout="p-x:sm p-y:xs" style="background: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); border-radius: 0.375rem;">between</span>
    <span and-layout="p-x:sm p-y:xs" style="background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); border-radius: 0.375rem;">end</span>
  </div>
</div>

```html
<div and-layout="horizontal gap:sm align:center justify:between">
  <span>start</span>
  <span>between</span>
  <span>end</span>
</div>
```

## Alignment

| Token       | Values                                                  | CSS property      |
| ----------- | ------------------------------------------------------- | ----------------- |
| `align:*`   | `start`, `end`, `center`, `baseline`, `stretch`         | `align-items`     |
| `justify:*` | `start`, `end`, `center`, `between`, `around`, `evenly` | `justify-content` |
| `wrap:*`    | `nowrap`, `wrap`, `wrap-reverse`                        | `flex-wrap`       |

`start`/`end` map to `flex-start`/`flex-end`; `between`/`around`/`evenly` map to
`space-between`/`space-around`/`space-evenly`.

## Gap

`gap`, `gap-x` (`column-gap`), `gap-y` (`row-gap`) — driven by the same
[spacing scale](/layout/spacing/#scale) as padding and margin, and the same
selectors work whether the container is `horizontal`, `vertical`, or `grid` (gap
is a CSS property both layout modes share).

```html
<div and-layout="horizontal gap:md">…</div>
<div and-layout="grid cols:3 gap-x:sm gap-y:lg">…</div>
```

## Responsive

`align:*`, `justify:*`, `wrap:*`, and every `gap*` token accept a `@breakpoint`
suffix (see [Overview → Responsive](/layout/overview/#responsive) for the
breakpoint table). The bare `horizontal`/`vertical` switches do not — there's no
`horizontal@md`, so this package can't flip flex direction at a breakpoint on
its own; do that with your own media query on top if you need it.

## Next steps

[Recipes](/layout/recipes/) — the toolbar, media object, and vertical stack
patterns are all built from these tokens directly.
