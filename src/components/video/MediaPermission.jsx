import { Video, Mic, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function MediaPermission({ onRequest, onRequestAudioOnly, isRequesting, participantStatus }) {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-dotgrid pointer-events-none" />
      <div className="absolute inset-0 bg-orb pointer-events-none" />

      <div className="max-w-md w-full perspective-1000 animate-slide-up">
        <div className="glass-card-premium p-8 text-center card-3d">
          <div className="w-18 h-18 mx-auto mb-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-inner animate-float-slow">
            <Video className="w-9 h-9 text-blue-400" />
          </div>

          <div className="animate-fade-in animation-delay-75">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Ready to Join?
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              We need access to your camera and microphone for the video call.
            </p>
          </div>

          {participantStatus && (
            <div className="mb-6 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs text-emerald-300 animate-scale-bounce">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-2 status-ripple" />
              {participantStatus}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-slide-up animation-delay-100">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                <Video className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-200 text-sm">Camera</p>
                <p className="text-xs text-gray-500">Share your video feed</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-slide-up animation-delay-150">
              <div className="w-10 h-10 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5 text-gray-300" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-200 text-sm">Microphone</p>
                <p className="text-xs text-gray-500">Share your audio</p>
              </div>
            </div>
          </div>

          {isRequesting && (
            <div className="flex items-center justify-center gap-2 mt-6 animate-fade-in">
              <Spinner size="sm" />
              <span className="text-xs text-gray-400">Requesting permissions...</span>
            </div>
          )}

          <div className="mt-8 space-y-3 animate-fade-in animation-delay-200">
            <Button className="w-full shadow-lg shadow-blue-500/20" onClick={onRequest} disabled={isRequesting}>
              {isRequesting ? (
                <>
                  <Spinner size="sm" />
                  Connecting...
                </>
              ) : (
                'Allow & Join Call'
              )}
            </Button>

            <Button variant="ghost" className="w-full" onClick={onRequestAudioOnly}>
              Join with Audio Only
            </Button>
          </div>

          <p className="text-gray-500 text-xs mt-6 animate-fade-in animation-delay-300">
            Your media is never recorded without your consent.
          </p>
        </div>
      </div>
    </div>
  );
}
