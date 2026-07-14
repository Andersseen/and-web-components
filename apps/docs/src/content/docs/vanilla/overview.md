---
title: Vanilla Components — Overview
description:
  Zero-runtime-dependency vanilla Custom Elements. Same headless logic as
  web-components, no Stencil, no build step.
---

`@andersseen/vanilla-components` gives you the same behavior as
[`@andersseen/web-components`](/components/button/) with **zero dependencies** —
plain Custom Elements built directly on [Headless Core](/headless/overview/), no
Stencil, no build step required for consumers. This is the package behind the
homepage's "Zero lock-in" pitch: every component ships as a plain Custom Element
first, and this is the no-framework, no-build-step version of that same core.

It currently ships three components: `and-vanilla-button`, `and-vanilla-modal`,
`and-vanilla-accordion`. Motion is optional on all three — add the `animated`
attribute and install [`@andersseen/motion`](/motion/overview/) to get a
tap/enter animation; without it, everything still works, just without the
animation.

## Install

```bash
pnpm add @andersseen/vanilla-components
```

```css
@import '@andersseen/vanilla-components/style.css';
```

Importing the package self-registers its custom elements — no explicit
`define()` call needed:

```ts
import '@andersseen/vanilla-components';
```

## Example

<div class="and-live-example">
  <and-vanilla-button variant="primary">Primary</and-vanilla-button>
  <and-vanilla-button variant="secondary">Secondary</and-vanilla-button>
  <and-vanilla-button variant="outline">Outline</and-vanilla-button>
  <and-vanilla-button variant="ghost">Ghost</and-vanilla-button>
  <and-vanilla-button disabled>Disabled</and-vanilla-button>
</div>

```html
<and-vanilla-button variant="primary">Primary</and-vanilla-button>
<and-vanilla-button variant="secondary">Secondary</and-vanilla-button>
<and-vanilla-button variant="outline">Outline</and-vanilla-button>
<and-vanilla-button variant="ghost">Ghost</and-vanilla-button>
<and-vanilla-button disabled>Disabled</and-vanilla-button>
```

## Components

### `and-vanilla-button`

| Attribute  | Values                                                                  | Default   |
| ---------- | ----------------------------------------------------------------------- | --------- |
| `variant`  | `default` \| `primary` \| `secondary` \| `outline` \| `ghost`           | `default` |
| `size`     | `default` \| `sm` \| `lg`                                               | `default` |
| `disabled` | boolean attribute                                                       | `false`   |
| `animated` | boolean attribute — plays `pulse` on click (needs `@andersseen/motion`) | `false`   |

### `and-vanilla-modal`

```html
<and-vanilla-modal open animated>
  <h2>Hello</h2>
  <p>Content</p>
</and-vanilla-modal>
```

| Attribute  | Description                                                |
| ---------- | ---------------------------------------------------------- |
| `open`     | Whether the modal is open (reflects, toggle to open/close) |
| `animated` | Animates open/close (needs `@andersseen/motion`)           |

### `and-vanilla-accordion`

Items are provided as `<div title="..." value="...">...</div>` children.

| Attribute        | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `allow-multiple` | Allow more than one item expanded simultaneously      |
| `animated`       | Animates expand/collapse (needs `@andersseen/motion`) |

Emits `andValueChange` when the expanded set changes.

## Relationship to `@andersseen/web-components`

Both packages are built on the same [Headless Core](/headless/overview/) — same
state machines, same ARIA/keyboard contracts — so switching between them (or
running both side by side) doesn't mean relearning behavior, only markup. Pick
`web-components` for the full Stencil-built visual system with CVA variants and
themes; pick `vanilla-components` when you don't want a build step or any
framework at all.
