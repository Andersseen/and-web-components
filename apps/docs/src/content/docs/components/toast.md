---
title: Toast
description:
  Toast notification host and manager, presented imperatively via the present()
  method.
---

Toast notification host and manager. The container is a `role="region"` +
`aria-live="polite"` landmark; each toast is `role="alert"` with
`aria-live="assertive"` so it's announced immediately. Call `present()`
imperatively to show a toast — this component renders no visible content until
then.

## Example

<div class="and-live-example">
  <and-button id="toast-trigger" variant="outline">Show toast</and-button>
  <and-toast id="demo-toast" position="bottom-right"></and-toast>
</div>

<script>
  document.getElementById('toast-trigger')?.addEventListener('click', () => {
    document.getElementById('demo-toast').present('Changes saved.', 'success', 3000);
  });
</script>

```html
<and-button id="save-trigger">Show toast</and-button>
<and-toast id="app-toast" position="bottom-right"></and-toast>

<script>
  saveTrigger.addEventListener('click', () => {
    appToast.present('Changes saved.', 'success', 3000);
  });
</script>
```

## Properties

| Property   | Attribute  | Description                                | Type                                                                                              | Default          |
| ---------- | ---------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------- |
| `position` | `position` | Position of the toast container on screen. | `"bottom-center" \| "bottom-left" \| "bottom-right" \| "top-center" \| "top-left" \| "top-right"` | `'bottom-right'` |

## Methods

### `present(message: string, type?: ToastType, duration?: number) => Promise<number>`

Presents a new toast notification.

| Parameter  | Type                                                       | Description |
| ---------- | ---------------------------------------------------------- | ----------- |
| `message`  | `string`                                                   |             |
| `type`     | `"info" \| "error" \| "default" \| "success" \| "warning"` |             |
| `duration` | `number`                                                   |             |
