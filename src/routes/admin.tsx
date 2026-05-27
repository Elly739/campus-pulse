import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, X, ShieldCheck, Calendar } from "lucide-react";
import { EVENTS, CATEGORY_STYLES, type CampusEvent } from "@/lib/events";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

// Mock pending queue derived from existing events
const PENDING: CampusEvent[] = EVENTS.slice(0, 4).map((e) => ({ ...e, id: "pending-" + e.id }));

function Admin() {
  const [queue, setQueue] = useState(PENDING);
  const total = EVENTS.length;
  const trending = EVENTS.filter((e) => e.trending).length;

  const act = (id: string, approved: boolean) => {
    setQueue((q) => q.filter((e) => e.id !== id));
    toast.success(approved ? "Event approved and published" : "Event rejected");
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Approval <span className="gradient-text">dashboard</span>
          </h1>
          <p className="mt-1 text-muted-foreground">Review and publish events submitted by students.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Pending" value={queue.length} />
        <Stat label="Published" value={total} />
        <Stat label="Trending" value={trending} />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Pending review</h2>
        {queue.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
            All caught up. New submissions will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((e) => {
              const cat = CATEGORY_STYLES[e.category];
              return (
                <div key={e.id} className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4">
                  <img src={e.image} alt="" className="h-20 w-32 rounded-xl object-cover" />
                  <div className="min-w-[200px] flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cat.chip}`}>{e.category}</span>
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(e.startsAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="mt-1 font-semibold">{e.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{e.description}</p>
                    <div className="mt-1 text-xs text-muted-foreground">By {e.organizer}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => act(e.id, false)}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-accent"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => act(e.id, true)}
                      className="inline-flex items-center gap-1 rounded-full gradient-bg px-3 py-1.5 text-sm font-medium text-white shadow shadow-violet-500/30"
                    >
                      <Check className="h-4 w-4" /> Approve
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-3xl font-bold gradient-text tabular-nums">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
