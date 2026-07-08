export const carouselClass = 'relative overflow-hidden rounded-lg';

export const trackContainerClass = 'overflow-hidden';

export const trackClass = 'flex transition-transform duration-300 ease-out';

export const controlBaseClass = [
  'absolute top-1/2 -translate-y-1/2 z-10',
  'inline-flex h-10 w-10 items-center justify-center rounded-full',
  'bg-background/80 text-foreground border border-border',
  'shadow-sm backdrop-blur-sm transition-colors',
  'hover:bg-accent hover:text-accent-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:opacity-50 disabled:pointer-events-none',
].join(' ');

export const dotBaseClass = [
  'h-2 w-2 rounded-full border-none cursor-pointer transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
].join(' ');

export const playPauseClass = [
  'absolute bottom-3 right-3 z-10',
  'inline-flex h-8 w-8 items-center justify-center rounded-full',
  'bg-background/80 text-foreground border border-border',
  'shadow-sm backdrop-blur-sm transition-colors',
  'hover:bg-accent hover:text-accent-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
].join(' ');
