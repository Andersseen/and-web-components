# @andersseen/icon

![npm](https://img.shields.io/npm/v/@andersseen/icon)

Shared icon library for Andersseen web components - SVG icon registry.

## Installation

```bash
npm install @andersseen/icon
# or
pnpm add @andersseen/icon
```

## Quick Start

The icon package exports individual icons (as SVG strings) and a registry system. Register icons so they can be rendered using the generic icon component.

```typescript
import { registerIcons, CLOSE, PLAY } from '@andersseen/icon';

// Register necessary icons
registerIcons({
  close: CLOSE,
  play: PLAY
});
```

## API Overview

The library exposes the following exports:

### Modules

- `registry.ts` - Provides the `registerIcons` and `registerAllIcons` methods to set up SVG icons dynamically.
- `icons.ts` - Contains SVG representations of individual icons.

### Icons

The library exports individual SVG string constants from `icons.ts`:

- `CLOSE`
- `CHEVRON_DOWN`
- `CHEVRON_LEFT`
- `CHEVRON_RIGHT`
- `CHEVRON_UP`
- `ARROW_UP`
- `ARROW_DOWN`
- `ARROW_LEFT`
- `ARROW_RIGHT`
- `INFO`
- `ALERT_CIRCLE`
- `ERROR`
- `SUCCESS`
- `WARNING`
- `LOADER`
- `HOME`
- `LAYOUT`
- `LAYERS`
- `IMAGE`
- `STAR`

*(Note: Additional icons are exported, see the source file for the complete list).*

## Usage with Stencil

By registering icons through `@andersseen/icon`, components like `and-icon` (from the `@andersseen/web-components` library) can seamlessly fetch and render SVG strings without directly embedding SVG elements on the page multiple times.

```tsx
import { registerIcons, COMPONENT_ICONS } from '@andersseen/icon';

// In an initialization file or top-level component
registerIcons(COMPONENT_ICONS);
```

```html
<!-- Then use within your markup via and-icon -->
<and-icon name="close"></and-icon>
```

## License

MIT
