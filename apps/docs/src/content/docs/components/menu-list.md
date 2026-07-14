---
title: Menu List
description:
  Data-driven menu that renders items as keyboard-navigable menuitem entries.
---

Data-driven menu (`role="menu"`) that renders `items` as keyboard-navigable
`role="menuitem"` entries — arrow keys, Home/End, and typeahead are handled for
you. Omit `items` to slot arbitrary content instead (e.g. `and-menu-item`
elements), in which case this component only renders the `<ul>` wrapper and
doesn't manage focus for you.

`and-menu-item` is also usable on its own (self-contained, not coordinated by a
parent) — handy for slotting individual items directly, e.g. inside
[Dropdown](/components/dropdown/)'s `trigger` slot content.

## Example

<div class="and-live-example">
  <and-menu-list id="demo-menu-list" style="max-width: 16rem; width: 100%;"></and-menu-list>
</div>

<script>
  customElements.whenDefined('and-menu-list').then(() => {
    document.getElementById('demo-menu-list').items = [
      { id: 'profile', label: 'Profile' },
      { id: 'settings', label: 'Settings' },
      { id: 'logout', label: 'Log out' },
    ];
  });
</script>

```html
<and-menu-list id="menu"></and-menu-list>

<script>
  // Wait for the element to upgrade — an array prop assigned before that
  // point is set on the plain HTMLElement instance and gets lost once
  // Stencil's real class (with its reactive @Prop setter) takes over.
  customElements.whenDefined('and-menu-list').then(() => {
    document.getElementById('menu').items = [
      { id: 'profile', label: 'Profile' },
      { id: 'settings', label: 'Settings' },
      { id: 'logout', label: 'Log out' },
    ];
  });
</script>

<!-- Or slot and-menu-item directly, without a parent-managed items array -->
<and-menu-list aria-menu-label="Row actions">
  <and-menu-item value="edit">Edit</and-menu-item>
  <and-menu-item value="delete" intent="destructive">Delete</and-menu-item>
</and-menu-list>
```

## Properties

### `and-menu-list`

| Property        | Attribute         | Description                                                                                    | Type               | Default  |
| --------------- | ----------------- | ---------------------------------------------------------------------------------------------- | ------------------ | -------- |
| `ariaMenuLabel` | `aria-menu-label` | Accessible label for the menu.                                                                 | `string`           | `'Menu'` |
| `customClass`   | `class`           | Additional CSS classes to merge with internal styles.                                          | `string`           | `''`     |
| `items`         | --                | Optional items to render. When provided, keyboard navigation is coordinated by this component. | `MenuItemConfig[]` | `[]`     |

### `and-menu-item`

| Property      | Attribute  | Description                                           | Type                         | Default     |
| ------------- | ---------- | ----------------------------------------------------- | ---------------------------- | ----------- |
| `intent`      | `intent`   | Intent variant.                                       | `"default" \| "destructive"` | `'default'` |
| `disabled`    | `disabled` | Disables the menu item when true.                     | `boolean`                    | `false`     |
| `value`       | `value`    | Value identifier for the item.                        | `string`                     | `undefined` |
| `customClass` | `class`    | Additional CSS classes to merge with internal styles. | `string`                     | `''`        |

## Events

| Event               | Description                       | Type                  |
| ------------------- | --------------------------------- | --------------------- |
| `andMenuItemSelect` | Emitted when an item is selected. | `CustomEvent<string>` |
