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

function amcNum(name) {
  const m = name.match(/AMC(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
}

function inFacilityRange(name) {
  const n = amcNum(name);
  if (n == null) return false;
  return (n >= 8780 && n <= 8815) || (n >= 8835 && n <= 8855);
}

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

  const selected = new Map();

  images.forEach((img, index) => {
    if (inFacilityRange(img.name)) {
      selected.set(index, { reason: "facility" });
    }
  });

  for (let i = 200; i <= 350; i += 15) {
    if (images[i]) {
      selected.set(i, { reason: selected.has(i) ? "facility+sample" : "sample" });
    }
  }

  const manifest = [];
  const sorted = [...selected.entries()].sort((a, b) => a[0] - b[0]);

  for (const [index, meta] of sorted) {
    const img = images[index];
    const base = img.name.replace(/\.JPG$/i, "");
    const dest = path.join(outDir, `game-scan-${base}.webp`);
    await download(img.thumbnail_url, dest);
    const orientation = img.width >= img.height ? "landscape" : "portrait";
    manifest.push({
      file: path.basename(dest),
      index,
      name: img.name,
      amc: amcNum(img.name),
      orientation,
      width: img.width,
      height: img.height,
      reason: meta.reason,
      thumbnail_url: img.thumbnail_url,
      high_url: img.high_url,
    });
    console.log("saved", dest, orientation, meta.reason);
  }

  const pool = images.find((x) => x.name === "AMC08773.JPG");
  const poolIndex = images.indexOf(pool);

  fs.writeFileSync(
    path.join(outDir, "game-scan-manifest.json"),
    JSON.stringify(
      {
        totalImages: images.length,
        downloaded: manifest.length,
        poolRef: pool
          ? {
              index: poolIndex,
              name: pool.name,
              high_url: pool.high_url,
              width: pool.width,
              height: pool.height,
            }
          : null,
        items: manifest,
      },
      null,
      2
    )
  );

  console.log("done", manifest.length, "files");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
