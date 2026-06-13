export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-bg-base p-6 md:p-8 animate-fade-in">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-6 w-48 rounded-md bg-white/5 shimmer-bg animate-shimmer" />
          <div className="h-4 w-32 rounded-md bg-white/5 shimmer-bg animate-shimmer mt-2" />
        </div>
        <div className="h-10 w-24 rounded-lg bg-white/5 shimmer-bg animate-shimmer" />
      </div>

      {/* Grid of Stat Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-white/5 bg-white/3">
            <div className="h-4 w-24 rounded-md bg-white/5 shimmer-bg animate-shimmer mb-4" />
            <div className="h-8 w-16 rounded-md bg-white/5 shimmer-bg animate-shimmer mb-2" />
            <div className="h-3 w-32 rounded-md bg-white/5 shimmer-bg animate-shimmer" />
          </div>
        ))}
      </div>

      {/* Content layout box skeleton */}
      <div className="p-6 rounded-xl border border-white/5 bg-white/3">
        <div className="h-5 w-36 rounded-md bg-white/5 shimmer-bg animate-shimmer mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
              <div className="h-10 w-10 rounded-full bg-white/5 shimmer-bg animate-shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/3 rounded-md bg-white/5 shimmer-bg animate-shimmer" />
                <div className="h-3 w-1/4 rounded-md bg-white/5 shimmer-bg animate-shimmer" />
              </div>
              <div className="h-8 w-20 rounded-md bg-white/5 shimmer-bg animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}