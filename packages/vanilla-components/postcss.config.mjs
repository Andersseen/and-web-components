import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    // Tailwind CSS v4 with PostCSS
    tailwindcss,
    // Autoprefixer for vendor prefixes
    autoprefixer,
  ],
};
