import {
  AndButton,
  AndDropdown,
  AndIcon,
  AndNavbar,
  AndSidebar,
} from '@angular-components/stencil-generated/components';
import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, AndNavbar, AndSidebar, AndDropdown, AndButton, AndIcon],
  schemas: [],
  template: `
    <div class="app-container" and-layout="vertical">
      <!-- Navbar -->
      <and-navbar
        class="bg-background"
        [items]="navItems"
        [activeItem]="activeSection()"
        (navItemClick)="onNavItemClick($event)"
      >
        <span slot="brand">
          <and-icon name="layout"></and-icon>
          And Web Components UI
        </span>

        <div
          slot="actions"
          style="display: flex; align-items: center; gap: 1rem;"
        >
          <!-- Theme Preset -->
          <div style="width: 140px;">
            <and-dropdown
              label="Theme"
              [items]="themeOptions"
              (andDropdownSelect)="onThemeSelect($event)"
            ></and-dropdown>
          </div>

          <!-- Color Palette -->
          <div style="width: 140px;">
            <and-dropdown
              label="Color"
              [items]="colorOptions"
              (andDropdownSelect)="onColorSelect($event)"
            ></and-dropdown>
          </div>

          <!-- Dark Mode Toggle -->
          <and-button
            variant="ghost"
            size="icon"
            (click)="toggleDarkMode()"
            title="Toggle Dark Mode"
          >
            <and-icon [name]="isDark() ? 'sun' : 'moon'"></and-icon>
          </and-button>

          <and-button
            variant="outline"
            size="sm"
            onclick="window.open('https://github.com', '_blank')"
          >
            GitHub
          </and-button>
        </div>
      </and-navbar>

      <div class="main-content" and-layout="horizontal">
        @if (activeSection() === 'components') {
          <and-sidebar
            class="bg-background"
            [items]="componentItems"
            [activeItem]="activeComponent()"
            (andSidebarItemClick)="onSidebarItemClick($event)"
          >
          </and-sidebar>
        }
        @if (activeSection() === 'headless') {
          <and-sidebar
            class="bg-background"
            [items]="headlessItems"
            [activeItem]="activeHeadless()"
            (andSidebarItemClick)="onHeadlessSidebarItemClick($event)"
          >
          </and-sidebar>
        }
        @if (activeSection() === 'motion') {
          <and-sidebar
            class="bg-background"
            [items]="motionItems"
            [activeItem]="activeMotion()"
            (andSidebarItemClick)="onMotionItemClick($event)"
          >
          </and-sidebar>
        }
        @if (activeSection() === 'layout') {
          <and-sidebar
            class="bg-background"
            [items]="layoutItems"
            [activeItem]="activeLayout()"
            (andSidebarItemClick)="onLayoutItemClick($event)"
          >
          </and-sidebar>
        }

        <!-- Content Area -->
        <div class="content-area" and-layout="p:xl">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        height: 100vh;
        overflow: hidden;
        background-color: var(--background);
        color: var(--foreground);
      }

      .main-content {
        flex: 1;
        overflow: hidden;
      }

      .content-area {
        flex: 1;
        overflow-y: auto;
        background: var(--background);
        color: var(--foreground);
      }
    `,
  ],
})
export class MainLayoutComponent {
  navItems = [
    { id: 'components', label: 'Components' },
    { id: 'headless', label: 'Headless' },
    { id: 'icons', label: 'Icons' },
    { id: 'motion', label: 'Motion' },
    { id: 'layout', label: 'Layout' },
  ];

  componentItems: SidebarItem[] = [
    { id: 'accordion', label: 'Accordion', icon: 'layers' },
    { id: 'alert', label: 'Alert', icon: 'alert-circle' },
    { id: 'badge', label: 'Badge', icon: 'award' },
    { id: 'breadcrumb', label: 'Breadcrumb', icon: 'chevrons-right' },
    { id: 'button', label: 'Button', icon: 'circle-dot' },
    { id: 'card', label: 'Card', icon: 'credit-card' },
    { id: 'carousel', label: 'Carousel', icon: 'gallery' },
    { id: 'context-menu', label: 'Context Menu', icon: 'mouse-pointer-click' },
    { id: 'drawer', label: 'Drawer', icon: 'panel-left' },
    { id: 'dropdown', label: 'Dropdown', icon: 'chevron-down' },
    { id: 'input', label: 'Input', icon: 'text-cursor' },
    { id: 'menu-list', label: 'Menu List', icon: 'list' },
    { id: 'modal', label: 'Modal', icon: 'app-window' },
    { id: 'navbar', label: 'Navbar', icon: 'panel-top' },
    { id: 'pagination', label: 'Pagination', icon: 'list-ordered' },
    { id: 'sidebar', label: 'Sidebar', icon: 'panel-left-open' },
    { id: 'tabs', label: 'Tabs', icon: 'folder-open' },
    { id: 'toast', label: 'Toast', icon: 'bell' },
    { id: 'tooltip', label: 'Tooltip', icon: 'message-square' },
  ];

