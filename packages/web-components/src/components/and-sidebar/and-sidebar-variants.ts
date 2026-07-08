import { cva, type VariantProps } from 'class-variance-authority';

export const sidebarVariants = cva('sidebar-root flex h-full flex-col transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-background border-r border-border',
      filled: 'bg-muted border-r border-border',
      floating: 'sidebar-floating bg-background shadow-xl border border-border',
      glass: ['bg-background/60 border-r border-border/50', 'backdrop-blur-xl'].join(' '),
    },
    collapsed: {
      true: '',
      false: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    collapsed: false,
  },
});

export const sidebarItemVariants = cva(
  [
    'sidebar-item flex w-full items-center gap-3 text-sm font-medium',
    'transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
    'bg-transparent border-none cursor-pointer text-left',
  ].join(' '),
  {
    variants: {
      collapsed: {
        true: 'px-0 py-3 sm:py-2',
        false: 'px-0 py-3 sm:py-2',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none cursor-default',
        false: '',
      },
    },
    defaultVariants: {
      collapsed: false,
      disabled: false,
    },
  },
);

export type SidebarVariantProps = VariantProps<typeof sidebarVariants>;
