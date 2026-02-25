# and-sidebar



<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                                                                                                              | Type                                                                                                 | Default                |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------- |
| `activeItem`       | `active-item`       | The active navigation item ID.                                                                                                           | `string`                                                                                             | `'home'`               |
| `ariaNavLabel`     | `aria-nav-label`    | ARIA label for the navigation                                                                                                            | `string`                                                                                             | `'Sidebar navigation'` |
| `collapsed`        | `collapsed`         | Whether the sidebar is collapsed (desktop).                                                                                              | `boolean`                                                                                            | `false`                |
| `collapsedWidth`   | `collapsed-width`   | Collapsed width of the sidebar. Accepts any CSS value.                                                                                   | `string`                                                                                             | `'4rem'`               |
| `expandedWidth`    | `expanded-width`    | Expanded width of the sidebar. Accepts any CSS value.                                                                                    | `string`                                                                                             | `'16rem'`              |
| `items`            | `items`             | Navigation items to display. Items with `section: 'bottom'` render in the footer area.                                                   | `SidebarItem[] \| string`                                                                            | `[]`                   |
| `mobileBreakpoint` | `mobile-breakpoint` | Breakpoint (px) below which the sidebar auto-collapses on mobile.                                                                        | `number`                                                                                             | `768`                  |
| `mobileCollapse`   | `mobile-collapse`   | Enable auto-collapse on mobile viewports. When true, the sidebar collapses to icon-only mode on screens smaller than `mobileBreakpoint`. | `boolean`                                                                                            | `true`                 |
| `variant`          | `variant`           | Visual variant of the sidebar.                                                                                                           | `"bordered" \| "default" \| "elevated" \| "filled" \| "floating" \| "ghost" \| "glass" \| "minimal"` | `'default'`            |


## Events

| Event                 | Description                                      | Type                   |
| --------------------- | ------------------------------------------------ | ---------------------- |
| `andSidebarItemClick` | Emitted when a navigation item is clicked.       | `CustomEvent<string>`  |
| `andSidebarToggle`    | Emitted when the sidebar collapse state changes. | `CustomEvent<boolean>` |


## Dependencies

### Depends on

- [and-icon](../and-icon)

### Graph
```mermaid
graph TD;
  and-sidebar --> and-icon
  style and-sidebar fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
