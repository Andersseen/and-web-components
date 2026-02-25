import { Component, Host, h, Prop, Event, EventEmitter, Watch, Element, State, Listen } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { type IconName } from '@andersseen/icon';
import { createSidebar, type SidebarReturn, type SidebarItemDef } from '@andersseen/headless-components';

/* ────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────── */

export type SidebarItem = {
  id: string;
  label: string;
  icon?: IconName;
  disabled?: boolean;
  /** 'main' (default) or 'bottom' — bottom items render in the footer area */
  section?: 'main' | 'bottom';
};

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const sidebarVariants = cva('sidebar-root flex h-full flex-col transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border-r border-border',
      ghost: 'bg-transparent border-r border-transparent',
      filled: 'bg-muted border-r border-border',
      elevated: 'bg-background shadow-lg border-r-0',
      bordered: 'bg-background border-r-2 border-border',
      floating: 'bg-background shadow-xl border border-border rounded-xl m-2',
      glass: [
        'bg-background/60 border-r border-border/50',
        'backdrop-blur-xl',
      ].join(' '),
      minimal: 'bg-transparent border-r border-border/30',
    },
    collapsed: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    collapsed: false,
  },
});

const sidebarItemVariants = cva(
  [
    'sidebar-item flex w-full items-center gap-3 rounded-md text-sm font-medium',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'bg-transparent border-none cursor-pointer text-left',
  ].join(' '),
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground font-semibold',
        false: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
      },
      collapsed: {
        true: 'justify-center px-2 py-3 sm:py-2',
        false: 'px-3 py-3 sm:py-2',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none cursor-default',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
      disabled: false,
    },
  },
);

export type SidebarVariantProps = VariantProps<typeof sidebarVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-sidebar',
  styleUrls: ['and-sidebar.css', '../../global/global.css'],
  shadow: true,
})
export class AndSidebar {
  private sidebar: SidebarReturn;
  private itemElements = new Map<string, HTMLElement>();
  private resizeObserver?: ResizeObserver;

  @Element() el: HTMLElement;

  /* ── Props ──────────────────────────────────────────────────────── */

  /** The active navigation item ID. */
  @Prop({ mutable: true, reflect: true }) activeItem: string = 'home';

  /**
   * Navigation items to display.
   * Items with `section: 'bottom'` render in the footer area.
   */
  @Prop() items: SidebarItem[] | string = [];

  /** Whether the sidebar is collapsed (desktop). */
  @Prop({ mutable: true, reflect: true }) collapsed: boolean = false;

  /** Visual variant of the sidebar. */
  @Prop({ reflect: true }) variant: SidebarVariantProps['variant'] = 'default';

  /**
   * Enable auto-collapse on mobile viewports.
   * When true, the sidebar collapses to icon-only mode on screens
   * smaller than `mobileBreakpoint`.
   * @default true
   */
  @Prop() mobileCollapse: boolean = true;

  /**
   * Breakpoint (px) below which the sidebar auto-collapses on mobile.
   * @default 768
   */
  @Prop() mobileBreakpoint: number = 768;

  /**
   * Expanded width of the sidebar.
   * Accepts any CSS value.
   * @default '16rem'
   */
  @Prop() expandedWidth: string = '16rem';

  /**
   * Collapsed width of the sidebar.
   * Accepts any CSS value.
   * @default '4rem'
   */
  @Prop() collapsedWidth: string = '4rem';

  /**
   * ARIA label for the navigation
   */
  @Prop() ariaNavLabel: string = 'Sidebar navigation';

  /* ── Events ─────────────────────────────────────────────────────── */

  /** Emitted when a navigation item is clicked. */
  @Event({ bubbles: true, composed: true }) andSidebarItemClick: EventEmitter<string>;

  /** Emitted when the sidebar collapse state changes. */
  @Event({ bubbles: true, composed: true }) andSidebarToggle: EventEmitter<boolean>;

  /* ── State ──────────────────────────────────────────────────────── */

