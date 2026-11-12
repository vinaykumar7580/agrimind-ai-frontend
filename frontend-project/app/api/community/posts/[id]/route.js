import { NextResponse } from "next/server";
import { getToken, isId, proxyBackend, unauthorized } from "../../../../../lib/proxyBackend";

export async function DELETE(req, { params }) {
  const token = getToken(req);
  if (!token) return unauthorized();

  const { id } = await params;
  if (!isId(id)) {
    return NextResponse.json({ success: false, message: "Invalid post id" }, { status: 400 });
  }

  return proxyBackend(`/community/posts/${id}`, { method: "DELETE", token });
}
