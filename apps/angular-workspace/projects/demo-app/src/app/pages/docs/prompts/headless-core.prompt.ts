export const HEADLESS_CORE_PROMPT = `\
CONTEXT: @andersseen/headless-components

## Library profile
Framework-agnostic headless primitives for behavior, a11y, and keyboard navigation.
No DOM rendering, no CSS, no framework lock-in.
You provide markup/styles; the library provides state + ARIA + interaction logic.

## Install
\`\`\`
npm i @andersseen/headless-components
\`\`\`

## Verified module exports
\`\`\`
@andersseen/headless-components
@andersseen/headless-components/button
@andersseen/headless-components/accordion
@andersseen/headless-components/tabs
@andersseen/headless-components/dropdown
@andersseen/headless-components/modal
@andersseen/headless-components/tooltip
@andersseen/headless-components/toast
@andersseen/headless-components/drawer
@andersseen/headless-components/alert
@andersseen/headless-components/navbar
@andersseen/headless-components/sidebar
@andersseen/headless-components/breadcrumb
@andersseen/headless-components/menu-list
@andersseen/headless-components/context-menu
\`\`\`

## Canonical API contract
Most modules follow:
\`\`\`ts
const logic = createX(config);

logic.state;                 // read-only state snapshot
logic.actions;               // imperative updates
logic.queries;               // derived state (where available)
logic.get*Props(...);        // ARIA/data attributes for semantic elements
logic.handle*KeyDown(...);   // keyboard support
\`\`\`

## Verified factories (important)
- createButton
- createAccordion
- createTabs
- createDropdown
- createModal
- createTooltip
- createDrawer
- createAlert
- createNavbar
- createSidebar
- createBreadcrumb
- createMenuList
- createContextMenu
- createToastManager  (NOT createToast)

## Core usage examples

### Tabs
\`\`\`ts
import { createTabs } from '@andersseen/headless-components/tabs';

const tabs = createTabs({
  defaultValue: 'overview',
  orientation: 'horizontal',
  activationMode: 'automatic',
  onValueChange: (tabId) => console.log(tabId),
});

const listProps = tabs.getTabListProps();
const triggerProps = tabs.getTabTriggerProps('overview');
const panelProps = tabs.getTabContentProps('overview');

tabs.handleTabKeyDown(event, 'overview', ['overview', 'settings']);
\`\`\`

### Dropdown
\`\`\`ts
import { createDropdown } from '@andersseen/headless-components/dropdown';

const dropdown = createDropdown({
  defaultOpen: false,
  closeOnSelect: true,
  placement: 'bottom',
  onOpenChange: (open) => console.log(open),
});

const triggerProps = dropdown.getTriggerProps();
const menuProps = dropdown.getMenuProps();
const itemProps = dropdown.getItemProps('theme-light');

dropdown.handleTriggerKeyDown(event);
dropdown.handleMenuKeyDown(event, ['theme-light', 'theme-dark']);
\`\`\`

### Modal
\`\`\`ts
import { createModal } from '@andersseen/headless-components/modal';

const modal = createModal({
  closeOnEscape: true,
  closeOnOverlayClick: true,
  onOpenChange: (open) => console.log(open),
});

modal.actions.open();
const overlayProps = modal.getOverlayProps();
const contentProps = modal.getContentProps();
const closeBtnProps = modal.getCloseButtonProps();

window.addEventListener('keydown', modal.handleKeyDown);
\`\`\`

### Tooltip
\`\`\`ts
import { createTooltip } from '@andersseen/headless-components/tooltip';

const tooltip = createTooltip({
  placement: 'top',
  openDelay: 120,
  closeDelay: 80,
  onVisibilityChange: (visible) => console.log(visible),
});

trigger.addEventListener('mouseenter', tooltip.handleMouseEnter);
trigger.addEventListener('mouseleave', tooltip.handleMouseLeave);
trigger.addEventListener('focusin', tooltip.handleFocusIn);
trigger.addEventListener('focusout', tooltip.handleFocusOut);

const triggerProps = tooltip.getTriggerProps();
const tooltipProps = tooltip.getTooltipProps();
\`\`\`

### Toast manager
\`\`\`ts
import { createToastManager } from '@andersseen/headless-components/toast';

const toasts = createToastManager({
  defaultDuration: 3000,
  maxToasts: 5,
  position: 'bottom-right',
  onToastsChange: (list) => console.log(list),
});

const id = toasts.actions.present('Saved', 'success');
toasts.actions.dismiss(id);
toasts.actions.dismissAll();

const containerProps = toasts.getContainerProps();
const dismissProps = toasts.getDismissProps();
\`\`\`

## LLM implementation rules
- Use the real package name: @andersseen/headless-components.
- Do not invent rendering helpers; compose with semantic HTML and spread returned props.
- Preserve provided keyboard handlers and ARIA attributes.
- Do not duplicate focus/state logic already provided by module actions/queries.
- Call destroy() where provided (tooltip/toast manager) during unmount cleanup.
`;
