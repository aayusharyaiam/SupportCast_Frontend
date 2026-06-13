export default function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={`relative inline-block ${sizes[size]} ${className}`}>
      <span className="absolute inset-0 rounded-full bg-blue-500/20 blur-md animate-pulse" />
      <svg
        className="animate-spin w-full h-full relative z-10"
        viewBox="0 0 24 24"
        fill="none"
      >
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="60%" stopColor="#60A5FA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          className="opacity-10"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3.5"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#spinner-gradient)"
          strokeWidth="3.5"
          strokeDasharray="36 24"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}