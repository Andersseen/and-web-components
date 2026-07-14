---
title: Pagination
description: Page-number navigation with previous/next controls.
---

Page-number navigation (`nav aria-label="Pagination"`) with previous/next
controls. Renders one button per page — for very large `totalPages`, consider
paging through results some other way, since this doesn't truncate with an
ellipsis.

## Example

<div class="and-live-example">
  <and-pagination id="demo-pagination" current-page="2" total-pages="5"></and-pagination>
</div>

<script>
  const demoPagination = document.getElementById('demo-pagination');
  demoPagination?.addEventListener('andPageChange', e => { demoPagination.currentPage = e.detail; });
</script>

```html
<and-pagination id="pager" current-page="2" total-pages="5"></and-pagination>

<script>
  pager.addEventListener('andPageChange', e => (pager.currentPage = e.detail));
</script>
```

## Properties

| Property      | Attribute      | Description                    | Type     | Default |
| ------------- | -------------- | ------------------------------ | -------- | ------- |
| `currentPage` | `current-page` | Current active page (1-based). | `number` | `1`     |
| `totalPages`  | `total-pages`  | Total number of pages.         | `number` | `1`     |

## Events

| Event           | Description                    | Type                  |
| --------------- | ------------------------------ | --------------------- |
| `andPageChange` | Emitted when the page changes. | `CustomEvent<number>` |
