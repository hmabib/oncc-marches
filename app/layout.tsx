import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ONCC — Suivi des marchés du cacao et du café | KOUABA AGENCY",
  description:
    "Plateforme de suivi des cotations cacao (Londres, New York) et café (arabica, robusta) : conversions FCFA/kg, grilles SPOT Douala/Moungo, historiques, exports et veille. Office National du Cacao et du Café — Cameroun.",
};

const NAV = [
  { href: "/", label: "Vue quotidienne" },
  { href: "/cacao", label: "Cacao" },
  { href: "/cafe", label: "Café" },
  { href: "/conversions", label: "Changes & conversions" },
  { href: "/grilles", label: "Grilles SPOT" },
  { href: "/historiques", label: "Historiques & exports" },
  { href: "/veille", label: "Veille & analyses" },
  { href: "/pilotage", label: "Pilotage & service" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <div className="tri-band h-1.5 w-full" />
        {/* Barre institutionnelle */}
        <div className="bg-oncc-deepgreen text-white/90">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-1.5 text-[11px] sm:text-xs">
            <p className="font-medium tracking-wide">
              Office National du Cacao et du Café — B.P. 3018 Douala, Cameroun • +237 233 42 00 02 • infos@oncc.cm
            </p>
            <p className="hidden md:block text-white/70">
              Séance du 22/09/2026 • Données différées 15 min • Heure de Yaoundé (WAT, UTC+1)
            </p>
          </div>
        </div>
        {/* En-tête principal */}
        <header className="sticky top-0 z-40 bg-oncc-green shadow-lg">
          <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
            <Image src="/oncc-logo.jpg" alt="ONCC — Origine Cameroun" width={44} height={44} className="h-11 w-11 rounded-full bg-white object-cover ring-2 ring-white/70" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-oncc-goldlight">ONCC • Origine Cameroun — Qualité & Durabilité</p>
              <Link href="/" className="block truncate text-lg font-bold leading-tight text-white">
                Suivi des marchés du cacao et du café
              </Link>
            </div>
            <span className="ml-auto hidden lg:inline-flex badge bg-white/15 text-white ring-1 ring-white/30">
              KOUABA AGENCY • Poste sécurisé + tableaux actualisés
            </span>
          </div>
          <nav className="border-t border-white/15">
            <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="navlink">
                  {n.label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-6">{children}</main>
        <footer className="mt-10 bg-oncc-ink text-white/85">
          <div className="tri-band h-1.5 w-full" />
          <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-4">
            <div>
              <p className="text-sm font-bold text-white">ONCC — Office National du Cacao et du Café</p>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                Immeuble ex-ONCPB, Bonanjo — B.P. 3018 Douala, Cameroun.
                <br />Laboratoire central d&apos;analyse, Akwa Douala.
                <br />+237 233 42 00 02 • infos@oncc.cm • www.oncc.cm
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Marchés couverts</p>
              <ul className="mt-2 space-y-1 text-xs text-white/70">
                <li>Cacao — ICE Futures Europe (Londres), £/t</li>
                <li>Cacao — ICE Futures U.S. (New York), $/t</li>
                <li>Café arabica — ICE Coffee C (New York), ¢/lb</li>
                <li>Café robusta — ICE Futures Europe, $/t</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Méthode & droits</p>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                Conversions en FCFA/kg au taux BEAC, arrondi à l&apos;unité. Séries continues par raccordement des
                contrats. Licences au nom de l&apos;ONCC : consultation, extraction, conservation et diffusion selon
                droits souscrits.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Réalisation</p>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                Solution installée et maintenue par <span className="font-semibold text-oncc-goldlight">KOUABA AGENCY</span> :
                poste sécurisé, plateforme ICE Connect / LSEG Workspace avec Excel, formation d&apos;une journée et
                procès-verbal de réception.
              </p>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3 text-[11px] text-white/55">
              <span>© 2026 ONCC — Données de marché différées, usage interne. Publication externe soumise à droits adaptés.</span>
              <span>Période vérifiable : 22/09/2025 → 22/09/2026 • 262 jours ouvrés</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
