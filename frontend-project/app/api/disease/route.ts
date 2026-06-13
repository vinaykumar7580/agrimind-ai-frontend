import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        { success: false, error: "Crop leaf image is required" },
        { status: 400 }
      );
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(image.type)) {
      return NextResponse.json(
        { success: false, error: "Image must be JPG, PNG, or WebP" },
        { status: 400 }
      );
    }

    const backendForm = new FormData();
    backendForm.append("image", image);

    const res = await fetch(`${BACKEND_URL}/api/disease/detect`, {
      method: "POST",
      body: backendForm,
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Disease detection failed" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("[disease] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
