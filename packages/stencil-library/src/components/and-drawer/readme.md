# and-drawer



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute   | Description                              | Type                                     | Default  |
| ----------- | ----------- | ---------------------------------------- | ---------------------------------------- | -------- |
| `open`      | `open`      | Whether the drawer is open.              | `boolean`                                | `false`  |
| `placement` | `placement` | The direction the drawer slides in from. | `"bottom" \| "left" \| "right" \| "top"` | `'left'` |


## Events

| Event     | Description                                                         | Type                |
| --------- | ------------------------------------------------------------------- | ------------------- |
| `myClose` | Emitted when the drawer is closed (backdrop click or close button). | `CustomEvent<void>` |


## Dependencies

### Used by

 - [and-navbar](../and-navbar)

### Depends on

- [and-icon](../and-icon)

### Graph
```mermaid
graph TD;
  and-drawer --> and-icon
  and-navbar --> and-drawer
  style and-drawer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
