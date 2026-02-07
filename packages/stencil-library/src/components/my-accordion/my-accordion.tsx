import { Component, Element, Prop, h, Host, State, Watch } from '@stencil/core';
import * as accordion from '@zag-js/accordion';
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

  @State() state: any;
  public service: any;

  componentWillLoad() {
    // Create service by calling .start() with props on the machine
    // The machine constant is a pre-configured Machine, start() initializes it
    this.service = (accordion.machine as any).start({
      value: this.value || this.defaultValue,
      multiple: this.type === 'multiple',
      collapsible: this.collapsible,
      getRootNode: () => this.el.shadowRoot,
      onValueChange: (details: any) => {
        this.value = details.value;
      },
    });

    this.service.subscribe((state: any) => {
      this.state = state;
    });
  }

  @Watch('value')
  handleValueChange(newValue: string | string[]) {
    if (this.service && this.state) {
      const api = (accordion.connect as any)(this.service, (v: any) => v);
      if (JSON.stringify(api.value) !== JSON.stringify(newValue)) {
        api.setValue(newValue as any);
      }
    }
  }

  disconnectedCallback() {
    this.service?.stop();
  }

  render() {
    if (!this.state) return null;

    const api = (accordion.connect as any)(this.service, (v: any) => v);

    return (
      <Host {...api.getRootProps()} class={cn('block')}>
        <slot></slot>
      </Host>
    );
  }
}
