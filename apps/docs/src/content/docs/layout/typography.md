---
title: Layout — Typography
description:
  The and-text attribute — heading/body presets and the align/weight/color
  modifiers, driven by the same design tokens as and-layout.
---

Each preset bundles a font-size / weight / line-height combination (`caption`
sets a muted color instead of a line-height). Presets are plain switches — no
`@breakpoint` form.

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div and-text="h3">Heading — h3 preset</div>
  <div and-text="p">Body copy uses the p preset: a comfortable 1rem / 1.5 line height for running text.</div>
  <div and-text="p-sm color:muted">A smaller p-sm line, tinted with color:muted.</div>
  <div and-text="caption">CAPTION PRESET — small and muted by default.</div>
</div>

```html
<h2 and-text="h2 weight:bold">Title</h2>
<p and-text="p">Description</p>
```

## Presets

| Preset    | Font size        | Weight         | Line height     |
| --------- | ---------------- | -------------- | --------------- |
| `h1`      | `3.75rem` (6xl)  | `700` bold     | `1.1`           |
| `h2`      | `3rem` (5xl)     | `700` bold     | `1.1`           |
| `h3`      | `2.25rem` (4xl)  | `600` semibold | `1.2`           |
| `h4`      | `1.875rem` (3xl) | `600` semibold | `1.2`           |
| `h5`      | `1.5rem` (2xl)   | `500` medium   | `1.3`           |
| `h6`      | `1.25rem` (xl)   | `500` medium   | `1.3`           |
| `p`       | `1rem` (base)    | `400` normal   | `1.5`           |
| `p-sm`    | `0.875rem` (sm)  | `400` normal   | `1.5`           |
| `p-xs`    | `0.75rem` (xs)   | `400` normal   | `1.5`           |
| `caption` | `0.75rem` (xs)   | `400` normal   | — (muted color) |

## Modifiers

| Token      | Values                                                                               | CSS property  |
| ---------- | ------------------------------------------------------------------------------------ | ------------- |
| `align:*`  | `left`, `center`, `right`, `justify`                                                 | `text-align`  |
| `weight:*` | `thin`, `light`, `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`        | `font-weight` |
| `color:*`  | `primary`, `secondary`, `accent`, `muted`, `destructive`, `background`, `foreground` | `color`       |

Weight numeric values: `thin` 100, `light` 300, `normal` 400, `medium` 500,
`semibold` 600, `bold` 700, `extrabold` 800, `black` 900.

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.5rem;">
  <div and-text="p align:right weight:bold">Right-aligned, bold</div>
  <div and-text="p color:destructive">Tinted with color:destructive</div>
</div>

```html
<p and-text="align:right weight:bold">Right-aligned, bold</p>
```

:::caution[`color:*` needs `--color-*` tokens]

`color:*` (and the `caption` preset's color) resolve through `--color-primary`,
`--color-foreground`, etc. This is a real gap between the two packages as
shipped: `@andersseen/layout`'s README says these resolve through "the tokens
already provided by `@andersseen/web-components`'s theme files", but
`packages/web-components`'s palettes define **bare** `--primary`/`--foreground`
(no `--color-` prefix) — so `and-text="color:primary"` silently falls back to
inherited text color when the two packages are combined as-is. A standalone
consumer needs to define the `--color-*` custom properties themselves. This docs
site does exactly that (a one-time
`:root { --color-primary: hsl(var(--primary)); … }` bridge), which is why the
`color:*` examples above actually render.

:::

## Responsive

`align:*`, `weight:*`, and `color:*` accept a `@breakpoint` suffix — see
[Overview → Responsive](/layout/overview/#responsive) for the breakpoint table.
The presets (`h1`…`caption`) do not — there's no `h1@md`, so this package can't
swap a whole type preset at a breakpoint on its own.

## Next steps

[Recipes](/layout/recipes/) — the media object and toolbar patterns pair
`and-text` presets with `and-layout`.
