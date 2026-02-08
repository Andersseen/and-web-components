import {
  MyNavbar,
  MySidebar,
  MyDropdown,
  MyButton,
  MyIcon,
} from '@angular-components/stencil-generated/components';
import { Component, signal, effect } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, MyNavbar, MySidebar, MyDropdown, MyButton, MyIcon],
  schemas: [],
  template: `
    <div class="app-container">
      <!-- Navbar -->
      <my-navbar
        class="bg-background"
        [items]="navItems"
        [activeItem]="activeSection()"
        (navItemClick)="onNavItemClick($event)"
      >
        <span slot="brand">
          <my-icon name="layout"></my-icon>
          And Web Components UI
        </span>

        <div
          slot="actions"
          style="display: flex; align-items: center; gap: 1rem;"
        >
          <!-- Theme Preset -->
          <div style="width: 140px;">
            <my-dropdown
              label="Theme"
              [items]="themeOptions"
              (dropdownSelect)="onThemeSelect($event)"
            ></my-dropdown>
          </div>

          <!-- Color Palette -->
          <div style="width: 140px;">
            <my-dropdown
              label="Color"
              [items]="colorOptions"
              (dropdownSelect)="onColorSelect($event)"
            ></my-dropdown>
          </div>

          <!-- Dark Mode Toggle -->
          <my-button
            variant="ghost"
            size="icon"
            (click)="toggleDarkMode()"
            title="Toggle Dark Mode"
          >
            <my-icon [name]="isDark() ? 'sun' : 'moon'"></my-icon>
          </my-button>

          <my-button
            variant="outline"
            size="sm"
            onclick="window.open('https://github.com', '_blank')"
          >
            GitHub
          </my-button>
        </div>
      </my-navbar>

      <div class="main-content">
        @if (activeSection() === 'components') {
          <my-sidebar
            class="bg-background"
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
        background-color: var(--background);
        color: var(--foreground);
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
        background: var(--background);
        color: var(--foreground);
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
    { id: 'pagination', label: 'Pagination', icon: 'list-ordered' },
    { id: 'tabs', label: 'Tabs', icon: 'file-text' },
    { id: 'toast', label: 'Toast', icon: 'bell' },
    { id: 'tooltip', label: 'Tooltip', icon: 'message-square' },
  ];

  themeOptions = [
    { text: 'Modern', value: 'default' },
    { text: 'Compact', value: 'compact' },
    { text: 'Playful', value: 'playful' },
    { text: 'Retro', value: 'retro' },
    { text: 'Elegant', value: 'elegant' },
  ];

  colorOptions = [
    { text: 'Neutral', value: 'zinc' },
    { text: 'Rose', value: 'rose' },
    { text: 'Sky', value: 'sky' },
    { text: 'Emerald', value: 'emerald' },
    { text: 'Amber', value: 'amber' },
  ];

  activeSection = signal<'components' | 'icons' | 'themes'>('components');
  activeComponent = signal<string>('accordion');
  isDark = signal<boolean>(false);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        if (url.includes('/icons')) {
          this.activeSection.set('icons');
        } else if (url.includes('/themes')) {
          this.activeSection.set('themes');
        } else {
          this.activeSection.set('components');
          const componentId = url.split('/').pop();
          if (componentId && componentId !== 'components') {
            this.activeComponent.set(componentId);
          }
        }
      });

    // Initialize theme if needed
    document.documentElement.setAttribute('data-color', 'zinc');
  }

  onNavItemClick(event: any) {
    const section = event.detail as 'components' | 'icons' | 'themes';
    this.activeSection.set(section);
    if (section === 'icons') {
      this.router.navigate(['/icons']);
    } else if (section === 'themes') {
      this.router.navigate(['/themes']);
    } else {
      this.router.navigate(['/components']);
    }
  }

  onThemeSelect(event: any) {
    const theme = event.detail;
    document.documentElement.setAttribute('data-theme', theme);
  }

  onColorSelect(event: any) {
    const color = event.detail;
    document.documentElement.setAttribute('data-color', color);
  }

  toggleDarkMode() {
    this.isDark.update((d) => !d);
    if (this.isDark()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  onSidebarItemClick(event: any) {
    const componentId = event.detail;
    this.activeComponent.set(componentId);
    this.router.navigate(['/components', componentId]);
  }
}
