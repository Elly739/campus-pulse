import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Calendar, MapPin, Flame, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_STYLES } from "@/lib/events";
import { Countdown } from "@/components/Countdown";
import { AttendeesRow } from "@/components/AttendeesRow";
import { ShareButtons } from "@/components/ShareButtons";
import { FollowOrganizerButton } from "@/components/FollowOrganizerButton";
import { fetchEventById, fetchHasRsvp } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/events/$id")({
  loader: async ({ params }) => {
    const event = await fetchEventById(params.id);
    if (!event) throw notFound();
    return { event };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Event — Campus Event Radar" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { event } = loaderData;
    const desc = event.description.slice(0, 160);
    return {
      meta: [
        { title: `${event.title} — Campus Event Radar` },
        { name: "description", content: desc },
        { property: "og:title", content: event.title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "event" },
        { property: "og:image", content: event.image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: event.title },
        { name: "twitter:description", content: desc },
        { name: "twitter:image", content: event.image },
      ],
    };
  },
  component: EventDetail,
});

function EventDetail() {
  const { id } = Route.useParams();
  const { event: initialEvent } = Route.useLoaderData();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: event = initialEvent } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const e = await fetchEventById(id);
      if (!e) throw notFound();
      return e;
    },
    initialData: initialEvent,
  });

  const { data: hasRsvp } = useQuery({
    queryKey: ["rsvp", id, user?.id],
    queryFn: () => (user ? fetchHasRsvp(id, user.id) : Promise.resolve(false)),
    enabled: !!user,
  });

  const rsvpMutation = useMutation({
    mutationFn: async (next: boolean) => {
      if (!user) throw new Error("Sign in to RSVP");
      if (next) {
        const { error } = await supabase.from("rsvps").insert({ event_id: id, user_id: user.id });
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase.from("rsvps").delete().eq("event_id", id).eq("user_id", user.id);
        if (error) throw error;
      }
    },
    onSuccess: (_d, next) => {
      qc.invalidateQueries({ queryKey: ["rsvp", id] });
      qc.invalidateQueries({ queryKey: ["event", id] });
      qc.invalidateQueries({ queryKey: ["events"] });
      qc.invalidateQueries({ queryKey: ["my-rsvps"] });
      qc.invalidateQueries({ queryKey: ["attendees", id] });
      toast.success(next ? `You're going to ${event?.title}` : "RSVP cancelled");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!event) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 space-y-4">
        <Skeleton className="aspect-[21/9] rounded-3xl" />
        <Skeleton className="h-10 w-2/3" />
      </main>
    );
  }

  const cat = CATEGORY_STYLES[event.category as keyof typeof CATEGORY_STYLES];
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://campus-buzz254.lovable.app/events/${event.id}`;

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
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <Link
              to="/organizers/$name"
              params={{ name: encodeURIComponent(event.organizer) }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              By <span className="font-medium text-foreground underline-offset-4 hover:underline">{event.organizer}</span>
            </Link>
            <FollowOrganizerButton organizer={event.organizer} />
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-card/40 p-4">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Who's going</div>
            <AttendeesRow eventId={event.id} total={event.attendees} />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {event.tags.map((t: string) => (
              <span key={t} className="rounded-full border border-border bg-card/60 px-2.5 py-1 text-xs">{t}</span>
            ))}
          </div>

          <div className="mt-8 space-y-4 text-[15px] leading-relaxed">
            <p>{event.longDescription}</p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Starts" value={new Date(event.startsAt).toLocaleString(undefined, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })} />
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={event.location} />
            {event.deadline && (
              <InfoRow
                icon={<Calendar className="h-4 w-4 text-pink-400" />}
                label="Application deadline"
                value={new Date(event.deadline).toLocaleString()}
              />
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start glass rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Starts in</div>
          <div className="mt-2"><Countdown target={event.startsAt} /></div>

          {!user ? (
            <Link
              to="/profile"
              className="mt-5 block w-full rounded-full gradient-bg py-3 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/30"
            >
              Sign in to RSVP
            </Link>
          ) : (
            <button
              onClick={() => rsvpMutation.mutate(!hasRsvp)}
              disabled={rsvpMutation.isPending}
              className={`mt-5 w-full rounded-full py-3 text-sm font-semibold transition disabled:opacity-60 ${
                hasRsvp
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "gradient-bg text-white shadow-lg shadow-violet-500/30 hover:opacity-95"
              }`}
            >
              {rsvpMutation.isPending ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : hasRsvp ? "You're going ✓ — Cancel RSVP" : "RSVP — I'm going"}
            </button>
          )}

          <div className="mt-5">
            <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Share</div>
            <ShareButtons title={event.title} url={shareUrl} text={`${event.title} — ${event.description}`} />
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
