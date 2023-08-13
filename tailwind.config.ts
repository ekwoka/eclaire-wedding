import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';
import heropatterns from 'tailwindcss-hero-patterns';
import theme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        script: ['Calligraphy', ...theme.fontFamily.serif],
        poppins: ['Poppins', ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [forms, heropatterns, typography],
} satisfies Config;
