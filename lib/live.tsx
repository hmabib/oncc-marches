"use client";
import { useEffect, useState } from "react";

export type LiveData = {
  fetchedAt: string;
  sources: Record<string, string>;
  oncc: { ok: boolean; data?: any; error?: string };
  quotes: {
    cacaoNY: { ok: boolean; data?: any; error?: string };
    arabica: { ok: boolean; data?: any; error?: string };
    usdXaf: { ok: boolean; data?: any; error?: string };
    gbpXaf: { ok: boolean; data?: any; error?: string };
  };
  news: { cacao: { ok: boolean; data?: any }; cafe: { ok: boolean; data?: any } };
};

let cache: { at: number; data: LiveData } | null = null;

export function useLive() {
  const [live, setLive] = useState<LiveData | null>(cache?.data ?? null);
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    if (cache && Date.now() - cache.at < 10 * 60 * 1000) {
      setLive(cache.data);
      setLoading(false);
      return;
    }
    fetch("/api/live")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d) => {
        cache = { at: Date.now(), data: d };
        setLive(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);
  return { live, loading };
}

export function LiveBadge({ ok, label }: { ok: boolean; label?: string }) {
  if (ok)
    return (
      <span className="badge bg-emerald-600 text-white shadow-sm">
        <span className="relative flex h-2 w-2"><span className="absolute h-full w-full animate-ping rounded-full bg-white opacity-75" /><span className="h-2 w-2 rounded-full bg-white" /></span>
        EN DIRECT{label ? ` • ${label}` : ""}
      </span>
    );
  return <span className="badge bg-amber-100 text-amber-900 ring-1 ring-amber-300">RÉFÉRENCE VÉRIFIÉE</span>;
}

export function SourceLine({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-[11px] text-oncc-green underline decoration-dotted underline-offset-2 hover:text-oncc-deepgreen">
      {children} ↗
    </a>
  );
}
