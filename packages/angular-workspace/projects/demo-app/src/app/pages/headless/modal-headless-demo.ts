import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createModal } from '@andersseen/headless-core';

@Component({
  selector: 'app-modal-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-page">
      <!-- Header -->
      <header class="demo-header">
        <h1 class="demo-title">Modal / Dialog</h1>
        <p class="demo-description">
          A window overlaid on the primary content. Manages focus trapping,
          keyboard navigation, and ARIA dialog semantics.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="demo-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-card">
          <div class="preview-area">
            <button class="trigger-btn" (click)="openModal()">
              Open Modal
            </button>
          </div>
        </div>

        <!-- Modal Overlay + Content -->
        @if (isOpen()) {
          <div
            class="modal-overlay"
            (click)="onOverlayClick()"
            [attr.data-state]="isOpen() ? 'open' : 'closed'"
          ></div>
          <div class="modal-container">
            <div
              class="modal-content"
              role="dialog"
              aria-modal="true"
              [attr.data-state]="isOpen() ? 'open' : 'closed'"
              tabindex="-1"
            >
              <div class="modal-header">
                <h3 class="modal-title">Are you sure?</h3>
                <p class="modal-desc">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </p>
              </div>
              <div class="modal-footer">
                <button class="btn-cancel" (click)="closeModal()">
                  Cancel
                </button>
                <button class="btn-confirm" (click)="confirm()">
                  Continue
                </button>
              </div>
              <button
                class="btn-close"
                aria-label="Close"
                (click)="closeModal()"
              >
                ✕
              </button>
            </div>
          </div>
        }
      </section>

      <!-- Usage Code -->
      <section class="demo-section">
        <h2 class="section-title">Usage</h2>
        <div class="code-block">
          <pre><code>import {{ '{' }} createModal {{ '}' }} from '@andersseen/headless-core';

const modal = createModal({{ '{' }}
    closeOnEscape: true,
    closeOnOverlayClick: true,
    onOpenChange: (isOpen) => console.log(isOpen)
{{ '}' }});

// Open / Close / Toggle
modal.actions.open();
modal.actions.close();
modal.actions.toggle();

// Get props for elements
const overlayProps = modal.getOverlayProps();
const contentProps = modal.getContentProps();
const closeProps = modal.getCloseButtonProps();

// Attach keyboard handler
window.addEventListener('keydown', modal.handleKeyDown);</code></pre>
        </div>
      </section>

      <!-- Headless Raw Example -->
      <section class="demo-section">
        <div class="headless-header">
          <h2 class="section-title">Headless Implementation</h2>
          <span class="badge">Zero Styles</span>
        </div>
        <p class="demo-description" style="margin-bottom: 1.5rem;">
          The headless core manages open/close state, Escape key, and overlay
          click. You just render the elements.
        </p>
        <div class="headless-area">
          <button (click)="openRaw()">Open Raw Modal</button>

          @if (isRawOpen()) {
            <div
              (click)="closeRaw()"
              style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:100;"
            ></div>
            <div
              style="position:fixed;inset:0;z-index:101;display:flex;align-items:center;justify-content:center;pointer-events:none;"
            >
              <div
                style="background:white;border:1px solid #999;padding:24px;pointer-events:auto;max-width:400px;width:100%;"
              >
                <h4 style="margin:0 0 8px 0;">Raw Modal</h4>
                <p style="margin:0 0 16px 0;color:#555;">
                  This is a completely unstyled modal powered by the headless
                  core.
                </p>
                <button (click)="closeRaw()">Close</button>
              </div>
            </div>
          }
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
        padding: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      }

      /* Trigger */
      .trigger-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        height: 2.5rem;
        padding: 0 1.25rem;
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        border: none;
        cursor: pointer;
        transition: all 0.15s ease;
      }

      .trigger-btn:hover {
        opacity: 0.9;
      }

      /* Modal */
      .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 50;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease;
      }

      .modal-container {
        position: fixed;
        inset: 0;
        z-index: 51;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }

      .modal-content {
        position: relative;
        width: 100%;
        max-width: 28rem;
        border-radius: 0.75rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--card));
        padding: 1.5rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        pointer-events: auto;
        animation: scaleIn 0.2s ease;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .modal-header {
        margin-bottom: 1.5rem;
      }

      .modal-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: hsl(var(--foreground));
        margin: 0 0 0.5rem 0;
      }

      .modal-desc {
        font-size: 0.875rem;
        color: hsl(var(--muted-foreground));
        line-height: 1.6;
        margin: 0;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
      }

      .btn-cancel {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        background: transparent;
        color: hsl(var(--foreground));
        border: 1px solid hsl(var(--border));
        cursor: pointer;
        transition: background 0.15s ease;
      }

      .btn-cancel:hover {
        background: hsl(var(--accent));
      }

      .btn-confirm {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        border: none;
        cursor: pointer;
        transition: opacity 0.15s ease;
      }

      .btn-confirm:hover {
        opacity: 0.9;
      }

      .btn-close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        width: 1.75rem;
        height: 1.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.25rem;
        background: none;
        border: none;
        color: hsl(var(--muted-foreground));
        cursor: pointer;
        font-size: 0.875rem;
        transition: all 0.15s ease;
      }

      .btn-close:hover {
        background: hsl(var(--accent));
        color: hsl(var(--foreground));
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
  host: {
    '(document:keydown)': 'onKeyDown($event)',
  },
})
export default class ModalHeadlessDemo {
  private _modal = createModal({
    closeOnEscape: true,
    closeOnOverlayClick: true,
    onOpenChange: (isOpen: boolean) => {
      this.state.set(this._modal.state);
      console.log('Modal open:', isOpen);
    },
  });

  private _rawModal = createModal({
    closeOnEscape: true,
    closeOnOverlayClick: true,
    onOpenChange: () => this.rawState.set(this._rawModal.state),
  });

  state = signal(this._modal.state);
  rawState = signal(this._rawModal.state);

  isOpen() {
    return this.state().isOpen;
  }

  isRawOpen() {
    return this.rawState().isOpen;
  }

  openModal() {
    this._modal.actions.open();
    this.state.set(this._modal.state);
  }

  closeModal() {
    this._modal.actions.close();
    this.state.set(this._modal.state);
  }

  confirm() {
    console.log('Confirmed!');
    this.closeModal();
  }

  onOverlayClick() {
    this._modal.handleOverlayClick();
    this.state.set(this._modal.state);
  }

  onKeyDown(event: KeyboardEvent) {
    this._modal.handleKeyDown(event);
    this.state.set(this._modal.state);
    this._rawModal.handleKeyDown(event);
    this.rawState.set(this._rawModal.state);
  }

  openRaw() {
    this._rawModal.actions.open();
    this.rawState.set(this._rawModal.state);
  }

  closeRaw() {
    this._rawModal.actions.close();
    this.rawState.set(this._rawModal.state);
  }
}
