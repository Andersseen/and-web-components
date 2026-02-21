# Integrating Headless Components with Stencil

This guide shows how to use `@andersseen/headless-components` components in your Stencil Web Components.

## 🎯 Architecture Overview

```
┌─────────────────────────────────┐
│   Stencil Web Component         │
│                                 │
│  ┌───────────────────────────┐ │
│  │  Headless Component       │ │  ← State & Logic
│  │  (createButton)           │ │
│  └───────────────────────────┘ │
│              ↓                  │
│  ┌───────────────────────────┐ │
│  │  Styled JSX/TSX           │ │  ← Presentation
│  │  (Tailwind CSS)           │ │
│  └───────────────────────────┘ │
└─────────────────────────────────┘
```

## 📦 Installation

First, add the headless library as a dependency to your Stencil package:

```bash
cd packages/stencil-library
pnpm add @andersseen/headless-components
```

## 🔧 Integration Patterns

### Pattern 1: Simple Component (Button)

**File: `src/components/and-button/and-button.tsx`**

```tsx
import { Component, Prop, State, h } from "@stencil/core";
import { createButton, ButtonReturn } from "@andersseen/headless-components/button";
import { cn } from "../../utils/cn"; // tailwind-merge utility

@Component({
  tag: "and-button",
  styleUrl: "and-button.css",
  shadow: true,
})
export class MyButton {
  /**
   * Button variant
   */
  @Prop() variant: "default" | "primary" | "secondary" | "ghost" = "default";

  /**
   * Button size
   */
  @Prop() size: "sm" | "md" | "lg" = "md";

  /**
   * Disabled state
   */
  @Prop() disabled: boolean = false;

  /**
   * Loading state
   */
  @Prop() loading: boolean = false;

  /**
   * Button type
   */
  @Prop() type: "button" | "submit" | "reset" = "button";

  /**
   * Internal headless button instance
   */
  @State() private buttonLogic: ButtonReturn;

  /**
   * Initialize headless logic
   */
  componentWillLoad() {
    this.buttonLogic = createButton({
      disabled: this.disabled,
      loading: this.loading,
      type: this.type,
      onClick: (e) => this.handleClick(e),
    });
  }

  /**
   * Update headless state when props change
   */
  componentWillUpdate() {
    this.buttonLogic.actions.setDisabled(this.disabled);
    this.buttonLogic.actions.setLoading(this.loading);
  }

  private handleClick = (e: MouseEvent) => {
    console.log("Button clicked!", e);
  };

  /**
   * Get Tailwind classes based on variant and size
   */
  private getClassNames(): string {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";

    const variantClasses = {
      default:
        "bg-background text-foreground border border-input hover:bg-accent",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8",
    };

    return cn(
      baseClasses,
      variantClasses[this.variant],
      sizeClasses[this.size],
    );
  }

  render() {
    // Get accessibility props from headless component
    const props = this.buttonLogic.getButtonProps();

    return (
      <button
        {...props}
        class={this.getClassNames()}
        onClick={(e) => this.buttonLogic.actions.click(e)}
      >
        {this.loading && <span class="mr-2 h-4 w-4 animate-spin">⏳</span>}
        <slot />
      </button>
    );
  }
}
```

---

### Pattern 2: Complex Component (Accordion)

**File: `src/components/and-accordion/and-accordion.tsx`**

```tsx
import { Component, Prop, State, h } from "@stencil/core";
import {
  createAccordion,
  AccordionReturn,
} from "@andersseen/headless-components/accordion";

@Component({
  tag: "and-accordion",
  styleUrl: "and-accordion.css",
  shadow: true,
})
export class MyAccordion {
  /**
   * Allow multiple items to be open
   */
  @Prop() allowMultiple: boolean = false;

  /**
   * Default expanded items
   */
  @Prop() defaultValue?: string[];

  /**
   * Internal headless accordion instance
   */
  @State() private accordionLogic: AccordionReturn;

  /**
   * Track expanded state for re-rendering
   */
  @State() private expandedItems: string[] = [];

  componentWillLoad() {
    this.accordionLogic = createAccordion({
      allowMultiple: this.allowMultiple,
      defaultValue: this.defaultValue,
      onValueChange: (items) => {
        this.expandedItems = items;
        console.log("Expanded items:", items);
      },
    });
  }

  render() {
    const containerProps = this.accordionLogic.getContainerProps();

    return (
      <div
        {...containerProps}
        class="rounded-lg border border-border bg-card divide-y divide-border"
      >
        <slot />
      </div>
    );
  }
}
```

**File: `src/components/and-accordion-item/and-accordion-item.tsx`**

