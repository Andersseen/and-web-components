import { Component, Host, h, Prop, State, Element } from '@stencil/core';
import * as tooltip from '@zag-js/tooltip';
import { normalizeProps, useMachine } from '@zag-js/core';
import { cn } from '../../utils/utils';

@Component({
  tag: 'my-tooltip',
  styleUrl: 'my-tooltip.css',
  shadow: true,
})
export class MyTooltip {
  @Element() el: HTMLElement;

  @Prop() content: string;
  @Prop() placement: 'top' | 'right' | 'bottom' | 'left' = 'top';
  @Prop() openDelay: number = 0;
  @Prop() closeDelay: number = 0;

  @State() state: any;
  private service: any;

  componentWillLoad() {
    this.service = useMachine(tooltip.machine, {
      id: 'tooltip',
      openDelay: this.openDelay,
      closeDelay: this.closeDelay,
      placement: this.placement,
      getRootNode: () => this.el.shadowRoot,
    });

    this.service.subscribe(state => {
      this.state = state;
    });

    this.service.start();
  }

  disconnectedCallback() {
    this.service.stop();
  }

  render() {
    const api = tooltip.connect(this.service, normalizeProps);

    return (
      <Host>
        <div class="relative inline-block">
          <div {...api.getTriggerProps()}>
            <slot></slot>
          </div>

          {api.open && (
            <div {...api.getPositionerProps()} class="z-50">
              <div
                {...api.getContentProps()}
                class="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              >
                {this.content || <slot name="content"></slot>}
              </div>
            </div>
          )}
        </div>
      </Host>
    );
  }
}
