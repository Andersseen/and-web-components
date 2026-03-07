import { create } from 'storybook/theming/create';

export default create({
  base: 'light',

  // Typography
  fontBase: '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontCode: 'monospace',

  // Brand
  brandTitle: 'Andersseen Web Components',
  brandUrl: 'https://github.com/Andersseen/and-web-components',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#3b82f6',
  colorSecondary: '#1d4ed8',

  // UI
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,

  // Text
  textColor: '#0f172a',
  textInverseColor: '#ffffff',

  // Toolbar default and active colors
  barTextColor: '#64748b',
  barSelectedColor: '#1d4ed8',
  barHoverColor: '#3b82f6',
  barBg: '#ffffff',

  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#cbd5e1',
  inputTextColor: '#0f172a',
  inputBorderRadius: 6,
});
