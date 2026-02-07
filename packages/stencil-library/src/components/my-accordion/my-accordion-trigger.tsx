import { Component, h, Host, Element, Prop, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion-trigger',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionTrigger {
  @Element() el: HTMLElement;

  @Prop() open: boolean = false;
  @Prop() disabled: boolean = false;
  @Prop() value: string; // ID of the item

  @Event({ bubbles: true, composed: true }) accordionTriggerClick: EventEmitter<string>;

  handleClick = () => {
    if (!this.disabled) {
      this.accordionTriggerClick.emit(this.value);
    }
  };

  render() {
    return (
      <Host class={cn('flex')}>
        <button
          class={cn('flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline', this.disabled ? 'cursor-not-allowed text-muted-foreground' : '')}
          onClick={this.handleClick}
          aria-expanded={this.open.toString()}
          disabled={this.disabled}
        >
          <slot></slot>
          <my-icon name="chevron-down" class={cn('h-4 w-4 shrink-0 transition-transform duration-200', this.open ? 'rotate-180' : '')} />
        </button>
      </Host>
    );
  }
}
