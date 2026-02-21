import { Component, Host, h, Prop, Event, EventEmitter, Watch } from '@stencil/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { type IconName } from '@andersseen/icon';
import { createSidebar, type SidebarReturn } from '@andersseen/headless-components';

/* ────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────── */

export type SidebarItem = {
  id: string;
  label: string;
  icon?: IconName;
};

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const sidebarVariants = cva('flex h-full flex-col border-r transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border-border',
      ghost: 'bg-transparent border-transparent',
    },
    collapsed: {
      true: 'w-16',
      false: 'w-64',
    },
  },
  defaultVariants: {
    variant: 'default',
    collapsed: false,
  },
});

const sidebarItemVariants = cva(
  [
    'flex w-full items-center gap-3 rounded-md text-sm font-medium',
    'transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  ].join(' '),
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
      },
      collapsed: {
        true: 'justify-center px-2 py-3 sm:py-2',
        false: 'px-3 py-3 sm:py-2',
      },
    },
    defaultVariants: {
      active: false,
      collapsed: false,
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

  /** The active navigation item ID. */
  @Prop({ mutable: true, reflect: true }) activeItem: string = 'home';

  /** Navigation items to display. */
  @Prop() items: SidebarItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'docs', label: 'Docs' },
    { id: 'components', label: 'Components' },
  ];

  /** Whether the sidebar is collapsed. */
  @Prop({ mutable: true, reflect: true }) collapsed: boolean = false;

  /** Visual variant of the sidebar. */
  @Prop({ reflect: true }) variant: SidebarVariantProps['variant'] = 'default';

  /** Emitted when a navigation item is clicked. */
  @Event({ bubbles: true, composed: true }) andSidebarItemClick: EventEmitter<string>;

  /** Emitted when the sidebar collapse state changes. */
  @Event({ bubbles: true, composed: true }) andSidebarToggle: EventEmitter<boolean>;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.sidebar = createSidebar({
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
    });
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('activeItem')
  activeItemChanged(newValue: string) {
    this.sidebar.actions.setActiveItem(newValue);
  }

  @Watch('collapsed')
  collapsedChanged(newValue: boolean) {
    this.sidebar.actions.setCollapsed(newValue);
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleToggle = () => {
    this.sidebar.actions.toggleCollapse();
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const containerProps = this.sidebar.getContainerProps();
    const toggleProps = this.sidebar.getToggleProps();
    const isCollapsed = this.sidebar.queries.isCollapsed();

    return (
      <Host {...containerProps}>
        <aside
          class={cn(sidebarVariants({ variant: this.variant, collapsed: isCollapsed }))}
          aria-label="Sidebar navigation"
        >
          <div class="sidebar-header">
            <slot name="header">
              {!isCollapsed && <span class="sidebar-title">Navigation</span>}
            </slot>
            <button
              {...toggleProps}
              class="sidebar-toggle"
              onClick={this.handleToggle}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <and-icon
                name={isCollapsed ? 'chevron-right' : 'chevron-left'}
                class="icon"
              />
            </button>
          </div>

          <nav class="sidebar-nav" aria-label="Sidebar">
            {this.items.map(item => {
              const itemProps = this.sidebar.getItemProps(item.id);
              const isActive = this.sidebar.queries.isActive(item.id);

              return (
                <button
                  key={item.id}
                  {...itemProps}
                  class={cn(
                    sidebarItemVariants({ active: isActive, collapsed: isCollapsed }),
                    'bg-transparent border-none cursor-pointer text-left',
                  )}
                  onClick={() => this.sidebar.actions.setActiveItem(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  title={isCollapsed ? item.label : undefined}
                >
                  {item.icon && (
                    <span class="item-icon">
                      <and-icon name={item.icon} class="h-4 w-4" />
                    </span>
                  )}
                  {!isCollapsed && <span class="item-label">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div class="sidebar-footer">
            <slot name="footer" />
          </div>
        </aside>
      </Host>
    );
  }
}
