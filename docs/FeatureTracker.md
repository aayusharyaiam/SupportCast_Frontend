# Feature Tracker — SupportCast
### AtomQuest Hackathon 1.0 | Grand Finale

> **Live tracker** — move items from "To Build" to "Done" as you complete them.
> Update timestamps as you go to track your pace during the 15-hour window.

---

## ✅ Features Added (Completed)

### Phase 1 — Core | Completed: 2026-06-13

#### Session Management
- [x] Agent login via Supabase Auth (email + password)
- [x] Agent dashboard — list of own sessions
- [x] Create new session → generates UUID session ID + invite token
- [x] Shareable invite link generated: `/join?token=<uuid>`
- [x] Session status tracking: `waiting → active → ended`
- [x] Either participant can end session; all connections close cleanly
- [x] Session data persisted in Supabase (who joined, when, duration)
- [x] Session event log written to `session_events` table

#### Audio & Video Calling
- [x] mediasoup Worker + Router initialized on server start
- [x] Agent and customer each get Send + Recv WebRTC transports
- [x] Audio streaming (Opus codec) through mediasoup SFU
- [x] Video streaming (VP8 codec) through mediasoup SFU
- [x] Zero peer-to-peer connections — all media routes through server
- [x] Mute / unmute microphone (either participant)
- [x] Enable / disable camera (either participant)
- [x] Graceful fallback if no camera (audio-only mode)
- [x] Connection quality indicator (packet loss + jitter from RTCStats)

#### In-Call Chat
- [x] Real-time text messaging via Socket.io
- [x] Messages persisted to `chat_messages` table in Supabase
- [x] Optimistic UI (message appears immediately, confirmed on ACK)
- [x] Full chat history retrievable via `GET /api/v1/sessions/:id/chat`
- [x] Chat history retained and viewable after call ends

#### User Roles & Access Control
- [x] Two roles: `agent` and `customer`
- [x] Agent authenticated via Supabase JWT
- [x] Customer authenticated via invite token → short-lived JWT
- [x] Role enforcement on all REST API endpoints (middleware)
- [x] Role enforcement on all Socket.io event handlers
- [x] Customer cannot: create session, end session, start/stop recording
- [x] Invalid/expired invite token returns user-friendly error

---

### Phase 2 — Recording | Completed: 2026-06-13

- [x] Agent can start recording during an active session
- [x] Agent can stop recording during an active session
- [x] Recording status broadcast to both participants: `recording | processing | ready`
- [x] Recording status indicator shown in call UI (red badge when recording)
- [x] FFmpeg process receives RTP via mediasoup PlainTransport
- [x] Output encoded to MP4 and saved to `/tmp/<sessionId>.mp4`
- [x] On stop: MP4 uploaded to Supabase Storage
- [x] Recording metadata saved to `recordings` table (status, URL, size, duration)
- [x] Download link available in session history after call ends
- [x] Error state handled (FFmpeg crash → status set to `error`, toast shown)

---

### Phase 3 — Admin Dashboard | Completed: 2026-06-13

- [x] Admin role flag on `agents` table (already in schema)
- [x] Admin-only route guard middleware (roleGuard supports 'admin')
- [x] `GET /api/v1/admin/sessions/live` — all active sessions with participant details
- [x] `GET /api/v1/admin/sessions/history` — paginated past session list (date_from/date_to/search params)
- [x] `DELETE /api/v1/admin/sessions/:id` — force-end any active session
- [x] Admin dashboard page in React (separate route `/admin`)
- [x] Live sessions table: session ID, agent name, customer name, duration
- [x] Session history table: searchable, filterable by date (search is client-side filter)
- [x] Auto-refresh live table every 5 seconds
- [x] Force-end button with confirmation dialog (ConfirmDialog component added)
- [x] Session event log viewable per session (AdminSessionDetail.jsx)

---

### Phase 4 — File Sharing + Reconnect | Completed: 2026-06-13

#### File Sharing in Chat
- [x] File upload button in chat input (ChatInput — already existed, now wired via shareFile)
- [x] File type validation (images, PDFs, docs — no executables) — file.service.js
- [x] File size validation (max 10 MB) — file.service.js
- [x] Validated file uploaded to Supabase Storage under `sessions/<id>/files/` — useChat.shareFile + signed URL
- [x] File message persisted to `chat_messages` with `type='file'` — chatService.saveFileMessage
- [x] File message shown in chat UI with file name, type icon, download link — ChatMessage handles type==='file'
- [x] Files remain accessible via session record after call ends

#### Reconnect Handling
- [x] Unexpected disconnect detected (transport close / ping timeout) — Socket.io disconnect event
- [x] 30-second grace window started on server (in-memory timer map)
- [x] Other participant NOT notified during grace window (participant-left deferred)
- [x] Reconnect within window: participant re-enters seamlessly (join-session clears timer)
- [x] Reconnect within window: mediasoup state restored (join-session returns existingProducers)
- [x] Grace window expires: participant treated as left, other notified (timer fires participant-left)
- [x] Client-side reconnect logic (Socket.io auto-reconnect + re-auth via useSocket)

