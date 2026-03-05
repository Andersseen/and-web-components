import { Component, Element, Prop, State, h, Host, Watch } from '@stencil/core';
import { createAccordion, type AccordionReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';

interface AndAccordionItemElement extends HTMLElement {
  setAccordionLogic?: (logic: AccordionReturn) => void;
}

/**
 * Accordion container component using headless logic.
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
export class AndAccordion {
  @Element() el: HTMLElement;

  /** Allow multiple items to be expanded simultaneously. */
  @Prop({ reflect: true }) allowMultiple: boolean = false;

  /** Default expanded item values. */
  @Prop() defaultValue?: string[];

  /** Orientation of the accordion. */
  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'vertical';

  /** Whether the accordion is disabled. */
  @Prop({ reflect: true }) disabled: boolean = false;

  @State() private accordionLogic: AccordionReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.accordionLogic = createAccordion({
      allowMultiple: this.allowMultiple,
      defaultValue: this.defaultValue,
      orientation: this.orientation,
      disabled: this.disabled,
      onValueChange: () => this.updateChildren(),
    });
  }

  componentDidLoad() {
    this.updateChildren();
  }

  /* ── Watchers ───────────────────────────────────────────────────── */

  @Watch('disabled')
  disabledChanged() {
    this.accordionLogic?.actions.setDisabled(this.disabled);
  }

  /* ── Helpers ────────────────────────────────────────────────────── */

  private updateChildren() {
    const items = Array.from(
      this.el.querySelectorAll('and-accordion-item'),
    ) as AndAccordionItemElement[];

    items.forEach(item => {
      item.setAccordionLogic?.(this.accordionLogic);
    });
  }

  /** Expose accordion logic to children. */
  getAccordionLogic(): AccordionReturn {
    return this.accordionLogic;
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    if (!this.accordionLogic) return null;

    const containerProps = this.accordionLogic.getContainerProps();

    return (
      <Host class={cn('w-full')} {...containerProps}>
        <slot />
      </Host>
    );
  }
}
