import { Component, h, Host, Prop, Element, Event, EventEmitter } from '@stencil/core';
import { cn } from '../../utils/utils';
import type { TabsReturn } from '@andersseen/headless-components';

@Component({
  tag: 'and-tabs-trigger',
  styleUrl: 'and-tabs.css',
  shadow: true,
})
export class MyTabsTrigger {
  @Element() el: HTMLElement;
  @Prop() value: string;
  @Prop() disabled: boolean = false;
  @Prop() selected: boolean = false;
  @Prop() tabsLogic: TabsReturn; // Passed from parent

  @Event({ bubbles: true, composed: true }) tabTriggerClick: EventEmitter<string>;

  handleKeyDown = (e: KeyboardEvent) => {
    if (this.tabsLogic) {
      // Get all trigger siblings
      const parent = this.el.parentElement;
      const allTriggers = Array.from(parent?.querySelectorAll('and-tabs-trigger') || []);
      const allTabIds = allTriggers.map((t: any) => t.value).filter(Boolean);

      this.tabsLogic.handleTabKeyDown(e, this.value, allTabIds);

      // Focus management - move focus to the next/prev tab after arrow keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
        const selectedTab = this.tabsLogic.queries.getSelectedTab();
        const selectedTrigger = allTriggers.find((t: any) => t.value === selectedTab) as HTMLElement;
        selectedTrigger?.focus();
      }
    }
  };

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
          'flex flex-1 items-center justify-center rounded-sm text-sm font-medium transition-all cursor-pointer ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'px-4 py-3 sm:px-3 sm:py-1.5', // Mobile first sizing
          this.selected ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
          this.disabled && 'opacity-50 pointer-events-none',
        )}
      >
        <slot></slot>
      </Host>
    );
  }
}
