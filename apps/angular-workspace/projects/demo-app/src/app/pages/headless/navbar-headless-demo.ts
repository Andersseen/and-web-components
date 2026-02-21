import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createNavbar, NavbarReturn, NavbarItem } from '@andersseen/headless-components';

@Component({
  selector: 'app-navbar-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Navbar
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A responsive navigation header with support for branding, navigation
          items, keyboard navigation (Arrow keys, Home, End), and mobile menu
          toggling. Built on the headless core with full ARIA roles.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm p-8"
        >
          <div class="border rounded-md bg-background">
            <nav
              class="flex items-center justify-between p-4 h-16 border-b"
              [attr.role]="navbar.getContainerProps().role"
              [attr.aria-label]="navbar.getContainerProps()['aria-label']"
            >
              <!-- Brand -->
              <div class="font-bold text-lg">My App</div>

              <!-- Desktop Menu -->
              <div
                class="hidden md:flex gap-1"
                [attr.role]="navbar.getNavListProps().role"
                [attr.aria-label]="navbar.getNavListProps()['aria-label']"
              >
                @for (item of items; track item.id) {
                  <button
                    class="relative px-3 py-2 text-sm font-medium rounded-md transition-all duration-200"
                    [class.text-foreground]="navbar.queries.isActive(item.id)"
                    [class.font-semibold]="navbar.queries.isActive(item.id)"
                    [class.text-muted-foreground]="
                      !navbar.queries.isActive(item.id)
                    "
                    [class.hover:text-foreground]="
                      !navbar.queries.isActive(item.id)
                    "
                    [class.hover:bg-accent]="!navbar.queries.isActive(item.id)"
                    (click)="setActiveItem(item.id)"
                    (keydown)="handleKeyDown($event, item.id)"
                    [attr.aria-current]="
                      navbar.getItemProps(item.id)['aria-current']
                    "
                    [attr.data-state]="
                      navbar.getItemProps(item.id)['data-state']
                    "
                    [attr.role]="navbar.getItemProps(item.id).role"
                    [attr.tabindex]="navbar.getItemProps(item.id).tabindex"
                  >
                    {{ item.label }}
                    <span
                      class="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full bg-primary transition-all duration-200"
                      [class.w-3/5]="navbar.queries.isActive(item.id)"
                      [class.opacity-100]="navbar.queries.isActive(item.id)"
                      [class.w-0]="!navbar.queries.isActive(item.id)"
                      [class.opacity-0]="!navbar.queries.isActive(item.id)"
                    ></span>
                  </button>
                }
              </div>

              <!-- Mobile Toggle -->
              <button
                class="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
                (click)="toggleMobileMenu()"
                [attr.aria-expanded]="navbar.getToggleProps()['aria-expanded']"
                [attr.aria-label]="navbar.getToggleProps()['aria-label']"
                [attr.aria-controls]="navbar.getToggleProps()['aria-controls']"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  @if (mobileMenuOpen()) {
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  } @else {
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                  }
                </svg>
              </button>
            </nav>

            <!-- Mobile Menu -->
            @if (mobileMenuOpen()) {
              <div
                [attr.id]="navbar.getMobileMenuProps().id"
                [attr.role]="navbar.getMobileMenuProps().role"
                [attr.aria-label]="navbar.getMobileMenuProps()['aria-label']"
                class="md:hidden border-t p-4 flex flex-col gap-1 bg-background animate-in slide-in-from-top-2"
              >
                @for (item of items; track item.id) {
                  <button
                    class="px-4 py-3 text-sm font-medium rounded-lg text-left transition-all duration-200"
                    [class.bg-accent]="navbar.queries.isActive(item.id)"
                    [class.text-foreground]="navbar.queries.isActive(item.id)"
                    [class.font-semibold]="navbar.queries.isActive(item.id)"
                    [class.text-muted-foreground]="
                      !navbar.queries.isActive(item.id)
                    "
                    (click)="setActiveItem(item.id)"
                  >
                    {{ item.label }}
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </section>

      <!-- API Reference -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          API
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">Actions</h3>
            <ul class="text-sm text-muted-foreground m-0 pl-4 leading-relaxed space-y-1">
              <li><code>setActiveItem(id)</code></li>
              <li><code>toggleMobileMenu()</code></li>
              <li><code>closeMobileMenu()</code></li>
              <li><code>setItems(items)</code></li>
              <li><code>updateActiveFromScroll()</code></li>
              <li><code>updateActiveFromHash()</code></li>
            </ul>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">Props Helpers</h3>
            <ul class="text-sm text-muted-foreground m-0 pl-4 leading-relaxed space-y-1">
              <li><code>getContainerProps()</code></li>
              <li><code>getNavListProps()</code> — role=&quot;menubar&quot;</li>
              <li><code>getItemProps(id)</code> — role=&quot;menuitem&quot;</li>
              <li><code>getToggleProps()</code></li>
              <li><code>getMobileMenuProps()</code></li>
              <li><code>handleItemKeyDown(event, id)</code></li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl bg-primary-950 border border-primary-900 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-primary-200"
          ><code>import {{ '{' }} createNavbar {{ '}' }} from '&#64;andersseen/headless-core';

const navbar = createNavbar({{ '{' }}
  items: [
    {{ '{' }} id: 'home', label: 'Home', href: '#home' {{ '}' }},
    {{ '{' }} id: 'about', label: 'About', href: '#about' {{ '}' }},
  ],
  defaultActiveItem: 'home',
  onActiveItemChange: (id) => console.log('Active:', id),
  scrollSpy: true,
{{ '}' }});

// Element props
const navProps  = navbar.getContainerProps();   // role="navigation"
const listProps = navbar.getNavListProps();      // role="menubar"
const itemProps = navbar.getItemProps('home');   // role="menuitem", data-state, aria-current

// Keyboard
el.addEventListener('keydown', e => navbar.handleItemKeyDown(e, 'home'));

// Scroll-spy
window.addEventListener('scroll', () => navbar.actions.updateActiveFromScroll());</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class NavbarHeadlessDemo {
  items: NavbarItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
  ];

  mobileMenuOpen: WritableSignal<boolean> = signal(false);
  activeItem: WritableSignal<string> = signal('home');

  navbar: NavbarReturn;

  constructor() {
    this.navbar = createNavbar({
      items: this.items,
      defaultActiveItem: this.activeItem(),
      onActiveItemChange: (id) => this.activeItem.set(id),
      mobileMenuOpen: this.mobileMenuOpen(),
      onMobileMenuChange: (open) => this.mobileMenuOpen.set(open),
    });
  }

  setActiveItem(id: string) {
    this.navbar.actions.setActiveItem(id);
    this.navbar.actions.closeMobileMenu();
  }

  toggleMobileMenu() {
    this.navbar.actions.toggleMobileMenu();
  }

  handleKeyDown(event: KeyboardEvent, itemId: string) {
    this.navbar.handleItemKeyDown(event, itemId);
  }
}
