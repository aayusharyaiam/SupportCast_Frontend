# SupportCast Frontend

React frontend for SupportCast, the AtomQuest Hackathon real-time video support platform.

The frontend powers the agent dashboard, customer invite join flow, live call room, chat and file sharing UI, recording controls, post-call history, and admin dashboard.

## Live App

Production frontend: https://support-cast-frontend.vercel.app

## Tech Stack

| Area | Technology |
|---|---|
| UI | React 18 |
| Build | Vite |
| Styling | Tailwind CSS |
| State | Zustand |
| Routing | React Router 6 |
| Realtime | Socket.io-client |
| Media | mediasoup-client |
| API | Axios |
| Auth/Storage client | Supabase JS |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 20+
- Backend running locally or deployed
- Supabase project with the backend schema applied

### Environment Variables

Copy `.env.example` to `.env` and set:

```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ENABLE_RECORDING=true
VITE_ENABLE_FILE_SHARING=true
```

For production, use:

```env
VITE_API_URL=https://supportcast-backend.onrender.com
VITE_SOCKET_URL=https://supportcast-backend.onrender.com
```

### Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Build production assets |
| `npm run preview` | Preview production build on port 4173 |
| `npm run lint` | Run ESLint |
| `npm run format` | Format source files with Prettier |

## Routes

| Route | Description | Access |
|---|---|---|
| `/login` | Agent/admin login | Public |
| `/dashboard` | Agent dashboard and session creation | Agent/Admin |
| `/join?token=<uuid>` | Customer invite flow | Public invite token |
| `/session/:id` | Active support call | Agent/Customer/Admin |
| `/session/:id/ended` | Post-call summary and rejoin state | Participant |
| `/dashboard/admin` | Admin live sessions and history | Admin |
| `/admin` | Admin dashboard alias | Admin |
| `/admin/sessions/:id` | Admin session detail and event log | Admin |

## Implemented Features

### Core Session UI

- Agent login with Supabase Auth.
- Dashboard for listing and creating sessions.
- Invite modal and shareable `/join?token=<uuid>` links.
- Customer join flow with display name capture.
- Session states for waiting, active, ended, and post-call screens.

### Video and Audio

- mediasoup-client send and receive transports.
- Opus audio and VP8 video through the backend SFU.
- No peer-to-peer media path.
- Camera/mic permission flow.
- Join with video or audio only.
- Mute/unmute and camera on/off controls.
- Connection quality indicator based on RTCStats packet loss and jitter.

### Chat and File Sharing

- Real-time Socket.io chat.
- Optimistic message display with server acknowledgement.
- Chat history retained after calls.
- File upload from chat input.
- Client flow for signed upload URLs.
- File messages render with file name, type cue, and download link.

### Recording UI

- Agent-only start and stop recording controls.
- Recording badge shown while recording.
- Status updates for recording, processing, ready, and error states.
- Recording links appear in session history after backend upload.

### Admin UI

- Admin-only route protection.
- Live sessions table with 5-second auto-refresh.
- Searchable and date-filterable session history.
- Force-end button with confirmation dialog.
- Session detail page with event log.
- Agent/admin account management.

### Stability and UX

- React route-level lazy loading with `React.lazy` and `Suspense`.
- Skeleton loaders for async screens.
- Error Boundary around major page sections.
- ToastContainer and global error handlers at app level.
- Socket.io reconnect and re-auth flow.
- Intentional call leave cleanup to avoid noisy disconnect errors.

## Project Structure

```text
src/
  components/
    admin/        Admin tables and session views
    chat/         ChatPanel, ChatMessage, ChatInput, file message UI
    layout/       App shell, sidebar, skeletons
    session/      SessionCard, InviteModal, RecordingBadge
    ui/           Button, Badge, Modal, Toast, Spinner, ConfirmDialog
    video/        VideoGrid, VideoTile, VideoControls, MediaPermission
  hooks/
    useChat.js
    useConnectionQuality.js
    useLocalMedia.js
    useMediasoup.js
    useRecording.js
    useSocket.js
  pages/
    AdminDashboard.jsx
    AdminSessionDetail.jsx
    Dashboard.jsx
    JoinFlow.jsx
    Login.jsx
    SessionEnded.jsx
    SessionView.jsx
  services/
    api.js
    socket.js
    supabase.js
  store/
    chatStore.js
    participantStore.js
    sessionStore.js
    uiStore.js
  utils/
```

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@supportcast.com | Admin@1234 |
| Agent | agent@supportcast.com | Demo@1234 |
| Judge Agent | judge@supportcast.com | Judge@1234 |
| Customer | No login needed; use invite link | N/A |

## Deployment

The frontend is configured for Vercel. Set the Vite environment variables in Vercel and deploy from the GitHub `main` branch.

## License

MIT
