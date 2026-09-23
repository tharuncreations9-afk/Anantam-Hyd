const fs = require("fs");
const path = require("path");
const https = require("https");
const root = path.join(__dirname, "..");
let t = fs.readFileSync(path.join(root, "data/fotoowl-images-raw.json"), "utf8");
if (t.charCodeAt(0) === 0xfeff) t = t.slice(1);
const images = JSON.parse(t);
const names = process.argv.slice(2);
const outDir = path.join(root, "data/fotoowl-preview");
function dl(url, dest) {
  return new Promise((res, rej) => {
    https.get(url, (r) => {
      if (r.statusCode >= 300 && r.statusCode < 400 && r.headers.location) return dl(r.headers.location, dest).then(res, rej);
      if (r.statusCode !== 200) return rej(new Error(String(r.statusCode)));
      const f = fs.createWriteStream(dest);
      r.pipe(f);
      f.on("finish", () => f.close(() => res(dest)));
    }).on("error", rej);
  });
}
(async () => {
  for (const n of names) {
    const img = images.find((x) => x.name === n);
    if (!img) { console.log("missing", n); continue; }
    const base = n.replace(/\.JPG$/i, "");
    const dest = path.join(outDir, `game-scan-${base}.webp`);
    await dl(img.thumbnail_url, dest);
    console.log("saved", base, "idx", images.indexOf(img));
  }
})();
