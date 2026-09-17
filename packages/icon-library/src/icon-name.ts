/**
 * Every `ALL_ICONS` key (and every valid custom-registered name) is
 * lowercase kebab-case. Shared by the scanner (validating static usages
 * against the catalog) and the lazy runtime (rejecting an `and-icon` value
 * before it's ever used to build a URL — kebab-case has no `/`, `.` or `..`,
 * so a name that passes this can't be a path-traversal payload).
 */
export const ICON_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isValidIconName = (name: string): boolean => ICON_NAME_PATTERN.test(name);
