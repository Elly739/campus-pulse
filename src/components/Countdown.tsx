import { useEffect, useState } from "react";

function diff(target: string) {
  const ms = new Date(target).getTime() - Date.now();
  if (ms <= 0) return null;
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export function Countdown({ target, compact = false }: { target: string; compact?: boolean }) {
  const [t, setT] = useState(() => diff(target));
  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!t) return <span className="text-muted-foreground">Started</span>;

  if (compact) {
    if (t.d > 0) return <span>{t.d}d {t.h}h</span>;
    if (t.h > 0) return <span>{t.h}h {t.m}m</span>;
    return <span>{t.m}m {t.s}s</span>;
  }

  return (
    <div className="flex items-center gap-2 font-mono text-sm">
      <Unit n={t.d} l="d" />
      <Sep />
      <Unit n={t.h} l="h" />
      <Sep />
      <Unit n={t.m} l="m" />
      <Sep />
      <Unit n={t.s} l="s" />
    </div>
  );
}

const Unit = ({ n, l }: { n: number; l: string }) => (
  <div className="flex items-baseline gap-0.5">
    <span className="text-foreground tabular-nums">{String(n).padStart(2, "0")}</span>
    <span className="text-muted-foreground text-xs">{l}</span>
  </div>
);
const Sep = () => <span className="text-muted-foreground/50">:</span>;
