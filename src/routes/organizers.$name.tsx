import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Calendar } from "lucide-react";
import { fetchEventsByOrganizer } from "@/lib/queries";
import { EventCard } from "@/components/EventCard";
import { FollowOrganizerButton } from "@/components/FollowOrganizerButton";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/organizers/$name")({
  head: ({ params }) => {
    const name = decodeURIComponent(params.name);
    return {
      meta: [
        { title: `${name} — Campus Event Radar` },
        { name: "description", content: `See all events by ${name} on Campus Event Radar. Follow to get notified when they drop new events.` },
        { property: "og:title", content: `${name} on Campus Event Radar` },
        { property: "og:description", content: `All events by ${name}. Follow to never miss a drop.` },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: OrganizerProfile,
});

function OrganizerProfile() {
  const { name: rawName } = Route.useParams();
  const name = decodeURIComponent(rawName);

  const { data: events, isLoading } = useQuery({
    queryKey: ["organizer-events", name],
    queryFn: () => fetchEventsByOrganizer(name),
  });

  const now = Date.now();
  const upcoming = (events ?? []).filter((e) => new Date(e.startsAt).getTime() >= now);
  const past = (events ?? []).filter((e) => new Date(e.startsAt).getTime() < now);
  const totalAttendees = (events ?? []).reduce((sum, e) => sum + e.attendees, 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Link to="/feed" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to feed
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-violet-500/10 via-card to-pink-500/10 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-2xl font-bold text-white shadow-lg shadow-violet-500/30">
              {name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Organizer</div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {events?.length ?? 0} events</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {totalAttendees} attendees so far</span>
              </div>
            </div>
          </div>
          <FollowOrganizerButton organizer={name} />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Upcoming</h2>
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="aspect-[16/10] rounded-2xl" />)}
          </div>
        ) : upcoming.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No upcoming events. Follow to be notified when {name} drops something new.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold text-muted-foreground">Past events</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 opacity-80">
            {past.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        </section>
      )}
    </main>
  );
}
