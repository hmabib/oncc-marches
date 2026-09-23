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

export default function Conversions() {
  const F = (fx as any).series[(fx as any).series.length - 1];
  const [usd, setUsd] = useState(F.usd_xaf);
  const [gbp, setGbp] = useState(F.gbp_xaf);
  const [montant, setMontant] = useState(4465);
  const [unite, setUnite] = useState<"gbpT" | "usdT" | "clb">("gbpT");

  const res = unite === "gbpT" ? gbpTonneToFcfaKg(montant, gbp) : unite === "usdT" ? usdTonneToFcfaKg(montant, usd) : centsLbToFcfaKg(montant, usd);

  const L = (lon as any).series.at(-1).close, N = (ny as any).series.at(-1).close;
  const A = (ara as any).series.at(-1).close, R = (rob as any).series.at(-1).close;
  const rows = [
    { p: "Cacao Londres", c: `${fmtInt(L)} GBP/t`, f: gbpTonneToFcfaKg(L, gbp), rule: "× GBP/XAF ÷ 1 000" },
    { p: "Cacao New York", c: `${fmtInt(N)} USD/t`, f: usdTonneToFcfaKg(N, usd), rule: "× USD/XAF ÷ 1 000" },
    { p: "Arabica Coffee C", c: `${A.toLocaleString("fr-FR")} ¢/lb`, f: centsLbToFcfaKg(A, usd), rule: "÷ 100 ÷ 0,45359237 × USD/XAF" },
    { p: "Robusta", c: `${fmtInt(R)} USD/t`, f: usdTonneToFcfaKg(R, usd), rule: "× USD/XAF ÷ 1 000" },
  ];

  const fxData = useMemo(() => (fx as any).series.slice(-180).map((x: any) => ({ date: x.date, USDXAF: x.usd_xaf, GBPXAF: x.gbp_xaf })), []);

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Changes & conversions" title="Cours d'origine et équivalents en FCFA par kilogramme"
        desc="Taux utilisé, date de référence et règles d'arrondi visibles sur chaque conversion. Taux modifiables pour simulation — la valeur BEAC du jour reste rappelée." />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="font-bold">Convertisseur interactif</h2>
          <p className="text-xs text-oncc-muted">Référence BEAC du 22/09/2026 : USD {F.usd_xaf.toLocaleString("fr-FR")} • GBP {F.gbp_xaf.toLocaleString("fr-FR")} • EUR 655,957 (fixe)</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div><label className="label">Type de cotation</label>
              <select className="input" value={unite} onChange={(e) => setUnite(e.target.value as any)}>
                <option value="gbpT">GBP par tonne (cacao Londres)</option>
                <option value="usdT">USD par tonne (cacao NY / robusta)</option>
                <option value="clb">Cents USD par livre (arabica)</option>
              </select></div>
            <div><label className="label">Cours d&apos;origine</label>
              <input className="input kpi-num" type="number" step="any" value={montant} onChange={(e) => setMontant(Number(e.target.value))} /></div>
            <div><label className="label">Taux USD / XAF (modifiable)</label>
              <input className="input kpi-num" type="number" step="any" value={usd} onChange={(e) => setUsd(Number(e.target.value))} /></div>
            <div><label className="label">Taux GBP / XAF (modifiable)</label>
              <input className="input kpi-num" type="number" step="any" value={gbp} onChange={(e) => setGbp(Number(e.target.value))} /></div>
          </div>
          <div className="mt-4 rounded-2xl bg-oncc-deepgreen p-4 text-white">
            <p className="text-xs uppercase tracking-wider text-white/70">Résultat — arrondi à l&apos;unité</p>
            <p className="kpi-num text-3xl font-extrabold">{fmtInt(res)} <span className="text-sm font-semibold">FCFA/kg</span></p>
            <p className="mt-1 text-xs text-white/70">{unite === "clb" ? "Formule : cours ÷ 100 ÷ 0,45359237 × USD/XAF" : unite === "gbpT" ? "Formule : cours × GBP/XAF ÷ 1 000" : "Formule : cours × USD/XAF ÷ 1 000"}</p>
          </div>
          <button className="btn btn-ghost mt-3" onClick={() => { setUsd(F.usd_xaf); setGbp(F.gbp_xaf); }}>Rétablir les taux BEAC du jour</button>
        </div>

        <div className="card p-5">
          <h2 className="font-bold">Conversions du jour — 22/09/2026</h2>
          <div className="mt-3 overflow-x-auto"><table className="table-compact w-full">
            <thead><tr><th>Produit</th><th>Cours d&apos;origine</th><th>Équiv. FCFA/kg</th><th>Règle</th></tr></thead>
            <tbody>{rows.map((r) => (
              <tr key={r.p}><td className="font-semibold">{r.p}</td><td>{r.c}</td><td className="font-bold text-oncc-green">{fmtInt(r.f)}</td><td className="text-xs text-oncc-muted">{r.rule}</td></tr>
            ))}</tbody>
          </table></div>
          <p className="mt-2 text-[11px] text-oncc-muted">Date de référence des taux : 22/09/2026, fixing 12h Yaoundé. Source : BEAC (ancrage du 03/09/2026 : USD 563,61/568,45 — GBP 758,80/766,51).</p>
          <h3 className="mt-4 font-bold">Historique des changes (180 jours)</h3>
          <PriceChart data={fxData} series={[{ key: "USDXAF", name: "USD/XAF", color: "#0B6B3A" }, { key: "GBPXAF", name: "GBP/XAF", color: "#B07C3B" }]} height={200} />
        </div>
      </div>

      <div className="card p-5 text-sm leading-relaxed">
        <h2 className="font-bold">Méthode de raccordement des contrats (séries continues)</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-oncc-ink/90">
          <li>Front continu : à chaque échéance, bascule sur le contrat suivant sans réécrire le passé ; l&apos;écart de roulement est tracé mais non lissé.</li>
          <li>Distinction stricte : <strong>dernier cours</strong> (séance en cours), <strong>règlement officiel</strong> (clôture compensée), <strong>cours différé</strong> (≥ 15 min).</li>
          <li>Chaque export rappelle : contrat, échéance, source, date, heure, fuseau, devise, unité, statut et taux de change utilisé.</li>
          <li>Une donnée absente reste affichée « — » avec avertissement ; elle ne devient jamais zéro.</li>
        </ul>
      </div>
    </div>
  );
}
