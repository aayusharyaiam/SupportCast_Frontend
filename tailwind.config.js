/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          900: '#1E3A5F',
        },
        bg: {
          base: '#080C14',
          surface: 'rgba(255,255,255,0.04)',
          elevated: 'rgba(255,255,255,0.08)',
        },
        status: {
          live: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          idle: '#6B7280',
        },
        text: {
          primary: '#F9FAFB',
          secondary: '#9CA3AF',
          muted: '#4B5563',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.04)',
          card: 'rgba(255,255,255,0.06)',
          border: 'rgba(255,255,255,0.08)',
          elevated: 'rgba(255,255,255,0.10)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-recording': 'pulse-recording 2s ease-in-out infinite',
        'fade-in': 'fade-in 200ms ease-out',
      },
      keyframes: {
        'pulse-recording': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};