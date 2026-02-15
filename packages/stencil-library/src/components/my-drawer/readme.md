# my-drawer



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

 - [my-navbar](../my-navbar)

### Depends on

- [my-icon](../my-icon)

### Graph
```mermaid
graph TD;
  my-drawer --> my-icon
  my-navbar --> my-drawer
  style my-drawer fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
