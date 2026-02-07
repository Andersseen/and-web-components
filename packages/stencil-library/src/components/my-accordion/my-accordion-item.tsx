import { Component, Prop, h, Host, Element, Watch } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion-item',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordionItem {
  /**
   * The value of the item.
   */
  @Prop({ reflect: true }) value: string;

  /**
   * Whether the item is open.
   */
  @Prop({ reflect: true, mutable: true }) open: boolean = false;

  @Element() el: HTMLElement;

  componentWillLoad() {
    if (!this.value) {
      this.value = `accordion-item-${Math.random().toString(36).substr(2, 9)}`;
    }
  }

  componentDidLoad() {
    this.updateChildren();
  }

  @Watch('open')
  openHandler() {
    this.updateChildren();
  }

  updateChildren() {
    const trigger = this.el.querySelector('my-accordion-trigger') as any;
    const content = this.el.querySelector('my-accordion-content') as any;

    if (trigger) {
      trigger.open = this.open;
    }
    if (content) {
      content.open = this.open;
    }
  }

  /**
   * The header text for the item.
   */
  @Prop() header: string;

  render() {
    return (
      <Host class={cn('block border-b')}>
        <my-accordion-trigger open={this.open} value={this.value}>
          {this.header}
        </my-accordion-trigger>
        <my-accordion-content open={this.open}>
          <slot></slot>
        </my-accordion-content>
      </Host>
    );
  }
}
