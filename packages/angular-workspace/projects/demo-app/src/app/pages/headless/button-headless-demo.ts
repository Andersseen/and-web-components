import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createButton } from '@andersseen/headless-core';

@Component({
  selector: 'app-button-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-page">
      <!-- Header -->
      <header class="demo-header">
        <h1 class="demo-title">Button</h1>
        <p class="demo-description">
          Displays a button or a component that looks like a button. Handles
          loading states, disabled states, and accessibility automatically.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="demo-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-card">
          <div class="preview-area">
            <!-- Primary -->
            <button
              class="btn btn-primary"
              [disabled]="loading()"
              (click)="handleClick('Primary')"
            >
              @if (loading()) {
                <svg
                  class="spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="spinner-track"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="spinner-head"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              }
              Primary
            </button>

            <!-- Secondary -->
            <button
              class="btn btn-secondary"
              (click)="handleClick('Secondary')"
            >
              Secondary
            </button>

            <!-- Destructive -->
            <button
              class="btn btn-destructive"
              (click)="handleClick('Destructive')"
            >
              Destructive
            </button>

            <!-- Outline -->
            <button class="btn btn-outline" (click)="handleClick('Outline')">
              Outline
            </button>

            <!-- Ghost -->
            <button class="btn btn-ghost" (click)="handleClick('Ghost')">
              Ghost
            </button>
          </div>

          <!-- Controls -->
          <div class="preview-controls">
            <label class="control-label">
              <input
                type="checkbox"
                [checked]="loading()"
                (change)="toggleLoading()"
              />
              Simulate Loading
            </label>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="demo-section">
        <h2 class="section-title">Usage</h2>
        <div class="code-block">
          <pre><code>import {{ '{' }} createButton {{ '}' }} from '@andersseen/headless-core';

const btn = createButton({{ '{' }}
  disabled: false,
  loading: false
{{ '}' }});

// Get props for your button element
const props = btn.getButtonProps();

// Update state
btn.actions.setLoading(true);
btn.actions.setDisabled(true);</code></pre>
        </div>
      </section>

      <!-- Raw Example -->
      <section class="demo-section">
        <div class="headless-header">
          <h2 class="section-title">Headless Implementation</h2>
          <span class="badge">Zero Styles</span>
        </div>

        <p class="demo-description" style="margin-bottom: 1.5rem;">
          This is the naked, unstyled behavior. It handles state logic (like
          disabled attributes) but doesn't prescribe any look.
        </p>

        <div class="headless-area">
          <div
            style="display: flex; flex-direction: column; gap: 12px; max-width: 300px;"
          >
            <button
              type="button"
              [attr.disabled]="btnState().disabled ? '' : null"
              (click)="headlessClick()"
            >
              Native Button {{ btnState().loading ? '(Loading...)' : '' }}
            </button>

            <button type="button" (click)="btnActions.toggleLoading()">
              Toggle Loading State
            </button>
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
      }

      .preview-area {
        padding: 2.5rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        min-height: 160px;
      }

      .preview-controls {
        border-top: 1px solid hsl(var(--border));
        background: hsl(var(--muted));
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: center;
      }

      .control-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: hsl(var(--foreground));
        cursor: pointer;
      }

      .control-label input[type='checkbox'] {
        accent-color: hsl(var(--primary));
      }

      /* Button styles */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        white-space: nowrap;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        height: 2.5rem;
        padding: 0 1rem;
        border: none;
        cursor: pointer;
        transition: all 0.15s ease;
        outline: none;
      }

      .btn:focus-visible {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
      }

      .btn:disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .btn-primary {
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
      }

      .btn-primary:hover {
        opacity: 0.9;
      }

      .btn-secondary {
        background: hsl(var(--secondary));
        color: hsl(var(--secondary-foreground));
      }

      .btn-secondary:hover {
        opacity: 0.8;
      }

      .btn-destructive {
        background: hsl(var(--destructive));
        color: hsl(var(--destructive-foreground));
      }

      .btn-destructive:hover {
        opacity: 0.9;
      }

      .btn-outline {
        background: transparent;
        color: hsl(var(--foreground));
        border: 1px solid hsl(var(--border));
      }

      .btn-outline:hover {
        background: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
      }

      .btn-ghost {
        background: transparent;
        color: hsl(var(--foreground));
      }

      .btn-ghost:hover {
        background: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
      }

      .spinner {
        width: 1rem;
        height: 1rem;
        animation: spin 1s linear infinite;
      }

      .spinner-track {
        opacity: 0.25;
      }

      .spinner-head {
        opacity: 0.75;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
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
export default class ButtonHeadlessDemo {
  loading = signal(false);

  private _btn = createButton();
  btnState = signal(this._btn.state);
  btnActions = {
    click: () => alert('Clicked!'),
    toggleLoading: () => {
      this._btn.actions.setLoading(!this._btn.state.loading);
      this.updateState();
    },
  };

  handleClick(variant: string) {
    alert(`${variant} button clicked!`);
  }

  toggleLoading() {
    this.loading.update((v) => !v);
  }

  headlessClick() {
    if (this.btnState().loading || this.btnState().disabled) return;
    alert('Headless Button Clicked');
  }

  private updateState() {
    this.btnState.set({ ...this._btn.state });
  }
}
