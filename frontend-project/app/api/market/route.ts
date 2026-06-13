import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const crops = searchParams.get("crops");

    const url = new URL(`${BACKEND_URL}/api/market`);
    if (crops) url.searchParams.set("crops", crops);

    const res = await fetch(url.toString());

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch market data" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[market] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
