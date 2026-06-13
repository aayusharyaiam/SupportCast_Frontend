import { useState } from 'react';
import { Trophy, X } from 'lucide-react';

const DEMO_URLS = {
  frontend: 'https://support-cast-frontend.vercel.app',
  backend: 'https://supportcast-backend.onrender.com',
  health: 'https://supportcast-backend.onrender.com/health',
  metrics: 'https://supportcast-backend.onrender.com/metrics',
};

export default function JudgeGuide() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="mx-auto mb-7 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Trophy className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="font-bold text-amber-400 text-sm sm:text-base leading-tight">
              Hackathon Judge Guide — SupportCast
            </h2>
            <button
              onClick={() => setVisible(false)}
              className="p-1 rounded-lg text-amber-500/60 hover:text-amber-400 hover:bg-amber-500/10 transition-all shrink-0"
              aria-label="Dismiss judge guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            <div>
              <p className="text-amber-400 font-medium mb-2 text-xs uppercase tracking-wider">Quick Start</p>
              <ol className="space-y-1 list-decimal list-inside text-gray-300 text-sm">
                <li>Logged in as Agent or Admin</li>
                <li>Click &ldquo;New Session&rdquo; to create a support session</li>
                <li>Copy invite link → open in Incognito as Customer</li>
                <li>Both participants join the video call automatically</li>
                <li>Try: Chat, Mute, Camera, File sharing, Recording</li>
              </ol>
            </div>

            <div>
              <p className="text-amber-400 font-medium mb-2 text-xs uppercase tracking-wider">Demo Credentials</p>
              <div className="space-y-1 text-gray-400 font-mono text-xs">
                <p><span className="text-gray-500">Admin:</span> admin@supportcast.com / Admin@1234</p>
                <p><span className="text-gray-500">Agent:</span> agent@supportcast.com / Demo@1234</p>
                <p><span className="text-gray-500">Judge:</span> judge@supportcast.com / Judge@1234</p>
                <p><span className="text-gray-500">Customer:</span> use invite link (no account)</p>
              </div>
              <p className="text-amber-400 font-medium mb-2 text-xs uppercase tracking-wider mt-4">Live URLs</p>
              <div className="space-y-0.5 text-gray-500 font-mono text-xs">
                <p><span className="text-gray-600">Frontend:</span> <span className="text-gray-400 break-all">{DEMO_URLS.frontend}</span></p>
                <p><span className="text-gray-600">Backend:</span> <span className="text-gray-400 break-all">{DEMO_URLS.backend}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}