import { getToken, pickQuery, proxyBackend, unauthorized } from "../../../../lib/proxyBackend";

export async function GET(req) {
  // Optional: with a token the backend also returns liked/bookmarked/is_mine.
  const token = getToken(req);
  const query = pickQuery(req, ["skip", "limit", "tag", "search", "saved"]);

  return proxyBackend(`/community/posts${query}`, { token });
}

export async function POST(req) {
  const token = getToken(req);
  if (!token) return unauthorized();

  const formData = await req.formData();
  return proxyBackend("/community/posts", { method: "POST", token, formData });
}
