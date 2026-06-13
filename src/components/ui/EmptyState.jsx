export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-6 text-center animate-slide-up ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-center mb-6 shadow-inner animate-float-slow">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-200 mb-2">{title}</h3>
      {description && <p className="text-gray-400/80 max-w-sm mb-6 text-sm">{description}</p>}
      {action && <div className="animate-scale-in animation-delay-100">{action}</div>}
    </div>
  );
}