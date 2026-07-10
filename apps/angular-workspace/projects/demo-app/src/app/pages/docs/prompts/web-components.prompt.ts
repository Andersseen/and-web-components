export const WEB_COMPONENTS_PROMPT = `\\
<andersseen-web-components-context>
## Library profile
Stencil custom-elements package. All tags share the \`and-*\` prefix.
Renders in Shadow DOM — do NOT depend on internal shadow markup or classes.
Built on top of @andersseen/headless-core and @andersseen/icon.
Framework-agnostic; works in plain HTML, Angular, React, Vue, Astro.

## Install
\`\`\`
npm i @andersseen/web-components @andersseen/icon
\`\`\`

## Setup (bundled app)
\`\`\`ts
// Register all custom elements
import '@andersseen/web-components/components/all';
import '@andersseen/web-components/style.css';

// Register icons used by internal components (minimum required)
import { registerIcons, COMPONENT_ICONS } from '@andersseen/icon';
registerIcons(COMPONENT_ICONS);

// Optional: enable CSS transitions across all components
import { enableAnimations } from '@andersseen/web-components';
enableAnimations();
\`\`\`

## Optional default color theme
\`\`\`css
@import '@andersseen/web-components/style.css';
@import '@andersseen/web-components/colors/violet-cyan.css';
\`\`\`
Available colors: indigo-rose, slate-amber, emerald-orange, violet-cyan, rose-teal.

## Design tokens
All tokens use HSL and are applied via CSS variables on \`:root\`.
Dark mode: add class \`dark\` (or \`data-theme="dark"\`) to \`<html>\` or any ancestor.

Key semantic tokens:
  --primary / --primary-foreground
  --secondary / --secondary-foreground
  --background / --foreground
  --card / --card-foreground
  --muted / --muted-foreground
  --accent / --accent-foreground
  --destructive / --destructive-foreground
  --border / --input / --ring
  --success / --warning / --info (each with -foreground pair)

Prefer \`hsl(var(--token))\` over hardcoded colors when extending styles.

## Component contracts

### and-button
Props    : variant (default|destructive|outline|secondary|ghost|link)
           size (default|sm|lg|icon)   type (button|submit|reset)
           disabled  loading  href  target  rel  customClass
Events   : andButtonClick → MouseEvent
Slots    : [start] label text [end]
\`\`\`html
<and-button variant="default">Save</and-button>
<and-button variant="outline" size="sm" loading>
  <and-icon slot="start" name="sparkles" size="16"></and-icon>
  Generate
</and-button>
\`\`\`

### and-card
Props    : variant (default|destructive|elevated|outline|ghost)   padded   customClass
Sub-components: and-card-header · and-card-title · and-card-description
                and-card-content · and-card-footer
\`\`\`html
<and-card variant="elevated" padded>
  <and-card-header>
    <and-card-title>Title</and-card-title>
    <and-card-description>Subtitle</and-card-description>
  </and-card-header>
  <and-card-content>Body content</and-card-content>
  <and-card-footer>Footer</and-card-footer>
</and-card>
\`\`\`

### and-accordion
Props    : allowMultiple (bool)  defaultValue (string[])  orientation  disabled
Sub-components: and-accordion-item (value, disabled)
                 and-accordion-trigger (default slot → label)
                 and-accordion-content (default slot → body)
\`\`\`html
<and-accordion allow-multiple>
  <and-accordion-item value="q1">
    <and-accordion-trigger>Question 1</and-accordion-trigger>
    <and-accordion-content>Answer 1</and-accordion-content>
  </and-accordion-item>
</and-accordion>
\`\`\`

### and-alert
Props    : variant (default|destructive|success|warning|info)   dismissible
Events   : andDismiss → void
Slots    : [icon] body text
\`\`\`html
<and-alert variant="success" dismissible>
  <and-icon slot="icon" name="check-circle" size="16"></and-icon>
  Profile saved successfully.
</and-alert>
\`\`\`

### and-badge
Props    : variant (default|secondary|destructive|outline)   customClass
\`\`\`html
<and-badge variant="secondary">Beta</and-badge>
\`\`\`

### and-breadcrumb + and-breadcrumb-item
Props (container) : size (sm|md|lg)   navLabel   customClass
Props (item)      : href   current (bool)   size   hideSeparator   customClass
Events (item)     : andBreadcrumbNavigate → string (href)
\`\`\`html
<and-breadcrumb>
  <and-breadcrumb-item href="/">Home</and-breadcrumb-item>
  <and-breadcrumb-item href="/products">Products</and-breadcrumb-item>
  <and-breadcrumb-item current>Laptop</and-breadcrumb-item>
</and-breadcrumb>
\`\`\`

### and-carousel + and-carousel-item
Props (container) : autoplay (bool)  interval (ms)  label (ARIA)
Events            : andSlideChange → number (0-based index)
Props (item)      : label (ARIA slide label)
Keyboard          : ArrowLeft / ArrowRight
\`\`\`html
<and-carousel autoplay interval="5000">
  <and-carousel-item label="Slide 1"><img src="..." alt="" /></and-carousel-item>
  <and-carousel-item label="Slide 2"><img src="..." alt="" /></and-carousel-item>
</and-carousel>
\`\`\`

### and-context-menu
Props   : open (mutable bool)   customClass
Events  : andContextMenuOpenChange → boolean
Slots   : [trigger] (right-click target)   default (menu items)
\`\`\`html
<and-context-menu>
  <div slot="trigger">Right-click me</div>
  <and-menu-item value="copy">Copy</and-menu-item>
  <and-menu-item value="delete" intent="destructive">Delete</and-menu-item>
</and-context-menu>
\`\`\`

### and-drawer
Props    : open (mutable bool)   placement (left|right|top|bottom)   showClose (bool)
Events   : andDrawerOpen · andDrawerClose
Slots    : [header]  [close-icon]  default (body)  [footer]
\`\`\`html
<and-drawer id="nav" placement="right">
  <span slot="header">Settings</span>
  <p>Drawer body content</p>
</and-drawer>
<and-button onclick="document.getElementById('nav').open = true">Open</and-button>
\`\`\`

### and-dropdown
Props    : items (DropdownItem[])   variant   label   placement (top|bottom|left|right)   closeOnSelect
DropdownItem: { text: string; value: string; disabled?: boolean }
Events   : andDropdownSelect → string (value)   andDropdownOpenChange → boolean
Slots    : [trigger] (custom trigger element)
\`\`\`ts
const items = [
  { text: 'Light', value: 'light' },
  { text: 'Dark', value: 'dark' },
];
\`\`\`
\`\`\`html
<and-dropdown id="theme" label="Theme"></and-dropdown>
\`\`\`
\`\`\`ts
const dd = document.querySelector<HTMLElement & { items: unknown[] }>('#theme')!;
dd.items = items;
dd.addEventListener('andDropdownSelect', (e: CustomEvent<string>) => {
  document.documentElement.className = e.detail;
});
\`\`\`

### and-icon
Props    : name (IconName — must be registered)   size (default 24)   color (default currentColor)   strokeWidth (default 2)
\`\`\`html
<and-icon name="home" size="20"></and-icon>
\`\`\`

### and-input
Renders in light DOM (not Shadow DOM) — the real \`<input>\` is a descendant of any wrapping \`<form>\`,
so \`FormData\`, native validation, and autofill work with no extra wiring. Set \`name\` for it to show up in \`FormData\`.
Props    : value (mutable string)   type   name   placeholder   disabled   required   hasError   label   describedBy   customClass
Events   : andInputChange → string (current value)   andInputBlur → void
\`\`\`html
<and-input id="email" name="email" type="email" placeholder="you@example.com" required></and-input>
\`\`\`
\`\`\`ts
document.getElementById('email')
  .addEventListener('andInputChange', (e: CustomEvent<string>) => console.log(e.detail));
\`\`\`

### and-select
Custom \`role="combobox"\` select — styleable unlike a native \`<select>\`, full keyboard support (arrow keys, Home/End, typeahead).
Also renders in light DOM: set \`name\` and its hidden mirror input shows up in \`FormData\`.
Props    : options (array or JSON string of {text,value,disabled?})   value (mutable string)   name   placeholder
           disabled   required   hasError   menuPlacement (auto|top|bottom)   label   describedBy   customClass
Events   : andSelectChange → string (selected value)   andSelectBlur → void
\`\`\`html
<and-select name="country" placeholder="Choose a country"></and-select>
\`\`\`
\`\`\`ts
document.querySelector('and-select').options = [{ text: 'Spain', value: 'es' }];
\`\`\`

### and-control
Generic form-field wrapper for anything and-input/and-select don't cover — it renders no control of its own.
Slot in a native \`<textarea>\`, native \`<select>\`, third-party widget, or and-input/and-select, and it wires the
label's \`for\`/\`id\` and the message's \`aria-describedby\` to the first slotted element automatically.
Props    : label   hint   error (shown instead of hint, sets aria-invalid on the control)   required (visual only)
\`\`\`html
<and-control label="Bio" hint="Max 200 characters">
  <textarea name="bio" maxlength="200"></textarea>
</and-control>
<and-control label="Country" error="Required">
  <and-select name="country" placeholder="Choose a country"></and-select>
</and-control>
\`\`\`

### and-code
Read-only command/code snippet block with a copy-to-clipboard button. Plain text only — no syntax highlighting,
and \`prompt\` is just a display hint (not tied to any real shell/language). Prompt is hidden unless \`show-prompt\` is set.
Props    : value   prompt (default \`$\`)   showPrompt (default false)   copyable (default true)   height   customClass
Events   : andCodeCopy → { value: string; success: boolean }
\`\`\`html
<and-code show-prompt="true" prompt="$" value="pnpm install"></and-code>
\`\`\`

### and-menu-list + and-menu-item
Props (list) : ariaMenuLabel   customClass
Props (item) : intent (default|destructive)   disabled   value   customClass
Events (item): andMenuItemSelect → string (value)
\`\`\`html
<and-menu-list>
  <and-menu-item value="edit">Edit</and-menu-item>
  <and-menu-item value="delete" intent="destructive">Delete</and-menu-item>
</and-menu-list>
\`\`\`

### and-modal
Props    : open (mutable bool)
Events   : andClose → void  (backdrop, X button, or Escape)
Slots    : default (body — close button auto-rendered top-right)
\`\`\`html
<and-modal id="confirm">
  <h2>Are you sure?</h2>
  <and-button onclick="document.getElementById('confirm').open = false">Cancel</and-button>
</and-modal>
<and-button onclick="document.getElementById('confirm').open = true">Open</and-button>
\`\`\`

### and-navbar
Props    : items (NavItem[] | JSON string)   activeItem (mutable)
           variant (default|filled|floating|glass)
           position (static|sticky|fixed)
           itemVariant (default|underline|filled)
           scrollSpy   scrollSpyOffset
           mobileBreakpoint  minimalBreakpoint  compactBreakpoint
NavItem  : { id, label, icon?, href?, target?, disabled? }
Events   : navItemClick → string   navLinkClick → { id, href }
           mobileMenuChange → boolean   responsiveStageChange → stage
Slots    : [start/brand]  [main/nav]  [end/actions]
           [toggle-icon]  [mobile-title]  [mobile-nav]  [mobile-actions]
Responsive stages (auto): full → compact → minimal → mobile
\`\`\`html
<and-navbar id="main-nav" variant="filled" position="sticky" scroll-spy>
  <a slot="brand" href="/">Logo</a>
</and-navbar>
\`\`\`
\`\`\`ts
const nav = document.getElementById('main-nav');
nav.items = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'docs', label: 'Docs', href: '#docs' },
];
nav.addEventListener('navItemClick', (e: CustomEvent<string>) => {
  nav.activeItem = e.detail;
});
\`\`\`

### and-pagination
Props  : totalPages (number)   currentPage (mutable number)
Events : andPageChange → number (1-based page)
\`\`\`html
<and-pagination id="pager" total-pages="10" current-page="1"></and-pagination>
\`\`\`
\`\`\`ts
document.getElementById('pager')
  .addEventListener('andPageChange', (e: CustomEvent<number>) => loadPage(e.detail));
\`\`\`

### and-sidebar
Props    : items (SidebarItem[] | JSON string)   activeItem (mutable)   collapsed (mutable bool)
           variant (default|filled|floating|glass)
           itemVariant (default|underline|filled)
           mobileCollapse   mobileBreakpoint
           expandedWidth ('16rem')   collapsedWidth ('4rem')
SidebarItem: { id, label, icon?, disabled?, section?: 'main'|'bottom' }
Events   : andSidebarItemClick → string   andSidebarToggle → boolean (collapsed)
Slots    : [header]  [top]  [nav]  [footer]
CSS vars : --sidebar-expanded-width, --sidebar-collapsed-width
\`\`\`html
<and-sidebar id="sidebar" variant="filled">
  <span slot="header">App</span>
</and-sidebar>
\`\`\`
\`\`\`ts
const sidebar = document.getElementById('sidebar');
sidebar.items = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'settings', label: 'Settings', icon: 'settings', section: 'bottom' },
];
sidebar.addEventListener('andSidebarItemClick', (e) => { sidebar.activeItem = e.detail; });
\`\`\`

### and-tabs
Props    : value (mutable — controlled)   defaultValue (uncontrolled)
           orientation (horizontal|vertical)   activationMode (automatic|manual)
Events   : andTabChange → string (selected value)
Sub-components: and-tabs-list → and-tabs-trigger (value, disabled)
                and-tabs-content (value)
\`\`\`html
<and-tabs default-value="overview">
  <and-tabs-list>
    <and-tabs-trigger value="overview">Overview</and-tabs-trigger>
    <and-tabs-trigger value="settings">Settings</and-tabs-trigger>
  </and-tabs-list>
  <and-tabs-content value="overview">Overview panel content</and-tabs-content>
  <and-tabs-content value="settings">Settings panel content</and-tabs-content>
</and-tabs>
\`\`\`

### and-toast
Usage    : programmatic only (no props / slots)
Method   : present(message, type?, duration?) → Promise<number>
           type: 'default'|'destructive'|'success'|'error'|'info'|'warning'
           duration: ms (default 3000)
\`\`\`html
<and-toast id="toaster"></and-toast>
\`\`\`
\`\`\`ts
const toaster = document.getElementById('toaster');
await toaster.present('Profile saved', 'success');
await toaster.present('Connection failed', 'error', 5000);
\`\`\`

### and-tooltip
Props   : content (string)   placement (top|bottom|left|right)   openDelay (ms)   closeDelay (ms)
Slots   : default (trigger element)   [content] (when no content prop)
\`\`\`html
<and-tooltip content="Copy to clipboard" placement="top">
  <and-button size="icon"><and-icon name="copy" size="16"></and-icon></and-button>
</and-tooltip>
\`\`\`

## Rules for LLM output
- Use public props, slots, and CustomEvent APIs only. Never target internal shadow parts.
- Prefer CSS token variables (e.g. \`hsl(var(--primary))\`) over hex/rgb values.
- Icon \`name\` must match a registered key; always pair with registerIcons/registerAllIcons.
- For array-type props (items, defaultValue) set them via JS, not attribute strings when possible.
- Mutable props marked above can be set directly as element properties.
</andersseen-web-components-context>
`;
