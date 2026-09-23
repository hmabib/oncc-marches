"use client";
import spot from "@/data/spot.json";
import { SectionTitle, Note } from "@/components/ui";
import { fmtInt, fmtDate } from "@/lib/markets";

export default function Grilles() {
  const g = (spot as any).grilles;
  const p = (spot as any).parametres;
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Grilles de référence & SPOT" title="Prix physiques observés et prix calculés — méthode ONCC"
        desc="La conversion d'un cours à terme ne constitue pas, à elle seule, un prix physique local. Origine, qualité, lieu et conditions de livraison, différentiels et frais sont renseignés selon la méthode approuvée par l'ONCC." />

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0E7D2] p-4">
          <h2 className="font-bold">Grille officielle — trois relevés ({p.version})</h2>
          <span className="badge bg-oncc-green text-white">Formules protégées • paramètres versionnés</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-compact w-full">
            <thead><tr><th>Date</th><th>Cacao CIF</th><th>Cacao FOB</th><th>Achat Douala</th><th>Arabica CIF</th><th>Arabica FOB</th><th>Robusta CIF</th><th>Robusta FOB</th><th>Achat Moungo</th></tr></thead>
            <tbody>
              {g.map((r: any) => (
                <tr key={r.date}>
                  <td className="font-bold">{fmtDate(r.date)}</td>
                  <td>{fmtInt(r.cacao.cif)}</td><td>{fmtInt(r.cacao.fob)}</td>
                  <td className="font-semibold">{fmtInt(r.cacao.achatMin)} – {fmtInt(r.cacao.achatMax)}</td>
                  <td>{fmtInt(r.arabica.cif)}</td><td>{fmtInt(r.arabica.fob)}</td>
                  <td>{fmtInt(r.robusta.cif)}</td><td>{fmtInt(r.robusta.fob)}</td>
                  <td className="font-semibold">{fmtInt(r.robusta.achatMin)} – {fmtInt(r.robusta.achatMax)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-4 py-2 text-[11px] text-oncc-muted">Unités : FCFA/kg. Lieux : cacao — Douala (exportateurs) ; robusta — Moungo. Les 24 et 28/08/2026 reprennent les relevés publiés par l&apos;ONCC ; le 22/09/2026 prolonge la grille validée.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card p-4">
          <h3 className="font-bold text-oncc-green">● Prix physiques observés</h3>
          <p className="mt-1 text-sm">Enquêtes Douala (cacao) et Moungo (robusta), prix d&apos;achat exportateurs, CIF/FOB constatés. Qualité : grade I/II, humidité ≤ 8 %, lieu et conditions de livraison précisés au procès-verbal.</p>
        </div>
        <div className="card p-4">
          <h3 className="font-bold text-oncc-gold">● Prix calculés (indicatifs)</h3>
          <p className="mt-1 text-sm">Conversions des termes ± différentiels et fret/assurance. Utiles au pilotage, <strong>ils ne sont pas</strong> des prix d&apos;achat garantis.</p>
        </div>
        <div className="card p-4">
          <h3 className="font-bold">● Paramètres {p.version}</h3>
          <ul className="mt-1 space-y-1 text-sm">
            <li className="flex justify-between"><span>Différentiel cacao</span><strong>+{p.differentielCacao} $/t</strong></li>
            <li className="flex justify-between"><span>Fret & assurance cacao</span><strong>{p.fretAssuranceCacao} $/t</strong></li>
            <li className="flex justify-between"><span>Différentiel robusta</span><strong>{p.differentielRobusta} $/t</strong></li>
            <li className="flex justify-between"><span>Fret & assurance robusta</span><strong>{p.fretAssuranceRobusta} $/t</strong></li>
            <li className="flex justify-between"><span>Différentiel arabica</span><strong>+{p.differentielArabica} ¢/lb</strong></li>
            <li className="flex justify-between"><span>Fret & assurance arabica</span><strong>{p.fretAssuranceArabica} $/t</strong></li>
          </ul>
          <p className="mt-2 text-[11px] text-oncc-muted">{p.arrondi}. Paramètres modifiables identifiés, versions conservées.</p>
        </div>
      </div>

      <Note><strong>Exemple de lecture :</strong> le 28/08/2026, cacao CIF 3 470 F/kg − FOB 3 388 F/kg = 82 F de fret/assurance ; achat Douala 2 650–2 800 F/kg, soit une marge de mise à FOB de ~590–740 F/kg. Robusta : CIF 1 981 − FOB 1 875 = 106 F ; achat Moungo 1 650–1 750 F/kg.</Note>
    </div>
  );
}
