import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        mono: ['var(--font-jetbrains)', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: '#4f46e5',
              textDecoration: 'underline',
              '&:hover': { color: '#4338ca' },
            },
            'h1, h2, h3, h4': {
              fontFamily: 'var(--font-lora), Georgia, serif',
              fontWeight: '700',
              color: 'inherit',
            },
            code: {
              color: '#4f46e5',
              backgroundColor: '#eef2ff',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '500',
            },
            'code::before': { content: '""' },
            'code::after': { content: '""' },
            pre: {
              backgroundColor: '#0f172a',
              color: '#e2e8f0',
            },
          },
        },
        invert: {
          css: {
            code: {
              color: '#a5b4fc',
              backgroundColor: '#1e1b4b',
            },
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
