export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
}

export type Section =
  | 'components'
  | 'icons'
  | 'themes'
  | 'headless'
  | 'motion'
  | 'layout'
  | 'docs';

export interface DropdownOption {
  text: string;
  value: string;
}

export const NAV_ITEMS: Array<{ id: Section; label: string }> = [
  { id: 'components', label: 'Components' },
  { id: 'headless', label: 'Headless' },
  { id: 'icons', label: 'Icons' },
  { id: 'motion', label: 'Motion' },
  { id: 'layout', label: 'Layout' },
  { id: 'docs', label: 'Docs' },
];

export const COMPONENT_ITEMS: SidebarItem[] = [
  { id: 'accordion', label: 'Accordion', icon: 'layers' },
  { id: 'alert', label: 'Alert', icon: 'alert-circle' },
  { id: 'badge', label: 'Badge', icon: 'award' },
  { id: 'breadcrumb', label: 'Breadcrumb', icon: 'chevron-right' },
  { id: 'button', label: 'Button', icon: 'circle-dot' },
  { id: 'card', label: 'Card', icon: 'credit-card' },
  { id: 'carousel', label: 'Carousel', icon: 'gallery' },
  { id: 'context-menu', label: 'Context Menu', icon: 'mouse-pointer' },
  { id: 'drawer', label: 'Drawer', icon: 'panel-left' },
  { id: 'dropdown', label: 'Dropdown', icon: 'chevron-down' },
  { id: 'input', label: 'Input', icon: 'text-cursor' },
  { id: 'menu-list', label: 'Menu List', icon: 'list' },
  { id: 'modal', label: 'Modal', icon: 'app-window' },
  { id: 'navbar', label: 'Navbar', icon: 'panel-top' },
  { id: 'pagination', label: 'Pagination', icon: 'list-ordered' },
  { id: 'select', label: 'Select', icon: 'chevron-down' },
  { id: 'sidebar', label: 'Sidebar', icon: 'panel-left-open' },
  { id: 'tabs', label: 'Tabs', icon: 'folder-open' },
  { id: 'toast', label: 'Toast', icon: 'bell' },
  { id: 'tooltip', label: 'Tooltip', icon: 'message-square' },
];

export const HEADLESS_ITEMS: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: 'compass' },
  { id: 'button', label: 'Button', icon: 'circle-dot' },
  { id: 'dropdown', label: 'Dropdown', icon: 'chevron-down' },
  { id: 'tabs', label: 'Tabs', icon: 'folder-open' },
  { id: 'accordion', label: 'Accordion', icon: 'layers' },
  { id: 'modal', label: 'Modal', icon: 'app-window' },
  { id: 'navbar', label: 'Navbar', icon: 'panel-top' },
  { id: 'sidebar', label: 'Sidebar', icon: 'panel-left-open' },
  { id: 'tooltip', label: 'Tooltip', icon: 'message-square' },
  { id: 'toast', label: 'Toast', icon: 'bell' },
  { id: 'drawer', label: 'Drawer', icon: 'panel-left' },
  { id: 'alert', label: 'Alert', icon: 'alert-circle' },
  { id: 'breadcrumb', label: 'Breadcrumb', icon: 'chevron-right' },
  { id: 'menu-list', label: 'Menu List', icon: 'list' },
  { id: 'context-menu', label: 'Context Menu', icon: 'mouse-pointer' },
];

export const MOTION_ITEMS: SidebarItem[] = [
  { id: 'attribute', label: 'Overview', icon: 'code' },
  { id: 'attention-seekers', label: 'Attention Seekers', icon: 'zap' },
  { id: 'fading', label: 'Fading', icon: 'eye' },
  { id: 'sliding', label: 'Sliding', icon: 'arrow-right' },
  { id: 'zooming', label: 'Zooming', icon: 'search' },
  { id: 'bouncing', label: 'Bouncing', icon: 'circle' },
  { id: 'flippers', label: 'Flippers', icon: 'rotate-cw' },
  { id: 'rotating', label: 'Rotating', icon: 'refresh-cw' },
  { id: 'lightspeed', label: 'Light Speed', icon: 'zap' },
  { id: 'back', label: 'Back', icon: 'skip-back' },
  { id: 'specials', label: 'Specials', icon: 'star' },
];

export const LAYOUT_ITEMS: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: 'compass' },
  { id: 'flex', label: 'Flexbox', icon: 'columns' },
  { id: 'grid', label: 'Grid', icon: 'layout' },
  { id: 'spacing', label: 'Spacing', icon: 'move' },
  { id: 'typography', label: 'Typography', icon: 'type' },
  { id: 'responsive', label: 'Responsive', icon: 'monitor' },
];

export const THEME_OPTIONS: DropdownOption[] = [
  { text: 'Modern', value: 'default' },
  { text: 'Compact', value: 'compact' },
  { text: 'Playful', value: 'playful' },
  { text: 'Retro', value: 'retro' },
  { text: 'Elegant', value: 'elegant' },
];

export const COLOR_OPTIONS: DropdownOption[] = [
  { text: 'Indigo & Rose', value: 'indigo-rose' },
  { text: 'Slate & Amber', value: 'slate-amber' },
  { text: 'Emerald & Orange', value: 'emerald-orange' },
  { text: 'Violet & Cyan', value: 'violet-cyan' },
  { text: 'Rose & Teal', value: 'rose-teal' },
];
