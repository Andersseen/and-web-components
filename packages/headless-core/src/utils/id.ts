/**
 * Utility for generating unique IDs for accessibility attributes
 */

let idCounter = 0;

/**
 * Generate a unique ID with an optional prefix
 */
export function generateId(prefix = "headless"): string {
  idCounter += 1;
  return `${prefix}-${idCounter}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Create an ID generator for a specific component
 */
export function createIdGenerator(componentPrefix: string) {
  return (suffix?: string): string => {
    const id = generateId(componentPrefix);
    return suffix ? `${id}-${suffix}` : id;
  };
}
