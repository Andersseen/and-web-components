---
title: React Wrappers
description: Generated React wrappers around @andersseen/web-components.
---

`@andersseen/react-components` is a generated React wrapper around
[`@andersseen/web-components`](/components/button/). It's a **framework
adapter** (see the root README's "Package Roles"): thin, mostly-generated,
follows the core package's release cadence, and doesn't carry independent design
decisions. Rebuilt automatically from Stencil's React output target.

## Install

```bash
npm install @andersseen/web-components @andersseen/react-components @andersseen/icon
```

## Usage

```tsx
// App.tsx
import { AndButton } from '@andersseen/react-components';
import '@andersseen/web-components/style.css';

export function App() {
  return <AndButton variant="default">Click me</AndButton>;
}
```

Every [component](/components/button/) has a generated React wrapper of the same
shape — import the one you need (`AndAlert`, `AndTabs`, `AndTabsList`,
`AndTabsTrigger`, etc.). Props map to the underlying custom element's documented
attributes; events are exposed as `on*` callback props (e.g.
`onAndButtonClick`).
