import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyButton } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-button-demo',
  standalone: true,
  imports: [CommonModule, MyButton],
  template: `
    <div class="demo-section">
      <h2>Button</h2>
      <p>Interactive buttons with multiple variants and sizes</p>
      <div class="demo-examples">
        <my-button label="Default" variant="default"></my-button>
        <my-button label="Primary" variant="primary"></my-button>
        <my-button label="Secondary" variant="secondary"></my-button>
        <my-button label="Destructive" variant="destructive"></my-button>
        <my-button label="Outline" variant="outline"></my-button>
        <my-button label="Ghost" variant="ghost"></my-button>
        <my-button label="Link" variant="link"></my-button>
      </div>

      <h3>Sizes</h3>
      <div class="demo-examples">
        <my-button label="Small" size="sm"></my-button>
        <my-button label="Default" size="default"></my-button>
        <my-button label="Large" size="lg"></my-button>
        <my-button label="Icon" size="icon">🚀</my-button>
      </div>
    </div>
  `,
})
export class ButtonDemoComponent {}
