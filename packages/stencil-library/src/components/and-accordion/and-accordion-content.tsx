import { Component, h, Host, State, Method, Element } from '@stencil/core';
import { type AccordionReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';
import { applyGlobalAnimationFlag } from '../../utils/animation-config';

/* ────────────────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────────────────── */

const contentBaseClass = 'and-accordion-content overflow-hidden text-sm';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

export interface ContentItemProps {
  itemId: string;
  accordionLogic: AccordionReturn;
}

@Component({
  tag: 'and-accordion-content',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class AndAccordionContent {
  @Element() el: HTMLElement;

  @State() private itemId: string = '';
  @State() private accordionLogic: AccordionReturn | null = null;
  @State() private isExpanded: boolean = false;

  connectedCallback() {
    applyGlobalAnimationFlag(this.el);
  }

  /** Receive item properties from parent accordion-item. */
  @Method()
  async setItemProps(props: ContentItemProps) {
    this.itemId = props.itemId;
    this.accordionLogic = props.accordionLogic;
    this.syncState();
  }

  private syncState() {
    if (!this.accordionLogic || !this.itemId) return;
    this.isExpanded = this.accordionLogic.queries.isExpanded(this.itemId);
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    // Fallback rendering
    if (!this.accordionLogic || !this.itemId) {
      return (
        <Host class={cn('overflow-hidden text-sm')}>
          <div class="pb-4 pt-0">
            <slot />
          </div>
        </Host>
      );
    }

    const contentProps = this.accordionLogic.getContentProps(this.itemId);

    return (
      <Host
        class={cn(contentBaseClass, !this.isExpanded && 'hidden')}
        role={contentProps.role}
        id={contentProps.id}
        aria-hidden={contentProps['aria-hidden']}
        hidden={contentProps.hidden}
        data-state={contentProps['data-state']}
      >
        <div class="pb-4 pt-0">
          <slot />
        </div>
      </Host>
    );
  }
}
