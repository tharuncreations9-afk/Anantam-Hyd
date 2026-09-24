import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const ENQUIRIES_COOKIE = "enquiries_view";

export function getEnquiriesPassword() {
  return process.env.ENQUIRIES_VIEW_PASSWORD || "Nk1684";
}

export function enquiriesAuthToken() {
  return createHash("sha256")
    .update(`anantam-enquiries:${getEnquiriesPassword()}`)
    .digest("hex");
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyEnquiriesPassword(password) {
  return safeEqual(String(password || ""), getEnquiriesPassword());
}

export function isEnquiriesAuthenticated(request) {
  const cookie = request.cookies.get(ENQUIRIES_COOKIE)?.value;
  if (cookie && safeEqual(cookie, enquiriesAuthToken())) return true;

  const header = request.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (bearer && verifyEnquiriesPassword(bearer)) return true;

  return false;
}

export function unauthorizedEnquiriesResponse() {
  return NextResponse.json(
    { error: "Password required." },
    {
      status: 401,
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    },
  );
}
