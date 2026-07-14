---
title: Sidebar
description:
  Collapsible vertical navigation sidebar with main and bottom item sections.
---

Collapsible vertical navigation sidebar (`<aside>`), with `main` and `bottom`
item sections and a built-in collapse toggle.

`items` accepts either a real array or a JSON string, so it works directly as a
plain HTML attribute. Items with `section: 'bottom'` render in the footer area.

## Example

<div class="and-live-example" style="align-items: stretch; padding: 0;">
  <and-sidebar
    items='[{"id":"home","label":"Home"},{"id":"docs","label":"Docs"},{"id":"settings","label":"Settings","section":"bottom"}]'
    active-item="home"
    expanded-width="14rem"
    style="height: 20rem;"
  ></and-sidebar>
</div>

```html
<and-sidebar
  items='[{"id":"home","label":"Home"},{"id":"docs","label":"Docs"},{"id":"settings","label":"Settings","section":"bottom"}]'
  active-item="home"
></and-sidebar>
```

## Properties

| Property           | Attribute           | Description                                                                 | Type                                             | Default                |
| ------------------ | ------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------- |
| `activeItem`       | `active-item`       | The active navigation item ID.                                              | `string`                                         | `'home'`               |
| `ariaNavLabel`     | `aria-nav-label`    | ARIA label for the navigation.                                              | `string`                                         | `'Sidebar navigation'` |
| `collapsed`        | `collapsed`         | Whether the sidebar is collapsed (desktop).                                 | `boolean`                                        | `false`                |
| `collapsedWidth`   | `collapsed-width`   | Collapsed width of the sidebar.                                             | `string`                                         | `'4rem'`               |
| `expandedWidth`    | `expanded-width`    | Expanded width of the sidebar.                                              | `string`                                         | `'16rem'`              |
| `itemVariant`      | `item-variant`      | Visual style for individual sidebar items.                                  | `"default" \| "filled" \| "underline"`           | `'default'`            |
| `items`            | `items`             | Navigation items. Items with `section: 'bottom'` render in the footer area. | `SidebarItem[] \| string`                        | `[]`                   |
| `mobileBreakpoint` | `mobile-breakpoint` | Breakpoint (px) below which the sidebar auto-collapses on mobile.           | `number`                                         | `768`                  |
| `mobileCollapse`   | `mobile-collapse`   | Enable auto-collapse on mobile viewports.                                   | `boolean`                                        | `true`                 |
| `variant`          | `variant`           | Visual variant of the sidebar.                                              | `"default" \| "filled" \| "floating" \| "glass"` | `'default'`            |

## Events

| Event                 | Description                                      | Type                   |
| --------------------- | ------------------------------------------------ | ---------------------- |
| `andSidebarItemClick` | Emitted when a navigation item is clicked.       | `CustomEvent<string>`  |
| `andSidebarToggle`    | Emitted when the sidebar collapse state changes. | `CustomEvent<boolean>` |
