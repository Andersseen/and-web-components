import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createTabs } from '@andersseen/headless-core';

@Component({
  selector: 'app-tabs-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Tabs
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A set of layered sections of content — known as tab panels — that are
          displayed one at a time.
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
          <div class="max-w-md mx-auto">
            <!-- Tabs Root -->
            <div>
              <!-- Tab List -->
              <div class="flex p-1 bg-muted rounded-lg">
                <button
                  class="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all rounded-md cursor-pointer border-0"
                  [class.bg-background]="activeTab() === 'account'"
                  [class.text-foreground]="activeTab() === 'account'"
                  [class.shadow-sm]="activeTab() === 'account'"
                  [class.text-muted-foreground]="activeTab() !== 'account'"
                  [class.hover:text-foreground]="activeTab() !== 'account'"
                  (click)="selectTab('account')"
                >
                  Account
                </button>
                <button
                  class="flex-1 inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium transition-all rounded-md cursor-pointer border-0"
                  [class.bg-background]="activeTab() === 'password'"
                  [class.text-foreground]="activeTab() === 'password'"
                  [class.shadow-sm]="activeTab() === 'password'"
                  [class.text-muted-foreground]="activeTab() !== 'password'"
                  [class.hover:text-foreground]="activeTab() !== 'password'"
                  (click)="selectTab('password')"
                >
                  Password
                </button>
              </div>

              <!-- Account Panel -->
              @if (activeTab() === 'account') {
                <div
                  class="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <h3 class="text-lg font-semibold text-foreground mb-1">
                    Account
                  </h3>
                  <p class="text-sm text-muted-foreground mb-5 leading-relaxed">
                    Make changes to your account here. Click save when you're
                    done.
                  </p>

                  <div class="mb-4">
                    <label
                      class="block text-sm font-medium text-foreground mb-1.5"
                      >Name</label
                    >
                    <input
                      class="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      type="text"
                      value="Pedro Duarte"
                    />
                  </div>

                  <div class="mb-4">
                    <label
                      class="block text-sm font-medium text-foreground mb-1.5"
                      >Username</label
                    >
                    <input
                      class="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      type="text"
                      value="@peduarte"
                    />
                  </div>

                  <div class="mt-5">
                    <button
                      class="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground border-0 cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              }

              <!-- Password Panel -->
              @if (activeTab() === 'password') {
                <div
                  class="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-200"
                >
                  <h3 class="text-lg font-semibold text-foreground mb-1">
                    Password
                  </h3>
                  <p class="text-sm text-muted-foreground mb-5 leading-relaxed">
                    Change your password here. After saving, you'll be logged
                    out.
                  </p>

                  <div class="mb-4">
                    <label
                      class="block text-sm font-medium text-foreground mb-1.5"
                      >Current password</label
                    >
                    <input
                      class="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      type="password"
                    />
                  </div>

                  <div class="mb-4">
                    <label
                      class="block text-sm font-medium text-foreground mb-1.5"
                      >New password</label
                    >
                    <input
                      class="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      type="password"
                    />
                  </div>

                  <div class="mb-4">
                    <label
                      class="block text-sm font-medium text-foreground mb-1.5"
                      >Confirm password</label
                    >
                    <input
                      class="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      type="password"
                    />
                  </div>

                  <div class="mt-5">
                    <button
                      class="inline-flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium bg-primary text-primary-foreground border-0 cursor-pointer transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                    >
                      Update password
                    </button>
                  </div>
                </div>
              }
            </div>
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
          ><code>import {{ '{' }} createTabs {{ '}' }} from '@andersseen/headless-core';

const tabs = createTabs({{ '{' }}
    defaultValue: 'account'
{{ '}' }});

// Select a tab
tabs.actions.selectTab('account');

// Check if selected
tabs.queries.isSelected('account'); // true</code></pre>
        </div>
      </section>

      <!-- Raw Example -->
      <section class="mb-12">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-xl font-semibold tracking-tight text-foreground m-0">
            Headless Implementation
          </h2>
          <span
            class="text-[11px] font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border tracking-wide"
            >Zero Styles</span
          >
        </div>

        <p
          class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6"
        >
          Manages tab selection, ARIA roles, and keyboard navigation — you
          control the rendering.
        </p>

        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
          <div>
            <div style="display: flex; gap: 4px; margin-bottom: 8px;">
              <button
                [style.font-weight]="
                  activeTab() === 'account' ? 'bold' : 'normal'
                "
                (click)="selectTab('account')"
              >
                Account
              </button>
              <button
                [style.font-weight]="
                  activeTab() === 'password' ? 'bold' : 'normal'
                "
                (click)="selectTab('password')"
              >
                Password
              </button>
            </div>
            <div style="border: 1px solid #999; padding: 12px;">
              @if (activeTab() === 'account') {
                <p style="margin: 0;">Account panel content goes here.</p>
              }
              @if (activeTab() === 'password') {
                <p style="margin: 0;">Password panel content goes here.</p>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [],
})
export default class TabsHeadlessDemo {
  private _tabs = createTabs({ defaultValue: 'account' });
  activeTab = signal('account');

  selectTab(tab: string) {
    this._tabs.actions.selectTab(tab);
    this.activeTab.set(tab);
  }
}
