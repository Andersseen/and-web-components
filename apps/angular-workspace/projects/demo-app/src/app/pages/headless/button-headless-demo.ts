import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createButton } from '@andersseen/headless-core';

@Component({
  selector: 'app-button-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Button
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Displays a button or a component that looks like a button. Handles
          loading states, disabled states, and accessibility automatically.
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
          <div
            class="p-10 flex flex-wrap items-center justify-center gap-3 min-h-[160px]"
          >
            <!-- Primary -->
            <button
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border-0 cursor-pointer transition-colors outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-primary text-primary-foreground hover:opacity-90"
              [disabled]="loading()"
              (click)="handleClick('Primary')"
            >
              @if (loading()) {
                <svg
                  class="w-4 h-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              }
              Primary
            </button>

            <!-- Secondary -->
            <button
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border-0 cursor-pointer transition-colors outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-secondary text-secondary-foreground hover:opacity-80"
              (click)="handleClick('Secondary')"
            >
              Secondary
            </button>

            <!-- Destructive -->
            <button
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border-0 cursor-pointer transition-colors outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-destructive text-destructive-foreground hover:opacity-90"
              (click)="handleClick('Destructive')"
            >
              Destructive
            </button>

            <!-- Outline -->
            <button
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 cursor-pointer transition-colors outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent text-foreground border border-border hover:bg-accent hover:text-accent-foreground"
              (click)="handleClick('Outline')"
            >
              Outline
            </button>

            <!-- Ghost -->
            <button
              class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border-0 cursor-pointer transition-colors outline-none focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
              (click)="handleClick('Ghost')"
            >
              Ghost
            </button>
          </div>

          <!-- Controls -->
          <div
            class="border-t border-border bg-muted px-6 py-4 flex justify-center"
          >
            <label
              class="flex items-center gap-2 text-sm text-foreground cursor-pointer"
            >
              <input
                type="checkbox"
                class="accent-primary"
                [checked]="loading()"
                (change)="toggleLoading()"
              />
              Simulate Loading
            </label>
          </div>
        </div>
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
          ><code>import {{ '{' }} createButton {{ '}' }} from '@andersseen/headless-core';

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
          This is the naked, unstyled behavior. It handles state logic (like
          disabled attributes) but doesn't prescribe any look.
        </p>

        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
          <div class="flex flex-col gap-3 max-w-[300px]">
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
