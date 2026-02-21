import { registerAllIcons } from '@andersseen/icon';

/**
 * Registers all icons for the demo application.
 *
 * In a production app, you would import only the icons you need:
 *
 * ```ts
 * import { registerIcons, COMPONENT_ICONS, CLOSE, HOME } from '@andersseen/icon';
 *
 * // Register icons required by stencil components
 * registerIcons(COMPONENT_ICONS);
 *
 * // Register additional icons your app uses
 * registerIcons({ home: HOME, close: CLOSE });
 * ```
 */
export const initializeIcons = () => {
  registerAllIcons();
};
