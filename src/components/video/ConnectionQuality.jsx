const qualityConfig = {
  excellent: { bars: 4, color: 'bg-status-live' },
  good: { bars: 3, color: 'bg-status-live' },
  fair: { bars: 2, color: 'bg-status-warning' },
  poor: { bars: 1, color: 'bg-status-error' },
};

export default function ConnectionQuality({ quality = 'excellent' }) {
  const config = qualityConfig[quality] || qualityConfig.excellent;
  const bars = [1, 2, 3, 4];

  return (
    <div className="flex items-center gap-1" aria-label={`Connection quality: ${quality}`}>
      {bars.map((bar) => (
        <div
          key={bar}
          className={`w-1 rounded-full transition-colors ${config.color} ${
            bar <= config.bars ? 'opacity-100' : 'opacity-30'
          }`}
          style={{ height: `${bar * 4 + 4}px` }}
        />
      ))}
    </div>
  );
}