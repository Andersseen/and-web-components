---
title: Navbar
description:
  Responsive top navigation bar that collapses progressively as viewport
  shrinks.
---

Responsive top navigation bar. Collapses progressively as viewport shrinks
(`full` → `compact` → `minimal` → `mobile`), falling back to an
[Drawer](/components/drawer/)-based hamburger menu at the `mobile` stage.
Active-item tracking supports route, hash, scroll-spy, or fully manual modes via
`activeMode`.

`items` accepts either a real array or a JSON string, so it works directly as a
plain HTML attribute — no script needed.

## Example

<div class="and-live-example" style="padding: 0;">
  <and-navbar
    items='[{"id":"home","label":"Home","href":"#"},{"id":"docs","label":"Docs","href":"#"},{"id":"about","label":"About","href":"#"}]'
    active-item="home"
  ></and-navbar>
</div>

```html
<and-navbar
  items='[{"id":"home","label":"Home","href":"#"},{"id":"docs","label":"Docs","href":"#"},{"id":"about","label":"About","href":"#"}]'
  active-item="home"
></and-navbar>
```

## Properties

| Property            | Attribute            | Description                                                                                                 | Type                                                  | Default             |
| ------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------- |
| `activeItem`        | `active-item`        | The active navigation item ID.                                                                              | `string`                                              | `''`                |
| `activeMode`        | `active-mode`        | Strategy used to compute active item (`auto`, `route`, `hash`, `scroll`, or `manual`).                      | `"auto" \| "hash" \| "manual" \| "route" \| "scroll"` | `'auto'`            |
| `ariaNavLabel`      | `aria-nav-label`     | ARIA label for the navigation.                                                                              | `string`                                              | `'Main navigation'` |
| `autoCollapse`      | `auto-collapse`      | Automatically detect when nav items overflow and switch responsive stage regardless of breakpoints.         | `boolean`                                             | `true`              |
| `compactBreakpoint` | `compact-breakpoint` | Breakpoint (px) below which the end section enters compact (icon-only) mode.                                | `number`                                              | `1024`              |
| `itemVariant`       | `item-variant`       | Visual style for individual nav links (`default`, `underline`, or `filled`).                                | `"default" \| "filled" \| "underline"`                | `'default'`         |
| `items`             | `items`              | Navigation items. Accepts an array or a JSON string. Empty → use the `nav` slot for custom content.         | `NavItem[] \| string`                                 | `[]`                |
| `minimalBreakpoint` | `minimal-breakpoint` | Breakpoint (px) below which the main nav moves to the hamburger drawer.                                     | `number`                                              | `768`               |
| `mobileBreakpoint`  | `mobile-breakpoint`  | Breakpoint (px) below which the navbar switches to mobile (hamburger) mode.                                 | `number`                                              | `640`               |
| `position`          | `position`           | Positioning behaviour.                                                                                      | `"fixed" \| "static" \| "sticky"`                     | `'static'`          |
| `routeMatchMode`    | `route-match-mode`   | Route matching mode used when `activeMode` resolves through pathname.                                       | `"exact" \| "prefix"`                                 | `'prefix'`          |
| `scrollSpy`         | `scroll-spy`         | Enable scroll-spy (auto-detect active section by scroll position). Items must use `href` starting with `#`. | `boolean`                                             | `false`             |
| `scrollSpyOffset`   | `scroll-spy-offset`  | Scroll-spy offset from the top of viewport (px).                                                            | `number`                                              | `100`               |
| `variant`           | `variant`            | Visual variant.                                                                                             | `"default" \| "filled" \| "floating" \| "glass"`      | `'default'`         |

## Events

| Event                      | Description                                | Type                                                        |
| -------------------------- | ------------------------------------------ | ----------------------------------------------------------- |
| `andMobileMenuChange`      | Emitted when mobile menu state changes.    | `CustomEvent<boolean>`                                      |
| `andNavItemClick`          | Emitted when active item changes.          | `CustomEvent<string>`                                       |
| `andNavLinkClick`          | Emitted when a navigation link is clicked. | `CustomEvent<{ id: string; href: string; }>`                |
| `andResponsiveStageChange` | Emitted when responsive stage changes.     | `CustomEvent<"compact" \| "full" \| "minimal" \| "mobile">` |
