# Theming & CVA Reference — Andersseen Web Components

## 3-Layer Token System

| Layer            | Purpose                 | Used by                                 |
| ---------------- | ----------------------- | --------------------------------------- |
| Primitives       | Raw HSL palette values  | Never used directly in components       |
| Semantic         | Design intent tokens    | Components always consume these         |
| Component-scoped | Per-component overrides | Exposed on `:host`, consumed internally |

---

## Semantic Token Reference

These are what components use. **Never use primitives or raw Tailwind colors.**

```css
/* Backgrounds */
--and-background       /* page background */
--and-foreground       /* default text */
--and-surface          /* card, input surfaces */
--and-surface-elevated /* floating panels, dropdowns */

/* Brand */
--and-primary           /* primary action — default indigo-600 */
--and-primary-foreground
--and-primary-hover

/* Secondary */
--and-secondary
--and-secondary-foreground

/* Semantic */
--and-destructive
--and-destructive-foreground
--and-success
--and-warning
--and-info

/* UI Chrome */
--and-border
--and-input
--and-ring              /* focus ring color */
--and-muted
--and-muted-foreground
--and-accent            /* hover/focus bg for items */
--and-accent-foreground

/* Shape */
--and-radius-sm         /* 0.25rem */
--and-radius            /* 0.5rem */
--and-radius-md         /* 0.75rem */
--and-radius-lg         /* 1rem */
--and-radius-full       /* 9999px */

/* Motion */
--and-duration-fast     /* 100ms */
--and-duration-base     /* 150ms */
--and-duration-slow     /* 300ms */
--and-easing-default    /* cubic-bezier(0.4, 0, 0.2, 1) */
--and-easing-spring     /* cubic-bezier(0.34, 1.56, 0.64, 1) */

/* Elevation */
--and-shadow-sm
--and-shadow
--and-shadow-lg

/* Z-index Scale */
--and-z-dropdown    /* 1000 */
--and-z-sticky      /* 1100 */
--and-z-overlay     /* 1200 */
--and-z-modal       /* 1300 */
--and-z-popover     /* 1400 */
--and-z-toast       /* 1500 */
--and-z-tooltip     /* 1600 */
```

---

## Theme System — One Import Promise

```css
/* Light mode (default) */
@import "@andersseen/web-components/themes/default.css";

/* Specific palette + base */
@import "@andersseen/web-components/themes/emerald-dark.css";

/* Bring your own tokens */
@import "@andersseen/web-components/themes/base.css";
```

### Runtime Palette / Mode Switching

```html
<html data-and-palette="emerald">
  <html data-and-mode="dark"></html>
</html>
```

### Dark Mode

Tokens automatically respond to:

- `@media (prefers-color-scheme: dark)` — system preference
- `.dark` class on `<html>` or any ancestor — class-based override

---

## CVA — Class Variance Authority

### When to Use

CVA is **mandatory** for any component with 2+ visual variants.
Import from `class-variance-authority`.

### Basic Pattern

```tsx
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  // Base classes — always applied
  [
    'inline-flex items-center justify-center gap-2',
    'font-medium whitespace-nowrap select-none',
    'transition-all duration-[--and-duration-base]',
    'focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-[hsl(var(--and-ring))] focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'rounded-[--and-radius]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[hsl(var(--and-primary))] text-[hsl(var(--and-primary-foreground))]',
          'hover:bg-[hsl(var(--and-primary-hover))]',
          'active:scale-[0.98]',
        ].join(' '),
        secondary: [
          'bg-[hsl(var(--and-secondary))] text-[hsl(var(--and-secondary-foreground))]',
          'hover:bg-[hsl(var(--and-secondary)/0.8)]',
        ].join(' '),
        outline: [
          'border border-[hsl(var(--and-border))] bg-transparent',
          'text-[hsl(var(--and-foreground))]',
          'hover:bg-[hsl(var(--and-accent))] hover:text-[hsl(var(--and-accent-foreground))]',
        ].join(' '),
        ghost: [
          'bg-transparent text-[hsl(var(--and-foreground))]',
          'hover:bg-[hsl(var(--and-accent))] hover:text-[hsl(var(--and-accent-foreground))]',
        ].join(' '),
        destructive: [
          'bg-[hsl(var(--and-destructive))] text-[hsl(var(--and-destructive-foreground))]',
          'hover:bg-[hsl(var(--and-destructive)/0.9)]',
        ].join(' '),
        link: [
          'bg-transparent text-[hsl(var(--and-primary))]',
          'underline-offset-4 hover:underline h-auto px-0',
        ].join(' '),
      },
      size: {
        sm:   'h-8 px-3 text-xs',
        md:   'h-10 px-4 text-sm',
        lg:   'h-12 px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);

// In render()
render() {
  const classes = buttonVariants({ variant: this.variant, size: this.size });
  return (
    <Host>
      <button class={classes} disabled={this.disabled}>
        <slot name="prefix" />
        <slot />
        <slot name="suffix" />
      </button>
    </Host>
  );
}
```

### Compound Variants

Used when a combination of variants needs special treatment:

```tsx
const menuItemVariants = cva(
  "flex items-center w-full cursor-pointer select-none outline-none" +
    " transition-colors focus:bg-[--[name]-item-focus-bg]",
  {
    variants: {
      variant: {
        default: "text-[hsl(var(--and-foreground))]",
        destructive: "text-[--[name]-item-destructive-color]",
      },
      inset: {
        true: "pl-8",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "destructive",
        inset: false,
        class: "focus:bg-[hsl(var(--and-destructive)/0.1)]",
      },
    ],
    defaultVariants: { variant: "default", inset: false },
  },
);
```

### CSS Custom Property in Tailwind Classes

Reference component-scoped tokens in Tailwind classes using bracket notation:

```tsx
// ✅ Component-scoped CSS var
"min-w-[--dropdown-min-width]";
"max-h-[--dropdown-max-height]";
"rounded-[--dropdown-radius]";
"shadow-[--dropdown-shadow]";

// ✅ Semantic token (always via hsl())
"bg-[hsl(var(--and-surface-elevated))]";
"text-[hsl(var(--and-foreground))]";
"border-[hsl(var(--and-border))]";
```

---

## CSS Parts — External Styling Escape Hatch

```tsx
// Expose parts for consumers who need deep styling
<div part="panel" class={panelClasses}>
  <ul part="list" role="menu">
    <slot />
  </ul>
</div>
```

Consumer usage:

```css
and-dropdown::part(panel) {
  border-radius: 0;
}
and-dropdown::part(list) {
  padding: 0.5rem;
}
```

**Document every `part` attribute with a `@csspart` JSDoc tag.**
