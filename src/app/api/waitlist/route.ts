import { NextRequest, NextResponse } from "next/server";
import { sendEvent } from "basehub/events";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, dreamUniversity, gradeYear } = body;

    // Validate required fields
    if (!name || !email || !dreamUniversity || !gradeYear) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Get ingestKey from environment variable
    const ingestKey = process.env.BASEHUB_WAITLIST_INGEST_KEY;

    if (!ingestKey) {
      console.error("BASEHUB_WAITLIST_INGEST_KEY is not configured");
      return NextResponse.json(
        { success: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Send event to BaseHub Event Blocks
    await sendEvent(ingestKey as any, {
      name,
      email,
      dreamUniversity,
      gradeYear,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("BaseHub API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
        details: error?.body || error,
      },
      { status: 500 }
    );
  }
}

