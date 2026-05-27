import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Calendar, MapPin, Settings, LogOut } from "lucide-react";
import { EVENTS } from "@/lib/events";
import { EventCard } from "@/components/EventCard";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.3 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.6 6.8 29 5 24 5 16.3 5 9.7 9.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 43c5 0 9.5-1.9 12.9-5l-6-4.9c-2 1.4-4.4 2.4-6.9 2.4-5.3 0-9.7-3.1-11.3-7.4l-6.5 5C9.6 38.6 16.2 43 24 43z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6 4.9c-.4.4 6.7-4.9 6.7-14.5 0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}

function Profile() {
  // Mock auth state; real Google sign-in arrives when Lovable Cloud is enabled.
  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  const signIn = () => {
    setUser({
      name: "Alex Morgan",
      email: "alex.morgan@university.edu",
      avatar: "https://api.dicebear.com/9.x/glass/svg?seed=Alex",
    });
    toast.success("Signed in (mock). Enable Lovable Cloud for real Google auth.");
  };

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-bg shadow-lg shadow-violet-500/30">
          <span className="text-2xl">👋</span>
        </div>
        <h1 className="mt-5 text-2xl font-bold">Sign in to your profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">RSVP to events, save opportunities, and never miss a deadline.</p>
        <button
          onClick={signIn}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
        >
          <GoogleIcon /> Continue with Google
        </button>
        <p className="mt-4 text-xs text-muted-foreground">By continuing you agree to our terms and privacy policy.</p>
      </main>
    );
  }

  const rsvps = EVENTS.slice(0, 3);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="glass rounded-3xl p-6 sm:p-8 flex flex-wrap items-center gap-5">
        <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-full ring-2 ring-violet-500/40" />
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Joined 2025</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Campus North</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent">
            <Settings className="h-4 w-4" /> Settings
          </button>
          <button
            onClick={() => { setUser(null); toast("Signed out"); }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm hover:bg-accent"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="RSVPs" value="12" />
        <Stat label="Saved" value="8" />
        <Stat label="Submitted" value="2" />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Your upcoming RSVPs</h2>
          <Link to="/feed" className="text-sm text-muted-foreground hover:text-foreground">Browse more →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rsvps.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-3xl font-bold gradient-text">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
