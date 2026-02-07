import { Component, h, Host, Prop, Element, Event, EventEmitter, Listen, Watch } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs',
  styleUrls: ['my-tabs.css', '../../global/global.css'],
  shadow: true,
})
export class MyTabs {
  @Element() el: HTMLElement;

  @Prop({ mutable: true, reflect: true }) value: string;
  @Prop() defaultValue: string;
  @Prop() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Event() valueChange: EventEmitter<string>;

  componentWillLoad() {
    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
    }
  }

  @Listen('tabTriggerClick')
  handleTabClick(ev: CustomEvent) {
    this.value = ev.detail;
    this.valueChange.emit(this.value);
  }

  componentDidLoad() {
    this.updateChildren();
  }

  @Watch('value')
  valueChanged() {
    this.updateChildren();
  }

  updateChildren() {
    // Select all potential children (both light DOM and projected)
    const triggers = Array.from(this.el.querySelectorAll('my-tabs-trigger'));
    const contents = Array.from(this.el.querySelectorAll('my-tabs-content'));

    triggers.forEach((trigger: any) => {
      trigger.selected = trigger.value === this.value;
    });

    contents.forEach((content: any) => {
      content.selected = content.value === this.value;
    });
  }

  render() {
    return (
      <Host class={cn('flex w-full', this.orientation === 'vertical' ? 'flex-row' : 'flex-col')}>
        <slot></slot>
      </Host>
    );
  }
}
