import { Component } from '@angular/core';
import {
  AndButton,
  AndTooltip,
} from '@angular-components/stencil-generated/components';

@Component({
  selector: 'app-tooltip-demo',
  imports: [AndButton, AndTooltip],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Tooltip
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Contextual information revealed on hover or focus. Tooltips provide
          brief, helpful text for UI elements without cluttering the interface.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Placements
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-wrap items-center justify-center gap-4 min-h-[180px]"
          >
            <and-tooltip content="Appears on top" placement="top">
              <and-button variant="outline">Top</and-button>
            </and-tooltip>

            <and-tooltip content="Appears on the right" placement="right">
              <and-button variant="outline">Right</and-button>
            </and-tooltip>

            <and-tooltip content="Appears on the bottom" placement="bottom">
              <and-button variant="outline">Bottom</and-button>
            </and-tooltip>

            <and-tooltip content="Appears on the left" placement="left">
              <and-button variant="outline">Left</and-button>
            </and-tooltip>
          </div>
        </div>
      </section>

      <!-- Real-world Examples -->
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Real-world Examples
        </h2>
        <div
          class="rounded-xl border border-border bg-card overflow-hidden shadow-sm"
        >
          <div
            class="p-10 flex flex-wrap items-center justify-center gap-4 min-h-[120px]"
          >
            <and-tooltip content="Edit this item" placement="top">
              <and-button variant="ghost" size="icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                  />
                  <path
                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                  />
                </svg>
              </and-button>
            </and-tooltip>

            <and-tooltip content="Share with others" placement="top">
              <and-button variant="ghost" size="icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </and-button>
            </and-tooltip>

            <and-tooltip content="Delete permanently" placement="top">
              <and-button variant="ghost" size="icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path
                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                  />
                </svg>
              </and-button>
            </and-tooltip>

            <and-tooltip content="Download file" placement="top">
              <and-button variant="ghost" size="icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </and-button>
            </and-tooltip>
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
          ><code>&lt;and-tooltip content="Tooltip text" placement="top"&gt;
  &lt;and-button&gt;Hover me&lt;/and-button&gt;
&lt;/and-tooltip&gt;

&lt;!-- Placements: top | right | bottom | left --&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
})
export default class TooltipDemo {}
