import { Link } from "@tanstack/react-router";
import { Calendar, MapPin, Users, Flame } from "lucide-react";
import { CATEGORY_STYLES, type CampusEvent } from "@/lib/events";
import { Countdown } from "./Countdown";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

export function EventCard({ event, index = 0 }: { event: CampusEvent; index?: number }) {
  const cat = CATEGORY_STYLES[event.category];
  return (
    <Link
      to="/events/$id"
      params={{ id: event.id }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-white/20 hover:shadow-2xl hover:shadow-violet-500/10 animate-float-up"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur ${cat.chip}`}>
            {event.category}
          </span>
          {event.trending && (
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/15 px-2.5 py-1 text-xs font-medium text-orange-300 backdrop-blur">
              <Flame className="h-3 w-3" /> Trending
            </span>
          )}
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur">
          <Countdown target={event.startsAt} compact />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-semibold leading-snug tracking-tight line-clamp-2">{event.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {fmt(event.startsAt)}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.location}</span>
          <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {event.attendees}</span>
        </div>
      </div>
    </Link>
  );
}
