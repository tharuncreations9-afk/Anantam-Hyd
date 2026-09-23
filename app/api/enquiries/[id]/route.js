import { NextResponse } from "next/server";
import { EVENT_TYPES } from "@/data/event-types";
import {
  deleteEnquiry,
  getEnquiryById,
  updateEnquiry,
} from "@/lib/enquiries-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const enquiry = await getEnquiryById(id);
    if (!enquiry) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ enquiry });
  } catch (error) {
    console.error("get enquiry", error);
    return NextResponse.json(
      { error: "Could not load enquiry." },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
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

    const enquiry = await updateEnquiry(id, {
      name,
      phone,
      email,
      eventType,
      preferredDate: body.preferredDate,
      guests: body.guests,
      message,
    });

    if (!enquiry) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, enquiry });
  } catch (error) {
    console.error("update enquiry", error);
    return NextResponse.json(
      { error: "Could not update enquiry." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const removed = await deleteEnquiry(id);
    if (!removed) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("delete enquiry", error);
    return NextResponse.json(
      { error: "Could not delete enquiry." },
      { status: 500 },
    );
  }
}
