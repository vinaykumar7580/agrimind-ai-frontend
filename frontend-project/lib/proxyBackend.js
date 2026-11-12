import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export function unauthorized() {
  return NextResponse.json(
    { success: false, message: "Unauthorized. Token not found." },
    { status: 401 }
  );
}

export function getToken(req) {
  return req.cookies.get("token")?.value;
}

// Copies only the listed query params from the incoming request, so callers
// cannot reach backend params the page never uses.
export function pickQuery(req, keys) {
  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();

  for (const key of keys) {
    const value = searchParams.get(key);
    if (value !== null && value !== "") params.set(key, value);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

// Route param ids must be positive integers before they go into a backend URL.
export function isId(value) {
  return /^\d+$/.test(String(value));
}

// Forwards a request to the FastAPI backend and returns its JSON with the same
// status. `body` is sent as JSON, `formData` as multipart. FastAPI sends plain
// text, not JSON, for an unhandled 500.
export async function proxyBackend(
  path,
  { method = "GET", token, body, formData } = {}
) {
  try {
    const headers = {};

    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const response = await fetch(`${BACKEND}${path}`, {
      method,
      headers,
      body: formData ?? (body !== undefined ? JSON.stringify(body) : undefined),
      cache: "no-store",
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error(`Backend ${method} ${path} ${response.status}: ${text}`);
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

// Passes a non-JSON backend response (such as a CSV download) through as-is.
export async function proxyBackendFile(path, { token } = {}) {
  try {
    const response = await fetch(`${BACKEND}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    const headers = new Headers();
    for (const name of ["content-type", "content-disposition"]) {
      const value = response.headers.get(name);
      if (value) headers.set(name, value);
    }

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
