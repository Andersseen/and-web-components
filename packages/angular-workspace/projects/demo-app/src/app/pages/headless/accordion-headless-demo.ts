import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createAccordion } from '@andersseen/headless-core';

@Component({
  selector: 'app-accordion-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-page">
      <!-- Header -->
      <header class="demo-header">
        <h1 class="demo-title">Accordion</h1>
        <p class="demo-description">
          A vertically stacked set of interactive headings that each reveal a
          section of content.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="demo-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-card">
          <div class="accordion-root">
            @for (item of faqItems; track item.id) {
              <div class="accordion-item">
                <button
                  class="accordion-trigger"
                  [attr.aria-expanded]="isExpanded(item.id)"
                  (click)="toggleItem(item.id)"
                >
                  <span>{{ item.question }}</span>
                  <svg
                    class="chevron"
                    [class.is-open]="isExpanded(item.id)"
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
                  <div class="accordion-content">
                    <p>{{ item.answer }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="demo-section">
        <h2 class="section-title">Usage</h2>
        <div class="code-block">
          <pre><code>import {{ '{' }} createAccordion {{ '}' }} from '@andersseen/headless-core';

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
      <section class="demo-section">
        <div class="headless-header">
          <h2 class="section-title">Headless Implementation</h2>
          <span class="badge">Zero Styles</span>
        </div>

        <p class="demo-description" style="margin-bottom: 1.5rem;">
          Manages expand/collapse state, ARIA attributes, and multi-item logic.
          No visual opinions.
        </p>

        <div class="headless-area">
          <div>
            @for (item of faqItems; track item.id; let i = $index) {
              <div style="margin-bottom: 4px;">
                <button
                  (click)="toggleItem(item.id)"
                  [style.font-weight]="isExpanded(item.id) ? 'bold' : 'normal'"
                >
                  {{ item.question }}
                </button>
                @if (isExpanded(item.id)) {
                  <div
                    style="padding: 8px 0 8px 16px; border-left: 2px solid #ccc;"
                  >
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
      .demo-page {
        max-width: 56rem;
        margin: 0 auto;
        padding-bottom: 3rem;
      }

      .demo-header {
        margin-bottom: 2.5rem;
        border-bottom: 1px solid hsl(var(--border));
        padding-bottom: 2.5rem;
      }

      .demo-title {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: hsl(var(--foreground));
        margin: 0;
      }

      .demo-description {
        margin-top: 1rem;
        font-size: 1.125rem;
        color: hsl(var(--muted-foreground));
        max-width: 42rem;
        line-height: 1.7;
      }

      .demo-section {
        margin-bottom: 3rem;
      }

      .section-title {
        font-size: 1.375rem;
        font-weight: 600;
        letter-spacing: -0.015em;
        color: hsl(var(--foreground));
        margin: 0 0 1.25rem 0;
      }

      .preview-card {
        border-radius: 0.75rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--card));
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
        padding: 2rem;
      }

      /* Accordion */
      .accordion-root {
        max-width: 32rem;
        margin: 0 auto;
      }

      .accordion-item {
        border-bottom: 1px solid hsl(var(--border));
      }

      .accordion-trigger {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 0;
        font-size: 0.9375rem;
        font-weight: 500;
        font-family: inherit;
        background: none;
        border: none;
        color: hsl(var(--foreground));
        cursor: pointer;
        text-align: left;
        transition: color 0.15s ease;
      }

      .accordion-trigger:hover {
        text-decoration: underline;
      }

      .accordion-trigger:focus-visible {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
        border-radius: 0.25rem;
      }

      .chevron {
        transition: transform 0.2s ease;
        flex-shrink: 0;
        color: hsl(var(--muted-foreground));
      }

      .chevron.is-open {
        transform: rotate(180deg);
      }

      .accordion-content {
        overflow: hidden;
        animation: slideDown 0.2s ease;
      }

      .accordion-content p {
        margin: 0;
        padding: 0 0 1rem 0;
        font-size: 0.875rem;
        color: hsl(var(--muted-foreground));
        line-height: 1.6;
      }

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

      /* Code block */
      .code-block {
        border-radius: 0.75rem;
        background: #0a0a0a;
        border: 1px solid #27272a;
        overflow-x: auto;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .code-block pre {
        margin: 0;
        padding: 1.25rem 1.5rem;
        font-family:
          'SF Mono', 'Fira Code', 'Fira Mono', Menlo, Consolas, monospace;
        font-size: 0.8125rem;
        line-height: 1.7;
        color: #e4e4e7;
      }

      /* Headless section */
      .headless-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
      }

      .badge {
        font-size: 0.6875rem;
        font-weight: 500;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        background: hsl(var(--muted));
        color: hsl(var(--muted-foreground));
        border: 1px solid hsl(var(--border));
        letter-spacing: 0.025em;
      }

      .headless-area {
        border-radius: 0.75rem;
        border: 2px dashed hsl(var(--border));
        padding: 2rem;
        background: hsl(var(--muted) / 0.3);
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
