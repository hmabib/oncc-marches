// Captures d'écrans réelles via Chrome système (puppeteer-core, sans téléchargement Chromium)
const puppeteer = require("puppeteer-core");
const path = require("path");

const BASE = process.env.SHOT_BASE || "http://localhost:3111";
const OUT = process.env.SHOT_DIR || "/tmp/shots";
const PAGES = [
  ["accueil", "/"],
  ["cacao", "/cacao"],
  ["cafe", "/cafe"],
  ["conversions", "/conversions"],
  ["grilles", "/grilles"],
  ["historiques", "/historiques"],
  ["veille", "/veille"],
  ["fonctionnalites", "/fonctionnalites"],
  ["pilotage", "/pilotage"],
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900", "--hide-scrollbars"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  for (const [name, route] of PAGES) {
    await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 60000 });
    await new Promise((r) => setTimeout(r, 4500)); // laisser recharts + /api/live se résoudre
    await page.screenshot({ path: path.join(OUT, `${name}.png`) });
    console.log("OK", name);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
