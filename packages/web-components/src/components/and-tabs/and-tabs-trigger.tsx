import { Component, h, Host, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/cn';
import type { TabsReturn } from '@andersseen/headless-components';
import { tabsTriggerVariants } from './and-tabs-trigger-variants';

/**
 * Clickable tab header (`role="tab"`). Must be inside `and-tabs-list`,
 * which must itself be inside `and-tabs` — the root injects `tabsLogic`
 * and `selected` into each trigger automatically, which is what drives
 * `aria-selected`, `aria-controls`, and the roving `tabindex`.
 *
 * @example
 * ```html
 * <and-tabs-trigger value="tab-1">Tab 1</and-tabs-trigger>
 * ```
 */
@Component({
  tag: 'and-tabs-trigger',
  styleUrl: 'and-tabs.css',
  shadow: true,
})
export class AndTabsTrigger {
  @Element() el!: HTMLElement;

  /** The value that identifies this tab. */
  @Prop({ reflect: true }) value!: string;

  /** Whether this tab trigger is disabled. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Whether this tab is currently selected (set by parent). */
  @Prop() selected: boolean = false;

  /** Reference to the parent tabs headless logic (set by parent). */
  @Prop() tabsLogic?: TabsReturn;

  /** Emitted when this trigger is clicked. */
  @Event({ bubbles: true, composed: true }) andTabTriggerClick!: EventEmitter<string>;

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.tabsLogic) {
      return;
    }

    const parent = this.el.parentElement;
    const allTriggers = Array.from(parent?.querySelectorAll('and-tabs-trigger') || []);
    // Exclude disabled tabs from the navigable set, same as every other
    // roving-focus component in this repo (and-dropdown, and-menu-list):
    // arrow/Home/End must skip them, not land on and auto-activate them.
    const allTabIds = allTriggers
      .filter((t: HTMLAndTabsTriggerElement) => !t.disabled)
      .map((t: HTMLAndTabsTriggerElement) => t.value)
      .filter(Boolean);

    this.tabsLogic.handleTriggerKeyDown(e, this.value, allTabIds);

    // Move focus to the newly selected tab after arrow-key navigation
    const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (navKeys.includes(e.key)) {
      const selectedTab = this.tabsLogic.queries.getSelectedTab();
      const selectedTrigger = allTriggers.find((t: HTMLAndTabsTriggerElement) => t.value === selectedTab);
      selectedTrigger?.focus();
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const triggerProps = this.tabsLogic?.getTriggerProps(this.value) || {
      'role': 'tab',
      'aria-selected': this.selected ? 'true' : 'false',
      'tabindex': this.selected ? 0 : -1,
    };

    return (
      <Host
        {...triggerProps}
        // Override the headless `aria-disabled`, which only reflects the
        // *whole tabs group*'s disabled state — this tab's own `disabled`
        // prop (per-tab, not wired into the shared headless module) must
        // still be exposed to assistive tech.
        aria-disabled={this.disabled ? 'true' : triggerProps['aria-disabled']}
        onClick={() => !this.disabled && this.andTabTriggerClick.emit(this.value)}
        onKeyDown={this.handleKeyDown}
        tabIndex={this.selected ? 0 : -1}
        class={cn(
          tabsTriggerVariants(),
          this.selected ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          this.disabled && 'opacity-50 pointer-events-none',
        )}
      >
        <slot />
      </Host>
    );
  }
}
