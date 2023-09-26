import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import scrollbarHide from 'tailwind-scrollbar-hide';
import type { Config } from 'tailwindcss';
import heropatterns from 'tailwindcss-hero-patterns';
import theme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    screens: {
      '2xs': '380px', // '20rem'
      xs: '480px',
      ...theme.screens,
    },
    extend: {
      fontFamily: {
        script: ['Charmonman', ...theme.fontFamily.serif],
        poppins: ['Poppins', ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [forms, heropatterns, scrollbarHide, typography],
} satisfies Config;
