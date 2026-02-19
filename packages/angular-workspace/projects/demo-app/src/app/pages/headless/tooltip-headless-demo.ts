import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createTooltip } from '@andersseen/headless-core';

@Component({
  selector: 'app-tooltip-headless-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto pb-12">
      <!-- Header -->
      <header class="mb-10 border-b border-border pb-10">
        <h1 class="text-3xl font-bold tracking-tight text-foreground m-0">
          Tooltip
        </h1>
        <p class="mt-4 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          A popup that displays information related to an element when the
          element receives keyboard focus or the mouse hovers over it.
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
          <div class="p-12 flex items-center justify-center min-h-[300px]">
            <div class="grid grid-cols-2 gap-8">
              <!-- Top -->
              <div
                class="relative inline-flex justify-center"
                (mouseenter)="showTop()"
                (mouseleave)="hideTop()"
                (focusin)="showTop()"
                (focusout)="hideTop()"
              >
                <button
                  class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                  tabindex="0"
                >
                  Hover me (Top)
                </button>
                <div
                  class="absolute z-50 px-3 py-1.5 rounded-md bg-popover text-popover-foreground border border-border text-[13px] shadow-md pointer-events-none whitespace-nowrap opacity-0 invisible transition-all duration-150 bottom-full left-1/2 -translate-x-1/2 translate-y-1 mb-2"
                  [class.opacity-100]="isTopVisible()"
                  [class.visible]="isTopVisible()"
                  [class.translate-y-0]="isTopVisible()"
                  role="tooltip"
                >
                  <span>Add to library</span>
                </div>
              </div>

              <!-- Bottom -->
              <div
                class="relative inline-flex justify-center"
                (mouseenter)="showBottom()"
                (mouseleave)="hideBottom()"
                (focusin)="showBottom()"
                (focusout)="hideBottom()"
              >
                <button
                  class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                  tabindex="0"
                >
                  Hover me (Bottom)
                </button>
                <div
                  class="absolute z-50 px-3 py-1.5 rounded-md bg-popover text-popover-foreground border border-border text-[13px] shadow-md pointer-events-none whitespace-nowrap opacity-0 invisible transition-all duration-150 top-full left-1/2 -translate-x-1/2 -translate-y-1 mt-2"
                  [class.opacity-100]="isBottomVisible()"
                  [class.visible]="isBottomVisible()"
                  [class.translate-y-0]="isBottomVisible()"
                  role="tooltip"
                >
                  <span>View details</span>
                </div>
              </div>

              <!-- Left -->
              <div
                class="relative inline-flex justify-center"
                (mouseenter)="showLeft()"
                (mouseleave)="hideLeft()"
                (focusin)="showLeft()"
                (focusout)="hideLeft()"
              >
                <button
                  class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                  tabindex="0"
                >
                  Hover me (Left)
                </button>
                <div
                  class="absolute z-50 px-3 py-1.5 rounded-md bg-popover text-popover-foreground border border-border text-[13px] shadow-md pointer-events-none whitespace-nowrap opacity-0 invisible transition-all duration-150 right-full top-1/2 -translate-y-1/2 translate-x-1 mr-2"
                  [class.opacity-100]="isLeftVisible()"
                  [class.visible]="isLeftVisible()"
                  [class.translate-x-0]="isLeftVisible()"
                  role="tooltip"
                >
                  <span>Edit item</span>
                </div>
              </div>

              <!-- Right -->
              <div
                class="relative inline-flex justify-center"
                (mouseenter)="showRight()"
                (mouseleave)="hideRight()"
                (focusin)="showRight()"
                (focusout)="hideRight()"
              >
                <button
                  class="inline-flex items-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 border border-border bg-transparent text-foreground cursor-pointer transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
                  tabindex="0"
                >
                  Hover me (Right)
                </button>
                <div
                  class="absolute z-50 px-3 py-1.5 rounded-md bg-popover text-popover-foreground border border-border text-[13px] shadow-md pointer-events-none whitespace-nowrap opacity-0 invisible transition-all duration-150 left-full top-1/2 -translate-y-1/2 -translate-x-1 ml-2"
                  [class.opacity-100]="isRightVisible()"
                  [class.visible]="isRightVisible()"
                  [class.translate-x-0]="isRightVisible()"
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
      <section class="mb-12">
        <h2 class="text-xl font-semibold tracking-tight text-foreground mb-5">
          Usage
        </h2>
        <div
          class="rounded-xl bg-[#0a0a0a] border border-zinc-800 overflow-x-auto shadow-sm"
        >
          <pre
            class="m-0 p-5 font-mono text-[13px] leading-relaxed text-zinc-200"
          ><code>import {{ '{' }} createTooltip {{ '}' }} from '@andersseen/headless-core';

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
          The headless core manages visibility with configurable delays. You
          just render the tooltip element.
        </p>
        <div
          class="rounded-xl border-2 border-dashed border-border p-8 bg-muted/30"
        >
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
  styles: [],
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
