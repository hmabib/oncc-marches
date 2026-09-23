// Présentation grand public — Plateforme ONCC de suivi des marchés (KOUABA AGENCY)
// Captures réelles d'utilisation + offre de valeur.
const PptxGenJS = require("pptxgenjs");
const path = require("path");

const SHOTS = process.env.SHOT_DIR || "/tmp/shots";
const OUT = process.env.PPTX_OUT || "/Users/admin/ONCC/ONCC_Plateforme_Marches_Presentation.pptx";
const img = (n) => path.join(SHOTS, `${n}.png`);

const GREEN = "0B6B3A", DEEP = "0A3D24", GOLD = "E9A426", CREAM = "FFF9EF", INK = "10241A";

const pptx = new PptxGenJS();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "KOUABA AGENCY pour l'ONCC";
pptx.title = "Plateforme ONCC — Suivi des marchés du cacao et du café";
pptx.subject = "Présentation grand public de l'offre de valeur";

function bg(slide, color = DEEP) { slide.background = { color }; }
function triband(slide, y = 6.94) {
  slide.addShape("rect", { x: 0, y, w: 13.33, h: 0.06, fill: { color: "007A5E" }, line: { type: "none" } });
  slide.addShape("rect", { x: 0, y, w: 4.44, h: 0.06, fill: { color: "007A5E" }, line: { type: "none" } });
  slide.addShape("rect", { x: 4.44, y, w: 4.45, h: 0.06, fill: { color: "FCD116" }, line: { type: "none" } });
  slide.addShape("rect", { x: 8.89, y, w: 4.44, h: 0.06, fill: { color: "CE1126" }, line: { type: "none" } });
}
function kicker(slide, text, x = 0.7, y = 0.4, color = GOLD) {
  slide.addText(text, { x, y, w: 11.9, h: 0.3, fontSize: 11, bold: true, color, charSpacing: 3 });
}
function footer(slide, text = "Office National du Cacao et du Café — B.P. 3018 Douala • KOUABA AGENCY") {
  slide.addText(text, { x: 0.7, y: 6.6, w: 11.9, h: 0.25, fontSize: 8, color: "8AA391" });
  triband(slide);
}
function shotSlide(title, desc, shot, bullets = []) {
  const s = pptx.addSlide();
  bg(s, "FFFFFF");
  s.addText("PLATEFORME ONCC • SUIVI DES MARCHÉS", { x: 0.7, y: 0.25, w: 11.9, h: 0.25, fontSize: 10, bold: true, color: GREEN, charSpacing: 2 });
  s.addText(title, { x: 0.7, y: 0.5, w: 11.9, h: 0.6, fontSize: 28, bold: true, color: INK });
  s.addText(desc, { x: 0.7, y: 1.1, w: 11.9, h: 0.5, fontSize: 12, color: "5B6B60" });
  s.addImage({ path: img(shot), x: 0.7, y: 1.7, w: 8.2, h: 5.1, sizing: { type: "contain", w: 8.2, h: 5.1 } });
  bullets.slice(0, 6).forEach((b, i) => {
    s.addText(`✓  ${b}`, { x: 9.2, y: 1.7 + i * 0.78, w: 3.4, h: 0.75, fontSize: 11, color: INK, valign: "top" });
  });
  footer(s);
  return s;
}

// 1 — Couverture
{
  const s = pptx.addSlide();
  bg(s);
  s.addText("OFFICE NATIONAL DU CACAO ET DU CAFÉ • CAMEROUN", { x: 0.8, y: 0.7, w: 11.7, h: 0.4, fontSize: 13, bold: true, color: GOLD, charSpacing: 3 });
  s.addText("Les marchés mondiaux du cacao et du café,\ntraduits en décisions pour l'origine Cameroun.", { x: 0.8, y: 1.3, w: 7.2, h: 2.2, fontSize: 34, bold: true, color: "FFFFFF" });
  s.addText("Poste sécurisé • Données connectées • Tableaux actualisés — solution installée et opérée par KOUABA AGENCY.", { x: 0.8, y: 3.7, w: 7.0, h: 0.9, fontSize: 14, color: "D9EADF" });
  s.addText("Démonstration sur données réelles : oncc.cm (21/09/2026) • ICE New York & Coffee C • Changes • 22/09/2026", { x: 0.8, y: 4.7, w: 7.0, h: 0.5, fontSize: 10, italic: true, color: "9CC3AD" });
  s.addImage({ path: img("accueil"), x: 8.2, y: 1.0, w: 4.3, h: 4.6, sizing: { type: "cover", w: 4.3, h: 4.6 } });
  s.addText("KOUABA AGENCY  •  Douala, Cameroun  •  Septembre 2026", { x: 0.8, y: 6.3, w: 11.7, h: 0.3, fontSize: 10, color: GOLD });
  triband(s);
}

