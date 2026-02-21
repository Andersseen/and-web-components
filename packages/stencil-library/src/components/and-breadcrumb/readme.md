# and-breadcrumb-item



<!-- Auto Generated Below -->


## Properties

| Property        | Attribute        | Description                                                | Type                   | Default     |
| --------------- | ---------------- | ---------------------------------------------------------- | ---------------------- | ----------- |
| `current`       | `current`        | Marks this item as the current page (adds aria-current).   | `boolean`              | `false`     |
| `customClass`   | `class`          | Additional CSS classes to merge with internal styles.      | `string`               | `undefined` |
| `hideSeparator` | `hide-separator` | Hide the leading separator (typically for the first item). | `boolean`              | `false`     |
| `href`          | `href`           | Optional URL. When set, the item renders as a link.        | `string`               | `undefined` |
| `size`          | `size`           | Size variant — should match the parent breadcrumb size.    | `"lg" \| "md" \| "sm"` | `'md'`      |


## Events

| Event                   | Description                                  | Type                  |
| ----------------------- | -------------------------------------------- | --------------------- |
| `andBreadcrumbNavigate` | Emitted when a breadcrumb link is activated. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
