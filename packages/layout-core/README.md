# @andersseen/layout

Pure-CSS, attribute-driven layout and typography utilities. No JavaScript, no
build step for consumers — import one stylesheet and start composing layouts
with HTML attributes instead of utility classes.

> Part of the Andersseen **product core** — usable entirely on its own. A
> project doesn't need `@andersseen/web-components` or any other package from
> this stack to use `@andersseen/layout`.

## Installation

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

```html
<div and-layout="horizontal gap:md align:center justify:between wrap:wrap">
  <div and-layout="vertical gap:sm">
    <h2 and-text="h2 weight:bold">Title</h2>
    <p and-text="p align:center">Description</p>
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

**Spacing** — every spacing token below applies to `gap`, `gap-x`, `gap-y`, `p`
(padding), `p-t`/`p-b`/`p-l`/`p-r`, `p-x`/`p-y`, `m` (margin),
`m-t`/`m-b`/`m-l`/`m-r`, `m-x`/`m-y`. Example:
`and-layout="p:lg m-y:sm gap-x:md"`.

| Token  | Value      |
| ------ | ---------- |
| `none` | `0`        |
| `xxxs` | `0.125rem` |
| `xxs`  | `0.25rem`  |
| `xs`   | `0.5rem`   |
| `sm`   | `0.75rem`  |
| `md`   | `1rem`     |
| `lg`   | `1.5rem`   |
| `xl`   | `2rem`     |
| `xxl`  | `3rem`     |
| `xxxl` | `4rem`     |
| `auto` | `auto`     |

## `and-text` reference

**Presets** — `h1`…`h6`, `p`, `p-sm`, `p-xs`, `caption`. Each bundles a
font-size/weight/line-height combination (and `caption` also sets the muted text
color).

**Modifiers**

| Token      | Values                                                                               | CSS property  |
| ---------- | ------------------------------------------------------------------------------------ | ------------- |
| `align:*`  | `left`, `center`, `right`, `justify`                                                 | `text-align`  |
| `weight:*` | `thin`, `light`, `normal`, `medium`, `semibold`, `bold`, `extrabold`, `black`        | `font-weight` |
| `color:*`  | `primary`, `secondary`, `accent`, `muted`, `destructive`, `background`, `foreground` | `color`       |

`color:*` resolves through CSS custom properties (`--color-primary`, etc.) —
define them in your app, or use the tokens already provided by
`@andersseen/web-components`'s theme files if you're pulling this package in
standalone.

## Responsive modifiers

Every token above that maps through `generate-responsive` (all of `and-layout`
except the bare `horizontal`/`vertical`/`grid` switches, and all of `and-text`
except the presets) accepts a `@breakpoint` suffix: `prop@breakpoint:value`.

| Breakpoint | Min-width |
| ---------- | --------- |
| `sm`       | `640px`   |
| `md`       | `768px`   |
| `lg`       | `1024px`  |
| `xl`       | `1280px`  |
| `2xl`      | `1536px`  |

```html
<div and-layout="p:sm p@md:lg" and-text="p-sm align@lg:center">...</div>
```

## Development

```bash
pnpm -C packages/layout-core build   # compiles src/*.scss -> dist/layout.css (+ .min.css)
pnpm -C packages/layout-core test    # build-output smoke test
```

Source SCSS partials are also published under `src/` for consumers who want to
`@use` individual pieces (e.g. just `mixins` or `variables`) instead of the
compiled CSS.

## License

MIT
