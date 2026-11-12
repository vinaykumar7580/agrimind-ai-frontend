import { proxyBackend } from "../../../../lib/proxyBackend";

export async function GET() {
  return proxyBackend("/market/forecast");
}
