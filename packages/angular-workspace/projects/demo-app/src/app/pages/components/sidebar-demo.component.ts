import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Sidebar</h2>
      <p>Side navigation panel (you're using it now!)</p>
      <my-card class="p-4">
        <p style="margin: 0; color: #6b7280">
          The sidebar component is used on the left of this demo app. It
          provides navigation between different components. Try clicking the
          collapse button!
        </p>
      </my-card>
    </div>
  `,
})
export class SidebarDemoComponent {}
