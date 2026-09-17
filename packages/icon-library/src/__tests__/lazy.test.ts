// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { initLazyIcons } from '../lazy';

let cleanups: (() => void)[] = [];

afterEach(() => {
  for (const cleanup of cleanups) {
    cleanup();
  }
  cleanups = [];
  document.head.innerHTML = '';
  document.body.innerHTML = '';
});

const iconLinks = (name?: string): HTMLLinkElement[] =>
  [...document.head.querySelectorAll<HTMLLinkElement>('link[data-and-icon]')].filter(
    link => name === undefined || link.getAttribute('data-and-icon') === name,
  );

describe('initLazyIcons — existing DOM', () => {
  it('loads CSS for every [and-icon] element already in the document', () => {
    document.body.innerHTML = '<span and-icon="home"></span><span and-icon="search"></span>';
    cleanups.push(initLazyIcons());

    expect(iconLinks('home')).toHaveLength(1);
    expect(iconLinks('search')).toHaveLength(1);
  });

  it('injects the shared base rule exactly once', () => {
    document.body.innerHTML = '<span and-icon="home"></span>';
    cleanups.push(initLazyIcons());

    const baseStyles = document.head.querySelectorAll('style[data-and-icons-base]');
    expect(baseStyles).toHaveLength(1);
    expect(baseStyles[0].textContent).toContain('[and-icon] {');
  });
});

describe('initLazyIcons — mutations', () => {
  it('loads CSS for a node inserted after init', async () => {
    cleanups.push(initLazyIcons());
    expect(iconLinks('home')).toHaveLength(0);

    const span = document.createElement('span');
    span.setAttribute('and-icon', 'home');
    document.body.appendChild(span);

    await vi.waitFor(() => expect(iconLinks('home')).toHaveLength(1));
  });

  it('loads CSS when an existing element’s and-icon attribute changes', async () => {
    const span = document.createElement('span');
    document.body.appendChild(span);
    cleanups.push(initLazyIcons());

    span.setAttribute('and-icon', 'search');

    await vi.waitFor(() => expect(iconLinks('search')).toHaveLength(1));
  });

  it('loads CSS for a matching descendant of an inserted subtree, not just the inserted node itself', async () => {
    cleanups.push(initLazyIcons());

    const wrapper = document.createElement('div');
    wrapper.innerHTML = '<span and-icon="star"></span>';
    document.body.appendChild(wrapper);

    await vi.waitFor(() => expect(iconLinks('star')).toHaveLength(1));
  });
});

describe('initLazyIcons — dedupe', () => {
  it('creates exactly one <link> per unique icon, even with many usages', () => {
    document.body.innerHTML = Array.from({ length: 5 }, () => '<span and-icon="home"></span>').join('');
    cleanups.push(initLazyIcons());

    expect(iconLinks('home')).toHaveLength(1);
  });

  it('does not recreate a <link> for an icon a previous initLazyIcons() call already loaded', () => {
    document.body.innerHTML = '<span and-icon="home"></span>';
    const firstCleanup = initLazyIcons();
    firstCleanup();

    initLazyIcons(); // second init, same DOM, base <link> already present
    expect(iconLinks('home')).toHaveLength(1);
  });
});

describe('initLazyIcons — cleanup', () => {
  it('stops reacting to new nodes after cleanup() is called', async () => {
    const cleanup = initLazyIcons();
    cleanup();

    const span = document.createElement('span');
    span.setAttribute('and-icon', 'home');
    document.body.appendChild(span);

    await new Promise(resolve => setTimeout(resolve, 20));
    expect(iconLinks('home')).toHaveLength(0);
  });
});

describe('initLazyIcons — name validation', () => {
  it('rejects a path-traversal-shaped and-icon value instead of building a URL from it', () => {
    document.body.innerHTML = '<span and-icon="../../etc/passwd"></span>';
    cleanups.push(initLazyIcons());

    expect(iconLinks()).toHaveLength(0);
  });

  it('rejects an empty and-icon value', () => {
    document.body.innerHTML = '<span and-icon=""></span>';
    cleanups.push(initLazyIcons());

    expect(iconLinks()).toHaveLength(0);
  });
});

describe('initLazyIcons — URL resolution', () => {
  it('uses resolveIconUrl when provided, in preference to baseUrl', () => {
    document.body.innerHTML = '<span and-icon="home"></span>';
    cleanups.push(
      initLazyIcons({
        baseUrl: '/should-be-ignored/',
        resolveIconUrl: name => `/custom/${name}.css`,
      }),
    );

    expect(iconLinks('home')[0].getAttribute('href')).toBe('/custom/home.css');
  });

  it('resolves icons/<name>.css against baseUrl when no resolver is given', () => {
    document.body.innerHTML = '<span and-icon="home"></span>';
    cleanups.push(initLazyIcons({ baseUrl: '/assets/and-icons/' }));

    expect(iconLinks('home')[0].getAttribute('href')).toContain('/assets/and-icons/icons/home.css');
  });

  it('falls back to resolving relative to this module’s own URL (CDN default) when neither option is given', () => {
    document.body.innerHTML = '<span and-icon="home"></span>';
    cleanups.push(initLazyIcons());

    expect(iconLinks('home')[0].getAttribute('href')).toMatch(/\/icons\/home\.css$/);
  });
});

describe('initLazyIcons — failed load', () => {
  it('calls onError once and does not retry when a stylesheet fails to load', () => {
    document.body.innerHTML = '<span and-icon="home"></span>';
    const onError = vi.fn();
    cleanups.push(initLazyIcons({ onError }));

    const link = iconLinks('home')[0];
    link.dispatchEvent(new Event('error'));

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('home', expect.anything());
    expect(iconLinks('home')).toHaveLength(1); // no second <link> created
  });
});
