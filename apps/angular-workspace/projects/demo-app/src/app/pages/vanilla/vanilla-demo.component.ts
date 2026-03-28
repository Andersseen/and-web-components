import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Vanilla Components Demo
 *
 * This page allows testing vanilla components while they are being developed.
 * Vanilla components are pure web components without Stencil runtime.
 */

@Component({
  selector: 'app-vanilla-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="vanilla-demo">
      <!-- Header -->
      <div class="page-header">
        <h1>Vanilla Components</h1>
        <p class="subtitle">Pure Web Components without framework - Zero runtime dependencies</p>
      </div>

      <!-- Info Banner -->
      <div class="info-banner">
        <div class="info-content">
          <strong>Development Mode:</strong>
          This section is designed to test vanilla components while they are being developed. Vanilla components use
          native Web APIs without Stencil runtime.
          <br />
          <a href="#/components/button" class="link">View Stencil version -></a>
        </div>
      </div>

      <!-- Button Component Demo -->
      <div class="section" id="button">
        <h2>Button</h2>

        <div class="demo-grid">
          <!-- Variants -->
          <div class="panel">
            <h3>Variants</h3>
            <div class="button-group">
              <and-button variant="default">Default</and-button>
              <and-button variant="secondary">Secondary</and-button>
              <and-button variant="outline">Outline</and-button>
              <and-button variant="ghost">Ghost</and-button>
              <and-button variant="destructive">Destructive</and-button>
              <and-button variant="link">Link</and-button>
            </div>
          </div>

          <!-- Sizes -->
          <div class="panel">
            <h3>Sizes</h3>
            <div class="size-demo">
              <div class="size-row">
                <span class="size-label">sm:</span>
                <and-button size="sm" variant="default">Small</and-button>
              </div>
              <div class="size-row">
                <span class="size-label">default:</span>
                <and-button size="default" variant="default">Default</and-button>
              </div>
              <div class="size-row">
                <span class="size-label">lg:</span>
                <and-button size="lg" variant="default">Large</and-button>
              </div>
              <div class="size-row">
                <span class="size-label">icon:</span>
                <and-button size="icon" variant="default">Star</and-button>
              </div>
            </div>
          </div>

          <!-- States -->
          <div class="panel">
            <h3>States</h3>
            <div class="state-demo">
              <div class="state-row">
                <span class="state-label">Normal:</span>
                <and-button variant="default">Clickable</and-button>
              </div>
              <div class="state-row">
                <span class="state-label">Disabled:</span>
                <and-button variant="default" disabled>Disabled</and-button>
              </div>
              <div class="state-row">
                <span class="state-label">Loading:</span>
                <and-button variant="default" loading>Loading</and-button>
              </div>
            </div>
          </div>

          <!-- Interactive -->
          <div class="panel">
            <h3>Interactive Test</h3>
            <div class="interactive-demo">
              <div class="controls">
                <div class="control-group">
                  <label>Variant:</label>
                  <select [(ngModel)]="selectedVariant">
                    <option value="default">Default</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                    <option value="destructive">Destructive</option>
                    <option value="link">Link</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>Size:</label>
                  <select [(ngModel)]="selectedSize">
                    <option value="sm">Small</option>
                    <option value="default">Default</option>
                    <option value="lg">Large</option>
                    <option value="icon">Icon</option>
                  </select>
                </div>

                <div class="control-group">
                  <label>
                    <input type="checkbox" [(ngModel)]="isDisabled" />
                    Disabled
                  </label>
                </div>

                <div class="control-group">
                  <label>
                    <input type="checkbox" [(ngModel)]="isLoading" />
                    Loading
                  </label>
                </div>
              </div>

              <div class="preview">
                <and-button
                  [attr.variant]="selectedVariant"
                  [attr.size]="selectedSize"
                  [attr.disabled]="isDisabled ? true : null"
                  [attr.loading]="isLoading ? true : null"
                  (click)="onButtonClick($event)"
                >
                  <span *ngIf="isLoading">Loading...</span>
                  <span *ngIf="!isLoading && isDisabled">Disabled</span>
                  <span *ngIf="!isLoading && !isDisabled">Click me!</span>
                </and-button>
              </div>

              <div class="event-log" *ngIf="clickCount > 0">
                <div class="event-badge">Clicks: {{ clickCount }}</div>
              </div>
            </div>
          </div>

          <!-- Code -->
          <div class="panel">
            <h3>Code Example</h3>
            <pre class="code-block"><code></code></pre>
          </div>
        </div>
      </div>

      <!-- Development Guide -->
      <div class="section" id="development">
        <h2>Development Guide</h2>

        <div class="dev-guide">
          <div class="panel">
            <h3>How to add a new component</h3>
            <div class="steps">
              <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                  <strong>Create the vanilla component:</strong>
                  <div class="code-inline">packages/vanilla-components/src/components/new-component/</div>
                </div>
              </div>

              <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                  <strong>Export in index.ts:</strong>
                  <div class="code-inline">export from './components/new-component/new-component';</div>
                </div>
              </div>

              <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                  <strong>Build:</strong>
                  <div class="code-inline">pnpm -C packages/vanilla-components build</div>
                </div>
              </div>

              <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                  <strong>Add to this demo:</strong>
                  Create new section in this file with the component
                </div>
              </div>
            </div>
          </div>

          <div class="panel">
            <h3>Differences with Stencil</h3>
            <div class="comparison-table">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Stencil</th>
                    <th>Vanilla</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Runtime</td>
                    <td>50KB</td>
                    <td>0KB</td>
                  </tr>
                  <tr>
                    <td>Total Bundle</td>
                    <td>90KB</td>
                    <td>15KB</td>
                  </tr>
                  <tr>
                    <td>Build</td>
                    <td>Stencil Compiler</td>
                    <td>Vite + TypeScript</td>
                  </tr>
                  <tr>
                    <td>Debug</td>
                    <td>Compiled code</td>
                    <td>Exact source</td>
                  </tr>
                  <tr>
                    <td>Decorators</td>
                    <td>Stencil decorators</td>
                    <td>Native ES decorators</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .vanilla-demo {
        padding: 1rem;
      }

      .page-header {
        margin-bottom: 2rem;
      }

      .page-header h1 {
        font-size: 1.875rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        color: #64748b;
        font-size: 1rem;
      }

      .section {
        margin-bottom: 3rem;
      }

      .section h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid #e2e8f0;
      }

      .panel {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .panel h3 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }

      .info-banner {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
        border: 1px solid #3b82f6;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-bottom: 2rem;
      }

      .info-content {
        color: #1e40af;
        font-size: 0.875rem;
        line-height: 1.5;
      }

      .info-content strong {
        display: block;
        margin-bottom: 0.25rem;
        color: #1e3a8a;
      }

      .link {
        color: #2563eb;
        text-decoration: underline;
        font-weight: 500;
      }

      .link:hover {
        color: #1d4ed8;
      }

      .demo-grid {
        display: grid;
        gap: 1.5rem;
      }

      .button-group {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
      }

      .size-demo {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .size-row {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .size-label {
        font-size: 0.875rem;
        color: #64748b;
        min-width: 4rem;
        font-family: monospace;
      }

      .state-demo {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .state-row {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .state-label {
        font-size: 0.875rem;
        color: #64748b;
        min-width: 5rem;
      }

      .interactive-demo {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .controls {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.5rem;
      }

      .control-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .control-group label {
        font-size: 0.875rem;
        font-weight: 500;
        color: #374151;
      }

      .control-group select {
        padding: 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        background: white;
      }

      .control-group input[type='checkbox'] {
        margin-right: 0.5rem;
      }

      .preview {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
        background: white;
        border: 2px dashed #e5e7eb;
        border-radius: 0.5rem;
        min-height: 100px;
      }

      .event-log {
        display: flex;
        justify-content: center;
      }

      .event-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: #10b981;
        color: white;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .dev-guide {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .steps {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .step {
        display: flex;
        align-items: flex-start;
        gap: 1rem;
      }

      .step-number {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        background: #3b82f6;
        color: white;
        border-radius: 50%;
        font-weight: 600;
        font-size: 0.875rem;
        flex-shrink: 0;
      }

      .step-content {
        font-size: 0.875rem;
        line-height: 1.5;
        color: #374151;
      }

      .code-inline {
        display: inline-block;
        background: #f3f4f6;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-family: monospace;
        font-size: 0.8em;
        margin-top: 0.25rem;
      }

      .comparison-table {
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }

      th,
      td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #e5e7eb;
      }

      th {
        background: #f9fafb;
        font-weight: 600;
        color: #111827;
      }

      tr:hover {
        background: #f9fafb;
      }

      .code-block {
        background: #1e293b;
        color: #e2e8f0;
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        font-family: monospace;
        font-size: 0.875rem;
      }
    `,
  ],
})
export default class VanillaDemoComponent implements OnInit {
  // State for the interactive demo
  selectedVariant = 'default';
  selectedSize = 'default';
  isDisabled = false;
  isLoading = false;
  clickCount = 0;

  async ngOnInit() {
    // Load vanilla components dynamically
    // Note: Vanilla components will load when the package is built
    console.log('Vanilla Demo loaded');
  }

  onButtonClick(event: Event): void {
    this.clickCount++;
    console.log('Button clicked!', event);
  }
}
