import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="overview-page">
      <!-- Hero -->
      <div class="hero">
        <h2 class="hero-title">Headless UI</h2>
        <p class="hero-desc">
          Unstyled, accessible UI primitives for building robust design systems.
          <strong>You bring the styles, we handle the logic.</strong>
        </p>
      </div>

      <!-- Benefits Grid -->
      <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-icon" style="color: hsl(239, 84%, 67%);">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </div>
          <h3 class="benefit-title">Total Control</h3>
          <p class="benefit-desc">
            No Shadow DOM, no style overrides. You have direct access to every
            DOM element and can style them with Tailwind, CSS Modules, or
            anything else.
          </p>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon" style="color: hsl(160, 84%, 39%);">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 class="benefit-title">Accessible by Default</h3>
          <p class="benefit-desc">
            We handle the hard parts: ARIA attributes, keyboard navigation,
            focus management, and state logic.
          </p>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon" style="color: hsl(25, 95%, 53%);">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="benefit-title">Framework Agnostic</h3>
          <p class="benefit-desc">
            Pure JavaScript core — works with Angular, React, Vue, or vanilla
            JS. No framework lock-in.
          </p>
        </div>

        <div class="benefit-card">
          <div class="benefit-icon" style="color: hsl(280, 67%, 55%);">
            <svg
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
              />
            </svg>
          </div>
          <h3 class="benefit-title">Type Safe</h3>
          <p class="benefit-desc">
            Full TypeScript support with strongly typed state, actions, and
            configuration options.
          </p>
        </div>
      </div>

      <!-- How it Works -->
      <div class="how-section">
        <h3 class="how-title">How it works</h3>
        <div class="how-card">
          <div class="steps-col">
            <div class="step">
              <span class="step-number">1</span>
              <div>
                <p class="step-title">Initialize Logic</p>
                <p class="step-desc">
                  Create the component logic with a simple function call.
                </p>
              </div>
            </div>
            <div class="step">
              <span class="step-number">2</span>
              <div>
                <p class="step-title">Connect to UI</p>
                <p class="step-desc">
                  Bind state and actions to your native HTML elements.
                </p>
              </div>
            </div>
            <div class="step">
              <span class="step-number">3</span>
              <div>
                <p class="step-title">Style Away</p>
                <p class="step-desc">
                  Apply your classes dynamically based on the state.
                </p>
              </div>
            </div>
          </div>

          <div class="code-col">
            <pre><code><span style="color: #c084fc;">const</span> btn = <span style="color: #93c5fd;">createButton</span>();

<span style="color: #64748b;">// Your native button</span>
&lt;<span style="color: #f472b6;">button</span>
  <span style="color: #86efac;">class</span>="bg-blue-500 text-white ..."
  [<span style="color: #fde68a;">disabled</span>]="btn.state.disabled"
  (<span style="color: #fde68a;">click</span>)="btn.actions.click()"
&gt;
  My Custom Button
