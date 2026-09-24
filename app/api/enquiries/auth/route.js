import { NextResponse } from "next/server";
import {
  ENQUIRIES_COOKIE,
  enquiriesAuthToken,
  verifyEnquiriesPassword,
} from "@/lib/enquiries-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 12,
};

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const password = String(body.password || "");

    if (!verifyEnquiriesPassword(password)) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 401 },
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(ENQUIRIES_COOKIE, enquiriesAuthToken(), cookieOptions);
    return response;
  } catch (error) {
    console.error("enquiries auth", error);
    return NextResponse.json({ error: "Could not unlock." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ENQUIRIES_COOKIE, "", {
    ...cookieOptions,
    maxAge: 0,
  });
  return response;
}
