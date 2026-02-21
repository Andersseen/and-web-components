import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createModal } from '@andersseen/headless-components';

@Component({
  selector: 'app-modal-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Modal / Dialog
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A window overlaid on the primary content. Manages focus trapping,
          keyboard navigation, and ARIA dialog semantics.
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
          <div class="p-12 flex items-center justify-center min-h-[200px]">
            <button
              class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-5 bg-primary text-primary-foreground border-0 cursor-pointer transition-opacity hover:opacity-90"
              (click)="openModal()"
            >
              Open Modal
            </button>
          </div>
        </div>

        <!-- Modal Overlay + Content -->
        @if (isOpen()) {
          <div
            class="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm animate-fade-in"
            (click)="onOverlayClick()"
            [attr.data-state]="isOpen() ? 'open' : 'closed'"
          ></div>
          <div
            class="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div
              class="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl pointer-events-auto animate-scale-in"
              role="dialog"
              aria-modal="true"
              [attr.data-state]="isOpen() ? 'open' : 'closed'"
              tabindex="-1"
            >
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-foreground m-0 mb-2">
                  Are you sure?
                </h3>
                <p class="text-sm text-muted-foreground leading-relaxed m-0">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </p>
              </div>
              <div class="flex justify-end gap-2">
                <button
                  class="px-4 py-2 rounded-md text-sm font-medium bg-transparent text-foreground border border-border cursor-pointer transition-colors hover:bg-accent"
                  (click)="closeModal()"
                >
                  Cancel
                </button>
                <button
                  class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground border-0 cursor-pointer transition-opacity hover:opacity-90"
                  (click)="confirm()"
                >
                  Continue
                </button>
              </div>
              <button
                class="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded bg-transparent border-0 text-muted-foreground cursor-pointer text-sm transition-all hover:bg-accent hover:text-foreground"
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
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl bg-primary-950 border border-primary-900 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-primary-200"
          ><code>import {{ '{' }} createModal {{ '}' }} from '@andersseen/headless-components';

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
          The headless core manages open/close state, Escape key, and overlay
          click. You just render the elements.
        </p>
        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
          <button (click)="openRaw()">Open Raw Modal</button>

          @if (isRawOpen()) {
            <div
              (click)="closeRaw()"
              style="position:fixed;inset:0;background:hsl(var(--foreground) / 0.4);z-index:100;"
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
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.2s ease;
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
      .animate-scale-in {
        animation: scaleIn 0.2s ease;
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
