import { proxyBackend, unauthorized } from "../../../../lib/proxyBackend";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return unauthorized();

  // Forward only the paging params the backend understands.
  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();

  for (const key of ["skip", "limit"]) {
    const value = searchParams.get(key);
    if (value !== null && /^\d+$/.test(value)) params.set(key, value);
  }

  const query = params.toString();

  return proxyBackend(`/chat/history${query ? `?${query}` : ""}`, { token });
}

export async function DELETE(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return unauthorized();

  return proxyBackend("/chat/history", { method: "DELETE", token });
}
