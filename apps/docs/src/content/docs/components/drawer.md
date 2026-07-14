---
title: Drawer
description: Off-canvas panel that slides in from an edge of the screen.
---

Off-canvas panel that slides in from an edge of the screen, with a focus trap,
Escape-to-close, backdrop click, and focus restoration to whatever was focused
before it opened — all handled for you via the shared headless drawer logic.

## Example

<div class="and-live-example">
  <and-button id="drawer-trigger" variant="outline">Open drawer</and-button>
  <and-drawer id="demo-drawer" label="Example drawer" placement="right">
    <div style="padding: 1.5rem;">
      <h3 style="margin-top: 0;">Drawer content</h3>
      <p>Press Escape, click the backdrop, or the close button to dismiss.</p>
    </div>
  </and-drawer>
</div>

<script>
  const drawerTrigger = document.getElementById('drawer-trigger');
  const demoDrawer = document.getElementById('demo-drawer');
  drawerTrigger?.addEventListener('click', () => { demoDrawer.open = true; });
  demoDrawer?.addEventListener('andDrawerClose', () => { demoDrawer.open = false; });
</script>

```html
<and-button id="drawer-trigger">Open drawer</and-button>
<and-drawer id="my-drawer" label="Example drawer" placement="right">
  <div style="padding: 1.5rem;">Drawer content</div>
</and-drawer>

<script>
  drawerTrigger.addEventListener('click', () => (myDrawer.open = true));
  myDrawer.addEventListener('andDrawerClose', () => (myDrawer.open = false));
</script>
```

## Properties

| Property    | Attribute    | Description                                             | Type                                     | Default  |
| ----------- | ------------ | ------------------------------------------------------- | ---------------------------------------- | -------- |
| `label`     | `label`      | Accessible label for the drawer.                        | `string`                                 | `''`     |
| `open`      | `open`       | Whether the drawer is open.                             | `boolean`                                | `false`  |
| `placement` | `placement`  | The direction the drawer slides in from.                | `"bottom" \| "left" \| "right" \| "top"` | `'left'` |
| `showClose` | `show-close` | Whether to show the default close button in the header. | `boolean`                                | `true`   |

## Events

| Event            | Description                                                                  | Type                |
| ---------------- | ---------------------------------------------------------------------------- | ------------------- |
| `andDrawerClose` | Emitted when the drawer is closed (backdrop click, close button, or Escape). | `CustomEvent<void>` |
| `andDrawerOpen`  | Emitted when the drawer is opened.                                           | `CustomEvent<void>` |
