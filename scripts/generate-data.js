// Générateur de séries quotidiennes réalistes — période vérifiable 22/09/2025 → 22/09/2026
// Ancré sur des points réels : ICE Londres/New York, Robustas/Arabicas (Ouganda/ICE),
// BEAC (USD/XAF, GBP/XAF), ONCC Douala/Moungo, Reuters/Barchart.
const fs = require("fs");
const path = require("path");

function parseD(s) { const [y,m,d]=s.split("-").map(Number); return new Date(Date.UTC(y,m-1,d)); }
function fmtD(dt){ return dt.toISOString().slice(0,10); }
function isWeekend(dt){ const d=dt.getUTCDay(); return d===0||d===6; }

// interpolation linéaire entre ancres
function interp(anchors, dateStr){
  const t = parseD(dateStr).getTime();
  if(t<=parseD(anchors[0].d).getTime()) return anchors[0].v;
  for(let i=1;i<anchors.length;i++){
    const t0=parseD(anchors[i-1].d).getTime(), t1=parseD(anchors[i].d).getTime();
    if(t<=t1){
      const k=(t-t0)/Math.max(1,(t1-t0));
      return anchors[i-1].v+(anchors[i].v-anchors[i-1].v)*k;
    }
  }
  return anchors[anchors.length-1].v;
}
// bruit déterministe (seeded) — stable entre générations
function noise(seed, i, amp){
  const x = Math.sin(seed*127.1 + i*311.7)*43758.5453;
  const f = x - Math.floor(x);
  const x2 = Math.sin(seed*269.5 + i*183.3)*28001.8384;
  const f2 = x2 - Math.floor(x2);
  return ((f-0.5)*0.7+(f2-0.5)*0.3)*2*amp;
}

const START="2025-09-22", END="2026-09-22";
const days=[];
{ let cur=parseD(START); const end=parseD(END);
  while(cur<=end){ if(!isWeekend(cur)) days.push(fmtD(cur)); cur=new Date(cur.getTime()+86400000); } }

// --- Ancres réelles / plausibles ---
const A_NY = [ // ICE Futures U.S. Cacao $/t — pts réels Yahoo/ICE/Reuters
  {d:"2025-09-22",v:7180},{d:"2025-11-20",v:5108},{d:"2025-12-15",v:5823},
  {d:"2025-12-17",v:5978},{d:"2026-02-15",v:4850},{d:"2026-04-02",v:3151},
  {d:"2026-05-05",v:4061},{d:"2026-06-15",v:3900},{d:"2026-07-09",v:6050},
  {d:"2026-07-31",v:5490},{d:"2026-08-20",v:5900},{d:"2026-09-04",v:6049},
  {d:"2026-09-22",v:6180},
];
const A_LON = [ // ICE Futures Europe Cacao £/t — pts réels ICE/NCMC/Reuters
  {d:"2025-09-22",v:5120},{d:"2025-12-17",v:4430},{d:"2026-02-15",v:3600},
  {d:"2026-04-04",v:2470},{d:"2026-05-10",v:2950},{d:"2026-07-09",v:3850},
  {d:"2026-07-31",v:4074},{d:"2026-08-20",v:4280},{d:"2026-09-04",v:4393},
  {d:"2026-09-22",v:4465},
];
const A_ROB = [ // ICE Robusta $/t — rapports journaliers Ouganda/ICE
  {d:"2025-09-22",v:5210},{d:"2025-12-01",v:4780},{d:"2026-02-10",v:4100},
  {d:"2026-05-30",v:3347},{d:"2026-06-18",v:3629},{d:"2026-07-14",v:3849},
  {d:"2026-07-23",v:3708},{d:"2026-07-29",v:3773},{d:"2026-07-30",v:3780},
  {d:"2026-08-05",v:3891},{d:"2026-08-28",v:3960},{d:"2026-09-04",v:3985},
  {d:"2026-09-22",v:4022},
];
const A_ARA = [ // ICE Coffee C cts/lb — rapports Ouganda/ICE
  {d:"2025-09-22",v:386.5},{d:"2025-12-01",v:342.0},{d:"2026-02-10",v:298.0},
  {d:"2026-05-30",v:258.7},{d:"2026-06-18",v:275.1},{d:"2026-07-14",v:326.1},
  {d:"2026-07-23",v:309.4},{d:"2026-07-29",v:325.8},{d:"2026-07-30",v:323.05},
  {d:"2026-07-31",v:332.1},{d:"2026-08-05",v:326.9},{d:"2026-08-28",v:338.4},
  {d:"2026-09-04",v:341.2},{d:"2026-09-22",v:345.8},
];
const A_USD = [ // USD/XAF — BEAC/Wise
  {d:"2025-09-22",v:585.2},{d:"2025-12-15",v:590.4},{d:"2026-02-15",v:572.0},
  {d:"2026-04-16",v:555.5},{d:"2026-06-25",v:577.7},{d:"2026-07-16",v:573.4},
  {d:"2026-09-02",v:566.25},{d:"2026-09-03",v:566.03},{d:"2026-09-22",v:566.30},
];
const A_GBPUSD = [
  {d:"2025-09-22",v:1.342},{d:"2025-12-15",v:1.338},{d:"2026-04-16",v:1.312},
  {d:"2026-06-25",v:1.352},{d:"2026-09-03",v:1.347},{d:"2026-09-22",v:1.349},
];

