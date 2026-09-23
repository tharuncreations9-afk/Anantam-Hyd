const fs = require("fs");

const raw = JSON.parse(
  fs.readFileSync("data/fotoowl-images-raw.json", "utf8").replace(/^\uFEFF/, "")
);

function pick(i) {
  const img = raw[i];
  return img.high_url || img.med_url;
}

function aspectOf(img) {
  const r = img.width / img.height;
  if (r < 0.85) return "tall";
  if (r > 1.35) return "wide";
  return "square";
}

function categoryFor(index, img) {
  if (index < 40) return "resort";
  if (index < 100) return img.width < img.height ? "stays" : "resort";
  if (index < 160) return "nature";
  if (index < 240) return "pool";
  if (index < 320) return "weddings";
  if (index < 380) return "dining";
  return img.width < img.height ? "stays" : "resort";
}

const titles = {
  resort: [
    "Resort Arrival",
    "Architecture",
    "Courtyard",
    "Pavilion",
    "Entrance",
    "Resort Grounds",
    "Stone Pathways",
    "Open Courtyard",
  ],
  stays: [
    "Guest Suite",
    "Quiet Interiors",
    "Private Living",
    "Suite Details",
    "Room Sanctuary",
    "Cottage Calm",
    "Soft Suites",
    "Stay Moments",
  ],
  nature: [
    "Garden Path",
    "Tropical Greens",
    "Landscaped Lawns",
    "Garden Walk",
    "Lush Grounds",
    "Tree Canopy",
    "Outdoor Quiet",
    "Nature Edges",
  ],
  pool: [
    "Pool Deck",
    "Still Water",
    "Poolside Lounge",
    "Infinity Leisure",
    "Pool Pavilion",
    "Day by the Pool",
    "Cabana Light",
    "Water Edge",
  ],
  weddings: [
    "Celebration Lawn",
    "Gathering Space",
    "Open Sky Lawn",
    "Event Landscape",
    "Ceremony Setting",
    "Evening Grounds",
    "Celebration Light",
    "Wedding Greens",
  ],
  dining: [
    "Dining Pavilion",
    "Outdoor Kitchen",
    "Hospitality Setup",
    "Shared Table",
    "Culinary Space",
    "Evening Service",
    "Gathering Table",
    "Dining Atmosphere",
  ],
};

const galleryItems = raw.map((img, index) => {
  const category = categoryFor(index, img);
  const pool = titles[category];
  return {
    id: `g${img.id}`,
    title: pool[index % pool.length],
    category,
    image: img.high_url || img.med_url,
    thumb: img.med_url || img.thumbnail_url,
    aspect: aspectOf(img),
    width: img.width,
    height: img.height,
  };
});

const images = {
  hero: pick(0),
  intro: pick(26),
  stay: pick(78),
  dine: pick(365),
  celebrate: pick(52),
  unwind: pick(208),
  accommodation: pick(104),
  cottage: pick(417),
  room: pick(78),
  dining: pick(355),
  diningDetail: pick(360),
  privateDining: pick(370),
  wedding: pick(230),
  weddingLawn: pick(52),
  pool: pick(208),
  lawn: pick(52),
  garden: pick(130),
  nature: pick(156),
  architecture: pick(12),
  detail: pick(313),
  cta: pick(182),
  location: pick(261),
  contact: pick(5),
  blogFeatured: pick(26),
  blog1: pick(130),
  blog2: pick(230),
  blog3: pick(100),
  blog4: pick(208),
};

const imagesJs = `/**
 * Centralized Anantam Resort imagery.
 * Source: FotoOwl gallery (Amazing Clicks) event 361477
 * https://site.fotoowl.ai/amazingclicks/gallery/361477
 * Full set lives in data/gallery.js
 */
export const images = ${JSON.stringify(images, null, 2)};

export const FOTOOWL_EVENT_ID = 361477;
export const FOTOOWL_GALLERY_URL =
  "https://site.fotoowl.ai/amazingclicks/gallery/361477?pass_key=773582";
`;

const galleryJs = `/** All Anantam photos from FotoOwl gallery event 361477. */
export const galleryItems = ${JSON.stringify(galleryItems, null, 2)};

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

fs.writeFileSync("data/images.js", imagesJs);
fs.writeFileSync("data/gallery.js", galleryJs);

const counts = galleryItems.reduce((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

console.log(`Wrote ${galleryItems.length} gallery items`);
console.log(counts);
