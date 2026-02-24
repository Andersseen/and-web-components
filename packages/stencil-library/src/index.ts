/**
 * @fileoverview entry point for your component library
 *
 * This is the entry point for your component library. Use this file to export utilities,
 * constants or data structure that accompany your components.
 *
 * DO NOT use this file to export your components. Instead, use the recommended approaches
 * to consume components of this package as outlined in the `README.md`.
 */

export { cn } from './utils/cn';
export { normalizeProps } from './utils/utils';
export { enableAnimations, disableAnimations, isAnimationsEnabled } from './utils/animation-config';
export type * from './components.d.ts';
