import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Zap, Calendar, TrendingUp, Search, Bell } from "lucide-react";
import { EVENTS, CATEGORIES, CATEGORY_STYLES } from "@/lib/events";
import { EventCard } from "@/components/EventCard";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const trending = EVENTS.filter((e) => e.trending).slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-glow)" }} />
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center animate-float-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              Your campus, all in one feed
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Never miss <span className="gradient-text">what's happening</span> on campus.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Hackathons, internships, tournaments, worship nights, gigs — discover and RSVP to every event that matters to you.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/feed"
                className="inline-flex items-center gap-2 rounded-full gradient-bg px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/30 hover:opacity-95 transition"
              >
                Explore the feed <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/submit"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-3 text-sm font-medium backdrop-blur hover:bg-accent transition"
              >
                Submit an event
              </Link>
            </div>

            {/* Category pills */}
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((c) => (
                <Link
                  key={c}
                  to="/feed"
                  search={{ category: c }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur transition hover:scale-105 ${CATEGORY_STYLES[c].chip}`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature icon={<Search className="h-5 w-5" />} title="Find your vibe" desc="Filter by category, search by keyword, save what you love." />
          <Feature icon={<Bell className="h-5 w-5" />} title="Closing soon" desc="Live countdowns so you never miss an internship deadline." />
          <Feature icon={<Zap className="h-5 w-5" />} title="One-tap RSVP" desc="Sign in, RSVP, and get reminders straight to your phone." />
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-xs text-orange-300">
              <TrendingUp className="h-3.5 w-3.5" /> Trending now
            </div>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">What everyone's talking about</h2>
          </div>
          <Link to="/feed" className="hidden sm:inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            See all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {trending.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-14 text-center">
          <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "var(--gradient-soft)" }} />
          <Calendar className="mx-auto h-8 w-8 text-violet-300" />
          <h3 className="mt-4 text-2xl font-bold sm:text-3xl">Run a club or society?</h3>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            List your next event in 60 seconds and get in front of thousands of students on campus.
          </p>
          <Link
            to="/submit"
            className="mt-6 inline-flex items-center gap-2 rounded-full gradient-bg px-5 py-3 text-sm font-medium text-white"
          >
            Submit your event <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-muted-foreground sm:px-6 flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Campus Event Radar</span>
          <span>Built for students.</span>
        </div>
      </footer>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl gradient-bg text-white">{icon}</div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
