# @andersseen/layout

![npm](https://img.shields.io/npm/v/@andersseen/layout)

Pure CSS layout and typography library driven by HTML attributes.

## Installation

```bash
npm install @andersseen/layout
# or
pnpm add @andersseen/layout
```

## Quick Start

Import the compiled library and structure your HTML via the `and-layout` and `and-text` attributes. Values combine via string inclusion and spaces to implement a responsive API.

```css
/* In your CSS entry point */
@import '@andersseen/layout/dist/layout.css';
```

```html
<!-- Example: Vertical stack with medium gap, horizontal centering -->
<div and-layout="vertical gap:md align:center">
  <h1 and-text="h1 center weight:bold">Hello World</h1>
  <p and-text="p color:muted">This is an attribute-driven layout.</p>
</div>
```

## API Overview

Attributes define rules, while modifiers map tokens (like spacing, breakpoint sizing, etc.).

### Flex Utilities (`and-layout`)
- `horizontal` (`flex-direction: row`)
- `vertical` (`flex-direction: column`)
- `align` (start, end, center, baseline, stretch)
- `justify` (start, end, center, between, around, evenly)
- `wrap` (nowrap, wrap, wrap-reverse)

### Gap Utilities (`and-layout`)
- `gap`
- `gap-x`
- `gap-y`

### Spacing Utilities (`and-layout`)
Spacing is bound to directional padding and margin utilities:
- **Padding:** `p`, `p-t` (top), `p-b` (bottom), `p-l` (left), `p-r` (right), `p-x` (horizontal), `p-y` (vertical)
- **Margin:** `m`, `m-t` (top), `m-b` (bottom), `m-l` (left), `m-r` (right), `m-x` (horizontal), `m-y` (vertical)

### Grid Utilities (`and-layout`)
- `grid` (`display: grid`)
- `cols` (1-12)
- `span` (1-12, full)
- `col-start` (1-13, auto)
- `col-end` (1-13, auto)

### Typography Utilities (`and-text`)
- Text scales: `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `p-sm`, `p-xs`, `caption`
- Text alignment: `align` (left, center, right, justify)
- Font weight: `weight`
- Font color: `color`

## Usage

This library favors a pure string-matching semantic attribute model over class-lists. Use responsive modifiers when necessary using the breakpoint prefix syntax (`property@breakpoint:value`), implemented seamlessly via SCSS mixins behind the scenes.

## License

MIT
