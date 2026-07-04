import { DemoCodeBlockComponent } from '../../shared';
import { Component, signal } from '@angular/core';
import { AndDrawer, AndButton } from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-drawer-demo',
  imports: [AndDrawer, AndButton, DemoCodeBlockComponent],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">Drawer</h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A slide-out panel that overlays the viewport from any edge. Perfect for navigation menus, forms, or detail
          views.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Preview</h2>
        <div class="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div class="p-10 flex flex-col items-center gap-6 min-h-[180px]">
            <p class="text-sm text-muted-foreground m-0">Open a drawer from any direction</p>
            <div class="flex flex-wrap gap-3 justify-center">
              <and-button variant="outline" (click)="openDrawer('left')"> ← Left </and-button>
              <and-button variant="outline" (click)="openDrawer('right')"> Right → </and-button>
              <and-button variant="outline" (click)="openDrawer('top')"> ↑ Top </and-button>
              <and-button variant="outline" (click)="openDrawer('bottom')"> ↓ Bottom </and-button>
            </div>
          </div>
        </div>
      </section>

      <and-drawer [open]="drawerOpen()" [placement]="placement()" (andDrawerClose)="closeDrawer()">
        <h3 slot="header">Drawer Panel</h3>
        <div class="flex flex-col gap-3">
          <p class="text-sm text-muted-foreground m-0">
            This drawer slides in from the
            <strong class="text-foreground">{{ placement() }}</strong> edge.
          </p>
          <p class="text-sm text-muted-foreground m-0">
            Use drawers for navigation, filters, settings, or any content that benefits from a dedicated overlay.
          </p>
          <div class="mt-4">
            <and-button variant="outline" (click)="closeDrawer()"> Close Drawer </and-button>
          </div>
        </div>
      </and-drawer>

      <!-- Placements -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Placements</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          @for (dir of placements; track dir) {
            <div
              class="rounded-xl border border-border bg-card p-5 text-center cursor-pointer transition-all hover:border-ring hover:shadow-sm"
              (click)="openDrawer(dir)"
            >
              <p class="text-sm font-medium text-foreground m-0 capitalize">
                {{ dir }}
              </p>
              <p class="text-xs text-muted-foreground mt-1 m-0">Click to preview</p>
            </div>
          }
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">Usage</h2>
        <demo-code-block label="Template" [code]="templateCode" />
      </section>
    </div>
  `,
})
export default class DrawerDemo {
  drawerOpen = signal(false);
  placement = signal<'top' | 'bottom' | 'left' | 'right'>('left');
  placements: Array<'top' | 'bottom' | 'left' | 'right'> = ['left', 'right', 'top', 'bottom'];

  openDrawer(direction: 'top' | 'bottom' | 'left' | 'right') {
    this.placement.set(direction);
    this.drawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerOpen.set(false);
  }

  templateCode = `<and-button (click)="isOpen = true">Open</and-button>

<and-drawer [open]="isOpen" placement="right" (andDrawerClose)="isOpen = false">
  <h3 slot="header">Drawer Title</h3>
  <p>Drawer content goes here.</p>
</and-drawer>`;
}
