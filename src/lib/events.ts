export type Category = "Tech" | "Sports" | "Career" | "Church" | "Entertainment" | "Business";

export const CATEGORIES: Category[] = ["Tech", "Sports", "Career", "Church", "Entertainment", "Business"];

export const CATEGORY_STYLES: Record<Category, { chip: string; ring: string }> = {
  Tech:          { chip: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30", ring: "ring-indigo-500/40" },
  Sports:        { chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", ring: "ring-emerald-500/40" },
  Career:        { chip: "bg-blue-500/15 text-blue-300 border-blue-500/30", ring: "ring-blue-500/40" },
  Church:        { chip: "bg-amber-500/15 text-amber-300 border-amber-500/30", ring: "ring-amber-500/40" },
  Entertainment: { chip: "bg-pink-500/15 text-pink-300 border-pink-500/30", ring: "ring-pink-500/40" },
  Business:      { chip: "bg-violet-500/15 text-violet-300 border-violet-500/30", ring: "ring-violet-500/40" },
};

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: Category;
  image: string;
  location: string;
  organizer: string;
  startsAt: string;
  deadline?: string;
  attendees: number;
  trending?: boolean;
  tags: string[];
  status?: "pending" | "approved" | "rejected";
  submittedBy?: string | null;
}

const FALLBACK_COVERS: Record<Category, string> = {
  Tech: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
  Sports: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1200&q=80",
  Career: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
  Church: "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&q=80",
  Entertainment: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
  Business: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapEvent(row: any, attendees = 0): CampusEvent {
  const category = row.category as Category;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    longDescription: row.long_description ?? row.description,
    category,
    image: row.image || FALLBACK_COVERS[category],
    location: row.location,
    organizer: row.organizer,
    startsAt: row.starts_at,
    deadline: row.deadline ?? undefined,
    attendees,
    trending: row.trending ?? false,
    tags: row.tags ?? [],
    status: row.status,
    submittedBy: row.submitted_by ?? null,
  };
}
