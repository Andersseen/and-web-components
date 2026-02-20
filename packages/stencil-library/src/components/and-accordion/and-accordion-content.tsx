import { Component, h, Host, State, Method } from '@stencil/core';
import { type AccordionReturn } from '@andersseen/headless-core';
import { cn } from '../../utils/utils';

/**
 * Accordion content/panel component
 */
@Component({
  tag: 'and-accordion-content',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionContent {
  @State() private itemId: string = '';
  @State() private accordionLogic: AccordionReturn | null = null;
  @State() private isExpanded: boolean = false;

  /**
   * Set item properties from parent
   */
  @Method()
  async setItemProps(props: { itemId: string; accordionLogic: AccordionReturn }) {
    this.itemId = props.itemId;
    this.accordionLogic = props.accordionLogic;
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

  render() {
    if (!this.accordionLogic || !this.itemId) {
      // Fallback rendering
      return (
        <Host class={cn('overflow-hidden text-sm')}>
          <div class="pb-4 pt-0">
            <slot></slot>
          </div>
        </Host>
      );
    }

    // Get accessibility props from headless logic
    const contentProps = this.accordionLogic.getContentProps(this.itemId);

    return (
      <Host
        class={cn('overflow-hidden text-sm transition-all data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up', this.isExpanded ? '' : 'hidden')}
        role={contentProps.role}
        id={contentProps.id}
        aria-hidden={contentProps['aria-hidden']}
        hidden={contentProps.hidden}
        data-state={contentProps['data-state']}
      >
        <div class="pb-4 pt-0">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
