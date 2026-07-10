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
  const getSystemMode = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  try {
    const savedMode = localStorage.getItem(modeKey);
    const savedTheme = localStorage.getItem(themeKey) || 'default';
    const savedColor = localStorage.getItem(colorKey) || 'warm-gold';
    const mode = savedMode === 'light' || savedMode === 'dark' ? savedMode : getSystemMode();

    root.classList.toggle('dark', mode === 'dark');
    root.setAttribute('and-color', savedColor);

    if (savedTheme !== 'default') {
      root.setAttribute('and-theme', savedTheme);
    } else {
      root.removeAttribute('and-theme');
    }
  } catch {
    root.classList.toggle('dark', getSystemMode() === 'dark');
    root.setAttribute('and-color', 'warm-gold');
    root.removeAttribute('and-theme');
  }
})();
