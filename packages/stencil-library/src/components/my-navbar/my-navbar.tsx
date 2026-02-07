import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';

export type NavItem = {
  id: string;
  label: string;
  icon?: string;
};

@Component({
  tag: 'my-navbar',
  styleUrl: 'my-navbar.css',
  shadow: true,
})
export class MyNavbar {
  /**
   * The active navigation item ID
   */
  @Prop() activeItem: string = 'home';

  /**
   * Navigation items to display
   */
  @Prop() items: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'docs', label: 'Docs' },
    { id: 'components', label: 'Components' },
    { id: 'icons', label: 'Icons' },
  ];

  /**
   * Emitted when a navigation item is clicked
   */
  @Event() navItemClick: EventEmitter<string>;

  private handleNavClick(itemId: string) {
    this.navItemClick.emit(itemId);
  }

  render() {
    return (
      <Host>
        <nav class="navbar">
          <div class="navbar-container">
            <div class="navbar-brand">
              <slot name="brand">
                <span class="brand-text">Stencil UI Kit</span>
              </slot>
            </div>
            <div class="navbar-menu">
              {this.items.map(item => (
                <button
                  key={item.id}
                  class={{
                    'nav-item': true,
                    'nav-item-active': this.activeItem === item.id,
                  }}
                  onClick={() => this.handleNavClick(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div class="navbar-actions">
              <slot name="actions"></slot>
            </div>
          </div>
        </nav>
      </Host>
    );
  }
}