  headlessItems: SidebarItem[] = [
    { id: 'overview', label: 'Overview', icon: 'compass' },
    { id: 'button', label: 'Button', icon: 'circle-dot' },
    { id: 'dropdown', label: 'Dropdown', icon: 'chevron-down' },
    { id: 'tabs', label: 'Tabs', icon: 'folder-open' },
    { id: 'accordion', label: 'Accordion', icon: 'layers' },
    { id: 'modal', label: 'Modal', icon: 'app-window' },
    { id: 'navbar', label: 'Navbar', icon: 'panel-top' },
    { id: 'sidebar', label: 'Sidebar', icon: 'panel-left-open' },
    { id: 'tooltip', label: 'Tooltip', icon: 'message-square' },
    { id: 'toast', label: 'Toast', icon: 'bell' },
    { id: 'drawer', label: 'Drawer', icon: 'panel-left' },
    { id: 'alert', label: 'Alert', icon: 'alert-circle' },
  ];
  motionItems: SidebarItem[] = [
    { id: 'attribute', label: 'Attribute API', icon: 'code' },
  ];

  layoutItems: SidebarItem[] = [
    { id: 'overview', label: 'Overview', icon: 'compass' },
    { id: 'flex', label: 'Flexbox', icon: 'columns' },
    { id: 'grid', label: 'Grid', icon: 'layout' },
    { id: 'spacing', label: 'Spacing', icon: 'move' },
    { id: 'typography', label: 'Typography', icon: 'type' },
    { id: 'responsive', label: 'Responsive', icon: 'monitor' },
  ];

  themeOptions = [
    { text: 'Modern', value: 'default' },
    { text: 'Compact', value: 'compact' },
    { text: 'Playful', value: 'playful' },
    { text: 'Retro', value: 'retro' },
    { text: 'Elegant', value: 'elegant' },
  ];

  colorOptions = [
    { text: 'Indigo & Rose', value: 'indigo-rose' },
    { text: 'Slate & Amber', value: 'slate-amber' },
    { text: 'Emerald & Orange', value: 'emerald-orange' },
    { text: 'Violet & Cyan', value: 'violet-cyan' },
    { text: 'Rose & Teal', value: 'rose-teal' },
  ];

  activeComponent = signal<string>('accordion');
  activeHeadless = signal<string>('overview');
  activeSection = signal<
    'components' | 'icons' | 'themes' | 'headless' | 'motion' | 'layout'
  >('components');

  activeMotion = signal<string>('attribute');
  activeLayout = signal<string>('overview');
  isDark = signal<boolean>(false);

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const url = event.urlAfterRedirects;
        if (url.includes('/icons')) {
          this.activeSection.set('icons');
        } else if (url.includes('/headless')) {
          this.activeSection.set('headless');
        } else if (url.includes('/themes')) {
          this.activeSection.set('themes');
        } else if (url.includes('/motion')) {
          this.activeSection.set('motion');
          const motionId = url.split('/').pop();
          if (motionId && motionId !== 'motion') {
            this.activeMotion.set(motionId);
          }
        } else if (url.includes('/layout')) {
          this.activeSection.set('layout');
          const layoutId = url.split('/').pop();
          if (layoutId && layoutId !== 'layout') {
            this.activeLayout.set(layoutId);
          }
        } else {
          this.activeSection.set('components');
          const componentId = url.split('/').pop();
          if (componentId && componentId !== 'components') {
            this.activeComponent.set(componentId);
          }
        }
      });

    // Initialize theme if needed
    document.documentElement.setAttribute('data-color', 'indigo-rose');
  }

  onNavItemClick(event: any) {
    const section = event.detail as
      | 'components'
      | 'icons'
      | 'headless'
      | 'themes'
      | 'motion'
      | 'layout';
    this.activeSection.set(section);
    if (section === 'icons') {
      this.router.navigate(['/icons']);
    } else if (section === 'headless') {
      this.router.navigate(['/headless']);
    } else if (section === 'themes') {
      this.router.navigate(['/themes']);
    } else if (section === 'motion') {
      this.router.navigate(['/motion']);
    } else if (section === 'layout') {
      this.router.navigate(['/layout']);
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

  onHeadlessSidebarItemClick(event: any) {
    const headlessId = event.detail;
    this.activeHeadless.set(headlessId);
    this.router.navigate(['/headless', headlessId]);
  }

  onMotionItemClick(event: any) {
    const motionId = event.detail;
    this.activeMotion.set(motionId);
    this.router.navigate(['/motion', motionId]);
  }

  onLayoutItemClick(event: any) {
    const layoutId = event.detail;
    this.activeLayout.set(layoutId);
    this.router.navigate(['/layout', layoutId]);
  }
}
