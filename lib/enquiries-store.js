import { promises as fs } from "fs";
import path from "path";

/**
 * Enquiry data lives outside the Next.js build output.
 * Default: <project>/storage/enquiries.json (gitignored).
 * Override with ENQUIRY_STORAGE_PATH so deploys never overwrite guest data —
 * e.g. ENQUIRY_STORAGE_PATH=/var/lib/anantam/enquiries.json
 */
function getStoragePath() {
  if (process.env.ENQUIRY_STORAGE_PATH) {
    return path.resolve(process.env.ENQUIRY_STORAGE_PATH);
  }
  // Statically scoped under ./storage so Turbopack does not trace the whole project
  return path.join(process.cwd(), "storage", "enquiries.json");
}

async function ensureStore() {
  const filePath = getStoragePath();
  await fs.mkdir(/* turbopackIgnore: true */ path.dirname(filePath), {
    recursive: true,
  });
  try {
    await fs.access(/* turbopackIgnore: true */ filePath);
  } catch {
    await fs.writeFile(
      /* turbopackIgnore: true */ filePath,
      JSON.stringify({ version: 1, enquiries: [] }, null, 2),
      "utf8",
    );
  }
  return filePath;
}

async function readStore() {
  const filePath = await ensureStore();
  const raw = await fs.readFile(/* turbopackIgnore: true */ filePath, "utf8");
  try {
    const data = JSON.parse(raw);
    if (!Array.isArray(data.enquiries)) data.enquiries = [];
    return { filePath, data };
  } catch {
    return { filePath, data: { version: 1, enquiries: [] } };
  }
}

async function writeStore(filePath, data) {
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

export function getEnquiryStoragePath() {
  return getStoragePath();
}

export async function listEnquiries() {
  const { data } = await readStore();
  return [...data.enquiries].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );
}

export async function getEnquiryById(id) {
  const list = await listEnquiries();
  return list.find((item) => item.id === id) || null;
}

export async function addEnquiry(payload) {
  const { filePath, data } = await readStore();
  const enquiry = {
    id: `enq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
    name: String(payload.name || "").trim(),
    phone: String(payload.phone || "").trim(),
    email: String(payload.email || "").trim(),
    eventType: String(payload.eventType || "").trim(),
    preferredDate: String(payload.preferredDate || "").trim(),
    guests: String(payload.guests || "").trim(),
    message: String(payload.message || "").trim(),
  };
  data.enquiries.push(enquiry);
  await writeStore(filePath, data);
  return enquiry;
}

export async function updateEnquiry(id, payload) {
  const { filePath, data } = await readStore();
  const index = data.enquiries.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const current = data.enquiries[index];
  const updated = {
    ...current,
    name: String(payload.name ?? current.name).trim(),
    phone: String(payload.phone ?? current.phone).trim(),
    email: String(payload.email ?? current.email).trim(),
    eventType: String(payload.eventType ?? current.eventType).trim(),
    preferredDate: String(payload.preferredDate ?? current.preferredDate).trim(),
    guests: String(payload.guests ?? current.guests).trim(),
    message: String(payload.message ?? current.message).trim(),
    updatedAt: new Date().toISOString(),
  };
  data.enquiries[index] = updated;
  await writeStore(filePath, data);
  return updated;
}

export async function deleteEnquiry(id) {
  const { filePath, data } = await readStore();
  const index = data.enquiries.findIndex((item) => item.id === id);
  if (index < 0) return false;
  data.enquiries.splice(index, 1);
  await writeStore(filePath, data);
  return true;
}
