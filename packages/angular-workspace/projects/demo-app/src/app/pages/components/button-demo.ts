import { MyButton } from '@angular-components/stencil-generated/components';
import { Component } from '@angular/core';

@Component({
  selector: 'app-button-demo',
  imports: [MyButton],
  template: `
    <section class="demo-section">
      <h2>Button</h2>
      <p>Interactive buttons with multiple variants and sizes</p>
      <div class="demo-examples">
        <my-button variant="default">Default</my-button>
        <my-button variant="destructive">Destructive</my-button>
        <my-button variant="outline">Outline</my-button>
        <my-button variant="secondary">Secondary</my-button>
        <my-button variant="ghost">Ghost</my-button>
        <my-button variant="link">Link</my-button>
      </div>

      <h3>Sizes</h3>
      <div class="demo-examples">
        <my-button size="sm">Small</my-button>
        <my-button size="default">Default</my-button>
        <my-button size="lg">Large</my-button>
        <my-button size="icon">🚀</my-button>
      </div>
    </section>
  `,
})
export default class ButtonDemo {}
