# @andersseen/motion

![npm](https://img.shields.io/npm/v/@andersseen/motion)

Framework-agnostic animation library for TypeScript and CSS.

## Installation

```bash
npm install @andersseen/motion
# or
pnpm add @andersseen/motion
```

## Quick Start

The motion package provides a class-based `MotionController` and attribute-based CSS animations. First, import the stylesheet so the required CSS rules for motion apply:

```css
/* Import styles into your main stylesheet */
@import '@andersseen/motion/style.css';
```

Then, initialize the logic in your TypeScript/JavaScript. The controller scans the target for specific attribute bindings (`and-motion`, etc) and manages intersections, pointers, and states.

```typescript
import { MotionController } from '@andersseen/motion';

// Scan a root element (e.g. body or a container component)
const motionController = new MotionController(document.body);
```

```html
<!-- In your HTML markup -->
<div and-motion="fade-in" and-motion-trigger="enter">
  Animate me on enter!
</div>
```

## API Overview

### Controller Methods

- `new MotionController(rootElement, options)`
- `destroy()`

### Attributes

Animations can be driven using the following attributes directly in HTML:
- `and-motion` - Set to the animation type
- `and-motion-trigger` - Determines what causes the animation (e.g., `enter`, `hover`, `tap`)
- `and-motion-duration` - Configuration for transition duration
- `and-motion-delay` - Configuration for transition delay
- `and-motion-easing` - Easing functions
- `and-motion-state` - Can override initial/final behaviors
- `and-motion-once` - Whether to repeat

### Animations

The library includes the following categories of animations which you can use in the `and-motion` attribute:
- `attention-seekers` (e.g., pulse, heartbeat)
- `back` (e.g., backIn, backOut)
- `bouncing` (e.g., bounceIn, bounceOut)
- `components`
- `fading` (e.g., fade-in, fade-out)
- `flippers` (e.g., flip)
- `lightspeed`
- `reduced-motion` (A11y fallbacks)
- `rotating` (e.g., rotateIn)
- `sliding` (e.g., slide-in, slide-out)
- `specials`
- `zooming` (e.g., zoomIn)

*(See `src/animations` CSS modules for specific names under each category).*

## Usage with Angular/Stencil

When a component is mounted, start the `MotionController`. Remember to invoke `destroy()` to properly unhook observers and listeners to prevent memory leaks during SPA navigations/unmounts.

```tsx
// Stencil / React component lifecycle
let mc;

function onMount(hostElement) {
  mc = new MotionController(hostElement);
}

function onUnmount() {
  if (mc) {
    mc.destroy();
  }
}
```

## License

MIT
