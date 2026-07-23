/**
 * Server-safe environment helpers.
 *
 * `class X extends HTMLElement` is evaluated at module load, so on a server
 * (Astro/Next SSR, a Node script, a test in a non-DOM environment) merely
 * importing this package used to throw `HTMLElement is not defined` before
 * any consumer code ran. Extending this base instead keeps the import inert
 * on the server; registration is skipped there anyway.
 */

export const isBrowser: boolean = typeof window !== 'undefined' && typeof HTMLElement !== 'undefined';

/**
 * `HTMLElement` in the browser, an empty stand-in class on the server.
 * The stand-in is never instantiated — custom elements are only defined
 * when `isBrowser` is true.
 */
export const HTMLElementBase: typeof HTMLElement = isBrowser
  ? HTMLElement
  : (class {} as unknown as typeof HTMLElement);
