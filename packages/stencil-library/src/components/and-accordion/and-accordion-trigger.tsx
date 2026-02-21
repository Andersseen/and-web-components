import { Component, h, Host, State, Method } from '@stencil/core';
import { type AccordionReturn } from '@andersseen/headless-components';
import { cn } from '../../utils/cn';

/* ────────────────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────────────────── */

const triggerBaseClass = [
  'flex flex-1 items-center justify-between py-4 font-medium transition-all',
  'hover:underline',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
].join(' ');

const triggerDisabledClass = 'cursor-not-allowed text-muted-foreground';

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

export interface TriggerItemProps {
  itemId: string;
  accordionLogic: AccordionReturn;
  disabled?: boolean;
}

@Component({
  tag: 'and-accordion-trigger',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class AndAccordionTrigger {
  @State() private itemId: string = '';
  @State() private accordionLogic: AccordionReturn | null = null;
  @State() private disabled: boolean = false;
  @State() private isExpanded: boolean = false;

  /** Receive item properties from parent accordion-item. */
  @Method()
  async setItemProps(props: TriggerItemProps) {
    this.itemId = props.itemId;
    this.accordionLogic = props.accordionLogic;
    this.disabled = props.disabled || false;
    this.syncState();
  }

  /* ── State ──────────────────────────────────────────────────────── */

  private syncState() {
    if (!this.accordionLogic || !this.itemId) return;
    this.isExpanded = this.accordionLogic.queries.isExpanded(this.itemId);
  }

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleClick = () => {
    if (this.disabled || !this.accordionLogic || !this.itemId) return;
    this.accordionLogic.actions.toggle(this.itemId);
    this.syncState();
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (!this.accordionLogic || !this.itemId) return;
    this.accordionLogic.handleTriggerKeyDown(event, this.itemId);
    this.syncState();
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    // Fallback while waiting for props
    if (!this.accordionLogic || !this.itemId) {
      return (
        <Host class={cn('flex')}>
          <button class={triggerBaseClass}>
            <slot />
          </button>
        </Host>
      );
    }

    const triggerProps = this.accordionLogic.getTriggerProps(this.itemId);

    return (
      <Host class={cn('flex')}>
        <button
          class={cn(triggerBaseClass, this.disabled && triggerDisabledClass)}
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
          <slot />
          <and-icon
            name="chevron-down"
            size={16}
            class={cn(
              'h-4 w-4 shrink-0 transition-transform duration-200 origin-center',
              this.isExpanded && 'rotate-180',
            )}
          />
        </button>
      </Host>
    );
  }
}
