---
title: Layout — Grid
description:
  and-layout="grid" — 12-column grid, spans, and column start/end, plus the gap
  tokens shared with Flex.
---

`grid` switches `display: grid`. Gap tokens are shared with
[Flex](/layout/flex/#gap).

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="grid cols:3 gap:sm">
    <div and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.375rem; text-align: center;">1</div>
    <div and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.375rem; text-align: center;">2</div>
    <div and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.375rem; text-align: center;">3</div>
    <div and-layout="p:sm span:2" style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-radius: 0.375rem; text-align: center;">span:2</div>
    <div and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.375rem; text-align: center;">4</div>
  </div>
</div>

```html
<div and-layout="grid cols:3 gap:sm">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div and-layout="span:2">span:2</div>
  <div>4</div>
</div>
```

## Columns & spans

| Token         | Range / values     | CSS property                                       |
| ------------- | ------------------ | -------------------------------------------------- |
| `cols:*`      | `1` … `12`         | `grid-template-columns: repeat(n, minmax(0, 1fr))` |
| `span:*`      | `1` … `12`, `full` | `grid-column` (`full` = `1 / -1`)                  |
| `col-start:*` | `1` … `13`, `auto` | `grid-column-start`                                |
| `col-end:*`   | `1` … `13`, `auto` | `grid-column-end`                                  |

## Responsive

`cols:*`, `span:*`, `col-start:*`, `col-end:*`, and `gap*` all accept a
`@breakpoint` suffix — see [Overview → Responsive](/layout/overview/#responsive)
for the breakpoint table. The bare `grid` switch itself does not: there's no
`grid@md`, so this package can't flip a container from flex to grid at a
breakpoint on its own.

## Next steps

[Recipes](/layout/recipes/) — the responsive card grid and sidebar shell
patterns build on `cols`/`span` directly.
