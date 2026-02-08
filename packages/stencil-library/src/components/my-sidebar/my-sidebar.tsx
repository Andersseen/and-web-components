import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { IconName } from '../my-icon/icons';

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
  'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
      },
      collapsed: {
        true: 'justify-center px-2',
        false: '',
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
  tag: 'my-sidebar',
  styleUrls: ['my-sidebar.css', '../../global/global.css'],
  shadow: true,
})
export class MySidebar {
  /**
   * The active navigation item ID
   */
  @Prop() activeItem: string = 'home';

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

  private handleItemClick(itemId: string) {
    this.sidebarItemClick.emit(itemId);
  }

  private toggleSidebar() {
    this.collapsed = !this.collapsed;
    this.sidebarToggle.emit(this.collapsed);
  }

  render() {
    return (
      <Host>
        <aside class={cn(sidebarVariants({ variant: this.variant, collapsed: this.collapsed }))}>
          <div class="sidebar-header">
            <slot name="header">{!this.collapsed && <span class="sidebar-title">Navigation</span>}</slot>
            <button class="sidebar-toggle" onClick={() => this.toggleSidebar()} aria-label="Toggle sidebar">
              <my-icon name={this.collapsed ? 'chevron-right' : 'chevron-left'} class="icon" />
            </button>
          </div>
          <nav class="sidebar-nav">
            {this.items.map(item => (
              <button
                key={item.id}
                class={cn(
                  sidebarItemVariants({
                    active: this.activeItem === item.id,
                    collapsed: this.collapsed,
                  }),
                  'bg-transparent border-none cursor-pointer text-left',
                )}
                onClick={() => this.handleItemClick(item.id)}
                title={this.collapsed ? item.label : undefined}
              >
                {item.icon && (
                  <span class="item-icon">
                    <my-icon name={item.icon} class="h-4 w-4" />
                  </span>
                )}
                {!this.collapsed && <span class="item-label">{item.label}</span>}
              </button>
            ))}
          </nav>
          <div class="sidebar-footer">
            <slot name="footer"></slot>
          </div>
        </aside>
      </Host>
    );
  }
}
