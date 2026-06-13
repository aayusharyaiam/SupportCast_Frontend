import { useRef, useEffect } from 'react';
import { User } from 'lucide-react';

export default function VideoTile({ stream, label, isLocal = false }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`
        relative video-tile rounded-xl overflow-hidden aspect-video animate-scale-in
        ${stream ? 'video-tile-active border-blue-500/35' : 'bg-bg-elevated border-white/5'}
      `}
    >
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal}
          className="w-full h-full object-cover"
          style={{ transform: isLocal ? 'scaleX(-1)' : 'none' }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-bg-elevated/40">
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-white/5 blur-sm opacity-50 animate-pulse" />
            <User className="relative w-16 h-16 text-text-muted" />
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/5 animate-slide-up animation-delay-100">
        <span className="text-xs font-semibold text-white tracking-wide">{label}</span>
      </div>
    </div>
  );
}