import { AndIcon, AndNavbar, AndSidebar } from '@angular-components/stencil-generated/components';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  COLOR_OPTIONS,
  COMPONENT_ITEMS,
  HEADLESS_ITEMS,
  LAYOUT_ITEMS,
  MOTION_ITEMS,
  NAV_ITEMS,
  type Section,
  type SidebarItem,
  THEME_OPTIONS,
} from './navigation.data';
import { NavbarDesktopActionsComponent } from './navbar-desktop-actions.component';
import { NavbarMobileActionsComponent } from './navbar-mobile-actions.component';

interface SidebarConfig {
  items: SidebarItem[];
  active: WritableSignal<string>;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, AndNavbar, AndSidebar, AndIcon, NavbarDesktopActionsComponent, NavbarMobileActionsComponent],
  template: `
    <div class="h-screen overflow-hidden bg-background text-foreground" and-layout="vertical">
      <and-navbar
        class="bg-background"
        style="--navbar-max-width: 100%; --navbar-px: 0.5rem; --navbar-px-sm: 0.75rem; --navbar-px-lg: 1rem"
        [items]="navItems"
        [activeItem]="activeSection()"
        [autoCollapse]="false"
        [compactBreakpoint]="0"
        [minimalBreakpoint]="0"
        [mobileBreakpoint]="760"
        (navItemClick)="onNavItemClick($event)"
      >
        <span slot="start" class="flex min-w-0 items-center gap-2">
          <and-icon name="layout"></and-icon>
          <span class="whitespace-nowrap font-semibold max-[1180px]:hidden">And Web Components UI</span>
        </span>

        <app-navbar-desktop-actions
          slot="end"
          [themeOptions]="themeOptions"
          [colorOptions]="colorOptions"
          [currentTheme]="currentTheme()"
          [currentColor]="currentColor()"
          [isDark]="isDark()"
          (themeSelect)="applyTheme($event)"
          (colorSelect)="applyColor($event)"
          (darkModeToggle)="toggleDarkMode()"
        />

        <app-navbar-mobile-actions
          slot="mobile-actions"
          [themeOptions]="themeOptions"
          [colorOptions]="colorOptions"
          [currentTheme]="currentTheme()"
          [currentColor]="currentColor()"
          (themeSelect)="applyTheme($event)"
          (colorSelect)="applyColor($event)"
        />
      </and-navbar>

      <div class="flex-1 overflow-hidden" and-layout="horizontal">
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

        <div class="flex-1 overflow-y-auto bg-background text-foreground" and-layout="p:xl">
          <router-outlet />
        </div>
      </div>
    </div>
  `,
})
export class MainLayoutComponent {
  private readonly router = inject(Router);

  // ── Navigation ──
  readonly navItems = NAV_ITEMS;

  // ── Sidebar items ──
  readonly componentItems: SidebarItem[] = COMPONENT_ITEMS;

  readonly headlessItems: SidebarItem[] = HEADLESS_ITEMS;

  readonly motionItems: SidebarItem[] = MOTION_ITEMS;

  readonly layoutItems: SidebarItem[] = LAYOUT_ITEMS;

  // ── Theme / Color options ──
  readonly themeOptions = THEME_OPTIONS;

  readonly colorOptions = COLOR_OPTIONS;

  // ── State ──
  readonly activeSection = signal<Section>('components');
  readonly activeComponent = signal('accordion');
  readonly activeHeadless = signal('overview');
  readonly activeMotion = signal('attribute');
  readonly activeLayout = signal('overview');
  readonly currentTheme = signal('default');
  readonly currentColor = signal('indigo-rose');
  readonly isDark = signal(false);

  // ── Config maps (eliminates if/else chains) ──
  private readonly sectionRoutes: Record<Section, string> = {
    components: '/components',
    headless: '/headless',
    icons: '/icons',
    themes: '/themes',
    motion: '/motion',
    layout: '/layout',
    docs: '/docs',
    vanilla: '/vanilla',
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
        const section = this.sections.find(s => url.includes(`/${s}`)) ?? 'components';
        this.activeSection.set(section);

        const config = this.sidebarConfig[section];
        const id = url.split('/').pop();
        if (config && id && id !== section) {
          config.active.set(id);
        }
      });

    const currentThemeAttr = document.documentElement.getAttribute('data-theme') || 'default';
    const currentColorAttr = document.documentElement.getAttribute('data-color') || 'indigo-rose';

    this.currentTheme.set(currentThemeAttr);
    this.currentColor.set(currentColorAttr);

    document.documentElement.setAttribute('data-theme', currentThemeAttr);
    document.documentElement.setAttribute('data-color', currentColorAttr);
  }

  onNavItemClick(event: CustomEvent<unknown>) {
    const section = event.detail;
    if (!this.isSection(section)) return;
    this.activeSection.set(section);
    this.router.navigate([this.sectionRoutes[section]]);
  }

  onSidebarItemClick(event: CustomEvent<unknown>) {
    const config = this.sidebarConfig[this.activeSection()];
    if (!config) return;
    if (typeof event.detail !== 'string' || event.detail.length === 0) return;
    const id = event.detail;
    config.active.set(id);
    this.router.navigate([config.route, id]);
  }

  applyTheme(theme: string) {
    if (theme.length === 0) return;
    this.currentTheme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  applyColor(color: string) {
    if (color.length === 0) return;
    this.currentColor.set(color);
    document.documentElement.setAttribute('data-color', color);
  }

  toggleDarkMode() {
    this.isDark.update(d => !d);
    document.documentElement.classList.toggle('dark', this.isDark());
  }

  private isSection(value: unknown): value is Section {
    return typeof value === 'string' && this.sections.includes(value as Section);
  }
}
