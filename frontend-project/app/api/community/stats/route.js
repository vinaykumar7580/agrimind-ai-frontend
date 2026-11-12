import { proxyBackend } from "../../../../lib/proxyBackend";

export async function GET() {
  return proxyBackend("/community/stats");
}
