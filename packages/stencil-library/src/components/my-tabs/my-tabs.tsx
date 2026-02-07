import { Component, h, Host, State, Prop, Element, Event, EventEmitter, Watch } from '@stencil/core';
import * as tabs from '@zag-js/tabs';
import { normalizeProps, useMachine } from '@zag-js/core';

@Component({
  tag: 'my-tabs',
  shadow: true,
})
export class MyTabs {
  @Element() el: HTMLElement;

  @Prop({ mutable: true }) value: string;
  @Prop() defaultValue: string;
  @Prop() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @State() state: any;
  private service: any;

  @Event() valueChange: EventEmitter<string>;

  componentWillLoad() {
    this.service = tabs.machine({
      id: 'tabs',
      value: this.value || this.defaultValue,
      orientation: this.orientation,
      // Muy importante para Web Components: permite que Zag encuentre los elementos dentro del Shadow DOM
      getRootNode: () => this.el.shadowRoot,
      onValueChange: details => {
        this.value = details.value;
        this.valueChange.emit(details.value);
      },
    });

    this.service.subscribe(state => {
      this.state = state;
    });

    this.service.start();
  }

  // Si el valor cambia externamente (ej. desde Angular), sincronizamos Zag
  @Watch('value')
  handleValueChange(newValue: string) {
    const api = tabs.connect(this.state, this.service.send, normalizeProps);
    api.setValue(newValue);
  }

  disconnectedCallback() {
    this.service.stop();
  }

  render() {
    // Generamos la API de Zag
    const api = tabs.connect(this.state, this.service.send, normalizeProps);

    return (
      <Host {...api.getRootProps()} class="flex w-full flex-col">
        {/* Pasamos la API a través de slots es difícil en WC, 
            por lo que los hijos simplemente buscarán al padre más cercano */}
        <slot></slot>
      </Host>
    );
  }
}
