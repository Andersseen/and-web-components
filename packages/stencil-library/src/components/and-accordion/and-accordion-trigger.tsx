import { Component, h, Host, State, Method } from '@stencil/core';
import { type AccordionReturn } from '@andersseen/headless-core';
import { cn } from '../../utils/utils';

/**
 * Accordion trigger/header component
 */
@Component({
  tag: 'and-accordion-trigger',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionTrigger {
  @State() private itemId: string = '';
  @State() private accordionLogic: AccordionReturn | null = null;
  @State() private disabled: boolean = false;
  @State() private isExpanded: boolean = false;

  /**
   * Set item properties from parent
   */
  @Method()
  async setItemProps(props: { itemId: string; accordionLogic: AccordionReturn; disabled?: boolean }) {
    this.itemId = props.itemId;
    this.accordionLogic = props.accordionLogic;
    this.disabled = props.disabled || false;
    this.updateState();
  }

  /**
   * Update local expanded state
   */
  private updateState() {
    if (this.accordionLogic && this.itemId) {
      this.isExpanded = this.accordionLogic.queries.isExpanded(this.itemId);
    }
  }

  /**
   * Handle click to toggle accordion item
   */
  private handleClick = () => {
    if (!this.disabled && this.accordionLogic && this.itemId) {
      this.accordionLogic.actions.toggle(this.itemId);
      this.updateState();
    }
  };

  /**
   * Handle keyboard navigation
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.accordionLogic && this.itemId) {
      this.accordionLogic.handleTriggerKeyDown(event, this.itemId);
      this.updateState();
    }
  };

  render() {
    if (!this.accordionLogic || !this.itemId) {
      // Fallback rendering while waiting for props
      return (
        <Host class={cn('flex')}>
          <button class="flex flex-1 items-center justify-between py-4 font-medium">
            <slot></slot>
          </button>
        </Host>
      );
    }

    // Get accessibility props from headless logic
    const triggerProps = this.accordionLogic.getTriggerProps(this.itemId);

    return (
      <Host class={cn('flex')}>
        <button
          class={cn(
            'flex flex-1 items-center justify-between py-4 font-medium transition-all',
            'hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            this.disabled ? 'cursor-not-allowed text-muted-foreground' : '',
          )}
          onClick={this.handleClick}
          onKeyDown={this.handleKeyDown}
          aria-expanded={triggerProps['aria-expanded']}
          aria-controls={triggerProps['aria-controls']}
          aria-disabled={triggerProps['aria-disabled']}
          role={triggerProps.role}
          tabindex={triggerProps.tabindex}
          disabled={this.disabled}
          data-state={triggerProps['data-state']}
        >
          <slot></slot>
          <and-icon name="chevron-down" size={16} class={cn('h-4 w-4 shrink-0 transition-transform duration-200 origin-center', this.isExpanded ? 'rotate-180' : '')} />
        </button>
      </Host>
    );
  }
}