// 2 — Offre de valeur
{
  const s = pptx.addSlide();
  bg(s, "FFFFFF");
  kicker(s, "OFFRE DE VALEUR", 0.7, 0.3, GREEN);
  s.addText("Un poste, un abonnement, des tableaux : tout le marché sur un écran.", { x: 0.7, y: 0.6, w: 11.9, h: 0.8, fontSize: 26, bold: true, color: INK });
  const cards = [
    ["1. Poste informatique sécurisé", "i5 / Ryzen 5, 16 Go, SSD 512 Go, écran 24\", Windows 11 Pro + Excel, bascule 4G/5G, onduleur 30 min, compte nominatif chiffré, sauvegarde quotidienne."],
    ["2. Données de marché connectées", "Prix physiques ONCC en direct, ICE New York & arabica en direct, changes en direct, veille presse — chaque chiffre sourcé et horodaté."],
    ["3. Tableaux actualisés pour décider", "Vue quotidienne, échéances, conversions FCFA/kg, grilles SPOT Douala/Moungo, historiques exportables Excel / CSV / PDF."],
  ];
  cards.forEach(([t, d], i) => {
    const x = 0.7 + i * 4.05;
    s.addShape("roundRect", { x, y: 1.7, w: 3.85, h: 4.4, fill: { color: CREAM }, line: { color: GOLD, width: 1.5 } });
    s.addText(t, { x: x + 0.25, y: 2.0, w: 3.35, h: 0.9, fontSize: 15, bold: true, color: DEEP });
    s.addText(d, { x: x + 0.25, y: 2.9, w: 3.35, h: 2.8, fontSize: 12, color: INK });
  });
  footer(s);
}

// 3 — Parcours utilisateur
{
  const s = pptx.addSlide();
  bg(s);
  kicker(s, "PARCOURS UTILISATEUR");
  s.addText("De la cotation à la décision en 4 étapes.", { x: 0.7, y: 0.7, w: 11.9, h: 0.7, fontSize: 28, bold: true, color: "FFFFFF" });
  const steps = [
    ["1. CONSULTER", "Vue quotidienne : 4 références, variations, FCFA/kg."],
    ["2. CONVERTIR", "Changes BEAC + convertisseur interactif."],
    ["3. ARBITRER", "Grilles SPOT Douala / Moungo : observé vs calculé."],
    ["4. EXPORTER", "Historiques Excel / CSV / PDF pour les équipes."],
  ];
  steps.forEach(([t, d], i) => {
    const x = 0.7 + i * 3.1;
    s.addShape("roundRect", { x, y: 1.8, w: 2.9, h: 2.6, fill: { color: "0E5A35" }, line: { color: GOLD, width: 1 } });
    s.addText(t, { x: x + 0.2, y: 2.0, w: 2.5, h: 0.5, fontSize: 14, bold: true, color: GOLD });
    s.addText(d, { x: x + 0.2, y: 2.6, w: 2.5, h: 1.4, fontSize: 12, color: "FFFFFF" });
  });
  s.addText("Analyste ONCC (8h) → Exportateur à Douala (10h) → Coopérative (12h) → Décideur (17h) : zéro formation requise.", { x: 0.7, y: 4.8, w: 11.9, h: 0.6, fontSize: 13, italic: true, color: "D9EADF" });
  s.addImage({ path: img("fonctionnalites"), x: 0.7, y: 5.4, w: 5.0, h: 1.1, sizing: { type: "cover", w: 5.0, h: 1.1 } });
  footer(s);
}

// 4–11 — Modules avec captures réelles
shotSlide("Vue quotidienne : le marché d'un coup d'œil", "Bandeau ONCC en direct, ticker, 4 cartes FCFA/kg, comparaison base 100.", "accueil", [
  "Prix physiques ONCC du 21/09/2026 affichés EN DIRECT",
  "Cacao NY & arabica : cotations ICE en direct",
  "Équivalents FCFA/kg sur chaque référence",
  "Badges de statut : direct vs référence vérifiée",
  "Parcours guidé en 4 étapes",
]);
shotSlide("Cacao : Londres & New York", "Échéances, doubles graphiques cours + FCFA/kg, statistiques de période.", "cacao", [
  "5 échéances (SEP 26 → JUL 27) sélectionnables",
  "Graphique cours + équivalent FCFA/kg",
  "Plus haut / bas, moyenne, volatilité",
  "10 dernières séances OHLC + volumes",
]);
shotSlide("Café : arabica & robusta", "Unités natives gérées sans erreur : ¢/lb et $/t ramenés en FCFA/kg.", "cafe", [
  "Rappel permanent : 1 lb = 0,45359237 kg",
  "Échéances et statistiques par famille",
  "Repères vérifiables 2026 affichés",
]);
shotSlide("Changes & conversions", "Du cours d'origine au FCFA/kg : taux, date et arrondi toujours visibles.", "conversions", [
  "Convertisseur interactif à taux modifiables",
  "Règles §5 affichées sur chaque résultat",
  "Historique 180 j USD/XAF et GBP/XAF",
]);
shotSlide("Grilles SPOT Douala / Moungo", "Prix physiques observés vs prix calculés : la méthode ONCC appliquée.", "grilles", [
  "Relevés 24/08, 28/08 (publiés) + 22/09/2026",
  "CIF / FOB + achats exportateurs",
  "Paramètres versionnés v2026.09",
]);
shotSlide("Historiques & exports", "262 séances vérifiables, extractions Excel, CSV et PDF sourcées.", "historiques", [
  "Produit + période au choix",
  "Excel / CSV compatible / PDF horodaté",
  "Source, unité et taux dans chaque fichier",
]);
shotSlide("Veille connectée", "ONCC en direct + presse cacao-café + archives d'analyses.", "veille", [
  "Actualités oncc.cm en direct",
  "Flux presse en continu",
  "Archives Reuters, USDA, BEAC, ICE",
]);
shotSlide("Pilotage & service", "Installation 10–15 jours, SLA 2h/4h/J+1, réception documentée.", "pilotage", [
  "Poste, plateforme et droits détaillés",
  "Formation 1 jour + PV de réception",
  "Interlocuteur local unique",
]);

