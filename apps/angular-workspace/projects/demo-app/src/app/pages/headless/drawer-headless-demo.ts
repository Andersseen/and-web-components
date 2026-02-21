import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDrawer, type DrawerPlacement } from '@andersseen/headless-components';

@Component({
  selector: 'app-drawer-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Drawer / Sheet
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A panel that slides out from the edge of the screen. Manages
          open/close state, keyboard navigation, and ARIA dialog semantics.
        </p>
      </header>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Preview
        </h2>
        <div class="rounded-xl border border-border bg-card shadow-sm">
          <div class="p-12 flex items-center justify-center min-h-[200px]">
            <div class="flex flex-wrap gap-3 justify-center">
              <button
                class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                (click)="openDrawer('left')"
              >
                ← Left
              </button>
              <button
                class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                (click)="openDrawer('right')"
              >
                Right →
              </button>
              <button
                class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                (click)="openDrawer('top')"
              >
                ↑ Top
              </button>
              <button
                class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground"
                (click)="openDrawer('bottom')"
              >
                ↓ Bottom
              </button>
            </div>
          </div>
        </div>

        @if (isOpen()) {
          <div
            class="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm animate-fade-in"
            (click)="onOverlayClick()"
          ></div>
          <div
            [class]="
              'fixed z-50 bg-card border border-border flex flex-col shadow-2xl transition-transform ease-in-out duration-300 ' +
              getPlacementClasses(placement())
            "
            role="dialog"
            aria-modal="true"
            tabindex="-1"
          >
            <div
              class="flex items-center justify-between p-5 border-b border-border"
            >
              <h3 class="text-lg font-semibold text-foreground m-0">
                Drawer ({{ placement() }})
              </h3>
              <button
                class="w-7 h-7 flex items-center justify-center rounded bg-transparent border-0 text-muted-foreground cursor-pointer hover:bg-accent hover:text-foreground text-sm"
                aria-label="Close"
                (click)="closeDrawer()"
              >
                ✕
              </button>
            </div>
            <div
              class="flex-1 p-6 overflow-y-auto text-muted-foreground text-sm leading-relaxed"
            >
              <p>
                This drawer slides in from the <strong>{{ placement() }}</strong
                >. Press <kbd>Escape</kbd> or click the overlay to close.
              </p>
              <div class="mt-4 grid gap-2">
                <div class="text-[13px] text-foreground">
                  ✓ Escape key to close
                </div>
                <div class="text-[13px] text-foreground">
                  ✓ Overlay click to close
                </div>
                <div class="text-[13px] text-foreground">
                  ✓ ARIA dialog role
                </div>
                <div class="text-[13px] text-foreground">✓ 4 placements</div>
              </div>
            </div>
            <div class="flex justify-end gap-2 p-5 border-t border-border">
              <button
                class="px-4 py-2 rounded-md text-sm font-medium bg-transparent text-foreground border border-border cursor-pointer hover:bg-accent"
                (click)="closeDrawer()"
              >
                Cancel
              </button>
              <button
                class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground border-0 cursor-pointer hover:opacity-90"
                (click)="closeDrawer()"
              >
                Save Changes
              </button>
            </div>
          </div>
        }
      </section>

      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl bg-primary-950 border border-primary-900 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-primary-200"
          ><code>import {{ '{' }} createDrawer {{ '}' }} from '@andersseen/headless-components';

const drawer = createDrawer({{ '{' }}
    placement: 'left',
    closeOnEscape: true,
    closeOnOverlayClick: true
{{ '}' }});

drawer.actions.open();
drawer.actions.close();
drawer.actions.setPlacement('right');</code></pre>
        </div>
      </section>

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
          The headless core manages open/close, Escape key, and overlay click.
        </p>
        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
          <button (click)="openRaw()">Open Raw Drawer</button>
          @if (isRawOpen()) {
            <div
              (click)="closeRaw()"
              style="position:fixed;inset:0;background:hsl(var(--foreground) / 0.3);z-index:100;"
            ></div>
            <div
              style="position:fixed;top:0;left:0;bottom:0;width:280px;background:white;border-right:1px solid #999;z-index:101;padding:16px;"
            >
              <h4 style="margin:0 0 8px;">Raw Drawer</h4>
              <p style="color:#555;font-size:14px;">
                Unstyled drawer powered by headless core.
              </p>
              <button (click)="closeRaw()">Close</button>
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

      @keyframes slideLeft {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }
      .animate-slide-left {
        animation: slideLeft 0.3s ease;
      }

      @keyframes slideRight {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      .animate-slide-right {
        animation: slideRight 0.3s ease;
      }

      @keyframes slideTop {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .animate-slide-top {
        animation: slideTop 0.3s ease;
      }

      @keyframes slideBottom {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      .animate-slide-bottom {
        animation: slideBottom 0.3s ease;
      }
    `,
  ],
  host: { '(document:keydown)': 'onKeyDown($event)' },
})
export default class DrawerHeadlessDemo {
  private _drawer = createDrawer({
    closeOnEscape: true,
    closeOnOverlayClick: true,
    onOpenChange: () => this.state.set(this._drawer.state),
  });
  private _raw = createDrawer({
    placement: 'left',
    closeOnEscape: true,
    onOpenChange: () => this.rawState.set(this._raw.state),
  });

  state = signal(this._drawer.state);
  rawState = signal(this._raw.state);

  isOpen() {
    return this.state().isOpen;
  }
  placement() {
    return this.state().placement;
  }
  isRawOpen() {
    return this.rawState().isOpen;
  }

  getPlacementClasses(placement: string): string {
    switch (placement) {
      case 'left':
        return 'top-0 left-0 bottom-0 w-96 animate-slide-left border-r';
      case 'right':
        return 'top-0 right-0 bottom-0 w-96 animate-slide-right border-l';
      case 'top':
        return 'top-0 left-0 right-0 h-80 animate-slide-top border-b';
      case 'bottom':
        return 'bottom-0 left-0 right-0 h-80 animate-slide-bottom border-t';
      default:
        return '';
    }
  }

  openDrawer(side: DrawerPlacement) {
    this._drawer.actions.setPlacement(side);
    this._drawer.actions.open();
    this.state.set(this._drawer.state);
  }
  closeDrawer() {
    this._drawer.actions.close();
    this.state.set(this._drawer.state);
  }
  onOverlayClick() {
    this._drawer.handleOverlayClick();
    this.state.set(this._drawer.state);
  }
  onKeyDown(e: KeyboardEvent) {
    this._drawer.handleKeyDown(e);
    this.state.set(this._drawer.state);
    this._raw.handleKeyDown(e);
    this.rawState.set(this._raw.state);
  }
  openRaw() {
    this._raw.actions.open();
    this.rawState.set(this._raw.state);
  }
  closeRaw() {
    this._raw.actions.close();
    this.rawState.set(this._raw.state);
  }
}
