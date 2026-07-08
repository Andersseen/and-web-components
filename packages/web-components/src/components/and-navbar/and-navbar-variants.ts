import { cva, type VariantProps } from 'class-variance-authority';

export const navbarVariants = cva('w-full', {
  variants: {
    variant: {
      default: 'bg-background border-b border-border',
      filled: 'bg-primary text-primary-foreground border-b border-primary',
      floating: 'navbar-floating bg-background shadow-lg border border-border',
      glass: [
        'bg-background/60 border-b border-border/50',
        'backdrop-blur-xl',
        '-webkit-backdrop-filter: blur(20px)',
      ].join(' '),
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

/**
 * Nav-link item style variants.
 * Layout-only classes via cva — visual distinctiveness is handled
 * entirely in CSS via [data-item-style] + [data-state] selectors
 * so the styles work reliably inside Shadow DOM.
 */
export const navItemVariants = cva(
  [
    'nav-link relative inline-flex items-center gap-1.5',
    'text-sm font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'bg-transparent border-none cursor-pointer no-underline',
  ].join(' '),
  {
    variants: {
      disabled: {
        true: 'opacity-50 pointer-events-none cursor-default',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

export type NavbarProps = VariantProps<typeof navbarVariants>;
