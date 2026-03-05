# @andersseen/headless-components

![npm](https://img.shields.io/npm/v/@andersseen/headless-components)

Headless UI components for Web Components - Framework agnostic state machines and logic.

## Installation

```bash
npm install @andersseen/headless-components
# or
pnpm add @andersseen/headless-components
```

## Quick Start

The headless-core package exposes logic using a factory pattern. This means you call `create<Component>()` to initialize the logic and state, which returns an object containing necessary properties/attributes and action handlers that you bind to your UI elements.

```typescript
import { createButton } from '@andersseen/headless-components';

// Create a button instance
const buttonLogic = createButton({
  disabled: false,
  loading: false,
  type: 'button',
  onClick: (e) => console.log('Button clicked!', e)
});

// Use the properties and actions
const props = buttonLogic.getButtonProps();
const clickHandler = buttonLogic.actions.click;
```

## API Overview

The following components are exported from the package:

- `button` - (`createButton`)
- `accordion` - (`createAccordion`)
- `tabs` - (`createTabs`)
- `dropdown` - (`createDropdown`)
- `modal` - (`createModal`)
- `tooltip` - (`createTooltip`)
- `toast` - (`createToast`)
- `drawer` - (`createDrawer`)
- `alert` - (`createAlert`)
- `navbar` - (`createNavbar`)
- `sidebar` - (`createSidebar`)
- `breadcrumb` - (`createBreadcrumb`)
- `menu-list` - (`createMenuList`)
- `context-menu` - (`createContextMenu`)

## Usage with Stencil

This library is primarily designed to work seamlessly with Stencil web components. You initialize the headless logic during the `componentWillLoad` lifecycle method and use the provided actions and props in your `render` function.

```tsx
import { Component, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import { createButton, type ButtonReturn } from '@andersseen/headless-components';

@Component({
  tag: 'my-button',
  shadow: true,
})
export class MyButton {
  @Prop() disabled = false;
  @Event() myClick: EventEmitter<MouseEvent>;

  @State() private buttonLogic: ButtonReturn;

  componentWillLoad() {
    this.buttonLogic = createButton({
      disabled: this.disabled,
      onClick: (e: MouseEvent) => this.myClick.emit(e),
    });
  }

  @Watch('disabled')
  disabledChanged(newValue: boolean) {
    this.buttonLogic?.actions.setDisabled(newValue);
  }

  render() {
    const props = this.buttonLogic?.getButtonProps() || {};

    return (
      <button {...props} onClick={(e) => this.buttonLogic?.actions.click(e)}>
        <slot></slot>
      </button>
    );
  }
}
```

## License

MIT
