# and-button



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute  | Description                                                                              | Type                                                                          | Default     |
| ------------- | ---------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------- |
| `customClass` | `class`    | Additional CSS classes to merge with the internal styles.                                | `string`                                                                      | `undefined` |
| `disabled`    | `disabled` | Disables the button when true.                                                           | `boolean`                                                                     | `false`     |
| `href`        | `href`     | When set, renders as an anchor (`<a>`) instead of `<button>`.                            | `string`                                                                      | `undefined` |
| `loading`     | `loading`  | Shows a loading spinner and disables interaction.                                        | `boolean`                                                                     | `false`     |
| `rel`         | `rel`      | Rel attribute for the anchor. Defaults to `noopener noreferrer` when target is `_blank`. | `string`                                                                      | `undefined` |
| `size`        | `size`     | Size of the button.                                                                      | `"default" \| "icon" \| "lg" \| "sm"`                                         | `'default'` |
| `target`      | `target`   | Target for the anchor (e.g. `_blank`). Only used when `href` is set.                     | `string`                                                                      | `undefined` |
| `type`        | `type`     | HTML button type attribute.                                                              | `"button" \| "reset" \| "submit"`                                             | `'button'`  |
| `variant`     | `variant`  | Visual variant of the button.                                                            | `"default" \| "destructive" \| "ghost" \| "link" \| "outline" \| "secondary"` | `'default'` |


## Events

| Event            | Description              | Type                      |
| ---------------- | ------------------------ | ------------------------- |
| `andButtonClick` | Emitted on button click. | `CustomEvent<MouseEvent>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
