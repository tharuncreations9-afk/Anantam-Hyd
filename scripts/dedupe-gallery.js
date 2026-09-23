import fs from "fs";
import { galleryItems } from "../data/gallery.js";

function getLast(item) {
  const m = (item.image || "").match(/[?&]last=(\d+)/);
  return m ? m[1] : null;
}

function getAmc(item) {
  const m = (item.image || "").match(/AMC(\d+)/i);
  return m ? parseInt(m[1], 10) : 0;
}

// 1) Unique by AMC
const byAmc = new Map();
for (const item of galleryItems) {
  const amc = (item.image.match(/AMC\d+/i) || [])[0]?.toUpperCase();
  if (!amc) continue;
  if (!byAmc.has(amc)) byAmc.set(amc, item);
}
let list = [...byAmc.values()].sort((a, b) => getAmc(a) - getAmc(b));

// 2) Collapse consecutive burst clusters (same last= timestamp) → keep 1
const collapsed = [];
let i = 0;
while (i < list.length) {
  const last = getLast(list[i]);
  let j = i + 1;
  if (last) {
    while (j < list.length && getLast(list[j]) === last) j++;
  }
  // keep first of cluster (one clear frame per burst)
  collapsed.push(list[i]);
  i = Math.max(j, i + 1);
}

// 3) Also drop consecutive AMC frames within +1/+2 of previous kept (near-identical shots)
const thinned = [];
for (const item of collapsed) {
  const n = getAmc(item);
  const prev = thinned[thinned.length - 1];
  if (prev && Math.abs(n - getAmc(prev)) <= 1) continue;
  thinned.push(item);
}

console.log({
  original: galleryItems.length,
  byAmc: list.length,
  afterLastCluster: collapsed.length,
  afterNearConsecutive: thinned.length,
});

const titles = {
  resort: ["Resort Arrival", "Architecture", "Courtyard", "Pavilion", "Entrance", "Resort Grounds"],
  stays: ["Guest Suite", "Quiet Interiors", "Private Living", "Suite Details", "Room Sanctuary"],
  nature: ["Garden Path", "Tropical Greens", "Landscaped Lawns", "Garden Walk", "Lush Grounds"],
  pool: ["Pool Deck", "Still Water", "Poolside Lounge", "Day by the Pool", "Water Edge"],
  weddings: ["Celebration Lawn", "Gathering Space", "Open Sky Lawn", "Ceremony Setting", "Wedding Greens"],
  dining: ["Dining Pavilion", "Outdoor Kitchen", "Shared Table", "Culinary Space", "Dining Atmosphere"],
};

const counts = {};
const final = thinned.map((item) => {
  const cat = item.category || "resort";
  counts[cat] = (counts[cat] || 0) + 1;
  const pool = titles[cat] || titles.resort;
  return {
    ...item,
    title: pool[(counts[cat] - 1) % pool.length],
  };
});

const galleryJs = `/** Anantam FotoOwl gallery — unique photos only (burst duplicates removed). */
export const galleryItems = ${JSON.stringify(final, null, 2)};

export const galleryCategories = [
  { id: "all", label: "All" },
  { id: "resort", label: "Resort" },
  { id: "stays", label: "Stays" },
  { id: "dining", label: "Dining" },
  { id: "pool", label: "Pool" },
  { id: "weddings", label: "Weddings" },
  { id: "nature", label: "Nature" },
];
`;

fs.writeFileSync(new URL("../data/gallery.js", import.meta.url), galleryJs);
console.log("wrote", final.length, "unique images");
