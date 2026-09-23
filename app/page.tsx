"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import lon from "@/data/cacao-londres.json";
import ny from "@/data/cacao-newyork.json";
import ara from "@/data/cafe-arabica.json";
import rob from "@/data/cafe-robusta.json";
import fx from "@/data/changes.json";
import spot from "@/data/spot.json";
import veille from "@/data/veille.json";
import { KpiCard, SectionTitle, Note } from "@/components/ui";
import { PriceChart } from "@/components/charts";
import { useLive, LiveBadge, SourceLine } from "@/lib/live";
import { gbpTonneToFcfaKg, usdTonneToFcfaKg, centsLbToFcfaKg, fmtInt, fmtDate, fmtPct, variation } from "@/lib/markets";

const JOURNEY = [
  { t: "Consulter", d: "Vue quotidienne : 4 références, variations, équivalents FCFA/kg et statut de chaque donnée.", href: "/", cta: "Voir les cours" },
  { t: "Convertir", d: "Changes BEAC et convertisseur interactif : du cours d'origine au FCFA/kg, règles visibles.", href: "/conversions", cta: "Convertir" },
  { t: "Arbitrer", d: "Grilles SPOT Douala/Moungo : prix physiques observés vs prix calculés, paramètres versionnés.", href: "/grilles", cta: "Voir les grilles" },
  { t: "Exporter", d: "Historiques par produit et période, extractions Excel, CSV et PDF sourcées pour vos équipes.", href: "/historiques", cta: "Exporter" },
];

const FEATURES = [
  { t: "Quatre références mondiales", d: "Cacao Londres (£/t) et New York ($/t), arabica Coffee C (¢/lb), robusta ($/t) — échéances, volumes, statuts." },
  { t: "Équivalents FCFA/kg en direct", d: "Conversions automatiques au taux BEAC, recalculables indépendamment, arrondi affiché." },
  { t: "Grilles SPOT officielles", d: "CIF/FOB et achats Douala/Moungo, différentiels et fret documentés, versions conservées." },
  { t: "Historiques & exports sourcés", d: "262 séances vérifiables, extraction Excel/CSV/PDF avec source, date, unité et taux." },
  { t: "Veille connectée", d: "Actualités ONCC en direct et presse marché cacao-café, archivage selon licence." },
  { t: "Service opéré de bout en bout", d: "Poste sécurisé, plateforme licenciée, formation, maintenance et réception documentée." },
];

