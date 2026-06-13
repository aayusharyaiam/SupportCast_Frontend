# SupportCast Frontend

Real-time video support platform frontend — React 18 + Vite + Tailwind CSS + Zustand + mediasoup-client.

## Tech Stack

| Layer | Technology |
|------|------------|
| UI Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Routing | React Router 6 |
| WebSocket | Socket.io-client |
| Media | mediasoup-client 3 |
| API Client | Axios |
| Database | Supabase JS |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 20+
- Backend server running at `http://localhost:3001`
- Supabase project with the schema applied

### Environment Variables

Copy `.env.example` to `.env`:

```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ENABLE_RECORDING=true
VITE_ENABLE_FILE_SHARING=true
```

### Installation

```bash
npm install
```

### Running

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Project Structure

```
src/
├── components/
│   ├── ui/           # Button, Badge, Modal, Toast, Spinner, EmptyState, ConfirmDialog
│   ├── layout/       # AppShell, Sidebar, PageSkeleton
│   ├── video/        # VideoGrid, VideoTile, VideoControls, MediaPermission
│   ├── chat/         # ChatPanel, ChatMessage, ChatInput, FileMessage
│   ├── session/      # SessionCard, InviteModal, RecordingBadge
│   └── admin/        # Admin tables
├── pages/
│   ├── Login.jsx            # Agent login
│   ├── Dashboard.jsx         # Agent session list + create
│   ├── SessionView.jsx       # Active call (video, chat, recording)
│   ├── JoinFlow.jsx          # Customer join via token
│   ├── SessionEnded.jsx      # Post-call summary
│   ├── AdminDashboard.jsx    # Admin live sessions + history
│   └── AdminSessionDetail.jsx
├── hooks/
│   ├── useSocket.js           # Socket.io connection + reconnect
│   ├── useMediasoup.js        # WebRTC transport management
│   ├── useLocalMedia.js       # getUserMedia, mute/unmute, camera toggle
│   ├── useChat.js             # Chat state + send message + share file
│   ├── useRecording.js        # Recording start/stop controls
│   └── useConnectionQuality.js # RTCStats-based quality indicator
├── store/
│   ├── sessionStore.js    # Session state
│   ├── chatStore.js       # Messages
│   ├── participantStore.js # Local + remote participants
│   └── uiStore.js         # Toasts, modals, loading states
├── services/
│   ├── api.js        # Axios API client (auth, sessions, admin, files)
│   ├── supabase.js   # Supabase client
│   └── socket.js     # Socket.io singleton
└── utils/
    ├── errors.js
    └── asyncHandler.js
```

## Pages & Routes

| Route | Description | Auth |
|-------|-------------|------|
| `/login` | Agent login | None |
| `/dashboard` | Agent session list | Agent |
| `/session/:id` | Active call (video, chat, recording) | Agent/Customer |
| `/join?token=<uuid>` | Customer join flow | None |
| `/session/:id/ended` | Post-call summary | Any |
| `/dashboard/admin` | Admin live sessions | Admin |
| `/admin` | Admin dashboard | Admin |
| `/admin/sessions/:id` | Admin session detail + event log | Admin |

## Features

### Phase 1 — Core
- Agent login via Supabase Auth (email + password)
- Session creation with shareable invite links (`/join?token=<uuid>`)
- Real-time video/audio via mediasoup SFU (no P2P)
- Mute/unmute microphone, enable/disable camera
- Real-time chat with optimistic UI
- Role-based access control (agent/customer)
- Connection quality indicator (packet loss + jitter)

### Phase 2 — Recording
- Agent-only recording controls in `VideoControls`
- Recording status badge (red pulse when recording)
- Server-side FFmpeg encoding via PlainTransport
- MP4 upload to Supabase Storage on stop
- `processing` → `ready` / `error` status flow
- Recording available in session history

### Phase 3 — Admin Dashboard
- Live sessions table with 5-second auto-refresh
- Session history with pagination controls
- Search/filter by session ID or agent name
- Force-end session with confirmation dialog
- Session detail view with event log
- Admin-only routes and API protection

### Phase 4 — File Sharing + Reconnect
- File upload via paperclip icon in chat input
- Type validation (images, PDFs, docs) + 10MB size limit
- Files uploaded to Supabase Storage via signed URL
- File messages rendered with download link
- 30-second server-side reconnect grace window
- Graceful reconnect clears timer, restores mediasoup state
- Socket.io auto-reconnect with re-auth

## License

MIT