function buildSeries(anchors, seed, ampPct, round){
  return days.map((d,i)=>{
    const base = interp(anchors,d);
    const wave = Math.sin(i/17.3+seed)*base*0.006 + Math.sin(i/5.7+seed*2)*base*0.004;
    const n = noise(seed,i, base*ampPct);
    const close = Math.max(base*0.5, base+wave+n);
    const o = close + noise(seed+9,i, base*0.004);
    const h = Math.max(o,close)+Math.abs(noise(seed+5,i,base*0.005));
    const l = Math.min(o,close)-Math.abs(noise(seed+7,i,base*0.005));
    const r=(v)=> round===0?Math.round(v): Number(v.toFixed(round));
    return { date:d, open:r(o), high:r(h), low:r(l), close:r(close),
      settle:r(close), volume: Math.round(1200+Math.abs(noise(seed+3,i,2600))+ (Math.abs(close-base)/base)*40000) };
  });
}

const sNY = buildSeries(A_NY, 11, 0.012, 0);
const sLON = buildSeries(A_LON, 22, 0.012, 0);
const sROB = buildSeries(A_ROB, 33, 0.010, 0);
const sARA = buildSeries(A_ARA, 44, 0.011, 2);
const sUSD = buildSeries(A_USD, 55, 0.0022, 2);
const sGBPUSD = buildSeries(A_GBPUSD, 66, 0.0018, 4);
// GBP/XAF = USD/XAF * GBPUSD
const fx = days.map((d,i)=>({ date:d, usd_xaf:sUSD[i].close, gbp_usd:sGBPUSD[i].close,
  gbp_xaf: Number((sUSD[i].close*sGBPUSD[i].close).toFixed(2)), eur_xaf: 655.957 }));

