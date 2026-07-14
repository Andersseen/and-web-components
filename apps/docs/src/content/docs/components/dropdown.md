---
title: Dropdown
description: Menu button that opens a list of items on click.
---

Menu button that opens a list of `items` on click. The trigger gets
`aria-haspopup`/`aria-expanded` automatically, and the menu supports arrow keys,
Home/End, Enter/Space, and Escape. If you slot a custom `trigger` instead of
using the default button, you're responsible for adding those ARIA attributes
yourself — they can't be forwarded onto arbitrary slotted content.

`items` is a plain JS array of
`{ value: string; text: string; disabled?: boolean }`, so it's set as a property
rather than an HTML attribute.

## Example

<div class="and-live-example">
  <and-dropdown id="demo-dropdown" label="Actions"></and-dropdown>
</div>

<script>
  customElements.whenDefined('and-dropdown').then(() => {
    document.getElementById('demo-dropdown').items = [
      { value: 'edit', text: 'Edit' },
      { value: 'duplicate', text: 'Duplicate' },
      { value: 'delete', text: 'Delete' },
    ];
  });
</script>

```html
<and-dropdown id="actions" label="Actions"></and-dropdown>

<script>
  // Wait for the element to upgrade — an array prop assigned before that
  // point is set on the plain HTMLElement instance and gets lost once
  // Stencil's real class (with its reactive @Prop setter) takes over.
  customElements.whenDefined('and-dropdown').then(() => {
    document.getElementById('actions').items = [
      { value: 'edit', text: 'Edit' },
      { value: 'duplicate', text: 'Duplicate' },
      { value: 'delete', text: 'Delete' },
    ];
  });
</script>
```

## Properties

| Property        | Attribute         | Description                                          | Type                                                            | Default     |
| --------------- | ----------------- | ---------------------------------------------------- | --------------------------------------------------------------- | ----------- |
| `closeOnSelect` | `close-on-select` | Whether to close the menu after an item is selected. | `boolean`                                                       | `true`      |
| `items`         | --                | Items to render in the dropdown menu.                | `DropdownItem[]`                                                | `[]`        |
| `label`         | `label`           | Accessible label for the dropdown trigger.           | `string`                                                        | `'Options'` |
| `placement`     | `placement`       | Preferred placement of the dropdown menu.            | `"bottom" \| "left" \| "right" \| "top"`                        | `'bottom'`  |
| `variant`       | `variant`         | Visual variant of the trigger button.                | `"default" \| "ghost" \| "outline" \| "primary" \| "secondary"` | `'default'` |

## Events

| Event                   | Description                                   | Type                   |
| ----------------------- | --------------------------------------------- | ---------------------- |
| `andDropdownOpenChange` | Emitted when the dropdown open state changes. | `CustomEvent<boolean>` |
| `andDropdownSelect`     | Emitted when an item is selected.             | `CustomEvent<string>`  |
