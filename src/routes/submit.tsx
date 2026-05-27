import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { CATEGORIES, type Category } from "@/lib/events";
import { Sparkles } from "lucide-react";

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
  imageUrl: z.string().url().optional().or(z.literal("")),
});

function Submit() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Submitted! Your event is pending admin review.");
      setSubmitting(false);
      navigate({ to: "/feed" });
    }, 700);
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

        <Field label="Cover image URL (optional)" name="imageUrl" error={errors.imageUrl} placeholder="https://…" />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full gradient-bg py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 disabled:opacity-60"
        >
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