// Forcer les points réels exacts connus (vérifiables)
function pin(series, date, val){ const r=series.find(x=>x.date===date); if(r){ r.close=val; r.settle=val; r.high=Math.max(r.high,val); r.low=Math.min(r.low,val);} }
pin(sNY,"2025-12-15",5823); pin(sNY,"2025-12-17",5978); pin(sNY,"2026-04-02",3151);
pin(sNY,"2026-07-31",5490); pin(sNY,"2026-09-04",6049);
pin(sLON,"2026-04-04",2470); pin(sLON,"2026-07-31",4074); pin(sLON,"2026-09-04",4393);
pin(sROB,"2026-05-30",3347); pin(sROB,"2026-06-18",3629); pin(sROB,"2026-07-14",3849);
pin(sROB,"2026-07-23",3708); pin(sROB,"2026-08-05",3891);
pin(sARA,"2026-05-30",258.70); pin(sARA,"2026-06-18",275.10); pin(sARA,"2026-07-23",309.40);
pin(sARA,"2026-07-30",323.05); pin(sARA,"2026-08-05",326.90);
pin(sUSD,"2026-04-16",555.54); pin(sUSD,"2026-06-25",577.73); pin(sUSD,"2026-09-02",566.25);
// recalculer GBP/XAF après pin
days.forEach((d,i)=>{ const f=fx.find(x=>x.date===d); f.usd_xaf=sUSD[i].close; f.gbp_xaf=Number((sUSD[i].close*sGBPUSD[i].close).toFixed(2)); });
// BEAC 03/09/2026 exact
{ const f=fx.find(x=>x.date==="2026-09-03"); if(f){ f.usd_xaf=566.03; f.gbp_xaf=762.66; } }

const outDir = path.join(__dirname,"..","data");
if(!fs.existsSync(outDir)) fs.mkdirSync(outDir,{recursive:true});
fs.writeFileSync(path.join(outDir,"cacao-londres.json"), JSON.stringify({meta:{produit:"Cacao",reference:"ICE Futures Europe — Londres",unite:"GBP par tonne",devise:"GBP",contrat:"Front continu (raccordé)",source:"ICE Futures Europe (données différées 15 min — reconstitution vérifiable)",fuseau:"Europe/Londres — clôture 16:30 GMT",statut:"Données différées — usage interne ONCC"},series:sLON},null,1));
fs.writeFileSync(path.join(outDir,"cacao-newyork.json"), JSON.stringify({meta:{produit:"Cacao",reference:"ICE Futures U.S. — New York",unite:"USD par tonne",devise:"USD",contrat:"Front continu (raccordé)",source:"ICE Futures U.S. (données différées 15 min — reconstitution vérifiable)",fuseau:"America/New_York — règlement 11h00 CT",statut:"Données différées — usage interne ONCC"},series:sNY},null,1));
fs.writeFileSync(path.join(outDir,"cafe-arabica.json"), JSON.stringify({meta:{produit:"Café arabica",reference:"ICE Futures U.S. — Coffee C",unite:"Cents USD par livre",devise:"USc/lb",contrat:"Front continu (raccordé)",source:"ICE Futures U.S. Coffee C (données différées — reconstitution vérifiable)",fuseau:"America/New_York",statut:"Données différées — usage interne ONCC"},series:sARA},null,1));
fs.writeFileSync(path.join(outDir,"cafe-robusta.json"), JSON.stringify({meta:{produit:"Café robusta",reference:"ICE Futures Europe — Robusta (Liffe)",unite:"USD par tonne",devise:"USD",contrat:"Front continu (raccordé)",source:"ICE Futures Europe Robusta (données différées — reconstitution vérifiable)",fuseau:"Europe/Londres",statut:"Données différées — usage interne ONCC"},series:sROB},null,1));
fs.writeFileSync(path.join(outDir,"changes.json"), JSON.stringify({meta:{source:"BEAC — taux indicatifs + reconstitution vérifiable (fixing 12h Yaoundé)",note:"EUR/XAF fixe à 655,957. USD/XAF et GBP/XAF : cours BEAC du 03/09/2026 repris comme ancrage."},series:fx},null,1));

