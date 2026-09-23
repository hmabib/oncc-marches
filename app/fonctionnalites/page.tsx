import Link from "next/link";
import { SectionTitle } from "@/components/ui";
import { SourceLine } from "@/lib/live";

const MODULES = [
  {
    t: "Vue quotidienne", href: "/", icon: "◉",
    users: "Tous les profils, chaque matin avant 8h30",
    feats: ["4 références avec dernier cours, règlement officiel et cours différé distingués", "Variations jour et équivalents FCFA/kg sur chaque carte", "Bandeau défilant des cotations + prix physiques ONCC en direct", "Tableau du jour avec statut et source de chaque donnée", "Badges EN DIRECT / RÉFÉRENCE VÉRIFIÉE sur chaque chiffre"],
  },
  {
    t: "Cacao — Londres & New York", href: "/cacao", icon: "⬢",
    users: "Analystes, exportateurs de cacao",
    feats: ["Onglets par place (£/t et $/t), 5 échéances sélectionnables", "Graphiques cours + équivalent FCFA/kg superposés", "Statistiques : plus haut/bas, moyenne, performance, volatilité", "10 dernières séances OHLC + volumes", "Méthode de raccordement des contrats documentée"],
  },
  {
    t: "Café — Arabica & Robusta", href: "/cafe", icon: "⬣",
    users: "Analystes, coopératives, Moungo",
    feats: ["Gestion des unités natives (¢/lb vs $/t) sans erreur de conversion", "Rappel permanent : 1 lb = 0,45359237 kg", "Échéances, statistiques et séances comme pour le cacao", "Repères vérifiables 2026 affichés sous les tableaux"],
  },
  {
    t: "Changes & conversions", href: "/conversions", icon: "⇄",
    users: "Comptables, contrôleurs, exportateurs",
    feats: ["Convertisseur interactif à taux modifiables (simulation)", "Règles §5 visibles sur chaque résultat + bouton de retour au taux BEAC", "Tableau des 4 conversions du jour avec règle appliquée", "Historique 180 jours USD/XAF et GBP/XAF"],
  },
  {
    t: "Grilles SPOT", href: "/grilles", icon: "▦",
    users: "Direction, acheteurs, auditeurs",
    feats: ["Trois relevés : 24/08, 28/08 (publiés ONCC) et 22/09/2026", "CIF/FOB + achats Douala et Moungo, lieux et conditions", "Paramètres versionnés (différentiels, fret/assurance)", "Distinction stricte observés vs calculés, exemple de lecture chiffré"],
  },
  {
    t: "Historiques & exports", href: "/historiques", icon: "⤓",
    users: "Équipes, partenaires, tutelle",
    feats: ["Sélection produit + période (22/09/2025 → 22/09/2026, 262 séances)", "Exports Excel, CSV (compatible Excel FR, séparateur ;) et PDF", "Chaque fichier rappelle source, dates, unité, taux et mentions de droits", "Aperçu graphique et tableau paginé avant export"],
  },
  {
    t: "Veille & analyses", href: "/veille", icon: "◈",
    users: "Direction, communication, partenaires",
    feats: ["Actualités ONCC en direct depuis oncc.cm", "Presse marché cacao et café en continu (flux RSS)", "Archives d'analyses datées et sourcées (Reuters, USDA, BEAC…)", "Suivi des rapports : USDA, BEAC, stocks certifiés ICE"],
  },
  {
    t: "Pilotage & service", href: "/pilotage", icon: "⚙",
    users: "DSI, achats, fournisseur",
    feats: ["Poste, plateforme et droits : spécifications et engagements", "Installation 10–15 jours en 4 étapes + PV de réception", "SLA : 2 h / 4 h / J+1, astreinte chiffrable", "Check-list des points à arrêter avant commande"],
  },
];

const PERSONAS = [
  { p: "L'analyste ONCC (8h00)", d: "Ouvre la vue quotidienne, vérifie les badges de fraîcheur, exporte le tableau du jour en Excel pour la note de conjoncture." },
  { p: "L'exportateur à Douala (10h00)", d: "Compare le FOB calculé à la grille SPOT, simule un différentiel dans le convertisseur, prépare son prix d'achat." },
  { p: "La coopérative (12h00)", d: "Consulte l'équivalent FCFA/kg du robusta et les achats Moungo pour expliquer le prix au producteur." },
  { p: "Le décideur (17h00)", d: "Lit la veille connectée et la comparaison base 100 pour arbitrer la communication de la semaine." },
];

export default function Fonctionnalites() {
  return (
    <div className="space-y-8">
      <SectionTitle kicker="Fonctionnalités" title="Tout ce que la plateforme fait, écran par écran"
        desc="Huit modules, un seul parcours : consulter → convertir → arbitrer → exporter → suivre. Chaque fonctionnalité ci-dessous est déjà utilisable." />
      <div className="grid gap-4 md:grid-cols-2">
        {MODULES.map((m) => (
          <div key={m.t} className="card flex flex-col p-5">
            <div className="flex items-center gap-2"><span className="text-2xl">{m.icon}</span><h2 className="font-bold">{m.t}</h2></div>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-oncc-muted">Pour : {m.users}</p>
            <ul className="mt-2 flex-1 space-y-1.5 text-sm">
              {m.feats.map((f) => <li key={f} className="flex gap-2"><span className="font-bold text-oncc-leaf">✓</span><span>{f}</span></li>)}
            </ul>
            <Link href={m.href} className="btn btn-ghost mt-3 self-start">Ouvrir le module →</Link>
          </div>
        ))}
      </div>

      <section className="hero-bg rounded-3xl p-6 text-white sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-oncc-goldlight">Parcours utilisateurs — une journée type</p>
        <h2 className="mt-1 text-2xl font-extrabold">Quatre profils, zéro formation requise</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {PERSONAS.map((p, i) => (
            <div key={p.p} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
              <p className="text-xs font-bold text-oncc-goldlight">ÉTAPE {i + 1}</p>
              <p className="font-bold">{p.p}</p>
              <p className="mt-1 text-sm text-white/85">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-bold">Données connectées en direct — et repli honnête si un flux coupe</h2>
        <div className="mt-2 overflow-x-auto">
          <table className="table-compact w-full">
            <thead><tr><th>Donnée</th><th>Source live</th><th>Secours</th></tr></thead>
            <tbody>
              <tr><td className="font-semibold">Prix physiques SPOT</td><td><SourceLine href="https://www.oncc.cm/home">oncc.cm — bandeau officiel</SourceLine></td><td>Grille validée du 22/09/2026</td></tr>
              <tr><td className="font-semibold">Cacao New York, Arabica</td><td><SourceLine href="https://finance.yahoo.com">Yahoo Finance — CC=F, KC=F (ICE, différé)</SourceLine></td><td>Référence vérifiée ancrée ICE 04/09/2026</td></tr>
              <tr><td className="font-semibold">USD/XAF, GBP/XAF</td><td>Marché des changes en direct</td><td>Fixing BEAC (EUR/XAF 655,957)</td></tr>
              <tr><td className="font-semibold">Veille presse</td><td>Google Actualités RSS + ONCC</td><td>Archives datées et sourcées</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-oncc-muted">Un flux interrompu affiche sa dernière actualisation et un avertissement explicite — une donnée absente ne devient jamais un zéro. La licence temps réel complète (ICE Connect + ICE XL ou LSEG Workspace) lèvera les derniers badges « référence » vers le « direct ».</p>
      </section>
    </div>
  );
}
