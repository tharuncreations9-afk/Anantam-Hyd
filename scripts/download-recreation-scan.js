const fs = require("fs");
const path = require("path");
const https = require("https");

const root = path.join(__dirname, "..");
let text = fs.readFileSync(path.join(root, "data/fotoowl-images-raw.json"), "utf8");
if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
const images = JSON.parse(text);
const outDir = path.join(root, "data/fotoowl-preview");

function amcNum(name) {
  const m = name.match(/AMC(\d+)/i);
  return m ? parseInt(m[1], 10) : null;
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
  const selected = images.filter((img) => {
    const n = amcNum(img.name);
    if (n == null) return false;
    return (n >= 8600 && n <= 8615) || (n >= 8860 && n <= 8890);
  });

  selected.sort((a, b) => amcNum(a.name) - amcNum(b.name));
  const manifest = [];

  for (const img of selected) {
    const base = img.name.replace(/\.JPG$/i, "");
    const dest = path.join(outDir, `rec-scan-${base}.webp`);
    await download(img.thumbnail_url, dest);
    const index = images.indexOf(img);
    const orientation = img.width >= img.height ? "landscape" : "portrait";
    manifest.push({
      file: path.basename(dest),
      index,
      name: img.name,
      amc: amcNum(img.name),
      orientation,
      width: img.width,
      height: img.height,
      high_url: img.high_url,
    });
    console.log("saved", base, orientation);
  }

  fs.writeFileSync(
    path.join(outDir, "rec-scan-manifest.json"),
    JSON.stringify({ downloaded: manifest.length, items: manifest }, null, 2)
  );
  console.log("done", manifest.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
