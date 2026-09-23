const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.join(__dirname, "..");
const rawPath = path.join(root, "data/fotoowl-images-raw.json");
const outDir = path.join(root, "data/fotoowl-preview");

let text = fs.readFileSync(rawPath, "utf8");
if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
const images = JSON.parse(text);

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return download(res.headers.location, dest).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => file.close(() => resolve(dest)));
        file.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const selected = new Set();

  // Every 15th across full catalog
  for (let i = 0; i < images.length; i += 15) selected.add(i);

  // All portrait images (often interior rooms)
  images.forEach((img, i) => {
    if (img.width < img.height) selected.add(i);
  });

  const sorted = [...selected].sort((a, b) => a - b);
  const results = [];

  for (const index of sorted) {
    const img = images[index];
    const base = img.name.replace(/\.JPG$/i, "");
    const dest = path.join(outDir, `game-scan-${base}.webp`);
    if (!fs.existsSync(dest)) {
      await download(img.thumbnail_url, dest);
      console.log("saved", base);
    }
    results.push({
      index,
      name: img.name,
      orientation: img.width >= img.height ? "landscape" : "portrait",
      high_url: img.high_url,
    });
  }

  fs.writeFileSync(
    path.join(outDir, "game-scan-broad-manifest.json"),
    JSON.stringify({ total: results.length, items: results }, null, 2)
  );
  console.log("done", results.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
