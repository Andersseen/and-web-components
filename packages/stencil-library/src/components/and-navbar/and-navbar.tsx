import { Component, Host, h, Prop, Event, EventEmitter, State, Watch, Element, Listen } from '@stencil/core';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';
import { createNavbar, NavbarReturn, NavbarItem as HeadlessNavbarItem } from '@andersseen/headless-components';

/* ────────────────────────────────────────────────────────────────────
 * Types
 * ──────────────────────────────────────────────────────────────────── */

export type NavItem = {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  target?: string;
  disabled?: boolean;
};

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const navbarVariants = cva('w-full border-b', {
  variants: {
    variant: {
      default: 'bg-background border-border',
      ghost: 'bg-transparent border-transparent',
      filled: 'bg-primary text-primary-foreground border-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const navItemVariants = cva(
  [
    'relative inline-flex items-center gap-1.5 rounded-md px-3 py-2',
    'text-sm font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'bg-transparent border-none cursor-pointer no-underline',
  ].join(' '),
  {
    variants: {
      active: {
        true: 'text-foreground font-semibold',
        false: 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none cursor-default',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  },
);

export type NavbarProps = VariantProps<typeof navbarVariants>;

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-navbar',
  styleUrls: ['and-navbar.css', '../../global/global.css'],
  shadow: true,
})
export class AndNavbar {
  private navbar: NavbarReturn;
  private itemElements = new Map<string, HTMLElement>();
  private scrollHandler?: () => void;

  @Element() el: HTMLElement;

  /* ── Props ──────────────────────────────────────────────────────── */

  /**
   * The active navigation item ID.
   * Reflects the headless‐core state.
   */
  @Prop({ mutable: true, reflect: true }) activeItem: string = '';

  /**
   * Navigation items to display.
   * When provided, the component renders its own items (with full
   * keyboard navigation, scroll-spy, and active‐indicator).
   * When empty, use the `nav` slot for custom content.
   */
  @Prop() items: NavItem[] | string = [];

  /**
   * Visual variant
   */
  @Prop() variant: NavbarProps['variant'] = 'default';

  /**
   * Positioning behaviour
   */
  @Prop() position: 'static' | 'sticky' | 'fixed' = 'static';

  /**
   * Enable scroll-spy (auto-detect active section by scroll position).
   * Items must have `href` starting with `#`.
   */
  @Prop() scrollSpy: boolean = false;

  /**
   * Scroll-spy offset from the top of viewport (px).
   */
  @Prop() scrollSpyOffset: number = 100;

  /**
   * ARIA label for the navigation
   */
  @Prop() ariaNavLabel: string = 'Main navigation';

  /* ── Events ─────────────────────────────────────────────────────── */

  /** Emitted when active item changes */
  @Event() navItemClick: EventEmitter<string>;

  /** Emitted when a navigation link is clicked */
  @Event() navLinkClick: EventEmitter<{ id: string; href: string }>;

  /** Emitted when mobile menu state changes */
  @Event() mobileMenuChange: EventEmitter<boolean>;

  /* ── State ──────────────────────────────────────────────────────── */

  @State() mobileMenuOpen: boolean = false;

  /* ── Parsed items (handle string JSON from HTML attributes) ───── */

  private get parsedItems(): NavItem[] {
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
    const headlessItems: HeadlessNavbarItem[] = items.map(i => ({
      id: i.id,
      label: i.label,
      href: i.href,
      target: i.target,
      icon: i.icon,
      disabled: i.disabled,
    }));

    this.navbar = createNavbar({
      items: headlessItems,
      defaultActiveItem: this.activeItem || undefined,
      onActiveItemChange: id => {
        this.activeItem = id;
        this.navItemClick.emit(id);
      },
      mobileMenuOpen: this.mobileMenuOpen,
      onMobileMenuChange: open => {
        this.mobileMenuOpen = open;
        this.mobileMenuChange.emit(open);
      },
      scrollSpy: this.scrollSpy,
      scrollSpyOffset: this.scrollSpyOffset,
      ariaLabel: this.ariaNavLabel,
    });

    // Sync initial active from headless if the prop was empty
    if (!this.activeItem && this.navbar.state.activeItem) {
      this.activeItem = this.navbar.state.activeItem;
    }
  }

  componentDidLoad() {
    if (this.scrollSpy) {
      this.setupScrollSpy();
      // Use actual scroll position to determine the initial active section
      // instead of URL hash, which may be stale from a previous visit
      this.navbar.actions.updateActiveFromScroll();
    } else {
      // Without scroll-spy, fall back to hash detection
      this.navbar.actions.updateActiveFromHash();
    }
  }

  disconnectedCallback() {
    this.teardownScrollSpy();
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('activeItem')
  handleActiveItemChange(newValue: string) {
    if (this.navbar && this.navbar.state.activeItem !== newValue) {
      this.navbar.actions.setActiveItem(newValue);
    }
  }

  @Watch('items')
  handleItemsChange() {
    const items = this.parsedItems;
    this.navbar.actions.setItems(
      items.map(i => ({
        id: i.id,
        label: i.label,
        href: i.href,
        target: i.target,
        icon: i.icon,
        disabled: i.disabled,
      })),
    );
  }

  @Watch('scrollSpy')
  handleScrollSpyChange(val: boolean) {
    if (val) {
      this.setupScrollSpy();
    } else {
      this.teardownScrollSpy();
    }
  }

  /* ── Scroll spy setup ───────────────────────────────────────────── */

  private setupScrollSpy() {
    this.teardownScrollSpy();
    this.scrollHandler = () => {
      this.navbar.actions.updateActiveFromScroll();
    };
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private teardownScrollSpy() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = undefined;
    }
  }

  /* ── Keyboard listener for Escape ───────────────────────────────── */

  @Listen('keydown', { target: 'window' })
  handleGlobalKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.mobileMenuOpen) {
      this.navbar.actions.closeMobileMenu();
    }
  }

  /* ── Internal handlers ──────────────────────────────────────────── */

  private handleToggle = () => {
    this.navbar.actions.toggleMobileMenu();
  };

  private handleClose = () => {
    this.navbar.actions.closeMobileMenu();
  };

  private handleItemClick = (item: NavItem) => {
    if (item.disabled) return;
    this.navbar.actions.setActiveItem(item.id);
    if (item.href) {
      this.navLinkClick.emit({ id: item.id, href: item.href });
    }
  };

  private handleItemKeyDown = (event: KeyboardEvent, item: NavItem) => {
    this.navbar.handleItemKeyDown(event, item.id);

    // After headless updates active item, move DOM focus
    const newActive = this.navbar.state.activeItem;
    if (newActive !== item.id) {
      const el = this.itemElements.get(newActive);
      el?.focus();
    }
  };

  private registerItemRef = (id: string, el: HTMLElement | undefined) => {
    if (el) {
      this.itemElements.set(id, el);
    }
  };

  /* ── Render helpers ─────────────────────────────────────────────── */

  private renderNavItem(item: NavItem, mobile: boolean = false) {
    const itemProps = this.navbar.getItemProps(item.id, item.href ? { href: item.href, target: item.target } : undefined);
    const isActive = this.navbar.queries.isActive(item.id);
    const isDisabled = item.disabled ?? false;

    const baseClass = cn(
      navItemVariants({ active: isActive, disabled: isDisabled }),
      mobile && 'w-full text-left px-4 py-3 text-base rounded-lg',
    );

    const indicatorClass = cn(
      'nav-item-indicator',
      isActive && 'nav-item-indicator--active',
    );

    const commonProps = {
      'aria-current': itemProps['aria-current'],
      'aria-disabled': itemProps['aria-disabled'],
      'data-active': itemProps['data-active'],
      'data-state': itemProps['data-state'],
      tabindex: itemProps.tabindex,
      id: itemProps.id,
      role: itemProps.role,
    };

    if (item.href) {
      return (
        <a
          key={item.id}
          ref={el => this.registerItemRef(item.id, el)}
          href={item.href}
          target={item.target}
          {...commonProps}
          class={baseClass}
          onClick={(e) => {
            if (isDisabled) { e.preventDefault(); return; }
            this.handleItemClick(item);
            if (mobile) this.handleClose();
          }}
          onKeyDown={(e) => !mobile && this.handleItemKeyDown(e, item)}
        >
          {item.icon && <and-icon name={item.icon} size="16" />}
          <span>{item.label}</span>
          {!mobile && <span class={indicatorClass} />}
        </a>
      );
    }

    return (
      <button
        key={item.id}
        ref={el => this.registerItemRef(item.id, el)}
        {...commonProps}
        class={baseClass}
        onClick={() => {
          if (isDisabled) return;
          this.handleItemClick(item);
          if (mobile) this.handleClose();
        }}
        onKeyDown={(e) => !mobile && this.handleItemKeyDown(e, item)}
      >
        {item.icon && <and-icon name={item.icon} size="16" />}
        <span>{item.label}</span>
        {!mobile && <span class={indicatorClass} />}
      </button>
    );
  }

  /* ── Main render ────────────────────────────────────────────────── */

  render() {
    if (!this.navbar) {
      return <Host><div style={{padding: '1rem', background: 'red', color: 'white'}}>Navbar: headless not initialized</div></Host>;
    }

    const containerProps = this.navbar.getContainerProps();
    const toggleProps = this.navbar.getToggleProps();
    const navListProps = this.navbar.getNavListProps();
    const items = this.parsedItems;
    const hasItems = items.length > 0;

    // Host handles positioning so backdrop-blur stays on <nav>
    // and doesn't create a containing block that traps the drawer
    const hostStyle: Record<string, string> =
      this.position === 'fixed'
        ? { position: 'fixed', top: '0', left: '0', right: '0', zIndex: '50' }
        : this.position === 'sticky'
          ? { position: 'sticky', top: '0', zIndex: '50' }
          : {};

    const isStuck = this.position === 'sticky' || this.position === 'fixed';

    return (
      <Host
        role={containerProps.role}
        aria-label={containerProps['aria-label']}
        style={hostStyle}
      >
        <nav class={cn(navbarVariants({ variant: this.variant }), isStuck && 'navbar-blur')}>
          <div class="navbar-container">
            {/* Brand */}
            <div class="navbar-brand">
              <slot name="brand">
                <span class="brand-text">Brand</span>
              </slot>
            </div>

            {/* Desktop: Items-based navigation */}
            {hasItems && (
              <div
                class="navbar-menu hidden md:flex"
                role={navListProps.role}
                aria-label={navListProps['aria-label']}
              >
                {items.map(item => this.renderNavItem(item))}
              </div>
            )}

            {/* Desktop: Slot-based navigation (custom content) */}
            {!hasItems && (
              <div class="navbar-nav hidden md:flex">
                <slot name="nav"></slot>
              </div>
            )}

            {/* Actions slot */}
            <div class="navbar-actions hidden md:flex">
              <slot name="actions"></slot>
            </div>

            {/* Mobile toggle */}
            <div class="navbar-mobile-toggle flex md:hidden">
              <button
                aria-expanded={toggleProps['aria-expanded']}
                aria-label={toggleProps['aria-label']}
                aria-controls={toggleProps['aria-controls']}
                data-state={toggleProps['data-state']}
                class="mobile-toggle-btn"
                onClick={this.handleToggle}
              >
                <span class={cn('mobile-toggle-icon', this.mobileMenuOpen && 'mobile-toggle-icon--open')}>
                  <slot name="toggle-icon">
                    <and-icon name={this.mobileMenuOpen ? 'close' : 'menu'} size="24" />
                  </slot>
                </span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile drawer */}
        <and-drawer
          open={this.mobileMenuOpen}
          placement="right"
          onAndDrawerClose={this.handleClose}
        >
          <span slot="header" class="mobile-menu-title">Menu</span>

          <nav class="mobile-menu-content">
            {/* Items-based mobile menu */}
            {hasItems &&
              items.map(item => this.renderNavItem(item, true))}

            {/* Slot-based mobile menu */}
            {!hasItems && (
              <div class="mobile-menu-slot">
                <slot name="nav"></slot>
              </div>
            )}
          </nav>

          <div slot="footer" class="mobile-menu-actions">
            <slot name="actions"></slot>
          </div>
        </and-drawer>
      </Host>
    );
  }
}
