import { Component, h, Host, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/cn';
import type { TabsReturn } from '@andersseen/headless-components';

/* ────────────────────────────────────────────────────────────────────
 * Styles
 * ──────────────────────────────────────────────────────────────────── */

const triggerBaseClass = [
  'flex flex-1 items-center justify-center rounded-sm text-sm font-medium',
  'transition-all cursor-pointer ring-offset-background',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'px-4 py-3 sm:px-3 sm:py-1.5',
].join(' ');

/* ────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────── */

@Component({
  tag: 'and-tabs-trigger',
  styleUrl: 'and-tabs.css',
  shadow: true,
})
export class AndTabsTrigger {
  @Element() el: HTMLElement;

  /** The value that identifies this tab. */
  @Prop({ reflect: true }) value: string;

  /** Whether this tab trigger is disabled. */
  @Prop({ reflect: true }) disabled: boolean = false;

  /** Whether this tab is currently selected (set by parent). */
  @Prop() selected: boolean = false;

  /** Reference to the parent tabs headless logic (set by parent). */
  @Prop() tabsLogic: TabsReturn;

  /** Emitted when this trigger is clicked. */
  @Event({ bubbles: true, composed: true }) tabTriggerClick: EventEmitter<string>;

  /* ── Handlers ───────────────────────────────────────────────────── */

  private handleKeyDown = (e: KeyboardEvent) => {
    if (!this.tabsLogic) return;

    const parent = this.el.parentElement;
    const allTriggers = Array.from(parent?.querySelectorAll('and-tabs-trigger') || []);
    const allTabIds = allTriggers.map((t: any) => t.value).filter(Boolean);

    this.tabsLogic.handleTabKeyDown(e, this.value, allTabIds);

    // Move focus to the newly selected tab after arrow-key navigation
    const navKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (navKeys.includes(e.key)) {
      const selectedTab = this.tabsLogic.queries.getSelectedTab();
      const selectedTrigger = allTriggers.find((t: any) => t.value === selectedTab) as HTMLElement;
      selectedTrigger?.focus();
    }
  };

  /* ── Render ─────────────────────────────────────────────────────── */

  render() {
    const triggerProps = this.tabsLogic?.getTabTriggerProps(this.value) || {
      'role': 'tab',
      'aria-selected': this.selected,
      'tabindex': this.selected ? 0 : -1,
    };

    return (
      <Host
        {...triggerProps}
        onClick={() => !this.disabled && this.tabTriggerClick.emit(this.value)}
        onKeyDown={this.handleKeyDown}
        tabIndex={this.selected ? 0 : -1}
        class={cn(
          triggerBaseClass,
          this.selected
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground',
          this.disabled && 'opacity-50 pointer-events-none',
        )}
      >
        <slot />
      </Host>
    );
  }
}
