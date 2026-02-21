import { Component, Prop, State, h, Host, Element, Method } from '@stencil/core';
import { type AccordionReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/utils';

interface AndAccordion extends HTMLElement {
  getAccordionLogic?: () => AccordionReturn;
}

interface AndAccordionChild extends HTMLElement {
  setItemProps?: (props: any) => void;
}

/**
 * Accordion item component
 */
@Component({
  tag: 'and-accordion-item',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionItem {
  @Element() el: HTMLElement;

  /**
   * Unique value for this accordion item
   */
  @Prop() value!: string;

  /**
   * Whether this item is disabled
   */
  @Prop() disabled: boolean = false;

  /**
   * Reference to parent accordion logic
   */
  @State() private accordionLogic: AccordionReturn | null = null;

  /**
   * Track if this item is expanded
   */
  @State() private isExpanded: boolean = false;

  componentWillLoad() {
    // Generate value if not provided
    if (!this.value) {
      this.value = `accordion-item-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Try to get logic from parent
    this.findParentAccordion();
  }

  componentDidLoad() {
    // Delay to ensure parent is ready
    setTimeout(() => {
      this.findParentAccordion();
      this.updateState();
    }, 0);
  }

  /**
   * Find and connect to parent accordion
   */
  private findParentAccordion() {
    const parent = this.el.closest('and-accordion') as AndAccordion | null;
    if (parent?.getAccordionLogic) {
      this.accordionLogic = parent.getAccordionLogic();
      this.updateState();
    }
  }

  /**
   * Method for parent to pass accordion logic
   */
  @Method()
  async setAccordionLogic(logic: AccordionReturn) {
    this.accordionLogic = logic;
    this.updateState();
  }

  /**
   * Update local state from headless logic
   */
  private updateState() {
    if (this.accordionLogic) {
      this.isExpanded = this.accordionLogic.queries.isExpanded(this.value);
      this.updateChildren();
    }
  }

  /**
   * Pass props to child trigger and content
   */
  private updateChildren() {
    const trigger = this.el.querySelector('and-accordion-trigger') as AndAccordionChild | null;
    const content = this.el.querySelector('and-accordion-content') as AndAccordionChild | null;

    if (trigger?.setItemProps && this.accordionLogic) {
      trigger.setItemProps({
        itemId: this.value,
        accordionLogic: this.accordionLogic,
        disabled: this.disabled,
      });
    }

    if (content?.setItemProps && this.accordionLogic) {
      content.setItemProps({
        itemId: this.value,
        accordionLogic: this.accordionLogic,
      });
    }
  }

  render() {
    return (
      <Host
        class={cn('border-b border-border', this.disabled ? 'opacity-50 pointer-events-none' : '')}
        data-state={this.isExpanded ? 'open' : 'closed'}
        data-disabled={this.disabled ? '' : undefined}
      >
        <slot></slot>
      </Host>
    );
  }
}
