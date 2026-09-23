import { SectionTitle } from "@/components/ui";

const CARDS = [
  { t: "Poste & accès ( §1 )", d: "Intel Core i5 / Ryzen 5 récent, 16 Go (ext. 32 Go), SSD 512 Go ; écran 24\" Full HD AZERTY ; Windows 11 Pro + Excel de bureau ; liaison fixe + bascule 4G/5G ; onduleur 30 min ; compte nominatif, chiffrement disque, 2FA ; sauvegarde quotidienne testée. Service 12 mois + 6 mois conditionnels.", c: "#0B6B3A" },
  { t: "Plateforme & droits ( §2 )", d: "ICE Connect + ICE XL ou LSEG Workspace + Excel, au mieux-disant démontré : références, temps réel, historiques, changes, exports, assistance — confirmés par écrit. Licences au nom de l'ONCC ; droits de publication des bulletins à valider.", c: "#B07C3B" },
  { t: "Installation 10–15 j ( §6 )", d: "Cadrage (utilisateurs, grilles, droits, réseau/énergie) → configuration (poste, flux, Excel, conversions, sauvegardes) → vérification (cours recalculés, exports, coupures, restauration) → formation 1 jour + PV de réception.", c: "#1E9E5A" },
  { t: "Maintenance & continuité ( §7 )", d: "Interlocuteur local unique. Lun–ven 8h–18h (Yaoundé) : prise en charge bloquant < 2 h, diagnostic distant < 4 h, site J+1. H24 selon poste/réseau/plateforme et séances de marché. Astreinte chiffrable.", c: "#5B3A1E" },
  { t: "Réception & livrables ( §8 )", d: "Accès nominatif, 4 références, échantillon cours/historiques, conversions recalculées, 3 formats d'export, grilles approuvées, bascule internet, autonomie onduleur, restauration. Livrables : poste inventorié, licences, tableaux, guide, dossier config/maintenance, contacts, CR formation, PV.", c: "#0A3D24" },
];

export default function Pilotage() {
  return (
    <div className="space-y-6">
      <SectionTitle kicker="Pilotage & service" title="Installation, maintenance, réception — engagements KOUABA AGENCY"
        desc="Calendrier indicatif : 10 à 15 jours ouvrés après licences, matériel et accès site — distinct des 18 mois de service de l'avis." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {CARDS.map((c) => (
          <div key={c.t} className="card overflow-hidden">
            <div className="h-1.5" style={{ background: c.c }} />
            <div className="p-4"><h2 className="font-bold">{c.t}</h2><p className="mt-2 text-sm leading-relaxed">{c.d}</p></div>
          </div>
        ))}
        <div className="card bg-oncc-deepgreen p-4 !text-white">
          <h2 className="font-bold text-oncc-goldlight">Contacts & escalade</h2>
          <ul className="mt-2 space-y-1 text-sm text-white/90">
            <li>ONCC Douala : +237 233 42 00 02 — infos@oncc.cm</li>
            <li>KOUABA AGENCY — interlocuteur local unique (astreinte chiffrable)</li>
            <li>Fournisseur de données : support ICE / LSEG selon licence retenue</li>
            <li>Accès distant au poste : uniquement avec accord de l&apos;utilisateur, interventions consignées</li>
          </ul>
        </div>
      </div>
      <div className="card p-5 text-sm">
        <h2 className="font-bold">À arrêter avant commande</h2>
        <p className="mt-1">Nombre d&apos;utilisateurs, modèle du poste, fournisseur et licences, profondeur des historiques, définition des prix SPOT, autonomie électrique, droits de publication, niveaux de service. Le chiffrage distingue installation, matériel, abonnements et maintenance pour chaque tranche.</p>
      </div>
    </div>
  );
}
