---
title: Vue Wrappers
description: Generated Vue 3 wrappers around @andersseen/web-components.
---

`@andersseen/vue-components` is a generated Vue 3 wrapper around
[`@andersseen/web-components`](/components/button/). It's a **framework
adapter** (see the root README's "Package Roles"): thin, mostly-generated,
follows the core package's release cadence, and doesn't carry independent design
decisions. Rebuilt automatically from Stencil's Vue output target.

## Install

```bash
npm install @andersseen/web-components @andersseen/vue-components @andersseen/icon
```

## Usage

```vue
<!-- App.vue -->
<script setup lang="ts">
import { AndButton } from '@andersseen/vue-components';
import '@andersseen/web-components/style.css';
</script>

<template>
  <AndButton variant="default">Click me</AndButton>
</template>
```

Every [component](/components/button/) has a generated Vue wrapper of the same
shape — import the one you need (`AndAlert`, `AndTabs`, `AndTabsList`,
`AndTabsTrigger`, etc.). Props map to the underlying custom element's documented
attributes, and the same event names the element dispatches (`andButtonClick`,
`andDismiss`, etc.) are wired through as Vue emits.

## A more complete example

The same profile-form pattern as the [React page](/framework-adapters/react/) —
[Input](/components/input/), [Select](/components/select/),
[Button](/components/button/), and an imperative [Toast](/components/toast/)
call through a template ref:

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="vertical gap:sm" style="max-width: 22rem;">
    <and-input id="vue-name" label="Display name" placeholder="Ada Lovelace" name="name"></and-input>
    <and-select
      id="vue-role"
      label="Role"
      placeholder="Choose a role"
      options='[{"value":"admin","text":"Admin"},{"value":"editor","text":"Editor"},{"value":"viewer","text":"Viewer"}]'
    ></and-select>
    <and-button id="vue-save">Save changes</and-button>
  </div>
  <and-toast id="vue-toast" position="bottom-right"></and-toast>
</div>

<script>
  document.getElementById('vue-save')?.addEventListener('click', () => {
    const name = document.getElementById('vue-name').value || 'Unnamed';
    const role = document.getElementById('vue-role').value || 'no role';
    document.getElementById('vue-toast').present(`Saved ${name} as ${role}`, 'success', 3000);
  });
</script>

_(Rendered above with the raw custom elements this docs site registers globally
— the SFC below produces the same DOM through the Vue wrappers.)_

```vue
<script setup lang="ts">
import { ref } from 'vue';
import {
  AndInput,
  AndSelect,
  AndButton,
  AndToast,
} from '@andersseen/vue-components';
import '@andersseen/web-components/style.css';

const name = ref('');
const role = ref('');
const toastRef = ref<InstanceType<typeof AndToast>>();

const roles = [
  { value: 'admin', text: 'Admin' },
  { value: 'editor', text: 'Editor' },
  { value: 'viewer', text: 'Viewer' },
];

function save() {
  toastRef.value?.$el.present(
    `Saved ${name.value || 'Unnamed'} as ${role.value || 'no role'}`,
    'success',
    3000,
  );
}
</script>

<template>
  <div and-layout="vertical gap:sm" style="max-width: 22rem">
    <AndInput
      label="Display name"
      placeholder="Ada Lovelace"
      :value="name"
      @andInputChange="name = $event.detail"
    />
    <AndSelect
      label="Role"
      placeholder="Choose a role"
      :options="roles"
      :value="role"
      @andSelectChange="role = $event.detail"
    />
    <AndButton @andButtonClick="save">Save changes</AndButton>
    <AndToast ref="toastRef" position="bottom-right" />
  </div>
</template>
```

As with React, `:options="roles"` sets a real DOM property, not a JSON-string
attribute. Methods like `present()` aren't proxied onto the Vue wrapper
component itself — go through the template ref's `$el` (the actual `and-toast`
element) to call them.
