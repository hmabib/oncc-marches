"use client";
import veille from "@/data/veille.json";
import { SectionTitle } from "@/components/ui";
import { useLive, LiveBadge } from "@/lib/live";
import { fmtDate } from "@/lib/markets";

export default function Veille() {
  const { live } = useLive();
  const onccNews = live?.oncc.ok ? live.oncc.data.news : [];
  const cacao = live?.news.cacao.ok ? live.news.cacao.data : [];
  const cafe = live?.news.cafe.ok ? live.news.cafe.data : [];

  return (
    <div className="space-y-6">
      <SectionTitle kicker="Veille & analyses" title="Actualités ONCC et presse marché, en direct et en archives"
        desc="Flux connectés ci-dessous ; archives datées et sourcées ensuite. Archivage selon licence ; publication externe soumise à droits adaptés." />

      {(onccNews.length > 0 || cacao.length > 0 || cafe.length > 0) && (
        <div className="grid gap-4 lg:grid-cols-3">
          {onccNews.length > 0 && (
            <div className="card p-4">
              <div className="flex items-center justify-between"><h2 className="font-bold">ONCC en direct</h2><LiveBadge ok /></div>
              <div className="mt-2 space-y-2">
                {onccNews.map((n: any) => (
                  <a key={n.title} href={n.link} target="_blank" rel="noreferrer" className="block rounded-xl bg-oncc-cream p-3 text-sm hover:ring-1 hover:ring-oncc-green"><strong>{n.title}</strong> ↗</a>
                ))}
              </div>
            </div>
          )}
          {cacao.length > 0 && (
            <div className="card p-4">
              <div className="flex items-center justify-between"><h2 className="font-bold">Marché cacao — presse</h2><LiveBadge ok /></div>
              <div className="mt-2 space-y-2">
                {cacao.map((n: any) => (
                  <a key={n.title} href={n.link} target="_blank" rel="noreferrer" className="block rounded-xl bg-oncc-cream p-3 text-sm hover:ring-1 hover:ring-oncc-green"><strong>{n.title}</strong><span className="block text-[11px] text-oncc-muted">{n.source} • {String(n.pubDate).slice(0, 16).replace("T", " ")} ↗</span></a>
                ))}
              </div>
            </div>
          )}
          {cafe.length > 0 && (
            <div className="card p-4">
              <div className="flex items-center justify-between"><h2 className="font-bold">Marché café — presse</h2><LiveBadge ok /></div>
              <div className="mt-2 space-y-2">
                {cafe.map((n: any) => (
                  <a key={n.title} href={n.link} target="_blank" rel="noreferrer" className="block rounded-xl bg-oncc-cream p-3 text-sm hover:ring-1 hover:ring-oncc-green"><strong>{n.title}</strong><span className="block text-[11px] text-oncc-muted">{n.source} • {String(n.pubDate).slice(0, 16).replace("T", " ")} ↗</span></a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <h2 className="text-xl font-extrabold">Archives d&apos;analyses — saison 2025/2026</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {(veille as any[]).map((n: any) => (
          <article key={n.titre} className="card p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-oncc-green">{fmtDate(n.date)} • {n.source} • {n.produit}</p>
            <h3 className="mt-1 font-bold leading-snug">{n.titre}</h3>
            <p className="mt-2 text-sm text-oncc-ink/85">{n.texte}</p>
            <p className="mt-3 text-[11px] text-oncc-muted">Archivé — rediffusion interne autorisée ; publication externe soumise à droits adaptés du fournisseur.</p>
          </article>
        ))}
      </div>
      <div className="card p-5 text-sm">
        <h2 className="font-bold">Rapports suivis</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>USDA — World Production, Markets & Trade (record 189,7 M sacs 2026/27 ; arabica +12 %, robusta −0,7 %).</li>
          <li>BEAC — taux indicatifs quotidiens (USD/XAF, GBP/XAF ; EUR/XAF 655,957).</li>
          <li>ONCC — relevés Douala/Moungo et campagne caféière 2025-2026 (NWCA, ASEANS, CCQ ; Hambourg/Bremerhaven 73 %).</li>
          <li>ICE — stocks certifiés : cacao ~3,1 M sacs ; arabica au plus bas depuis fév. 2024 (~264–266 k sacs) ; robusta ~4 148 lots.</li>
        </ul>
      </div>
    </div>
  );
}
