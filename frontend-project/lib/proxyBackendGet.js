import { NextResponse } from "next/server";

// Forwards a GET to the FastAPI backend and returns its JSON with the same
// status. FastAPI sends plain text, not JSON, for an unhandled 500.
export async function proxyBackendGet(path) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${path}`,
      { method: "GET", cache: "no-store" }
    );

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error(`Backend ${path} ${response.status}: ${text}`);
      data = { success: false, message: "Backend service error" };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
