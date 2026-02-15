import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createDrawer, type DrawerPlacement } from '@andersseen/headless-core';

@Component({
  selector: 'app-drawer-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-page">
      <header class="demo-header">
        <h1 class="demo-title">Drawer / Sheet</h1>
        <p class="demo-description">
          A panel that slides out from the edge of the screen. Manages
          open/close state, keyboard navigation, and ARIA dialog semantics.
        </p>
      </header>

      <section class="demo-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-card">
          <div class="preview-area">
            <div class="btn-grid">
              <button class="trigger-btn" (click)="openDrawer('left')">
                ← Left
              </button>
              <button class="trigger-btn" (click)="openDrawer('right')">
                Right →
              </button>
              <button class="trigger-btn" (click)="openDrawer('top')">
                ↑ Top
              </button>
              <button class="trigger-btn" (click)="openDrawer('bottom')">
                ↓ Bottom
              </button>
            </div>
          </div>
        </div>

        @if (isOpen()) {
          <div class="drawer-overlay" (click)="onOverlayClick()"></div>
          <div
            [class]="'drawer-panel drawer-' + placement()"
            role="dialog"
            aria-modal="true"
            tabindex="-1"
          >
            <div class="drawer-header">
              <h3 class="drawer-title">Drawer ({{ placement() }})</h3>
              <button
                class="drawer-close"
                aria-label="Close"
                (click)="closeDrawer()"
              >
                ✕
              </button>
            </div>
            <div class="drawer-body">
              <p>
                This drawer slides in from the <strong>{{ placement() }}</strong
                >. Press <kbd>Escape</kbd> or click the overlay to close.
              </p>
              <div class="drawer-feature-list">
                <div class="feature-item">✓ Escape key to close</div>
                <div class="feature-item">✓ Overlay click to close</div>
                <div class="feature-item">✓ ARIA dialog role</div>
                <div class="feature-item">✓ 4 placements</div>
              </div>
            </div>
            <div class="drawer-footer">
              <button class="btn-secondary" (click)="closeDrawer()">
                Cancel
              </button>
              <button class="btn-primary" (click)="closeDrawer()">
                Save Changes
              </button>
            </div>
          </div>
        }
      </section>

      <section class="demo-section">
        <h2 class="section-title">Usage</h2>
        <div class="code-block">
          <pre><code>import {{ '{' }} createDrawer {{ '}' }} from '@andersseen/headless-core';

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

      <section class="demo-section">
        <div class="headless-header">
          <h2 class="section-title">Headless Implementation</h2>
          <span class="badge">Zero Styles</span>
        </div>
        <p class="demo-description" style="margin-bottom:1.5rem;">
          The headless core manages open/close, Escape key, and overlay click.
        </p>
        <div class="headless-area">
          <button (click)="openRaw()">Open Raw Drawer</button>
          @if (isRawOpen()) {
            <div
              (click)="closeRaw()"
              style="position:fixed;inset:0;background:rgba(0,0,0,0.3);z-index:100;"
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
        color: hsl(var(--foreground));
        margin: 0 0 1.25rem 0;
      }
      .preview-card {
        border-radius: 0.75rem;
        border: 1px solid hsl(var(--border));
        background: hsl(var(--card));
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      }
      .preview-area {
        padding: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 200px;
      }
      .btn-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        justify-content: center;
      }
      .trigger-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        height: 2.5rem;
        padding: 0 1rem;
        background: transparent;
        color: hsl(var(--foreground));
        border: 1px solid hsl(var(--border));
        cursor: pointer;
        transition: all 0.15s;
      }
      .trigger-btn:hover {
        background: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
      }

      .drawer-overlay {
        position: fixed;
        inset: 0;
        z-index: 50;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        animation: fadeIn 0.2s ease;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      .drawer-panel {
        position: fixed;
        z-index: 51;
        background: hsl(var(--card));
        border: 1px solid hsl(var(--border));
        display: flex;
        flex-direction: column;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
      }
      .drawer-left {
        top: 0;
        left: 0;
        bottom: 0;
        width: 24rem;
        animation: slideLeft 0.3s ease;
      }
      .drawer-right {
        top: 0;
        right: 0;
        bottom: 0;
        width: 24rem;
        animation: slideRight 0.3s ease;
      }
      .drawer-top {
        top: 0;
        left: 0;
        right: 0;
        height: 20rem;
        animation: slideTop 0.3s ease;
      }
      .drawer-bottom {
        bottom: 0;
        left: 0;
        right: 0;
        height: 20rem;
        animation: slideBottom 0.3s ease;
      }
      @keyframes slideLeft {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }
      @keyframes slideRight {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      @keyframes slideTop {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(0);
        }
      }
      @keyframes slideBottom {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }

      .drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid hsl(var(--border));
      }
      .drawer-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: hsl(var(--foreground));
        margin: 0;
      }
      .drawer-close {
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
      }
      .drawer-close:hover {
        background: hsl(var(--accent));
        color: hsl(var(--foreground));
      }
      .drawer-body {
        flex: 1;
        padding: 1.5rem;
        overflow-y: auto;
        color: hsl(var(--muted-foreground));
        font-size: 0.875rem;
        line-height: 1.7;
      }
      .drawer-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.5rem;
        padding: 1.25rem 1.5rem;
        border-top: 1px solid hsl(var(--border));
      }
      .drawer-feature-list {
        margin-top: 1rem;
        display: grid;
        gap: 0.5rem;
      }
      .feature-item {
        font-size: 0.8125rem;
        color: hsl(var(--foreground));
      }
      .btn-secondary {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        background: transparent;
        color: hsl(var(--foreground));
        border: 1px solid hsl(var(--border));
        cursor: pointer;
      }
      .btn-secondary:hover {
        background: hsl(var(--accent));
      }
      .btn-primary {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        font-family: inherit;
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        border: none;
        cursor: pointer;
      }
      .btn-primary:hover {
        opacity: 0.9;
      }

      .code-block {
        border-radius: 0.75rem;
        background: #0a0a0a;
        border: 1px solid #27272a;
        overflow-x: auto;
      }
      .code-block pre {
        margin: 0;
        padding: 1.25rem 1.5rem;
        font-family: 'SF Mono', Menlo, Consolas, monospace;
        font-size: 0.8125rem;
        line-height: 1.7;
        color: #e4e4e7;
      }
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
      }
      .headless-area {
        border-radius: 0.75rem;
        border: 2px dashed hsl(var(--border));
        padding: 2rem;
        background: hsl(var(--muted) / 0.3);
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
