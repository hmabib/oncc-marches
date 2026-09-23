import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const revalidate = 900; // rafraîchi toutes les 15 min côté serveur
export const maxDuration = 30;

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";

async function fetchText(url: string, timeoutMs = 9000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" }, signal: ctl.signal, next: { revalidate: 900 } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.text();
  } finally {
    clearTimeout(t);
  }
}
async function fetchJSON(url: string, timeoutMs = 9000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA }, signal: ctl.signal, next: { revalidate: 900 } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

// --- ONCC : bandeau officiel des prix + dernières actualités (www.oncc.cm) ---
function parseONCC(html: string) {
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  const txt = clean.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const out: any = { bannerDate: null, cocoa: null, arabica: null, robusta: null, news: [] };
  const dm = txt.match(/Prices for\s+([A-Z][a-z]{2}\s+\d{1,2}\s+202\d)/);
  if (dm) out.bannerDate = dm[1];
  const grab = (name: RegExp) => {
    const m = txt.match(name);
    return m ? m[0] : null;
  };
  // blocs "Cocoa [ CIF: 3070FCFA/kg FOB: 2994FCFA/kg Buying Price Douala ... MIN: 2600FCFA/kg MAX: 2700FCFA/kg ]"
  const block = (label: string) => {
    const re = new RegExp(label + "\\s*\\[([^\\]]+)\\]", "i");
    const m = txt.match(re);
    if (!m) return null;
    const b = m[1];
    const num = (re2: RegExp) => {
      const x = b.match(re2);
      return x ? Number(x[1].replace(/,/g, "")) : null;
    };
    return {
      cif: num(/CIF:\s*([\d,]+)/i),
      fob: num(/FOB:\s*([\d,]+)/i),
      achatMin: num(/MIN:\s*([\d,]+)/i),
      achatMax: num(/MAX:\s*([\d,]+)/i),
      lieu: /Douala/i.test(b) ? "Douala" : /Moungo/i.test(b) ? "Moungo" : null,
    };
  };
  out.cocoa = block("Cocoa");
  const ara = block("Arabica Coffee") || block("Arabica");
  out.arabica = ara;
  out.robusta = block("Robusta Coffee") || block("Robusta");
  void grab;
  // actualités : liens "read more" précédés d'un titre — on récupère les titres d'articles ONCC
  const newsRe = /([A-Z][A-Za-z0-9’'&,:\-–— ]{25,140}?)\s*read more/gi;
  const seen = new Set<string>();
  let nm: RegExpExecArray | null;
  while ((nm = newsRe.exec(txt)) && out.news.length < 6) {
    const title = nm[1].replace(/\s+/g, " ").trim();
    if (title.length > 30 && !seen.has(title) && !/Learn More|Previous|Next/i.test(title)) {
      seen.add(title);
      out.news.push({ title, source: "ONCC", link: "https://www.oncc.cm/home" });
    }
  }
  return out;
}

// --- Yahoo Finance : cacao NY (CC=F), arabica (KC=F), changes indicatifs ---
const YHOSTS = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
async function yahooQuote(symbol: string, attempt = 0): Promise<any> {
  const host = YHOSTS[attempt % YHOSTS.length];
  try {
    const j = await fetchJSON(`https://${host}/v8/finance/chart/${symbol}?interval=1d&range=1mo`, 6500);
    const res = j?.chart?.result?.[0];
    if (!res) throw new Error("empty");
    const meta = res.meta;
    const closes: (number | null)[] = res.indicators?.quote?.[0]?.close ?? [];
    const ts: number[] = res.timestamp ?? [];
    const hist = ts
      .map((t, i) => ({ date: new Date(t * 1000).toISOString().slice(0, 10), close: closes[i] }))
      .filter((p) => typeof p.close === "number");
    if (!hist.length) throw new Error("no history");
    return {
      symbol,
      price: meta.regularMarketPrice,
      prevClose: meta.chartPreviousClose ?? meta.previousClose ?? null,
      currency: meta.currency,
      longName: meta.longName || meta.shortName || symbol,
      time: meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null,
      history: hist.slice(-30),
    };
  } catch (e) {
    if (attempt < 2) {
      await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      return yahooQuote(symbol, attempt + 1);
    }
    throw e;
  }
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- Google Actualités RSS (cacao / café) ---
function parseRSS(xml: string, limit = 5) {
  const items: any[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  const tag = (b: string, t: string) => {
    const x = b.match(new RegExp(`<${t}>([\\s\\S]*?)<\\/${t}>`));
    return x ? x[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
  };
  while ((m = re.exec(xml)) && items.length < limit) {
    const b = m[1];
    items.push({ title: tag(b, "title"), link: tag(b, "link"), pubDate: tag(b, "pubDate"), source: tag(b, "source") || "Google Actualités" });
  }
  return items;
}

export async function GET() {
  const fetchedAt = new Date().toISOString();
  // Les requêtes Yahoo sont séquencées (anti-429) ; le reste en parallèle.
  const [oncc, rssCacao, rssCafe] = await Promise.allSettled([
    fetchText("https://www.oncc.cm/home").then(parseONCC),
    fetchText("https://news.google.com/rss/search?q=cacao%20cours%20march%C3%A9&hl=fr&gl=FR&ceid=FR%3Afr").then((x) => parseRSS(x, 5)),
    fetchText("https://news.google.com/rss/search?q=caf%C3%A9%20arabica%20robusta%20cours&hl=fr&gl=FR&ceid=FR%3Afr").then((x) => parseRSS(x, 5)),
  ]);
  const quotes: Record<string, PromiseSettledResult<any>> = {};
  // 1re passe en parallèle (rapide), puis rattrapage séquencé des échecs (anti-429).
  const syms = [["cacaoNY", "CC=F"], ["arabica", "KC=F"], ["usdXaf", "USDXAF=X"], ["gbpXaf", "GBPXAF=X"]] as const;
  await Promise.all(
    syms.map(async ([key, sym]) => {
      try {
        quotes[key] = { status: "fulfilled", value: await yahooQuote(sym) } as PromiseFulfilledResult<any>;
      } catch (e) {
        quotes[key] = { status: "rejected", reason: String(e) } as PromiseRejectedResult;
      }
    })
  );
  for (const [key, sym] of syms) {
    if (quotes[key].status === "rejected") {
      await sleep(800);
      try {
        quotes[key] = { status: "fulfilled", value: await yahooQuote(sym) } as PromiseFulfilledResult<any>;
      } catch (e) {
        quotes[key] = { status: "rejected", reason: String(e) } as PromiseRejectedResult;
      }
    }
  }
  const val = (r: PromiseSettledResult<any>) => (r.status === "fulfilled" ? { ok: true as const, data: (r as PromiseFulfilledResult<any>).value } : { ok: false as const, error: String((r as PromiseRejectedResult).reason) });
  return NextResponse.json({
    fetchedAt,
    sources: {
      oncc: "https://www.oncc.cm/home",
      yahoo: "https://finance.yahoo.com (CC=F, KC=F, USDXAF=X, GBPXAF=X — cotations différées)",
      news: "Google Actualités RSS + ONCC",
    },
    oncc: val(oncc),
    quotes: { cacaoNY: val(quotes.cacaoNY), arabica: val(quotes.arabica), usdXaf: val(quotes.usdXaf), gbpXaf: val(quotes.gbpXaf) },
    news: { cacao: val(rssCacao), cafe: val(rssCafe) },
  });
}
