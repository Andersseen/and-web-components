export * from "./icons";
export * from "./registry";

import { registerIcons } from "./registry";
import { ALL_ICONS } from "./icons";

/**
 * Convenience function to register ALL icons at once.
 * Only use in demo/dev apps — this defeats tree-shaking.
 */
export const registerAllIcons = (): void => {
  registerIcons(ALL_ICONS);
};
