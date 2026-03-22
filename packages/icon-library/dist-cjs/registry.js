"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegisteredIconCount = exports.getRegisteredIconNames = exports.hasIcon = exports.getIcon = exports.registerIcons = void 0;
const getGlobalRegistry = () => {
    const globalObject = (typeof window !== "undefined" ? window : globalThis);
    if (!globalObject.__AND_ICONS_REGISTRY__) {
        globalObject.__AND_ICONS_REGISTRY__ = new Map();
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
const registerIcons = (icons) => {
    const registry = getGlobalRegistry();
    for (const [name, content] of Object.entries(icons)) {
        registry.set(name, content);
    }
};
exports.registerIcons = registerIcons;
/**
 * Retrieves an icon SVG content from the registry by name.
 * Returns `undefined` if the icon has not been registered.
 */
const getIcon = (name) => {
    return getGlobalRegistry().get(name);
};
exports.getIcon = getIcon;
/**
 * Check if an icon is registered.
 */
const hasIcon = (name) => {
    return getGlobalRegistry().has(name);
};
exports.hasIcon = hasIcon;
/**
 * Returns an array of all registered icon names.
 */
const getRegisteredIconNames = () => {
    return Array.from(getGlobalRegistry().keys());
};
exports.getRegisteredIconNames = getRegisteredIconNames;
/**
 * Returns the total number of registered icons.
 */
const getRegisteredIconCount = () => {
    return getGlobalRegistry().size;
};
exports.getRegisteredIconCount = getRegisteredIconCount;
