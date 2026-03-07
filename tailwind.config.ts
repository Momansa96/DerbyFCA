import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#15803D',
        'primary-light': '#BBF7D0',
        'primary-dark': '#166534',
        secondary: '#0F172A',
        accent: '#FBBF24',
        'accent-dark': '#D97706',
        surface: '#FAFAF9',
        'surface-alt': '#F5F5F4',
      },
      fontFamily: {
        heading: ['var(--font-barlow-condensed)', 'sans-serif'],
        body: ['var(--font-barlow)', 'sans-serif'],
      },
      keyframes: {
        'marquee-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-right': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'marquee-left': 'marquee-left 45s linear infinite',
        'marquee-right': 'marquee-right 40s linear infinite',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ['light'],
  },
};
export default config;
