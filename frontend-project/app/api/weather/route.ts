import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location") || "Nashik,IN";

    const res = await fetch(
      `${BACKEND_URL}/api/weather?location=${encodeURIComponent(location)}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch weather" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[weather] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