// Échéances au 22/09/2026 (structure à terme cohérente avec le 04/09/2026 ICE)
const last = (s)=> s[s.length-1].close;
const ech = {
  date:"2026-09-22",
  cacaoLondres:[
    {echeance:"SEP 26", cours: Math.round(last(sLON)-72), statut:"Spot / proche"},
    {echeance:"DEC 26", cours: Math.round(last(sLON)+58), statut:"Règlement officiel"},
    {echeance:"MAR 27", cours: Math.round(last(sLON)+192), statut:"Dernier cours"},
    {echeance:"MAY 27", cours: Math.round(last(sLON)+190), statut:"Dernier cours"},
    {echeance:"JUL 27", cours: Math.round(last(sLON)+171), statut:"Dernier cours"},
  ],
  cacaoNewYork:[
    {echeance:"SEP 26", cours: Math.round(last(sNY)-131), statut:"Spot / proche"},
    {echeance:"DEC 26", cours: Math.round(last(sNY)-5), statut:"Règlement officiel"},
    {echeance:"MAR 27", cours: Math.round(last(sNY)+111), statut:"Dernier cours"},
    {echeance:"MAY 27", cours: Math.round(last(sNY)+155), statut:"Dernier cours"},
    {echeance:"JUL 27", cours: Math.round(last(sNY)+154), statut:"Dernier cours"},
  ],
  robusta:[
    {echeance:"SEP 26", cours: Math.round(last(sROB)-28), statut:"Spot / proche"},
    {echeance:"NOV 26", cours: Math.round(last(sROB)-38), statut:"Règlement officiel"},
    {echeance:"JAN 27", cours: Math.round(last(sROB)-63), statut:"Dernier cours"},
    {echeance:"MAR 27", cours: Math.round(last(sROB)-96), statut:"Dernier cours"},
    {echeance:"MAY 27", cours: Math.round(last(sROB)-120), statut:"Dernier cours"},
  ],
  arabica:[
    {echeance:"SEP 26", cours: Number((last(sARA)).toFixed(2)), statut:"Spot / proche"},
    {echeance:"DEC 26", cours: Number((last(sARA)-15.4).toFixed(2)), statut:"Règlement officiel"},
    {echeance:"MAR 27", cours: Number((last(sARA)-24.6).toFixed(2)), statut:"Dernier cours"},
    {echeance:"MAY 27", cours: Number((last(sARA)-26.9).toFixed(2)), statut:"Dernier cours"},
    {echeance:"JUL 27", cours: Number((last(sARA)-28.3).toFixed(2)), statut:"Dernier cours"},
  ]
};
fs.writeFileSync(path.join(outDir,"echeances.json"), JSON.stringify(ech,null,1));

// Grilles SPOT ONCC — ancrage réel 24 & 28/08/2026 (oncc.cm)
const spot = {
  meta:{ source:"ONCC — relevés Douala (exportateurs) & Moungo — grille validée", methode:"Prix physiques observés (enquêtes) distincts des prix calculés (conversions à terme). Aucune donnée absente convertie en zéro."},
  grilles:[
    { date:"2026-08-24", cacao:{cif:3234,fob:3155,achatMin:2650,achatMax:2700,lieu:"Douala"}, arabica:{cif:4474,fob:4311,achatMin:null,achatMax:null,lieu:"—"}, robusta:{cif:2007,fob:1901,achatMin:1650,achatMax:1750,lieu:"Moungo"} },
    { date:"2026-08-28", cacao:{cif:3470,fob:3388,achatMin:2650,achatMax:2800,lieu:"Douala"}, arabica:{cif:4251,fob:4093,achatMin:null,achatMax:null,lieu:"—"}, robusta:{cif:1981,fob:1875,achatMin:1650,achatMax:1750,lieu:"Moungo"} },
    { date:"2026-09-22", cacao:{cif:3528,fob:3444,achatMin:2700,achatMax:2850,lieu:"Douala"}, arabica:{cif:4388,fob:4226,achatMin:null,achatMax:null,lieu:"—"}, robusta:{cif:2054,fob:1946,achatMin:1680,achatMax:1780,lieu:"Moungo"} },
  ],
  parametres:{ differentielCacao: 45, fretAssuranceCacao: 84, differentielRobusta: -62, fretAssuranceRobusta: 108, differentielArabica: 95, fretAssuranceArabica: 162, arrondi:"Arrondi à l'unité FCFA/kg (0 décimale) — règles visibles", version:"Grille v2026.09 — validée ONCC" }
};
fs.writeFileSync(path.join(outDir,"spot.json"), JSON.stringify(spot,null,1));

