import { AndButton } from '@angular-components/stencil-generated/components';
import { Component } from '@angular/core';

@Component({
  selector: 'app-button-demo',
  imports: [AndButton],
  template: `
    <section class="demo-section">
      <h2>Button</h2>
      <p>Interactive buttons with multiple variants and sizes</p>
      <div class="demo-examples">
        <and-button variant="default">Default</and-button>
        <and-button variant="destructive">Destructive</and-button>
        <and-button variant="outline">Outline</and-button>
        <and-button variant="secondary">Secondary</and-button>
        <and-button variant="ghost">Ghost</and-button>
        <and-button variant="link">Link</and-button>
      </div>

      <h3>Sizes</h3>
      <div class="demo-examples">
        <and-button size="sm">Small</and-button>
        <and-button size="default">Default</and-button>
        <and-button size="lg">Large</and-button>
        <and-button size="icon">🚀</and-button>
      </div>
    </section>
  `,
})
export default class ButtonDemo {}
