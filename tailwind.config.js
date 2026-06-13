/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Color tokens from Design.md §2 — referenced via CSS variables in index.css
      // so that `<div className="bg-primary-500">` resolves to var(--primary-500).
      colors: {
        primary: {
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          900: 'var(--primary-900)',
        },
        bg: {
          base: 'var(--bg-base)',
          surface: 'var(--bg-surface)',
          elevated: 'var(--bg-elevated)',
        },
        status: {
          live: 'var(--status-live)',
          warning: 'var(--status-warning)',
          error: 'var(--status-error)',
          idle: 'var(--status-idle)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
      animation: {
        'pulse-recording': 'pulse-recording 2s ease-in-out infinite',
        'fade-in': 'fade-in 200ms ease-out',
      },
      keyframes: {
        'pulse-recording': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
