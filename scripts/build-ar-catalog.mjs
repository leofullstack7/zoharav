/**
 * Builds content/translations/ar-catalog.json from scripts/ar-chunks/*.json
 * Each chunk is { "English source": "Arabic text", ... }
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const enList = JSON.parse(fs.readFileSync(path.join(root, "scripts", "en-strings.json"), "utf8"));
const chunksDir = path.join(root, "scripts", "ar-chunks");
const merged = {};

if (fs.existsSync(chunksDir)) {
  for (const file of fs.readdirSync(chunksDir).filter((f) => f.endsWith(".json"))) {
    Object.assign(merged, JSON.parse(fs.readFileSync(path.join(chunksDir, file), "utf8")));
  }
}

const out = {};
for (const key of enList) {
  if (key === "") {
    out[""] = "";
    continue;
  }
  out[key] = merged[key] ?? "";
}

const missing = enList.filter((k) => k && !merged[k]).length;
fs.writeFileSync(path.join(root, "content", "translations", "ar-catalog.json"), JSON.stringify(out, null, 0));
console.log(`catalog keys: ${Object.keys(out).length}, missing translations: ${missing}`);