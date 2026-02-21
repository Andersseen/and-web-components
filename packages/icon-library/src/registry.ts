const getGlobalRegistry = (): Map<string, string> => {
  const globalObject = (
    typeof window !== "undefined" ? window : globalThis
  ) as any;
  if (!globalObject.__AND_ICONS_REGISTRY__) {
    globalObject.__AND_ICONS_REGISTRY__ = new Map<string, string>();
  }
  return globalObject.__AND_ICONS_REGISTRY__;
};

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
export const registerIcons = (icons: Record<string, string>): void => {
  const registry = getGlobalRegistry();
  for (const [name, content] of Object.entries(icons)) {
    registry.set(name, content);
  }
};

/**
 * Retrieves an icon SVG content from the registry by name.
 * Returns `undefined` if the icon has not been registered.
 */
export const getIcon = (name: string): string | undefined => {
  return getGlobalRegistry().get(name);
};

/**
 * Check if an icon is registered.
 */
export const hasIcon = (name: string): boolean => {
  return getGlobalRegistry().has(name);
};

/**
 * Returns an array of all registered icon names.
 */
export const getRegisteredIconNames = (): string[] => {
  return Array.from(getGlobalRegistry().keys());
};

/**
 * Returns the total number of registered icons.
 */
export const getRegisteredIconCount = (): number => {
  return getGlobalRegistry().size;
};
