import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MyDrawer,
  MyButton,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-drawer-demo',
  standalone: true,
  imports: [CommonModule, MyDrawer, MyButton],
  template: `
    <div class="demo-section">
      <h2>Drawer</h2>
      <p>Slide-out panel from the side of the screen</p>

      <div class="flex gap-2 flex-wrap">
        <my-button (click)="openDrawer('left')">Left</my-button>
        <my-button (click)="openDrawer('right')">Right</my-button>
        <my-button (click)="openDrawer('top')">Top</my-button>
        <my-button (click)="openDrawer('bottom')">Bottom</my-button>
      </div>

      <my-drawer
        [open]="drawerOpen()"
        [placement]="placement()"
        (myClose)="closeDrawer()"
      >
        <h3 slot="header">Drawer Title</h3>
        <div>
          <p>This is the drawer content. You can put any content here.</p>
          <p>It slides in from the {{ placement() }} side of the screen.</p>
        </div>
      </my-drawer>
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
