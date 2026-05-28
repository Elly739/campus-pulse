import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Check, X, ShieldCheck, Calendar, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_STYLES } from "@/lib/events";
import { fetchPendingEvents } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  component: Admin,
});

function Admin() {
  const { user, loading } = useAuth();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(user);
  const qc = useQueryClient();

  const { data: queue, isLoading: queueLoading } = useQuery({
    queryKey: ["events", "pending"],
    queryFn: fetchPendingEvents,
    enabled: !!isAdmin,
  });

  const { data: stats } = useQuery({
    queryKey: ["events", "stats"],
    queryFn: async () => {
      const [{ count: approved }, { count: trending }] = await Promise.all([
        supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "approved"),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("trending", true).eq("status", "approved"),
      ]);
      return { approved: approved ?? 0, trending: trending ?? 0 };
    },
    enabled: !!isAdmin,
  });

  const act = useMutation({
    mutationFn: async ({ id, approve }: { id: string; approve: boolean }) => {
      const { error } = await supabase
        .from("events")
        .update({ status: approve ? "approved" : "rejected" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["events"] });
      toast.success(vars.approve ? "Event approved and published" : "Event rejected");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (loading || (user && roleLoading)) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-violet-300" />
        <h1 className="mt-4 text-2xl font-bold">Admin only</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue.</p>
        <Link to="/profile" className="mt-6 inline-flex rounded-full gradient-bg px-5 py-2.5 text-sm font-medium text-white">
          Sign in
        </Link>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          You don't have admin access. Ask an existing admin to grant your account the admin role.
        </p>
        <p className="mt-4 text-xs text-muted-foreground break-all">Your user ID: <code>{user.id}</code></p>
        <Link to="/" className="mt-6 inline-flex rounded-full border border-border px-5 py-2.5 text-sm">Go home</Link>
      </main>
    );
  }

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
        <Stat label="Pending" value={queue?.length ?? 0} />
        <Stat label="Published" value={stats?.approved ?? 0} />
        <Stat label="Trending" value={stats?.trending ?? 0} />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Pending review</h2>
        {queueLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
        ) : !queue || queue.length === 0 ? (
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
                      onClick={() => act.mutate({ id: e.id, approve: false })}
                      disabled={act.isPending}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-60"
                    >
                      <X className="h-4 w-4" /> Reject
                    </button>
                    <button
                      onClick={() => act.mutate({ id: e.id, approve: true })}
                      disabled={act.isPending}
                      className="inline-flex items-center gap-1 rounded-full gradient-bg px-3 py-1.5 text-sm font-medium text-white shadow shadow-violet-500/30 disabled:opacity-60"
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
function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-3xl font-bold gradient-text tabular-nums">{value}</div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
