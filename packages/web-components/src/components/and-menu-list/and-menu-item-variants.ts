import { cva, type VariantProps } from 'class-variance-authority';

export const menuItemVariants = cva(
  [
    'relative flex w-full cursor-pointer select-none items-center',
    'rounded-md px-2 py-1.5 text-sm font-sans outline-none',
    'transition-colors duration-normal',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  ].join(' '),
  {
    variants: {
      intent: {
        default: [
          'text-foreground',
          'hover:bg-accent hover:text-accent-foreground',
          'focus:bg-accent focus:text-accent-foreground',
        ].join(' '),
        destructive: [
          'text-destructive',
          'hover:bg-destructive/10 hover:text-destructive',
          'focus:bg-destructive/10 focus:text-destructive',
        ].join(' '),
      },
      disabled: {
        true: 'opacity-50 pointer-events-none cursor-default',
        false: '',
      },
    },
    defaultVariants: {
      intent: 'default',
      disabled: false,
    },
  },
);

export type MenuItemVariantProps = VariantProps<typeof menuItemVariants>;
