import { promises as fs } from "fs";
import path from "path";
import { put, del, list, get } from "@vercel/blob";

const BLOB_PREFIX = "enquiries/";
const EMPTY = { version: 1, enquiries: [] };

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function getLocalPath() {
  if (process.env.ENQUIRY_STORAGE_PATH) {
    return path.resolve(process.env.ENQUIRY_STORAGE_PATH);
  }
  return path.join(process.cwd(), "storage", "enquiries.json");
}

async function streamToText(stream) {
  return new Response(stream).text();
}

/* ——— Local file (dev / VPS) ——— */

async function ensureLocalStore() {
  const filePath = getLocalPath();
  await fs.mkdir(/* turbopackIgnore: true */ path.dirname(filePath), {
    recursive: true,
  });
  try {
    await fs.access(/* turbopackIgnore: true */ filePath);
  } catch {
    await fs.writeFile(
      /* turbopackIgnore: true */ filePath,
      JSON.stringify(EMPTY, null, 2),
      "utf8",
    );
  }
  return filePath;
}

async function readLocalStore() {
  const filePath = await ensureLocalStore();
  const raw = await fs.readFile(/* turbopackIgnore: true */ filePath, "utf8");
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data.enquiries)) data.enquiries = [];
    return { filePath, data };
  } catch {
    return { filePath, data: { ...EMPTY } };
  }
}

async function writeLocalStore(filePath, data) {
  const tmp = `${filePath}.tmp`;
  await fs.writeFile(
    /* turbopackIgnore: true */ tmp,
    JSON.stringify(data, null, 2),
    "utf8",
  );
  await fs.rename(
    /* turbopackIgnore: true */ tmp,
    /* turbopackIgnore: true */ filePath,
  );
}

/* ——— Vercel Blob (production) ——— */

function blobPath(id) {
  return `${BLOB_PREFIX}${id}.json`;
}

async function listBlobEnquiries() {
  const enquiries = [];
  let cursor;
  do {
    const result = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
    for (const blob of result.blobs) {
      if (!blob.pathname.endsWith(".json")) continue;
      try {
        const got = await get(blob.pathname, {
          access: "private",
          useCache: false,
        });
        if (!got?.stream) continue;
        const text = await streamToText(got.stream);
        const item = JSON.parse(text);
        if (item?.id) enquiries.push(item);
      } catch (error) {
        console.error("blob read failed", blob.pathname, error);
      }
    }
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  return enquiries.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

async function readBlobEnquiry(id) {
  const got = await get(blobPath(id), { access: "private", useCache: false });
  if (!got?.stream) return null;
  const text = await streamToText(got.stream);
  return JSON.parse(text);
}

async function writeBlobEnquiry(enquiry) {
  await put(blobPath(enquiry.id), JSON.stringify(enquiry, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return enquiry;
}

async function deleteBlobEnquiry(id) {
  const pathname = blobPath(id);
  try {
    await del(pathname);
    return true;
  } catch (error) {
    // Fallback: resolve URL from list then delete
    const { blobs } = await list({ prefix: pathname, limit: 10 });
    const match = blobs.find((b) => b.pathname === pathname);
    if (!match) return false;
    await del(match.url);
    return true;
  }
}

function buildEnquiry(payload, existing = null) {
  const base = existing || {
    id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  return {
    ...base,
    name: String(payload.name ?? base.name ?? "").trim(),
    phone: String(payload.phone ?? base.phone ?? "").trim(),
    email: String(payload.email ?? base.email ?? "").trim(),
    eventType: String(payload.eventType ?? base.eventType ?? "").trim(),
    preferredDate: String(
      payload.preferredDate ?? base.preferredDate ?? "",
    ).trim(),
    guests: String(payload.guests ?? base.guests ?? "").trim(),
    message: String(payload.message ?? base.message ?? "").trim(),
    ...(existing ? { updatedAt: new Date().toISOString() } : {}),
  };
}

/* ——— Public API ——— */

export function getEnquiryStoragePath() {
  return useBlob() ? "vercel-blob:enquiries/" : getLocalPath();
}

export async function listEnquiries() {
  if (useBlob()) return listBlobEnquiries();
  const { data } = await readLocalStore();
  return [...data.enquiries].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

export async function getEnquiryById(id) {
  if (useBlob()) {
    try {
      return await readBlobEnquiry(id);
    } catch {
      return null;
    }
  }
  const list = await listEnquiries();
  return list.find((item) => item.id === id) || null;
}

export async function addEnquiry(payload) {
  const enquiry = buildEnquiry(payload);
  if (useBlob()) {
    return writeBlobEnquiry(enquiry);
  }
  const { filePath, data } = await readLocalStore();
  data.enquiries.push(enquiry);
  await writeLocalStore(filePath, data);
  return enquiry;
}

export async function updateEnquiry(id, payload) {
  if (useBlob()) {
    const current = await readBlobEnquiry(id);
    if (!current) return null;
    return writeBlobEnquiry(buildEnquiry(payload, current));
  }

  const { filePath, data } = await readLocalStore();
  const index = data.enquiries.findIndex((item) => item.id === id);
  if (index < 0) return null;
  const updated = buildEnquiry(payload, data.enquiries[index]);
  data.enquiries[index] = updated;
  await writeLocalStore(filePath, data);
  return updated;
}

export async function deleteEnquiry(id) {
  if (useBlob()) {
    try {
      return await deleteBlobEnquiry(id);
    } catch {
      return false;
    }
  }
  const { filePath, data } = await readLocalStore();
  const index = data.enquiries.findIndex((item) => item.id === id);
  if (index < 0) return false;
  data.enquiries.splice(index, 1);
  await writeLocalStore(filePath, data);
  return true;
}
