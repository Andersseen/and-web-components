import { Component, h, Host, Prop, Element, State } from '@stencil/core';
import * as tabs from '@zag-js/tabs';
import { normalizeProps } from '@zag-js/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs-trigger',
  shadow: true,
})
export class MyTabsTrigger {
  @Element() el: HTMLElement;
  @Prop() value: string;
  @Prop() disabled: boolean = false;

  render() {
    // Buscamos la instancia de la máquina del padre
    const parent = this.el.closest('my-tabs') as any;
    if (!parent) return null;

    const api = tabs.connect(parent.state, parent.service.send, normalizeProps);
    const triggerProps = api.getTriggerProps({ value: this.value, disabled: this.disabled });
    const isActive = api.value === this.value;

    return (
      <Host class="flex-1">
        <button
          {...triggerProps}
          class={cn(
            'inline-flex w-full items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            isActive ? 'bg-background text-foreground shadow-sm' : 'hover:bg-background/50 hover:text-foreground',
          )}
        >
          <slot></slot>
        </button>
      </Host>
    );
  }
}
