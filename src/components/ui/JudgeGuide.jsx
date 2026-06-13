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
    <div className="mx-auto mb-6 rounded-xl border border-amber-500 bg-amber-950/30 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <Trophy className="w-6 h-6 text-amber-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="font-bold text-amber-400 text-base sm:text-lg leading-tight">
              Hackathon Judge Guide — SupportCast
            </h2>
            <button
              onClick={() => setVisible(false)}
              className="p-1 rounded text-amber-500 hover:text-amber-300 hover:bg-amber-900/30 transition-colors shrink-0"
              aria-label="Dismiss judge guide"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>
              <p className="text-amber-200 font-medium mb-1">Quick Start:</p>
              <ol className="text-amber-100/80 space-y-0.5 list-decimal list-inside">
                <li>You are logged in as Agent or Admin</li>
                <li>Click &ldquo;New Session&rdquo; to create a support session</li>
                <li>Copy the invite link → open in Incognito as Customer</li>
                <li>Both participants join the video call automatically</li>
                <li>Try: Chat · Mute · Camera toggle · File sharing · Recording</li>
              </ol>
            </div>

            <div className="text-sm">
              <p className="text-amber-200 font-medium mb-1">Demo Credentials:</p>
              <table className="w-full text-amber-100/80">
                <tbody>
                  <tr>
                    <td className="py-0.5 pr-3 font-medium whitespace-nowrap">Admin:</td>
                    <td className="py-0.5 font-mono">admin@supportcast.com / Admin@1234</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 pr-3 font-medium whitespace-nowrap">Agent:</td>
                    <td className="py-0.5 font-mono">agent@supportcast.com / Demo@1234</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 pr-3 font-medium whitespace-nowrap">Judge:</td>
                    <td className="py-0.5 font-mono">judge@supportcast.com / Judge@1234</td>
                  </tr>
                  <tr>
                    <td className="py-0.5 pr-3 font-medium whitespace-nowrap">Customer:</td>
                    <td className="py-0.5">Use any invite link (no account needed)</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-amber-200 font-medium mt-3 mb-1">Live URLs:</p>
              <table className="w-full text-amber-100/80">
                <tbody>
                  <tr><td className="py-0.5 pr-3 font-medium">Frontend:</td><td className="py-0.5 font-mono text-xs break-all">{DEMO_URLS.frontend}</td></tr>
                  <tr><td className="py-0.5 pr-3 font-medium">Backend:</td><td className="py-0.5 font-mono text-xs break-all">{DEMO_URLS.backend}</td></tr>
                  <tr><td className="py-0.5 pr-3 font-medium">Health:</td><td className="py-0.5 font-mono text-xs break-all">{DEMO_URLS.health}</td></tr>
                  <tr><td className="py-0.5 pr-3 font-medium">Metrics:</td><td className="py-0.5 font-mono text-xs break-all">{DEMO_URLS.metrics}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}