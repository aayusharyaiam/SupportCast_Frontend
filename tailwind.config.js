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
        'fade-in': 'fade-in 200ms ease-out forwards',
        'slide-up': 'slide-up 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slide-down 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slide-in-right 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slide-in-left 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scale-in 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'scale-bounce': 'scale-bounce 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-slow-reverse': 'float-slow-reverse 10s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite linear',
        'glow-pulse': 'glow-pulse 2s infinite ease-in-out',
        'wiggle': 'wiggle 400ms ease-in-out',
        'spin-slow': 'spin 8s linear infinite',
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
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'scale-bounce': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(0.96)' },
          '80%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.05)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.95)' },
        },
        'float-slow-reverse': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-30px, 40px) scale(0.95)' },
          '66%': { transform: 'translate(20px, -20px) scale(1.05)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2), 0 0 10px rgba(59, 130, 246, 0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(59, 130, 246, 0.5), 0 0 25px rgba(59, 130, 246, 0.2)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};