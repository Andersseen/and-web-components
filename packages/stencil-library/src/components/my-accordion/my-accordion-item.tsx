import { Component, Prop, h, Host, Element, Watch } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion-item',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionItem {
  @Element() el: HTMLElement;

  @Prop() value: string;
  @Prop() disabled: boolean = false;
  @Prop({ mutable: true }) open: boolean = false;

  componentWillLoad() {
    if (!this.value) {
      this.value = `accordion-item-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  @Watch('open')
  handleOpenChange() {
    this.updateChildren();
  }

  componentDidLoad() {
    // Initial update in case open was set before children were ready
    // Use a small timeout to let light DOM children upgrade
    setTimeout(() => this.updateChildren(), 0);
  }

  updateChildren() {
    const trigger = this.el.querySelector('my-accordion-trigger') as any;
    const content = this.el.querySelector('my-accordion-content') as any;

    if (trigger) {
      trigger.open = this.open;
      trigger.disabled = this.disabled;
      trigger.value = this.value; // Pass value so trigger knows what to emit
    }
    if (content) {
      content.open = this.open;
    }
  }

  render() {
    return (
      <Host
        class={cn('block border-b', this.disabled ? 'opacity-50 pointer-events-none' : '')}
        data-state={this.open ? 'open' : 'closed'}
        data-disabled={this.disabled ? '' : undefined}
      >
        <slot></slot>
      </Host>
    );
  }
}
