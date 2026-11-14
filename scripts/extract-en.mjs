import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "content");
const en = new Set();

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (name.endsWith(".ts")) {
      const text = fs.readFileSync(p, "utf8");
      const re = /en:\s*(["'`])((?:\\.|(?!\1)[\s\S])*)\1/g;
      let m;
      while ((m = re.exec(text))) {
        en.add(m[2].replace(/\\n/g, "\n"));
      }
    }
  }
}

walk(root);
const sorted = [...en].sort();
fs.writeFileSync(
  path.join(process.cwd(), "scripts", "en-strings.json"),
  JSON.stringify(sorted, null, 2),
);
console.log(sorted.length);