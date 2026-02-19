import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createAccordion } from '@andersseen/headless-core';

@Component({
  selector: 'app-accordion-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Accordion
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A vertically stacked set of interactive headings that each reveal a
          section of content.
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
          <div class="max-w-xl mx-auto">
            @for (item of faqItems; track item.id) {
              <div class="border-b border-border">
                <button
                  class="flex w-full items-center justify-between py-4 text-[15px] font-medium bg-transparent border-0 text-foreground cursor-pointer text-left hover:underline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 focus-visible:rounded"
                  [attr.aria-expanded]="isExpanded(item.id)"
                  (click)="toggleItem(item.id)"
                >
                  <span>{{ item.question }}</span>
                  <svg
                    class="shrink-0 text-muted-foreground transition-transform duration-200"
                    [class.rotate-180]="isExpanded(item.id)"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
                @if (isExpanded(item.id)) {
                  <div class="overflow-hidden animate-slide-down">
                    <p
                      class="m-0 pb-4 text-sm text-muted-foreground leading-relaxed"
                    >
                      {{ item.answer }}
                    </p>
                  </div>
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
          ><code>import {{ '{' }} createAccordion {{ '}' }} from '@andersseen/headless-core';

const accordion = createAccordion();

// Toggle an item
accordion.actions.toggle('item-1');

// Check if expanded
accordion.queries.isExpanded('item-1'); // true/false

// Get expanded items
accordion.state.expandedItems; // Set</code></pre>
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
          Manages expand/collapse state, ARIA attributes, and multi-item logic.
          No visual opinions.
        </p>

        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
          <div>
            @for (item of faqItems; track item.id; let i = $index) {
              <div class="mb-1">
                <button
                  (click)="toggleItem(item.id)"
                  [style.font-weight]="isExpanded(item.id) ? 'bold' : 'normal'"
                >
                  {{ item.question }}
                </button>
                @if (isExpanded(item.id)) {
                  <div class="py-2 pl-4 border-l-2 border-[#ccc]">
                    {{ item.answer }}
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      @keyframes slideDown {
        from {
          opacity: 0;
          max-height: 0;
        }
        to {
          opacity: 1;
          max-height: 200px;
        }
      }
      .animate-slide-down {
        animation: slideDown 0.2s ease;
      }
    `,
  ],
})
export default class AccordionHeadlessDemo {
  faqItems = [
    {
      id: 'item-1',
      question: 'Is it accessible?',
      answer:
        'Yes. It adheres to the WAI-ARIA design pattern for accordions. Each trigger has the appropriate aria-expanded attribute and the content sections are properly associated.',
    },
    {
      id: 'item-2',
      question: 'Can I style it entirely?',
      answer:
        'Absolutely. The headless core provides zero visual opinions — it only manages state, keyboard navigation, and ARIA attributes. You have full control over rendering and CSS.',
    },
    {
      id: 'item-3',
      question: 'Is it animated?',
      answer:
        'You control the animations. The headless core provides state information so you can apply CSS transitions or Angular animations however you prefer.',
    },
  ];

  private _accordion = createAccordion();
  expandedItems = signal<Set<string>>(new Set());

  isExpanded(id: string): boolean {
    return this.expandedItems().has(id);
  }

  toggleItem(id: string) {
    this._accordion.actions.toggle(id);
    this.expandedItems.set(new Set(this._accordion.state.expandedItems));
  }
}
