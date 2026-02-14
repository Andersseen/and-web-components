import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createTooltip } from '@andersseen/headless-core';

@Component({
  selector: 'app-tooltip-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="demo-page">
      <!-- Header -->
      <header class="demo-header">
        <h1 class="demo-title">Tooltip</h1>
        <p class="demo-description">
          A popup that displays information related to an element when the
          element receives keyboard focus or the mouse hovers over it.
        </p>
      </header>

      <!-- Preview Section -->
      <section class="demo-section">
        <h2 class="section-title">Preview</h2>
        <div class="preview-card">
          <div class="preview-area">
            <div class="tooltip-grid">
              <!-- Top -->
              <div
                class="tooltip-wrapper"
                (mouseenter)="showTop()"
                (mouseleave)="hideTop()"
                (focusin)="showTop()"
                (focusout)="hideTop()"
              >
                <button class="trigger-btn" tabindex="0">Hover me (Top)</button>
                <div
                  class="tooltip-content tooltip-top"
                  [class.is-visible]="isTopVisible()"
                  role="tooltip"
                >
                  <span>Add to library</span>
                </div>
              </div>

              <!-- Bottom -->
              <div
                class="tooltip-wrapper"
                (mouseenter)="showBottom()"
                (mouseleave)="hideBottom()"
                (focusin)="showBottom()"
                (focusout)="hideBottom()"
              >
                <button class="trigger-btn" tabindex="0">
                  Hover me (Bottom)
                </button>
                <div
                  class="tooltip-content tooltip-bottom"
                  [class.is-visible]="isBottomVisible()"
                  role="tooltip"
                >
                  <span>View details</span>
                </div>
              </div>

              <!-- Left -->
              <div
                class="tooltip-wrapper"
                (mouseenter)="showLeft()"
                (mouseleave)="hideLeft()"
                (focusin)="showLeft()"
                (focusout)="hideLeft()"
              >
                <button class="trigger-btn" tabindex="0">
                  Hover me (Left)
                </button>
                <div
                  class="tooltip-content tooltip-left"
                  [class.is-visible]="isLeftVisible()"
                  role="tooltip"
                >
                  <span>Edit item</span>
                </div>
              </div>

              <!-- Right -->
              <div
                class="tooltip-wrapper"
                (mouseenter)="showRight()"
                (mouseleave)="hideRight()"
                (focusin)="showRight()"
                (focusout)="hideRight()"
              >
                <button class="trigger-btn" tabindex="0">
                  Hover me (Right)
                </button>
                <div
                  class="tooltip-content tooltip-right"
                  [class.is-visible]="isRightVisible()"
                  role="tooltip"
                >
                  <span>Share link</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Usage Code -->
      <section class="demo-section">
        <h2 class="section-title">Usage</h2>
        <div class="code-block">
          <pre><code>import {{ '{' }} createTooltip {{ '}' }} from '@andersseen/headless-core';

const tooltip = createTooltip({{ '{' }}
    placement: 'top',
    openDelay: 200,
    closeDelay: 100,
    onVisibilityChange: (visible) => console.log(visible)
{{ '}' }});

// Attach event handlers
el.addEventListener('mouseenter', tooltip.handleMouseEnter);
el.addEventListener('mouseleave', tooltip.handleMouseLeave);
el.addEventListener('focusin', tooltip.handleFocusIn);
el.addEventListener('focusout', tooltip.handleFocusOut);

// Get props
const triggerProps = tooltip.getTriggerProps();
const tooltipProps = tooltip.getTooltipProps();

// Cleanup
tooltip.destroy();</code></pre>
        </div>
      </section>

      <!-- Headless Raw Example -->
      <section class="demo-section">
        <div class="headless-header">
          <h2 class="section-title">Headless Implementation</h2>
          <span class="badge">Zero Styles</span>
        </div>
        <p class="demo-description" style="margin-bottom: 1.5rem;">
          The headless core manages visibility with configurable delays. You
          just render the tooltip element.
        </p>
        <div class="headless-area">
          <span
            (mouseenter)="showRaw()"
            (mouseleave)="hideRaw()"
            (focusin)="showRaw()"
            (focusout)="hideRaw()"
            style="position:relative;display:inline-block;"
          >
            <button tabindex="0">Hover this native button</button>
            @if (isRawVisible()) {
              <span
                style="position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#333;color:white;padding:4px 8px;font-size:12px;white-space:nowrap;margin-bottom:4px;border-radius:4px;"
              >
                Native tooltip!
              </span>
            }
          </span>
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
        min-height: 300px;
      }

      .tooltip-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      .tooltip-wrapper {
        position: relative;
        display: inline-flex;
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
        transition: all 0.15s ease;
      }

      .trigger-btn:hover {
        background: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
      }

      .trigger-btn:focus-visible {
        outline: 2px solid hsl(var(--ring));
        outline-offset: 2px;
      }

      /* Tooltip content */
      .tooltip-content {
        position: absolute;
        z-index: 50;
        padding: 0.375rem 0.75rem;
        border-radius: 0.375rem;
        background: hsl(var(--popover));
        color: hsl(var(--popover-foreground));
        border: 1px solid hsl(var(--border));
        font-size: 0.8125rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        pointer-events: none;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition:
          opacity 0.15s ease,
          visibility 0.15s ease,
          transform 0.15s ease;
      }

      .tooltip-content.is-visible {
        opacity: 1;
        visibility: visible;
      }

      .tooltip-top {
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(4px);
        margin-bottom: 0.5rem;
      }

      .tooltip-top.is-visible {
        transform: translateX(-50%) translateY(0);
      }

      .tooltip-bottom {
        top: 100%;
        left: 50%;
        transform: translateX(-50%) translateY(-4px);
        margin-top: 0.5rem;
      }

      .tooltip-bottom.is-visible {
        transform: translateX(-50%) translateY(0);
      }

      .tooltip-left {
        right: 100%;
        top: 50%;
        transform: translateY(-50%) translateX(4px);
        margin-right: 0.5rem;
      }

      .tooltip-left.is-visible {
        transform: translateY(-50%) translateX(0);
      }

      .tooltip-right {
        left: 100%;
        top: 50%;
        transform: translateY(-50%) translateX(-4px);
        margin-left: 0.5rem;
      }

      .tooltip-right.is-visible {
        transform: translateY(-50%) translateX(0);
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
export default class TooltipHeadlessDemo implements OnDestroy {
  private _top = createTooltip({
    placement: 'top',
    openDelay: 150,
    closeDelay: 100,
    onVisibilityChange: () => this.topState.set(this._top.state),
  });
  private _bottom = createTooltip({
    placement: 'bottom',
    openDelay: 150,
    closeDelay: 100,
    onVisibilityChange: () => this.bottomState.set(this._bottom.state),
  });
  private _left = createTooltip({
    placement: 'left',
    openDelay: 150,
    closeDelay: 100,
    onVisibilityChange: () => this.leftState.set(this._left.state),
  });
  private _right = createTooltip({
    placement: 'right',
    openDelay: 150,
    closeDelay: 100,
    onVisibilityChange: () => this.rightState.set(this._right.state),
  });
  private _raw = createTooltip({
    placement: 'top',
    openDelay: 0,
    closeDelay: 0,
    onVisibilityChange: () => this.rawState.set(this._raw.state),
  });

  topState = signal(this._top.state);
  bottomState = signal(this._bottom.state);
  leftState = signal(this._left.state);
  rightState = signal(this._right.state);
  rawState = signal(this._raw.state);

  isTopVisible() {
    return this.topState().isVisible;
  }
  isBottomVisible() {
    return this.bottomState().isVisible;
  }
  isLeftVisible() {
    return this.leftState().isVisible;
  }
  isRightVisible() {
    return this.rightState().isVisible;
  }
  isRawVisible() {
    return this.rawState().isVisible;
  }

  showTop() {
    this._top.actions.show();
  }
  hideTop() {
    this._top.actions.hide();
  }
  showBottom() {
    this._bottom.actions.show();
  }
  hideBottom() {
    this._bottom.actions.hide();
  }
  showLeft() {
    this._left.actions.show();
  }
  hideLeft() {
    this._left.actions.hide();
  }
  showRight() {
    this._right.actions.show();
  }
  hideRight() {
    this._right.actions.hide();
  }

  showRaw() {
    this._raw.actions.show();
  }
  hideRaw() {
    this._raw.actions.hide();
  }

  ngOnDestroy() {
    this._top.destroy();
    this._bottom.destroy();
    this._left.destroy();
    this._right.destroy();
    this._raw.destroy();
  }
}
