"use client";
import { useMemo, useState } from "react";
import lon from "@/data/cacao-londres.json";
import ny from "@/data/cacao-newyork.json";
import fx from "@/data/changes.json";
import ech from "@/data/echeances.json";
import { SectionTitle, Note } from "@/components/ui";
import { PriceChart } from "@/components/charts";
import { gbpTonneToFcfaKg, usdTonneToFcfaKg, fmtInt, fmtDate, stats } from "@/lib/markets";

export default function Cacao() {
  const [fam, setFam] = useState<"lon" | "ny">("lon");
  const [range, setRange] = useState(180);
  const [eche, setEche] = useState(1);
  const series = fam === "lon" ? (lon as any).series : (ny as any).series;
  const meta = fam === "lon" ? (lon as any).meta : (ny as any).meta;
  const list = fam === "lon" ? (ech as any).cacaoLondres : (ech as any).cacaoNewYork;
  const F = (fx as any).series[(fx as any).series.length - 1];

  const data = useMemo(() => series.slice(-range).map((q: any, i: number, arr: any[]) => {
    const f = (fx as any).series.find((x: any) => x.date === q.date) ?? F;
    const fcfa = fam === "lon" ? gbpTonneToFcfaKg(q.close, f.gbp_xaf) : usdTonneToFcfaKg(q.close, f.usd_xaf);
    return { date: q.date, Cours: q.close, FCFAkg: Math.round(fcfa) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [fam, range]);

  const st = stats(series.slice(-range));
  const sel = list[eche];
  const fcfaSel = fam === "lon" ? gbpTonneToFcfaKg(sel.cours, F.gbp_xaf) : usdTonneToFcfaKg(sel.cours, F.usd_xaf);

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Cacao — ICE Futures" title="Londres (£/t) et New York ($/t) : échéances, graphiques, comparaisons"
        desc="Onglets par famille, échéances sélectionnables, graphiques et comparaisons sur la période choisie. Règlement officiel, dernier cours et cours différé distingués." />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFam("lon")} className={`btn ${fam === "lon" ? "btn-primary" : "btn-ghost"}`}>Londres — ICE Futures Europe (£/t)</button>
        <button onClick={() => setFam("ny")} className={`btn ${fam === "ny" ? "btn-primary" : "btn-ghost"}`}>New York — ICE Futures U.S. ($/t)</button>
        <div className="ml-auto flex gap-1">
          {[30, 90, 180, 262].map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${range === r ? "bg-oncc-ink text-white" : "bg-white text-oncc-ink border"}`}>{r === 262 ? "12 mois" : `${r} j`}</button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <h2 className="font-bold">{meta.reference} — {meta.unite}</h2>
          <p className="text-xs text-oncc-muted">{meta.source} • {meta.fuseau} • {meta.statut}</p>
          <div className="mt-2"><PriceChart data={data} series={[{ key: "Cours", name: `Cours (${fam === "lon" ? "£/t" : "$/t"})`, color: "#5B3A1E" }]} height={320} /></div>
          <div className="mt-2"><PriceChart data={data} series={[{ key: "FCFAkg", name: "Équivalent FCFA/kg", color: "#0B6B3A" }]} height={180} /></div>
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-bold">Échéances au 22/09/2026</h3>
            <div className="mt-2 space-y-1.5">
              {list.map((e: any, i: number) => (
                <button key={e.echeance} onClick={() => setEche(i)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${i === eche ? "bg-oncc-green text-white" : "bg-oncc-cream"}`}>
                  <span className="font-bold">{e.echeance}</span>
                  <span className="kpi-num">{e.cours.toLocaleString("fr-FR")} {fam === "lon" ? "£" : "$"}/t</span>
                  <span className="text-[11px] opacity-80">{e.statut}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-oncc-cream p-3 text-sm">
              <p className="text-xs uppercase tracking-wider text-oncc-muted">Échéance sélectionnée</p>
              <p className="text-lg font-extrabold">{sel.echeance} — {sel.cours.toLocaleString("fr-FR")} {fam === "lon" ? "£" : "$"}/t</p>
              <p className="font-bold text-oncc-green">≈ {fmtInt(fcfaSel)} FCFA/kg <span className="text-xs font-normal text-oncc-muted">(taux BEAC du 22/09/2026)</span></p>
            </div>
          </div>
          <div className="card p-4 text-sm">
            <h3 className="font-bold">Statistiques de période</h3>
            {st && (
              <ul className="mt-2 space-y-1.5">
                <li className="flex justify-between"><span>Plus haut</span><strong className="kpi-num">{fmtInt(st.max)}</strong></li>
                <li className="flex justify-between"><span>Plus bas</span><strong className="kpi-num">{fmtInt(st.min)}</strong></li>
                <li className="flex justify-between"><span>Moyenne</span><strong className="kpi-num">{fmtInt(st.avg)}</strong></li>
                <li className="flex justify-between"><span>Performance</span><strong className={st.perf >= 0 ? "text-emerald-700" : "text-red-700"}>{st.perf.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} %</strong></li>
                <li className="flex justify-between"><span>Volatilité annualisée</span><strong className="kpi-num">{st.vol.toLocaleString("fr-FR", { minimumFractionDigits: 1 })} %</strong></li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-[#F0E7D2] p-4"><h2 className="font-bold">Dix dernières séances — {meta.reference}</h2></div>
        <div className="overflow-x-auto"><table className="table-compact w-full">
          <thead><tr><th>Date</th><th>Ouv.</th><th>Haut</th><th>Bas</th><th>Clôture / règlement</th><th>Volume</th></tr></thead>
          <tbody>{series.slice(-10).reverse().map((q: any) => (
            <tr key={q.date}><td className="font-semibold">{fmtDate(q.date)}</td><td>{fmtInt(q.open)}</td><td>{fmtInt(q.high)}</td><td>{fmtInt(q.low)}</td><td className="font-bold">{fmtInt(q.close)}</td><td>{q.volume.toLocaleString("fr-FR")}</td></tr>
          ))}</tbody>
        </table></div>
      </div>
      <Note>Méthode des séries continues : raccordement des contrats front-month à chaque roulement, sans recalcul rétroactif du passé. Les écarts de roulement sont documentés dans « Historiques & exports ». Période couverte : 22/09/2025 → 22/09/2026 (262 séances).</Note>
    </div>
  );
}
