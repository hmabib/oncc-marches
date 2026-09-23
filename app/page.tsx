"use client";
import { useMemo, useState } from "react";
import lon from "@/data/cacao-londres.json";
import ny from "@/data/cacao-newyork.json";
import ara from "@/data/cafe-arabica.json";
import rob from "@/data/cafe-robusta.json";
import fx from "@/data/changes.json";
import spot from "@/data/spot.json";
import veille from "@/data/veille.json";
import { KpiCard, SectionTitle, Note } from "@/components/ui";
import { PriceChart } from "@/components/charts";
import { gbpTonneToFcfaKg, usdTonneToFcfaKg, centsLbToFcfaKg, fmtInt, fmtDate, fmtPct, variation } from "@/lib/markets";
import Link from "next/link";

export default function Home() {
  const [range, setRange] = useState(90);
  const last = (s: any[]) => s[s.length - 1];
  const prev = (s: any[]) => s[s.length - 2];
  const L = last((lon as any).series), Lp = prev((lon as any).series);
  const N = last((ny as any).series), Np = prev((ny as any).series);
  const A = last((ara as any).series), Ap = prev((ara as any).series);
  const R = last((rob as any).series), Rp = prev((rob as any).series);
  const F = last((fx as any).series);
  const g = (fx as any).series[(fx as any).series.length - 2];

  const fcfaL = gbpTonneToFcfaKg(L.close, F.gbp_xaf);
  const fcfaN = usdTonneToFcfaKg(N.close, F.usd_xaf);
  const fcfaA = centsLbToFcfaKg(A.close, F.usd_xaf);
  const fcfaR = usdTonneToFcfaKg(R.close, F.usd_xaf);

  const spark = (s: any[]) => s.slice(-30).map((q) => q.close);
  const comp = useMemo(() => {
    const sl = (lon as any).series.slice(-range), sn = (ny as any).series.slice(-range);
    const sa = (ara as any).series.slice(-range), sr = (rob as any).series.slice(-range);
    const norm = (arr: any[]) => { const b = arr[0].close; return arr.map((q) => ({ date: q.date, v: (q.close / b) * 100 })); };
    const nl = norm(sl), nn = norm(sn), na = norm(sa), nr = norm(sr);
    return nl.map((p, i) => ({ date: p.date, Londres: +p.v.toFixed(2), NewYork: +nn[i].v.toFixed(2), Arabica: +na[i].v.toFixed(2), Robusta: +nr[i].v.toFixed(2) }));
  }, [range]);

  const rows = [
    { p: "Cacao — Londres", c: `${fmtInt(L.close)} GBP/t`, v: variation(Lp.close, L.close), f: `${fmtInt(fcfaL)} FCFA/kg`, s: "Règlement officiel DEC 26" },
    { p: "Cacao — New York", c: `${fmtInt(N.close)} USD/t`, v: variation(Np.close, N.close), f: `${fmtInt(fcfaN)} FCFA/kg`, s: "Règlement officiel DEC 26" },
    { p: "Arabica — Coffee C", c: `${A.close.toLocaleString("fr-FR")} ¢/lb`, v: variation(Ap.close, A.close), f: `${fmtInt(fcfaA)} FCFA/kg`, s: "Dernier cours SEP 26" },
    { p: "Robusta — Londres", c: `${fmtInt(R.close)} USD/t`, v: variation(Rp.close, R.close), f: `${fmtInt(fcfaR)} FCFA/kg`, s: "Dernier cours SEP 26" },
  ];
  const latest = (spot as any).grilles[(spot as any).grilles.length - 1];

  return (
    <div className="space-y-6">
      <SectionTitle
        kicker="Vue quotidienne — 22 septembre 2026"
        title="Les quatre références, leurs variations et leurs équivalents FCFA/kg"
        desc="Dernière actualisation : 22/09/2026 à 17h30 (Yaoundé). Données différées d'au moins 15 minutes. Achats, ventes et volumes affichés lorsque les droits souscrits le permettent ; à défaut, règlement officiel et dernier cours."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Cacao" ref_="ICE Futures Europe — Londres" unit="GBP/t" cours={L.close} prev={Lp.close} fcfa={fcfaL} accent="#5B3A1E" status="Données différées 15 min" sub={`Règlement officiel DEC 26 • Vol. ${L.volume.toLocaleString("fr-FR")}`} spark={spark((lon as any).series)} />
        <KpiCard title="Cacao" ref_="ICE Futures U.S. — New York" unit="USD/t" cours={N.close} prev={Np.close} fcfa={fcfaN} accent="#8A5A2B" status="Données différées 15 min" sub={`Règlement officiel DEC 26 • Vol. ${N.volume.toLocaleString("fr-FR")}`} spark={spark((ny as any).series)} />
        <KpiCard title="Café arabica" ref_="ICE Futures U.S. — Coffee C" unit="¢/lb" cours={A.close} prev={Ap.close} fcfa={fcfaA} accent="#0B6B3A" status="Données différées 15 min" sub={`Dernier cours SEP 26 • 1 lb = 0,45359237 kg`} spark={spark((ara as any).series)} />
        <KpiCard title="Café robusta" ref_="ICE Futures Europe — Robusta" unit="USD/t" cours={R.close} prev={Rp.close} fcfa={fcfaR} accent="#1E9E5A" status="Données différées 15 min" sub={`Dernier cours SEP 26 • Vol. ${R.volume.toLocaleString("fr-FR")}`} spark={spark((rob as any).series)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-bold text-oncc-ink">Comparaison normalisée — base 100</h2>
            <div className="flex gap-1">
              {[30, 90, 180, 262].map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`rounded-lg px-3 py-1 text-xs font-semibold ${range === r ? "bg-oncc-green text-white" : "bg-oncc-cream text-oncc-green"}`}>
                  {r === 262 ? "12 mois" : `${r} j`}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-1 text-xs text-oncc-muted">Évolution comparée des quatre références sur la période choisie. Période vérifiable complète : 22/09/2025 → 22/09/2026.</p>
          <div className="mt-2">
            <PriceChart data={comp} series={[
              { key: "Londres", name: "Cacao Londres (£/t)", color: "#5B3A1E" },
              { key: "NewYork", name: "Cacao New York ($/t)", color: "#B07C3B" },
              { key: "Arabica", name: "Arabica (¢/lb)", color: "#0B6B3A" },
              { key: "Robusta", name: "Robusta ($/t)", color: "#1E9E5A" },
            ]} height={300} />
          </div>
        </div>
        <div className="card p-4">
          <h2 className="font-bold text-oncc-ink">Changes BEAC & conversions</h2>
          <p className="text-xs text-oncc-muted">Fixing de référence 12h Yaoundé • EUR/XAF fixe 655,957</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between rounded-lg bg-oncc-cream px-3 py-2"><span>USD / XAF</span><strong className="kpi-num">{F.usd_xaf.toLocaleString("fr-FR")} ({fmtPct(((F.usd_xaf - g.usd_xaf) / g.usd_xaf) * 100)})</strong></div>
            <div className="flex justify-between rounded-lg bg-oncc-cream px-3 py-2"><span>GBP / XAF</span><strong className="kpi-num">{F.gbp_xaf.toLocaleString("fr-FR")} ({fmtPct(((F.gbp_xaf - g.gbp_xaf) / g.gbp_xaf) * 100)})</strong></div>
            <div className="flex justify-between rounded-lg bg-oncc-cream px-3 py-2"><span>GBP / USD</span><strong className="kpi-num">{F.gbp_usd.toLocaleString("fr-FR", { minimumFractionDigits: 4 })}</strong></div>
          </div>
          <div className="mt-3 rounded-xl border border-dashed border-oncc-green/40 p-3 text-xs leading-relaxed">
            <p className="font-bold text-oncc-green">Règles visibles (§5)</p>
            <p>£ ou $ par tonne → × taux XAF → ÷ 1 000. Arabica ¢/lb → ÷ 100 → ÷ 0,45359237 → × taux USD/XAF. Arrondi à l&apos;unité FCFA/kg. Une donnée absente n&apos;est jamais un zéro.</p>
          </div>
          <Link href="/conversions" className="btn btn-primary mt-3 w-full">Ouvrir le convertisseur</Link>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E7D2] p-4">
          <h2 className="font-bold text-oncc-ink">Tableau du jour — cours, variations, équivalents FCFA/kg</h2>
          <span className="badge bg-emerald-100 text-emerald-900">Flux opérationnel • dernière actualisation 22/09/2026 17:30 WAT</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-compact w-full">
            <thead><tr><th>Produit / référence</th><th>Dernier cours</th><th>Var. jour</th><th>Équiv. FCFA/kg</th><th>Statut</th><th>Contrat</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.p}>
                  <td className="font-semibold">{r.p}</td><td>{r.c}</td>
                  <td className={r.v.pct >= 0 ? "text-emerald-700 font-semibold" : "text-red-700 font-semibold"}>{fmtPct(r.v.pct)}</td>
                  <td className="font-bold text-oncc-green">{r.f}</td><td>{r.s}</td><td className="text-oncc-muted">Front continu</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-4 py-2 text-[11px] text-oncc-muted">Pour chaque cours : contrat et échéance, source, date, heure, fuseau, devise, unité et statut. En cas de flux interrompu, la dernière actualisation reste affichée avec un avertissement explicite.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-4">
          <h2 className="font-bold text-oncc-ink">Grille SPOT de référence — {fmtDate(latest.date)}</h2>
          <p className="text-xs text-oncc-muted">Prix physiques observés (Douala / Moungo) — distincts des prix calculés à terme.</p>
          <div className="mt-3 overflow-x-auto">
            <table className="table-compact w-full">
              <thead><tr><th>Produit</th><th>CIF (F/kg)</th><th>FOB (F/kg)</th><th>Achat min–max</th><th>Lieu</th></tr></thead>
              <tbody>
                <tr><td className="font-semibold">Cacao</td><td>{fmtInt(latest.cacao.cif)}</td><td>{fmtInt(latest.cacao.fob)}</td><td>{fmtInt(latest.cacao.achatMin)} – {fmtInt(latest.cacao.achatMax)}</td><td>{latest.cacao.lieu}</td></tr>
                <tr><td className="font-semibold">Arabica</td><td>{fmtInt(latest.arabica.cif)}</td><td>{fmtInt(latest.arabica.fob)}</td><td>—</td><td>—</td></tr>
                <tr><td className="font-semibold">Robusta</td><td>{fmtInt(latest.robusta.cif)}</td><td>{fmtInt(latest.robusta.fob)}</td><td>{fmtInt(latest.robusta.achatMin)} – {fmtInt(latest.robusta.achatMax)}</td><td>{latest.robusta.lieu}</td></tr>
              </tbody>
            </table>
          </div>
          <Link href="/grilles" className="btn btn-ghost mt-3">Voir la grille complète et les paramètres</Link>
        </div>
        <div className="card p-4">
          <h2 className="font-bold text-oncc-ink">Veille du jour</h2>
          <div className="mt-2 space-y-2">
            {(veille as any[]).slice(0, 3).map((n: any) => (
              <div key={n.titre} className="rounded-xl bg-oncc-cream p-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-oncc-green">{fmtDate(n.date)} • {n.source}</p>
                <p className="text-sm font-bold">{n.titre}</p>
                <p className="text-xs text-oncc-muted">{n.texte.slice(0, 140)}…</p>
              </div>
            ))}
          </div>
          <Link href="/veille" className="btn btn-ghost mt-3">Toutes les actualités et rapports</Link>
        </div>
      </div>

      <Note>
        <strong>Qualité des données :</strong> historiques quotidiens du 22/09/2025 au 22/09/2026 (262 séances), séries continues par
        raccordement des contrats, conversions recalculables indépendamment. Points d&apos;ancrage vérifiables : ICE du 04/09/2026
        (Londres SEP 4 393 £, DEC 4 520 £ ; New York SEP 6 049 $, DEC 6 175 $), BEAC du 03/09/2026 (USD 563,61/568,45 — GBP 758,80/766,51),
        ONCC des 24 et 28/08/2026 (cacao CIF 3 234 puis 3 470 F/kg). <Link href="/historiques" className="font-bold text-oncc-green underline">Vérifier dans Historiques & exports</Link>.
      </Note>
    </div>
  );
}
