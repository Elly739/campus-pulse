import { createFileRoute, Link } from "@tanstack/react-router";
import { Radar, Users, CalendarDays, ShieldCheck, ArrowRight, Sparkles, Globe, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6">
      {/* Hero */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur mb-6">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" />
          Built by students, for students
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          What is <span className="gradient-text">Campus Event Radar</span>?
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
          A one-stop discovery platform for everything happening on campus — hackathons,
          sports tournaments, career fairs, worship nights, and the events that shape
          your university experience.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/feed"
            className="inline-flex items-center gap-2 rounded-full gradient-bg px-5 py-3 text-sm font-medium text-white shadow-lg shadow-violet-500/30 hover:opacity-95 transition"
          >
            Browse events <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-5 py-3 text-sm font-medium backdrop-blur hover:bg-accent transition"
          >
            Submit an event
          </Link>
        </div>
      </section>

      {/* Mission */}
      <section className="grid gap-6 sm:grid-cols-3 pb-20">
        <ValueCard
          icon={<CalendarDays className="h-5 w-5" />}
          title="Never miss a moment"
          desc="From coding competitions to worship nights, all campus events in one place with live countdowns."
        />
        <ValueCard
          icon={<Users className="h-5 w-5" />}
          title="Community-first"
          desc="Students submit events, students discover them. A platform powered by the people who live campus life."
        />
        <ValueCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Curated & trusted"
          desc="Every event is reviewed before it goes live. No spam, no scams — just real opportunities."
        />
      </section>

      {/* How it works */}
      <section className="pb-20">
        <h2 className="text-2xl font-bold sm:text-3xl text-center mb-10">How it works</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <Step number="1" title="Submit" desc="Club leaders or students post their event with a poster, date, and details." />
          <Step number="2" title="Review" desc="Our admin team quickly reviews and approves genuine campus events." />
          <Step number="3" title="Discover" desc="Thousands of students browse, filter, and RSVP to events they care about." />
        </div>
      </section>

      {/* Categories */}
      <section className="pb-20">
        <h2 className="text-2xl font-bold sm:text-3xl text-center mb-10">What you'll find</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CategoryCard icon={<Globe className="h-5 w-5" />} name="Tech & Hackathons" desc="Coding competitions, workshops, and innovation challenges." />
          <CategoryCard icon={<Heart className="h-5 w-5" />} name="Church & Worship" desc="Fellowship nights, praise events, and spiritual gatherings." />
          <CategoryCard icon={<Users className="h-5 w-5" />} name="Career & Business" desc="Internship fairs, networking events, and startup pitches." />
          <CategoryCard icon={<CalendarDays className="h-5 w-5" />} name="Sports & Fitness" desc="Tournaments, tryouts, and recreational leagues." />
          <CategoryCard icon={<Sparkles className="h-5 w-5" />} name="Entertainment" desc="Gigs, movie nights, comedy shows, and cultural festivals." />
          <CategoryCard icon={<Radar className="h-5 w-5" />} name="Everything else" desc="Any event that brings the campus together." />
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-border p-8 sm:p-14">
          <div className="absolute inset-0 -z-10 opacity-60" style={{ background: "var(--gradient-soft)" }} />
          <h3 className="text-2xl font-bold sm:text-3xl">Ready to find your next event?</h3>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Join thousands of students already using Campus Event Radar to stay in the loop.
          </p>
          <Link
            to="/feed"
            className="mt-6 inline-flex items-center gap-2 rounded-full gradient-bg px-5 py-3 text-sm font-medium text-white"
          >
            Explore the feed <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl py-8 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} Campus Event Radar</span>
          <span>Built for students.</span>
        </div>
      </footer>
    </main>
  );
}

function ValueCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-6 text-center sm:text-left">
      <div className="grid h-10 w-10 place-items-center rounded-xl gradient-bg text-white mx-auto sm:mx-0">{icon}</div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-6 relative overflow-hidden">
      <span className="absolute top-4 right-4 text-5xl font-bold text-violet-500/10 select-none">{number}</span>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

function CategoryCard({ icon, name, desc }: { icon: React.ReactNode; name: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-5 flex items-start gap-4 hover:border-violet-500/30 transition-colors">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-bg text-white">{icon}</div>
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
