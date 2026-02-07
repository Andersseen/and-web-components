import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Navbar</h2>
      <p>Top navigation bar (you're using it now!)</p>
      <my-card class="p-4">
        <p style="margin: 0; color: #6b7280">
          The navbar component is used at the top of this demo app. It provides
          navigation between the Components and Icons sections.
        </p>
      </my-card>
    </div>
  `,
})
export class NavbarDemoComponent {}
