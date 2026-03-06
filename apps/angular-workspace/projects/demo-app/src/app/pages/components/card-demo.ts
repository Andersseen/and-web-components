import { Component } from '@angular/core';
import {
  AndCard,
  AndCardHeader,
  AndCardTitle,
  AndCardDescription,
  AndCardContent,
  AndCardFooter,
  AndButton,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-card-demo',
  imports: [AndCard, AndCardHeader, AndCardTitle, AndCardDescription, AndCardContent, AndCardFooter, AndButton],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Card
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Composable card component with optional sub-components for structured
          layouts. Use header, content, and footer to build consistent cards — or
          use it plain with the <code class="bg-muted px-1.5 py-0.5 rounded text-sm">padded</code> prop for simple content.
        </p>
      </header>

      <!-- Preview: Structured Cards -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Structured Cards
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Default -->
              <and-card>
                <and-card-header>
                  <and-card-title>Default Card</and-card-title>
                  <and-card-description>
                    A standard card with subtle border. Ideal for inline content.
                  </and-card-description>
                </and-card-header>
                <and-card-content>
                  <p class="text-sm text-muted-foreground leading-relaxed m-0">
                    Use sub-components to structure your content into clear
                    sections with consistent spacing.
                  </p>
                </and-card-content>
                <and-card-footer>
                  <div class="flex gap-2">
                    <and-button variant="outline" size="sm">Cancel</and-button>
                    <and-button size="sm">Save</and-button>
                  </div>
                </and-card-footer>
              </and-card>

              <!-- Elevated -->
              <and-card variant="elevated">
                <and-card-header>
                  <and-card-title>Elevated Card</and-card-title>
                  <and-card-description>
                    Extra shadow depth for prominent content.
                  </and-card-description>
                </and-card-header>
                <and-card-content>
                  <p class="text-sm text-muted-foreground leading-relaxed m-0">
                    The elevated variant adds deeper shadows, making it ideal
                    for featured or highlighted sections.
                  </p>
                </and-card-content>
              </and-card>

              <!-- Outline -->
              <and-card variant="outline">
                <and-card-header>
                  <and-card-title>Outline Card</and-card-title>
                  <and-card-description>
                    No shadow, just a clean border.
                  </and-card-description>
                </and-card-header>
                <and-card-content>
                  <p class="text-sm text-muted-foreground leading-relaxed m-0">
                    Minimal visual weight — great for secondary content or
                    settings panels.
                  </p>
                </and-card-content>
              </and-card>

              <!-- Ghost -->
              <and-card variant="ghost">
                <and-card-header>
                  <and-card-title>Ghost Card</and-card-title>
                  <and-card-description>
                    No border, no shadow. Just structure.
                  </and-card-description>
                </and-card-header>
                <and-card-content>
                  <p class="text-sm text-muted-foreground leading-relaxed m-0">
                    Invisible container for grouping content with consistent
                    layout but zero visual chrome.
                  </p>
                </and-card-content>
              </and-card>
            </div>
          </div>
        </div>
      </section>

      <!-- Simple (padded) -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Simple Card (padded)
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div class="p-8">
            <and-card padded>
              <p class="text-sm text-muted-foreground leading-relaxed m-0">
                Use <code class="bg-muted px-1.5 py-0.5 rounded text-xs">padded</code>
                when you don't need sub-components — just drop content directly inside.
              </p>
            </and-card>
          </div>
        </div>
      </section>

      <!-- Real-world Examples -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Real-world Examples
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <and-card>
            <and-card-header>
              <and-card-description>Revenue</and-card-description>
              <and-card-title>$45,231</and-card-title>
            </and-card-header>
            <and-card-content>
              <span class="text-xs text-muted-foreground">+20.1% from last month</span>
            </and-card-content>
          </and-card>
          <and-card>
            <and-card-header>
              <and-card-description>Users</and-card-description>
              <and-card-title>+2,350</and-card-title>
            </and-card-header>
            <and-card-content>
              <span class="text-xs text-muted-foreground">+180 since yesterday</span>
            </and-card-content>
          </and-card>
          <and-card>
            <and-card-header>
              <and-card-description>Uptime</and-card-description>
              <and-card-title>99.9%</and-card-title>
            </and-card-header>
            <and-card-content>
              <span class="text-xs text-muted-foreground">Last 30 days</span>
            </and-card-content>
          </and-card>
        </div>
      </section>

      <!-- Notification card example -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Notification Card
        </h2>
        <div class="max-w-md">
          <and-card>
            <and-card-header>
              <and-card-title>Notifications</and-card-title>
              <and-card-description>You have 3 unread messages.</and-card-description>
            </and-card-header>
            <and-card-content>
              <div class="flex flex-col gap-3">
                <div class="flex items-start gap-3 rounded-lg border border-border p-3">
                  <span class="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0"></span>
                  <div>
                    <p class="text-sm font-medium m-0">Your deploy was successful.</p>
                    <p class="text-xs text-muted-foreground m-0 mt-1">2 minutes ago</p>
                  </div>
                </div>
                <div class="flex items-start gap-3 rounded-lg border border-border p-3">
                  <span class="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0"></span>
                  <div>
                    <p class="text-sm font-medium m-0">New team member joined.</p>
                    <p class="text-xs text-muted-foreground m-0 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </and-card-content>
            <and-card-footer>
              <and-button class="w-full">Mark all as read</and-button>
            </and-card-footer>
          </and-card>
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
              >Structured</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-card&gt;
  &lt;and-card-header&gt;
    &lt;and-card-title&gt;Card Title&lt;/and-card-title&gt;
    &lt;and-card-description&gt;Optional subtitle.&lt;/and-card-description&gt;
  &lt;/and-card-header&gt;
  &lt;and-card-content&gt;
    &lt;p&gt;Body content here.&lt;/p&gt;
  &lt;/and-card-content&gt;
  &lt;and-card-footer&gt;
    &lt;and-button variant="outline"&gt;Cancel&lt;/and-button&gt;
    &lt;and-button&gt;Save&lt;/and-button&gt;
  &lt;/and-card-footer&gt;
&lt;/and-card&gt;</code></pre>
        </div>

        <div class="rounded-xl border border-border overflow-x-auto shadow-sm mt-4">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Simple (padded)</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-card padded&gt;
  &lt;p&gt;Quick content without sub-components.&lt;/p&gt;
&lt;/and-card&gt;</code></pre>
        </div>

        <div class="rounded-xl border border-border overflow-x-auto shadow-sm mt-4">
          <div class="bg-muted/50 px-5 py-3 border-b border-border">
            <span
              class="text-xs font-medium text-muted-foreground tracking-wide uppercase"
              >Variants</span
            >
          </div>
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-foreground/80 bg-muted/20"
          ><code>&lt;and-card variant="elevated"&gt;...&lt;/and-card&gt;
&lt;and-card variant="outline"&gt;...&lt;/and-card&gt;
&lt;and-card variant="ghost"&gt;...&lt;/and-card&gt;
&lt;and-card variant="destructive"&gt;...&lt;/and-card&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class CardDemo {}
