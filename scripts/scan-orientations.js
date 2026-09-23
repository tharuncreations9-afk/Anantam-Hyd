const fs = require("fs");
const path = require("path");
const rawPath = path.join(__dirname, "../data/fotoowl-images-raw.json");
let text = fs.readFileSync(rawPath, "utf8");
if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
const images = JSON.parse(text);
const lines = [];
for (const [lo, hi] of [
  [180, 280],
  [380, 444],
]) {
  lines.push(`${lo}-${hi} portrait:`);
  for (let i = lo; i <= hi; i++) {
    const x = images[i];
    if (x && x.width < x.height) lines.push(`${i} ${x.name}`);
  }
}
fs.writeFileSync(path.join(__dirname, "../data/fotoowl-preview/orientation-scan.txt"), lines.join("\n"));
console.log("wrote", lines.length, "lines");
