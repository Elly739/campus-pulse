import { supabase } from "@/integrations/supabase/client";
import { mapEvent, type CampusEvent } from "./events";

export async function fetchApprovedEvents(): Promise<CampusEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "approved")
    .order("starts_at", { ascending: true });
  if (error) throw error;
  const ids = (data ?? []).map((e) => e.id);
  const counts = await fetchRsvpCounts(ids);
  return (data ?? []).map((row) => mapEvent(row, counts[row.id] ?? 0));
}

export async function fetchEventById(id: string): Promise<CampusEvent | null> {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const counts = await fetchRsvpCounts([data.id]);
  return mapEvent(data, counts[data.id] ?? 0);
}

export async function fetchPendingEvents(): Promise<CampusEvent[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapEvent(row, 0));
}

export async function fetchRsvpCounts(eventIds: string[]): Promise<Record<string, number>> {
  if (eventIds.length === 0) return {};
  const { data, error } = await supabase.from("rsvps").select("event_id").in("event_id", eventIds);
  if (error) return {};
  const counts: Record<string, number> = {};
  (data ?? []).forEach((r) => {
    counts[r.event_id] = (counts[r.event_id] ?? 0) + 1;
  });
  return counts;
}

export async function fetchMyRsvps(userId: string): Promise<CampusEvent[]> {
  const { data, error } = await supabase
    .from("rsvps")
    .select("event_id, events(*)")
    .eq("user_id", userId);
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((r: any) => mapEvent(r.events, 0)).filter(Boolean);
}

export async function fetchHasRsvp(eventId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("rsvps")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}
