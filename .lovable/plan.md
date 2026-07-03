# Making Campus Event Radar Un-copyable

WhatsApp channels are broadcast-only, ephemeral, un-searchable, and have zero personalization. That's our opening. Every feature below does something a WhatsApp channel structurally **cannot** do.

---

## The 5 wedges (all four themes you picked, plus WhatsApp as a distribution channel — not a competitor)

### 1. Squad RSVPs & "Who's Going" — the social layer
The moment students see *their friends* going, RSVP rates explode. WhatsApp channels can't show this.

- Follow other students (like Instagram follows)
- On every event page: "3 friends going" avatars + "12 people from Computer Science going"
- "Bring a squad" — RSVP as a group of 2–5, share one link, everyone confirms in one tap
- Per-event mini group chat that auto-archives 48h after the event ends
- "Going with…" — attach friends to your RSVP so they get a nudge

### 2. AI For-You Feed + Weekly Smart Digest
A WhatsApp channel blasts the same message to 5,000 people. We send 5,000 different feeds.

- 60-second onboarding quiz: year, major, interests, vibes (chill / competitive / spiritual / party / career), free time windows
- Home feed re-ranked by Lovable AI using quiz answers + past RSVPs + saves + skips
- **Sunday 6 PM Digest** — WhatsApp + email: "Your 3 events for this week" with countdowns and a one-tap RSVP link
- "Why am I seeing this?" chip on every card (transparent AI, builds trust)

### 3. Opportunity Radar — the career wedge
This is the moat. WhatsApp channels forward opportunities but you can't filter, save, or get reminded. We can.

- New event type: **Opportunities** (internships, scholarships, hackathons, competitions, grants) alongside social events
- Every opportunity shows: **deadline countdown**, eligibility (year/major), effort estimate, prize/stipend
- One-click "Track this" → automatic reminders at 7d / 48h / 6h before deadline (WhatsApp + push + email)
- "Apply now" CTA with the actual link — no hunting through 40 WhatsApp forwards
- Personal **Deadline Dashboard** on `/profile`: everything you're tracking, sorted by urgency

### 4. Gamified Attendance + Club Profiles
Turns showing up into clout. Turns organizers into creators with followers.

- **QR check-in** at events (organizer shows QR on screen, student scans in-app) → verified attendance
- Points, streaks, monthly leaderboard per campus
- Badges: Hackathon Hunter (5 tech events), Church Regular, Career Grinder, Certified Menace (10 events in a month), etc.
- **Club Profile Pages** — every organizer gets a public profile: bio, banner, follower count, all past + upcoming events, photo wall
- Follow a club → auto-notified when they drop a new event (no more "did I miss the Google DSC meetup?")

### 5. WhatsApp as a Notification Rail
We don't compete with WhatsApp — we ride on it. Students never leave WhatsApp; we meet them there.

- Opt-in WhatsApp notifications for: RSVP confirmations, deadline reminders, digest, "your friend just RSVP'd to X"
- Share-to-WhatsApp buttons everywhere with rich preview cards (og:image auto-generated per event)
- Every event has a share link like `campus-buzz254.lovable.app/e/ai-meetup-8` that renders a beautiful preview when pasted in WhatsApp
- Delivered via GatewayAPI connector (Kenya-friendly) or a webhook to a WhatsApp Business number

---

## What we ship first (recommended MVP order)

To keep momentum, land in this order — each phase is user-visible on its own:

**Phase 1 — "Who's going" + Club Profiles + Share-to-WhatsApp** (biggest social impact, low complexity)
Adds attendee avatars, follow-a-club, per-event share pages with rich WhatsApp preview.

**Phase 2 — Opportunity Radar + Deadline Reminders** (biggest differentiator vs WhatsApp channels)
New "Opportunity" event type, tracked deadlines, WhatsApp/email reminders via cron.

**Phase 3 — AI For-You Feed + Sunday Digest** (biggest retention lift)
Onboarding quiz, personalized ranking with Lovable AI, weekly WhatsApp digest.

**Phase 4 — QR Check-in + Points + Leaderboard** (biggest engagement lift after launch)
Attendance verification, points, badges, campus leaderboard.

---

## Technical notes (for reference)

- **DB additions** — `follows` (user↔user, user↔club), `event_shares`, `deadline_reminders`, `check_ins`, `points_log`, `badges`, `user_badges`, `clubs` (promoted from `organizer` string), plus quiz answers on `profiles`. All with RLS + GRANTs.
- **AI** — Lovable AI (`google/gemini-3-flash-preview`) via `createServerFn` for feed ranking + digest generation. No user API key needed.
- **WhatsApp** — GatewayAPI connector (already documented in stack). Requires user to link their GatewayAPI connection; if they'd rather use Twilio or a WhatsApp Business webhook, we can swap.
- **Reminders/Digest** — pg_cron hitting a public `/api/public/hooks/*` route on the stable `project--{id}.lovable.app` URL.
- **QR check-in** — Signed short-lived tokens per event; camera scan on the student side.

---

## What I need from you to start

1. **Confirm phase 1** is where we begin (or pick a different starting phase)
2. **WhatsApp provider** — link a GatewayAPI connection now, or defer WhatsApp to phase 2 and start with email/push only?
3. **Campus scope** — single campus (Kenya) for MVP, or multi-campus with each getting its own feed from day one?