import { Component, Element, Prop, h, Host, Watch, Listen, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-accordion',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyAccordion {
  @Element() el: HTMLElement;

  @Prop() type: 'single' | 'multiple' = 'single';
  @Prop() collapsible: boolean = false;
  @Prop({ mutable: true }) value: string | string[];
  @Prop() defaultValue: string | string[];

  @Event() myValueChange: EventEmitter<string | string[]>;

  componentDidLoad() {
    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
    }
    this.updateChildren();
  }

  @Watch('value')
  handleValueChange() {
    this.updateChildren();
    this.myValueChange.emit(this.value);
  }

  @Listen('accordionTriggerClick')
  handleTriggerClick(ev: CustomEvent) {
    const itemValue = ev.detail;
    if (this.type === 'multiple') {
      const currentValue = Array.isArray(this.value) ? this.value : this.value ? [this.value as string] : [];
      if (currentValue.includes(itemValue)) {
        this.value = currentValue.filter(v => v !== itemValue);
      } else {
        this.value = [...currentValue, itemValue];
      }
    } else {
      // Single mode
      if (this.value === itemValue) {
        if (this.collapsible) {
          this.value = ''; // Collapse if allowed
        }
      } else {
        this.value = itemValue;
      }
    }
  }

  updateChildren() {
    const items = Array.from(this.el.querySelectorAll('my-accordion-item')) as any[];
    items.forEach(item => {
      const isSelected = this.type === 'multiple' ? Array.isArray(this.value) && this.value.includes(item.value) : this.value === item.value;

      item.open = isSelected;
    });
  }

  render() {
    return (
      <Host class={cn('block')}>
        <slot></slot>
      </Host>
    );
  }
}
