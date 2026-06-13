import { forwardRef } from 'react';

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-bg-elevated hover:bg-bg-surface text-text-primary border border-bg-elevated',
  danger: 'bg-status-error hover:opacity-90 text-white',
  ghost: 'bg-transparent hover:bg-bg-elevated text-text-secondary hover:text-text-primary',
  success: 'bg-status-live hover:opacity-90 text-white',
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
        font-medium rounded-lg
        transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-bg-base
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;