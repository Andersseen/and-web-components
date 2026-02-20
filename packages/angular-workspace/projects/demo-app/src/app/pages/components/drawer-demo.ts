import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AndDrawer,
  AndButton,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-drawer-demo',
  standalone: true,
  imports: [CommonModule, AndDrawer, AndButton],
  template: `
    <div class="demo-section">
      <h2>Drawer</h2>
      <p>Slide-out panel from the side of the screen</p>

      <div class="flex gap-2 flex-wrap">
        <and-button (click)="openDrawer('left')">Left</and-button>
        <and-button (click)="openDrawer('right')">Right</and-button>
        <and-button (click)="openDrawer('top')">Top</and-button>
        <and-button (click)="openDrawer('bottom')">Bottom</and-button>
      </div>

      <and-drawer
        [open]="drawerOpen()"
        [placement]="placement()"
        (myClose)="closeDrawer()"
      >
        <h3 slot="header">Drawer Title</h3>
        <div>
          <p>This is the drawer content. You can put any content here.</p>
          <p>It slides in from the {{ placement() }} side of the screen.</p>
        </div>
      </and-drawer>
    </div>
  `,
})
export default class DrawerDemo {
  drawerOpen = signal(false);
  placement = signal<'top' | 'bottom' | 'left' | 'right'>('left');

  openDrawer(direction: 'top' | 'bottom' | 'left' | 'right') {
    this.placement.set(direction);
    this.drawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerOpen.set(false);
  }
}
