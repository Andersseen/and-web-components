# and-sidebar



<!-- Auto Generated Below -->


## Properties

| Property     | Attribute     | Description                       | Type                   | Default                                                                                                                      |
| ------------ | ------------- | --------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `activeItem` | `active-item` | The active navigation item ID.    | `string`               | `'home'`                                                                                                                     |
| `collapsed`  | `collapsed`   | Whether the sidebar is collapsed. | `boolean`              | `false`                                                                                                                      |
| `items`      | --            | Navigation items to display.      | `SidebarItem[]`        | `[     { id: 'home', label: 'Home' },     { id: 'docs', label: 'Docs' },     { id: 'components', label: 'Components' },   ]` |
| `variant`    | `variant`     | Visual variant of the sidebar.    | `"default" \| "ghost"` | `'default'`                                                                                                                  |


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
