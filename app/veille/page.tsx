import veille from "@/data/veille.json";
import { SectionTitle } from "@/components/ui";
import { fmtDate } from "@/lib/markets";

export default function Veille() {
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Veille & analyses" title="Actualités et rapports cacao-café compris dans l'abonnement"
        desc="Archivage selon licence. Analyses personnalisées chiffrables séparément si demandées." />
      <div className="grid gap-4 md:grid-cols-2">
        {(veille as any[]).map((n: any) => (
          <article key={n.titre} className="card p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-oncc-green">{fmtDate(n.date)} • {n.source} • {n.produit}</p>
            <h2 className="mt-1 font-bold leading-snug">{n.titre}</h2>
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
          <li>ONCC — relevés Douala/Moungo et campagne caféière 2025-2026 (NWCA, ASEANS, CCQ ; Hambourg/Bremerhaven 73 %). </li>
          <li>ICE — stocks certifiés : cacao ~3,1 M sacs ; arabica au plus bas depuis fév. 2024 (~264–266 k sacs) ; robusta ~4 148 lots.</li>
        </ul>
      </div>
    </div>
  );
}
