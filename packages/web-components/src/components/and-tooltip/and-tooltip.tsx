import { Component, Host, h, Prop, State, Element, Watch } from '@stencil/core';
import { createTooltip, type TooltipPlacement, type TooltipReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';
import { tooltipVariants } from './and-tooltip-variants';

/**
 * Wraps its slotted trigger and shows a `role="tooltip"` popup on hover
 * *or* keyboard focus (via `focusin`/`focusout`, not just mouse), per
 * WCAG 1.4.13.
 *
 * Known limitation: `aria-describedby` is applied to the `<and-tooltip>`
 * host element, not to the slotted trigger itself (a custom element can't
 * reach into and mutate arbitrary slotted content). If your trigger is a
 * focusable element like a `<button>`, consider also adding
 * `aria-describedby` on it directly, pointing at this tooltip, for the
 * most reliable screen-reader announcement.
 *
 * @example
 * ```html
 * <and-tooltip content="More info" placement="top">
 *   <button>Hover me</button>
 * </and-tooltip>
 * ```
 */
@Component({
  tag: 'and-tooltip',
  styleUrls: ['../../global/component-base.css', '../../global/animations.css', 'and-tooltip.css'],
  shadow: true,
})
export class AndTooltip {
  @Element() el!: HTMLElement;

  /** Text content of the tooltip (alternative: use the `content` slot). */
  @Prop() content!: string;

  /** Preferred placement of the tooltip relative to its trigger. */
  @Prop({ reflect: true }) placement: TooltipPlacement = 'top';

  /** Delay in ms before showing the tooltip. */
  @Prop() openDelay: number = 0;

  /** Delay in ms before hiding the tooltip. */
  @Prop() closeDelay: number = 0;

  @State() private isVisible: boolean = false;

  private tooltipLogic!: TooltipReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    applyGlobalAnimationFlag(this.el);
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
        {...triggerProps}
        onMouseEnter={() => this.tooltipLogic.handleMouseEnter()}
        onMouseLeave={() => this.tooltipLogic.handleMouseLeave()}
        onFocusin={() => this.tooltipLogic.handleFocusIn()}
        onFocusout={() => this.tooltipLogic.handleFocusOut()}
      >
        <div class="relative inline-block">
          {/* Trigger */}
          <div class="inline-block relative">
            <slot />
          </div>

          {/* Tooltip Content */}
          <div
            class={cn(tooltipVariants({ placement: this.placement, visible: this.isVisible }))}
            role="tooltip"
            data-state={this.isVisible ? 'open' : 'closed'}
            data-side={this.placement}
            {...tooltipProps}
          >
            {this.content || <slot name="content" />}
          </div>
        </div>
      </Host>
    );
  }
}
