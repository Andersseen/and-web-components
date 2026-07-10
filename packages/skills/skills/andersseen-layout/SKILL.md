---
name: andersseen-layout
description:
  'Compose layout and typography with @andersseen/layout — a pure-CSS,
  attribute-driven system using and-layout and and-text with @breakpoint
  responsive modifiers. Load when building responsive page shells, grids, flex
  layouts, spacing, or type scales without a utility framework. Trigger phrases:
  and-layout, and-text, responsive grid, flex layout, spacing scale, typography,
  cols, gap, and-layout attributes.'
---

# @andersseen/layout — attribute-driven layout & typography

Pure CSS library — **no JavaScript runtime**. Attribute-driven layout
composition and typography, framework-agnostic and mobile-first. HTML attributes
are the single source of truth for layout.

## Install

```bash
npm i @andersseen/layout
```

## Setup

```ts
import '@andersseen/layout/dist/layout.css';
```

## Breakpoints (mobile-first, min-width)

| Name | Min-width |
| ---- | --------- |
| sm   | 640px     |
| md   | 768px     |
| lg   | 1024px    |
| xl   | 1280px    |
| 2xl  | 1536px    |

## Responsive syntax

Every modifier supports responsive variants using `@breakpoint`:

```html
<div and-layout="vertical vertical@sm horizontal@md gap:sm gap@lg:xl"></div>
<p and-text="p-sm align:center align@md:left"></p>
```

Spacing scale: `none · xxxs · xxs · xs · sm · md · lg · xl · xxl · xxxl · auto`.

## `and-layout`

### Display / direction

```html
<div and-layout="horizontal"><!-- flex row --></div>
<div and-layout="vertical"><!-- flex column --></div>
<div and-layout="grid"><!-- display:grid --></div>
```

Both `horizontal` and `vertical` are responsive: `horizontal@md`, `vertical@lg`.

### Flex alignment

```
align:start | end | center | baseline | stretch
justify:start | end | center | between | around | evenly
wrap:nowrap | wrap | wrap-reverse
```

### Gap

```
gap:{spacing}    gap-x:{spacing}    gap-y:{spacing}
```

### Grid columns

Generates `repeat(N, minmax(0, 1fr))` for N in 1–12.

```html
<div and-layout="grid cols:1 cols@sm:2 cols@lg:3 gap:lg"></div>
```

### Grid column span

Values 1–12 + `full` (span all columns).

```html
<div and-layout="grid cols:12">
  <header and-layout="span:full">...</header>
  <main and-layout="span:8 span@lg:9">...</main>
  <aside and-layout="span:4 span@lg:3">...</aside>
</div>
```

### Grid start/end

`col-start:1`–`col-start:13`, `col-start:auto`; `col-end:1`–`col-end:13`,
`col-end:auto`.

### Padding / margin

```
p:{s}   p-t p-b p-l p-r p-x p-y : {s}
m:{s}   m-t m-b m-l m-r m-x m-y : {s}
```

### Spacing scale

| Token | Value    |     | Token | Value  |
| ----- | -------- | --- | ----- | ------ |
| none  | 0        |     | md    | 1rem   |
| xxxs  | 0.125rem |     | lg    | 1.5rem |
| xxs   | 0.25rem  |     | xl    | 2rem   |
| xs    | 0.5rem   |     | xxl   | 3rem   |
| sm    | 0.75rem  |     | xxxl  | 4rem   |
|       |          |     | auto  | auto   |

## `and-text` — typography

### Semantic scale

`h1 · h2 · h3 · h4 · h5 · h6 · p · p-sm · p-xs · caption`

| Token   | Font size | Weight | Line-height |
| ------- | --------- | ------ | ----------- |
| h1      | 3.75rem   | 700    | 1.1         |
| h2      | 3rem      | 700    | 1.1         |
| h3      | 2.25rem   | 600    | 1.2         |
| h4      | 1.875rem  | 600    | 1.2         |
| h5      | 1.5rem    | 500    | 1.3         |
| h6      | 1.25rem   | 500    | 1.3         |
| p       | 1rem      | 400    | 1.5         |
| p-sm    | 0.875rem  | 400    | 1.5         |
| p-xs    | 0.75rem   | 400    | 1.5         |
| caption | 0.75rem   | 400    | — (muted)   |

### Alignment · weight · color (all responsive)

```
align:left | center | right | justify
weight:thin | light | normal | medium | semibold | bold | extrabold | black
color:primary | secondary | accent | muted | destructive | foreground | background
```

Color tokens map to CSS variables: `var(--color-primary)`,
`var(--color-foreground)`, …

## Usage examples

### Responsive page shell

```html
<body and-layout="vertical gap:none">
  <nav and-layout="horizontal justify:between align:center p-x:lg p-y:md">
    <a and-text="h6 weight:bold">Logo</a>
    <div and-layout="horizontal gap:sm">
      <a and-text="p-sm">Home</a>
      <a and-text="p-sm">Docs</a>
    </div>
  </nav>
  <main and-layout="vertical gap:xl p:lg p@md:xxl">
    <section and-layout="vertical gap:md">
      <h1 and-text="h1 align:center align@md:left color:foreground">
        Hero Title
      </h1>
      <p and-text="p align:center align@md:left color:muted">Subtitle text</p>
    </section>
    <div and-layout="grid cols:1 cols@sm:2 cols@lg:3 gap:lg">
      <article and-layout="vertical gap:sm p:md">
        <h2 and-text="h5 color:foreground">Card Title</h2>
        <p and-text="p-sm color:muted">Card description</p>
      </article>
    </div>
  </main>
</body>
```

### 12-column grid

```html
<section and-layout="grid cols:12 gap:md">
  <div and-layout="span:12 span@md:8">Main content</div>
  <div and-layout="span:12 span@md:4">Sidebar</div>
</section>
```

## Rules

- Use `and-layout` and `and-text` as the primary composition mechanism.
- Do not mix a utility CSS framework (Tailwind, Bootstrap) with `and-layout`
  tokens on the same element.
- Responsive tokens use the `@breakpoint` suffix: `cols@md:2`, `align@lg:left`.
- Color tokens map to CSS custom properties — do not override with hardcoded
  values.
- `caption` already applies a muted color — do not combine with
  `color:foreground`.
