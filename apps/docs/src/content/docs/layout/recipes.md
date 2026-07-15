---
title: Layout — Recipes
description:
  Real, live layout patterns built entirely from and-layout / and-text tokens —
  centering, responsive grids, the media object, a sidebar shell, and a toolbar.
---

Common layouts composed only from [`and-layout`](/layout/overview/) and
[`and-text`](/layout/typography/) tokens — no custom CSS, no JavaScript. Every
example below is live; resize the window to see the responsive ones respond.

## Center a block

`m-x:auto` on a width-constrained block centers it horizontally — the spacing
scale's [`auto` value](/layout/spacing/#scale) resolves to `margin: auto`:

<div class="and-live-example" style="display: block;">
  <div and-layout="m-x:auto p:md" style="max-width: 20rem; background: hsl(var(--muted)); border-radius: 0.5rem; text-align: center;">
    max-width + <code>m-x:auto</code>
  </div>
</div>

```html
<div and-layout="m-x:auto p:md" style="max-width: 20rem;">Centered</div>
```

To center **content** (rather than the box itself), use the flex tokens instead
— `horizontal justify:center align:center`:

```html
<div
  and-layout="horizontal justify:center align:center"
  style="min-height: 8rem;"
>
  <span>Perfectly centered child</span>
</div>
```

## Toolbar / header bar

The workhorse row: `horizontal` + `align:center` to line items up on their
vertical center, + `justify:between` to push groups to opposite ends.

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="horizontal align:center justify:between gap:sm p:sm" style="border: 1px dashed var(--sl-color-hairline); border-radius: 0.5rem;">
    <div and-layout="horizontal align:center gap:sm">
      <span and-text="h6" style="margin: 0;">Dashboard</span>
    </div>
    <div and-layout="horizontal align:center gap:xs">
      <and-button variant="ghost">Settings</and-button>
      <and-button>New</and-button>
    </div>
  </div>
</div>

```html
<header and-layout="horizontal align:center justify:between gap:sm p:sm">
  <span and-text="h6">Dashboard</span>
  <div and-layout="horizontal align:center gap:xs">
    <and-button variant="ghost">Settings</and-button>
    <and-button>New</and-button>
  </div>
</header>
```

## Responsive card grid

`cols:1` on mobile, widening at each breakpoint. Because breakpoints are
mobile-first and stacked, the largest matching one wins:

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="grid cols:1 cols@sm:2 cols@lg:3 gap:md">
    <div and-layout="p:md vertical gap:xxs" style="background: hsl(var(--muted)); border-radius: 0.5rem;">
      <span and-text="h6" style="margin: 0;">Card one</span>
      <span and-text="p-sm">Reflows from 1 → 2 → 3 columns.</span>
    </div>
    <div and-layout="p:md vertical gap:xxs" style="background: hsl(var(--muted)); border-radius: 0.5rem;">
      <span and-text="h6" style="margin: 0;">Card two</span>
      <span and-text="p-sm">Try resizing the window.</span>
    </div>
    <div and-layout="p:md vertical gap:xxs" style="background: hsl(var(--muted)); border-radius: 0.5rem;">
      <span and-text="h6" style="margin: 0;">Card three</span>
      <span and-text="p-sm">Gap stays constant at md.</span>
    </div>
  </div>
</div>

```html
<div and-layout="grid cols:1 cols@sm:2 cols@lg:3 gap:md">
  <article and-layout="p:md vertical gap:xxs">…</article>
  <article and-layout="p:md vertical gap:xxs">…</article>
  <article and-layout="p:md vertical gap:xxs">…</article>
</div>
```

## Media object

Fixed-size figure beside flexible text — `horizontal gap:md align:start`, with
the text column as a nested `vertical` stack:

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="horizontal gap:md align:start p:sm" style="border: 1px dashed var(--sl-color-hairline); border-radius: 0.5rem;">
    <div style="width: 3rem; height: 3rem; flex: none; border-radius: 9999px; background: hsl(var(--primary));"></div>
    <div and-layout="vertical gap:xxs">
      <span and-text="p weight:semibold" style="margin: 0;">Ada Lovelace</span>
      <span and-text="p-sm color:muted">Avatar stays fixed; this text column flexes to fill the rest of the row.</span>
    </div>
  </div>
</div>

```html
<div and-layout="horizontal gap:md align:start">
  <img src="avatar.jpg" style="width: 3rem; height: 3rem; flex: none;" />
  <div and-layout="vertical gap:xxs">
    <span and-text="p weight:semibold">Ada Lovelace</span>
    <span and-text="p-sm color:muted">Supporting copy…</span>
  </div>
</div>
```

## Sidebar shell

A grid whose sidebar takes one column and content spans the rest — collapses to
a single stacked column below `md` by dropping back to `cols:1`:

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="grid cols:1 cols@md:4 gap:sm">
    <nav and-layout="p:sm" style="background: hsl(var(--muted)); border-radius: 0.5rem; text-align: center;">Sidebar</nav>
    <main and-layout="p:sm span@md:3" style="background: hsl(var(--accent)); color: hsl(var(--accent-foreground)); border-radius: 0.5rem; text-align: center;">Content — <code>span@md:3</code></main>
  </div>
</div>

```html
<div and-layout="grid cols:1 cols@md:4 gap:sm">
  <nav>Sidebar</nav>
  <main and-layout="span@md:3">Content</main>
</div>
```

Below `md` the grid is a single column, so both children stack full-width; from
`md` up it becomes four columns and `span@md:3` gives the content three of them,
leaving one for the sidebar.

## Vertical stack

The simplest and most common one: `vertical` + a `gap` for evenly-spaced
children, no margins needed.

```html
<div and-layout="vertical gap:md">
  <h2 and-text="h2">Section title</h2>
  <p and-text="p">First paragraph.</p>
  <p and-text="p">Second paragraph, evenly spaced by the gap.</p>
</div>
```
