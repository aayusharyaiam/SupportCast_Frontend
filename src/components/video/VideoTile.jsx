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
        relative video-tile rounded-xl overflow-hidden h-full w-full
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
            <User className="relative w-12 h-12 sm:w-16 sm:h-16 text-text-muted" />
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/5">
        <span className="text-[10px] sm:text-xs font-semibold text-white tracking-wide">{label}</span>
      </div>
    </div>
  );
}