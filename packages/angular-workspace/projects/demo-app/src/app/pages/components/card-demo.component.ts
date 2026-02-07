import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCard } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-card-demo',
  standalone: true,
  imports: [CommonModule, MyCard],
  template: `
    <div class="demo-section">
      <h2>Card</h2>
      <p>Flexible content containers</p>
      <div
        style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem"
      >
        <my-card>
          <h3 style="margin-top: 0">Card Title</h3>
          <p>This is a simple card with default styling.</p>
        </my-card>
        <my-card variant="elevated">
          <h3 style="margin-top: 0">Elevated Card</h3>
          <p>This card has an elevated shadow effect.</p>
        </my-card>
      </div>
    </div>
  `,
})
export class CardDemoComponent {}