```tsx
import { Component, Prop, Element, State, h } from "@stencil/core";
import { AccordionReturn } from "@andersseen/headless-components/accordion";

@Component({
  tag: "and-accordion-item",
  styleUrl: "and-accordion-item.css",
  shadow: true,
})
export class MyAccordionItem {
  @Element() el: HTMLElement;

  /**
   * Unique identifier for this accordion item
   */
  @Prop() itemId!: string;

  /**
   * Title for the accordion trigger
   */
  @Prop() title: string = "";

  /**
   * Reference to parent accordion logic
   */
  @State() private accordionLogic: AccordionReturn;
  @State() private isExpanded: boolean = false;

  componentWillLoad() {
    // Get accordion logic from parent
    const parent = this.el.closest("and-accordion") as any;
    if (parent && parent.accordionLogic) {
      this.accordionLogic = parent.accordionLogic;
      this.isExpanded = this.accordionLogic.queries.isExpanded(this.itemId);
    }
  }

  private handleToggle = () => {
    this.accordionLogic?.actions.toggle(this.itemId);
    this.isExpanded = this.accordionLogic?.queries.isExpanded(this.itemId);
  };

  private handleKeyDown = (e: KeyboardEvent) => {
    this.accordionLogic?.handleTriggerKeyDown(e, this.itemId);
  };

  render() {
    if (!this.accordionLogic) {
      return null;
    }

    const triggerProps = this.accordionLogic.getTriggerProps(this.itemId);
    const contentProps = this.accordionLogic.getContentProps(this.itemId);

    return (
      <div class="accordion-item">
        {/* Trigger */}
        <div
          {...triggerProps}
          class="flex items-center justify-between p-4 font-medium cursor-pointer hover:bg-accent"
          onClick={this.handleToggle}
          onKeyDown={this.handleKeyDown}
        >
          <span>{this.title}</span>
          <span
            class={`transform transition-transform ${this.isExpanded ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </div>

        {/* Content */}
        <div
          {...contentProps}
          class={`overflow-hidden transition-all ${this.isExpanded ? "max-h-screen" : "max-h-0"}`}
        >
          <div class="p-4 pt-0">
            <slot />
          </div>
        </div>
      </div>
    );
  }
}
```

---

### Pattern 3: Container + Items (Tabs)

**File: `src/components/and-tabs/and-tabs.tsx`**

```tsx
import { Component, Prop, State, h } from "@stencil/core";
import { createTabs, TabsReturn } from "@andersseen/headless-components/tabs";

@Component({
  tag: "and-tabs",
  styleUrl: "and-tabs.css",
  shadow: true,
})
export class MyTabs {
  @Prop() defaultValue?: string;
  @Prop() orientation: "horizontal" | "vertical" = "horizontal";

  @State() tabsLogic: TabsReturn;
  @State() selectedTab: string | null = null;

  componentWillLoad() {
    this.tabsLogic = createTabs({
      defaultValue: this.defaultValue,
      orientation: this.orientation,
      onValueChange: (tabId) => {
        this.selectedTab = tabId;
      },
    });
  }

  render() {
    const containerProps = this.tabsLogic.getContainerProps();

    return (
      <div {...containerProps} class="tabs-container">
        <slot />
      </div>
    );
  }
}
```

---

## 🎨 CSS Integration

**File: `src/components/and-button/and-button.css`**

```css
@tailwind components;
@tailwind utilities;

:host {
  display: inline-block;
}

/* Animation for loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
```

---

## 🔑 Key Principles

1. **Headless handles logic** - State management, accessibility, keyboard navigation
2. **Stencil handles presentation** - Rendering, styling with Tailwind, Shadow DOM
3. **Props sync both ways** - Stencil props update headless state
4. **Events notify changes** - Headless callbacks trigger Stencil re-renders

---

## 🚀 Benefits

✅ **Separation of concerns**: Logic vs. presentation  
✅ **Reusability**: Same headless logic across frameworks  
✅ **Accessibility**: Built-in ARIA attributes  
✅ **Type safety**: Full TypeScript support  
✅ **Testing**: Test logic separately from UI

---

## 📝 Best Practices

1. Always sync `@Prop()` changes to headless state in `componentWillUpdate()`
2. Use `@State()` to trigger re-renders when headless state changes
3. Spread headless props (`{...props}`) on your elements
4. Keep styling separate from logic
5. Use callbacks to notify Stencil of state changes

---

## 🎯 Next Steps

Now you can:

- Create headless versions of all your existing components
- Share headless logic across Stencil, Angular, and other frameworks
- Build a truly framework-agnostic component library
