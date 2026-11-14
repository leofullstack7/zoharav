/**
 * Fills ar-catalog.json via the public Google Translate endpoint (batch).
 * Run: node scripts/translate-ar.mjs
 */
import fs from "node:fs";
import path from "node:path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function translateText(text, from = "en", to = "ar") {
  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", from);
  url.searchParams.set("tl", to);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`translate ${res.status}`);
  const data = await res.json();
  return data[0].map((part) => part[0]).join("");
}

const root = process.cwd();
const enList = JSON.parse(fs.readFileSync(path.join(root, "scripts", "en-strings.json"), "utf8"));
const outPath = path.join(root, "content", "translations", "ar-catalog.json");
const existing = fs.existsSync(outPath)
  ? JSON.parse(fs.readFileSync(outPath, "utf8"))
  : {};

const catalog = { ...existing };
let done = 0;

for (const key of enList) {
  if (key === "") {
    catalog[""] = "";
    continue;
  }
  if (catalog[key] && catalog[key].trim()) {
    done++;
    continue;
  }
  try {
    catalog[key] = await translateText(key);
    done++;
    if (done % 25 === 0) {
      fs.writeFileSync(outPath, JSON.stringify(catalog));
      console.log(`progress ${done}/${enList.length}`);
    }
    await sleep(120);
  } catch (err) {
    console.error("fail", key.slice(0, 60), err);
    await sleep(2000);
  }
}

fs.writeFileSync(outPath, JSON.stringify(catalog));
console.log(`done ${Object.keys(catalog).length}`);