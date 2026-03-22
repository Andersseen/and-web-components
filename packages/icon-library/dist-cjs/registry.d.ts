/**
 * Registers one or more icons to the global icon registry.
 *
 * @example
 * ```ts
 * import { registerIcons, CLOSE, CHEVRON_DOWN } from '@andersseen/icon';
 *
 * // Register only the icons you need (tree-shakeable)
 * registerIcons({ close: CLOSE, 'chevron-down': CHEVRON_DOWN });
 * ```
 */
export declare const registerIcons: (icons: Record<string, string>) => void;
/**
 * Retrieves an icon SVG content from the registry by name.
 * Returns `undefined` if the icon has not been registered.
 */
export declare const getIcon: (name: string) => string | undefined;
/**
 * Check if an icon is registered.
 */
export declare const hasIcon: (name: string) => boolean;
/**
 * Returns an array of all registered icon names.
 */
export declare const getRegisteredIconNames: () => string[];
/**
 * Returns the total number of registered icons.
 */
export declare const getRegisteredIconCount: () => number;
