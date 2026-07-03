import { useQuery } from "@tanstack/react-query";
import { fetchEventAttendees, type Attendee } from "@/lib/queries";

function initials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export function AttendeesRow({ eventId, total }: { eventId: string; total: number }) {
  const { data: attendees = [], isLoading } = useQuery({
    queryKey: ["attendees", eventId],
    queryFn: () => fetchEventAttendees(eventId, 8),
  });

  if (isLoading || attendees.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {total === 0 ? "Be the first to RSVP" : `${total} going`}
      </p>
    );
  }

  const extra = Math.max(0, total - attendees.length);

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {attendees.slice(0, 6).map((a: Attendee) => (
          <div
            key={a.id}
            className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border-2 border-background bg-gradient-to-br from-violet-500/40 to-pink-500/40 text-[11px] font-semibold text-white"
            title={a.full_name ?? undefined}
          >
            {a.avatar_url ? (
              <img src={a.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span>{initials(a.full_name).toUpperCase()}</span>
            )}
          </div>
        ))}
        {extra > 0 && (
          <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-background bg-accent text-[11px] font-semibold text-muted-foreground">
            +{extra}
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{total}</span> going
      </p>
    </div>
  );
}
