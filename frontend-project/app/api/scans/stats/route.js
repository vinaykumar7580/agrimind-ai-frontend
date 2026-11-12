import { getToken, proxyBackend, unauthorized } from "../../../../lib/proxyBackend";

export async function GET(req) {
  const token = getToken(req);
  if (!token) return unauthorized();

  return proxyBackend("/scan/stats", { token });
}
