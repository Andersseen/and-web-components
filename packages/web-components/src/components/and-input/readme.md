# and-input



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                         | Type                                                                        | Default     |
| ------------- | -------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------- | ----------- |
| `customClass` | `class`        | Additional CSS classes from the consumer.                           | `string`                                                                    | `undefined` |
| `describedBy` | `described-by` | ID of the element that describes this input (e.g. error message).   | `string`                                                                    | `undefined` |
| `disabled`    | `disabled`     | Disables interaction when true.                                     | `boolean`                                                                   | `false`     |
| `hasError`    | `has-error`    | Whether the input is in an error state.                             | `boolean`                                                                   | `false`     |
| `label`       | `label`        | Accessible label for the input (used when no visible label exists). | `string`                                                                    | `undefined` |
| `placeholder` | `placeholder`  | Placeholder text for the input.                                     | `string`                                                                    | `undefined` |
| `required`    | `required`     | Marks the input as required.                                        | `boolean`                                                                   | `false`     |
| `type`        | `type`         | HTML input type.                                                    | `"email" \| "number" \| "password" \| "search" \| "tel" \| "text" \| "url"` | `'text'`    |
| `value`       | `value`        | Current value of the input.                                         | `string`                                                                    | `undefined` |


## Events

| Event      | Description                           | Type                  |
| ---------- | ------------------------------------- | --------------------- |
| `andBlur`  | Emitted when the input loses focus.   | `CustomEvent<void>`   |
| `andInput` | Emitted when the input value changes. | `CustomEvent<string>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
