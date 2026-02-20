import { AndInput } from '@angular-components/stencil-generated/components';
import { Component } from '@angular/core';

@Component({
  selector: 'app-input-demo',
  imports: [AndInput],
  template: `
    <div class="demo-section">
      <h2>Input</h2>
      <p>Form input fields</p>
      <div class="flex flex-col gap-4 max-w-sm">
        <and-input placeholder="Default Input" type="text"></and-input>
        <and-input placeholder="Disabled Input" disabled="true"></and-input>
        <and-input placeholder="Email Input" type="email"></and-input>
        <and-input placeholder="Password Input" type="password"></and-input>
      </div>
    </div>
  `,
})
export default class InputDemo {}
