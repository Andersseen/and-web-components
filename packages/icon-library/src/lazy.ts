/**
 * Opt-in runtime lazy loading of per-icon CSS (`icons/<name>.css`) for the
 * `and-icon="<name>"` attribute — the fourth loading strategy. Importing
 * this module does nothing by itself; nothing runs until `initLazyIcons()`
 * is called. Deliberately does not import `ALL_ICONS`/any SVG data — icon
 * CSS is always fetched over the network as a real stylesheet, never
 * generated in this bundle (that would defeat the point of lazy loading).
 */
import { BASE_RULE } from './css-constants';
import { isValidIconName } from './icon-name';

export interface LazyIconsOptions {
  /** Root to scan/observe for `[and-icon]` elements. Defaults to `document`. */
  root?: Document | Element;
  /**
   * Base URL `icons/<name>.css` is resolved against, e.g. `'/assets/and-icons/'`
   * for a bundled app that copies this package's `dist/icons/` output there.
   * Ignored when `resolveIconUrl` is given. If neither is given, URLs resolve
   * relative to this module's own `import.meta.url` — correct for direct
   * `<script type="module" src=".../dist/lazy.js">` (CDN) usage, but **not**
   * guaranteed after bundling (see the package README) — prefer the
   * build-time scanner for bundled apps.
   */
  baseUrl?: string;
  /** Full control over per-icon CSS URL resolution. Wins over `baseUrl`. */
  resolveIconUrl?: (name: string) => string;
  /** Called when an icon's stylesheet fails to load. Default: a one-time `console.warn` per name. */
  onError?: (name: string, error: unknown) => void;
}

const BASE_STYLE_MARKER = 'data-and-icons-base';
const ICON_LINK_MARKER = 'data-and-icon';

const ensureBaseStyle = (doc: Document): void => {
  if (doc.head.querySelector(`style[${BASE_STYLE_MARKER}]`)) {
    return;
  }
  const style = doc.createElement('style');
  style.setAttribute(BASE_STYLE_MARKER, '');
  style.textContent = BASE_RULE;
  doc.head.appendChild(style);
};

export // Module URL captured in a variable, not written inline as `new URL(x, import.meta.url)` —
// that exact syntactic shape is special-cased by bundlers (Vite/Rollup) as a static-asset
// reference and can mis-resolve a dynamic (per-icon) path. A plain variable is ordinary
// runtime URL resolution, unaffected by that bundler-specific analysis.
const moduleUrl = import.meta.url;

const resolveIconUrl = (name: string, options: LazyIconsOptions): string => {
  if (options.resolveIconUrl) {
    return options.resolveIconUrl(name);
  }
  if (options.baseUrl) {
    const base = new URL(options.baseUrl.endsWith('/') ? options.baseUrl : `${options.baseUrl}/`, document.baseURI);
    return new URL(`icons/${name}.css`, base).toString();
  }
  return new URL(`./icons/${name}.css`, moduleUrl).toString();
};

const warnedFailures = new Set<string>();
const defaultOnError = (name: string): void => {
  if (warnedFailures.has(name) || typeof console === 'undefined') {
    return;
  }
  warnedFailures.add(name);
  console.warn(`[@andersseen/icon] Failed to load icons/${name}.css for and-icon="${name}".`);
};

/**
 * Scans `root`'s existing `[and-icon]` elements, then observes it for new
 * matching nodes and `and-icon` attribute changes, loading each icon's CSS
 * exactly once (deduplicated, no re-fetch for an icon already loaded/loading
 * — including by a previous `initLazyIcons()` call that wasn't cleaned up).
 * Returns a `cleanup()` function that disconnects the observer.
 */
export const initLazyIcons = (options: LazyIconsOptions = {}): (() => void) => {
  const root = options.root ?? document;
  const doc = root instanceof Document ? root : root.ownerDocument;
  if (!doc) {
    return () => {};
  }

  const loaded = new Set<string>();
  const onError = options.onError ?? defaultOnError;

  ensureBaseStyle(doc);

  const loadIcon = (name: string): void => {
    if (!isValidIconName(name) || loaded.has(name)) {
      return;
    }
    loaded.add(name);

    if (doc.head.querySelector(`link[${ICON_LINK_MARKER}="${name}"]`)) {
      return;
    }

    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.setAttribute(ICON_LINK_MARKER, name);
    link.href = resolveIconUrl(name, options);
    link.addEventListener('error', event => onError(name, event));
    doc.head.appendChild(link);
  };

  const scan = (node: Document | Element): void => {
    if (node instanceof Element) {
      const name = node.getAttribute('and-icon');
      if (name !== null) {
        loadIcon(name);
      }
    }
    for (const el of node.querySelectorAll('[and-icon]')) {
      loadIcon(el.getAttribute('and-icon') ?? '');
    }
  };

  scan(root);

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.target instanceof Element) {
        const name = mutation.target.getAttribute('and-icon');
        if (name !== null) {
          loadIcon(name);
        }
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) {
          scan(node);
        }
      }
    }
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['and-icon'],
  });

  return () => observer.disconnect();
};
