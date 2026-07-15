---
title: Headless Core — Navbar
description:
  createNavbar — active-item tracking, roving-tabindex keyboard nav, a mobile
  menu toggle, and scroll-spy/route-based active detection. Powers Navbar.
---

Powers [Navbar](/components/navbar/) internally. The most feature-rich
navigation factory — beyond simple active-item tracking, it can derive the
active item from scroll position, a URL hash, or a route pathname, so a single
config drives a marketing-site nav, a docs sidebar-style top nav, or an SPA
router nav.

## Usage

```ts
import { createNavbar } from '@andersseen/headless-components/navbar';

const navbar = createNavbar({
  items: [
    { id: 'home', label: 'Home', href: '#hero' },
    { id: 'features', label: 'Features', href: '#features' },
  ],
  defaultActiveItem: 'home',
  onActiveItemChange: id => console.log('Active:', id),
});

element.addEventListener('keydown', e => navbar.handleItemKeyDown(e, 'home'));
window.addEventListener('scroll', () =>
  navbar.actions.updateActiveFromScroll(),
);
```

## Config

| Option               | Type                                       | Default                    | Notes                                                                                   |
| -------------------- | ------------------------------------------ | -------------------------- | --------------------------------------------------------------------------------------- |
| `items`              | `NavbarItem[]`                             | `[]`                       | `{ id, label, href?, target?, icon?, disabled? }`.                                      |
| `defaultActiveItem`  | `string`                                   | first item id, or `'home'` |                                                                                         |
| `onActiveItemChange` | `(id: string) => void`                     | —                          |                                                                                         |
| `mobileMenuOpen`     | `boolean`                                  | `false`                    |                                                                                         |
| `onMobileMenuChange` | `(open: boolean) => void`                  | —                          |                                                                                         |
| `scrollSpy`          | `boolean`                                  | `false`                    | Items must have `href` starting with `#` to participate.                                |
| `scrollSpyOffset`    | `number` (px)                              | `100`                      | Section counts as "in view" once scrolled past this line from the top.                  |
| `ariaLabel`          | `string`                                   | `'Main navigation'`        |                                                                                         |
| `routeMatchMode`     | `'exact' \| 'prefix'`                      | `'prefix'`                 | `prefix` matches nested routes (`/docs/intro` → `/docs`), preferring the longest match. |
| `getElementByHash`   | `(hash: string) => Element \| null`        | `document.querySelector`   | Adapter so the headless core never touches the DOM directly.                            |
| `getLocation`        | `() => { hash: string; pathname: string }` | `window.location`          | Same reasoning — swap in a router's location for SPA frameworks.                        |

## State

`activeItem`, `mobileMenuOpen`, `itemIds: string[]`.

## Actions

| Member                                                              | Signature                                                           | Notes                                                                      |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `setActiveItem(id)`                                                 | `(itemId: string) => void`                                          | No-ops for a disabled item.                                                |
| `toggleMobileMenu()` / `setMobileMenuOpen(v)` / `closeMobileMenu()` | `() => void` / `(boolean) => void` / `() => void`                   |                                                                            |
| `setItems(items)`                                                   | `(items: NavbarItem[]) => void`                                     | Re-registers the item list; resets `activeItem` if it's no longer present. |
| `updateActiveFromScroll(offset?)`                                   | `(offset?: number) => void`                                         | Call from a `scroll` listener.                                             |
| `updateActiveFromHash()`                                            | `() => void`                                                        | Call on load / `hashchange`.                                               |
| `updateActiveFromRoute(pathname?, mode?)`                           | `(pathname?: string, routeMatchMode?: 'exact' \| 'prefix') => void` | Call on route change; pass `pathname` explicitly in SPA frameworks.        |

## Queries

`isActive(id)`, `getActiveItem()`, `isDisabled(id)`, `getItemIds()`.

## Prop-getters & handler

| Getter                                 | Returns                                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `getContainerProps()`                  | `role: 'navigation'`, `aria-label`                                                                                                                                 |
| `getNavListProps()`                    | `role: 'menubar'`, `aria-label`                                                                                                                                    |
| `getItemProps(id, { href?, target? })` | `role: 'menuitem'`, `aria-current` (`'page'` when active), `aria-disabled`, `data-active`, `data-state`, `tabindex` (roving), `id`, plus `href`/`target` if passed |
| `getToggleProps()`                     | `aria-expanded`, `aria-label` (swaps text open/closed), `aria-controls`, `role: 'button'`, `tabindex: 0`, `data-state`                                             |
| `getMobileMenuProps()`                 | `id`, `role: 'menu'`, `aria-label`, `data-state`, `hidden`                                                                                                         |

`handleItemKeyDown(event, currentItemId)` — `ArrowRight`/`ArrowLeft` move with
wraparound (skipping disabled items), `Home`/`End` jump, `Enter`/`Space`
activate the current item and close the mobile menu, `Escape` closes the mobile
menu.

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="navbar-demo-home">Home</and-button>
    <and-button id="navbar-demo-features">Features</and-button>
    <and-button id="navbar-demo-toggle" variant="outline">Toggle mobile menu</and-button>
  </div>
  <pre id="navbar-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runNavbarDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('navbar-demo-output');
    if (!H || !output) return;

    const navbar = H.createNavbar({
      items: [
        { id: 'home', label: 'Home', href: '#hero' },
        { id: 'features', label: 'Features', href: '#features' },
      ],
      defaultActiveItem: 'home',
    });

    const render = () => {
      output.textContent = 'navbar.state →\n' + JSON.stringify(navbar.state, null, 2);
    };
    navbar.subscribe(render);
    render();

    document.getElementById('navbar-demo-home')?.addEventListener('click', () => navbar.actions.setActiveItem('home'));
    document.getElementById('navbar-demo-features')?.addEventListener('click', () => navbar.actions.setActiveItem('features'));
    document.getElementById('navbar-demo-toggle')?.addEventListener('click', () => navbar.actions.toggleMobileMenu());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runNavbarDemo);
  } else {
    runNavbarDemo();
  }
</script>

## Next steps

[Sidebar](/headless/sidebar/) is the same active-item-tracking idea for a
vertical side panel, with a collapse toggle instead of scroll-spy/route
detection.
