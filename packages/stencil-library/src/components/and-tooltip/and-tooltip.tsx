import { Component, Host, h, Prop, State, Element, Watch } from '@stencil/core';
import { cva } from 'class-variance-authority';
import { createTooltip, type TooltipPlacement, type TooltipReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Variants
 * ──────────────────────────────────────────────────────────────────── */

const tooltipVariants = cva(
  [
    'absolute z-50 overflow-hidden rounded-md border border-border',
    'bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md whitespace-nowrap',
    'animate-in fade-in-0 zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  ].join(' '),
  {
    variants: {
      placement: {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      },
      visible: {
        true: 'opacity-100 visible',
        false: 'opacity-0 invisible pointer-events-none',
      },
    },
    defaultVariants: {
      placement: 'top',
      visible: false,
    },
  },
);

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-tooltip',
  styleUrls: ['and-tooltip.css', '../../global/global.css'],
  shadow: true,
})
export class AndTooltip {
  @Element() el: HTMLElement;

  /** Text content of the tooltip (alternative: use the `content` slot). */
  @Prop() content: string;

  /** Preferred placement of the tooltip relative to its trigger. */
  @Prop({ reflect: true }) placement: TooltipPlacement = 'top';

  /** Delay in ms before showing the tooltip. */
  @Prop() openDelay: number = 0;

  /** Delay in ms before hiding the tooltip. */
  @Prop() closeDelay: number = 0;

  @State() private isVisible: boolean = false;

  private tooltipLogic: TooltipReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.tooltipLogic = createTooltip({
      placement: this.placement,
      openDelay: this.openDelay,
      closeDelay: this.closeDelay,
      onVisibilityChange: (isVisible: boolean) => {
        this.isVisible = isVisible;
      },
    });
  }

  disconnectedCallback() {
    this.tooltipLogic.destroy();
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('placement')
  placementChanged(newValue: TooltipPlacement) {
    this.tooltipLogic.actions.setPlacement(newValue);
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const triggerProps = this.tooltipLogic.getTriggerProps();
    const tooltipProps = this.tooltipLogic.getTooltipProps();

    return (
      <Host
        onMouseEnter={() => this.tooltipLogic.handleMouseEnter()}
        onMouseLeave={() => this.tooltipLogic.handleMouseLeave()}
        onFocusin={() => this.tooltipLogic.handleFocusIn()}
        onFocusout={() => this.tooltipLogic.handleFocusOut()}
      >
        <div class="relative inline-block">
          {/* Trigger */}
          <div class="inline-block relative" {...triggerProps}>
            <slot />
          </div>

          {/* Tooltip Content */}
          <div
            class={cn(tooltipVariants({ placement: this.placement, visible: this.isVisible }))}
            role="tooltip"
            {...tooltipProps}
          >
            {this.content || <slot name="content" />}
          </div>
        </div>
      </Host>
    );
  }
}
