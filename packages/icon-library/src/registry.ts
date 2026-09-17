interface IconRegistryGlobal {
  __AND_ICONS_REGISTRY__?: Map<string, string>;
}

const getGlobalRegistry = (): Map<string, string> => {
  const globalObject = (typeof window !== 'undefined' ? window : globalThis) as unknown as IconRegistryGlobal;
  if (!globalObject.__AND_ICONS_REGISTRY__) {
    globalObject.__AND_ICONS_REGISTRY__ = new Map<string, string>();
  }
  return globalObject.__AND_ICONS_REGISTRY__;
};

/**
 * Registers one or more icons to the global icon registry.
 *
 * The `svg` values are inserted via `innerHTML` by `<and-icon>` (and by any
 * consumer following `getIcon()`'s documented usage) — **only register SVG
 * markup you trust.** Never pass unsanitized user- or third-party-supplied
 * content. In development, obviously unsafe markup (an element outside the
 * stroke-icon contract, an event-handler attribute, a `javascript:` URI)
 * triggers a one-time console warning per name — this is a lint-level
 * signal, not a sanitizer; it never rejects, strips, or mutates content.
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
    warnUnsafeIcon(name, content);
    registry.set(name, content);
  }
};

/** Elements the bundled icon set (and any trusted custom icon) may use. */
const ALLOWED_ELEMENTS = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'g']);

const elementsOf = (svg: string): string[] =>
  [...svg.matchAll(/<\s*([a-zA-Z][a-zA-Z0-9-]*)/g)].map(match => match[1].toLowerCase());

const looksUnsafe = (svg: string): boolean =>
  elementsOf(svg).some(element => !ALLOWED_ELEMENTS.has(element)) ||
  /\son[a-z]+\s*=/i.test(svg) ||
  /javascript:/i.test(svg);

/** Names already warned about, so a repeated registration doesn't spam the console. */
const warnedUnsafeNames = new Set<string>();

/**
 * `registerIcons()` accepts arbitrary SVG markup, and `<and-icon>` inserts it
 * via `innerHTML` — a careless registration (a stray `onerror` handler, a
 * `<script>`, an `<a>`) is a real but easy-to-miss risk. This is not a
 * sanitizer: it never blocks or alters what gets registered, it only warns
 * once per name outside production so the problem surfaces during
 * development instead of shipping silently.
 */
const warnUnsafeIcon = (name: string, svg: string): void => {
  if (warnedUnsafeNames.has(name) || !looksUnsafe(svg)) {
    return;
  }
  warnedUnsafeNames.add(name);

  if (isProductionEnv() || typeof console === 'undefined') {
    return;
  }

  console.warn(
    `[@andersseen/icon] Icon "${name}" contains markup outside the trusted-SVG contract ` +
      '(an element other than path/circle/rect/line/polyline/polygon/ellipse/g, an event-handler ' +
      'attribute, or a javascript: URI). registerIcons() inserts this content via innerHTML — only ' +
      'register SVG you trust, never unsanitized user or third-party content.',
  );
};

/**
 * Retrieves an icon SVG content from the registry by name.
 * Returns `undefined` if the icon has not been registered.
 */
export const getIcon = (name: string): string | undefined => {
  const icon = getGlobalRegistry().get(name);
  if (icon === undefined) {
    warnMissingIcon(name);
  }
  return icon;
};

/** Names already warned about, so a repeated render doesn't spam the console. */
const warnedNames = new Set<string>();

/**
 * An unregistered or misspelled name used to render as an empty box with no
 * diagnostic at all, which is a slow thing to debug. Warn once per name, and
 * only outside production builds.
 */
const warnMissingIcon = (name: string): void => {
  if (warnedNames.has(name)) {
    return;
  }
  warnedNames.add(name);

  if (isProductionEnv() || typeof console === 'undefined') {
    return;
  }

  console.warn(
    `[@andersseen/icon] Icon "${name}" is not registered, so nothing will render. ` +
      `Register it first: import { registerIcons, ${toConstName(name)} } from '@andersseen/icon'; ` +
      `registerIcons({ '${name}': ${toConstName(name)} }); ` +
      `— or call registerAllIcons() in a demo app (defeats tree-shaking).`,
  );
};

const toConstName = (name: string): string => name.replace(/-/g, '_').toUpperCase();

const isProductionEnv = (): boolean =>
  typeof process !== 'undefined' && (process as { env?: Record<string, string> }).env?.NODE_ENV === 'production';

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
