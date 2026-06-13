import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Soil report file is required" },
        { status: 400 }
      );
    }

    // Forward multipart to backend
    const backendForm = new FormData();
    backendForm.append("file", file);

    const res = await fetch(`${BACKEND_URL}/api/soil/analyze`, {
      method: "POST",
      body: backendForm,
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Soil analysis failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[soil] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
