import { getToken, proxyBackendFile, unauthorized } from "../../../../lib/proxyBackend";

export async function GET(req) {
  const token = getToken(req);
  if (!token) return unauthorized();

  return proxyBackendFile("/scan/export", { token });
}