&lt;/<span style="color: #f472b6;">button</span>&gt;</code></pre>
          </div>
        </div>
      </div>

      <!-- Available Components -->
      <div class="components-section">
        <h3 class="how-title">Available Components</h3>
        <div class="components-grid">
          <a class="component-card" href="/headless/button">
            <span class="component-icon">🔘</span>
            <span class="component-name">Button</span>
            <span class="component-desc"
              >Loading, disabled, click handling</span
            >
          </a>
          <a class="component-card" href="/headless/dropdown">
            <span class="component-icon">📋</span>
            <span class="component-name">Dropdown</span>
            <span class="component-desc"
              >Menu, keyboard nav, outside click</span
            >
          </a>
          <a class="component-card" href="/headless/tabs">
            <span class="component-icon">📑</span>
            <span class="component-name">Tabs</span>
            <span class="component-desc"
              >Tab panels, ARIA, keyboard support</span
            >
          </a>
          <a class="component-card" href="/headless/accordion">
            <span class="component-icon">🪗</span>
            <span class="component-name">Accordion</span>
            <span class="component-desc">Expand/collapse, multi-select</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .overview-page {
        max-width: 56rem;
        margin: 0 auto;
        padding-bottom: 3rem;
      }

      /* Hero */
      .hero {
        margin-bottom: 3rem;
      }

      .hero-title {
        font-size: 2.25rem;
        font-weight: 700;
        letter-spacing: -0.025em;
        color: hsl(var(--foreground));
        margin: 0;
      }

      .hero-desc {
        font-size: 1.125rem;
        color: hsl(var(--muted-foreground));
        max-width: 36rem;
        line-height: 1.7;
        margin-top: 1rem;
      }

      .hero-desc strong {
        color: hsl(var(--foreground));
      }

      /* Benefits Grid */
      .benefits-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 3rem;
      }

      @media (max-width: 640px) {
        .benefits-grid {
          grid-template-columns: 1fr;
        }
      }

      .benefit-card {
        padding: 1.5rem;
        border-radius: 0.75rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--card));
        transition:
          box-shadow 0.2s ease,
          border-color 0.2s ease;
      }

      .benefit-card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        border-color: hsl(var(--ring));
      }

      .benefit-icon {
        margin-bottom: 1rem;
      }

      .benefit-title {
        font-size: 0.9375rem;
        font-weight: 600;
        color: hsl(var(--foreground));
        margin: 0 0 0.5rem 0;
      }

      .benefit-desc {
        font-size: 0.8125rem;
        color: hsl(var(--muted-foreground));
        line-height: 1.6;
        margin: 0;
      }

      /* How it Works */
      .how-section {
        margin-bottom: 3rem;
      }

      .how-title {
        font-size: 1.375rem;
        font-weight: 600;
        letter-spacing: -0.015em;
        color: hsl(var(--foreground));
        margin: 0 0 1.25rem 0;
      }

      .how-card {
        border-radius: 0.75rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--muted) / 0.3);
        padding: 1.5rem;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: center;
      }

      @media (max-width: 640px) {
        .how-card {
          grid-template-columns: 1fr;
        }
      }

      .steps-col {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }

      .step {
        display: flex;
        gap: 0.75rem;
      }

      .step-number {
        display: flex;
        height: 1.5rem;
        width: 1.5rem;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        border-radius: 9999px;
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        font-size: 0.625rem;
        font-weight: 700;
      }

      .step-title {
        font-size: 0.875rem;
        font-weight: 500;
        color: hsl(var(--foreground));
        margin: 0;
      }

      .step-desc {
        font-size: 0.75rem;
        color: hsl(var(--muted-foreground));
        margin: 0.25rem 0 0 0;
      }

      .code-col {
        border-radius: 0.5rem;
        background: #0a0a0a;
        padding: 1rem;
        overflow-x: auto;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .code-col pre {
        margin: 0;
        font-family: 'SF Mono', 'Fira Code', Menlo, Consolas, monospace;
        font-size: 0.75rem;
        line-height: 1.7;
        color: #dbeafe;
      }

      /* Available Components */
      .components-section {
        margin-bottom: 3rem;
      }

      .components-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.75rem;
      }

      @media (max-width: 640px) {
        .components-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      .component-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 1.5rem 1rem;
        border-radius: 0.75rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--card));
        text-decoration: none;
        transition: all 0.2s ease;
        cursor: pointer;
      }

      .component-card:hover {
        border-color: hsl(var(--primary));
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }

      .component-icon {
        font-size: 1.75rem;
        margin-bottom: 0.75rem;
      }

      .component-name {
        font-size: 0.875rem;
        font-weight: 600;
        color: hsl(var(--foreground));
        margin-bottom: 0.25rem;
      }

      .component-desc {
        font-size: 0.6875rem;
        color: hsl(var(--muted-foreground));
        line-height: 1.4;
      }
    `,
  ],
})
export default class OverviewDemo {}
