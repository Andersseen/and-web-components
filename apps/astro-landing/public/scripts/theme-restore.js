/**
 * Apply saved theme preferences (mode, theme preset, color palette)
 * from localStorage BEFORE first paint to prevent FOUC.
 * Must run synchronously in <head>.
 */
(() => {
  const root = document.documentElement;
  const modeKey = 'andersseen-mode';
  const themeKey = 'andersseen-theme';
  const colorKey = 'andersseen-color';
  const getSystemMode = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  try {
    const savedMode = localStorage.getItem(modeKey);
    const savedTheme = localStorage.getItem(themeKey) || 'default';
    const savedColor = localStorage.getItem(colorKey) || 'indigo-rose';
    const mode = savedMode === 'light' || savedMode === 'dark' ? savedMode : getSystemMode();

    root.classList.toggle('dark', mode === 'dark');
    root.setAttribute('data-color', savedColor);

    if (savedTheme !== 'default') {
      root.setAttribute('data-theme', savedTheme);
    } else {
      root.removeAttribute('data-theme');
    }
  } catch {
    root.classList.toggle('dark', getSystemMode() === 'dark');
    root.setAttribute('data-color', 'indigo-rose');
    root.removeAttribute('data-theme');
  }
})();
