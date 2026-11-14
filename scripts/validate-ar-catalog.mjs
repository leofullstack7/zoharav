/**
 * Ensures ar-catalog.json has every string from en-strings.json.
 * Run: node scripts/validate-ar-catalog.mjs
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enList = JSON.parse(fs.readFileSync(path.join(root, "scripts", "en-strings.json"), "utf8"));
const catalog = JSON.parse(fs.readFileSync(path.join(root, "content", "translations", "ar-catalog.json"), "utf8"));

const missing = enList.filter((key) => key && !catalog[key]?.trim());
const badBrand = Object.entries(catalog).filter(([, v]) => /زوهاراف/.test(String(v)));

if (missing.length) {
  console.error(`Missing ${missing.length} Arabic values (first 5):`, missing.slice(0, 5));
  process.exit(1);
}
if (badBrand.length) {
  console.error(`Found ${badBrand.length} entries with incorrect Zoharav transliteration.`);
  process.exit(1);
}
console.log(`OK — ${enList.length} source strings, catalog complete.`);