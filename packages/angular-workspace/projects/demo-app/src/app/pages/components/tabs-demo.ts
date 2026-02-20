import { Component } from '@angular/core';
import {
  AndTabs,
  AndTabsContent,
  AndTabsList,
  AndTabsTrigger,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-tabs-demo',
  imports: [AndTabs, AndTabsContent, AndTabsList, AndTabsTrigger],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Tabs
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Organize content into separate views that can be toggled within the
          same context. Only one tab panel is visible at a time.
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
          <div class="p-8">
            <div class="max-w-xl mx-auto">
              <and-tabs value="account">
                <and-tabs-list>
                  <and-tabs-trigger value="account">Account</and-tabs-trigger>
                  <and-tabs-trigger value="password">Password</and-tabs-trigger>
                  <and-tabs-trigger value="notifications"
                    >Notifications</and-tabs-trigger
                  >
                </and-tabs-list>
                <and-tabs-content value="account">
                  <div class="py-4">
                    <h3
                      class="text-base font-semibold text-foreground mb-2 mt-0"
                    >
                      Account Settings
                    </h3>
                    <p
                      class="text-sm text-muted-foreground leading-relaxed m-0"
                    >
                      Manage your account details, display name, and
                      preferences. Changes will be reflected across all your
                      sessions.
                    </p>
                  </div>
                </and-tabs-content>
                <and-tabs-content value="password">
                  <div class="py-4">
                    <h3
                      class="text-base font-semibold text-foreground mb-2 mt-0"
                    >
                      Password
                    </h3>
                    <p
                      class="text-sm text-muted-foreground leading-relaxed m-0"
                    >
                      Update your password regularly to keep your account
                      secure. We recommend using a strong, unique password.
                    </p>
                  </div>
                </and-tabs-content>
                <and-tabs-content value="notifications">
                  <div class="py-4">
                    <h3
                      class="text-base font-semibold text-foreground mb-2 mt-0"
                    >
                      Notifications
                    </h3>
                    <p
                      class="text-sm text-muted-foreground leading-relaxed m-0"
                    >
                      Configure how and when you receive notifications.
                      Fine-tune email, push, and in-app notification
                      preferences.
                    </p>
                  </div>
                </and-tabs-content>
              </and-tabs>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Features
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Keyboard Nav
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Arrow keys to switch tabs, Home/End for first/last.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Accessible
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Proper tablist/tab/tabpanel ARIA roles and states.
            </p>
          </div>
          <div class="rounded-xl border border-border bg-card p-5">
            <h3 class="text-sm font-semibold text-foreground mb-2">
              Controlled
            </h3>
            <p class="text-sm text-muted-foreground m-0 leading-relaxed">
              Set the active tab programmatically with the value prop.
            </p>
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
          ><code>&lt;and-tabs value="tab1"&gt;
  &lt;and-tabs-list&gt;
    &lt;and-tabs-trigger value="tab1"&gt;Tab 1&lt;/and-tabs-trigger&gt;
    &lt;and-tabs-trigger value="tab2"&gt;Tab 2&lt;/and-tabs-trigger&gt;
  &lt;/and-tabs-list&gt;
  &lt;and-tabs-content value="tab1"&gt;
    Content for tab 1
  &lt;/and-tabs-content&gt;
  &lt;and-tabs-content value="tab2"&gt;
    Content for tab 2
  &lt;/and-tabs-content&gt;
&lt;/and-tabs&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class TabsDemo {}
