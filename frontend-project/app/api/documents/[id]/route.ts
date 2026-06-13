import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/documents/${params.id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to delete document" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch (err) {
    console.error("[documents DELETE] error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
