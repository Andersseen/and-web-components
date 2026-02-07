import { Component, Element, Listen, Prop, h, Host } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordion {
  @Element() el: HTMLElement;

  /**
   * Whether the accordion can consist of multiple open items or just one.
   */
  @Prop() type: 'single' | 'multiple' = 'single';

  /**
   * Whether an item can be closed after being opened (in single mode).
   */
  @Prop() collapsible: boolean = false;

  @Listen('accordionTriggerClick')
  handleTriggerClick(event: CustomEvent<string>) {
    const value = event.detail;
    const items = Array.from(this.el.querySelectorAll('my-accordion-item'));

    if (this.type === 'multiple') {
      const item = items.find(i => i.value === value);
      if (item) item.open = !item.open;
    } else {
      items.forEach(item => {
        if (item.value === value) {
          item.open = this.collapsible ? !item.open : true;
        } else {
          item.open = false;
        }
      });
    }
  }

  render() {
    return (
      <Host class={cn('block')}>
        <slot></slot>
      </Host>
    );
  }
}
