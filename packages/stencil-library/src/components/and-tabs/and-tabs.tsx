import { Component, h, Host, Prop, Element, Event, EventEmitter, Listen, Watch, State } from '@stencil/core';
import { cn } from '../../utils/utils';
import { createTabs, TabsReturn } from '@andersseen/headless-core';

@Component({
  tag: 'and-tabs',
  styleUrls: ['and-tabs.css', '../../global/global.css'],
  shadow: true,
})
export class MyTabs {
  @Element() el: HTMLElement;

  @Prop({ mutable: true, reflect: true }) value: string;
  @Prop() defaultValue: string;
  @Prop() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Prop() activationMode: 'automatic' | 'manual' = 'automatic';

  @Event() valueChange: EventEmitter<string>;

  @State() private tabsLogic: TabsReturn;

  componentWillLoad() {
    this.tabsLogic = createTabs({
      defaultValue: this.value || this.defaultValue,
      orientation: this.orientation,
      activationMode: this.activationMode,
      onValueChange: tabId => {
        this.value = tabId;
        this.valueChange.emit(tabId);
      },
    });

    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
    }
  }

  @Listen('tabTriggerClick')
  handleTabClick(ev: CustomEvent) {
    this.tabsLogic.actions.selectTab(ev.detail);
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
    const triggers = Array.from(this.el.querySelectorAll('and-tabs-trigger'));
    const contents = Array.from(this.el.querySelectorAll('and-tabs-content'));

    triggers.forEach((trigger: any) => {
      trigger.selected = trigger.value === this.value;
      trigger.tabsLogic = this.tabsLogic; // Pass headless logic to children
    });

    contents.forEach((content: any) => {
      content.selected = content.value === this.value;
    });
  }

  render() {
    const containerProps = this.tabsLogic?.getContainerProps() || {};

    return (
      <Host {...containerProps} class={cn('flex w-full', this.orientation === 'vertical' ? 'flex-row' : 'flex-col')}>
        <slot></slot>
      </Host>
    );
  }
}