  @State() isMobile: boolean = false;

  /* ── Parsed items (handle string JSON from HTML attributes) ───── */

  private get parsedItems(): SidebarItem[] {
    if (typeof this.items === 'string') {
      try {
        return JSON.parse(this.items);
      } catch {
        return [];
      }
    }
    return this.items ?? [];
  }

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    const items = this.parsedItems;
    const headlessItems: SidebarItemDef[] = items.map(i => ({
      id: i.id,
      label: i.label,
      icon: i.icon,
      disabled: i.disabled,
      section: i.section,
    }));

    this.sidebar = createSidebar({
      items: headlessItems,
      defaultActiveItem: this.activeItem,
      onActiveItemChange: (id: string) => {
        this.activeItem = id;
        this.andSidebarItemClick.emit(id);
      },
      defaultCollapsed: this.collapsed,
      onCollapsedChange: (isCollapsed: boolean) => {
        this.collapsed = isCollapsed;
        this.andSidebarToggle.emit(isCollapsed);
      },
      mobileCollapse: this.mobileCollapse,
      ariaLabel: this.ariaNavLabel,
    });
  }

  componentDidLoad() {
    if (this.mobileCollapse) {
      this.setupMobileDetection();
    }
  }

  disconnectedCallback() {
    this.teardownMobileDetection();
  }

  /* ── Mobile auto-collapse ───────────────────────────────────────── */

  private setupMobileDetection() {
    this.checkMobile();

    if (typeof window !== 'undefined' && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => {
        this.checkMobile();
      });
      this.resizeObserver.observe(document.documentElement);
    }
  }

  private teardownMobileDetection() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = undefined;
    }
  }

  private checkMobile() {
    if (typeof window === 'undefined') return;
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < this.mobileBreakpoint;

    if (this.isMobile !== wasMobile) {
      this.sidebar.actions.setMobileCollapsed(this.isMobile);
    }
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('activeItem')
  activeItemChanged(newValue: string) {
    if (this.sidebar && this.sidebar.state.activeItem !== newValue) {
      this.sidebar.actions.setActiveItem(newValue);
    }
  }

  @Watch('collapsed')
  collapsedChanged(newValue: boolean) {
    this.sidebar.actions.setCollapsed(newValue);
  }

  @Watch('items')
  handleItemsChange() {
    const items = this.parsedItems;
    this.sidebar.actions.setItems(
      items.map(i => ({
        id: i.id,
        label: i.label,
        icon: i.icon,
        disabled: i.disabled,
        section: i.section,
      })),
    );
  }

  /* ── Keyboard listener ──────────────────────────────────────────── */

  @Listen('keydown')
  handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const itemId = target?.getAttribute('data-item-id');
    if (itemId) {
      this.sidebar.handleItemKeyDown(event, itemId);

      // Move DOM focus to the newly active item
      const newActive = this.sidebar.state.activeItem;
      if (newActive !== itemId) {
        const el = this.itemElements.get(newActive);
        el?.focus();
      }
    }
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleToggle = () => {
    this.sidebar.actions.toggleCollapse();
  };

  private handleItemClick = (item: SidebarItem) => {
    if (item.disabled) return;
    this.sidebar.actions.setActiveItem(item.id);
  };

  private registerItemRef = (id: string, el: HTMLElement | undefined) => {
    if (el) {
      this.itemElements.set(id, el);
    }
  };

  /* ── Effective collapsed check (considers mobile) ───────────────── */

  private get effectiveCollapsed(): boolean {
    return this.collapsed || (this.mobileCollapse && this.isMobile);
  }

  /* ── Render helpers ─────────────────────────────────────────────── */

  private renderItem(item: SidebarItem) {
    const itemProps = this.sidebar.getItemProps(item.id);
    const isActive = this.sidebar.queries.isActive(item.id);
    const isDisabled = item.disabled ?? false;
    const isCollapsed = this.effectiveCollapsed;

    return (
      <button
        key={item.id}
        ref={el => this.registerItemRef(item.id, el)}
        role={itemProps.role}
        aria-current={itemProps['aria-current']}
        aria-disabled={itemProps['aria-disabled']}
        data-active={itemProps['data-active']}
        data-state={itemProps['data-state']}
        data-item-id={item.id}
        tabindex={itemProps.tabindex}
        id={itemProps.id}
        class={cn(
          sidebarItemVariants({ active: isActive, collapsed: isCollapsed, disabled: isDisabled }),
        )}
        onClick={() => this.handleItemClick(item)}
        title={isCollapsed ? item.label : undefined}
      >
        {item.icon && (
          <span class="item-icon">
            <and-icon name={item.icon} class="sidebar-icon" />
          </span>
        )}
        {!isCollapsed && <span class="item-label">{item.label}</span>}
      </button>
    );
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    if (!this.sidebar) {
      return <Host><div style={{padding: '1rem', background: 'red', color: 'white'}}>Sidebar: headless not initialized</div></Host>;
    }

    const containerProps = this.sidebar.getContainerProps();
    const toggleProps = this.sidebar.getToggleProps();
    const isCollapsed = this.effectiveCollapsed;
    const items = this.parsedItems;
    const mainItems = items.filter(i => (i.section ?? 'main') === 'main');
    const bottomItems = items.filter(i => i.section === 'bottom');

    const hostStyle: Record<string, string> = {
      '--sidebar-width': isCollapsed ? this.collapsedWidth : this.expandedWidth,
      '--sidebar-collapsed-width': this.collapsedWidth,
      '--sidebar-expanded-width': this.expandedWidth,
    };

    return (
      <Host
        role={containerProps.role}
        aria-label={containerProps['aria-label']}
        data-collapsed={isCollapsed}
        data-mobile-collapsed={this.isMobile && this.mobileCollapse}
        style={hostStyle}
      >
        <aside
          class={cn(sidebarVariants({ variant: this.variant, collapsed: isCollapsed }))}
        >
          {/* ── Header ──────────────────────────────────────────── */}
          <div class="sidebar-header">
            <slot name="header">
              {!isCollapsed && <span class="sidebar-title">Navigation</span>}
            </slot>
            <button
              aria-expanded={toggleProps['aria-expanded']}
              aria-label={toggleProps['aria-label']}
              data-collapsed={toggleProps['data-collapsed']}
              class="sidebar-toggle"
              onClick={this.handleToggle}
            >
              <and-icon
                name={isCollapsed ? 'chevron-right' : 'chevron-left'}
                class="toggle-icon"
              />
            </button>
          </div>

          {/* ── Top slot (above nav, e.g. search, user info) ────── */}
          <div class={cn('sidebar-top-slot', isCollapsed && 'sidebar-top-slot--collapsed')}>
            <slot name="top" />
          </div>

          {/* ── Main navigation ─────────────────────────────────── */}
          <nav
            class="sidebar-nav"
            role={this.sidebar.getNavListProps('main').role}
            aria-label={this.sidebar.getNavListProps('main')['aria-label']}
          >
            {mainItems.map(item => this.renderItem(item))}
            {/* Slot for custom main nav content */}
            <slot name="nav" />
          </nav>

          {/* ── Spacer pushes bottom content down ── */}
          <div class="sidebar-spacer" />

          {/* ── Bottom section (settings, user, etc.) ────────────── */}
          {(bottomItems.length > 0) && (
            <div class="sidebar-bottom-nav">
              <nav
                role={this.sidebar.getNavListProps('bottom').role}
                aria-label={this.sidebar.getNavListProps('bottom')['aria-label']}
              >
                {bottomItems.map(item => this.renderItem(item))}
              </nav>
            </div>
          )}

          {/* ── Footer slot (fully custom bottom area) ────────────── */}
          <div class={cn('sidebar-footer', isCollapsed && 'sidebar-footer--collapsed')}>
            <slot name="footer" />
          </div>
        </aside>
      </Host>
    );
  }
}
