import { Component } from '@angular/core';
import { AndCard } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-sidebar-demo',
  imports: [AndCard],
  template: `
    <div class="demo-section">
      <h2>Sidebar</h2>
      <p>Side navigation panel (you're using it now!)</p>
      <and-card class="p-4">
        <p style="margin: 0; color: #6b7280">
          The sidebar component is used on the left of this demo app. It
          provides navigation between different components. Try clicking the
          collapse button!
        </p>
      </and-card>
    </div>
  `,
})
export default class SidebarDemo {}
