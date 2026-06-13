const variants = {
  default: 'bg-white/5 text-gray-400 border border-white/8',
  live: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm shadow-emerald-500/5',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-sm shadow-amber-500/5',
  error: 'bg-red-500/10 text-red-400 border border-red-500/25 shadow-sm shadow-red-500/5',
  idle: 'bg-gray-500/10 text-gray-400 border border-gray-500/15',
  primary: 'bg-blue-500/10 text-blue-400 border border-blue-500/25 shadow-sm shadow-blue-500/5',
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
        inline-flex items-center gap-1.5
        font-medium rounded-full
        transition-all duration-300 hover:scale-105 cursor-default
        ${variants[variant]}
        ${sizes[size]}
        ${pulse ? 'animate-pulse-recording' : ''}
        ${className}
      `}
    >
      {variant === 'live' && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-ripple inline-block" />
      )}
      {children}
    </span>
  );
}