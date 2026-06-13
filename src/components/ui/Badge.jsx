const variants = {
  default: 'bg-bg-elevated text-text-secondary',
  live: 'bg-status-live/20 text-status-live',
  warning: 'bg-status-warning/20 text-status-warning',
  error: 'bg-status-error/20 text-status-error',
  idle: 'bg-status-idle/20 text-status-idle',
  primary: 'bg-primary-500/20 text-primary-500',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  pulse = false,
}) {
  return (
    <span
      className={`
        inline-flex items-center gap-1
        font-medium rounded-full
        ${variants[variant]}
        ${sizes[size]}
        ${pulse ? 'animate-pulse-recording' : ''}
        ${className}
      `}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-status-live" />
      )}
      {children}
    </span>
  );
}