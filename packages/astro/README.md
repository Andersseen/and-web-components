# @andersseen/astro

Astro integration for
[@andersseen/web-components](https://github.com/Andersseen/and-web-components).

It removes the boilerplate of manually importing and defining every custom
element, and automatically registers the icons they use.

## Install

```bash
pnpm add @andersseen/astro @andersseen/web-components @andersseen/icon
```

## Usage

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import andersseen from '@andersseen/astro';

export default defineConfig({
  integrations: [andersseen()],
});
```

This is equivalent to adding the following client script to every page:

```ts
import { defineAllCustomElements } from '@andersseen/web-components';
defineAllCustomElements();

import { registerAllIcons } from '@andersseen/icon';
registerAllIcons();
```

## Options

### Tree-shake components

Register only the components you actually use:

```js
andersseen({
  components: ['and-button', 'and-navbar', 'and-badge'],
});
```

### Skip automatic icon registration

```js
andersseen({
  icons: false,
});
```

## Using components in `.astro` files

Once the integration is installed, use the custom elements directly:

```astro
---
import type { NavbarProps } from '@andersseen/web-components';

const navItems: NavbarProps['items'] = [
  { label: 'Home', href: '/' },
  { label: 'Docs', href: '/docs' },
];
---

<and-navbar items={navItems}>
  <and-button variant="outline" slot="actions">Login</and-button>
</and-navbar>
```

> **Note:** complex props such as `items` are still serialized to the DOM as
> attributes. The integration does not remove that requirement, but it does
> expose TypeScript types so you get autocompletion and avoid manual
> `JSON.stringify`.
