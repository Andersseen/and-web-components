import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyInput } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-input-demo',
  standalone: true,
  imports: [CommonModule, MyInput],
  template: `
    <div class="demo-section">
      <h2>Input</h2>
      <p>Form input fields</p>
      <div class="flex flex-col gap-4 max-w-sm">
        <my-input placeholder="Default Input" type="text"></my-input>
        <my-input placeholder="Disabled Input" disabled="true"></my-input>
        <my-input placeholder="Email Input" type="email"></my-input>
        <my-input placeholder="Password Input" type="password"></my-input>
      </div>
    </div>
  `,
})
export class InputDemoComponent {}
