import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Sparkles, Loader2, Upload } from "lucide-react";
import { CATEGORIES, type Category } from "@/lib/events";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/submit")({
  component: Submit,
});

const schema = z.object({
  title: z.string().trim().min(3, "Title is too short").max(120),
  description: z.string().trim().min(10, "Description is too short").max(500),
  category: z.enum(CATEGORIES as [Category, ...Category[]]),
  location: z.string().trim().min(2).max(120),
  organizer: z.string().trim().min(2).max(120),
  startsAt: z.string().min(1, "Pick a date and time"),
});

function Submit() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [posterFile, setPosterFile] = useState<File | null>(null);

  if (loading) return <main className="p-10 text-center text-muted-foreground">Loading…</main>;
  if (!user) {
    return (
      <main className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Sign in to submit an event</h1>
        <p className="mt-2 text-sm text-muted-foreground">You need an account so we know who submitted the event.</p>
        <Link to="/profile" className="mt-6 inline-flex rounded-full gradient-bg px-5 py-2.5 text-sm font-medium text-white">
          Go to sign in
        </Link>
      </main>
    );
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      let imageUrl: string | null = null;
      if (posterFile) {
        const ext = posterFile.name.split(".").pop() || "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("event-posters").upload(path, posterFile, {
          cacheControl: "3600",
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("event-posters").getPublicUrl(path);
        imageUrl = pub.publicUrl;
      }

      const { error } = await supabase.from("events").insert({
        title: result.data.title,
        description: result.data.description,
        long_description: result.data.description,
        category: result.data.category,
        location: result.data.location,
        organizer: result.data.organizer,
        starts_at: new Date(result.data.startsAt).toISOString(),
        image: imageUrl,
        submitted_by: user.id,
        status: "pending",
      });
      if (error) throw error;
      toast.success("Submitted! Your event is pending admin review.");
      navigate({ to: "/feed" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-violet-400" /> List your event
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Submit an <span className="gradient-text">event</span>
        </h1>
        <p className="mt-2 text-muted-foreground">It takes about a minute. We'll review and publish within 24 hours.</p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 glass rounded-2xl p-5 sm:p-7 space-y-5">
        <Field label="Event title" name="title" error={errors.title} placeholder="e.g. AI Builders Meetup #8" />
        <Field label="Short description" name="description" error={errors.description} as="textarea" placeholder="One or two lines that hook people in." />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Category" name="category" error={errors.category} as="select" options={CATEGORIES} />
          <Field label="Date & time" name="startsAt" error={errors.startsAt} type="datetime-local" />
          <Field label="Location" name="location" error={errors.location} placeholder="Building / room / address" />
          <Field label="Organizer" name="organizer" error={errors.organizer} placeholder="Club, society, or person" />
        </div>

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Event poster (optional)</span>
          <div className="flex items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background/60 px-3.5 py-2.5 text-sm hover:bg-accent">
              <Upload className="h-4 w-4" />
              <span>{posterFile ? "Change image" : "Upload image"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
              />
            </label>
            {posterFile && <span className="text-xs text-muted-foreground truncate">{posterFile.name}</span>}
          </div>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full gradient-bg py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Submitting…" : "Submit for review"}
        </button>
      </form>
    </main>
  );
}

type FieldProps = {
  label: string;
  name: string;
  error?: string;
  placeholder?: string;
  type?: string;
  as?: "input" | "textarea" | "select";
  options?: string[];
};

function Field({ label, name, error, placeholder, type = "text", as = "input", options = [] }: FieldProps) {
  const base =
    "w-full rounded-xl border bg-background/60 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 " +
    (error ? "border-red-500/50" : "border-border");
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {as === "textarea" ? (
        <textarea name={name} placeholder={placeholder} rows={3} className={base} />
      ) : as === "select" ? (
        <select name={name} defaultValue="" className={base}>
          <option value="" disabled>Choose a category</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input name={name} type={type} placeholder={placeholder} className={base} />
      )}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
