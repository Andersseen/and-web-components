# @andersseen/web-components

![npm](https://img.shields.io/npm/v/@andersseen/web-components)

Accessible, framework-agnostic web components built with Stencil.

## Installation

```bash
npm install @andersseen/web-components
# or
pnpm add @andersseen/web-components
```

## Quick Start

You can import these components into a variety of application environments. Using the module export loader sets up lazy-loading to inject components effectively.

```html
<!-- Load scripts efficiently within your host HTML/App -->
<script type="module" src="node_modules/@andersseen/web-components/dist/web-components/web-components.esm.js"></script>

<!-- Render anywhere -->
<and-button variant="default" size="default">Click Me</and-button>
```

## API Overview

The following core components are exposed (identified by tag names in `src/components/`):

- `<and-accordion>`
- `<and-alert>`
- `<and-badge>`
- `<and-breadcrumb>`
- `<and-button>`
- `<and-card>`
- `<and-carousel>`
- `<and-context-menu>`
- `<and-drawer>`
- `<and-dropdown>`
- `<and-icon>`
- `<and-input>`
- `<and-menu-list>`
- `<and-modal>`
- `<and-navbar>`
- `<and-pagination>`
- `<and-sidebar>`
- `<and-tabs>`
- `<and-toast>`
- `<and-tooltip>`

## Usage with Stencil / Angular

In modular applications (such as Angular setups) you can define the web components on the window using the loader script. This enables lazy-loading components globally only when invoked in templates.

```typescript
import { defineCustomElements } from '@andersseen/web-components/loader';

// Initialize lazy loading
defineCustomElements();
```

## License

MIT
