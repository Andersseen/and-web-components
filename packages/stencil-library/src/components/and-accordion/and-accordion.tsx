import { Component, Element, Prop, State, h, Host, Watch } from '@stencil/core';
import { createAccordion, type AccordionReturn } from '@andersseen/headless-core';
import { cn } from '../../utils/utils';

interface AndAccordionItem extends HTMLElement {
  setAccordionLogic?: (logic: AccordionReturn) => void;
}

/**
 * Accordion container component using headless logic
 *
 * @example
 * ```html
 * <and-accordion allow-multiple="true">
 *   <and-accordion-item value="item-1">
 *     <and-accordion-trigger>Item 1</and-accordion-trigger>
 *     <and-accordion-content>Content 1</and-accordion-content>
 *   </and-accordion-item>
 * </and-accordion>
 * ```
 */
@Component({
  tag: 'and-accordion',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordion {
  @Element() el: HTMLElement;

  /**
   * Allow multiple items to be expanded simultaneously
   */
  @Prop() allowMultiple: boolean = false;

  /**
   * Default expanded item values
   */
  @Prop() defaultValue?: string[];

  /**
   * Orientation of the accordion
   */
  @Prop() orientation: 'horizontal' | 'vertical' = 'vertical';

  /**
   * Whether the accordion is disabled
   */
  @Prop() disabled: boolean = false;

  /**
   * Headless accordion logic instance
   */
  @State() private accordionLogic: AccordionReturn;

  componentWillLoad() {
    // Initialize headless accordion
    this.accordionLogic = createAccordion({
      allowMultiple: this.allowMultiple,
      defaultValue: this.defaultValue,
      orientation: this.orientation,
      disabled: this.disabled,
      onValueChange: () => {
        // Update children when values change
        this.updateChildren();
      },
    });
  }

  componentDidLoad() {
    // Initial update for children
    this.updateChildren();
  }

  @Watch('disabled')
  handleDisabledChange() {
    this.accordionLogic?.actions.setDisabled(this.disabled);
  }

  /**
   * Update child accordion items with current state
   */
  private updateChildren() {
    const items = Array.from(
      this.el.querySelectorAll('and-accordion-item')
    ) as AndAccordionItem[];
    items.forEach(item => {
      // Pass the accordion logic to children
      if (item?.setAccordionLogic) {
        item.setAccordionLogic(this.accordionLogic);
      }
    });
  }

  /**
   * Public method to expose accordion logic to children
   */
  getAccordionLogic(): AccordionReturn {
    return this.accordionLogic;
  }

  render() {
    if (!this.accordionLogic) {
      return null;
    }

    const containerProps = this.accordionLogic.getContainerProps();

    return (
      <Host class={cn('w-full')} {...containerProps}>
        <slot></slot>
      </Host>
    );
  }
}
