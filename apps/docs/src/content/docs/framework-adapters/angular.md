---
title: Angular Wrappers
description:
  Generated Angular standalone directive wrappers around
  @andersseen/web-components.
---

`@andersseen/angular-components` is a generated Angular standalone directive
wrapper around [`@andersseen/web-components`](/components/button/). It's a
**framework adapter** (see the root README's "Package Roles"): thin,
mostly-generated, follows the core package's release cadence, and doesn't carry
independent design decisions. Rebuilt automatically from Stencil's Angular
output target — see `pnpm build:stencil` in this repo.

## Install

```bash
npm install @andersseen/web-components @andersseen/angular-components @andersseen/icon
```

## Usage

```ts
// app.component.ts
import { Component } from '@angular/core';
import { AndButton, AndModal, AndIcon } from '@andersseen/angular-components';

@Component({
  imports: [AndButton, AndModal, AndIcon],
  template: `<and-button variant="default">Click me</and-button>`,
})
export class AppComponent {}
```

Every [component](/components/button/) has a generated Angular wrapper of the
same shape — import the one you need (`AndAlert`, `AndTabs`, `AndTabsList`,
`AndTabsTrigger`, etc.) and add it to your standalone component's `imports`
array. Props, events, and slots map 1:1 to the underlying custom element's
documented API.

## Load styles

```ts
// styles.css or angular.json "styles"
@import '@andersseen/web-components/style.css';
```

## Known limitation

Angular's `ProxyCmp` decorator eagerly registers every custom element it wraps
at module-evaluation time, which currently defeats tree-shaking for Angular
consumers specifically (importing one wrapper component pulls in registration
code for all of them). This is a Stencil `output-targets` limitation, not
something fixable from the wrapper package alone.
