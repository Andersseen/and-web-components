import { Component, Host, h, Prop, Event, EventEmitter } from '@stencil/core';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

export type NavItem = {
  id: string;
  label: string;
  icon?: string;
};

const navbarVariants = cva('w-full border-b', {
  variants: {
    variant: {
      default: 'bg-background border-border',
      ghost: 'bg-transparent border-transparent',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const navItemVariants = cva(
  'rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      active: {
        true: 'bg-accent text-accent-foreground',
        false: 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export type NavbarProps = VariantProps<typeof navbarVariants>;

@Component({
  tag: 'my-navbar',
  styleUrls: ['my-navbar.css', '../../global/global.css'],
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
   * Variant of the navbar
   */
  @Prop() variant: NavbarProps['variant'] = 'default';

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
        <nav class={cn(navbarVariants({ variant: this.variant }))}>
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
                  class={cn(navItemVariants({ active: this.activeItem === item.id }), 'bg-transparent border-none cursor-pointer')}
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
