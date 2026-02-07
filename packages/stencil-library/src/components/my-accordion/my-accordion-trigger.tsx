import { Component, Event, EventEmitter, h, Host, Element, Prop } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion-trigger',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionTrigger {
  @Element() el: HTMLElement;
  @Event() accordionTriggerClick: EventEmitter<string>;

  /**
   * OPEN STATE (Managed by parent item)
   */
  @Prop() open: boolean = false;

  /**
   * Value of the item
   */
  @Prop() value: string;

  componentWillLoad() {
    // No logic needed
  }

  handleClick = () => {
    this.accordionTriggerClick.emit(this.value);
  };

  render() {
    return (
      <Host class={cn('flex')}>
        <button
          type="button"
          onClick={this.handleClick}
          class={cn(
            'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
            this.open ? '[&>svg]:rotate-180' : '',
          )}
          data-state={this.open ? 'open' : 'closed'}
        >
          <slot></slot>
          <my-icon name="chevron-down" class="h-4 w-4 shrink-0 transition-transform duration-200" />
        </button>
      </Host>
    );
  }
}
