import { Component } from '@angular/core';
import {
  AndButton,
  AndDropdown,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-dropdown-demo',
  imports: [AndDropdown, AndButton],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Dropdown
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A floating menu of actions or options, triggered by a button.
          Supports keyboard navigation and proper ARIA roles.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-col items-center justify-center gap-6 min-h-[200px]"
          >
            <p class="text-sm text-muted-foreground m-0">
              Click the button to reveal the dropdown
            </p>
            <and-dropdown [items]="actionItems">
              <and-button slot="trigger" variant="outline">
                Actions
                <svg
                  class="ml-2 inline-block"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </and-button>
            </and-dropdown>
          </div>
        </div>
      </section>

      <!-- Multiple Examples -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Variations
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-wrap items-start justify-center gap-8 min-h-[200px]"
          >
            <div class="flex flex-col items-center gap-2">
              <span class="text-xs text-muted-foreground mb-1">Navigation</span>
              <and-dropdown [items]="navItems">
                <and-button slot="trigger" variant="default">Navigate</and-button>
              </and-dropdown>
            </div>
            <div class="flex flex-col items-center gap-2">
              <span class="text-xs text-muted-foreground mb-1">Settings</span>
              <and-dropdown [items]="settingsItems">
                <and-button slot="trigger" variant="secondary">Settings</and-button>
              </and-dropdown>
            </div>
            <div class="flex flex-col items-center gap-2">
              <span class="text-xs text-muted-foreground mb-1">Profile</span>
              <and-dropdown [items]="profileItems">
                <and-button slot="trigger" variant="ghost">Profile</and-button>
              </and-dropdown>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section>
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div class="rounded-xl border border-border overflow-x-auto shadow-sm">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Template</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-dropdown [items]="menuItems"&gt;
  &lt;and-button slot="trigger"&gt;Open Menu&lt;/and-button&gt;
&lt;/and-dropdown&gt;</code></pre>
        </div>
        <div
          class="rounded-xl border border-border overflow-x-auto shadow-sm mt-4"
        >
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Component</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>menuItems = [
  {{ '{' }} text: 'Edit', value: 'edit' {{ '}' }},
  {{ '{' }} text: 'Duplicate', value: 'duplicate' {{ '}' }},
  {{ '{' }} text: 'Delete', value: 'delete' {{ '}' }},
];</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class DropdownDemo {
  actionItems = [
    { text: 'Edit', value: 'edit' },
    { text: 'Duplicate', value: 'duplicate' },
    { text: 'Archive', value: 'archive' },
    { text: 'Delete', value: 'delete' },
  ];

  navItems = [
    { text: 'Dashboard', value: 'dashboard' },
    { text: 'Settings', value: 'settings' },
    { text: 'Reports', value: 'reports' },
  ];

  settingsItems = [
    { text: 'General', value: 'general' },
    { text: 'Notifications', value: 'notifications' },
    { text: 'Privacy', value: 'privacy' },
  ];

  profileItems = [
    { text: 'My Account', value: 'account' },
    { text: 'Preferences', value: 'preferences' },
    { text: 'Sign Out', value: 'signout' },
  ];
}
