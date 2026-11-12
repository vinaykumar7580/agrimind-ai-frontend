import { getToken, pickQuery, proxyBackend, unauthorized } from "../../../../lib/proxyBackend";

export async function GET(req) {
  const token = getToken(req);
  if (!token) return unauthorized();

  const query = pickQuery(req, ["skip", "limit", "scan_type", "search"]);
  return proxyBackend(`/scan/history${query}`, { token });
}
