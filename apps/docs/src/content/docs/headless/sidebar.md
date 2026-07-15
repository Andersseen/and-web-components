---
title: Headless Core — Sidebar
description:
  createSidebar — active-item tracking, collapse state, main/bottom item
  sections, and roving-tabindex keyboard nav. Powers the styled Sidebar.
---

Powers [Sidebar](/components/sidebar/) internally. Compare with
[Navbar](/headless/navbar/): same active-item-tracking core, but oriented
vertically (`ArrowUp`/`ArrowDown` instead of `ArrowLeft`/`ArrowRight`), with a
collapse toggle instead of scroll-spy/route detection, and items split into
`main`/`bottom` sections instead of a single flat list.

## Usage

```ts
import { createSidebar } from '@andersseen/headless-components/sidebar';

const sidebar = createSidebar({
  items: [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'settings', label: 'Settings', icon: 'settings', section: 'bottom' },
  ],
  defaultActiveItem: 'home',
  onActiveItemChange: id => console.log('Active:', id),
});

sidebar.actions.toggleCollapse();
```

## Config

| Option               | Type                           | Default                | Notes                                                                                       |
| -------------------- | ------------------------------ | ---------------------- | ------------------------------------------------------------------------------------------- |
| `items`              | `SidebarItemDef[]`             | `[]`                   | `{ id, label, icon?, disabled?, section? }`; `section` is `'main'` (default) or `'bottom'`. |
| `defaultActiveItem`  | `string`                       | `'home'`               |                                                                                             |
| `onActiveItemChange` | `(id: string) => void`         | —                      |                                                                                             |
| `defaultCollapsed`   | `boolean`                      | `false`                |                                                                                             |
| `onCollapsedChange`  | `(collapsed: boolean) => void` | —                      |                                                                                             |
| `mobileCollapse`     | `boolean`                      | `true`                 | Only affects the initial `mobileCollapsed` state — see below.                               |
| `ariaLabel`          | `string`                       | `'Sidebar navigation'` |                                                                                             |

## State

`activeItem`, `collapsed`, `mobileCollapsed` — note `mobileCollapsed` is
initialized from `config.mobileCollapse !== false` but nothing in this factory
ever changes it afterward except `actions.setMobileCollapsed`; actually
detecting "we're on mobile" (a media query) is the consuming component's job.

## Actions

`setActiveItem(id)`, `toggleCollapse()` / `setCollapsed(v)`,
`setMobileCollapsed(v)`, `setItems(items)` (re-registers the list; doesn't reset
`activeItem` the way Navbar's `setItems` does).

## Queries

`isActive(id)`, `isCollapsed()`, `isMobileCollapsed()`, `isDisabled(id)`,
`getMainItems()` (items with no `section` or `section: 'main'`),
`getBottomItems()` (`section: 'bottom'`), `getItemIds()`.

## Prop-getters & handler

| Getter                      | Returns                                                                                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `getContainerProps()`       | `role: 'navigation'`, `aria-label`, `data-collapsed`, `data-mobile-collapsed`                                                               |
| `getNavListProps(section?)` | `role: 'menu'`, `aria-label` (`'Main navigation'` or `'Secondary navigation'` depending on `section`)                                       |
| `getItemProps(id)`          | `role: 'menuitem'`, `aria-current`, `aria-disabled`, `data-active`, `data-state`, `data-collapsed`, `tabindex`, `id` (`sidebar-item-${id}`) |
| `getToggleProps()`          | `aria-expanded` (inverse of collapsed), `aria-label` (swaps "Expand"/"Collapse"), `data-collapsed`, `role: 'button'`, `tabindex: 0`         |

`handleItemKeyDown(event, currentItemId)` — `ArrowDown`/`ArrowUp` move with
wraparound (skipping disabled items), `Home`/`End` jump, `Enter`/`Space`
activate. No `Escape` handling (unlike Navbar — a sidebar has no mobile overlay
panel to dismiss with it).

## Live example

<div class="and-live-example" style="flex-direction: column; align-items: stretch; gap: 0.75rem;">
  <div style="display: flex; gap: 0.5rem;">
    <and-button id="sidebar-demo-settings">Go to "settings"</and-button>
    <and-button id="sidebar-demo-collapse" variant="outline">Toggle collapse</and-button>
  </div>
  <pre id="sidebar-demo-output" style="margin: 0; white-space: pre-wrap; font-size: 0.8em;"></pre>
</div>

<script>
  function runSidebarDemo() {
    const H = window.andHeadless;
    const output = document.getElementById('sidebar-demo-output');
    if (!H || !output) return;

    const sidebar = H.createSidebar({
      items: [
        { id: 'home', label: 'Home' },
        { id: 'settings', label: 'Settings', section: 'bottom' },
      ],
      defaultActiveItem: 'home',
    });

    const render = () => {
      output.textContent = 'sidebar.state →\n' + JSON.stringify(sidebar.state, null, 2);
    };
    sidebar.subscribe(render);
    render();

    document.getElementById('sidebar-demo-settings')?.addEventListener('click', () => sidebar.actions.setActiveItem('settings'));
    document.getElementById('sidebar-demo-collapse')?.addEventListener('click', () => sidebar.actions.toggleCollapse());
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runSidebarDemo);
  } else {
    runSidebarDemo();
  }
</script>

## Next steps

[Navbar](/headless/navbar/) — the horizontal counterpart, with scroll-spy and
route-based active detection.
