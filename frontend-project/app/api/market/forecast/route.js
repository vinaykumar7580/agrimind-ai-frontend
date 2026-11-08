import { proxyBackendGet } from "../../../../lib/proxyBackendGet";

export async function GET() {
  return proxyBackendGet("/market/forecast");
}
