# SupportCast Demo Script — AtomQuest Hackathon 1.0

**Total duration:** ~5–8 minutes
**Voiceover:** Speak naturally as you perform each step. Mention what you're doing and why.
**Recording settings:** 1080p, 30fps, screen only or screen+camera

---

## PRE-RECORDING CHECKLIST

- [ ] Demo accounts ready:
  - Admin: `admin@supportcast.com` / `Admin@1234`
  - Agent: `agent@supportcast.com` / `Demo@1234`
- [ ] Backend deployed and healthy: `https://supportcast-backend.onrender.com/health`
- [ ] Frontend deployed: `https://support-cast-frontend.vercel.app`
- [ ] Seed script already run (3 historical sessions + 1 live session seeded)
- [ ] Close all other browser tabs to avoid distractions

---

## SCENE 1 — Title + Overview (30 sec)

**VO:** "SupportCast is a real-time customer support platform with live video, in-call chat, file sharing, session recording, and a full admin dashboard. It uses WebRTC via mediasoup for peer-to-peer video, Socket.io for real-time messaging, and Supabase for auth, database, and storage. Built for a 2-person support workflow: an agent creates a session and shares an invite link with the customer."

**On screen:** Show the live URLs. Open the frontend and zoom to 80%.

---

## SCENE 2 — Agent Login + Dashboard (30 sec)

**Step 1:** Navigate to `https://support-cast-frontend.vercel.app`

**Step 2:** Log in as agent:
- Email: `agent@supportcast.com`
- Password: `Demo@1234`

**VO:** "The agent logs in with their credentials. The JWT is verified against Supabase Auth."

**Step 3:** Show the dashboard
- Point to the stat cards (total sessions, active sessions, avg duration)
- Show the sessions list with glassmorphism cards
- Point to a session that shows "Live" badge or "Ended" status

**VO:** "The dashboard shows real-time stats, the sessions list with live/ended status, and a share button to invite customers."

---

## SCENE 3 — Create Session + Customer Joins (60 sec)

**Step 4:** Click the "New Session" button (or similar CTA on the dashboard)

**Step 5:** Show the session page loads, URL contains session ID (e.g., `/session/abc-123`)

**Step 6:** Click "Share" or "Invite" to show the invite link modal

**VO:** "The agent creates a session and gets a shareable invite link. The customer joins without needing to create an account — they authenticate via a short-lived JWT token."

**Step 7:** Copy the invite link and open in a second browser (or Incognito window)

**Step 8:** In the second window, paste the invite link — customer joins as guest

**VO:** "The customer joins via invite link. No login required. They land directly in the call."

---

## SCENE 4 — Live Video Call (90 sec)

**Step 9:** Show both participants in the video grid
- Agent's camera and mic should be active
- Customer's camera and mic should be active

**VO:** "Both participants can see and hear each other in real time, routed through the mediasoup SFU on the backend."

**Step 10:** Toggle the agent's microphone (mute/unmute)
- Show the UI responds, icon changes to MicOff

**VO:** "Either participant can mute or disable their camera at any time."

**Step 11:** Toggle the agent's video (turn camera off/on)
- Show the video tile changes

**Step 12:** Show the connection quality indicator

**VO:** "The connection quality indicator shows real-time packet loss and jitter using RTCStats."

---

## SCENE 5 — In-Call Chat + File Sharing (60 sec)

**Step 13:** Click the chat icon to open the chat panel

**Step 14:** Send a text message as the agent
- Type: "Hi! How can I help you today?"
- Show the message appears immediately (optimistic UI)

**Step 15:** Switch to the customer window and reply
- Type: "My screen is frozen on the dashboard"
- Show the message appears in both windows

**VO:** "Chat messages are real-time via Socket.io and persisted to Supabase. Both participants see messages instantly."

**Step 16:** Send a file as the customer
- Click the paperclip icon
- Select a small file (PDF or image)
- Show the file upload progress

**VO:** "Files up to 10MB can be shared in chat — images, PDFs, docs. They're validated for type and size, uploaded to Supabase Storage, and shared via signed URL."

**Step 17:** Show the file message appears in chat with download link

---

## SCENE 7 — Session Recording (60 sec) *(Agent only)*

**Step 18:** Agent clicks the record button (red circle icon)

**VO:** "The agent can start recording at any time. FFmpeg on the server captures the RTP stream via a PlainTransport from mediasoup."

**Step 19:** Show the recording badge appears ("Recording" with pulsing red dot)

**Step 20:** Let the recording run for 15–20 seconds while doing a quick chat exchange

**Step 21:** Agent clicks the stop recording button (red square)

**VO:** "Recording stops. The MP4 is uploaded to Supabase Storage and the download link is available after the call ends."

**Step 22:** Show the session ended screen with duration and message count

---

## SCENE 8 — Admin Dashboard (60 sec)

**Step 23:** Open a new browser tab, go to `https://support-cast-frontend.vercel.app/admin`

**Step 24:** Log in as admin:
- Email: `admin@supportcast.com`
- Password: `Admin@1234`

**VO:** "The admin dashboard is a separate route, protected by role-based middleware."

**Step 25:** Show the live sessions table
- Point to any active session
- Show the "End" button

**Step 26:** Show the session history table
- Show the pagination
- Show search functionality

**Step 27:** Show the charts
- Line chart: sessions over last 7 days
- Pie chart: session status breakdown

**VO:** "The admin dashboard shows all live sessions, searchable history, and analytics charts powered by recharts."

**Step 28:** Optionally — click "End" on a live session and show the confirmation dialog

**VO:** "Admins can force-end any active session with a confirmation dialog."

---

## SCENE 9 — Wrap Up (20 sec)

**Step 29:** Show the `/health` endpoint returning JSON
- `https://supportcast-backend.onrender.com/health`

**Step 30:** Show the `/metrics` endpoint returning Prometheus metrics
- `https://supportcast-backend.onrender.com/metrics`

**VO:** "The backend exposes health and Prometheus-compatible metrics endpoints. Winston provides structured JSON logging throughout the application."

---

## RECORDING TIPS

- Record in landscape (1920×1080) for best quality
- Use a clean browser profile or Incognito to separate agent/customer sessions
- Keep the browser zoom at 100% or 90% — not smaller
- Use a dark background/wall behind you if showing your camera
- Pause between scenes rather than cutting abruptly
- Speak clearly and at a natural pace
- Mention what you're about to do before doing it ("Now I'll…")
- At the end, show the live URLs one more time as a closing shot

---

## UPLOAD INSTRUCTIONS

1. Save as `SupportCast_Demo.mp4` (or `.webm`)
2. Upload to the hackathon submission platform
3. Also commit `docs/demo-script.md` to the repo for documentation