import { NextResponse } from "next/server";
import { getToken, isId, proxyBackend, unauthorized } from "../../../../../lib/proxyBackend";

const STATUSES = ["healthy", "treated", "pending"];

export async function PUT(req, { params }) {
  const token = getToken(req);
  if (!token) return unauthorized();

  const { id } = await params;
  const { status } = await req.json();

  if (!isId(id) || !STATUSES.includes(status)) {
    return NextResponse.json({ success: false, message: "Invalid request" }, { status: 400 });
  }

  // The backend reads status as a query parameter.
  return proxyBackend(`/scan/${id}/status?status=${status}`, { method: "PUT", token });
}
