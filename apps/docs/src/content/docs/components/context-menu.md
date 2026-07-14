---
title: Context Menu
description:
  Right-click (or long-press) menu that opens over its trigger-slotted content.
---

Right-click (or long-press) menu that opens over its `trigger`-slotted content.
Supports two usage modes: pass `items` for a built-in, keyboard-navigable list
(arrow keys, Home/End, Enter/Space, Escape), or omit `items` and slot your own
menu content into the default slot.

`items` is a plain JS array of
`{ value: string; text: string; disabled?: boolean }` (not JSON-string-parseable
like some other components here), so it's set as a property rather than an HTML
attribute.

## Example

<div class="and-live-example">
  <and-context-menu id="demo-context-menu" menu-label="Row actions">
    <div slot="trigger" style="padding: 2rem; border: 1px dashed var(--sl-color-hairline); border-radius: 0.5rem; text-align: center;">
      Right-click here
    </div>
  </and-context-menu>
</div>

<script>
  customElements.whenDefined('and-context-menu').then(() => {
    document.getElementById('demo-context-menu').items = [
      { value: 'rename', text: 'Rename' },
      { value: 'duplicate', text: 'Duplicate' },
      { value: 'delete', text: 'Delete' },
    ];
  });
</script>

```html
<and-context-menu id="row-menu" menu-label="Row actions">
  <div slot="trigger">Right-click here</div>
</and-context-menu>

<script>
  // Wait for the element to upgrade — an array prop assigned before that
  // point is set on the plain HTMLElement instance and gets lost once
  // Stencil's real class (with its reactive @Prop setter) takes over.
  customElements.whenDefined('and-context-menu').then(() => {
    document.getElementById('row-menu').items = [
      { value: 'rename', text: 'Rename' },
      { value: 'duplicate', text: 'Duplicate' },
      { value: 'delete', text: 'Delete' },
    ];
  });
</script>
```

## Properties

| Property      | Attribute    | Description                                                                                  | Type                | Default          |
| ------------- | ------------ | -------------------------------------------------------------------------------------------- | ------------------- | ---------------- |
| `customClass` | `class`      | Additional CSS classes to merge with internal styles.                                        | `string`            | `''`             |
| `items`       | --           | Optional items to render in the context menu. When provided, keyboard navigation is enabled. | `ContextMenuItem[]` | `[]`             |
| `menuLabel`   | `menu-label` | Accessible label for the context menu panel.                                                 | `string`            | `'Context menu'` |
| `open`        | `open`       | Whether the context menu is currently open (controlled).                                     | `boolean`           | `false`          |

## Events

| Event                      | Description                          | Type                   |
| -------------------------- | ------------------------------------ | ---------------------- |
| `andContextMenuOpenChange` | Emitted when the open state changes. | `CustomEvent<boolean>` |
| `andContextMenuSelect`     | Emitted when an item is selected.    | `CustomEvent<string>`  |
