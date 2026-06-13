import { Video, Mic, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

export default function MediaPermission({ onRequest, isRequesting }) {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Video className="w-10 h-10 text-blue-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">
          Ready to Join?
        </h1>
        <p className="text-gray-400 mb-8">
          We need access to your camera and microphone for the video call.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.06] border border-white/[0.08]">
            <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Video className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-200">Camera</p>
              <p className="text-sm text-gray-500">Share your video feed</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-white/[0.06] border border-white/[0.08]">
            <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
              <Mic className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-200">Microphone</p>
              <p className="text-sm text-gray-500">Share your audio</p>
            </div>
          </div>
        </div>

        {isRequesting && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <Spinner size="sm" />
            <span className="text-gray-400">Requesting permissions...</span>
          </div>
        )}

        <div className="mt-8 space-y-3">
          <Button className="w-full" onClick={onRequest} disabled={isRequesting}>
            {isRequesting ? (
              <>
                <Spinner size="sm" />
                Connecting...
              </>
            ) : (
              'Allow & Join Call'
            )}
          </Button>

          <Button variant="ghost" className="w-full">
            Join with Audio Only
          </Button>
        </div>

        <p className="text-gray-600 text-sm mt-6">
          Your media is never recorded without your consent.
        </p>
      </div>
    </div>
  );
}