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

## A more complete example

The same profile-form pattern used across the
[component pages](/components/button/), composed from multiple wrappers —
[Input](/components/input/), [Select](/components/select/),
[Button](/components/button/), and an imperative [Toast](/components/toast/)
call via `ref`:

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="vertical gap:sm" style="max-width: 22rem;">
    <and-input id="react-name" label="Display name" placeholder="Ada Lovelace" name="name"></and-input>
    <and-select
      id="react-role"
      label="Role"
      placeholder="Choose a role"
      options='[{"value":"admin","text":"Admin"},{"value":"editor","text":"Editor"},{"value":"viewer","text":"Viewer"}]'
    ></and-select>
    <and-button id="react-save">Save changes</and-button>
  </div>
  <and-toast id="react-toast" position="bottom-right"></and-toast>
</div>

<script>
  document.getElementById('react-save')?.addEventListener('click', () => {
    const name = document.getElementById('react-name').value || 'Unnamed';
    const role = document.getElementById('react-role').value || 'no role';
    document.getElementById('react-toast').present(`Saved ${name} as ${role}`, 'success', 3000);
  });
</script>

_(Rendered above with the raw custom elements this docs site registers globally
— the JSX below produces the same DOM through the React wrappers.)_

```tsx
import { useRef, useState } from 'react';
import {
  AndInput,
  AndSelect,
  AndButton,
  AndToast,
} from '@andersseen/react-components';
import type { HTMLAndToastElement } from '@andersseen/web-components';
import '@andersseen/web-components/style.css';

const roles = [
  { value: 'admin', text: 'Admin' },
  { value: 'editor', text: 'Editor' },
  { value: 'viewer', text: 'Viewer' },
];

export function ProfileForm() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const toastRef = useRef<HTMLAndToastElement>(null);

  return (
    <div and-layout="vertical gap:sm" style={{ maxWidth: '22rem' }}>
      <AndInput
        label="Display name"
        placeholder="Ada Lovelace"
        value={name}
        onAndInputChange={e => setName(e.detail)}
      />
      <AndSelect
        label="Role"
        placeholder="Choose a role"
        options={roles}
        value={role}
        onAndSelectChange={e => setRole(e.detail)}
      />
      <AndButton
        onAndButtonClick={() =>
          toastRef.current?.present(
            `Saved ${name || 'Unnamed'} as ${role || 'no role'}`,
            'success',
            3000,
          )
        }
      >
        Save changes
      </AndButton>
      <AndToast ref={toastRef} position="bottom-right" />
    </div>
  );
}
```

Unlike the [Astro integration](/framework-adapters/astro/), `options={roles}`
here is set as a real DOM property on the underlying element, not serialized to
a JSON attribute string — the generated wrapper forwards non-primitive props
directly. `ref` on `AndToast` forwards to the underlying `HTMLAndToastElement`,
so `.present()` (a `@Method()`) is callable straight off `toastRef.current`.
