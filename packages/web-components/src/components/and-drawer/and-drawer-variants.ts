import { cva, type VariantProps } from 'class-variance-authority';

export const overlayVariants = cva('and-drawer-overlay fixed inset-0 z-[9999] bg-foreground/60', {
  variants: {
    open: {
      true: 'opacity-100 pointer-events-auto',
      false: 'opacity-0 pointer-events-none',
    },
  },
  defaultVariants: { open: false },
});

export const contentVariants = cva(
  'and-drawer-content fixed z-[10000] flex flex-col bg-background shadow-xl outline-none overflow-y-auto overflow-x-hidden',
  {
    variants: {
      placement: {
        left: 'top-0 left-0 bottom-0 w-[min(85vw,20rem)] border-r border-border',
        right: 'top-0 right-0 bottom-0 w-[min(85vw,20rem)] border-l border-border',
        top: 'top-0 left-0 right-0 max-h-[50vh] border-b border-border',
        bottom: 'bottom-0 left-0 right-0 max-h-[50vh] border-t border-border',
      },
      open: {
        true: 'translate-x-0 translate-y-0',
        false: '',
      },
      animate: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { placement: 'left', open: false, class: '-translate-x-full' },
      { placement: 'right', open: false, class: 'translate-x-full' },
      { placement: 'top', open: false, class: '-translate-y-full' },
      { placement: 'bottom', open: false, class: 'translate-y-full' },
    ],
    defaultVariants: {
      placement: 'left',
      open: false,
      animate: true,
    },
  },
);

export const closeBtnVariants = cva(
  [
    'inline-flex items-center justify-center w-8 h-8 shrink-0',
    'border-none bg-transparent rounded-md cursor-pointer',
    'text-muted-foreground transition-colors duration-150',
    'hover:bg-accent hover:text-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  ].join(' '),
);

export type DrawerVariantProps = VariantProps<typeof contentVariants>;
