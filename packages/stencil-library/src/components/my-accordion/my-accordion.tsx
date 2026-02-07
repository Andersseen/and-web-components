import { Component, Element, Prop, h, Host, State, Watch } from '@stencil/core';
import * as accordion from '@zag-js/accordion';
import { normalizeProps, useMachine } from '@zag-js/core';
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
    this.service = useMachine(accordion.machine, {
      id: 'accordion',
      value: this.value || this.defaultValue,
      multiple: this.type === 'multiple',
      collapsible: this.collapsible,
      getRootNode: () => this.el.shadowRoot,
      onValueChange: details => {
        this.value = details.value;
      },
    });

    this.service.subscribe(state => {
      this.state = state;
    });

    this.service.start();
  }

  @Watch('value')
  handleValueChange(newValue: string | string[]) {
    // If external value changes, we sync it to the service
    // But typically we need to send an event or update context.
    // For now we assume one-way flow or rely on re-render.
    // Zag service might expose .setValue or similar via API, but that requires connecting.
    // The service itself handles state.
    // Ideally we send 'setValue' event if supported, but accordion machine usually just reacts to trigger clicks.
    // If we want controlled mode, we should update the machine state.
    // `api.setValue` is available in the connected API. Since we are inside the component, we can use it.

    // Check if we are connected
    if (this.service) {
      const api = accordion.connect(this.service, normalizeProps);
      if (JSON.stringify(api.value) !== JSON.stringify(newValue)) {
        api.setValue(newValue as any);
      }
    }
  }

  // Dynamic updates for type/collapsible are harder in vanilla setup without recreating machine
  // For now, simpler is to ignore or restart.
  // We'll leave it as is.

  disconnectedCallback() {
    this.service.stop();
  }

  render() {
    const api = accordion.connect(this.service, normalizeProps);

    return (
      <Host {...api.getRootProps()} class={cn('block')}>
        <slot></slot>
      </Host>
    );
  }
}
