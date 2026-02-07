import { Component, Prop, h, Host, State, Event, EventEmitter, Listen, Element as StencilElement } from '@stencil/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tabs',
  styleUrl: '../../global/global.css',
  shadow: true,
})
export class MyTabs {
  @Prop({ mutable: true }) value: string;
  @Prop() defaultValue: string;

  @State() activeTab: string;

  @Event() valueChange: EventEmitter<string>;

  componentWillLoad() {
    this.activeTab = this.value || this.defaultValue;
  }

  @Listen('tabTriggerClick')
  handleTabTriggerClick(event: CustomEvent<string>) {
    const value = event.detail;
    this.activeTab = value;
    this.value = value;
    this.valueChange.emit(value);

    // Propagate state to children
    this.updateChildren();
  }

  componentDidLoad() {
    this.updateChildren();
  }

  componentDidUpdate() {
    this.updateChildren();
  }

  private updateChildren() {
    // Logic to inform children about active state if needed,
    // but simpler is for children to listen or rely on parent context if using something like that (not easily available in simple Stencil).
    // Instead, we can use querySelectorAll to update properties on children if they are direct checks.

    // Update Triggers
    const triggers = this.el.querySelectorAll('my-tabs-trigger');
    triggers.forEach((trigger: any) => {
      trigger.active = trigger.value === this.activeTab;
    });

    // Update Contents
    const contents = this.el.querySelectorAll('my-tabs-content');
    contents.forEach((content: any) => {
      content.active = content.value === this.activeTab;
    });
  }

  @Prop() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @StencilElement() el: HTMLElement;

  render() {
    return (
      <Host class={cn('flex w-full', this.orientation === 'vertical' ? 'flex-col' : 'flex-col')} data-orientation={this.orientation}>
        <slot></slot>
      </Host>
    );
  }
}