---

### Phase 5 — Observability + Performance | Completed: 2026-06-13

#### Observability
- [x] `GET /health` endpoint: status, uptime, version, service checks
- [x] `GET /metrics` endpoint: Prometheus-compatible format
- [x] `active_sessions_total` gauge tracked and exposed
- [x] `connected_participants_total` gauge tracked and exposed
- [x] `messages_sent_total` counter tracked and exposed
- [x] `recording_errors_total` counter tracked and exposed
- [x] `session_duration_seconds` histogram tracked and exposed
- [x] Structured JSON logging via Winston throughout the app
- [x] Log level configurable via `LOG_LEVEL` env var

#### Performance & Stability
- [x] React route-level lazy loading (`React.lazy` + `Suspense`)
- [x] Skeleton loaders for all async content (no blank screens)
- [x] React Error Boundary on all major page sections
- [x] Optimistic UI for chat messages
- [x] Rate limiting: 100 req/min per IP (express-rate-limit)
- [x] Security headers: Helmet.js on all responses
- [x] CORS locked to frontend origin only
- [x] All file uploads validated (type + size) before storage
- [x] Retry logic on Socket.io reconnect (exponential backoff)

#### CI/CD
- [x] `.github/workflows/deploy.yml` written
- [x] `.github/workflows/ci.yml` written (lint + test + build)
- [x] ESLint flat config created for backend (eslint.config.js)
- [x] Separate `staging` branch created for pre-production testing
- [x] `.env.example` files exist with all required keys documented
- [x] GitHub repository created + code pushed
- [x] Auto-deploy frontend to Vercel on push to `main`
- [x] Auto-deploy backend to Render via deploy hook on push to `main`

---

### Deployment | Completed: 2026-06-13

- [x] Supabase project created
- [x] All DB tables created with indexes + RLS policies
- [x] Supabase Auth configured (email, no confirm required)
- [x] Storage buckets created: `recordings` + `chat-files`
- [x] Backend live at: `https://supportcast-backend.onrender.com`
- [x] Frontend live at: `https://support-cast-frontend.vercel.app`
- [x] `/health` endpoint returning `status: ok` + `mediasoup: ready`
- [x] `/metrics` endpoint returning Prometheus-compatible metrics
- [x] Demo seed script created (`scripts/seed-demo.js`)
- [x] Demo accounts seeded in Supabase
- [x] Sample sessions + chat history seeded for admin dashboard

---

## 🔨 Features To Build

### Phase 6 — Submission | Target: Hrs 14–15

- [ ] End-to-end demo video recorded:
  - Agent creates session
  - Customer joins via invite link
  - Both on video + audio
  - Chat messages exchanged
  - File shared in chat
  - Recording started and stopped
  - Session ended by agent
  - Admin dashboard viewed with charts
- [ ] Architecture diagram (PDF or image)
- [ ] Submission form filled

---

### Bonus — Admin Agent Management | Added after review

- [x] Admin can create new agent or admin accounts via dashboard (POST /admin/agents)
- [x] Admin can view all agents (GET /admin/agents)
- [x] Admin can delete agents (DELETE /admin/agents/:id)
- [x] "Join with Audio Only" button now functional (getUserMediaAudioOnly hook)
- [x] App icon set as favicon and used in Login branding
- [x] Global error handlers + ToastContainer at App level

---

## 📊 Progress Tracker

| Phase | Total Tasks | Done | Progress |
|---|---|---|---|
| Phase 1 — Core | 28 | 28 | COMPLETE |
| Phase 2 — Recording | 10 | 10 | COMPLETE |
| Phase 3 — Admin | 11 | 11 | COMPLETE |
| Phase 4 — Files + Reconnect | 15 | 15 | COMPLETE |
| Phase 5 — Observability + CI | 27 | 27 | COMPLETE |
| Deployment | 10 | 10 | COMPLETE |
| Phase 6 — Submission | 3 | 0 | 0% |
| **Total** | **104** | **101** | **97%** |

---

## Live URLs

| Service | URL | Status |
|---|---|---|
| Frontend | https://support-cast-frontend.vercel.app | LIVE |
| Backend API | https://supportcast-backend.onrender.com | LIVE |
| Health Check | https://supportcast-backend.onrender.com/health | LIVE |
| Metrics | https://supportcast-backend.onrender.com/metrics | LIVE |

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@supportcast.com | Admin@1234 |
| Agent | agent@supportcast.com | Demo@1234 |
| Judge Agent | judge@supportcast.com | Judge@1234 |
| Customer | No login needed — use invite link | — |

---

> **Note:** FFmpeg must be installed on the server for recording to work. Install with `apt install ffmpeg` or download from https://ffmpeg.org/