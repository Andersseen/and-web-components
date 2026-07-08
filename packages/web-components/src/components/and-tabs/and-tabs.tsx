import { Component, h, Host, Prop, Element, Event, EventEmitter, Listen, Watch, State } from '@stencil/core';
import { cn } from '../../utils/cn';
import { createTabs, type TabsReturn } from '@andersseen/headless-components';

@Component({
  tag: 'and-tabs',
  styleUrls: ['and-tabs.css', '../../global/component-base.css', '../../global/animations.css'],
  shadow: true,
})
export class AndTabs {
  @Element() el!: HTMLElement;

  /** The currently selected tab value. */
  @Prop({ mutable: true, reflect: true }) value!: string;

  /** The initial tab value when uncontrolled. */
  @Prop() defaultValue!: string;

  /** Orientation of the tab list. */
  @Prop({ reflect: true }) orientation: 'horizontal' | 'vertical' = 'horizontal';

  /** How tabs are activated (on focus or on click). */
  @Prop({ reflect: true }) activationMode: 'automatic' | 'manual' = 'automatic';

  /** Emitted when the selected tab changes. */
  @Event({ bubbles: true, composed: true }) andTabChange!: EventEmitter<string>;

  @State() private tabsLogic!: TabsReturn;

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

  private mutationObserver?: MutationObserver;

  componentDidLoad() {
    this.updateChildren();

    // Watch for dynamic children (like triggers inside and-tabs-list) rendered async by frameworks
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(mutations => {
        const hasChildChanges = mutations.some(m => m.type === 'childList');
        if (hasChildChanges) {
          this.updateChildren();
        }
      });

      this.mutationObserver.observe(this.el, { childList: true, subtree: true });
    }
  }

  disconnectedCallback() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  /* ── Listeners & Watchers ──────────────────────────────────────── */

  @Listen('andTabTriggerClick')
  handleTabClick(ev: CustomEvent) {
    this.tabsLogic.actions.selectTab(ev.detail);
  }

  @Watch('value')
  valueChanged() {
    this.updateChildren();
  }

  @Watch('orientation')
  orientationChanged(newValue: 'horizontal' | 'vertical') {
    this.tabsLogic?.actions.setOrientation(newValue);
    this.updateChildren();
  }

  @Watch('activationMode')
  activationModeChanged(newValue: 'automatic' | 'manual') {
    this.tabsLogic?.actions.setActivationMode(newValue);
    this.updateChildren();
  }

  /* ── Helpers ────────────────────────────────────────────────────── */

  private updateChildren() {
    const triggers = Array.from(this.el.querySelectorAll('and-tabs-trigger'));
    const contents = Array.from(this.el.querySelectorAll('and-tabs-content'));

    triggers.forEach((trigger: HTMLAndTabsTriggerElement) => {
      trigger.selected = trigger.value === this.value;
      trigger.tabsLogic = this.tabsLogic;
    });

    contents.forEach((content: HTMLAndTabsContentElement) => {
      content.selected = content.value === this.value;
    });
  }

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const containerProps = this.tabsLogic?.getContainerProps() || {};

    return (
      <Host {...containerProps} class={cn('flex w-full', this.orientation === 'vertical' ? 'flex-row' : 'flex-col')}>
        <slot />
      </Host>
    );
  }
}
