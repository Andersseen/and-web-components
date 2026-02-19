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
 */
export const registerIcons = (icons: Record<string, string>): void => {
  const registry = getGlobalRegistry();
  Object.entries(icons).forEach(([name, content]) => {
    registry.set(name, content);
  });
  console.log(
    `[IconLibrary] Registered ${Object.keys(icons).length} icons. Total: ${registry.size}`,
  );
};

/**
 * Retrieves an icon from the registry by its name.
 */
export const getIcon = (name: string): string | undefined => {
  const icon = getGlobalRegistry().get(name);
  if (!icon) {
    console.warn(
      `[IconLibrary] Icon "${name}" requested but not found in registry.`,
    );
  }
  return icon;
};
