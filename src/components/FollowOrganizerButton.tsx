import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserPlus, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { fetchIsFollowingOrganizer, fetchOrganizerFollowerCount } from "@/lib/queries";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "@tanstack/react-router";

export function FollowOrganizerButton({ organizer, compact = false }: { organizer: string; compact?: boolean }) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: count = 0 } = useQuery({
    queryKey: ["organizer-followers", organizer],
    queryFn: () => fetchOrganizerFollowerCount(organizer),
  });

  const { data: isFollowing = false } = useQuery({
    queryKey: ["is-following", organizer, user?.id ?? "anon"],
    queryFn: () => (user ? fetchIsFollowingOrganizer(organizer, user.id) : Promise.resolve(false)),
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: async (next: boolean) => {
      if (!user) throw new Error("Sign in to follow");
      if (next) {
        const { error } = await supabase
          .from("organizer_follows")
          .insert({ organizer, user_id: user.id });
        if (error && error.code !== "23505") throw error;
      } else {
        const { error } = await supabase
          .from("organizer_follows")
          .delete()
          .eq("organizer", organizer)
          .eq("user_id", user.id);
        if (error) throw error;
      }
    },
    onSuccess: (_d, next) => {
      qc.invalidateQueries({ queryKey: ["organizer-followers", organizer] });
      qc.invalidateQueries({ queryKey: ["is-following", organizer] });
      toast.success(next ? `Following ${organizer}` : `Unfollowed ${organizer}`);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!user) {
    return (
      <Link
        to="/profile"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium hover:bg-accent"
      >
        <UserPlus className="h-3.5 w-3.5" />
        Follow · {count}
      </Link>
    );
  }

  return (
    <button
      onClick={() => mutation.mutate(!isFollowing)}
      disabled={mutation.isPending}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition disabled:opacity-60 ${
        isFollowing
          ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
          : "border border-border bg-card/60 hover:bg-accent"
      }`}
    >
      {mutation.isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-3.5 w-3.5" />
      ) : (
        <UserPlus className="h-3.5 w-3.5" />
      )}
      {isFollowing ? "Following" : "Follow"}
      {!compact && <span className="text-muted-foreground">· {count}</span>}
    </button>
  );
}
