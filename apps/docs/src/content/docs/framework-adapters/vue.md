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
