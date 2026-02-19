import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createNavbar, NavbarReturn } from '@andersseen/headless-core';
import { RouterLink } from '@angular/router';

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
          items, and mobile menu toggling.
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
              class="flex items-center justify-between p-4 h-16"
              [attr.role]="navbar.getContainerProps().role"
            >
              <!-- Brand -->
              <div class="font-bold text-lg">My App</div>

              <!-- Desktop Menu -->
              <div class="hidden md:flex gap-4">
                @for (item of items; track item.id) {
                  <button
                    class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
                    [class.bg-accent]="navbar.queries.isActive(item.id)"
                    [class.text-accent-foreground]="
                      navbar.queries.isActive(item.id)
                    "
                    [class.text-muted-foreground]="
                      !navbar.queries.isActive(item.id)
                    "
                    [class.hover:bg-accent]="!navbar.queries.isActive(item.id)"
                    [class.hover:text-accent-foreground]="
                      !navbar.queries.isActive(item.id)
                    "
                    (click)="setActiveItem(item.id)"
                    [attr.aria-current]="
                      navbar.getItemProps(item.id)['aria-current']
                    "
                  >
                    {{ item.label }}
                  </button>
                }
              </div>

              <!-- Mobile Toggle -->
              <button
                class="md:hidden p-2 rounded-md hover:bg-accent"
                (click)="toggleMobileMenu()"
                [attr.aria-expanded]="navbar.getToggleProps()['aria-expanded']"
                [attr.aria-label]="navbar.getToggleProps()['aria-label']"
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
                class="md:hidden border-t p-4 flex flex-col gap-2 bg-background animate-in slide-in-from-top-2"
              >
                @for (item of items; track item.id) {
                  <button
                    class="px-3 py-2 text-sm font-medium rounded-md text-left transition-colors"
                    [class.bg-accent]="navbar.queries.isActive(item.id)"
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

      <!-- Usage Code -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl bg-[#0a0a0a] border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-200"
          ><code>import {{ '{' }} createNavbar {{ '}' }} from '@andersseen/headless-core';

// Initialize
const navbar = createNavbar({{ '{' }}
  defaultActiveItem: 'home',
  onActiveItemChange: (id) => console.log('Active:', id)
{{ '}' }});

// Bind element props
const containerProps = navbar.getContainerProps();
const itemProps = navbar.getItemProps('home');
const toggleProps = navbar.getToggleProps();

// Handle events
navbar.actions.setActiveItem('about');
navbar.actions.toggleMobileMenu();</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class NavbarHeadlessDemo {
  items = [
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
}
