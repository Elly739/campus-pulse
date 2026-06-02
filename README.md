# Campus Event Radar

> Your campus, all in one feed. Discover hackathons, internships, sports tournaments, church events, and everything happening around you.

## What is this?

**Campus Event Radar** is a modern web platform built for university students to discover, submit, and RSVP to campus events. Think of it as an "Instagram Explore" meets "Notion" — but exclusively for what's happening on your campus.

## Features

- **Event Discovery** — Browse events by category (Tech, Sports, Career, Church, Entertainment, Business)
- **Smart Filtering & Search** — Find exactly what you're looking for
- **Trending Events** — See what's buzzing on campus right now
- **Countdown Timers** — Never miss a registration deadline
- **One-Tap RSVP** — Sign in with Google and RSVP instantly
- **Event Submission** — Students and club leaders can submit events for review
- **Admin Dashboard** — Moderators approve/reject submissions to keep quality high
- **Dark Mode UI** — Built for late-night scrolling with a sleek Gen Z aesthetic

## Tech Stack

- **Frontend:** React 19, TanStack Start, Tailwind CSS v4, shadcn/ui
- **Backend:** Lovable Cloud (Supabase) — authentication, database, storage
- **Auth:** Google OAuth via Supabase Auth
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Deployment:** Edge-ready via Cloudflare Workers

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with trending events and feature highlights |
| `/feed` | Full event feed with category filters and search |
| `/events/:id` | Detailed event page with countdown and RSVP |
| `/submit` | Submit a new event (requires sign-in) |
| `/profile` | User profile with saved/RSVP'd events |
| `/admin` | Admin dashboard for event approval (admin-only) |
| `/about` | About the platform |

## Database Schema

### `events`
Stores all submitted events.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `title` | `text` | Event title |
| `description` | `text` | Full description |
| `category` | `text` | One of: Tech, Sports, Career, Church, Entertainment, Business |
| `location` | `text` | Where the event happens |
| `start_date` | `timestamptz` | When it starts |
| `end_date` | `timestamptz` | When it ends |
| `poster_url` | `text` | Event poster image URL |
| `organizer` | `text` | Who is organizing |
| `organizer_contact` | `text` | Contact info |
| `status` | `text` | `pending` / `approved` / `rejected` |
| `trending` | `boolean` | Featured on landing |
| `created_at` | `timestamptz` | Auto |
| `submitted_by` | `uuid` | References `auth.users` |

### `rsvps`
Tracks user RSVPs.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key |
| `event_id` | `uuid` | References `events` |
| `user_id` | `uuid` | References `auth.users` |
| `created_at` | `timestamptz` | Auto |

### `profiles`
Extended user info.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | References `auth.users` |
| `full_name` | `text` | Display name |
| `avatar_url` | `text` | Profile photo |
| `role` | `text` | `user` or `admin` |

## Authentication

- Google OAuth sign-in
- Email verification required
- Role-based access control (user vs admin)

## Running Locally

```bash
# Install dependencies
bun install

# Start dev server
bun dev
```

Make sure your `.env` includes:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
```

## Deployment

This app is built on TanStack Start and deploys to the edge. Push to your connected GitHub repository and deploy via your preferred hosting platform (e.g., Vercel, Cloudflare Pages, Netlify).

## Contributing

Got an idea? Campus Event Radar is built for students. Open an issue or submit a PR.

## License

MIT
