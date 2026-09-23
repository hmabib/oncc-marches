# ONCC — Suivi des marchés du cacao et du café

Plateforme de suivi des cotations cacao (ICE Futures Europe Londres, ICE Futures U.S. New York)
et café (arabica Coffee C, robusta) avec conversions en FCFA/kg, grilles SPOT Douala/Moungo,
historiques, exports Excel/CSV/PDF et veille — réalisée par **KOUABA AGENCY** pour
l'**Office National du Cacao et du Café (ONCC), Cameroun**.

## Fonctionnalités

- **Vue quotidienne** : 4 références, variations jour, équivalents FCFA/kg, comparaison base 100, changes BEAC, grille SPOT du jour
- **Cacao / Café** : onglets par famille, 5 échéances sélectionnables, graphiques cours + FCFA/kg, statistiques, 10 dernières séances
- **Changes & conversions** : convertisseur interactif (taux modifiables), règles visibles §5, historique 180 jours, méthode de raccordement
- **Grilles SPOT** : relevés 24/08, 28/08 et 22/09/2026 (CIF/FOB/achat Douala/Moungo), paramètres versionnés, observés vs calculés
- **Historiques & exports** : produit + période au choix, export Excel / CSV / PDF avec source, date, unité et taux
- **Veille & analyses** : 8 dépêches archivées (Reuters, ICE, ONCC, USDA, BEAC)
- **Pilotage & service** : poste, plateforme et droits, installation 10–15 j, maintenance, réception et livrables

## Données

Période vérifiable **22/09/2025 → 22/09/2026** (262 jours ouvrés), ancrée sur :
ICE du 04/09/2026, BEAC du 03/09/2026, ONCC des 24 et 28/08/2026.
Génération déterministe : `npm run generate:data` (voir `scripts/generate-data.js`).

## Démarrage

```bash
npm install
npm run generate:data
npm run dev
```

## Déploiement

Hébergé sur Vercel. Pousser sur `main` redéploie automatiquement.
