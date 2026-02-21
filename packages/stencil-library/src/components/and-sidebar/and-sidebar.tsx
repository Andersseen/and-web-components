import { Component, Host, h, Prop, Event, EventEmitter, Watch } from '@stencil/core';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { IconName } from '@andersseen/icon';
import { createSidebar, SidebarReturn } from '@andersseen/headless-components';

export type SidebarItem = {
  id: string;
  label: string;
  icon?: IconName;
};

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
  'flex w-full items-center gap-3 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
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

export type SidebarProps = VariantProps<typeof sidebarVariants>;

@Component({
  tag: 'and-sidebar',
  styleUrls: ['and-sidebar.css', '../../global/global.css'],
  shadow: true,
})
export class MySidebar {
  private sidebar: SidebarReturn;

  /**
   * The active navigation item ID
   */
  @Prop({ mutable: true }) activeItem: string = 'home';

  /**
   * Navigation items to display
   */
  @Prop() items: SidebarItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'docs', label: 'Docs' },
    { id: 'components', label: 'Components' },
  ];

  /**
   * Whether the sidebar is collapsed
   */
  @Prop({ mutable: true }) collapsed: boolean = false;

  /**
   * Variant of the sidebar
   */
  @Prop() variant: SidebarProps['variant'] = 'default';

  /**
   * Emitted when a navigation item is clicked
   */
  @Event() sidebarItemClick: EventEmitter<string>;

  /**
   * Emitted when the sidebar collapse state changes
   */
  @Event() sidebarToggle: EventEmitter<boolean>;

  componentWillLoad() {
    this.sidebar = createSidebar({
      defaultActiveItem: this.activeItem,
      onActiveItemChange: id => {
        this.activeItem = id;
        this.sidebarItemClick.emit(id);
      },
      defaultCollapsed: this.collapsed,
      onCollapsedChange: collapsed => {
        this.collapsed = collapsed;
        this.sidebarToggle.emit(collapsed);
      },
    });
  }

  @Watch('activeItem')
  handleActiveItemChange(newValue: string) {
    this.sidebar.actions.setActiveItem(newValue);
  }

  @Watch('collapsed')
  handleCollapsedChange(newValue: boolean) {
    this.sidebar.actions.setCollapsed(newValue);
  }

  private handleToggle() {
    this.sidebar.actions.toggleCollapse();
  }

  render() {
    const containerProps = this.sidebar.getContainerProps();
    const toggleProps = this.sidebar.getToggleProps();

    return (
      <Host {...containerProps}>
        <aside class={cn(sidebarVariants({ variant: this.variant, collapsed: this.sidebar.queries.isCollapsed() }))}>
          <div class="sidebar-header">
            <slot name="header">{!this.sidebar.queries.isCollapsed() && <span class="sidebar-title">Navigation</span>}</slot>
            <button {...toggleProps} class="sidebar-toggle" onClick={() => this.handleToggle()} aria-label="Toggle sidebar">
              <and-icon name={this.sidebar.queries.isCollapsed() ? 'chevron-right' : 'chevron-left'} class="icon" />
            </button>
          </div>
          <nav class="sidebar-nav">
            {this.items.map(item => {
              const itemProps = this.sidebar.getItemProps(item.id);
              return (
                <button
                  key={item.id}
                  {...itemProps}
                  class={cn(
                    sidebarItemVariants({
                      active: this.sidebar.queries.isActive(item.id),
                      collapsed: this.sidebar.queries.isCollapsed(),
                    }),
                    'bg-transparent border-none cursor-pointer text-left',
                  )}
                  onClick={() => this.sidebar.actions.setActiveItem(item.id)}
                  title={this.sidebar.queries.isCollapsed() ? item.label : undefined}
                >
                  {item.icon && (
                    <span class="item-icon">
                      <and-icon name={item.icon} class="h-4 w-4" />
                    </span>
                  )}
                  {!this.sidebar.queries.isCollapsed() && <span class="item-label">{item.label}</span>}
                </button>
              );
            })}
          </nav>
          <div class="sidebar-footer">
            <slot name="footer"></slot>
          </div>
        </aside>
      </Host>
    );
  }
}
