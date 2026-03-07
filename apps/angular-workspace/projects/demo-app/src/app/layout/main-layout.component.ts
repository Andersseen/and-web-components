import {
  AndButton,
  AndDropdown,
  AndIcon,
  AndNavbar,
  AndSidebar,
} from '@angular-components/stencil-generated/components';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
}

type Section =
  | 'components'
  | 'icons'
  | 'themes'
  | 'headless'
  | 'motion'
  | 'layout';

interface SidebarConfig {
  items: SidebarItem[];
  active: WritableSignal<string>;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    AndNavbar,
    AndSidebar,
    AndDropdown,
    AndButton,
    AndIcon,
  ],
  template: `
    <div class="app-container" and-layout="vertical">
      <and-navbar
        class="bg-background"
        [items]="navItems"
        [activeItem]="activeSection()"
        (navItemClick)="onNavItemClick($event)"
      >
        <span
          slot="start"
          style="display: flex; align-items: center; gap: 0.5rem;"
        >
          <and-icon name="layout"></and-icon>
          And Web Components UI
        </span>

        <div slot="end" style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 140px;">
            <and-dropdown
              label="Theme"
              [items]="themeOptions"
              (andDropdownSelect)="onThemeSelect($event)"
            />
          </div>

          <div style="width: 140px;">
            <and-dropdown
              label="Color"
              [items]="colorOptions"
              (andDropdownSelect)="onColorSelect($event)"
            />
          </div>

          <and-button
            variant="ghost"
            size="icon"
            (click)="toggleDarkMode()"
            title="Toggle Dark Mode"
          >
            <and-icon [name]="isDark() ? 'sun' : 'moon'" />
          </and-button>

          <and-button
            size="sm"
            variant="link"
            href="https://libs.andersseen.dev"
          >
            <and-icon name="app-window" size="16" />
            Home
          </and-button>
          <and-button
            size="sm"
            variant="link"
            href="https://github.com/Andersseen/and-web-components"
            target="_blank"
          >
            <and-icon name="github" size="16" />
            GitHub
          </and-button>
        </div>
      </and-navbar>

      <div class="main-content" and-layout="horizontal">
        @switch (activeSection()) {
          @case ('components') {
            <and-sidebar
              class="bg-background"
              [items]="componentItems"
              [activeItem]="activeComponent()"
              (andSidebarItemClick)="onSidebarItemClick($event)"
            />
          }
          @case ('headless') {
            <and-sidebar
              class="bg-background"
              [items]="headlessItems"
              [activeItem]="activeHeadless()"
              (andSidebarItemClick)="onSidebarItemClick($event)"
            />
          }
          @case ('motion') {
            <and-sidebar
              class="bg-background"
              [items]="motionItems"
              [activeItem]="activeMotion()"
              (andSidebarItemClick)="onSidebarItemClick($event)"
            />
          }
          @case ('layout') {
            <and-sidebar
              class="bg-background"
              [items]="layoutItems"
              [activeItem]="activeLayout()"
              (andSidebarItemClick)="onSidebarItemClick($event)"
            />
          }
        }

        <div class="content-area" and-layout="p:xl">
          <router-outlet />
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
  private readonly router = inject(Router);

  // ── Navigation ──
  readonly navItems = [
    { id: 'components', label: 'Components' },
    { id: 'headless', label: 'Headless' },
    { id: 'icons', label: 'Icons' },
    { id: 'motion', label: 'Motion' },
    { id: 'layout', label: 'Layout' },
  ];

  // ── Sidebar items ──
  readonly componentItems: SidebarItem[] = [
    { id: 'accordion', label: 'Accordion', icon: 'layers' },
    { id: 'alert', label: 'Alert', icon: 'alert-circle' },
    { id: 'badge', label: 'Badge', icon: 'award' },
    { id: 'breadcrumb', label: 'Breadcrumb', icon: 'chevron-right' },
    { id: 'button', label: 'Button', icon: 'circle-dot' },
    { id: 'card', label: 'Card', icon: 'credit-card' },
    { id: 'carousel', label: 'Carousel', icon: 'gallery' },
    { id: 'context-menu', label: 'Context Menu', icon: 'mouse-pointer' },
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

  readonly headlessItems: SidebarItem[] = [
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
    { id: 'breadcrumb', label: 'Breadcrumb', icon: 'chevron-right' },
    { id: 'menu-list', label: 'Menu List', icon: 'list' },
    { id: 'context-menu', label: 'Context Menu', icon: 'mouse-pointer' },
  ];

  readonly motionItems: SidebarItem[] = [
    { id: 'attribute', label: 'Overview', icon: 'code' },
    { id: 'attention-seekers', label: 'Attention Seekers', icon: 'zap' },
    { id: 'fading', label: 'Fading', icon: 'eye' },
    { id: 'sliding', label: 'Sliding', icon: 'arrow-right' },
    { id: 'zooming', label: 'Zooming', icon: 'search' },
    { id: 'bouncing', label: 'Bouncing', icon: 'circle' },
    { id: 'flippers', label: 'Flippers', icon: 'rotate-cw' },
    { id: 'rotating', label: 'Rotating', icon: 'refresh-cw' },
    { id: 'lightspeed', label: 'Light Speed', icon: 'zap' },
    { id: 'back', label: 'Back', icon: 'skip-back' },
    { id: 'specials', label: 'Specials', icon: 'star' },
  ];

  readonly layoutItems: SidebarItem[] = [
    { id: 'overview', label: 'Overview', icon: 'compass' },
    { id: 'flex', label: 'Flexbox', icon: 'columns' },
    { id: 'grid', label: 'Grid', icon: 'layout' },
    { id: 'spacing', label: 'Spacing', icon: 'move' },
    { id: 'typography', label: 'Typography', icon: 'type' },
    { id: 'responsive', label: 'Responsive', icon: 'monitor' },
  ];

  // ── Theme / Color options ──
  readonly themeOptions = [
    { text: 'Modern', value: 'default' },
    { text: 'Compact', value: 'compact' },
    { text: 'Playful', value: 'playful' },
    { text: 'Retro', value: 'retro' },
    { text: 'Elegant', value: 'elegant' },
  ];

  readonly colorOptions = [
    { text: 'Indigo & Rose', value: 'indigo-rose' },
    { text: 'Slate & Amber', value: 'slate-amber' },
    { text: 'Emerald & Orange', value: 'emerald-orange' },
    { text: 'Violet & Cyan', value: 'violet-cyan' },
    { text: 'Rose & Teal', value: 'rose-teal' },
  ];

  // ── State ──
  readonly activeSection = signal<Section>('components');
  readonly activeComponent = signal('accordion');
  readonly activeHeadless = signal('overview');
  readonly activeMotion = signal('attribute');
  readonly activeLayout = signal('overview');
  readonly isDark = signal(false);

  // ── Config maps (eliminates if/else chains) ──
  private readonly sectionRoutes: Record<Section, string> = {
    components: '/components',
    headless: '/headless',
    icons: '/icons',
    themes: '/themes',
    motion: '/motion',
    layout: '/layout',
  };

  private readonly sidebarConfig: Partial<Record<Section, SidebarConfig>> = {
    components: {
      items: this.componentItems,
      active: this.activeComponent,
      route: '/components',
    },
    headless: {
      items: this.headlessItems,
      active: this.activeHeadless,
      route: '/headless',
    },
    motion: {
      items: this.motionItems,
      active: this.activeMotion,
      route: '/motion',
    },
    layout: {
      items: this.layoutItems,
      active: this.activeLayout,
      route: '/layout',
    },
  };

  private readonly sections = Object.keys(this.sectionRoutes) as Section[];

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(({ urlAfterRedirects: url }) => {
        const section =
          this.sections.find((s) => url.includes(`/${s}`)) ?? 'components';
        this.activeSection.set(section);

        const config = this.sidebarConfig[section];
        const id = url.split('/').pop();
        if (config && id && id !== section) {
          config.active.set(id);
        }
      });

    document.documentElement.setAttribute('data-color', 'indigo-rose');
  }

  onNavItemClick(event: any) {
    const section = event.detail as Section;
    this.activeSection.set(section);
    this.router.navigate([this.sectionRoutes[section]]);
  }

  onSidebarItemClick(event: any) {
    const config = this.sidebarConfig[this.activeSection()];
    if (!config) return;
    const id = event.detail;
    config.active.set(id);
    this.router.navigate([config.route, id]);
  }

  onThemeSelect(event: any) {
    document.documentElement.setAttribute('data-theme', event.detail);
  }

  onColorSelect(event: any) {
    document.documentElement.setAttribute('data-color', event.detail);
  }

  toggleDarkMode() {
    this.isDark.update((d) => !d);
    document.documentElement.classList.toggle('dark', this.isDark());
  }
}
