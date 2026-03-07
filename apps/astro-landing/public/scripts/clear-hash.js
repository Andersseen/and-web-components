/**
 * Clear stale URL hash on fresh page load so the page
 * always starts at the top (Home section).
 */
if (window.location.hash) {
  history.replaceState(null, '', window.location.pathname);
  window.scrollTo(0, 0);
}
