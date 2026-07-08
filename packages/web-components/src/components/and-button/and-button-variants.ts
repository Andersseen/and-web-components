import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium font-sans',
    'transition-all duration-normal',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background',
    'disabled:opacity-50 disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:shadow-md hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:shadow-md hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:shadow-md hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-muted-foreground no-underline hover:text-foreground px-2 py-1 h-auto rounded-md hover:bg-accent/50',
      },
      size: {
        default: 'h-11 sm:h-10 py-2 px-4',
        sm: 'h-10 sm:h-9 px-3 rounded-md',
        lg: 'h-12 sm:h-11 px-8 rounded-md',
        icon: 'h-11 w-11 sm:h-10 sm:w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const spinnerClass = 'and-spinner mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent';

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
