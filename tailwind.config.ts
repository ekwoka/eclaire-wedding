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
        script: ['Eames', ...theme.fontFamily.serif],
      },
      colors: {
        tuscany: {
          '50': 'hsl(30, 50%, 96%)',
          '100': 'hsl(31, 51%, 89%)',
          '200': 'hsl(31, 53%, 77%)',
          '300': 'hsl(30, 52%, 65%)',
          '400': 'hsl(27, 52%, 56%)',
          '500': 'hsl(22, 50%, 48%)',
          '600': 'hsl(17, 52%, 44%)',
          '700': 'hsl(10, 49%, 37%)',
          '800': 'hsl(7, 45%, 31%)',
          '900': 'hsl(6, 42%, 26%)',
          '950': 'hsl(7, 50%, 14%)',
        },
      },
    },
  },
  plugins: [forms, heropatterns, scrollbarHide, typography],
} satisfies Config;
