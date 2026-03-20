export const HEADLESS_CORE_PROMPT = `\
CONTEXT: @andersseen/headless-core

## Library profile
Framework-agnostic state and behavior primitives.
Provides ARIA props, keyboard handlers, focus management, and state machines.
No DOM rendering. No CSS. No opinions on markup.
Compose with your own HTML and styles.

## Install
\`\`\`
npm i @andersseen/headless-core
\`\`\`

## Canonical API shape
Every module exports a single factory function \`createX(config?)\`.
The returned object always follows this shape:
\`\`\`ts
const logic = createX(config);

logic.state          // Readonly reactive state object
logic.actions        // Mutating methods
logic.queries        // Read-only derived values (on many components)
logic.getXProps(...) // Returns ARIA/keyboard attribute objects → spread onto elements
logic.handleXKeyDown(event, ...) // Keyboard handlers → call from onKeyDown
\`\`\`

## Modules

### createAccordion
\`\`\`ts
import { createAccordion } from '@andersseen/headless-core/accordion';

const accordion = createAccordion({
  allowMultiple: true,
  defaultValue: ['item-1'],
  onValueChange: (items) => console.log('expanded:', items),
  orientation: 'vertical',
  disabled: false,
});

// State
accordion.state.expandedItems  // Set<string>
accordion.state.orientation
accordion.state.disabled

// Actions
accordion.actions.toggle('item-1')
accordion.actions.expand('item-1')
accordion.actions.collapse('item-1')
accordion.actions.expandAll()
accordion.actions.collapseAll()

// Queries
accordion.queries.isExpanded('item-1')  // boolean
accordion.queries.getExpandedItems()    // string[]

// Props (spread onto elements)
accordion.getContainerProps()          // data-orientation
accordion.getTriggerProps('item-1')    // aria-expanded, aria-controls, role, tabindex
accordion.getContentProps('item-1')    // role="region", aria-hidden, hidden

// Keyboard (call on trigger keydown)
accordion.handleTriggerKeyDown(event, 'item-1')
\`\`\`

### createTabs
\`\`\`ts
import { createTabs } from '@andersseen/headless-core/tabs';

const tabs = createTabs({
  defaultValue: 'overview',
  activationMode: 'automatic', // 'manual' = Enter/Space required
  orientation: 'horizontal',
  onValueChange: (value) => console.log('tab:', value),
});

tabs.state.activeTab
tabs.queries.isActive('overview')

tabs.getTabListProps()                  // role, aria-orientation
tabs.getTabProps('overview')            // role="tab", aria-selected, aria-controls, tabindex
tabs.getTabPanelProps('overview')       // role="tabpanel", aria-labelledby, hidden

tabs.handleTabKeyDown(event, 'overview', ['overview', 'settings'])
\`\`\`

### createDropdown
\`\`\`ts
import { createDropdown } from '@andersseen/headless-core/dropdown';

const dropdown = createDropdown({
  closeOnSelect: true,
  placement: 'bottom',
  onOpenChange: (open) => console.log('open:', open),
});

dropdown.state.isOpen
dropdown.actions.open()
dropdown.actions.close()
dropdown.actions.toggle()
dropdown.actions.selectItem('item-id')

// Spread onto trigger button
dropdown.getTriggerProps()   // aria-haspopup, aria-expanded, data-state
// Spread onto menu container
dropdown.getMenuProps()      // role="menu", hidden, data-state
// Spread onto each menu item
dropdown.getItemProps('item-id')  // role="menuitem", tabindex

dropdown.handleTriggerKeyDown(event)
dropdown.handleMenuKeyDown(event, ['item-1', 'item-2'])
\`\`\`

### createModal
\`\`\`ts
import { createModal } from '@andersseen/headless-core/modal';

const modal = createModal({
  closeOnEscape: true,
  closeOnOverlayClick: true,
  onOpenChange: (open) => console.log('modal:', open),
});

modal.state.isOpen
modal.actions.open()
modal.actions.close()
modal.actions.toggle()

modal.getOverlayProps()      // data-state, aria-hidden
modal.getContentProps()      // role="dialog", aria-modal, aria-hidden, tabindex=-1
modal.getCloseButtonProps()  // aria-label="Close", type="button"

modal.handleKeyDown(event)   // Escape → close
modal.handleOverlayClick()   // closes if closeOnOverlayClick
\`\`\`

### createDrawer
\`\`\`ts
import { createDrawer } from '@andersseen/headless-core/drawer';

const drawer = createDrawer({
  placement: 'right',
  closeOnEscape: true,
  closeOnOverlayClick: true,
  onOpenChange: (open) => {},
});

drawer.state.isOpen
drawer.state.placement

drawer.actions.open()
drawer.actions.close()
drawer.actions.toggle()
drawer.actions.setPlacement('left')

drawer.getOverlayProps()       // data-state, aria-hidden
drawer.getContentProps()       // role="dialog", aria-modal, data-side, data-state
drawer.getCloseButtonProps()   // aria-label, type="button"

drawer.handleKeyDown(event)
drawer.handleOverlayClick()
\`\`\`

### createToast
\`\`\`ts
import { createToast } from '@andersseen/headless-core/toast';

const toast = createToast({
  defaultDuration: 3000,
  onToastAdd: (toast) => {},
  onToastRemove: (id) => {},
});

toast.state.toasts    // Array<{ id, message, type, duration, visible }>
toast.actions.add(message, type?, duration?)  // returns id: number
toast.actions.remove(id)
toast.actions.removeAll()

toast.getRegionProps()        // role="status", aria-live="polite", aria-atomic
toast.getToastProps(toastId)  // role="alert", aria-live="assertive" for destructive
\`\`\`

### createNavbar
\`\`\`ts
import { createNavbar } from '@andersseen/headless-core/navbar';

const navbar = createNavbar({
  items: [{ id: 'home', label: 'Home', href: '#home' }],
  defaultActiveItem: 'home',
  scrollSpy: true,
  scrollSpyOffset: 100,
  onActiveItemChange: (id) => {},
});

navbar.state.activeItem
navbar.state.mobileMenuOpen

navbar.actions.setActiveItem('home')
navbar.actions.toggleMobileMenu()
navbar.actions.updateActiveFromScroll()
navbar.actions.updateActiveFromHash()

navbar.queries.isActive('home')
navbar.queries.isDisabled('home')

navbar.getContainerProps()                              // role, aria-label
navbar.getNavListProps()                               // role="menubar"
navbar.getItemProps('home', { href: '#home' })         // role, aria-current, data-active
navbar.getToggleProps()                               // aria-expanded, aria-controls
navbar.getMobileMenuProps()                            // role="menu", hidden, data-state

navbar.handleItemKeyDown(event, 'home')
\`\`\`

### createSidebar
\`\`\`ts
import { createSidebar } from '@andersseen/headless-core/sidebar';

const sidebar = createSidebar({
  items: [{ id: 'home', label: 'Home', icon: 'home', section: 'main' }],
  defaultActiveItem: 'home',
  defaultCollapsed: false,
  onActiveItemChange: (id) => {},
  onCollapsedChange: (collapsed) => {},
});

sidebar.state.activeItem
sidebar.state.collapsed

sidebar.actions.setActiveItem('home')
sidebar.actions.toggle()
sidebar.actions.collapse()
sidebar.actions.expand()

sidebar.queries.isActive('home')
sidebar.getNavProps()
sidebar.getItemProps('home')
\`\`\`

### createAlert
\`\`\`ts
import { createAlert } from '@andersseen/headless-core/alert';

const alert = createAlert({ variant: 'success', dismissible: true, onDismiss: () => {} });

alert.state.visible
alert.state.variant
alert.actions.dismiss()
alert.actions.show()
alert.actions.setVariant('warning')

alert.getAlertProps()          // role="alert"|"status", aria-live, data-state
alert.getDismissButtonProps()  // aria-label, type="button"
\`\`\`

### createBreadcrumb
\`\`\`ts
import { createBreadcrumb } from '@andersseen/headless-core/breadcrumb';

const breadcrumb = createBreadcrumb({
  items: [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'products', label: 'Products', href: '/products' },
    { id: 'item', label: 'Laptop', current: true },
  ],
  onNavigate: (item) => router.navigate(item.href),
});

breadcrumb.getNavProps()           // role="navigation", aria-label
breadcrumb.getListProps()          // role="list"
breadcrumb.getItemProps(item)      // aria-current, data-state
breadcrumb.getLinkProps(item)      // href, aria-current, tabindex
breadcrumb.handleKeyDown(event, item)
\`\`\`

### createButton
\`\`\`ts
import { createButton } from '@andersseen/headless-core/button';

const btn = createButton({ disabled: false, loading: false, onClick: (e) => {} });

btn.state.disabled
btn.state.loading
btn.actions.setDisabled(true)
btn.actions.setLoading(true)
btn.actions.click(event)   // no-ops when disabled or loading

btn.getButtonProps()  // type, disabled, tabindex, aria-disabled, aria-busy, data-state
\`\`\`

### createContextMenu
\`\`\`ts
import { createContextMenu } from '@andersseen/headless-core/context-menu';

const menu = createContextMenu({ closeOnSelect: true, onOpenChange: (open) => {} });

menu.state.isOpen
menu.state.position  // { x, y }
menu.actions.open({ x: 100, y: 200 })
menu.actions.close()
menu.actions.selectItem('copy')

menu.getTriggerProps()           // data-state
menu.getPanelProps('My Menu')    // role="menu", aria-label, hidden, data-state

menu.handleContextMenu(event)    // captures position, calls open()
menu.handleKeyDown(event)        // Escape → close
\`\`\`

### createMenuList
\`\`\`ts
import { createMenuList } from '@andersseen/headless-core/menu-list';

const menuList = createMenuList({
  items: [
    { id: 'edit', intent: 'default' },
    { id: 'delete', intent: 'destructive' },
  ],
  onSelect: (id) => console.log('selected:', id),
  rovingFocus: true,
});

menuList.getMenuProps()             // role="menu", aria-label
menuList.getItemProps(item, index)  // role="menuitem", tabindex, aria-disabled
menuList.handleMenuKeyDown(event)   // Arrow keys, Home, End
menuList.handleItemKeyDown(event, item)
\`\`\`

## Rules for LLM output
- Always call the factory function; never instantiate a class.
- Spread getXProps() return objects onto the corresponding DOM elements.
- Do not reimplement focus management or keyboard state that the library already handles.
- Keep rendering and state completely decoupled — the library has zero DOM knowledge.
- State changes are synchronous; re-render your component after calling actions.
`;
