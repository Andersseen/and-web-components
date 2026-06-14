/**
 * Utility for generating unique IDs for accessibility attributes.
 *
 * IDs are stable for a given prefix/suffix within a generator instance,
 * so `aria-controls`/`aria-labelledby` pairs remain in sync across renders.
 */

let globalCounter = 0;

/**
 * Generate a stable unique ID with an optional prefix.
 * Each call returns a new deterministic ID, so use this only for one-off IDs.
 * For IDs that must stay in sync across multiple calls, use `createIdGenerator`.
 */
export function generateId(prefix = 'headless'): string {
  globalCounter += 1;
  return `${prefix}-${globalCounter}`;
}

/**
 * Create an ID generator for a specific component instance.
 * Suffixes are memoized so repeated calls return the same ID.
 */
export function createIdGenerator(componentPrefix: string) {
  const cache = new Map<string, string>();
  return (suffix?: string): string => {
    const key = suffix ?? '';
    if (!cache.has(key)) {
      globalCounter += 1;
      const id = suffix ? `${componentPrefix}-${globalCounter}-${suffix}` : `${componentPrefix}-${globalCounter}`;
      cache.set(key, id);
    }
    return cache.get(key)!;
  };
}
