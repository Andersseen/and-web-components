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

## Usage

Two attributes drive everything: `and-layout` for flex/grid/spacing, `and-text`
for typography. Values are space-separated tokens, so multiple utilities can
live on one attribute.

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

**Direction** — `horizontal` (flex row) or `vertical` (flex column).

**Grid** — `grid` switches `display: grid`.

- `cols:1` … `cols:12` — `grid-template-columns: repeat(n, minmax(0, 1fr))`
- `span:1` … `span:12`, `span:full` — `grid-column`
- `col-start:1` … `col-start:13`, `col-start:auto` — `grid-column-start`
- `col-end:1` … `col-end:13`, `col-end:auto` — `grid-column-end`

**Flex alignment**

| Token       | Values                                                  | CSS property      |
| ----------- | ------------------------------------------------------- | ----------------- |
| `align:*`   | `start`, `end`, `center`, `baseline`, `stretch`         | `align-items`     |
| `justify:*` | `start`, `end`, `center`, `between`, `around`, `evenly` | `justify-content` |
| `wrap:*`    | `nowrap`, `wrap`, `wrap-reverse`                        | `flex-wrap`       |

**Spacing** — applies to `gap`, `gap-x`, `gap-y`,
`p`/`p-t`/`p-b`/`p-l`/`p-r`/`p-x`/`p-y`,
`m`/`m-t`/`m-b`/`m-l`/`m-r`/`m-x`/`m-y`. Example:
`and-layout="p:lg m-y:sm gap-x:md"`.

| Token  | Value      | Token  | Value    |
| ------ | ---------- | ------ | -------- |
| `none` | `0`        | `md`   | `1rem`   |
| `xxxs` | `0.125rem` | `lg`   | `1.5rem` |
| `xxs`  | `0.25rem`  | `xl`   | `2rem`   |
| `xs`   | `0.5rem`   | `xxl`  | `3rem`   |
| `sm`   | `0.75rem`  | `xxxl` | `4rem`   |

## `and-text` reference

**Presets** — `h1`…`h6`, `p`, `p-sm`, `p-xs`, `caption`. Each bundles a
font-size/weight/line-height combination.

| Token      | Values                                                                               | CSS property  |
| ---------- | ------------------------------------------------------------------------------------ | ------------- |
| `align:*`  | `left`, `center`, `right`, `justify`                                                 | `text-align`  |
| `weight:*` | `thin`, `light`, `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`        | `font-weight` |
| `color:*`  | `primary`, `secondary`, `accent`, `muted`, `destructive`, `background`, `foreground` | `color`       |

`color:*` resolves through `--color-primary`, `--color-foreground`, etc. —
:::caution This is a real gap between the two packages as shipped today, not a
docs-app issue: `@andersseen/layout`'s own README says these resolve through
"the tokens already provided by `@andersseen/web-components`'s theme files if
you're pulling this package in standalone", but `packages/web-components`'s
palettes define bare `--primary`/`--foreground` (no `--color-` prefix) — so
`and-text="color:primary"` silently falls back to inherited text color when the
two packages are combined as-is. A standalone consumer needs to define
`--color-*` custom properties themselves for now. :::

## Responsive modifiers

Every token above (except the bare `horizontal`/`vertical`/`grid` switches and
the `and-text` presets) accepts a `@breakpoint` suffix: `prop@breakpoint:value`.

| Breakpoint | Min-width | Breakpoint | Min-width |
| ---------- | --------- | ---------- | --------- |
| `sm`       | `640px`   | `xl`       | `1280px`  |
| `md`       | `768px`   | `2xl`      | `1536px`  |
| `lg`       | `1024px`  |            |           |

```html
<div and-layout="p:sm p@md:lg" and-text="p-sm align@lg:center">...</div>
```
