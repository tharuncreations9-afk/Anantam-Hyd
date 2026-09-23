const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.join(__dirname, "..");
const rawPath = path.join(root, "data/fotoowl-images-raw.json");
const outDir = path.join(root, "data/fotoowl-preview");

let text = fs.readFileSync(rawPath, "utf8");
if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
const images = JSON.parse(text);

console.log("Total images:", images.length);

// Landscape candidates likely post-pool / facility areas (skip pool block 182-208)
const picks = [209, 218, 225, 235, 245, 255, 265, 275, 385, 395, 410, 430];
const poolRefs = ["AMC08727.JPG", "AMC08773.JPG"];

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
  const manifest = [];

  for (const idx of picks) {
    const img = images[idx];
    if (!img) throw new Error(`Missing index ${idx}`);
    const base = img.name.replace(/\.JPG$/i, "");
    const dest = path.join(outDir, `find-game-${base}.webp`);
    await download(img.thumbnail_url, dest);
    manifest.push({
      file: path.basename(dest),
      index: idx,
      name: img.name,
      width: img.width,
      height: img.height,
      high_url: img.high_url,
    });
    console.log("saved", dest);
  }

  for (const name of poolRefs) {
    const img = images.find((x) => x.name === name);
    if (!img) throw new Error(`Missing ${name}`);
    const base = name.replace(/\.JPG$/i, "");
    const dest = path.join(outDir, `find-game-pool-ref-${base}.webp`);
    await download(img.thumbnail_url, dest);
    manifest.push({
      file: path.basename(dest),
      index: images.indexOf(img),
      name: img.name,
      width: img.width,
      height: img.height,
      high_url: img.high_url,
      poolRef: true,
    });
    console.log("saved", dest);
  }

  fs.writeFileSync(
    path.join(outDir, "find-game-manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log("done", manifest.length, "files");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
