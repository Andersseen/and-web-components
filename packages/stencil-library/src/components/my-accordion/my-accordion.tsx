import { Component, Element, Prop, State, h, Host, Watch } from '@stencil/core';
import { createAccordion, type AccordionReturn } from '@andersseen/headless-core';
import { cn } from '../../utils/utils';

/**
 * Accordion container component using headless logic
 *
 * @example
 * ```html
 * <my-accordion allow-multiple="true">
 *   <my-accordion-item value="item-1">
 *     <my-accordion-trigger>Item 1</my-accordion-trigger>
 *     <my-accordion-content>Content 1</my-accordion-content>
 *   </my-accordion-item>
 * </my-accordion>
 * ```
 */
@Component({
  tag: 'my-accordion',
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
    const items = Array.from(this.el.querySelectorAll('my-accordion-item')) as any[];
    items.forEach(item => {
      // Pass the accordion logic to children
      if (item && typeof item.setAccordionLogic === 'function') {
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
