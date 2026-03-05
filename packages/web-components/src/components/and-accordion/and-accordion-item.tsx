import { Component, Prop, State, h, Host, Element, Method } from '@stencil/core';
import { type AccordionReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';

interface AndAccordionElement extends HTMLElement {
  getAccordionLogic?: () => AccordionReturn;
}

interface AndAccordionChildElement extends HTMLElement {
  setItemProps?: (props: { itemId: string; accordionLogic: AccordionReturn; disabled?: boolean }) => void;
}

/**
 * Accordion item component.
 */
@Component({
  tag: 'and-accordion-item',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class AndAccordionItem {
  @Element() el: HTMLElement;

  /** Unique value for this accordion item. */
  @Prop({ reflect: true }) value!: string;

  /** Whether this item is disabled. */
  @Prop({ reflect: true }) disabled: boolean = false;

  @State() private accordionLogic: AccordionReturn | null = null;
  @State() private isExpanded: boolean = false;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    if (!this.value) {
      this.value = `accordion-item-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.findParentAccordion();
  }

  componentDidLoad() {
    // Delay to ensure parent is ready
    setTimeout(() => {
      this.findParentAccordion();
      this.syncState();
    }, 0);
  }

  /* ── Parent discovery ───────────────────────────────────────────── */

  private findParentAccordion() {
    const parent = this.el.closest('and-accordion') as AndAccordionElement | null;
    if (!parent?.getAccordionLogic) return;

    this.accordionLogic = parent.getAccordionLogic();
    this.syncState();
  }

  /** Called by parent accordion to inject the headless logic. */
  @Method()
  async setAccordionLogic(logic: AccordionReturn) {
    this.accordionLogic = logic;
    this.syncState();
  }

  /* ── State sync ─────────────────────────────────────────────────── */

  private syncState() {
    if (!this.accordionLogic) return;

    this.isExpanded = this.accordionLogic.queries.isExpanded(this.value);
    this.propagateToChildren();
  }

  private propagateToChildren() {
    if (!this.accordionLogic) return;

    const trigger = this.el.querySelector('and-accordion-trigger') as AndAccordionChildElement | null;
    const content = this.el.querySelector('and-accordion-content') as AndAccordionChildElement | null;

    trigger?.setItemProps?.({
      itemId: this.value,
      accordionLogic: this.accordionLogic,
      disabled: this.disabled,
    });

    content?.setItemProps?.({
      itemId: this.value,
      accordionLogic: this.accordionLogic,
    });
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    return (
      <Host
        class={cn('border-b border-border', this.disabled && 'opacity-50 pointer-events-none')}
        data-state={this.isExpanded ? 'open' : 'closed'}
        data-disabled={this.disabled ? '' : undefined}
      >
        <slot />
      </Host>
    );
  }
}