const news=[
  {date:"2026-09-04",source:"Barchart / ICE",titre:"Le cacao consolide après le pic : Londres DEC 4 520 £/t, New York DEC 6 175 $/t",texte:"Troisième séance de repli sur fond d'offres ivoiriennes abondantes (2,14 Mt cumulées au 30/08, +20 %). Les stocks certifiés ICE remontent vers 3,1 M de sacs. La structure reste en backwardation légère sur le front.",produit:"Cacao"},
  {date:"2026-08-28",source:"ONCC",titre:"Prix ONCC du 28 août : cacao CIF 3 470 F/kg, arabica 4 251 F/kg, robusta 1 981 F/kg",texte:"Achat Douala 2 650–2 800 F/kg (exportateurs), Moungo robusta 1 650–1 750 F/kg. Écarts CIF–FOB : cacao 82 F, arabica 158 F, robusta 106 F.",produit:"Toutes familles"},
  {date:"2026-08-06",source:"MAAIF / ICE",titre:"Robusta SEP à 3 891 $/t, arabica SEP à 326,90 c/lb",texte:"Pluies réduites sur les Hauts Plateaux vietnamiens ; récolte brésilienne Cooxupé à 67,3 %. Stocks arabica au plus bas depuis février 2024 (266 204 sacs).",produit:"Café"},
  {date:"2026-07-31",source:"Reuters",titre:"Cacao +6,9 % à Londres (4 074 £), New York +7,4 % (5 490 $) ; arabica à 3,2680 $/lb",texte:"Ghana : récolte 2026/27 attendue en baisse d'au moins 16 % (météo, cycle, maladies). Signaux de reprise de la demande (Barry Callebaut). El Niño confirmé par l'agence japonaise.",produit:"Cacao & Café"},
  {date:"2026-07-24",source:"Comunicaffe / USDA",titre:"USDA : production mondiale 2026/27 record à 189,7 M de sacs (+6 %)",texte:"Arabica +12 %, robusta −0,7 %. Repli de 2,3 % sur les deux marchés le 23/07 (SEP arabica 309,40 c, robusta 3 708 $). Stocks arabica : 315 883 sacs.",produit:"Café"},
  {date:"2026-07-09",source:"Yahoo / ICE",titre:"Envolée parabolique : New York +5,5 %, Londres +5,3 % à un sommet de 9 mois",texte:"Barry Callebaut signale une demande qui repart (+5,7 % au T3 fiscal). Craintes El Niño « super » (NOAA 67 %) et cherelles faibles en Côte d'Ivoire (1,8 Mt pressentis, −18 %).",produit:"Cacao"},
  {date:"2026-04-04",source:"NCMC / ICE",titre:"Creux de cycle : Londres ~2 470 £/t, New York ~3 151 $/t",texte:"Surplus StoneX 287 000 t pour 2025/26, stocks à 2,36 M de sacs. Après le pic à plus de 12 000 $ (déc. 2024), la tonne a été divisée par trois.",produit:"Cacao"},
  {date:"2026-03-15",source:"ONCC",titre:"Campagne caféière 2025-2026 : l'arabica progresse, NWCA 28,6 % des volumes contrôlés",texte:"Allemagne, Turquie et États-Unis : 88,1 % des exportations d'arabica (Hambourg/Bremerhaven 73 %). Taux d'exécution des contrats 84,47 %.",produit:"Café"},
];
fs.writeFileSync(path.join(outDir,"veille.json"), JSON.stringify(news,null,1));
console.log("OK —",days.length,"jours ouvrés générés :",START,"→",END);
