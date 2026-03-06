# and-card

A composable card component with optional sub-components for structured layouts.

## Usage

### Simple (with `padded`)

```html
<and-card padded>
  <p>Quick content without sub-components.</p>
</and-card>
```

### Structured (recommended)

```html
<and-card>
  <and-card-header>
    <and-card-title>Notifications</and-card-title>
    <and-card-description>You have 3 unread messages.</and-card-description>
  </and-card-header>
  <and-card-content>
    <p>Card body content goes here.</p>
  </and-card-content>
  <and-card-footer>
    <and-button variant="outline">Cancel</and-button>
    <and-button>Save</and-button>
  </and-card-footer>
</and-card>
```

### Partial composition

Sub-components are optional — mix and match as needed:

```html
<and-card>
  <and-card-header>
    <and-card-title>Simple header-only card</and-card-title>
  </and-card-header>
  <and-card-content>
    <p>Just header + content, no footer.</p>
  </and-card-content>
</and-card>
```

## Sub-components

| Component              | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `and-card-header`      | Top section with vertical flex + spacing       |
| `and-card-title`       | Heading text (semibold, large)                 |
| `and-card-description` | Muted subtitle / description text              |
| `and-card-content`     | Main body area                                 |
| `and-card-footer`      | Bottom section with horizontal flex alignment  |

All sub-components accept a `class` attribute for custom styling.

<!-- Auto Generated Below -->


## Properties

| Property      | Attribute | Description                               | Type     | Default     |
| ------------- | --------- | ----------------------------------------- | -------- | ----------- |
| `customClass` | `class`   | Additional CSS classes from the consumer. | `string` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
