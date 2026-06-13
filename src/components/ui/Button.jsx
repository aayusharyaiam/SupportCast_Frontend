import { forwardRef } from 'react';

const variants = {
  primary: [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'hover:from-blue-400 hover:to-blue-500',
    'text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:shadow-xl',
    'hover:-translate-y-0.5',
  ].join(' '),
  secondary: [
    'bg-white/5',
    'hover:bg-white/10',
    'text-gray-200',
    'border border-white/8 hover:border-white/20',
    'hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/20',
  ].join(' '),
  danger: [
    'bg-red-500/10',
    'hover:bg-red-500/20',
    'text-red-400',
    'border border-red-500/20 hover:border-red-500/40',
    'hover:-translate-y-0.5 hover:shadow-md hover:shadow-red-500/10',
  ].join(' '),
  ghost: [
    'bg-white/3',
    'hover:bg-white/8',
    'text-gray-400 hover:text-gray-200',
    'border border-white/5 hover:border-white/10',
    'hover:-translate-y-0.5',
  ].join(' '),
  success: [
    'bg-emerald-500/10',
    'hover:bg-emerald-500/20',
    'text-emerald-400',
    'border border-emerald-500/20 hover:border-emerald-500/40',
    'hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/10',
  ].join(' '),
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  icon: 'p-2',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-xl
        transition-all duration-200 ease-out transform
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-[#080C14]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;