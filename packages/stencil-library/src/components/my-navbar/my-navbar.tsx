import { Component, Host, h, Prop, Event, EventEmitter, State } from '@stencil/core';
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

  @State() mobileMenuOpen: boolean = false;

  private handleNavClick(itemId: string) {
    this.navItemClick.emit(itemId);
    this.mobileMenuOpen = false;
  }

  private toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
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

            {/* Desktop Menu */}
            <div class="navbar-menu hidden md:flex">
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

            <div class="navbar-actions hidden md:flex">
              <slot name="actions"></slot>
            </div>

            {/* Mobile Menu Toggle */}
            <div class="flex md:hidden">
              <button
                class="p-2 -mr-2 text-foreground bg-transparent border-none cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-md"
                onClick={() => this.toggleMobileMenu()}
                aria-label="Toggle menu"
              >
                <my-icon name="menu" class="h-6 w-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Drawer */}
        <my-drawer open={this.mobileMenuOpen} placement="right" onMyClose={() => (this.mobileMenuOpen = false)} class="md:hidden">
          <div slot="header" class="font-bold text-lg">
            Menu
          </div>
          <div class="flex flex-col gap-2 mt-2">
            {this.items.map(item => (
              <button
                key={item.id}
                class={cn(navItemVariants({ active: this.activeItem === item.id }), 'bg-transparent border-none cursor-pointer w-full text-left px-4 py-3 text-base')}
                onClick={() => this.handleNavClick(item.id)}
              >
                {item.label}
              </button>
            ))}
            <div class="mt-4 pt-4 border-t px-4">
              <slot name="actions"></slot>
            </div>
          </div>
        </my-drawer>
      </Host>
    );
  }
}
