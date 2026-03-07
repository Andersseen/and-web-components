/**
 * Enable component animations BEFORE web-component registration.
 * Must run synchronously in <head> so every component's
 * `componentWillLoad` sees the flag during initial upgrade.
 */
window.__AND_ANIMATED__ = true;
