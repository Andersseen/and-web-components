---
title: Layout — Spacing
description:
  The and-layout padding/margin tokens (p, m, and their -t/-b/-l/-r/-x/-y
  variants) and the spacing scale they share with gap.
---

One scale drives `gap` (see [Flex](/layout/flex/#gap)), every padding token, and
every margin token — so a `md` gap and a `md` padding are always the same size.

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div and-layout="horizontal gap:sm align:end">
    <div and-layout="p:xs" style="background: hsl(var(--muted)); border-radius: 0.375rem;">xs</div>
    <div and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.375rem;">sm</div>
    <div and-layout="p:md" style="background: hsl(var(--muted)); border-radius: 0.375rem;">md</div>
    <div and-layout="p:lg" style="background: hsl(var(--muted)); border-radius: 0.375rem;">lg</div>
    <div and-layout="p:xl" style="background: hsl(var(--muted)); border-radius: 0.375rem;">xl</div>
  </div>
</div>

```html
<div and-layout="p:md">Padded on all sides</div>
```

## Scale

| Token  | Value      | Token  | Value    |
| ------ | ---------- | ------ | -------- |
| `none` | `0`        | `lg`   | `1.5rem` |
| `xxxs` | `0.125rem` | `xl`   | `2rem`   |
| `xxs`  | `0.25rem`  | `xxl`  | `3rem`   |
| `xs`   | `0.5rem`   | `xxxl` | `4rem`   |
| `sm`   | `0.75rem`  | `auto` | `auto`   |
| `md`   | `1rem`     |        |          |

`auto` only applies to margin — it's what makes the margin utilities double as a
centering tool: `m-x:auto` on a width-constrained block centers it horizontally
(see [Recipes → Center a block](/layout/recipes/#center-a-block)).

## Padding & margin

| Token                      | Direction                             |
| -------------------------- | ------------------------------------- |
| `p`, `m`                   | All four sides                        |
| `p-t`, `p-b`, `p-l`, `p-r` | Top / bottom / left / right (padding) |
| `m-t`, `m-b`, `m-l`, `m-r` | Top / bottom / left / right (margin)  |
| `p-x`, `m-x`               | Left + right                          |
| `p-y`, `m-y`               | Top + bottom                          |

Example combining several: `and-layout="p:lg m-x:auto gap-x:md"`.

## Responsive

Every token above accepts a `@breakpoint` suffix — see
[Overview → Responsive](/layout/overview/#responsive) for the breakpoint table:

```html
<!-- padding grows with viewport -->
<div and-layout="p:sm p@md:lg">…</div>
```

## Next steps

[Recipes → Center a block](/layout/recipes/#center-a-block)
