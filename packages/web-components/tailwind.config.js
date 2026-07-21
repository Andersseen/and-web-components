/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,html}'],
  safelist: ['dark'],
  // Token → utility mapping (colors, borderRadius, borderWidth, t-gap
  // spacing) lives in tailwind-preset.js, published as
  // `@andersseen/web-components/tailwind-preset` so consumer apps can share
  // the exact same mapping. Import it here too so there is a single source
  // of truth and the two can never drift.
  presets: [require('./tailwind-preset.js')],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [],
};
