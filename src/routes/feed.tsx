import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Clock } from "lucide-react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { type Category } from "@/lib/events";
import { EventCard } from "@/components/EventCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Countdown } from "@/components/Countdown";
import { fetchApprovedEvents } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";

const searchSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/feed")({
  validateSearch: searchSchema,
  component: Feed,
});

function Feed() {
  const { category: initialCat, q: initialQ } = Route.useSearch();
  const [cat, setCat] = useState<Category | "All">((initialCat as Category) || "All");
  const [q, setQ] = useState(initialQ || "");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events", "approved"],
    queryFn: fetchApprovedEvents,
  });

  const filtered = useMemo(() => {
    return (events ?? [])
      .filter((e) => (cat === "All" ? true : e.category === cat))
      .filter((e) =>
        q.trim()
          ? (e.title + e.description + e.tags.join(" ") + e.organizer).toLowerCase().includes(q.toLowerCase())
          : true,
      );
  }, [events, cat, q]);

  const closingSoon = useMemo(
    () =>
      (events ?? [])
        .filter((e) => e.deadline && new Date(e.deadline).getTime() > Date.now())
        .sort((a, b) => +new Date(a.deadline!) - +new Date(b.deadline!))
        .slice(0, 4),
    [events],
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          The <span className="gradient-text">feed</span>
        </h1>
        <p className="text-muted-foreground">Everything happening on campus, sorted by what's next.</p>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search events, organizers, tags…"
            className="w-full rounded-full border border-border bg-card/60 py-2.5 pl-9 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40"
          />
        </div>
      </div>

      <div className="mt-4">
        <CategoryFilter value={cat} onChange={setCat} />
      </div>

      {closingSoon.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-pink-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Opportunities closing soon
            </h2>
          </div>
          <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {closingSoon.map((e) => (
              <Link
                key={e.id}
                to="/events/$id"
                params={{ id: e.id }}
                className="group flex min-w-[260px] flex-col gap-2 rounded-2xl border border-border bg-card/60 p-4 transition hover:border-pink-500/40"
              >
                <span className="text-xs text-pink-300">Closes in</span>
                <div className="text-lg font-semibold tabular-nums">
                  <Countdown target={e.deadline!} compact />
                </div>
                <div className="mt-1 text-sm font-medium line-clamp-2 group-hover:text-foreground">{e.title}</div>
                <div className="text-xs text-muted-foreground">{e.organizer}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">
            {isLoading ? "Loading…" : `${filtered.length} events`}
          </h2>
        </div>
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-[16/10] rounded-2xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No events match your search. Try clearing filters.
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        )}
      </section>
    </main>
  );
}
