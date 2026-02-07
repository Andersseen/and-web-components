import { Component, Prop, h, Host, Event, EventEmitter, Element } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs-trigger',
  styleUrls: ['my-tabs.css', '../../global/global.css'],
  shadow: true,
})
export class MyTabsTrigger {
  @Prop() value: string;
  @Prop() disabled: boolean = false;

  /**
   * Managed by parent `my-tabs`
   */
  @Prop({ reflect: true }) active: boolean = false;

  @Event() tabTriggerClick: EventEmitter<string>;

  @Element() el: HTMLElement;

  handleClick = () => {
    if (!this.disabled) {
      this.tabTriggerClick.emit(this.value);
    }
  };

  render() {
    return (
      <Host class={cn('flex-1')}>
        <button
          type="button"
          role="tab"
          aria-selected={this.active ? 'true' : 'false'}
          disabled={this.disabled}
          onClick={this.handleClick}
          class={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            this.active ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50 hover:text-foreground',
          )}
        >
          <slot></slot>
        </button>
      </Host>
    );
  }
}
