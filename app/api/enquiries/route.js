import { NextResponse } from "next/server";
import { EVENT_TYPES } from "@/data/event-types";
import { addEnquiry, listEnquiries } from "@/lib/enquiries-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const enquiries = await listEnquiries();
    return NextResponse.json({
      enquiries: enquiries.map((item) => ({
        id: item.id,
        createdAt: item.createdAt,
        name: item.name,
        phone: item.phone,
        email: item.email,
        eventType: item.eventType,
      })),
    });
  } catch (error) {
    console.error("list enquiries", error);
    return NextResponse.json(
      { error: "Could not load enquiries." },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    const eventType = String(body.eventType || "").trim();

    if (!name || !phone || !email || !message) {
      return NextResponse.json(
        { error: "Name, phone, email and message are required." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }
    if (eventType && !EVENT_TYPES.includes(eventType)) {
      return NextResponse.json(
        { error: "Invalid event type." },
        { status: 400 },
      );
    }

    const enquiry = await addEnquiry({
      name,
      phone,
      email,
      eventType,
      preferredDate: body.preferredDate,
      guests: body.guests,
      message,
    });

    return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 });
  } catch (error) {
    console.error("save enquiry", error);
    const message =
      process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN
        ? "Storage is not configured. Add a Vercel Blob store to this project."
        : "Could not save enquiry.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
