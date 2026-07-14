---
title: Astro Integration
description:
  Astro integration for @andersseen/web-components -- removes the boilerplate of
  manually defining every custom element.
---

`@andersseen/astro` removes the boilerplate of manually importing and defining
every custom element, and automatically registers the icons they use. This docs
site is itself built with it — see it in
[`apps/docs/astro.config.mjs`](https://github.com/Andersseen/and-web-components/blob/main/apps/docs/astro.config.mjs).

## Install

```bash
pnpm add @andersseen/astro @andersseen/web-components @andersseen/icon
```

## Usage

```js
// astro.config.mjs
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

Complex props such as `items` are still serialized to the DOM as attributes. The
integration doesn't remove that requirement, but it does expose TypeScript types
so you get autocompletion and avoid manual `JSON.stringify`.

## A more complete example

A small profile form — [Input](/components/input/),
[Select](/components/select/), and [Button](/components/button/) driving an
imperative [Toast](/components/toast/) call — laid out with
[Layout](/layout/overview/) attributes instead of custom CSS:

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="vertical gap:sm" style="max-width: 22rem;">
    <and-input id="astro-name" label="Display name" placeholder="Ada Lovelace" name="name"></and-input>
    <and-select
      id="astro-role"
      label="Role"
      placeholder="Choose a role"
      options='[{"value":"admin","text":"Admin"},{"value":"editor","text":"Editor"},{"value":"viewer","text":"Viewer"}]'
    ></and-select>
    <and-button id="astro-save">Save changes</and-button>
  </div>
  <and-toast id="astro-toast" position="bottom-right"></and-toast>
</div>

<script>
  document.getElementById('astro-save')?.addEventListener('click', () => {
    const name = document.getElementById('astro-name').value || 'Unnamed';
    const role = document.getElementById('astro-role').value || 'no role';
    document.getElementById('astro-toast').present(`Saved ${name} as ${role}`, 'success', 3000);
  });
</script>

```astro
---
import type { SelectOption } from '@andersseen/web-components';

const roles: SelectOption[] = [
  { value: 'admin', text: 'Admin' },
  { value: 'editor', text: 'Editor' },
  { value: 'viewer', text: 'Viewer' },
];
---

<div and-layout="vertical gap:sm" style="max-width: 22rem;">
  <and-input id="profile-name" label="Display name" name="name"></and-input>
  <and-select id="profile-role" label="Role" options={roles}></and-select>
  <and-button id="profile-save">Save changes</and-button>
</div>
<and-toast id="profile-toast" position="bottom-right"></and-toast>

<script>
  // Astro's client scripts run after custom elements upgrade, so plain DOM
  // lookups, `.value` reads, and `.present()` (a @Method()) all work directly
  // — no framework runtime needed for this kind of interaction.
  const name = document.getElementById('profile-name') as HTMLAndInputElement;
  const role = document.getElementById('profile-role') as HTMLAndSelectElement;
  const toast = document.getElementById('profile-toast') as HTMLAndToastElement;

  document.getElementById('profile-save')?.addEventListener('click', () => {
    toast.present(`Saved ${name.value || 'Unnamed'} as ${role.value || 'no role'}`, 'success', 3000);
  });
</script>
```

`options={roles}` here follows the same rule as `items={navItems}` above: Astro
serializes the array to the `options` attribute as JSON, and
[Select](/components/select/)'s `options` prop accepts a JSON string directly —
so no `customElements.whenDefined()` dance is needed, unlike
[Dropdown](/components/dropdown/)'s `items`, which is property-only.
