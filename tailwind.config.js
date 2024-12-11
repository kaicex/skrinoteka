const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    'pages/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: 'true',
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans]
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(calc(-100% - var(--gap)))' }
        },
        'marquee-vertical': {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(calc(-100% - var(--gap)))' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
      },
      colors: {
        background: '#ffffff',
        foreground: '#000000',
        border: '#e5e7eb',
        ring: '#d1d5db',
        muted: {
          DEFAULT: '#f3f4f6',
          foreground: '#6b7280'
        },
        accent: {
          DEFAULT: '#f9fafb',
          foreground: '#111827'
        },
        sidebar: {
          DEFAULT: '#f9fafb',
          foreground: '#111827',
          primary: '#e5e7eb',
          'primary-foreground': '#111827',
          accent: '#f3f4f6',
          'accent-foreground': '#111827',
          border: '#e5e7eb',
          ring: '#d1d5db'
        }
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
};
