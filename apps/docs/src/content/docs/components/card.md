---
title: Card
description:
  Generic content container, composed with and-card-header, and-card-title,
  and-card-description, and-card-content, and and-card-footer.
---

Generic content container. Purely presentational — compose it with
`and-card-header`, `and-card-title`, `and-card-description`, `and-card-content`,
and `and-card-footer` for the standard layout, or use it alone with
`padded="true"` for simple content.

## Example

<div class="and-live-example">
  <and-card style="max-width: 22rem;">
    <and-card-header>
      <and-card-title>Team plan</and-card-title>
      <and-card-description>For growing teams that need more seats.</and-card-description>
    </and-card-header>
    <and-card-content>
      <p style="margin: 0;">Up to 20 members, shared workspaces, and priority support.</p>
    </and-card-content>
    <and-card-footer>
      <and-button variant="default">Upgrade</and-button>
    </and-card-footer>
  </and-card>
</div>

```html
<and-card>
  <and-card-header>
    <and-card-title>Team plan</and-card-title>
    <and-card-description
      >For growing teams that need more seats.</and-card-description
    >
  </and-card-header>
  <and-card-content>
    <p>Up to 20 members, shared workspaces, and priority support.</p>
  </and-card-content>
  <and-card-footer>
    <and-button variant="default">Upgrade</and-button>
  </and-card-footer>
</and-card>
```

## Properties

### `and-card` (root)

| Property      | Attribute | Description                                                                                                                                        | Type                                                               | Default     |
| ------------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------- |
| `variant`     | `variant` | Visual variant of the card.                                                                                                                        | `"default" \| "destructive" \| "elevated" \| "ghost" \| "outline"` | `'default'` |
| `padded`      | `padded`  | Add built-in padding. Use `true` for simple content without sub-components; defaults to `false` so header/content/footer manage their own spacing. | `boolean`                                                          | `false`     |
| `customClass` | `class`   | Additional CSS classes from the consumer.                                                                                                          | `string`                                                           | `''`        |

### `and-card-title`

| Property | Attribute | Description                                                                                                                                                                   | Type                         | Default |
| -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------- |
| `level`  | `level`   | Heading level exposed to assistive tech via `aria-level`. Defaults to `3` (page title → section → card title) — adjust per page to avoid skipping/duplicating heading levels. | `1 \| 2 \| 3 \| 4 \| 5 \| 6` | `3`     |

`and-card-header`, `and-card-description`, `and-card-content`, and
`and-card-footer` are purely presentational layout slots — no props beyond
`customClass`.

<small>
  Note: `packages/web-components/src/components/and-card/readme.md` currently
  documents `and-card-title`, not the `and-card` root — see the note on the
  [Accordion](/components/accordion/) page for why. The root's table above
  comes from `and-card.tsx`/`and-card-variants.ts` directly.
</small>
