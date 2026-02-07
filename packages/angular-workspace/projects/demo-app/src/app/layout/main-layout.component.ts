import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  Router,
  RouterModule,
  NavigationEnd,
} from '@angular/router';
import { filter } from 'rxjs/operators';

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="app-container">
      <!-- Navbar -->
      <my-navbar
        [items]="navItems"
        [activeItem]="activeSection()"
        (navItemClick)="onNavItemClick($event)"
      >
        <span slot="brand">🎨 UI Components</span>
      </my-navbar>

      <div class="main-content">
        <!-- Sidebar (only show for components section) -->
        @if (activeSection() === 'components') {
          <my-sidebar
            [items]="componentItems"
            [activeItem]="activeComponent()"
            (sidebarItemClick)="onSidebarItemClick($event)"
          >
          </my-sidebar>
        }

        <!-- Content Area -->
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        height: 100vh;
        overflow: hidden;
      }

      .main-content {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      .content-area {
        flex: 1;
        overflow-y: auto;
        padding: 2rem;
        background: #f9fafb;
      }
    `,
  ],
})
export class MainLayoutComponent {
  navItems = [
    { id: 'components', label: 'Components' },
    { id: 'icons', label: 'Icons' },
  ];

  componentItems: SidebarItem[] = [
    { id: 'accordion', label: 'Accordion', icon: 'layers' },
    { id: 'alert', label: 'Alert', icon: 'info' },
    { id: 'badge', label: 'Badge', icon: 'star' },
    { id: 'button', label: 'Button', icon: 'box' },
    { id: 'card', label: 'Card', icon: 'layout' },
    { id: 'carousel', label: 'Carousel', icon: 'image' },
    { id: 'drawer', label: 'Drawer', icon: 'layout' },
    { id: 'dropdown', label: 'Dropdown', icon: 'chevron-down' },
    { id: 'input', label: 'Input', icon: 'file-text' },
    { id: 'modal', label: 'Modal', icon: 'layout' },
    { id: 'navbar', label: 'Navbar', icon: 'menu' },
    { id: 'pagination', label: 'Pagination', icon: 'list-ordered' },
    { id: 'sidebar', label: 'Sidebar', icon: 'menu' },
    { id: 'tabs', label: 'Tabs', icon: 'file-text' },
    { id: 'toast', label: 'Toast', icon: 'bell' },
    { id: 'tooltip', label: 'Tooltip', icon: 'message-square' },
  ];

  activeSection = signal<'components' | 'icons'>('components');
  activeComponent = signal<string>('accordion');

  constructor(private router: Router) {
    // Determine active section and component based on URL
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        if (url.includes('/icons')) {
          this.activeSection.set('icons');
        } else {
          this.activeSection.set('components');
          const componentId = url.split('/').pop();
          if (componentId && componentId !== 'components') {
            this.activeComponent.set(componentId);
          }
        }
      });
  }

  onNavItemClick(event: any) {
    const section = event.detail as 'components' | 'icons';
    this.activeSection.set(section);
    if (section === 'icons') {
      this.router.navigate(['/icons']);
    } else {
      this.router.navigate(['/components']);
    }
  }

  onSidebarItemClick(event: any) {
    const componentId = event.detail;
    this.activeComponent.set(componentId);
    this.router.navigate(['/components', componentId]);
  }
}
