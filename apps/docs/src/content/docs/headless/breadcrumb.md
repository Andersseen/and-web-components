---
title: Headless Core — Breadcrumb
description:
  createBreadcrumb — a static item list with current-page ARIA semantics, no
  open/close state. Powers the styled Breadcrumb component.
---

Powers [Breadcrumb](/components/breadcrumb/) internally. The simplest navigation
factory — items are just a list you set once (or replace), with no
active/inactive toggle beyond which one is `current`.

## Usage

```ts
import { createBreadcrumb } from '@andersseen/headless-components/breadcrumb';

const breadcrumb = createBreadcrumb({
  ariaLabel: 'Breadcrumb',
  items: [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'detail', label: 'Widget', current: true },
  ],
  onNavigate: item => console.log('Navigate:', item.href),
});

const linkProps = breadcrumb.getLinkProps(item);
```

## Config

| Option       | Type                                   | Default        | Notes                                                               |
| ------------ | -------------------------------------- | -------------- | ------------------------------------------------------------------- |
| `ariaLabel`  | `string`                               | `'Breadcrumb'` |                                                                     |
| `items`      | `BreadcrumbItemConfig[]`               | `[]`           | `{ id, label, href?, current? }`.                                   |
| `onNavigate` | `(item: BreadcrumbItemConfig) => void` | —              | Fired by `handleKeyDown`, not by the link click itself — see below. |

## State

`items`, `ariaLabel`.

## Actions

`setItems(items)` (replaces the list wholesale), `setCurrentItem(itemId)` (marks
exactly one item `current: true`, un-marking the rest — a convenience over
calling `setItems` yourself with a remapped array).

## Prop-getters & handler

| Getter               | Returns                                                                                                                                                                                                                                                                                            |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getNavProps()`      | `role: 'navigation'`, `aria-label`                                                                                                                                                                                                                                                                 |
| `getListProps()`     | `role: 'list'`                                                                                                                                                                                                                                                                                     |
| `getItemProps(item)` | `aria-current: 'page'` (only if `item.current`), `data-state`                                                                                                                                                                                                                                      |
| `getLinkProps(item)` | `href` (omitted for the current item, even if it has one), `aria-current`, `tabindex` (`undefined` — i.e. natural tab order — unless current, in which case `undefined` too since a non-link current item usually isn't focusable at all; only non-current items with an `href` get `tabindex: 0`) |

This factory has **no** click handler of its own — a breadcrumb link with a real
`href` navigates natively, so wire `onNavigate` only if you need to intercept it
(e.g. client-side routing): `handleKeyDown(event, item)` calls
`onNavigate(item)` on `Enter`/`Space`, and only for non-current items.

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <pre id="breadcrumb-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runBreadcrumbDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('breadcrumb-demo-output');
    if (!H || !output) return;

    const breadcrumb = H.createBreadcrumb({
      items: [
        { id: 'home', label: 'Home', href: '/' },
        { id: 'products', label: 'Products', href: '/products' },
        { id: 'detail', label: 'Widget', current: true },
      ],
    });

    output.textContent = breadcrumb.state.items
      .map(item => `${item.label} → ` + JSON.stringify(breadcrumb.getLinkProps(item)))
      .join('\n');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runBreadcrumbDemo);
  } else {
    runBreadcrumbDemo();
  }
</script>

## Next steps

[Navbar](/headless/navbar/) — for a primary nav that tracks one active item
reactively, rather than a static current-page trail.
