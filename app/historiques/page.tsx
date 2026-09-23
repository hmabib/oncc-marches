"use client";
import { useMemo, useState } from "react";
import lon from "@/data/cacao-londres.json";
import ny from "@/data/cacao-newyork.json";
import ara from "@/data/cafe-arabica.json";
import rob from "@/data/cafe-robusta.json";
import fx from "@/data/changes.json";
import { SectionTitle } from "@/components/ui";
import { PriceChart } from "@/components/charts";
import { gbpTonneToFcfaKg, usdTonneToFcfaKg, centsLbToFcfaKg, fmtInt, fmtDate } from "@/lib/markets";
import { downloadCSV, downloadExcel, downloadPDF } from "@/lib/exports";

const PRODS = [
  { id: "lon", label: "Cacao — Londres (£/t)" },
  { id: "ny", label: "Cacao — New York ($/t)" },
  { id: "ara", label: "Arabica — Coffee C (¢/lb)" },
  { id: "rob", label: "Robusta ($/t)" },
];

export default function Historiques() {
  const [prod, setProd] = useState("lon");
  const [from, setFrom] = useState("2026-06-01");
  const [to, setTo] = useState("2026-09-22");
  const [msg, setMsg] = useState("");

  const bundle: any = { lon, ny, ara, rob };
  const series: any[] = bundle[prod].series;
  const meta = bundle[prod].meta;

  const rows = useMemo(() => series.filter((q) => q.date >= from && q.date <= to).map((q: any) => {
    const f = (fx as any).series.find((x: any) => x.date === q.date);
    const fcfa = !f ? null : prod === "lon" ? gbpTonneToFcfaKg(q.close, f.gbp_xaf) : prod === "ny" || prod === "rob" ? usdTonneToFcfaKg(q.close, f.usd_xaf) : centsLbToFcfaKg(q.close, f.usd_xaf);
    return { ...q, usd: f?.usd_xaf ?? null, gbp: f?.gbp_xaf ?? null, fcfa };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [prod, from, to]);

  const chart = rows.map((r) => ({ date: r.date, Cloture: r.close, FCFAkg: r.fcfa ? Math.round(r.fcfa) : null }));
  const unit = prod === "lon" ? "GBP/t" : prod === "ara" ? "¢/lb" : "USD/t";
  const fname = `ONCC_${prod}_${from}_${to}`;

  const head = ["Date", `Clôture (${unit})`, "Ouv.", "Haut", "Bas", "Volume", "USD/XAF", "GBP/XAF", "Équiv. FCFA/kg"];
  const body = rows.map((r) => [r.date, r.close, r.open, r.high, r.low, r.volume, r.usd ?? "—", r.gbp ?? "—", r.fcfa == null ? "—" : Math.round(r.fcfa)]);
  const subtitle = `${meta.reference} • ${meta.unite} • ${from} → ${to} • ${meta.source} • Taux BEAC • Édité le 22/09/2026 — ONCC/KOUABA AGENCY`;

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Historiques & exports" title="Sélection par produit et période — Excel, CSV, PDF"
        desc="Cible : cinq ans de cours quotidiens selon séries disponibles. Ici : 12 mois vérifiables (262 séances). Chaque extraction rappelle source, date, unité et taux." />
      <div className="card flex flex-wrap items-end gap-3 p-4">
        <div><label className="label">Produit</label>
          <select className="input min-w-[240px]" value={prod} onChange={(e) => setProd(e.target.value)}>
            {PRODS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select></div>
        <div><label className="label">Du</label><input type="date" className="input" min="2025-09-22" max="2026-09-22" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
        <div><label className="label">Au</label><input type="date" className="input" min="2025-09-22" max="2026-09-22" value={to} onChange={(e) => setTo(e.target.value)} /></div>
        <span className="badge bg-oncc-cream text-oncc-ink">{rows.length} séances</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={() => { downloadExcel(`${fname}.xlsx`, prod, [head, ...body]); setMsg(`Export Excel généré : ${rows.length} lignes.`); }}>Excel</button>
          <button className="btn btn-gold" onClick={() => { downloadCSV(`${fname}.csv`, [head, ...body]); setMsg(`Export CSV généré : ${rows.length} lignes.`); }}>CSV</button>
          <button className="btn btn-ghost" onClick={async () => { await downloadPDF(`${fname}.pdf`, `ONCC — ${meta.reference}`, subtitle, head, body); setMsg(`Export PDF généré : ${rows.length} lignes.`); }}>PDF</button>
        </div>
      </div>
      {msg && <p className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-900">{msg}</p>}

      <div className="card p-4">
        <h2 className="font-bold">{meta.reference} — {fmtDate(from)} → {fmtDate(to)}</h2>
        <PriceChart data={chart} series={[{ key: "Cloture", name: `Clôture (${unit})`, color: "#5B3A1E" }]} height={300} />
      </div>

      <div className="card overflow-hidden">
        <div className="max-h-[420px] overflow-auto">
          <table className="table-compact w-full">
            <thead className="sticky top-0 bg-white"><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{rows.slice().reverse().map((r) => (
              <tr key={r.date}><td className="font-semibold">{fmtDate(r.date)}</td><td className="font-bold">{r.close.toLocaleString("fr-FR")}</td><td>{r.open.toLocaleString("fr-FR")}</td><td>{r.high.toLocaleString("fr-FR")}</td><td>{r.low.toLocaleString("fr-FR")}</td><td>{r.volume.toLocaleString("fr-FR")}</td><td>{r.usd ?? "—"}</td><td>{r.gbp ?? "—"}</td><td className="font-bold text-oncc-green">{r.fcfa == null ? "—" : fmtInt(r.fcfa)}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
