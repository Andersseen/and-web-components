# @andersseen/headless-components

> Framework-agnostic headless UI components for Web Components

## 🎯 Philosophy

This library provides **headless** (unstyled, logic-only) UI components that:

- ✅ Are written in **pure TypeScript**
- ✅ Work with **any framework** (Stencil, Angular, React, Vue, Vanilla JS)
- ✅ Handle **state management** and **accessibility**
- ✅ Provide **keyboard navigation** out of the box
- ❌ Do **NOT** render any DOM
- ❌ Do **NOT** include any styles
- ❌ Do **NOT** depend on React hooks or other framework-specific APIs

## 📦 Installation

```bash
pnpm add @andersseen/headless-components
```

## 🚀 Quick Start

Each component follows the same pattern:

```ts
import { createButton } from "@andersseen/headless-components";

const button = createButton({
  disabled: false,
  onClick: (e) => console.log("clicked"),
});

// Get accessibility props
const props = button.getButtonProps();
// {
//   type: 'button',
//   disabled: false,
//   tabindex: 0,
//   'aria-disabled': false,
//   'data-state': 'active'
// }

// Update state
button.actions.setLoading(true);
```

## 📋 Available Components

- [Button](#button) - Simple button with loading and disabled states
- [Accordion](#accordion) - Collapsible sections with multi-select support
- [Tabs](#tabs) - Tab navigation with automatic/manual activation
- [Dropdown](#dropdown) - Dropdown menus with keyboard navigation

## 🔧 Component APIs

### Button

```ts
import { createButton } from '@andersseen/headless-components/button';

const button = createButton({
  disabled: false,
  loading: false,
  type: 'button',
  onClick: (e) => void,
  ariaLabel: 'Click me'
});

// State
button.state.disabled; // boolean
button.state.loading;  // boolean

// Actions
button.actions.setDisabled(true);
button.actions.setLoading(true);
button.actions.click(event);

// Props
button.getButtonProps();
```

### Accordion

```ts
import { createAccordion } from "@andersseen/headless-components/accordion";

const accordion = createAccordion({
  allowMultiple: true,
  defaultValue: ["item-1"],
  onValueChange: (items) => console.log(items),
  orientation: "vertical",
});

// Queries
accordion.queries.isExpanded("item-1");
accordion.queries.getExpandedItems();

// Actions
accordion.actions.toggle("item-1");
accordion.actions.expand("item-2");
accordion.actions.collapse("item-1");

// Props
accordion.getContainerProps();
accordion.getTriggerProps("item-1");
accordion.getContentProps("item-1");

// Keyboard
accordion.handleTriggerKeyDown(event, "item-1");
```

### Tabs

```ts
import { createTabs } from "@andersseen/headless-components/tabs";

const tabs = createTabs({
  defaultValue: "tab-1",
  orientation: "horizontal",
  activationMode: "automatic",
  onValueChange: (tabId) => console.log(tabId),
});

// Queries
tabs.queries.isSelected("tab-1");
tabs.queries.getSelectedTab();

// Actions
tabs.actions.selectTab("tab-2");

// Props
tabs.getTabListProps();
tabs.getTabTriggerProps("tab-1");
tabs.getTabContentProps("tab-1");

// Keyboard
tabs.handleTabKeyDown(event, "tab-1", ["tab-1", "tab-2", "tab-3"]);
```

### Dropdown

```ts
import { createDropdown } from "@andersseen/headless-components/dropdown";

const dropdown = createDropdown({
  placement: "bottom",
  closeOnSelect: true,
  onOpenChange: (isOpen) => console.log(isOpen),
});

// State
dropdown.state.isOpen;

// Actions
dropdown.actions.open();
dropdown.actions.close();
dropdown.actions.toggle();
dropdown.actions.selectItem("item-1");

// Props
dropdown.getTriggerProps();
dropdown.getMenuProps();
dropdown.getItemProps("item-1");

// Keyboard
dropdown.handleTriggerKeyDown(event);
dropdown.handleMenuKeyDown(event, ["item-1", "item-2"]);
```

## 🎨 Usage with Stencil

```tsx
import { Component, State, h } from "@stencil/core";
import { createButton, ButtonReturn } from "@andersseen/headless-components/button";

@Component({
  tag: "and-button",
  styleUrl: "and-button.css",
  shadow: true,
})
export class MyButton {
  @State() private buttonLogic: ButtonReturn;

  componentWillLoad() {
    this.buttonLogic = createButton({
      onClick: (e) => this.handleClick(e),
    });
  }

  private handleClick = (e: MouseEvent) => {
    console.log("Button clicked!");
  };

  render() {
    const props = this.buttonLogic.getButtonProps();

    return (
      <button
        {...props}
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        onClick={(e) => this.buttonLogic.actions.click(e)}
      >
        <slot />
      </button>
    );
  }
}
```

## 🌐 Usage with Angular

```ts
import { Component, OnInit } from "@angular/core";
import { createButton, ButtonReturn } from "@andersseen/headless-components/button";

@Component({
  selector: "app-button",
  template: `
    <button
      [attr.type]="props.type"
      [disabled]="props.disabled"
      [attr.aria-disabled]="props['aria-disabled']"
      (click)="button.actions.click($event)"
      class="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class ButtonComponent implements OnInit {
  button!: ButtonReturn;
  props: any;

  ngOnInit() {
    this.button = createButton({
      onClick: (e) => console.log("clicked"),
    });
    this.props = this.button.getButtonProps();
  }
}
```

## 🎯 Design Principles

1. **State Only**: Components manage state, not rendering
2. **Accessibility First**: ARIA attributes included by default
3. **Keyboard Navigation**: Full keyboard support built-in
4. **Type Safe**: Full TypeScript support with inferred types
5. **Framework Agnostic**: Works anywhere JavaScript runs
6. **Tree Shakeable**: Import only what you need

## 📖 API Patterns

All components follow consistent patterns:

```ts
const component = createComponent(config);

// Readonly state
component.state; // Current state snapshot

// Actions (mutate state)
component.actions.doSomething();

// Queries (read state)
component.queries.getSomething();

// Props generators (for elements)
component.getElementProps();

// Event handlers (for keyboard, etc)
component.handleSomeEvent();
```

## 🔒 Type Safety

All components export their types:

```ts
import type {
  ButtonConfig,
  ButtonState,
  ButtonReturn,
} from "@andersseen/headless-components/button";
```

## 📝 License

MIT © Andersseen
