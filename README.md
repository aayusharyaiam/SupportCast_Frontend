# SupportCast Frontend

Real-time video support platform frontend — React 18 + Vite + Tailwind CSS + Zustand.

## Tech Stack

| Layer | Technology |
|------|------------|
| UI Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | Zustand |
| Routing | React Router 6 |
| WebSocket | Socket.io-client |
| Media | mediasoup-client |
| API Client | Axios |
| Database | Supabase JS |
| Icons | Lucide React |

## Getting Started

### Prerequisites

- Node.js 20+
- Backend server running at `http://localhost:3001`

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
│   ├── ui/           # Button, Badge, Modal, Toast, Spinner, etc.
│   ├── layout/       # AppShell, Sidebar, PageSkeleton
│   ├── video/        # VideoGrid, VideoTile, VideoControls, MediaPermission
│   ├── chat/         # ChatPanel, ChatMessage, ChatInput
│   ├── session/      # SessionCard, InviteModal, RecordingBadge
│   └── admin/        # Admin tables
├── pages/
│   ├── Login.jsx         # Agent login
│   ├── Dashboard.jsx      # Agent session list
│   ├── SessionView.jsx    # Active call view
│   ├── JoinFlow.jsx       # Customer join via token
│   ├── SessionEnded.jsx   # Post-call summary
│   ├── AdminDashboard.jsx # Admin live sessions
│   └── AdminSessionDetail.jsx
├── hooks/
│   ├── useSocket.js           # Socket.io connection
│   ├── useMediasoup.js        # WebRTC transport management
│   ├── useLocalMedia.js       # getUserMedia, mute/unmute
│   ├── useChat.js             # Chat state & messaging
│   ├── useRecording.js        # Recording controls
│   └── useConnectionQuality.js
├── store/
│   ├── sessionStore.js   # Session state
│   ├── chatStore.js      # Messages
│   ├── participantStore.js
│   └── uiStore.js        # Toasts, modals
├── services/
│   ├── api.js        # Axios API client
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
| `/session/:id` | Active call view | Agent/Customer |
| `/join?token=<uuid>` | Customer join flow | None |
| `/session/:id/ended` | Post-call summary | Any |
| `/dashboard/admin` | Admin dashboard | Admin only |

## Features Implemented (Phase 1)

### Session Management
- Agent login via Supabase Auth
- Session creation with shareable invite links
- Session status tracking (waiting → active → ended)
- Session history

### Audio & Video Calling
- Real-time video/audio via mediasoup SFU
- Mute/unmute microphone
- Enable/disable camera
- Connection quality indicator
- Graceful fallback for audio-only

### In-Call Chat
- Real-time text messaging
- Optimistic UI (instant display)
- Chat history persisted in Supabase

### User Roles
- Agent: authenticated via Supabase JWT
- Customer: authenticated via invite token (short-lived JWT)
- Role-based access control on all endpoints

## License

MIT