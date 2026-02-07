import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Card</h2>
      <p>Container for content with optional variants</p>
      <div
        style="
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        "
      >
        <my-card variant="default" class="p-6">
          <h3
            style="
              margin: 0 0 0.5rem 0;
              font-size: 1.25rem;
              font-weight: 600;
            "
          >
            Default Card
          </h3>
          <p style="margin: 0; color: #6b7280">
            This is a default card with standard styling.
          </p>
        </my-card>
        <my-card variant="destructive" class="p-6">
          <h3
            style="
              margin: 0 0 0.5rem 0;
              font-size: 1.25rem;
              font-weight: 600;
              color: #dc2626;
            "
          >
            Destructive Card
          </h3>
          <p style="margin: 0; color: #991b1b">
            This is a destructive variant card.
          </p>
        </my-card>
      </div>
    </div>
  `,
})
export class CardDemoComponent {}
