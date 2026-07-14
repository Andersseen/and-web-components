---
title: Layout — Overview
description:
  Pure-CSS, attribute-driven layout and typography utilities. No JavaScript, no
  build step for consumers.
---

`@andersseen/layout` is pure-CSS, attribute-driven layout and typography
utilities. No JavaScript, no build step for consumers — import one stylesheet
and start composing layouts with HTML attributes instead of utility classes.
Usable entirely on its own: an app that only wants attribute-driven
layout/typography can install just this package, without
`@andersseen/web-components`, `@andersseen/headless-components`, or any
framework adapter.

## Install

```bash
pnpm add @andersseen/layout
```

```css
@import '@andersseen/layout';
/* or the pre-minified build */
@import '@andersseen/layout/dist/layout.min.css';
```

That's the whole setup — there's no JS entry point to call, nothing to
initialize, and nothing to register. Because it's static CSS keyed off
attributes, it works identically in plain HTML, Astro, React, Vue, Angular, or
inside server-rendered markup (no hydration step, SSR-safe by construction).

## How it works

Two attributes drive everything: `and-layout` for flex/grid/spacing, `and-text`
for typography. Their values are **space-separated tokens**, so many utilities
share one attribute:

```html
<div and-layout="horizontal gap:md align:center justify:between"></div>
```

Under the hood each token is a whitespace-separated-word attribute selector —
`[and-layout~='gap:md']`, `[and-layout~='align:center']`, and so on. Two
consequences worth knowing:

- **Order doesn't matter.** `and-layout="grid gap:md cols:3"` and
  `and-layout="cols:3 grid gap:md"` are identical.
- **Specificity is low and flat.** Every utility is a single attribute selector
  (specificity `0,1,0`), so overriding one with your own class or inline style
  is easy — there are no `!important`s and no deep selectors to fight.

## Example

<div class="and-live-example" style="padding: 1rem;">
  <div and-layout="horizontal gap:md align:center justify:between wrap:wrap" style="width: 100%; border: 1px dashed var(--sl-color-hairline); padding: 1rem; border-radius: 0.5rem;">
    <div and-layout="vertical gap:xxs">
      <h3 and-text="h4 weight:bold" style="margin: 0;">Title</h3>
      <p and-text="p-sm" style="margin: 0;">Description text using the p-sm preset.</p>
    </div>
    <div and-layout="horizontal gap:sm">
      <and-button variant="outline">Cancel</and-button>
      <and-button>Confirm</and-button>
    </div>
  </div>
</div>

```html
<div and-layout="horizontal gap:md align:center justify:between wrap:wrap">
  <div and-layout="vertical gap:sm">
    <h2 and-text="h2 weight:bold">Title</h2>
    <p and-text="p">Description</p>
  </div>
</div>

<!-- Responsive: prop@breakpoint:value -->
<div and-layout="grid cols:1 cols@md:2 cols@lg:3 gap:lg">...</div>
```

## `and-layout` reference

### Flex

`horizontal` sets `display: flex; flex-direction: row`; `vertical` sets
`flex-direction: column`. Both are plain switches — see
[the note on responsive display](#responsive-modifiers) about why they (and
`grid`) have no `@breakpoint` form.

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="horizontal gap:sm align:center justify:between" style="border: 1px dashed var(--sl-color-hairline); padding: 0.75rem; border-radius: 0.5rem;">
    <span and-layout="p-x:sm p-y:xs" style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-radius: 0.375rem;">start</span>
    <span and-layout="p-x:sm p-y:xs" style="background: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); border-radius: 0.375rem;">between</span>
    <span and-layout="p-x:sm p-y:xs" style="background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); border-radius: 0.375rem;">end</span>
  </div>
</div>

| Token       | Values                                                  | CSS property      |
| ----------- | ------------------------------------------------------- | ----------------- |
| `align:*`   | `start`, `end`, `center`, `baseline`, `stretch`         | `align-items`     |
| `justify:*` | `start`, `end`, `center`, `between`, `around`, `evenly` | `justify-content` |
| `wrap:*`    | `nowrap`, `wrap`, `wrap-reverse`                        | `flex-wrap`       |

`start`/`end` map to `flex-start`/`flex-end`; `between`/`around`/`evenly` map to
`space-between`/`space-around`/`space-evenly`.

### Grid

`grid` switches `display: grid`. Gap tokens (below) are shared with flex.

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="grid cols:3 gap:sm">
    <div and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.375rem; text-align: center;">1</div>
    <div and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.375rem; text-align: center;">2</div>
    <div and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.375rem; text-align: center;">3</div>
    <div and-layout="p:sm span:2" style="background: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border-radius: 0.375rem; text-align: center;">span:2</div>
    <div and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.375rem; text-align: center;">4</div>
  </div>
</div>

