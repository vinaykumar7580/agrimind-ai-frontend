import { proxyBackend, unauthorized } from "../../../../lib/proxyBackend";

export async function POST(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return unauthorized();

  const { message, scan_id } = await req.json();

  return proxyBackend("/chat/message", {
    method: "POST",
    token,
    body: { message, scan_id: scan_id ?? null },
  });
}
