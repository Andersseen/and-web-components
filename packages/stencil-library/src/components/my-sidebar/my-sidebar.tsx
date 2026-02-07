import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { IconName } from '../my-icon/icons';

export type SidebarItem = {
  id: string;
  label: string;
  icon?: IconName;
};

@Component({
  tag: 'my-sidebar',
  styleUrl: 'my-sidebar.css',
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
        <aside class={{ 'sidebar': true, 'sidebar-collapsed': this.collapsed }}>
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
                class={{
                  'sidebar-item': true,
                  'sidebar-item-active': this.activeItem === item.id,
                }}
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
