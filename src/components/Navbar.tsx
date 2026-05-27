import { Link } from "@tanstack/react-router";
import { Radar, Search, Plus, User } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-bg shadow-lg shadow-violet-500/30 transition-transform group-hover:scale-105">
            <Radar className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Campus<span className="gradient-text">Radar</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          <NavLink to="/feed">Feed</NavLink>
          <NavLink to="/submit">Submit</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/feed"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
            aria-label="Search events"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            to="/submit"
            className="inline-flex items-center gap-1.5 rounded-full gradient-bg px-3.5 h-9 text-sm font-medium text-white shadow-lg shadow-violet-500/30 hover:opacity-95 transition"
          >
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Submit</span>
          </Link>
          <Link
            to="/profile"
            className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-accent transition-colors"
            aria-label="Profile"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="px-3 py-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
      activeProps={{ className: "text-foreground bg-accent" }}
    >
      {children}
    </Link>
  );
}
