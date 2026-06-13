import Spinner from '../ui/Spinner';

export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" className="text-primary-500" />
        <p className="text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}