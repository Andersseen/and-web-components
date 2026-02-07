import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drawer-demo',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="demo-section">
      <h2>Drawer</h2>
      <p>Slide-out panel from the side of the screen</p>
      <my-button label="Open Drawer" (click)="openDrawer()"></my-button>

      <my-drawer [open]="drawerOpen()" (myClose)="closeDrawer()">
        <h3 slot="header">Drawer Title</h3>
        <div>
          <p>This is the drawer content. You can put any content here.</p>
          <p>It slides in from the right side of the screen.</p>
        </div>
      </my-drawer>
    </div>
  `,
})
export class DrawerDemoComponent {
  drawerOpen = signal(false);

  openDrawer() {
    this.drawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerOpen.set(false);
  }
}
