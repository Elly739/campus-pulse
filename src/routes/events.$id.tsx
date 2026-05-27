import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Calendar, MapPin, Users, Share2, Heart, Flame } from "lucide-react";
import { getEvent, CATEGORY_STYLES, type CampusEvent } from "@/lib/events";
import { Countdown } from "@/components/Countdown";

export const Route = createFileRoute("/events/$id")({
  loader: ({ params }): { event: CampusEvent } => {
    const event = getEvent(params.id);
    if (!event) throw notFound();
    return { event };
  },
  component: EventDetail,
});

function EventDetail() {
  const { event } = Route.useLoaderData() as { event: CampusEvent };
  const cat = CATEGORY_STYLES[event.category];
  const [rsvp, setRsvp] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleRsvp = () => {
    setRsvp((v) => {
      const next = !v;
      toast.success(next ? `You're going to ${event.title}` : "RSVP cancelled");
      return next;
    });
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: event.title, url });
      else { await navigator.clipboard.writeText(url); toast.success("Link copied to clipboard"); }
    } catch {/* ignore */}
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10">
      <Link to="/feed" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to feed
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-border">
        <div className="relative aspect-[21/9]">
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className={`rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur ${cat.chip}`}>
              {event.category}
            </span>
            {event.trending && (
              <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/15 px-2.5 py-1 text-xs font-medium text-orange-300 backdrop-blur">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>
          <p className="mt-2 text-muted-foreground">By {event.organizer}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {event.tags.map((t) => (
              <span key={t} className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-8 space-y-4 text-[15px] leading-relaxed">
            <p>{event.longDescription}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Starts" value={new Date(event.startsAt).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={event.location} />
            <InfoRow icon={<Users className="h-4 w-4" />} label="Interested" value={`${event.attendees + (rsvp ? 1 : 0)}`} />
            {event.deadline && (
              <InfoRow
                icon={<Calendar className="h-4 w-4 text-pink-400" />}
                label="Application deadline"
                value={new Date(event.deadline).toLocaleString()}
              />
            )}
          </div>
        </div>

        {/* Sticky RSVP card */}
        <aside className="lg:sticky lg:top-24 self-start glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Starts in</div>
          <div className="mt-2"><Countdown target={event.startsAt} /></div>

          <button
            onClick={toggleRsvp}
            className={`mt-5 w-full rounded-full py-3 text-sm font-semibold transition ${
              rsvp
                ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                : "gradient-bg text-white shadow-lg shadow-violet-500/30 hover:opacity-95"
            }`}
          >
            {rsvp ? "You're going ✓" : "RSVP — I'm going"}
          </button>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => setSaved((s) => !s)}
              className={`flex items-center justify-center gap-1.5 rounded-full border py-2 text-sm transition ${
                saved ? "border-pink-500/40 bg-pink-500/10 text-pink-300" : "border-border hover:bg-accent"
              }`}
            >
              <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} /> Save
            </button>
            <button onClick={share} className="flex items-center justify-center gap-1.5 rounded-full border border-border py-2 text-sm hover:bg-accent">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card/40 p-3">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-muted-foreground">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
