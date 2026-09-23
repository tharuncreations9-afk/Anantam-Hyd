import fs from "fs";
import { galleryItems } from "../data/gallery.js";

function extractUuid(url) {
  const m = (url || "").match(/\/v2\/([0-9a-f-]{36})\//i);
  return m ? m[1] : null;
}

function urlWithoutQuery(url) {
  return (url || "").split("?")[0];
}

function extractAmc(url) {
  const m = (url || "").match(/AMC\d+/i);
  return m ? m[0].toUpperCase() : null;
}

function extractLast(url) {
  const m = (url || "").match(/[?&]last=([^&]+)/);
  return m ? m[1] : null;
}

function groupBy(items, keyFn) {
  const map = new Map();
  items.forEach((item, idx) => {
    const key = keyFn(item, idx);
    if (!key) return;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push({ idx, item });
  });
  return [...map.entries()].filter(([, arr]) => arr.length > 1);
}

const uuidDupes = groupBy(galleryItems, (item) =>
  extractUuid(item.image) || extractUuid(item.thumb)
);

const imageUrlDupes = groupBy(galleryItems, (item) =>
  urlWithoutQuery(item.image)
);

const amcDupes = groupBy(galleryItems, (item) => extractAmc(item.image));

// Cross-item: one item's thumb base equals another's image base
const thumbCrossMatches = [];
galleryItems.forEach((item, idx) => {
  const thumbBase = urlWithoutQuery(item.thumb);
  galleryItems.forEach((other, oidx) => {
    if (idx !== oidx && thumbBase === urlWithoutQuery(other.image)) {
      thumbCrossMatches.push({ idx, oidx, id: item.id, otherId: other.id });
    }
  });
});

const consecutiveSame = [];
for (let i = 0; i < galleryItems.length - 1; i++) {
  const a = galleryItems[i];
  const b = galleryItems[i + 1];
  const lastA = extractLast(a.image);
  const lastB = extractLast(b.image);
  if (a.width === b.width && a.height === b.height && lastA === lastB) {
    consecutiveSame.push({
      i,
      amcA: extractAmc(a.image),
      amcB: extractAmc(b.image),
      idA: a.id,
      idB: b.id,
      uuidA: extractUuid(a.image),
      uuidB: extractUuid(b.image),
      last: lastA,
    });
  }
}

const scrollIndices = [0, 26, 78, 130, 208, 52, 230, 156, 313, 182];

const report = {
  total: galleryItems.length,
  counts: {
    uuidDupeGroups: uuidDupes.length,
    uuidDupeExtraItems: uuidDupes.reduce((s, [, a]) => s + a.length - 1, 0),
    imageUrlDupeGroups: imageUrlDupes.length,
    imageUrlDupeExtraItems: imageUrlDupes.reduce((s, [, a]) => s + a.length - 1, 0),
    amcDupeGroups: amcDupes.length,
    amcDupeExtraItems: amcDupes.reduce((s, [, a]) => s + a.length - 1, 0),
    thumbCrossMatches: thumbCrossMatches.length,
    consecutiveSameDimsLast: consecutiveSame.length,
  },
  uuidDupeGroups: uuidDupes.map(([uuid, arr]) => ({
    uuid,
    items: arr.map(({ idx, item }) => ({
      idx,
      id: item.id,
      amc: extractAmc(item.image),
      title: item.title,
    })),
  })),
  imageUrlDupeGroups: imageUrlDupes.map(([url, arr]) => ({
    url,
    items: arr.map(({ idx, item }) => ({
      idx,
      id: item.id,
      title: item.title,
    })),
  })),
  amcDupeGroups: amcDupes.map(([amc, arr]) => ({
    amc,
    items: arr.map(({ idx, item }) => ({
      idx,
      id: item.id,
      uuid: extractUuid(item.image),
      title: item.title,
    })),
  })),
  thumbCrossMatches,
  consecutiveSameDimsLast: consecutiveSame,
  scrollGallery: scrollIndices.map((i) => ({
    index: i,
    id: galleryItems[i]?.id,
    uuid: extractUuid(galleryItems[i]?.image),
  })),
};

console.log(JSON.stringify(report, null, 2));
