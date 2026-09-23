import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const isAuthorized = await verifyAdmin();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: "Authorized" });
}
