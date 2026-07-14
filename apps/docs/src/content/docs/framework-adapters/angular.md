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

## A more complete example

The same profile-form pattern as the [React](/framework-adapters/react/) and
[Vue](/framework-adapters/vue/) pages — [Input](/components/input/),
[Select](/components/select/), [Button](/components/button/), and an imperative
[Toast](/components/toast/) call through a `ViewChild`:

<div class="and-live-example" style="flex-direction: column; align-items: stretch;">
  <div and-layout="vertical gap:sm" style="max-width: 22rem;">
    <and-input id="ng-name" label="Display name" placeholder="Ada Lovelace" name="name"></and-input>
    <and-select
      id="ng-role"
      label="Role"
      placeholder="Choose a role"
      options='[{"value":"admin","text":"Admin"},{"value":"editor","text":"Editor"},{"value":"viewer","text":"Viewer"}]'
    ></and-select>
    <and-button id="ng-save">Save changes</and-button>
  </div>
  <and-toast id="ng-toast" position="bottom-right"></and-toast>
</div>

<script>
  document.getElementById('ng-save')?.addEventListener('click', () => {
    const name = document.getElementById('ng-name').value || 'Unnamed';
    const role = document.getElementById('ng-role').value || 'no role';
    document.getElementById('ng-toast').present(`Saved ${name} as ${role}`, 'success', 3000);
  });
</script>

_(Rendered above with the raw custom elements this docs site registers globally
— the component below produces the same DOM through the Angular wrappers.)_

```ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AndInput,
  AndSelect,
  AndButton,
  AndToast,
} from '@andersseen/angular-components';
import type { HTMLAndToastElement } from '@andersseen/web-components';

@Component({
  selector: 'app-profile-form',
  imports: [AndInput, AndSelect, AndButton, AndToast],
  template: `
    <div and-layout="vertical gap:sm" style="max-width: 22rem">
      <and-input
        label="Display name"
        placeholder="Ada Lovelace"
        [value]="name"
        (andInputChange)="name = $event.detail"
      ></and-input>
      <and-select
        label="Role"
        placeholder="Choose a role"
        [options]="roles"
        [value]="role"
        (andSelectChange)="role = $event.detail"
      ></and-select>
      <and-button (andButtonClick)="save()">Save changes</and-button>
      <and-toast #toast position="bottom-right"></and-toast>
    </div>
  `,
})
export class ProfileFormComponent {
  name = '';
  role = '';
  roles = [
    { value: 'admin', text: 'Admin' },
    { value: 'editor', text: 'Editor' },
    { value: 'viewer', text: 'Viewer' },
  ];

  @ViewChild('toast', { read: ElementRef })
  toastRef!: ElementRef<HTMLAndToastElement>;

  save() {
    this.toastRef.nativeElement.present(
      `Saved ${this.name || 'Unnamed'} as ${this.role || 'no role'}`,
      'success',
      3000,
    );
  }
}
```

`[options]` binds the array directly, same as React/Vue — the
`ProxyCmp`-generated inputs are real property bindings, not attributes. Methods
like `present()` aren't proxied either, so grab the native element with
`{ read: ElementRef }` and call it off `.nativeElement`.

## Known limitation

Angular's `ProxyCmp` decorator eagerly registers every custom element it wraps
at module-evaluation time, which currently defeats tree-shaking for Angular
consumers specifically (importing one wrapper component pulls in registration
code for all of them). This is a Stencil `output-targets` limitation, not
something fixable from the wrapper package alone.
