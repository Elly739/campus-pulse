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
  startsAt: string; // ISO
  deadline?: string; // ISO — for opportunities
  attendees: number;
  trending?: boolean;
  tags: string[];
}

// Curated cover images (Unsplash) per category
const COVERS: Record<Category, string[]> = {
  Tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=80",
  ],
  Sports: [
    "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1200&q=80",
    "https://images.unsplash.com/photo-1521417531039-75e91486cfbb?w=1200&q=80",
  ],
  Career: [
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80",
  ],
  Church: [
    "https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1200&q=80",
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80",
  ],
  Entertainment: [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80",
  ],
  Business: [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80",
  ],
};

const daysFromNow = (d: number, h = 18) => {
  const date = new Date();
  date.setDate(date.getDate() + d);
  date.setHours(h, 0, 0, 0);
  return date.toISOString();
};

export const EVENTS: CampusEvent[] = [
  {
    id: "hack-the-quad-2025",
    title: "Hack the Quad 2025",
    description: "36-hour campus hackathon with $10K in prizes and mentors from top startups.",
    longDescription:
      "Build, ship, and pitch in 36 hours. Free food, swag, and 1:1 mentorship from engineers at Vercel, Linear, and Supabase. Themes drop at opening ceremony. Solo or teams of up to 4.",
    category: "Tech",
    image: COVERS.Tech[0],
    location: "Engineering Quad, Building C",
    organizer: "CS Society",
    startsAt: daysFromNow(3, 9),
    attendees: 412,
    trending: true,
    tags: ["Hackathon", "Free Food", "Prizes"],
  },
  {
    id: "summer-internship-fair",
    title: "Summer Internship Fair",
    description: "60+ companies hiring interns across engineering, product, and design.",
    longDescription:
      "Meet recruiters from Google, Stripe, Anthropic, and dozens of high-growth startups. Bring 20 copies of your resume. Dress: smart casual. On-the-spot interviews available.",
    category: "Career",
    image: COVERS.Career[0],
    location: "Student Union, Grand Hall",
    organizer: "Career Services",
    startsAt: daysFromNow(7, 10),
    deadline: daysFromNow(2, 23),
    attendees: 1280,
    trending: true,
    tags: ["Internships", "Networking", "Resume"],
  },
  {
    id: "inter-faculty-cup",
    title: "Inter-Faculty Football Cup",
    description: "The yearly showdown. Engineering defends the title against Business.",
    longDescription:
      "Knockout rounds all weekend, finals under the lights Sunday night. Free entry, food trucks on the pitch.",
    category: "Sports",
    image: COVERS.Sports[0],
    location: "Main Stadium",
    organizer: "Athletics Union",
    startsAt: daysFromNow(5, 16),
    attendees: 890,
    trending: true,
    tags: ["Football", "Tournament"],
  },
  {
    id: "midweek-worship",
    title: "Midweek Worship Night",
    description: "Acoustic worship, prayer, and a short word. Everyone welcome.",
    longDescription: "Doors open 6:30pm. Worship starts 7pm sharp. Free coffee and snacks after.",
    category: "Church",
    image: COVERS.Church[0],
    location: "Chapel of St. Mark",
    organizer: "Campus Christian Fellowship",
    startsAt: daysFromNow(2, 19),
    attendees: 156,
    tags: ["Worship", "Community"],
  },
  {
    id: "battle-of-the-bands",
    title: "Battle of the Bands",
    description: "Eight student bands. One winner. Loud night guaranteed.",
    longDescription: "Headline slot at the spring festival on the line. Vote with the wristband app.",
    category: "Entertainment",
    image: COVERS.Entertainment[0],
    location: "The Backyard Amphitheatre",
    organizer: "Music Society",
    startsAt: daysFromNow(10, 20),
    attendees: 620,
    tags: ["Live Music", "Competition"],
  },
  {
    id: "founders-fireside",
    title: "Founders Fireside: Building in Public",
    description: "A candid conversation with three student founders who shipped real products.",
    longDescription:
      "Hear what worked, what burned, and how to pitch your first 10 users. Q&A and networking after.",
    category: "Business",
    image: COVERS.Business[0],
    location: "Innovation Hub, Room 204",
    organizer: "Entrepreneurship Club",
    startsAt: daysFromNow(4, 18),
    attendees: 220,
    tags: ["Startups", "Talk", "Q&A"],
  },
  {
    id: "google-step-deadline",
    title: "Google STEP Internship — Applications Open",
    description: "First-and-second-year SWE internship at Google. Apply before slots close.",
    longDescription:
      "12-week paid internship designed for underclassmen. Mentorship, real projects, and a path to future internships at Google.",
    category: "Career",
    image: COVERS.Career[1],
    location: "Remote / Online",
    organizer: "Google",
    startsAt: daysFromNow(1, 9),
    deadline: daysFromNow(1, 23),
    attendees: 3400,
    trending: true,
    tags: ["Internship", "Closing Soon"],
  },
  {
    id: "ai-builders-meetup",
    title: "AI Builders Meetup #7",
    description: "Lightning demos of student-built AI projects + free pizza.",
    longDescription: "Five demos, ten minutes each. Stay after for hands-on hacking corners.",
    category: "Tech",
    image: COVERS.Tech[1],
    location: "CS Lounge, 3rd Floor",
    organizer: "AI Society",
    startsAt: daysFromNow(6, 19),
    attendees: 180,
    tags: ["AI", "Demos", "Pizza"],
  },
  {
    id: "case-comp-mckinsey",
    title: "McKinsey Case Competition",
    description: "Top 3 teams get fast-tracked to McKinsey's recruiting pipeline.",
    longDescription:
      "Teams of 4 work a real case over a weekend, then pitch to a panel of McKinsey consultants.",
    category: "Business",
    image: COVERS.Business[1],
    location: "Business School Atrium",
    organizer: "Consulting Club",
    startsAt: daysFromNow(14, 9),
    deadline: daysFromNow(3, 23),
    attendees: 540,
    tags: ["Consulting", "Competition", "Recruiting"],
  },
  {
    id: "open-mic-friday",
    title: "Open Mic Friday",
    description: "Poetry, stand-up, songs — bring whatever you've been working on.",
    longDescription: "Sign up at the door from 7pm. Sets are 5 minutes. Be kind, be loud.",
    category: "Entertainment",
    image: COVERS.Entertainment[1],
    location: "The Common Room Café",
    organizer: "Arts Collective",
    startsAt: daysFromNow(8, 19),
    attendees: 95,
    tags: ["Open Mic", "Chill"],
  },
];

export const getEvent = (id: string) => EVENTS.find((e) => e.id === id);