| Token         | Range / values     | CSS property                                       |
| ------------- | ------------------ | -------------------------------------------------- |
| `cols:*`      | `1` … `12`         | `grid-template-columns: repeat(n, minmax(0, 1fr))` |
| `span:*`      | `1` … `12`, `full` | `grid-column` (`full` = `1 / -1`)                  |
| `col-start:*` | `1` … `13`, `auto` | `grid-column-start`                                |
| `col-end:*`   | `1` … `13`, `auto` | `grid-column-end`                                  |

### Spacing

The same spacing scale drives `gap` and every padding/margin token:

- **Gap** — `gap`, `gap-x` (`column-gap`), `gap-y` (`row-gap`). Works for both
  flex and grid.
- **Padding** — `p`, `p-t`, `p-b`, `p-l`, `p-r`, `p-x` (left+right), `p-y`
  (top+bottom).
- **Margin** — `m`, `m-t`, `m-b`, `m-l`, `m-r`, `m-x` (left+right), `m-y`
  (top+bottom).

| Token  | Value      | Token  | Value    |
| ------ | ---------- | ------ | -------- |
| `none` | `0`        | `lg`   | `1.5rem` |
| `xxxs` | `0.125rem` | `xl`   | `2rem`   |
| `xxs`  | `0.25rem`  | `xxl`  | `3rem`   |
| `xs`   | `0.5rem`   | `xxxl` | `4rem`   |
| `sm`   | `0.75rem`  | `auto` | `auto`   |
| `md`   | `1rem`     |        |          |

The `auto` value is what makes the margin utilities double as a centering tool:
`m-x:auto` on a block with a width centers it horizontally (see
[Recipes → Center a block](/layout/recipes/#center-a-block)). Example combining
several: `and-layout="p:lg m-x:auto gap-x:md"`.

## `and-text` reference

### Presets

Each preset bundles a font-size / weight / line-height combination (`caption`
sets a muted color instead of a line-height). Presets are plain switches — no
`@breakpoint` form.

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

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div and-text="h3">Heading — h3 preset</div>
  <div and-text="p">Body copy uses the p preset: a comfortable 1rem / 1.5 line height for running text.</div>
  <div and-text="p-sm color:muted">A smaller p-sm line, tinted with color:muted.</div>
  <div and-text="caption">CAPTION PRESET — small and muted by default.</div>
</div>

### Modifiers

| Token      | Values                                                                               | CSS property  |
| ---------- | ------------------------------------------------------------------------------------ | ------------- |
| `align:*`  | `left`, `center`, `right`, `justify`                                                 | `text-align`  |
| `weight:*` | `thin`, `light`, `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`        | `font-weight` |
| `color:*`  | `primary`, `secondary`, `accent`, `muted`, `destructive`, `background`, `foreground` | `color`       |

Weight numeric values: `thin` 100, `light` 300, `normal` 400, `medium` 500,
`semibold` 600, `bold` 700, `extrabold` 800, `black` 900.

:::caution[`color:*` needs `--color-*` tokens] `color:*` (and the `caption`
preset's color) resolve through `--color-primary`, `--color-foreground`, etc.
This is a real gap between the two packages as shipped: `@andersseen/layout`'s
README says these resolve through "the tokens already provided by
`@andersseen/web-components`'s theme files", but `packages/web-components`'s
palettes define **bare** `--primary`/`--foreground` (no `--color-` prefix) — so
`and-text="color:primary"` silently falls back to inherited text color when the
two packages are combined as-is. A standalone consumer needs to define the
`--color-*` custom properties themselves. This docs site does exactly that (a
one-time `:root { --color-primary: hsl(var(--primary)); … }` bridge), which is
why the `color:*` examples above actually render. :::

## Responsive modifiers

Breakpoints are **mobile-first** (`min-width`). Every map-based token accepts a
`@breakpoint` suffix — `prop@breakpoint:value` — and they stack, so a value
applies from its breakpoint up until a larger one overrides it:

```html
<!-- 1 column on mobile, 2 from md, 3 from lg -->
<div and-layout="grid cols:1 cols@md:2 cols@lg:3 gap:lg">...</div>

<!-- padding grows with viewport; text centers only from lg -->
<div and-layout="p:sm p@md:lg" and-text="p-sm align@lg:center">...</div>
```

| Breakpoint | Min-width | Breakpoint | Min-width |
| ---------- | --------- | ---------- | --------- |
| `sm`       | `640px`   | `xl`       | `1280px`  |
| `md`       | `768px`   | `2xl`      | `1536px`  |
| `lg`       | `1024px`  |            |           |

**What has no responsive form:** the bare `horizontal` / `vertical` / `grid`
display switches and the `and-text` presets (`h1`…`caption`). There is no
`horizontal@md` or `grid@md`, so this package can't swap `display`/direction or
a whole type preset at a breakpoint — only the map-based tokens (`align`,
`justify`, `wrap`, `gap*`, `cols`, `span`, `col-*`, all padding/margin, and text
`align`/`weight`/`color`) are responsive. If you need to flip flex↔grid
responsively, do it with your own media query on top.

## Next steps

[Recipes](/layout/recipes/) — real, live layout patterns built from these
tokens: centering, responsive card grids, the media object, a sidebar shell, and
a toolbar.
