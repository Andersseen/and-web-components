import { cva } from 'class-variance-authority';

// Styled via the hidden `peer` checkbox's native state (:checked/:disabled),
// not JS-toggled classes — see and-switch.tsx for why the checkbox must stay
// a real, unhidden-from-forms sibling for this to work.
export const switchTrackClass = [
  'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full',
  'border-2 border-transparent bg-input',
  'transition-colors duration-fast',
  'peer-checked:bg-primary',
  'peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring',
  'peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background',
  'peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
].join(' ');

export const switchThumbClass = [
  'pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background shadow-lg',
  'transition-transform duration-fast',
  'peer-checked:translate-x-5',
].join(' ');

export const switchRootVariants = cva('relative inline-flex cursor-pointer items-center', {
  variants: {
    disabled: {
      true: 'cursor-not-allowed',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
  },
});
