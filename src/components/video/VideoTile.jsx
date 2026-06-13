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
    <div className="relative bg-bg-surface rounded-xl overflow-hidden aspect-video">
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
        <div className="w-full h-full flex items-center justify-center bg-bg-elevated">
          <User className="w-16 h-16 text-text-muted" />
        </div>
      )}

      <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm">
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
    </div>
  );
}