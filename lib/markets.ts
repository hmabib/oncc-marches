export type Quote = { date: string; open: number; high: number; low: number; close: number; settle: number; volume: number };
export type FxRow = { date: string; usd_xaf: number; gbp_usd: number; gbp_xaf: number; eur_xaf: number };

export const LB_KG = 0.45359237;

// Conversions FCFA/kg — §5 fiche technique
export function gbpTonneToFcfaKg(prixGbTon: number, gbpXaf: number) {
  return (prixGbTon * gbpXaf) / 1000;
}
export function usdTonneToFcfaKg(prixUsdTon: number, usdXaf: number) {
  return (prixUsdTon * usdXaf) / 1000;
}
export function centsLbToFcfaKg(centsLb: number, usdXaf: number) {
  return ((centsLb / 100 / LB_KG) * usdXaf);
}

export function variation(prev: number, cur: number) {
  if (!prev) return { abs: 0, pct: 0 };
  const abs = cur - prev;
  return { abs, pct: (abs / prev) * 100 };
}

export const fmtInt = (v: number | null | undefined) =>
  v === null || v === undefined || Number.isNaN(v) ? "—" : Math.round(v).toLocaleString("fr-FR").replace(/,/g, " ");
export const fmt2 = (v: number | null | undefined) =>
  v === null || v === undefined || Number.isNaN(v) ? "—" : v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmtPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
export const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
};

export function stats(series: Quote[]) {
  if (!series.length) return null;
  const closes = series.map((q) => q.close);
  const min = Math.min(...closes), max = Math.max(...closes);
  const avg = closes.reduce((a, b) => a + b, 0) / closes.length;
  const first = closes[0], lastQ = closes[closes.length - 1];
  const rets = closes.slice(1).map((c, i) => (c - closes[i]) / closes[i]);
  const vol = Math.sqrt(rets.reduce((a, r) => a + r * r, 0) / Math.max(1, rets.length)) * Math.sqrt(252) * 100;
  return { min, max, avg, first, last: lastQ, perf: ((lastQ - first) / first) * 100, vol };
}