// 12 — Méthode & confiance
{
  const s = pptx.addSlide();
  bg(s, "FFFFFF");
  kicker(s, "MÉTHODE & CONFIANCE", 0.7, 0.3, GREEN);
  s.addText("Des chiffres vérifiables, pas des promesses.", { x: 0.7, y: 0.6, w: 11.9, h: 0.7, fontSize: 26, bold: true, color: INK });
  const rows = [
    ["Donnée", "Source live", "Point d'ancrage vérifiable"],
    ["Prix physiques SPOT", "oncc.cm (bandeau officiel)", "21/09/2026 : cacao CIF 3 070 F/kg"],
    ["Cacao NY / Arabica", "ICE via Yahoo Finance (différé)", "CC=F 5 419 $ • KC=F 272,2 ¢"],
    ["USD/XAF • GBP/XAF", "Marché des changes", "BEAC 03/09 : 563,61/568,45 • 758,80/766,51"],
    ["ICE 04/09/2026", "Référence de contrôle", "Londres 4 393 £ • NY 6 049 $ • Robusta 3 891 $"],
  ];
  const table = [];
  rows.forEach((r) => table.push([{ text: r[0], options: { bold: true } }, { text: r[1] }, { text: r[2] }]));
  s.addTable(table, { x: 0.7, y: 1.6, w: 11.9, colW: [3.2, 4.3, 4.4], fontSize: 11, color: INK, border: { pt: 1, color: "EADFC6" }, fill: { color: CREAM } });
  s.addText("Règles §5 : £/$ par tonne × taux ÷ 1 000 • arabica ¢/lb ÷ 100 ÷ 0,45359237 × taux • arrondi à l'unité • donnée absente = « — », jamais zéro.", { x: 0.7, y: 5.3, w: 11.9, h: 0.7, fontSize: 12, italic: true, color: "5B6B60" });
  footer(s);
}

// 13 — Appel à l'action
{
  const s = pptx.addSlide();
  bg(s);
  kicker(s, "PROCHAINES ÉTAPES");
  s.addText("Prêts pour la mise en service en 10 à 15 jours ouvrés.", { x: 0.7, y: 0.7, w: 11.9, h: 1.2, fontSize: 30, bold: true, color: "FFFFFF" });
  const items = [
    "1. Démonstration sur ce poste : vos échéances, vos grilles, vos exports.",
    "2. Validation : utilisateurs, licences ICE/LSEG, historiques, prix SPOT, SLA.",
    "3. Installation, formation d'une journée, procès-verbal de réception.",
  ];
  items.forEach((t, i) => s.addText(t, { x: 0.9, y: 2.3 + i * 0.7, w: 11.5, h: 0.6, fontSize: 15, color: "FFFFFF" }));
  s.addText("ONCC — B.P. 3018 Douala • +237 233 42 00 02 • infos@oncc.cm • www.oncc.cm", { x: 0.7, y: 4.8, w: 11.9, h: 0.4, fontSize: 12, color: GOLD });
  s.addText("Solution proposée et opérée par KOUABA AGENCY — tranche ferme 12 mois, +6 mois conditionnels.", { x: 0.7, y: 5.25, w: 11.9, h: 0.4, fontSize: 12, color: "D9EADF" });
  s.addText("Essayez la plateforme en direct : QR / lien vers la démonstration en ligne.", { x: 0.7, y: 5.9, w: 11.9, h: 0.4, fontSize: 11, italic: true, color: "9CC3AD" });
  triband(s);
}

pptx.writeFile({ fileName: OUT }).then(() => console.log("PPTX OK:", OUT));
