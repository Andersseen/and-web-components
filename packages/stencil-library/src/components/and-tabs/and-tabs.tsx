import { Component, h, Host, Prop, Element, Event, EventEmitter, Listen, Watch, State } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createTabs, type TabsReturn } from '@andersseen/headless-components';

@Component({
  tag: 'and-tabs',
  styleUrls: ['and-tabs.css', '../../global/global.css'],
  shadow: true,
})
export class AndTabs {
  @Element() el: HTMLElement;

  /** The currently selected tab value. */
  @Prop({ mutable: true, reflect: true }) value: string;

  /** The initial tab value when uncontrolled. */
  @Prop() defaultValue: string;

  /** Orientation of the tab list. */
  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  /** How tabs are activated (on focus or on click). */
  @Prop({ reflect: true }) activationMode: 'automatic' | 'manual' = 'automatic';

  /** Emitted when the selected tab changes. */
  @Event({ bubbles: true, composed: true }) andTabChange: EventEmitter<string>;

  @State() private tabsLogic: TabsReturn;

  /* ── Lifecycle ──────────────────────────────────────────────────── */

  componentWillLoad() {
    this.tabsLogic = createTabs({
      defaultValue: this.value || this.defaultValue,
      orientation: this.orientation,
      activationMode: this.activationMode,
      onValueChange: (tabId: string) => {
        this.value = tabId;
        this.andTabChange.emit(tabId);
      },
    });

    if (!this.value && this.defaultValue) {
      this.value = this.defaultValue;
    }
  }

  componentDidLoad() {
    this.updateChildren();
  }

  /* ── Listeners & Watchers ──────────────────────────────────────── */

  @Listen('tabTriggerClick')
  handleTabClick(ev: CustomEvent) {
    this.tabsLogic.actions.selectTab(ev.detail);
  }

  @Watch('value')
  valueChanged() {
    this.updateChildren();
  }

  /* ── Helpers ────────────────────────────────────────────────────── */

  private updateChildren() {
    const triggers = Array.from(this.el.querySelectorAll('and-tabs-trigger'));
    const contents = Array.from(this.el.querySelectorAll('and-tabs-content'));

    triggers.forEach((trigger: any) => {
      trigger.selected = trigger.value === this.value;
      trigger.tabsLogic = this.tabsLogic;
    });

    contents.forEach((content: any) => {
      content.selected = content.value === this.value;
    });
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const containerProps = this.tabsLogic?.getContainerProps() || {};

    return (
      <Host
        {...containerProps}
        class={cn('flex w-full', this.orientation === 'vertical' ? 'flex-row' : 'flex-col')}
      >
        <slot />
      </Host>
    );
  }
}
