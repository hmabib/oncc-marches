"use client";
import { fmtInt, fmtPct, variation } from "@/lib/markets";

export function KpiCard({
  title, ref_, unit, cours, prev, fcfa, sub, spark, accent = "#0B6B3A", status,
}: {
  title: string; ref_: string; unit: string; cours: number; prev: number; fcfa: number;
  sub: string; spark: number[]; accent?: string; status: string;
}) {
  const v = variation(prev, cours);
  const up = v.abs >= 0;
  const pts = spark.map((x, i) => `${(i / Math.max(1, spark.length - 1)) * 100},${30 - ((x - Math.min(...spark)) / Math.max(1e-9, Math.max(...spark) - Math.min(...spark))) * 26}`).join(" ");
  return (
    <div className="card overflow-hidden">
      <div className="h-1.5" style={{ background: accent }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-oncc-muted">{title}</p>
            <p className="text-xs text-oncc-muted">{ref_}</p>
          </div>
          <span className={`badge ${up ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
            {up ? "▲" : "▼"} {fmtPct(v.pct)}
          </span>
        </div>
        <p className="kpi-num mt-2 text-2xl font-extrabold text-oncc-ink">
          {cours.toLocaleString("fr-FR", { maximumFractionDigits: cours < 1000 ? 2 : 0 })} <span className="text-sm font-semibold text-oncc-muted">{unit}</span>
        </p>
        <p className="text-xs text-oncc-muted">Veille : {prev.toLocaleString("fr-FR", { maximumFractionDigits: prev < 1000 ? 2 : 0 })} {unit} ({up ? "+" : ""}{fmtInt(v.abs)}).</p>
        <div className="mt-3 rounded-xl bg-oncc-cream px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-oncc-muted">Équivalent FCFA / kg</p>
          <p className="kpi-num text-xl font-extrabold text-oncc-green">{fmtInt(fcfa)} <span className="text-xs font-semibold">FCFA/kg</span></p>
        </div>
        <svg viewBox="0 0 100 32" className="mt-3 h-10 w-full" preserveAspectRatio="none">
          <polyline points={pts} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
        <p className="mt-1 text-[11px] text-oncc-muted">{sub}</p>
        <p className="mt-2"><span className="badge bg-amber-100 text-amber-900">{status}</span></p>
      </div>
    </div>
  );
}

export function SectionTitle({ kicker, title, desc }: { kicker: string; title: string; desc?: string }) {
  return (
    <div className="mb-4">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-oncc-green">{kicker}</p>
      <h1 className="text-2xl font-extrabold text-oncc-ink sm:text-3xl">{title}</h1>
      {desc && <p className="mt-1 max-w-3xl text-sm text-oncc-muted">{desc}</p>}
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <div className="card border-l-4 !border-l-oncc-gold bg-[#FFFBF0] p-4 text-sm text-oncc-ink/90">{children}</div>;
}
