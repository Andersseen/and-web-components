import { Component, h, Host, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs-trigger',
  styleUrl: 'my-tabs.css',
  shadow: true,
})
export class MyTabsTrigger {
  @Element() el: HTMLElement;
  @Prop() value: string;
  @Prop() disabled: boolean = false;
  @Prop() selected: boolean = false;

  @Event({ bubbles: true, composed: true }) tabTriggerClick: EventEmitter<string>;

  render() {
    return (
      <Host
        role="tab"
        onClick={() => !this.disabled && this.tabTriggerClick.emit(this.value)}
        class={cn(
          'flex flex-1 items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          this.selected ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          this.disabled && 'opacity-50 pointer-events-none',
        )}
      >
        <slot></slot>
      </Host>
    );
  }
}
