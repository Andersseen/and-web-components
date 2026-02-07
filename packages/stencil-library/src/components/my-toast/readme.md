# my-toast



<!-- Auto Generated Below -->


## Methods

### `present(message: string, type?: ToastType, duration?: number) => Promise<void>`

Present a new toast

#### Parameters

| Name       | Type                                          | Description |
| ---------- | --------------------------------------------- | ----------- |
| `message`  | `string`                                      |             |
| `type`     | `"info" \| "error" \| "success" \| "warning"` |             |
| `duration` | `number`                                      |             |

#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [my-icon](../my-icon)

### Graph
```mermaid
graph TD;
  my-toast --> my-icon
  style my-toast fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
