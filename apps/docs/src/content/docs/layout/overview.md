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

## Reference

Each has its own page: the full token table, a live example, and its specific
responsive support.

| Attribute    | Covers                                   | Page                              |
| ------------ | ---------------------------------------- | --------------------------------- |
| `and-layout` | Flexbox display, alignment, wrapping     | [Flex](/layout/flex/)             |
| `and-layout` | Grid display, columns, spans             | [Grid](/layout/grid/)             |
| `and-layout` | Padding, margin, gap                     | [Spacing](/layout/spacing/)       |
| `and-text`   | Heading/body presets, align/weight/color | [Typography](/layout/typography/) |

## Responsive

Breakpoints are **mobile-first** (`min-width`). Every map-based token accepts a
`@breakpoint` suffix — `prop@breakpoint:value` — and they stack, so a value
applies from its breakpoint up until a larger one overrides it:

```html
<!-- 1 column on mobile, 2 from md, 3 from lg -->
<div and-layout="grid cols:1 cols@md:2 cols@lg:3 gap:lg">...</div>
```

| Breakpoint | Min-width | Breakpoint | Min-width |
| ---------- | --------- | ---------- | --------- |
| `sm`       | `640px`   | `xl`       | `1280px`  |
| `md`       | `768px`   | `2xl`      | `1536px`  |
| `lg`       | `1024px`  |            |           |

Not every token has a responsive form — each of the pages below notes which of
its own tokens are plain switches vs. `@breakpoint`-aware.

## Next steps

- [Flex](/layout/flex/), [Grid](/layout/grid/), [Spacing](/layout/spacing/),
  [Typography](/layout/typography/) — one page per concern, each with its full
  token table and a live example.
- [Recipes](/layout/recipes/) — real, live layout patterns built from these
  tokens: centering, responsive card grids, the media object, a sidebar shell,
  and a toolbar.
