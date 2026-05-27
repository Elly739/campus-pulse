import { CATEGORIES, type Category } from "@/lib/events";

export function CategoryFilter({
  value,
  onChange,
}: {
  value: Category | "All";
  onChange: (c: Category | "All") => void;
}) {
  const all: (Category | "All")[] = ["All", ...CATEGORIES];
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0">
      {all.map((c) => {
        const active = c === value;
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-all ${
              active
                ? "border-transparent gradient-bg text-white shadow-lg shadow-violet-500/30"
                : "border-border bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