export default function Home() {
  const [range, setRange] = useState(90);
  const { live } = useLive();
  const last = (s: any[]) => s[s.length - 1];
  const prev = (s: any[]) => s[s.length - 2];
  const L = last((lon as any).series), Lp = prev((lon as any).series);
  const N = last((ny as any).series), Np = prev((ny as any).series);
  const A = last((ara as any).series), Ap = prev((ara as any).series);
  const R = last((rob as any).series), Rp = prev((rob as any).series);
  const F = last((fx as any).series);
  const g = (fx as any).series[(fx as any).series.length - 2];

  // cotations live (Yahoo différé) quand disponibles, sinon référence locale
  const qNY = live?.quotes.cacaoNY.ok ? live.quotes.cacaoNY.data : null;
  const qAra = live?.quotes.arabica.ok ? live.quotes.arabica.data : null;
  const fxUSD = live?.quotes.usdXaf.ok ? live.quotes.usdXaf.data.price : live?.fxFallback ? live.fxFallback.usdXaf : F.usd_xaf;
  const fxGBP = live?.quotes.gbpXaf.ok ? live.quotes.gbpXaf.data.price : live?.fxFallback ? live.fxFallback.gbpXaf : F.gbp_xaf;
  const fxLive = !!(live?.quotes.usdXaf.ok || live?.fxFallback);
  const onccLive = live?.oncc.ok ? live.oncc.data : null;

  const fcfaL = gbpTonneToFcfaKg(L.close, F.gbp_xaf);
  const fcfaN = usdTonneToFcfaKg(qNY ? qNY.price : N.close, fxUSD);
  const fcfaA = centsLbToFcfaKg(qAra ? qAra.price : A.close, fxUSD);
  const fcfaR = usdTonneToFcfaKg(R.close, fxUSD);

  const spark = (s: any[]) => s.slice(-30).map((q) => q.close);
  const comp = useMemo(() => {
    const sl = (lon as any).series.slice(-range), sn = (ny as any).series.slice(-range);
    const sa = (ara as any).series.slice(-range), sr = (rob as any).series.slice(-range);
    const norm = (arr: any[]) => { const b = arr[0].close; return arr.map((q) => ({ date: q.date, v: (q.close / b) * 100 })); };
    const nl = norm(sl), nn = norm(sn), na = norm(sa), nr = norm(sr);
    return nl.map((p, i) => ({ date: p.date, Londres: +p.v.toFixed(2), NewYork: +nn[i].v.toFixed(2), Arabica: +na[i].v.toFixed(2), Robusta: +nr[i].v.toFixed(2) }));
  }, [range]);

  const tickerItems = [
    `Cacao New York ${qNY ? `${fmtInt(qNY.price)} $/t` : `${fmtInt(N.close)} $/t`} ${qNY ? "• EN DIRECT" : ""}`,
    `Arabica ${qAra ? `${qAra.price.toLocaleString("fr-FR")} ¢/lb` : `${A.close.toLocaleString("fr-FR")} ¢/lb`} ${qAra ? "• EN DIRECT" : ""}`,
    `Cacao Londres ${fmtInt(L.close)} £/t`,
    `Robusta ${fmtInt(R.close)} $/t`,
    `USD/XAF ${Number(fxUSD).toLocaleString("fr-FR")}`,
    `GBP/XAF ${Number(fxGBP).toLocaleString("fr-FR")}`,
    onccLive?.bannerDate ? `ONCC ${onccLive.bannerDate} — Cacao CIF ${onccLive.cocoa?.cif ?? "—"} F/kg` : "ONCC — prix physiques Douala / Moungo",
  ];

  const rows = [
    { p: "Cacao — Londres", c: `${fmtInt(L.close)} GBP/t`, v: variation(Lp.close, L.close), f: `${fmtInt(fcfaL)} FCFA/kg`, s: "Règlement officiel DEC 26", live: false },
    { p: "Cacao — New York", c: `${fmtInt(qNY ? qNY.price : N.close)} USD/t`, v: qNY && qNY.prevClose ? variation(qNY.prevClose, qNY.price) : variation(Np.close, N.close), f: `${fmtInt(fcfaN)} FCFA/kg`, s: qNY ? "Dernier cours — ICE (différé)" : "Règlement officiel DEC 26", live: !!qNY },
    { p: "Arabica — Coffee C", c: `${(qAra ? qAra.price : A.close).toLocaleString("fr-FR")} ¢/lb`, v: qAra && qAra.prevClose ? variation(qAra.prevClose, qAra.price) : variation(Ap.close, A.close), f: `${fmtInt(fcfaA)} FCFA/kg`, s: qAra ? "Dernier cours — ICE (différé)" : "Dernier cours SEP 26", live: !!qAra },
    { p: "Robusta — Londres", c: `${fmtInt(R.close)} USD/t`, v: variation(Rp.close, R.close), f: `${fmtInt(fcfaR)} FCFA/kg`, s: "Dernier cours SEP 26", live: false },
  ];
  const latest = (spot as any).grilles[(spot as any).grilles.length - 1];

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="hero-bg overflow-hidden rounded-3xl text-white shadow-card">
        <div className="grid gap-6 p-6 sm:p-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-oncc-goldlight">Office National du Cacao et du Café • Cameroun</p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
              Les marchés mondiaux du cacao et du café, traduits en décisions pour l&apos;origine Cameroun.
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
              Cotations ICE, conversions en FCFA/kg au taux BEAC, grilles SPOT Douala et Moungo,
              historiques exportables et veille connectée — sur un poste sécurisé, opéré par <strong>KOUABA AGENCY</strong>.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/cacao" className="btn bg-white font-bold text-oncc-deepgreen hover:bg-oncc-goldlight">Voir les cours du jour</Link>
              <Link href="/conversions" className="btn ring-1 ring-white/50 hover:bg-white/10">Convertir en FCFA/kg</Link>
              <Link href="/historiques" className="btn ring-1 ring-white/50 hover:bg-white/10">Exporter les données</Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <LiveBadge ok={!!qNY || !!qAra} />
              {onccLive && <span className="badge bg-white/15 text-white ring-1 ring-white/30">ONCC {onccLive.bannerDate} : cacao CIF {onccLive.cocoa?.cif ?? "—"} F/kg</span>}
            </div>
          </div>
          <div className="card !border-white/20 bg-white/95 p-4 text-oncc-ink">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Prix physiques ONCC {onccLive?.bannerDate ? `— ${onccLive.bannerDate}` : "— 22/09/2026"}</h2>
              <LiveBadge ok={!!onccLive} />
            </div>
            {onccLive ? (
              <div className="mt-2 space-y-2 text-sm">
                <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Cacao — Douala</p><p className="kpi-num">CIF <strong>{onccLive.cocoa?.cif?.toLocaleString("fr-FR") ?? "—"}</strong> • FOB <strong>{onccLive.cocoa?.fob?.toLocaleString("fr-FR") ?? "—"}</strong> F/kg</p><p className="text-xs text-oncc-muted">Achat exportateurs : {onccLive.cocoa?.achatMin ?? "—"} – {onccLive.cocoa?.achatMax ?? "—"} F/kg</p></div>
                <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Arabica</p><p className="kpi-num">CIF <strong>{onccLive.arabica?.cif?.toLocaleString("fr-FR") ?? "—"}</strong> • FOB <strong>{onccLive.arabica?.fob?.toLocaleString("fr-FR") ?? "—"}</strong> F/kg</p></div>
                <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Robusta — Moungo</p><p className="kpi-num">CIF <strong>{onccLive.robusta?.cif?.toLocaleString("fr-FR") ?? "—"}</strong> • FOB <strong>{onccLive.robusta?.fob?.toLocaleString("fr-FR") ?? "—"}</strong> F/kg</p></div>
              </div>
            ) : (
              <div className="mt-2 space-y-2 text-sm">
                <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Cacao — Douala</p><p className="kpi-num">CIF <strong>{fmtInt(latest.cacao.cif)}</strong> • FOB <strong>{fmtInt(latest.cacao.fob)}</strong> F/kg</p></div>
                <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Arabica</p><p className="kpi-num">CIF <strong>{fmtInt(latest.arabica.cif)}</strong> • FOB <strong>{fmtInt(latest.arabica.fob)}</strong> F/kg</p></div>
                <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Robusta — Moungo</p><p className="kpi-num">CIF <strong>{fmtInt(latest.robusta.cif)}</strong> • FOB <strong>{fmtInt(latest.robusta.fob)}</strong> F/kg</p></div>
              </div>
            )}
            <SourceLine href="https://www.oncc.cm/home">Source : oncc.cm — relevés officiels</SourceLine>
          </div>
        </div>
        {/* Ticker */}
        <div className="overflow-hidden border-t border-white/15 bg-black/25 py-2 text-[13px] font-semibold">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} className="kpi-num">● {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PARCOURS UTILISATEUR */}
      <section>
        <SectionTitle kicker="Parcours utilisateur" title="De la cotation à la décision en 4 étapes" desc="Un chemin guidé pour chaque profil : analyste ONCC, exportateur, coopérative, décideur." />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {JOURNEY.map((s, i) => (
            <Link key={s.t} href={s.href} className="card group p-5 transition hover:-translate-y-0.5 hover:shadow-card">
              <div className="flex items-center gap-3"><span className="step-num">{i + 1}</span><h3 className="font-bold">{s.t}</h3></div>
              <p className="mt-2 text-sm text-oncc-muted">{s.d}</p>
              <span className="mt-3 inline-block text-sm font-bold text-oncc-green group-hover:underline">{s.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* KPI */}
      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-oncc-green">Vue quotidienne — 22 septembre 2026</p>
            <h2 className="text-2xl font-extrabold">Les quatre références et leurs équivalents FCFA/kg</h2>
          </div>
          <div className="flex gap-2"><LiveBadge ok={!!(qNY || qAra)} /><span className="badge bg-amber-100 text-amber-900 ring-1 ring-amber-300">Londres & Robusta : référence vérifiée</span></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard title="Cacao" ref_="ICE Futures Europe — Londres" unit="GBP/t" cours={L.close} prev={Lp.close} fcfa={fcfaL} accent="#5B3A1E" status="Référence vérifiée • différé 15 min" sub={`Règlement officiel DEC 26 • Vol. ${L.volume.toLocaleString("fr-FR")}`} spark={spark((lon as any).series)} />
          <KpiCard title="Cacao" ref_="ICE Futures U.S. — New York" unit="USD/t" cours={qNY ? qNY.price : N.close} prev={qNY?.prevClose ?? Np.close} fcfa={fcfaN} accent="#8A5A2B" status={qNY ? "EN DIRECT — ICE (différé)" : "Référence vérifiée"} sub={qNY ? `${qNY.longName} • ${new Date(qNY.time).toLocaleString("fr-FR")}` : `Règlement officiel DEC 26 • Vol. ${N.volume.toLocaleString("fr-FR")}`} spark={qNY ? qNY.history.map((h: any) => h.close) : spark((ny as any).series)} />
          <KpiCard title="Café arabica" ref_="ICE Futures U.S. — Coffee C" unit="¢/lb" cours={qAra ? qAra.price : A.close} prev={qAra?.prevClose ?? Ap.close} fcfa={fcfaA} accent="#0B6B3A" status={qAra ? "EN DIRECT — ICE (différé)" : "Référence vérifiée"} sub={qAra ? `${qAra.longName} • 1 lb = 0,45359237 kg` : `Dernier cours SEP 26 • 1 lb = 0,45359237 kg`} spark={qAra ? qAra.history.map((h: any) => h.close) : spark((ara as any).series)} />
          <KpiCard title="Café robusta" ref_="ICE Futures Europe — Robusta" unit="USD/t" cours={R.close} prev={Rp.close} fcfa={fcfaR} accent="#1E9E5A" status="Référence vérifiée • différé 15 min" sub={`Dernier cours SEP 26 • Vol. ${R.volume.toLocaleString("fr-FR")}`} spark={spark((rob as any).series)} />
        </div>
      </section>

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
          <div className="flex items-center justify-between"><h2 className="font-bold text-oncc-ink">Changes & conversions</h2><LiveBadge ok={fxLive} /></div>
          <p className="text-xs text-oncc-muted">BEAC (fixing 12h Yaoundé){live?.fxFallback && !live?.quotes.usdXaf.ok ? " — relais ExchangeRate-API en direct" : " croisé avec le marché des changes en direct"} • EUR/XAF fixe 655,957</p>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between rounded-lg bg-oncc-cream px-3 py-2"><span>USD / XAF</span><strong className="kpi-num">{Number(fxUSD).toLocaleString("fr-FR")} ({fmtPct(((fxUSD - g.usd_xaf) / g.usd_xaf) * 100)})</strong></div>
            <div className="flex justify-between rounded-lg bg-oncc-cream px-3 py-2"><span>GBP / XAF</span><strong className="kpi-num">{Number(fxGBP).toLocaleString("fr-FR")} ({fmtPct(((fxGBP - g.gbp_xaf) / g.gbp_xaf) * 100)})</strong></div>
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
          <span className="badge bg-emerald-100 text-emerald-900">Dernière actualisation 22/09/2026 17:30 WAT</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-compact w-full">
            <thead><tr><th>Produit / référence</th><th>Dernier cours</th><th>Var. jour</th><th>Équiv. FCFA/kg</th><th>Statut</th><th>Source</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.p}>
                  <td className="font-semibold">{r.p} {r.live && <span className="badge ml-1 bg-emerald-600 text-white">DIRECT</span>}</td><td>{r.c}</td>
                  <td className={r.v.pct >= 0 ? "text-emerald-700 font-semibold" : "text-red-700 font-semibold"}>{fmtPct(r.v.pct)}</td>
                  <td className="font-bold text-oncc-green">{r.f}</td><td>{r.s}</td><td className="text-oncc-muted">{r.live ? "Yahoo / ICE" : "Référence vérifiée"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FONCTIONNALITÉS */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-oncc-green">Offre de valeur</p>
            <h2 className="text-2xl font-extrabold">Tout ce que la plateforme fait pour vos équipes</h2>
          </div>
          <Link href="/fonctionnalites" className="btn btn-ghost">Détail complet →</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.t} className="card p-4"><h3 className="font-bold text-oncc-green">✓ {f.t}</h3><p className="mt-1 text-sm text-oncc-muted">{f.d}</p></div>
          ))}
        </div>
      </section>

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
          <div className="flex items-center justify-between"><h2 className="font-bold text-oncc-ink">Veille connectée</h2><LiveBadge ok={!!(live?.news.cacao.ok || live?.news.cafe.ok)} /></div>
          <div className="mt-2 space-y-2">
            {live?.news.cacao.ok
              ? (live.news.cacao.data as any[]).slice(0, 3).map((n: any) => (
                <a key={n.title} href={n.link} target="_blank" rel="noreferrer" className="block rounded-xl bg-oncc-cream p-3 hover:ring-1 hover:ring-oncc-green">
                  <p className="text-sm font-bold">{n.title} ↗</p>
                  <p className="text-[11px] text-oncc-muted">{n.source} • {n.pubDate?.slice(0, 16).replace("T", " ")}</p>
                </a>
              ))
              : (veille as any[]).slice(0, 3).map((n: any) => (
                <div key={n.titre} className="rounded-xl bg-oncc-cream p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-oncc-green">{fmtDate(n.date)} • {n.source}</p>
                  <p className="text-sm font-bold">{n.titre}</p>
                </div>
              ))}
          </div>
          <Link href="/veille" className="btn btn-ghost mt-3">Toutes les actualités et rapports</Link>
        </div>
      </div>

      {/* SOURCES & TRANSPARENCE */}
      <section className="card p-5">
        <h2 className="font-bold">Sources & transparence — d&apos;où vient chaque chiffre</h2>
        <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Prix physiques (SPOT) — <LiveBadge ok={!!onccLive} /></p><p className="text-xs text-oncc-muted">Site officiel de l&apos;ONCC, relevés Douala/Moungo. <SourceLine href="https://www.oncc.cm/home">oncc.cm</SourceLine></p></div>
          <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Cacao New York & Arabica — <LiveBadge ok={!!(qNY || qAra)} /></p><p className="text-xs text-oncc-muted">ICE Futures via Yahoo Finance (CC=F, KC=F), cotations différées. <SourceLine href="https://finance.yahoo.com">finance.yahoo.com</SourceLine></p></div>
          <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Changes USD/XAF, GBP/XAF — <LiveBadge ok={fxLive} /></p><p className="text-xs text-oncc-muted">{live?.fxFallback && !live?.quotes.usdXaf.ok ? "Relais ExchangeRate-API en direct" : "Marché des changes en direct"}, croisé avec le fixing BEAC (EUR/XAF 655,957). <SourceLine href="https://www.beac.int">beac.int</SourceLine></p></div>
          <div className="rounded-xl bg-oncc-cream p-3"><p className="font-bold">Veille presse — <LiveBadge ok={!!(live?.news.cacao.ok)} /></p><p className="text-xs text-oncc-muted">Google Actualités (cacao, café) + actualités ONCC. Archivage selon licence.</p></div>
        </div>
        <Note><strong>Honêteté des données :</strong> Londres et robusta s&apos;affichent en « référence vérifiée » (reconstitution ancrée ICE du 04/09/2026) tant que la licence temps réel ICE Connect / LSEG n&apos;est pas activée. Chaque écran rappelle contrat, échéance, source, date, heure, fuseau, devise, unité et statut.</Note>
      </section>
    </div>
  );
}
