"use client";
import { useMemo, useState } from "react";
import ara from "@/data/cafe-arabica.json";
import rob from "@/data/cafe-robusta.json";
import fx from "@/data/changes.json";
import ech from "@/data/echeances.json";
import { SectionTitle, Note } from "@/components/ui";
import { PriceChart } from "@/components/charts";
import { centsLbToFcfaKg, usdTonneToFcfaKg, fmtInt, fmtDate, stats } from "@/lib/markets";

export default function Cafe() {
  const [fam, setFam] = useState<"ara" | "rob">("ara");
  const [range, setRange] = useState(180);
  const [eche, setEche] = useState(0);
  const series = fam === "ara" ? (ara as any).series : (rob as any).series;
  const meta = fam === "ara" ? (ara as any).meta : (rob as any).meta;
  const list = fam === "ara" ? (ech as any).arabica : (ech as any).robusta;
  const F = (fx as any).series[(fx as any).series.length - 1];
  const unit = fam === "ara" ? "¢/lb" : "$/t";

  const data = useMemo(() => series.slice(-range).map((q: any) => {
    const f = (fx as any).series.find((x: any) => x.date === q.date) ?? F;
    const fcfa = fam === "ara" ? centsLbToFcfaKg(q.close, f.usd_xaf) : usdTonneToFcfaKg(q.close, f.usd_xaf);
    return { date: q.date, Cours: q.close, FCFAkg: Math.round(fcfa) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [fam, range]);

  const st = stats(series.slice(-range));
  const sel = list[eche];
  const fcfaSel = fam === "ara" ? centsLbToFcfaKg(sel.cours, F.usd_xaf) : usdTonneToFcfaKg(sel.cours, F.usd_xaf);
  const f2 = (v: number) => v.toLocaleString("fr-FR", { minimumFractionDigits: fam === "ara" ? 2 : 0, maximumFractionDigits: fam === "ara" ? 2 : 0 });

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Café — ICE" title="Arabica Coffee C (¢/lb) et Robusta Londres ($/t)"
        desc="Attention aux unités natives : l'arabica se cote en cents USD par livre, le robusta en USD par tonne. Les deux sont ramenés en FCFA/kg par la même règle BEAC." />
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setFam("ara")} className={`btn ${fam === "ara" ? "btn-primary" : "btn-ghost"}`}>Arabica — Coffee C, New York (¢/lb)</button>
        <button onClick={() => setFam("rob")} className={`btn ${fam === "rob" ? "btn-primary" : "btn-ghost"}`}>Robusta — ICE Europe ($/t)</button>
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
          <div className="mt-2"><PriceChart data={data} series={[{ key: "Cours", name: `Cours (${unit})`, color: "#0B6B3A" }]} height={320} /></div>
          <div className="mt-2"><PriceChart data={data} series={[{ key: "FCFAkg", name: "Équivalent FCFA/kg", color: "#E9A426" }]} height={180} /></div>
          {fam === "ara" && (
            <p className="mt-2 rounded-xl bg-oncc-cream p-3 text-xs">Conversion arabica : <strong>¢/lb ÷ 100 ÷ 0,45359237 × USD/XAF</strong>. Exemple du jour : {f2(series[series.length-1].close)} ¢ → {fmtInt(centsLbToFcfaKg(series[series.length-1].close, F.usd_xaf))} FCFA/kg.</p>
          )}
        </div>
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-bold">Échéances au 22/09/2026</h3>
            <div className="mt-2 space-y-1.5">
              {list.map((e: any, i: number) => (
                <button key={e.echeance} onClick={() => setEche(i)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm ${i === eche ? "bg-oncc-green text-white" : "bg-oncc-cream"}`}>
                  <span className="font-bold">{e.echeance}</span>
                  <span className="kpi-num">{f2(e.cours)} {unit}</span>
                  <span className="text-[11px] opacity-80">{e.statut}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 rounded-xl bg-oncc-cream p-3 text-sm">
              <p className="text-xs uppercase tracking-wider text-oncc-muted">Échéance sélectionnée</p>
              <p className="text-lg font-extrabold">{sel.echeance} — {f2(sel.cours)} {unit}</p>
              <p className="font-bold text-oncc-green">≈ {fmtInt(fcfaSel)} FCFA/kg</p>
            </div>
          </div>
          <div className="card p-4 text-sm">
            <h3 className="font-bold">Statistiques de période</h3>
            {st && (
              <ul className="mt-2 space-y-1.5">
                <li className="flex justify-between"><span>Plus haut</span><strong className="kpi-num">{f2(st.max)}</strong></li>
                <li className="flex justify-between"><span>Plus bas</span><strong className="kpi-num">{f2(st.min)}</strong></li>
                <li className="flex justify-between"><span>Moyenne</span><strong className="kpi-num">{f2(st.avg)}</strong></li>
                <li className="flex justify-between"><span>Performance</span><strong className={st.perf >= 0 ? "text-emerald-700" : "text-red-700"}>{st.perf.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} %</strong></li>
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
            <tr key={q.date}><td className="font-semibold">{fmtDate(q.date)}</td><td>{f2(q.open)}</td><td>{f2(q.high)}</td><td>{f2(q.low)}</td><td className="font-bold">{f2(q.close)}</td><td>{q.volume.toLocaleString("fr-FR")}</td></tr>
          ))}</tbody>
        </table></div>
      </div>
      <Note>Repères vérifiables 2026 : robusta SEP 3 347 $ (30/05), 3 629 $ (18/06), 3 849 $ (14/07), 3 708 $ (23/07), 3 891 $ (05/08) ; arabica SEP 258,70 ¢ (30/05), 275,10 ¢ (18/06), 309,40 ¢ (23/07), 323,05 ¢ (30/07), 326,90 ¢ (05/08).</Note>
    </div>
  );
}
