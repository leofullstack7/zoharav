/* eslint-disable @typescript-eslint/no-require-imports */
const sharp = require("sharp");
const path = require("path");

const files = [
  "images/firm/office.svg",
  "images/contact/tower.svg",
  "images/offices/miami.svg",
  "images/hero/yacht.svg",
  "images/investment/handshake.svg",
  "images/mining/emeralds.svg",
  "images/pillars/oil-energy.svg",
  "images/services/jet.svg",
  "images/sustainability/plant.svg",
];

(async () => {
  for (const rel of files) {
    const srcPath = path.join(__dirname, "..", "public", rel);
    const outPath = srcPath.replace(/\.svg$/, ".png");
    await sharp(srcPath)
      .resize(1200, 630, { fit: "contain", background: "#07070a" })
      .png()
      .toFile(outPath);
    console.log("wrote", outPath);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
